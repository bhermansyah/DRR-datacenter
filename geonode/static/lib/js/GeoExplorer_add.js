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

