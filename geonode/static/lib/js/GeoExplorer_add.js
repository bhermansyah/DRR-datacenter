Ext.apply(Ext.util.Format, {
    stripStylesRe: /(?:<style.*?>)((\n|\r|.)*?)(?:<\/style>)/ig,

    stripStyles: function(v){
        return !v ? v : String(v).replace(this.stripStylesRe, "");
    },

    toMega : function(size) {
        if (size < 1000) {
            return size + "";
        } else if (size < 1000000) {
            return (Math.round(((size*10) / 1000))/10) + " K";
        } else {
            return (Math.round(((size*10) / 1000000))/10) + " M";
        }
    },

    toNumberCustom : function(v) {
        v = (Math.round((v-0)*100))/100;
        v = (v == Math.floor(v)) ? v + "" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);
        v = String(v);
        var ps = v.split('.'),
            whole = ps[0],
            sub = ps[1] ? '.'+ ps[1] : '',
            r = /(\d+)(\d{3})/;
        while (r.test(whole)) {
            whole = whole.replace(r, '$1' + ',' + '$2');
        }
        v = whole + sub;
        if (v.charAt(0) == '-') {
            return '-$' + v.substr(1);
        }
        return "" +  v;
    },

});

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
    EQStore: null,
    accessibilityStore: null,
    active : true,
    filter : [],
    adminCode: null,
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
    setAccessibilityStore: function(filter, flag, code){
        var myObj = {
            filterdata : filter
        };
        var tpl = new Ext.Template('Please Wait ...');
        tpl.overwrite(Ext.getCmp('accessibilitiesView').body, {});
        Ext.Ajax.request({
            url: '../../geoapi/getaccessibilities/',
            method: 'POST', 
            params: Ext.encode({'spatialfilter':filter, 'flag':flag,'code':code}),
            headers: {"Content-Type": "application/json"},
            success: function(response) {
                this.accessibilityStore = Ext.decode(response.responseText);
                var tpl = new Ext.Template(
                    '<div class="statisticsPanel">',
                        '<ul>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">GSM / cell phone Coverage</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="left">Population with GSM Coverage</td><td style="padding: 5px;" align="right">{pop_on_gsm_coverage:toMega}</td></tr>',
                                            '<tr><td style="padding: 5px;" align="left">Area with GSM Coverage (km2)</td><td style="padding: 5px;" align="right">{area_on_gsm_coverage:toMega}</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To nearest airport</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__near_airp:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__near_airp:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To nearest health facilities tier 1</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__near_hlt1:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__near_hlt1:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To nearest health facilities tier 2</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__near_hlt2:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__near_hlt2:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To nearest health facilities tier 3</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__near_hlt3:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__near_hlt3:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To nearest health facilities tier all</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__near_hltall:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__near_hltall:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To its province capital</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__itsx_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__itsx_prov:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To nearest province capital</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__near_prov:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__near_prov:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1 align="center">To nearest district capital</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td style="padding: 5px;" align="center">Time</td><td style="padding: 5px;" align="right">Population</td></tr>',
                                            '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr style="background:rgba(185,237,254,0.4)"><td style="padding: 5px;" align="left">< 1 h</td><td style="padding: 5px;" align="right">{l1_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(172,249,217,0.4)"><td style="padding: 5px;" align="left">< 2 h</td><td style="padding: 5px;" align="right">{l2_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(123,233,187,0.4)"><td style="padding: 5px;" align="left">< 3 h</td><td style="padding: 5px;" align="right">{l3_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(247,250,173,0.4)"><td style="padding: 5px;" align="left">< 4 h</td><td style="padding: 5px;" align="right">{l4_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(252,234,168,0.4)"><td style="padding: 5px;" align="left">< 5 h</td><td style="padding: 5px;" align="right">{l5_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(248,192,94,0.4)"><td style="padding: 5px;" align="left">< 6 h</td><td style="padding: 5px;" align="right">{l6_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,153,110,0.4)"><td style="padding: 5px;" align="left">< 7 h</td><td style="padding: 5px;" align="right">{l7_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(251,86,49,0.4)"><td style="padding: 5px;" align="left">< 8 h</td><td style="padding: 5px;" align="right">{l8_h__near_dist:toMega}</td></tr>',
                                            '<tr style="background:rgba(254,20,3,0.4)"><td style="padding: 5px;" align="left">> 8 h</td><td style="padding: 5px;" align="right">{g8_h__near_dist:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            
                            
                        '</ul>',
                    '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>' 
                );
                tpl.overwrite(Ext.getCmp('accessibilitiesView').body, this.accessibilityStore);
                Ext.getCmp('accessibilitiesView').body.highlight('#c3daf9', {block:true});
            }
        });    
    },
    setEarthQuakeFeatureStore: function(filter, flag, code, event_code, title, date_custom){
        var myObj = {
            filterdata : filter
        };
        var tpl = new Ext.Template('Please Wait ...');
        tpl.overwrite(Ext.getCmp('eqView').body, {});

        Ext.Ajax.request({
            url: '../../geoapi/earthquakestat/',
            method: 'POST', 
            params: Ext.encode({'spatialfilter':filter, 'flag':flag,'code':code,'event_code':event_code }),
            headers: {"Content-Type": "application/json"},
            success: function(response) {
                // myMaskEQ.hide();
                this.EQStore = Ext.decode(response.responseText);
                if (this.EQStore.message){
                    var tplEarthQuake = new Ext.Template(
                        '<div class="statisticsPanel">',
                            '<ul>',
                                '<li>',
                                    '<div class="w3-card-4">',
                                        '<header class="w3-container w3-blue">',
                                          '<h1 align="center">{message}</h1>',
                                        '</header>',
                                    '</div>',
                                '</li>',
                            '</ul>',
                        '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>' 
                    );
                } else {
                    var tplEarthQuake = new Ext.Template(
                        '<div class="statisticsPanel">',
                            '<ul>',
                                '<li>',
                                    '<div class="w3-card-4">',
                                        '<header class="w3-container w3-blue">',
                                          '<h1 align="center">'+title+'</h1>',
                                          '<h1 align="center">'+date_custom+'</h1>',
                                        '</header>',
                                        '<div class="w3-container">',
                                            '<table style="width:100%"">',
                                                '<tr><td colspan="2" align="center" style="padding: 5px;">Mercali Intensity Scale</td><td style="padding: 5px;" align="center">Population</td><td style="padding: 5px;" align="right">Settlements</td></tr>',
                                                '<tr><td colspan="4"><div class="lineCustom4Table"></div></td></tr>',
                                                '<tr bgcolor="#d20003"><td style="padding: 5px;" align="left">X+</td><td style="padding: 5px;" align="left">Extreme</td><td style="padding: 5px;" align="center">{pop_shake_extreme:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_extreme:toMega}</td></tr>',
                                                '<tr bgcolor="#ff1f00"><td style="padding: 5px;" align="left">IX</td><td style="padding: 5px;" align="left">Violent</td><td style="padding: 5px;" align="center">{pop_shake_violent:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_violent:toMega}</td></tr>',
                                                '<tr bgcolor="#fd6500"><td style="padding: 5px;" align="left">VIII</td><td style="padding: 5px;" align="left">Severe</td><td style="padding: 5px;" align="center">{pop_shake_severe:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_severe:toMega}</td></tr>',
                                                '<tr bgcolor="#ffb700"><td style="padding: 5px;" align="left">VII</td><td style="padding: 5px;" align="left">Very-Strong</td><td style="padding: 5px;" align="center">{pop_shake_verystrong:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_verystrong:toMega}</td></tr>',
                                                '<tr bgcolor="#fcf109"><td style="padding: 5px;" align="left">VI</td><td style="padding: 5px;" align="left">Strong</td><td style="padding: 5px;" align="center">{pop_shake_strong:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_strong:toMega}</td></tr>',
                                                '<tr bgcolor="#b1ff55"><td style="padding: 5px;" align="left">V</td><td style="padding: 5px;" align="left">Moderate</td><td style="padding: 5px;" align="center">{pop_shake_moderate:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_moderate:toMega}</td></tr>',
                                                '<tr bgcolor="#7cfddf"><td style="padding: 5px;" align="left">IV</td><td style="padding: 5px;" align="left">Light</td><td style="padding: 5px;" align="center">{pop_shake_light:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_light:toMega}</td></tr>',
                                                '<tr bgcolor="#c4ceff"><td style="padding: 5px;" align="left">II-III</td><td style="padding: 5px;" align="left">Weak</td><td style="padding: 5px;" align="center">{pop_shake_weak:toMega}</td><td style="padding: 5px;" align="right">{settlement_shake_weak:toMega}</td></tr>',
                                            '</table>',   
                                        '</div>',
                                    '</div>',
                                '</li>',
                            '</ul>',
                        '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>' 
                    );
                }
                tplEarthQuake.overwrite(Ext.getCmp('eqView').body, this.EQStore);
                Ext.getCmp('eqView').body.highlight('#c3daf9', {block:true});
            }
        });    
    },
    setFeatureStore: function(filter, flag, code) {
        // console.log(Ext.getCmp('statContainer'));
        var myObj = {
            filterdata : filter
        };
        Ext.getCmp('statContainer').setActiveTab('floodForecastView');
        Ext.getCmp('statContainer').setActiveTab('floodriskView');
        Ext.getCmp('statContainer').setActiveTab('avalancheForecastView');
        Ext.getCmp('statContainer').setActiveTab('avalancheView');
        Ext.getCmp('statContainer').setActiveTab('eqView');
        Ext.getCmp('statContainer').setActiveTab('accessibilitiesView');
        Ext.getCmp('statContainer').setActiveTab('baselineView');

        var tpl = new Ext.Template('Please Wait ...');
        tpl.overwrite(Ext.getCmp('baselineView').body, {});
        tpl.overwrite(Ext.getCmp('floodriskView').body, {});
        tpl.overwrite(Ext.getCmp('floodForecastView').body, {});
        tpl.overwrite(Ext.getCmp('avalancheView').body, {});
        tpl.overwrite(Ext.getCmp('avalancheForecastView').body, {});
        

        Ext.Ajax.request({
            url: '../../geoapi/floodrisk/',
            // timeout: this.timeout,
            method: 'POST', 
            params: Ext.encode({'spatialfilter':filter, 'flag':flag,'code':code}),
            headers: {"Content-Type": "application/json"},
            success: function(response) {
                this.store = Ext.decode(response.responseText);
                
                var tplBaseLine = new Ext.XTemplate(
                    '<div class="statisticsPanel">',
                        '<ul>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Population</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{Population:toMega}</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">Barren Land</div><div style="float:right;">{barren_land_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Built-up</div><div style="float:right;">{built_up_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Fruit trees</div><div style="float:right;">{fruit_trees_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Irrigated Agg land</div><div style="float:right;">{irrigated_agricultural_land_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Permanent Snow</div><div style="float:right;">{permanent_snow_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Rainfeld Agg land</div><div style="float:right;">{rainfed_agricultural_land_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Rangeland</div><div style="float:right;">{rangeland_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Sand cover</div><div style="float:right;">{sandcover_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Vineyards</div><div style="float:right;">{vineyards_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Water body and marshland</div><div style="float:right;">{water_body_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Forest and shrubs</div><div style="float:right;">{forest_pop:toMega}</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">', //647625 43689
                                      '<h1>Area (km2)</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{Area:toMega}</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">Barren Land</div><div style="float:right;">{barren_land_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Built-up</div><div style="float:right;">{built_up_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Fruit trees</div><div style="float:right;">{fruit_trees_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Irrigated Agg land</div><div style="float:right;">{irrigated_agricultural_land_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Permanent Snow</div><div style="float:right;">{permanent_snow_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Rainfeld Agg land</div><div style="float:right;">{rainfed_agricultural_land_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Rangeland</div><div style="float:right;">{rangeland_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Sand cover</div><div style="float:right;">{sandcover_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Vineyards</div><div style="float:right;">{vineyards_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Water body and marshland</div><div style="float:right;">{water_body_area:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Forest and shrubs</div><div style="float:right;">{forest_area:toMega}</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Settlements</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{settlements:toNumberCustom}</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Road (km)</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_road_base:toMega}</div></p><br/>',                                    
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">Highway</div><div style="float:right;">{highway_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Primary</div><div style="float:right;">{primary_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Secondary</div><div style="float:right;">{secondary_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Tertiary</div><div style="float:right;">{tertiary_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Residential</div><div style="float:right;">{residential_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Track</div><div style="float:right;">{track_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Path</div><div style="float:right;">{path_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">River Crossing</div><div style="float:right;">{river_crossing_road_base:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Bridge</div><div style="float:right;">{bridge_road_base:toMega}</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Health Facilities</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_health_base}</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<tpl if="h1_health_base &gt; 0">',
                                            '<p><div style="float:left;">Regional / National Hospital (H1)</div><div style="float:right;">{h1_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="h2_health_base &gt; 0">',
                                            '<p><div style="float:left;">Provincial Hospital (H2)</div><div style="float:right;">{h2_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="h3_health_base &gt; 0">',
                                            '<p><div style="float:left;">District Hospital (H3)</div><div style="float:right;">{h3_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="sh_health_base &gt; 0">',
                                            '<p><div style="float:left;">Special Hospital (SH)</div><div style="float:right;">{sh_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="rh_health_base &gt; 0">',
                                            '<p><div style="float:left;">Rehabilitation Center (RH)</div><div style="float:right;">{rh_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="mh_health_base &gt; 0">',
                                            '<p><div style="float:left;">Maternity Home (MH)</div><div style="float:right;">{mh_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="datc_health_base &gt; 0">',
                                            '<p><div style="float:left;">Drug Addicted Treatment Center</div><div style="float:right;">{datc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="tbc_health_base &gt; 0">',
                                            '<p><div style="float:left;">TB Control Center (TBC)</div><div style="float:right;">{tbc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="mntc_health_base &gt; 0">',    
                                            '<p><div style="float:left;">Mental Clinic / Hospital</div><div style="float:right;">{mntc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="chc_health_base &gt; 0">',  
                                            '<p><div style="float:left;">Comprehensive Health Center (CHC)</div><div style="float:right;">{chc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="bhc_health_base &gt; 0">',      
                                            '<p><div style="float:left;">Basic Health Center (BHC)</div><div style="float:right;">{bhc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="dcf_health_base &gt; 0">', 
                                            '<p><div style="float:left;">Day Care Feeding</div><div style="float:right;">{dcf_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="mch_health_base &gt; 0">', 
                                            '<p><div style="float:left;">MCH Clinic M1 or M2 (MCH)</div><div style="float:right;">{mch_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="shc_health_base &gt; 0">', 
                                            '<p><div style="float:left;">Sub Health Center (SHC)</div><div style="float:right;">{shc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="ec_health_base &gt; 0">', 
                                            '<p><div style="float:left;">Eye Clinic / Hospital</div><div style="float:right;">{ec_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="pyc_health_base &gt; 0">', 
                                            '<p><div style="float:left;">Physiotherapy Center</div><div style="float:right;">{pyc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="pic_health_base &gt; 0">', 
                                            '<p><div style="float:left;">Private Clinic</div><div style="float:right;">{pic_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="mc_health_base &gt; 0">',
                                            '<p><div style="float:left;">Malaria Center (MC)</div><div style="float:right;">{mc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="moph_health_base &gt; 0">',
                                            '<p><div style="float:left;">MoPH National</div><div style="float:right;">{moph_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="epi_health_base &gt; 0">',
                                            '<p><div style="float:left;">EPI Fixed Center (EPI)</div><div style="float:right;">{epi_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="sfc_health_base &gt; 0">',
                                            '<p><div style="float:left;">Supplementary Feeding Center (SFC)</div><div style="float:right;">{sfc_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="mht_health_base &gt; 0">',
                                            '<p><div style="float:left;">Mobile Health Team (MHT)</div><div style="float:right;">{mht_health_base}</div></p><br/>',
                                        '</tpl>',
                                        '<tpl if="other_health_base &gt; 0">',
                                            '<p><div style="float:left;">Others</div><div style="float:right;">{other_health_base}</div></p><br/>',  
                                        '</tpl>',                             
                                    '</div>',
                                '</div>',
                            '</li>',
                        '</ul>',
                    '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>'    
                );

                var tplFloodRisk = new Ext.XTemplate(
                    '<div class="statisticsPanel">',
                        '<ul>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Population</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_risk_population:toMega}({percent_total_risk_population}%)</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">High</div><div style="float:right;">{high_risk_population:toMega}({percent_high_risk_population}%)</div></p><br/>',
                                        '<p><div style="float:left;">Moderate</div><div style="float:right;">{med_risk_population:toMega}({percent_med_risk_population}%)</div></p><br/>',
                                        '<p><div style="float:left;">Low</div><div style="float:right;">{low_risk_population:toMega}({percent_low_risk_population}%)</div></p><br/>',       
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">Barren Land</div><div style="float:right;">{barren_land_pop_risk:toMega}({precent_barren_land_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Built-up</div><div style="float:right;">{built_up_pop_risk:toMega}({precent_built_up_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Fruit trees</div><div style="float:right;">{fruit_trees_pop_risk:toMega}({precent_fruit_trees_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Irrigated Agg land</div><div style="float:right;">{irrigated_agricultural_land_pop_risk:toMega}({precent_irrigated_agricultural_land_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Permanent Snow</div><div style="float:right;">{permanent_snow_pop_risk:toMega}({precent_permanent_snow_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Rainfeld Agg land</div><div style="float:right;">{rainfed_agricultural_land_pop_risk:toMega}({precent_rainfed_agricultural_land_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Rangeland</div><div style="float:right;">{rangeland_pop_risk:toMega}({precent_rangeland_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Sand cover</div><div style="float:right;">{sandcover_pop_risk:toMega}({precent_sandcover_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Vineyards</div><div style="float:right;">{vineyards_pop_risk:toMega}({precent_vineyards_pop_risk}%)</div></p><br/>',
                                        // '<p><div style="float:left;">Water body and marshland</div><div style="float:right;">{water_body_pop_risk:toMega}({precent_water_body_pop_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Forest and shrubs</div><div style="float:right;">{forest_pop_risk:toMega}({precent_forest_pop_risk}%)</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">', 
                                      '<h1>Area (km2)</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_risk_area:toMega}({percent_total_risk_area}%)</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">High</div><div style="float:right;">{high_risk_area:toMega}({percent_high_risk_area}%)</div></p><br/>',
                                        '<p><div style="float:left;">Moderate</div><div style="float:right;">{med_risk_area:toMega}({percent_med_risk_area}%)</div></p><br/>',
                                        '<p><div style="float:left;">Low</div><div style="float:right;">{low_risk_area:toMega}({percent_low_risk_area}%)</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">Barren Land</div><div style="float:right;">{barren_land_area_risk:toMega}({precent_barren_land_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Built-up</div><div style="float:right;">{built_up_area_risk:toMega}({precent_built_up_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Fruit trees</div><div style="float:right;">{fruit_trees_area_risk:toMega}({precent_fruit_trees_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Irrigated Agg land</div><div style="float:right;">{irrigated_agricultural_land_area_risk:toMega}({precent_irrigated_agricultural_land_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Permanent Snow</div><div style="float:right;">{permanent_snow_area_risk:toMega}({precent_barren_land_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Rainfeld Agg land</div><div style="float:right;">{rainfed_agricultural_land_area_risk:toMega}({precent_permanent_snow_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Rangeland</div><div style="float:right;">{rangeland_area_risk:toMega}({precent_rangeland_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Sand cover</div><div style="float:right;">{sandcover_area_risk:toMega}({precent_sandcover_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Vineyards</div><div style="float:right;">{vineyards_area_risk:toMega}({precent_vineyards_area_risk}%)</div></p><br/>',
                                        // '<p><div style="float:left;">Water body and marshland</div><div style="float:right;">{water_body_area_risk:toMega}({precent_water_body_area_risk}%)</div></p><br/>',
                                        '<p><div style="float:left;">Forest and shrubs</div><div style="float:right;">{forest_area_risk:toMega}({precent_forest_area_risk}%)</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Settlements</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{settlements_at_risk:toNumberCustom}</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',

                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Mitigated Population</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_risk_mitigated_population:toMega}</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">High</div><div style="float:right;">{high_risk_mitigated_population:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Moderate</div><div style="float:right;">{med_risk_mitigated_population:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Low</div><div style="float:right;">{low_risk_mitigated_population:toMega}</div></p><br/>',       
                                    '</div>',
                                '</div>',
                            '</li>',
                            // '<li>',
                            //     '<div class="w3-card-4">',
                            //         '<header class="w3-container w3-blue">',
                            //           '<h1>Road (KM)</h1>',
                            //         '</header>',

                            //         '<div class="w3-container">',
                            //             '<p><div style="float:left;">Total</div><div style="float:right;">xxx km</div></p><br/>',
                            //         '</div>',
                            //     '</div>',
                            // '</li>',
                            // '<li>',
                            //     '<div class="w3-card-4">',
                            //         '<header class="w3-container w3-blue">',
                            //           '<h1>Health Facilities</h1>',
                            //         '</header>',

                            //         '<div class="w3-container">',
                            //             '<p><div style="float:left;">Total</div><div style="float:right;">xxx</div></p><br/>',
                            //         '</div>',
                            //     '</div>',
                            // '</li>',
                        '</ul>',
                    '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>' 
                );

                var tplAvalancheRisk = new Ext.XTemplate(
                    '<div class="statisticsPanel">',
                        '<ul>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Population</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_ava_population:toMega}({percent_total_ava_population}%)</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">High</div><div style="float:right;">{high_ava_population:toMega}({percent_high_ava_population}%)</div></p><br/>',
                                        '<p><div style="float:left;">Moderate</div><div style="float:right;">{med_ava_population:toMega}({percent_med_ava_population}%)</div></p><br/>',
                                        // '<p><div style="float:left;">Low</div><div style="float:right;">{low_ava_population:toMega}({percent_low_ava_population}%)</div></p><br/>',       
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">', 
                                      '<h1>Area (km2)</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_ava_area:toMega}({percent_total_ava_area}%)</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">High</div><div style="float:right;">{high_ava_area:toMega}({percent_high_ava_area}%)</div></p><br/>',
                                        '<p><div style="float:left;">Moderate</div><div style="float:right;">{med_ava_area:toMega}({percent_med_ava_area}%)</div></p><br/>',
                                        // '<p><div style="float:left;">Low</div><div style="float:right;">{low_ava_area:toMega}({percent_low_ava_area}%)</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            // '<li>',
                            //     '<div class="w3-card-4">',
                            //         '<header class="w3-container w3-blue">',
                            //           '<h1>Settlements</h1>',
                            //         '</header>',

                            //         '<div class="w3-container">',
                            //             '<p><div style="float:left;">Total</div><div style="float:right;">{numbersettlementsatava:toNumberCustom}</div></p><br/>',
                            //         '</div>',
                            //     '</div>',
                            // '</li>',
                            // '<li>',
                            //     '<div class="w3-card-4">',
                            //         '<header class="w3-container w3-blue">',
                            //           '<h1>Road (KM)</h1>',
                            //         '</header>',

                            //         '<div class="w3-container">',
                            //             '<p><div style="float:left;">Total</div><div style="float:right;">xxx km</div></p><br/>',
                            //         '</div>',
                            //     '</div>',
                            // '</li>',
                            // '<li>',
                            //     '<div class="w3-card-4">',
                            //         '<header class="w3-container w3-blue">',
                            //           '<h1>Health Facilities</h1>',
                            //         '</header>',

                            //         '<div class="w3-container">',
                            //             '<p><div style="float:left;">Total</div><div style="float:right;">xxx</div></p><br/>',
                            //         '</div>',
                            //     '</div>',
                            // '</li>',
                        '</ul>',
                    '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>' 
                );
                
                var tplFloodForecast = new Ext.XTemplate(
                    '<div class="statisticsPanel">',
                        '<ul>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Population</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td align="left"></td><td align="center"></td><td align="right"></td></tr>',
                                            '<tr><td align="left"></td><td align="center">Flash Flood</td><td align="right">River Flood</td></tr>',
                                            '<tr><td colspan="3"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr><td align="left">Extreme</td><td align="center" title="low:{flashflood_forecast_extreme_risk_low_pop:toMega}\nmed:{flashflood_forecast_extreme_risk_med_pop:toMega}\nhigh:{flashflood_forecast_extreme_risk_high_pop:toMega}">{flashflood_forecast_extreme_pop:toMega}</td><td align="right" title="low:{riverflood_forecast_extreme_risk_low_pop:toMega}\nmed:{riverflood_forecast_extreme_risk_med_pop:toMega}\nhigh:{riverflood_forecast_extreme_risk_high_pop:toMega}">{riverflood_forecast_extreme_pop:toMega}</td></tr>',
                                            '<tr><td align="left">Very High</td><td align="center" title="low:{flashflood_forecast_veryhigh_risk_low_pop:toMega}\nmed:{flashflood_forecast_veryhigh_risk_med_pop:toMega}\nhigh:{flashflood_forecast_veryhigh_risk_high_pop:toMega}">{flashflood_forecast_veryhigh_pop:toMega}</td><td align="right" title="low:{riverflood_forecast_veryhigh_risk_low_pop:toMega}\nmed:{riverflood_forecast_veryhigh_risk_med_pop:toMega}\nhigh:{riverflood_forecast_veryhigh_risk_high_pop:toMega}">{riverflood_forecast_veryhigh_pop:toMega}</td></tr>',
                                            '<tr><td align="left">High</td><td align="center" title="low:{flashflood_forecast_high_risk_low_pop:toMega}\nmed:{flashflood_forecast_high_risk_med_pop:toMega}\nhigh:{flashflood_forecast_high_risk_high_pop:toMega}">{flashflood_forecast_high_pop:toMega}</td><td align="right" title="low:{riverflood_forecast_high_risk_low_pop:toMega}\nmed:{riverflood_forecast_high_risk_med_pop:toMega}\nhigh:{riverflood_forecast_high_risk_high_pop:toMega}">{riverflood_forecast_high_pop:toMega}</td></tr>',
                                            '<tr><td align="left">Moderate</td><td align="center" title="low:{flashflood_forecast_med_risk_low_pop:toMega}\nmed:{flashflood_forecast_med_risk_med_pop:toMega}\nhigh:{flashflood_forecast_med_risk_high_pop:toMega}">{flashflood_forecast_med_pop:toMega}</td><td align="right" title="low:{riverflood_forecast_med_risk_low_pop:toMega}\nmed:{riverflood_forecast_med_risk_med_pop:toMega}\nhigh:{riverflood_forecast_med_risk_high_pop:toMega}">{riverflood_forecast_med_pop:toMega}</td></tr>',
                                            '<tr><td align="left">Low</td><td align="center" title="low:{flashflood_forecast_low_risk_low_pop:toMega}\nmed:{flashflood_forecast_low_risk_med_pop:toMega}\nhigh:{flashflood_forecast_low_risk_high_pop:toMega}">{flashflood_forecast_low_pop:toMega}</td><td align="right" title="low:{riverflood_forecast_low_risk_low_pop:toMega}\nmed:{riverflood_forecast_low_risk_med_pop:toMega}\nhigh:{riverflood_forecast_low_risk_high_pop:toMega}">{riverflood_forecast_low_pop:toMega}</td></tr>',
                                            // '<tr><td align="left">Very Low</td><td align="center">{flashflood_forecast_verylow_pop:toMega}</td><td align="right">{riverflood_forecast_verylow_pop:toMega}</td></tr>',
                                        '</table>',   
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">', 
                                      '<h1>Area (km2)</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<table style="width:100%"">',
                                            '<tr><td align="left"></td><td align="center"></td><td align="right"></td></tr>',
                                            '<tr><td align="left"></td><td align="center">Flash Flood</td><td align="right">River Flood</td></tr>',
                                            '<tr><td colspan="3"><div class="lineCustom4Table"></div></td></tr>',
                                            '<tr><td align="left">Extreme</td><td align="center">{flashflood_forecast_extreme_area:toMega}</td><td align="right">{riverflood_forecast_extreme_area:toMega}</td></tr>',
                                            '<tr><td align="left">Very High</td><td align="center">{flashflood_forecast_veryhigh_area:toMega}</td><td align="right">{riverflood_forecast_veryhigh_area:toMega}</td></tr>',
                                            '<tr><td align="left">High</td><td align="center">{flashflood_forecast_high_area:toMega}</td><td align="right">{riverflood_forecast_high_area:toMega}</td></tr>',
                                            '<tr><td align="left">Moderate</td><td align="center">{flashflood_forecast_med_area:toMega}</td><td align="right">{riverflood_forecast_med_area:toMega}</td></tr>',
                                            '<tr><td align="left">Low</td><td align="center">{flashflood_forecast_low_area:toMega}</td><td align="right">{riverflood_forecast_low_area:toMega}</td></tr>',
                                            // '<tr><td align="left">Very Low</td><td align="center">{flashflood_forecast_verylow_area:toMega}</td><td align="right">{riverflood_forecast_verylow_area:toMega}</td></tr>',
                                        '</table>',  
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Last Updated</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Flash Flood</div><div style="float:right;">{snowwater_lastupdated}</div></p><br/>',
                                        '<p><div style="float:left;">River Flood</div><div style="float:right;">{riverflood_lastupdated}</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                            // '<li>',
                            //     '<div class="w3-card-4">',
                            //         '<header class="w3-container w3-blue">',
                            //           '<h1>Road (KM)</h1>',
                            //         '</header>',

                            //         '<div class="w3-container">',
                            //             '<p><div style="float:left;">Total</div><div style="float:right;">xxx km</div></p><br/>',
                            //         '</div>',
                            //     '</div>',
                            // '</li>',
                            // '<li>',
                            //     '<div class="w3-card-4">',
                            //         '<header class="w3-container w3-blue">',
                            //           '<h1>Health Facilities</h1>',
                            //         '</header>',

                            //         '<div class="w3-container">',
                            //             '<p><div style="float:left;">Total</div><div style="float:right;">xxx</div></p><br/>',
                            //         '</div>',
                            //     '</div>',
                            // '</li>',
                        '</ul>',
                    '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>' 
                );

                var tplAvalancheForecast = new Ext.XTemplate(
                    '<div class="statisticsPanel">',
                        '<ul>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Population</h1>',
                                    '</header>',
                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Total</div><div style="float:right;">{total_ava_forecast_pop:toMega}</div></p><br/>',
                                        '<p><div class="lineCustom"> </div></p> <br/>',
                                        '<p><div style="float:left;">High</div><div style="float:right;">{ava_forecast_high_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Moderate</div><div style="float:right;">{ava_forecast_med_pop:toMega}</div></p><br/>',
                                        '<p><div style="float:left;">Low</div><div style="float:right;">{ava_forecast_low_pop:toMega}</div></p><br/>',       
                                    '</div>',
                                '</div>',
                            '</li>',
                            '<li>',
                                '<div class="w3-card-4">',
                                    '<header class="w3-container w3-blue">',
                                      '<h1>Last Updated</h1>',
                                    '</header>',

                                    '<div class="w3-container">',
                                        '<p><div style="float:left;">Avalanche Forecast</div><div style="float:right;">{snowwater_lastupdated}</div></p><br/>',
                                        '<p><div style="float:left;">Snow Coverage & Depth</div><div style="float:right;">{snowwater_lastupdated}</div></p><br/>',
                                    '</div>',
                                '</div>',
                            '</li>',
                        '</ul>',
                    '</div><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>' 
                );

                
                tplBaseLine.overwrite(Ext.getCmp('baselineView').body, this.store);
                tplFloodRisk.overwrite(Ext.getCmp('floodriskView').body, this.store);
                tplFloodForecast.overwrite(Ext.getCmp('floodForecastView').body, this.store);
                tplAvalancheRisk.overwrite(Ext.getCmp('avalancheView').body, this.store);
                tplAvalancheForecast.overwrite(Ext.getCmp('avalancheForecastView').body, this.store);

                Ext.getCmp('baselineView').body.highlight('#c3daf9', {block:true});
                Ext.getCmp('floodriskView').body.highlight('#c3daf9', {block:true});
                Ext.getCmp('floodForecastView').body.highlight('#c3daf9', {block:true});
                Ext.getCmp('avalancheView').body.highlight('#c3daf9', {block:true});
                Ext.getCmp('avalancheForecastView').body.highlight('#c3daf9', {block:true});

            },
            failure: function(response) {
                // myMaskBaseLine.hide();
                // myMaskFloodRisk.hide();
                // myMaskAvalancheRisk.hide();
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





// villages inspector modified from getfeatureinfo plugin
Ext.namespace("gxp.plugins");

/** api: constructor
 *  .. class:: WMSGetFeatureInfo(config)
 *
 *    This plugins provides an action which, when active, will issue a
 *    GetFeatureInfo request to the WMS of all layers on the map. The output
 *    will be displayed in a popup.
 */   
gxp.plugins.villageInspector = Ext.extend(gxp.plugins.Tool, {
    
    /** api: ptype = gxp_wmsgetfeatureinfo */
    ptype: "gxp_villageinspector",
    
    /** api: config[outputTarget]
     *  ``String`` Popups created by this tool are added to the map by default.
     */
    outputTarget: "map",

    /** private: property[popupCache]
     *  ``Object``
     */
    popupCache: null,

    /** api: config[infoActionTip]
     *  ``String``
     *  Text for feature info action tooltip (i18n).
     */
    infoActionTip: "Settlement Inspector",

    /** api: config[popupTitle]
     *  ``String``
     *  Title for info popup (i18n).
     */
    popupTitle: "Settlement Inspector",
    
    /** api: config[text]
     *  ``String`` Text for the GetFeatureInfo button (i18n).
     */
    buttonText: "Settlement Inspector",
    
    /** api: config[format]
     *  ``String`` Either "html" or "grid". If set to "grid", GML will be
     *  requested from the server and displayed in an Ext.PropertyGrid.
     *  Otherwise, the html output from the server will be displayed as-is.
     *  Default is "html".
     */
    format: "html",
    
    /** api: config[vendorParams]
     *  ``Object``
     *  Optional object with properties to be serialized as vendor specific
     *  parameters in the requests (e.g. {buffer: 10}).
     */
    
    /** api: config[layerParams]
     *  ``Array`` List of param names that should be taken from the layer and
     *  added to the GetFeatureInfo request (e.g. ["CQL_FILTER"]).
     */
     
    /** api: config[itemConfig]
     *  ``Object`` A configuration object overriding options for the items that
     *  get added to the popup for each server response or feature. By default,
     *  each item will be configured with the following options:
     *
     *  .. code-block:: javascript
     *
     *      xtype: "propertygrid", // only for "grid" format
     *      title: feature.fid ? feature.fid : title, // just title for "html" format
     *      source: feature.attributes, // only for "grid" format
     *      html: text, // responseText from server - only for "html" format
     */

    /** api: method[addActions]
     */
    addActions: function() {
        this.popupCache = {};
        
        var actions = gxp.plugins.villageInspector.superclass.addActions.call(this, [{
            tooltip: this.infoActionTip,
            iconCls: "icon-village-inspector",
            buttonText: this.buttonText,
            toggleGroup: this.toggleGroup,
            enableToggle: true,
            allowDepress: true,
            toggleHandler: function(button, pressed) {
                for (var i = 0, len = info.controls.length; i < len; i++){
                    if (pressed) {
                        info.controls[i].activate();
                    } else {
                        info.controls[i].deactivate();
                    }
                }
             }
        }]);
        var infoButton = this.actions[0].items[0];

        var info = {controls: []};
        var updateInfo = function() {
            // var queryableLayers = this.target.mapPanel.layers.queryBy(function(x){
            //     return x.get("queryable");
            // });
            
            var map = this.target.mapPanel.map;
            var control;
            for (var i = 0, len = info.controls.length; i < len; i++){
                control = info.controls[i];
                control.deactivate();  // TODO: remove when http://trac.openlayers.org/ticket/2130 is closed
                control.destroy();
            }

            info.controls = [];

            // console.log(queryableLayers.first());
            // var tempLayer = queryableLayers.first();


            // queryableLayers.first(function(x){
                var layer = this.target.mapPanel.map.getLayersByName('afg_ppla')[0];
                // console.log(layer);
                var vendorParams = Ext.apply({}, this.vendorParams), param;
                if (this.layerParams) {
                    for (var i=this.layerParams.length-1; i>=0; --i) {
                        param = this.layerParams[i].toUpperCase();
                        vendorParams[param] = layer.params[param];
                    }
                }
                var infoFormat = this.format == "html" ? "text/html" : "application/vnd.ogc.gml";

                var control = new OpenLayers.Control.WMSGetFeatureInfo(Ext.applyIf({
                    url: (typeof layer.url === "string") ? layer.url : layer.url[0],
                    queryVisible: true,
                    layers: [layer],
                    infoFormat: infoFormat,
                    vendorParams: vendorParams,
                    eventListeners: {
                        getfeatureinfo: function(evt) {
                            // console.log(evt);
                            var title = 'test';
                            if (infoFormat == "text/html") {
                                var match = evt.text.match(/<body[^>]*>([\s\S]*)<\/body>/);
                                if (match && !match[1].match(/^\s*$/)) {
                                    this.displayPopup(evt, title, match[1]);
                                }
                            } else if (infoFormat == "text/plain") {
                                this.displayPopup(evt, title, '<pre>' + evt.text + '</pre>');
                            } else if (evt.features && evt.features.length > 0) {
                                this.displayPopup(evt, title, null,  null);
                            }
                        },
                        scope: this
                    }
                }, this.controlOptions));
                map.addControl(control);
                info.controls.push(control);
                if(infoButton.pressed) {
                    control.activate();
                }
            // }, this);

        };
        
        this.target.mapPanel.layers.on("update", updateInfo, this);
        this.target.mapPanel.layers.on("add", updateInfo, this);
        this.target.mapPanel.layers.on("remove", updateInfo, this);
        
        return actions;
    },

    /** private: method[displayPopup]
     * :arg evt: the event object from a 
     *     :class:`OpenLayers.Control.GetFeatureInfo` control
     * :arg title: a String to use for the title of the results section 
     *     reporting the info to the user
     * :arg text: ``String`` Body text.
     */
    displayPopup: function(evt, title, text, featureinfo) {
        var popup;
        var popupKey = evt.xy.x + "." + evt.xy.y;
        featureinfo = featureinfo || {};
        var settlementPoint = new OpenLayers.LonLat(evt.features[0].attributes.pplp_point_x,evt.features[0].attributes.pplp_point_y);
        var settlements = settlementPoint.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));

        if (!(popupKey in this.popupCache)) {
            popup = this.addOutput({
                xtype: "gx_popup",
                title: this.popupTitle,
                layout: "accordion",
                fill: false,
                autoScroll: true,
                // location: evt.xy,
                location: settlements,
                map: this.target.mapPanel,
                width: 600,
                height: 500,
                defaults: {
                    layout: "fit",
                    autoScroll: true,
                    autoHeight: true,
                    autoWidth: true,
                    collapsible: true
                }
            });
            popup.on({                    
                close: (function(key) {
                    return function(panel){
                        delete this.popupCache[key];
                    };
                })(popupKey),
                scope: this
            });
            this.popupCache[popupKey] = popup;
        } else {
            popup = this.popupCache[popupKey];
        }
        var mapPanel = this.target.mapPanel;
        var features = evt.features, config = [];
        if (!text && features) {
            var feature;
            for (var i=0,ii=features.length; i<ii; ++i) {
                feature = features[i];
                // console.log(features);

                config.push(Ext.apply({
                    title: feature.data.name_en ? feature.data.name_en : title,
                    dataCustom : feature.data,
                    items:[{
                        xtype: 'tabpanel',
                        enableTabScroll:true,
                        width: '100%',
                        height: '100%',
                        activeTab: 0,
                        defaults: {autoScroll: true, layout:'fit'},  
                        items:[{
                            title: 'General Information',
                            defaults: {autoScroll: true},  
                            height : 500,
                            style:"height:500px;",
                            html: '<iframe src="../../getOverviewMaps/generalinfo?v='+feature.data.vuid+'" width="100%" height="100%"></iframe>'                        
                        },{
                            title: 'Accessibilities',
                            defaults: {autoScroll: true},  
                            height : 500,
                            style:"height:500px;",
                            html: '<iframe src="../../getOverviewMaps/accessibilityinfo?v='+feature.data.vuid+'" width="100%" height="100%"></iframe>'  
                        },{
                            title: 'Snow Cover and forecasted',
                            defaults: {autoScroll: true},  
                            height : 500,
                            style:"height:500px;",
                            html: '<iframe src="../../getOverviewMaps/snowinfo?v='+feature.data.vuid+'" width="100%" height="100%"></iframe>' 
                        },{
                            title: 'Flood and Forecasted',
                            defaults: {autoScroll: true},  
                            height : 500,
                            style:"height:500px;",
                            html: '<iframe src="../../getOverviewMaps/floodinfo?v='+feature.data.vuid+'" width="100%" height="100%"></iframe>'  
                        },{
                            title: 'Earthquake',
                            defaults: {autoScroll: true},  
                            height : 500,
                            style:"height:500px;",
                            html: '<iframe src="../../getOverviewMaps/earthquakeinfo?v='+feature.data.vuid+'" width="100%" height="100%"></iframe>'  
                        }]
                    }],
                    listeners: {
                        'expand': function(e){
                            var settlementP = new OpenLayers.LonLat(e.dataCustom.pplp_point_x,e.dataCustom.pplp_point_y);
                            var settlement = settlementP.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
                            popup.location = settlement;
                            popup.doLayout();
                            popup.show();
                        },
                        'collapsed': function(e){
                            // popup.unanchorPopup();
                        }
                    }
        
                }));
            }
        } else if (text) {
            config.push(Ext.apply({
                title: title,
                html: text
            }, this.itemConfig));
        }
        popup.add(config);
        popup.doLayout();
    }
    
});

Ext.preg(gxp.plugins.villageInspector.prototype.ptype, gxp.plugins.villageInspector);



// security Statistics Results
var reloadIncidentStatistics = function(sel_type, sel_target, filterlock){
    // console.log(Ext.getCmp('statIncident'));
    // console.log(Ext.getCmp('statIncident').items.getCount());
    for (var i=0;i<Ext.getCmp('statIncident').items.getCount();i++){
        Ext.getCmp('statIncident').items.items[i].show();
    }
    Ext.getCmp('statIncident').items.items[0].show();

    var tpl = new Ext.Template('Please Wait ...');
    tpl.overwrite(Ext.getCmp('typeView').body, {});
    tpl.overwrite(Ext.getCmp('targetView').body, {});
    tpl.overwrite(Ext.getCmp('incidentView').body, {});

    var incidentType = [];
    var incidentTarget = [];
    if (sel_type.getSelections().length>0){
        if (sel_type.selections.length < sel_type.grid.getStore().getTotalCount()){
            sel_type.getSelections().forEach(function(v){
                incidentType.push(v.data.main_type);
            });
        }
    } else {
        incidentType.push('none');
    }

    if (sel_target.getSelections().length>0){
        if (sel_target.selections.length < sel_target.grid.getStore().getTotalCount()){
            sel_target.getSelections().forEach(function(v){
                incidentTarget.push(v.data.main_target);
            });
        }
    } else {
        incidentTarget.push('none');
    }

    // console.log(incidentType,incidentTarget);

    Ext.Ajax.request({
        url: '../../geoapi/sam_params/',
        method: 'POST', 
        params: {'query_type': ['main_type', 'type'], 'start_date': Ext.getCmp('startdt').getValue().format('Y-m-d'),'end_date': Ext.getCmp('enddt').getValue().format('Y-m-d'),'incident_type':incidentType,'incident_target':incidentTarget, 'filterlock':filterlock },
        // headers: {"Content-Type": "application/json"},
        success: function(response) {
            // myMaskEQ.hide();
            var incidentStatTypeStore = Ext.decode(response.responseText);
            

            if (Ext.getCmp('secTooltip') !== undefined) {
                Ext.getCmp('secTooltip').destroy();
            }    

            if (!Ext.getCmp('bd_SAM_panel').hidden){
                new Ext.ToolTip({
                    id: 'secTooltip',
                    target: 'securityTip',
                    html: 'last updated '+incidentStatTypeStore.last_incidentdate_ago+' ago',
                    title: 'Updated Status',
                    autoHide: false,
                    closable: true,
                    draggable:true,
                    anchor: 'left',
                    bodyStyle : 'color:'+incidentStatTypeStore.color_code+';text-shadow: -1px 0 black, 0 1px black, 1px 0 black, 0 -1px black;font-weight:bolder;'
                }).show();
            }
            
            

            var tplIncidentStat = new Ext.XTemplate(
                '<div class="securityPanel">',
                    '<ul>',
                        '<li>',
                            '<div class="w3-card-4">',
                                '<header class="w3-container1 w3-blue">',
                                  '<h1 align="center">Type of Incidents</h1>',
                                '</header>',
                                '<div class="w3-container1">',
                                    '<table style="width:100%">',
                                        '<tr><td align="center" style="padding: 5px;"></td><td style="padding: 5px;" align="center">Incidents</td><td style="padding: 5px;" align="right">Dead</td><td style="padding: 5px;" align="right">Injured</td><td style="padding: 5px;" align="right">Violent</td></tr>',
                                        '<tr><td colspan="5"><div class="lineCustom4Table"></div></td></tr>',
                                        
                                        '<tpl for="objects">',
                                            '<tpl if="this.shouldShowHeader(main_type)">' +
                                                '<tr>'+
                                                    '<td colspan="5" align="left" style="padding: 5px;"><div class="group-header-incidents custom_breakword_100">{[this.showHeader(values.main_type)]}</div></td>'+
                                                    // '<td class="group-header-incidents" style="padding: 5px;" align="right">{[this.showNumberIncidentGroup(values.main_type,"count")]}</td>'+
                                                    // '<td style="padding: 5px;" align="center" class="group-header-incidents">{[this.showNumberIncidentGroup(values.main_type,"dead")]}</td>'+
                                                    // '<td style="padding: 5px;" align="right" class="group-header-incidents">{[this.showNumberIncidentGroup(values.main_type,"injured")]}</td>'+
                                                    // '<td style="padding: 5px;" align="right" class="group-header-incidents">{[this.showNumberIncidentGroup(values.main_type,"violent")]}</td>'+
                                                '</tr>'+
                                            '</tpl>' +
                                            '<tr><td align="left" style="padding: 5px;padding-left: 10px;"><div class="custom_breakword_100">{type}</div></td><td style="padding: 5px;" align="right">{count}</td><td style="padding: 5px;" align="center">{dead}</td><td style="padding: 5px;" align="right">{injured}</td><td style="padding: 5px;" align="right">{violent}</td></tr>',
                                        '</tpl>',
                                        '<tr><td colspan="5"><div class="lineCustom4Table"></div></td></tr>',
                                        '<tr><td align="left" style="padding: 5px;padding-left: 10px;"><div class="group-header-incidents">Total</div></td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_incident}</td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_dead}</td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_injured}</td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_violent}</td></tr>',
                                    '</table>',   
                                '</div>',
                            '</div>',
                        '</li>',
                        '<li>',
                            '<div class="w3-card-4">',
                                '<header class="w3-container w3-blue">',
                                  '<h1>Last Updated</h1>',
                                '</header>',

                                '<div class="w3-container">',
                                    '<p><div style="float:left;">Last incidents</div><div style="float:right;">{last_incidentdate}</div></p><br/>',
                                    '<p><div style="float:left;">Last synchronized</div><div style="float:right;">{last_incidentsync}</div></p><br/>',
                                '</div>',
                            '</div>',
                        '</li>',
                    '</ul>',
                '</div><br/><br/><br/><br/>',
                {
                    shouldShowHeader: function(key){
                        return this.currentKey != key;
                    },
                    showHeader: function(key){
                        this.currentKey = key;
                        return key;
                    },
                    showNumberIncidentGroup: function(key, fieldvalue){
                        var store = sel_type.grid.getStore();
                        var index = store.findExact('main_type',key);   
                        if (typeof(store.getAt(index)) != 'undefined') {
                            return store.getAt(index).get(fieldvalue);
                        }    
                    } 
                }
            );

            tplIncidentStat.overwrite(Ext.getCmp('typeView').body, incidentStatTypeStore);
            Ext.getCmp('typeView').body.highlight('#c3daf9', {block:true});
        }
    });    


    Ext.Ajax.request({
        url: '../../geoapi/sam_params/',
        method: 'POST', 
        params: {'query_type': ['main_target', 'target'], 'start_date': Ext.getCmp('startdt').getValue().format('Y-m-d'),'end_date': Ext.getCmp('enddt').getValue().format('Y-m-d'),'incident_type':incidentType,'incident_target':incidentTarget, 'filterlock':filterlock },
        // headers: {"Content-Type": "application/json"},
        success: function(response) {
            // myMaskEQ.hide();
            var incidentStatTargetStore = Ext.decode(response.responseText);
            var tplIncidentStat = new Ext.XTemplate(
                '<div class="securityPanel">',
                    '<ul>',
                        '<li>',
                            '<div class="w3-card-4">',
                                '<header class="w3-container1 w3-blue">',
                                  '<h1 align="center">Target of Incidents</h1>',
                                '</header>',
                                '<div class="w3-container1">',
                                    '<table style="width:100%;">',
                                        '<tr><td align="center" style="padding: 5px;"></td><td style="padding: 5px;" align="center">Incidents</td><td style="padding: 5px;" align="right">Dead</td><td style="padding: 5px;" align="right">Injured</td><td style="padding: 5px;" align="right">Violent</td></tr>',
                                        '<tr><td colspan="5"><div class="lineCustom4Table"></div></td></tr>',
                                        '<tpl for="objects">',
                                            '<tpl if="this.shouldShowHeader(main_target)">' +
                                                '<tr>'+
                                                    '<td colspan="5" align="left" style="padding: 5px;"><div class="group-header-incidents custom_breakword_100">{[this.showHeader(values.main_target)]}</div></td>'+
                                                    // '<td class="group-header-incidents" style="padding: 5px;" align="right">{[this.showNumberIncidentGroup(values.main_target,"count")]}</td>'+
                                                    // '<td style="padding: 5px;" align="center" class="group-header-incidents">{[this.showNumberIncidentGroup(values.main_target,"dead")]}</td>'+
                                                    // '<td style="padding: 5px;" align="right" class="group-header-incidents">{[this.showNumberIncidentGroup(values.main_target,"injured")]}</td>'+
                                                    // '<td style="padding: 5px;" align="right" class="group-header-incidents">{[this.showNumberIncidentGroup(values.main_target,"violent")]}</td>'+
                                                '</tr>'+
                                            '</tpl>' +
                                            '<tr><td align="left" style="padding: 5px;padding-left: 10px;"><div class="custom_breakword_100">{target}</div></td><td style="padding: 5px;" align="right">{count}</td><td style="padding: 5px;" align="center">{dead}</td><td style="padding: 5px;" align="right">{injured}</td><td style="padding: 5px;" align="right">{violent}</td></tr>',
                                        '</tpl>',
                                        '<tr><td colspan="5"><div class="lineCustom4Table"></div></td></tr>',
                                        '<tr><td align="left" style="padding: 5px;padding-left: 10px;"><div class="group-header-incidents">Total</div></td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_incident}</td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_dead}</td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_injured}</td><td style="padding: 5px;" align="right" class="group-header-incidents">{total_violent}</td></tr>',
                                    '</table>',   
                                '</div>',
                            '</div>',
                        '</li>',
                        '<li>',
                            '<div class="w3-card-4">',
                                '<header class="w3-container w3-blue">',
                                  '<h1>Last Updated</h1>',
                                '</header>',

                                '<div class="w3-container">',
                                    '<p><div style="float:left;">Last incidents</div><div style="float:right;">{last_incidentdate}</div></p><br/>',
                                    '<p><div style="float:left;">Last synchronized</div><div style="float:right;">{last_incidentsync}</div></p><br/>',
                                '</div>',
                            '</div>',
                        '</li>',
                    '</ul>',
                '</div><br/><br/><br/><br/>',
                {
                    shouldShowHeader: function(key){
                        return this.currentKey != key;
                    },
                    showHeader: function(key){
                        this.currentKey = key;
                        return key;
                    },
                    showNumberIncidentGroup: function(key, fieldvalue){
                        var store = sel_target.grid.getStore();
                        var index = store.findExact('main_target',key);
                        return store.getAt(index).get(fieldvalue);
                    } 
                }
            );

            tplIncidentStat.overwrite(Ext.getCmp('targetView').body, incidentStatTargetStore);
            Ext.getCmp('targetView').body.highlight('#c3daf9', {block:true});
        }
    });


    Ext.Ajax.request({
        url: '../../geoapi/incident_raw/',
        method: 'POST', 
        params: {'query_type': ['main_type', 'type'], 'start_date': Ext.getCmp('startdt').getValue().format('Y-m-d'),'end_date': Ext.getCmp('enddt').getValue().format('Y-m-d'),'incident_type':incidentType,'incident_target':incidentTarget, 'filterlock':filterlock },
        // Ext.encode({'spatialfilter':filter}),
        // headers: {"Content-Type": "application/json"},
        success: function(response) {
            // myMaskEQ.hide();
            var incidentStatTypeStore = Ext.decode(response.responseText);
            var incidentDate = incidentStatTypeStore.last_incidentdate;
            var syncDate = incidentStatTypeStore.last_incidentsync;
            var tplIncidentStat = new Ext.XTemplate(
                '<div class="securityPanel">',
                    '<ul>',
                        '<li>',
                            '<div class="w3-card-4">',
                                '<header class="w3-container1 w3-blue">',
                                  '<h1 align="center">Incident list</h1>',
                                '</header>',
                                '<div class="w3-container1">',
                                    '<table style="width:100%;">',
                                        '<tr><td align="center" style="padding: 5px;">Date</td><td style="padding: 5px;" align="left">Description</td></tr>',
                                        '<tr><td colspan="5"><div class="lineCustom4Table"></div></td></tr>',
                                        '<tpl for=".">',
                                            '<tr><td align="left" style="padding: 5px;padding-left: 10px;vertical-align:top;">{date}</td><td style="padding: 5px;" align="left" class="custom_breakword_200">{desc}</td></tr>',
                                        '</tpl>',
                                    '</table>',   
                                '</div>',
                            '</div>',
                        '</li>',
                        '<li>',
                            '<div class="w3-card-4">',
                                '<header class="w3-container w3-blue">',
                                  '<h1>Last Updated</h1>',
                                '</header>',

                                '<div class="w3-container">',
                                    '<p><div style="float:left;">Last incidents</div><div style="float:right;">'+incidentDate+'</div></p><br/>',
                                    '<p><div style="float:left;">Last synchronized</div><div style="float:right;">'+syncDate+'</div></p><br/>',
                                '</div>',
                            '</div>',
                        '</li>',
                    '</ul>',
                '</div><br/><br/><br/><br/>'
            );

            tplIncidentStat.overwrite(Ext.getCmp('incidentView').body, incidentStatTypeStore.objects);
            Ext.getCmp('incidentView').body.highlight('#c3daf9', {block:true});
        }
    });


}


