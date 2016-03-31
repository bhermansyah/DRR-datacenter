/*!
 * Ext JS Library 3.4.0
 * Copyright(c) 2006-2011 Sencha Inc.
 * licensing@sencha.com
 * http://www.sencha.com/license
 */
Ext.ns('Ext.ux.form');

Ext.ux.form.SearchField = Ext.extend(Ext.form.TwinTriggerField, {
    initComponent : function(){
        Ext.ux.form.SearchField.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTrigger2Click();
            }
        }, this);
    },

    validationEvent:false,
    validateOnBlur:false,
    trigger1Class:'x-form-clear-trigger',
    trigger2Class:'x-form-search-trigger',
    hideTrigger1:true,
    width:180,
    hasSearch : false,
    paramName : 'CQL_FILTER',

    onTrigger1Click : function(){
        if(this.hasSearch){
            this.el.dom.value = '';
            var o = {start: 0};
            this.store.baseParams = this.store.baseParams || {};
            this.store.baseParams[this.paramName] = 'None';
            this.store.reload({params:o});
            this.triggers[0].hide();
            this.hasSearch = false;
        }
    },

    onTrigger2Click : function(){
        var v = this.getRawValue();
        if(v.length < 1){
            this.onTrigger1Click();
            return;
        }
        v = v.toLowerCase();
        var layers = [];
        var filters = []
        if (Ext.getCmp('settlementCB').checked){
            layers.push('geonode:afg_pplp');
            filters.push("strToLowerCase(name_en) like '%"+v+"%'");
        }
        if (Ext.getCmp('hfCB').checked){
            layers.push('geonode:afg_hltfac');
            filters.push("strToLowerCase(facility_name) like '%"+v+"%'");
        }
        if (Ext.getCmp('airportCB').checked){
            layers.push('geonode:afg_airdrmp');
            filters.push("strToLowerCase(namelong) like '%"+v+"%'");
        }

        var typeName = '';
        var queryFilter = '';
        for (var i=0;i<layers.length;i++){
            if (layers.length>1 && i!=layers.length-1){
                typeName += layers[i] + ',';
                queryFilter += filters[i] + ';';
            } else {
                typeName += layers[i];
                queryFilter += filters[i];
            }
        }

        console.log(typeName);

        // var test = "strToLowerCase(name_en) like '"+v+"%'";
        var o = {start: 0};
        this.store.baseParams = this.store.baseParams || {};
        this.store.baseParams[this.paramName] = queryFilter;
        this.store.baseParams['typeName'] = typeName;
        this.store.reload({params:o});
        this.hasSearch = true;
        this.triggers[0].show();
    }
});