OpenLayers.TileManager = OpenLayers.Class({
    
    /**
     * APIProperty: cacheSize
     * {Number} Number of image elements to keep referenced in this instance's
     * cache for fast reuse. Default is 256.
     */
    cacheSize: 256,

    /**
     * APIProperty: tilesPerFrame
     * {Number} Number of queued tiles to load per frame (see <frameDelay>).
     *     Default is 2.
     */
    tilesPerFrame: 2,

    /**
     * APIProperty: frameDelay
     * {Number} Delay between tile loading frames (see <tilesPerFrame>) in
     *     milliseconds. Default is 16.
     */
    frameDelay: 16,

    /**
     * APIProperty: moveDelay
     * {Number} Delay in milliseconds after a map's move event before loading
     * tiles. Default is 100.
     */
    moveDelay: 100,
    
    /**
     * APIProperty: zoomDelay
     * {Number} Delay in milliseconds after a map's zoomend event before loading
     * tiles. Default is 200.
     */
    zoomDelay: 200,
    
    /**
     * Property: maps
     * {Array(<OpenLayers.Map>)} The maps to manage tiles on.
     */
    maps: null,
    
    /**
     * Property: tileQueueId
     * {Object} The ids of the <drawTilesFromQueue> loop, keyed by map id.
     */
    tileQueueId: null,

    /**
     * Property: tileQueue
     * {Object(Array(<OpenLayers.Tile>))} Tiles queued for drawing, keyed by
     * map id.
     */
    tileQueue: null,
    
    /**
     * Property: tileCache
     * {Object} Cached image elements, keyed by URL.
     */
    tileCache: null,
    
    /**
     * Property: tileCacheIndex
     * {Array(String)} URLs of cached tiles. First entry is the least recently
     *    used.
     */
    tileCacheIndex: null,    
    
    /** 
     * Constructor: OpenLayers.TileManager
     * Constructor for a new <OpenLayers.TileManager> instance.
     * 
     * Parameters:
     * options - {Object} Configuration for this instance.
     */   
    initialize: function(options) {
        OpenLayers.Util.extend(this, options);
        this.maps = [];
        this.tileQueueId = {};
        this.tileQueue = {};
        this.tileCache = {};
        this.tileCacheIndex = [];
    },
    
    /**
     * Method: addMap
     * Binds this instance to a map
     *
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    addMap: function(map) {
        if (this._destroyed || !OpenLayers.Layer.Grid) {
            return;
        }
        this.maps.push(map);
        this.tileQueue[map.id] = [];
        for (var i=0, ii=map.layers.length; i<ii; ++i) {
            this.addLayer({layer: map.layers[i]});
        }
        map.events.on({
            move: this.move,
            zoomend: this.zoomEnd,
            changelayer: this.changeLayer,
            addlayer: this.addLayer,
            preremovelayer: this.removeLayer,
            scope: this
        });
    },
    
    /**
     * Method: removeMap
     * Unbinds this instance from a map
     *
     * Parameters:
     * map - {<OpenLayers.Map>}
     */
    removeMap: function(map) {
        if (this._destroyed || !OpenLayers.Layer.Grid) {
            return;
        }
        window.clearTimeout(this.tileQueueId[map.id]);
        if (map.layers) {
            for (var i=0, ii=map.layers.length; i<ii; ++i) {
                this.removeLayer({layer: map.layers[i]});
            }
        }
        if (map.events) {
            map.events.un({
                move: this.move,
                zoomend: this.zoomEnd,
                changelayer: this.changeLayer,
                addlayer: this.addLayer,
                preremovelayer: this.removeLayer,
                scope: this
            });
        }
        delete this.tileQueue[map.id];
        delete this.tileQueueId[map.id];
        OpenLayers.Util.removeItem(this.maps, map);
    },
    
    /**
     * Method: move
     * Handles the map's move event
     *
     * Parameters:
     * evt - {Object} Listener argument
     */
    move: function(evt) {
        this.updateTimeout(evt.object, this.moveDelay, true);
    },
    
    /**
     * Method: zoomEnd
     * Handles the map's zoomEnd event
     *
     * Parameters:
     * evt - {Object} Listener argument
     */
    zoomEnd: function(evt) {
        this.updateTimeout(evt.object, this.zoomDelay);
    },
    
    /**
     * Method: changeLayer
     * Handles the map's changeLayer event
     *
     * Parameters:
     * evt - {Object} Listener argument
     */
    changeLayer: function(evt) {
        if (evt.property === 'visibility' || evt.property === 'params') {
            this.updateTimeout(evt.object, 0);
        }
    },
    
    /**
     * Method: addLayer
     * Handles the map's addlayer event
     *
     * Parameters:
     * evt - {Object} The listener argument
     */
    addLayer: function(evt) {
        var layer = evt.layer;
        if (layer instanceof OpenLayers.Layer.Grid) {
            layer.events.on({
                addtile: this.addTile,
                refresh: this.handleLayerRefresh,
                retile: this.clearTileQueue,
                scope: this
            });
            var i, j, tile;
            for (i=layer.grid.length-1; i>=0; --i) {
                for (j=layer.grid[i].length-1; j>=0; --j) {
                    tile = layer.grid[i][j];
                    this.addTile({tile: tile});
                    if (tile.url && !tile.imgDiv) {
                        this.manageTileCache({object: tile});
                    }
                }
            }
        }
    },
    
    /**
     * Method: removeLayer
     * Handles the map's preremovelayer event
     *
     * Parameters:
     * evt - {Object} The listener argument
     */
    removeLayer: function(evt) {
        var layer = evt.layer;
        if (layer instanceof OpenLayers.Layer.Grid) {
            this.clearTileQueue({object: layer});
            if (layer.events) {
                layer.events.un({
                    addtile: this.addTile,
                    refresh: this.handleLayerRefresh,
                    retile: this.clearTileQueue,
                    scope: this
                });
            }
            if (layer.grid) {
                var i, j, tile;
                for (i=layer.grid.length-1; i>=0; --i) {
                    for (j=layer.grid[i].length-1; j>=0; --j) {
                        tile = layer.grid[i][j];
                        this.unloadTile({object: tile});
                    }
                }
            }
        }
    },

    /**
     * Method: handleLayerRefresh
     * Clears the cache when a redraw is forced on a layer
     *
     * Parameters:
     * evt - {Object} The listener argument
     */
    handleLayerRefresh: function(evt) {
        var layer = evt.object;
        if (layer.grid) {
            var i, j, tile;
            for (i=layer.grid.length-1; i>=0; --i) {
                for (j=layer.grid[i].length-1; j>=0; --j) {
                    tile = layer.grid[i][j];
                    OpenLayers.Util.removeItem(this.tileCacheIndex, tile.url);
                    delete this.tileCache[tile.url];
                }
            }
        }
    },
    
    /**
     * Method: updateTimeout
     * Applies the <moveDelay> or <zoomDelay> to the <drawTilesFromQueue> loop,
     * and schedules more queue processing after <frameDelay> if there are still
     * tiles in the queue.
     *
     * Parameters:
     * map - {<OpenLayers.Map>} The map to update the timeout for
     * delay - {Number} The delay to apply
     * nice - {Boolean} If true, the timeout function will only be created if
     *     the tilequeue is not empty. This is used by the move handler to
     *     avoid impacts on dragging performance. For other events, the tile
     *     queue may not be populated yet, so we need to set the timer
     *     regardless of the queue size.
     */
    updateTimeout: function(map, delay, nice) {
        window.clearTimeout(this.tileQueueId[map.id]);
        var tileQueue = this.tileQueue[map.id];
        if (!nice || tileQueue.length) {
            this.tileQueueId[map.id] = window.setTimeout(
                OpenLayers.Function.bind(function() {
                    this.drawTilesFromQueue(map);
                    if (tileQueue.length) {
                        this.updateTimeout(map, this.frameDelay);
                    }
                }, this), delay
            );
        }
    },
    
    /**
     * Method: addTile
     * Listener for the layer's addtile event
     *
     * Parameters:
     * evt - {Object} The listener argument
     */
    addTile: function(evt) {
        if (evt.tile instanceof OpenLayers.Tile.Image) {
          if (!evt.tile.layer.singleTile) {
            evt.tile.events.on({
                beforedraw: this.queueTileDraw,
                beforeload: this.manageTileCache,
                loadend: this.addToCache,
                unload: this.unloadTile,
                scope: this
            });        
          }
        } else {
            // Layer has the wrong tile type, so don't handle it any longer
            this.removeLayer({layer: evt.tile.layer});
        }
    },
    
    /**
     * Method: unloadTile
     * Listener for the tile's unload event
     *
     * Parameters:
     * evt - {Object} The listener argument
     */
    unloadTile: function(evt) {
        var tile = evt.object;
        tile.events.un({
            beforedraw: this.queueTileDraw,
            beforeload: this.manageTileCache,
            loadend: this.addToCache,
            unload: this.unloadTile,
            scope: this
        });
        OpenLayers.Util.removeItem(this.tileQueue[tile.layer.map.id], tile);
    },
    
    /**
     * Method: queueTileDraw
     * Adds a tile to the queue that will draw it.
     *
     * Parameters:
     * evt - {Object} Listener argument of the tile's beforedraw event
     */
    queueTileDraw: function(evt) {
        var tile = evt.object;
        var queued = false;
        var layer = tile.layer;
        var url = layer.getURL(tile.bounds);
        var img = this.tileCache[url];
        if (img && img.className !== 'olTileImage') {
            // cached image no longer valid, e.g. because we're olTileReplacing
            delete this.tileCache[url];
            OpenLayers.Util.removeItem(this.tileCacheIndex, url);
            img = null;
        }
        // queue only if image with same url not cached already
        if (layer.url && (layer.async || !img)) {
            // add to queue only if not in queue already
            var tileQueue = this.tileQueue[layer.map.id];
            if (!~OpenLayers.Util.indexOf(tileQueue, tile)) {
                tileQueue.push(tile);
            }
            queued = true;
        }
        return !queued;
    },
    
    /**
     * Method: drawTilesFromQueue
     * Draws tiles from the tileQueue, and unqueues the tiles
     */
    drawTilesFromQueue: function(map) {
        var tileQueue = this.tileQueue[map.id];
        var limit = this.tilesPerFrame;
        var animating = map.zoomTween && map.zoomTween.playing;
        while (!animating && tileQueue.length && limit) {
            tileQueue.shift().draw(true);
            --limit;
        }
    },
    
    /**
     * Method: manageTileCache
     * Adds, updates, removes and fetches cache entries.
     *
     * Parameters:
     * evt - {Object} Listener argument of the tile's beforeload event
     */
    manageTileCache: function(evt) {
        var tile = evt.object;
        var img = this.tileCache[tile.url];
        if (img) {
          // if image is on its layer's backbuffer, remove it from backbuffer
          if (img.parentNode &&
                  OpenLayers.Element.hasClass(img.parentNode, 'olBackBuffer')) {
              img.parentNode.removeChild(img);
              img.id = null;
          }
          // only use image from cache if it is not on a layer already
          if (!img.parentNode) {
              img.style.visibility = 'hidden';
              img.style.opacity = 0;
              tile.setImage(img);
              // LRU - move tile to the end of the array to mark it as the most
              // recently used
              OpenLayers.Util.removeItem(this.tileCacheIndex, tile.url);
              this.tileCacheIndex.push(tile.url);
          }
        }
    },
    
    /**
     * Method: addToCache
     *
     * Parameters:
     * evt - {Object} Listener argument for the tile's loadend event
     */
    addToCache: function(evt) {
        var tile = evt.object;
        if (!this.tileCache[tile.url]) {
            if (!OpenLayers.Element.hasClass(tile.imgDiv, 'olImageLoadError')) {
                if (this.tileCacheIndex.length >= this.cacheSize) {
                    delete this.tileCache[this.tileCacheIndex[0]];
                    this.tileCacheIndex.shift();
                }
                this.tileCache[tile.url] = tile.imgDiv;
                this.tileCacheIndex.push(tile.url);
            }
        }
    },

    /**
     * Method: clearTileQueue
     * Clears the tile queue from tiles of a specific layer
     *
     * Parameters:
     * evt - {Object} Listener argument of the layer's retile event
     */
    clearTileQueue: function(evt) {
        var layer = evt.object;
        var tileQueue = this.tileQueue[layer.map.id];
        for (var i=tileQueue.length-1; i>=0; --i) {
            if (tileQueue[i].layer === layer) {
                tileQueue.splice(i, 1);
            }
        }
    },
    
    /**
     * Method: destroy
     */
    destroy: function() {
        for (var i=this.maps.length-1; i>=0; --i) {
            this.removeMap(this.maps[i]);
        }
        this.maps = null;
        this.tileQueue = null;
        this.tileQueueId = null;
        this.tileCache = null;
        this.tileCacheIndex = null;
        this._destroyed = true;
    }

});


Ext.namespace("gxp.plugins");

gxp.plugins.StatFeatureManager = Ext.extend(gxp.plugins.Tool, {
    
    ptype: "gxp_statfeaturemanager",
    featureStore: null,
    store: null,
    active : true,

    constructor: function(config) {
        this.addEvents(
            "clearfeatures"
        );
        gxp.plugins.StatFeatureManager.superclass.constructor.apply(this, arguments);        
    },
    init: function(target) {
        // console.log(target);
        // this.loadFeatures();
    },
    activate: function() {},
    deactivate: function() {},
    getStore: function(){
        return this.store;
    },
    getPageExtent: function() {},
    setFeatureStore: function(filter, autoLoad) {
        // console.log(filter);
        var myObj = {
            filterdata : filter
        };

        var myMask = new Ext.LoadMask(Ext.getCmp('stattable').body, {msg:"Please wait..."});
        myMask.show();
        Ext.getCmp('stattable').expand();

        Ext.Ajax.request({
            url: '../../geoapi/floodrisk/',
            // timeout: this.timeout,
            method: 'POST', 
            params: Ext.encode({'spatialfilter':filter}),
            headers: {"Content-Type": "application/json"},
            success: function(response) {
                myMask.hide();
                // console.log(response);
                this.store = Ext.decode(response.responseText);
                // console.log(this.store);
                var tpl = new Ext.Template(
                    '<br/>',
                    '<table>',
                     //header
                        '<tr vertical-align: middle;">',
                            '<td colspan=4></td>',
                            '<td colspan=3 style="padding: 10px;background-color:#CCCCCC;border:1px solid;" align="center">Risk</td>',
                        '</tr>',
                        '<tr vertical-align: middle;">',
                            '<td style="border-left:0px solid !important;"></td>',
                            '<td style="border-left:0px solid !important;"></td>',
                            '<td align="center" style="background-color:#CCCCCC;border:1px solid;">Total</td>',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">all risk</td>',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">High</td>',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">Moderate</td>',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">Low</td>',
                        '</tr>',

                        // floodrisk exposure
                        '<tr>',
                            '<td rowspan=4 style="padding: 5px;background-color:#CCCCCC;border:1px solid;" align="left;">Flood Risk</td>',
                            '<td rowspan=2 style="padding: 5px;background-color:#CCCCCC;border:1px solid;" align="left;">Population</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{Population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{total_risk_population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{high_risk_population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{med_risk_population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{low_risk_population}</td>',
                        '</tr>',
                        '<tr>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_total_risk_population}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_high_risk_population}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_med_risk_population}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_low_risk_population}%</td>',
                        '</tr>',


                        '<tr>',
                            '<td rowspan=2 style="padding: 5px; background-color:#CCCCCC;border:1px solid;" align="left">Area(km2)</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{Area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{total_risk_area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{high_risk_area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{med_risk_area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{low_risk_area}</td>',
                        '</tr>',
                        '<tr>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_total_risk_area}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_high_risk_area}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_med_risk_area}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_low_risk_area}%</td>',
                        '</tr>',

                        '<tr>',
                            '<td rowspan=4 style="padding: 5px;background-color:#CCCCCC;border:1px solid;" align="left;">Avalanche Risk</td>',
                            '<td rowspan=2 style="padding: 5px;background-color:#CCCCCC;border:1px solid;" align="left;">Population</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{Population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{total_ava_population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{high_ava_population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{med_ava_population}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{low_ava_population}</td>',
                        '</tr>',
                        '<tr>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_total_ava_population}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_high_ava_population}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_med_ava_population}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_low_ava_population}%</td>',
                        '</tr>',


                        '<tr>',
                            '<td rowspan=2 style="padding: 5px; background-color:#CCCCCC;border:1px solid;" align="left">Area(km2)</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{Area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{total_ava_area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{high_ava_area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{med_ava_area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{low_ava_area}</td>',
                        '</tr>',
                        '<tr>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_total_ava_area}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_high_ava_area}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_med_ava_area}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{percent_low_ava_area}%</td>',
                        '</tr>',
                    '</table><br/>',

                    '<table>',
                     //header
                        '<tr vertical-align: middle;">',
                            '<td rowspan=2 style="border-left:0px solid !important;"></td>',
                            '<td rowspan=2 align="center" style="background-color:#CCCCCC;border:1px solid;"># Settlements</td>',
                            '<td colspan=2 style="padding: 10px;background-color:#CCCCCC;border:1px solid;" align="center">Built-Up Area</td>',
                            '<td colspan=2 style="padding: 10px;background-color:#CCCCCC;border:1px solid;" align="center">Irrigated Agg Area</td>',
                        '</tr>',
                        '<tr vertical-align: middle;">',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">Pop</td>',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">Area(km2)</td>',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">Pop</td>',
                            '<td style="padding: 10px; background-color:#CCCCCC;border:1px solid;" align="center">Area(km2)</td>',
                        '</tr>',

                        '<tr>',
                            '<td rowspan=2 style="padding: 5px;background-color:#CCCCCC;border:1px solid;" align="left;">Total</td>',
                            '<td rowspan=2 style="padding: 5px;border:1px solid;" align="right">{settlements}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{built_up_pop}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{built_up_area}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{irrigated_agricultural_land_pop}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{irrigated_agricultural_land_area}</td>',
                        '</tr>',
                        '<tr>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">100%</td>',
                        '</tr>',


                        '<tr>',
                            '<td rowspan=2 style="padding: 5px; background-color:#CCCCCC;border:1px solid;" align="left">Flood Risk Exposure</td>',
                            '<td rowspan=2 style="padding: 5px;border:1px solid;" align="right">{settlements_at_risk}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{built_up_pop_risk}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{built_up_area_risk}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{irrigated_agricultural_land_pop_risk}</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{irrigated_agricultural_land_area_risk}</td>',
                        '</tr>',
                        '<tr>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{precent_built_up_pop_risk}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{precent_built_up_area_risk}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{precent_irrigated_agricultural_land_pop_risk}%</td>',
                            '<td style="padding: 5px;border:1px solid;" align="right">{precent_irrigated_agricultural_land_area_risk}%</td>',
                        '</tr>',
                    '</table><br/>'
                );

                tpl.overwrite(Ext.getCmp('statGrid').body, this.store);
                Ext.getCmp('statGrid').body.highlight('#c3daf9', {block:true});

                // Ext.getCmp('statGrid').setSource(this.store);
                // console.log(Ext.getCmp('statGrid'));
            },
            failure: function(response) {
                myMask.hide();
                this.fireEvent("printexception", this, response);
            },
            // params: this.initialConfig.baseParams,
            scope: this
        });
    },
    loadFeatures: function(filter, callback, scope) {
        if (this.fireEvent("beforequery", this, filter, callback, scope) !== false) {
            this.setFeatureStore();
        }
    },
    clearFeatures: function() {}

});
Ext.preg(gxp.plugins.StatFeatureManager.prototype.ptype, gxp.plugins.StatFeatureManager);

var _storeCalc = new gxp.plugins.StatFeatureManager();


Ext.namespace("gxp.plugins");
gxp.plugins.addFeatureFilter = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_zoomtoextent */
    ptype: "gxp_addFeatureFilter",
    
    /** api: config[buttonText]
     *  ``String`` Text to show next to the zoom button
     */
     
    /** api: config[menuText]
     *  ``String``
     *  Text for zoom menu item (i18n).
     */
    menuText: "Add this feature to the filter list",

    /** api: config[tooltip]
     *  ``String``
     *  Text for zoom action tooltip (i18n).
     */
    tooltip: "Add this feature to the filter list",
    
    /** api: config[extent]
     *  ``Array | OpenLayers.Bounds``
     *  The target extent.  If none is provided, the map's visible extent will 
     *  be used.
     */
    extent: null,
    
    /** api: config[closest]
     *  ``Boolean`` Find the zoom level that most closely fits the specified
     *  extent. Note that this may result in a zoom that does not exactly
     *  contain the entire extent.  Default is true.
     */
    closest: true,
    
    /** private: property[iconCls]
     */
    iconCls: "gxp-icon-addfeature",
    
    /** api: config[closest]
     *  ``Boolean`` Find the zoom level that most closely fits the specified
     *  extent. Note that this may result in a zoom that does not exactly
     *  contain the entire extent.  Default is true.
     */
    closest: true,
    
    /** private: method[constructor]
     */
    constructor: function(config) {
        gxp.plugins.addFeatureFilter.superclass.constructor.apply(this, arguments);
        if (this.extent instanceof Array) {
            this.extent = OpenLayers.Bounds.fromArray(this.extent);
        }
    },

    /** api: method[addActions]
     */
    addActions: function() {
        return gxp.plugins.addFeatureFilter.superclass.addActions.apply(this, [{
            text: this.buttonText,
            menuText: this.menuText,
            iconCls: this.iconCls,
            tooltip: this.tooltip,
            handler: function() {
                var layerx = this.target.tools[this.featureManager].featureLayer;
                console.log(layerx.selectedFeatures[0].geometry);

                var data = new OpenLayers.Feature.Vector(layerx.selectedFeatures[0].geometry, {
                    fid: layerx.selectedFeatures[0].fid
                });

                data.attributes = {
                    featureid: layerx.selectedFeatures[0].fid,
                    type: 'Layer Feature'
                };

                // console.log(point1);

                var map = this.target.mapPanel.map;
                var extent = typeof this.extent == "function" ? this.extent() : this.extent;
                // console.log(map.getLayersByName('Filter Layer'));
                map.getLayersByName('Filter Layer')[0].addFeatures(data);
            },
            scope: this
        }]);
    }
});

Ext.preg(gxp.plugins.addFeatureFilter.prototype.ptype, gxp.plugins.addFeatureFilter);

