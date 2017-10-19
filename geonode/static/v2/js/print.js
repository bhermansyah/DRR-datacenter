jQuery(function($){
	// Datatables Button
	$.extend(true, $.fn.dataTable.defaults, {
		"ordering": false, //do this when print
		"paging": false, //do this when print
		"info": false, //do this when print
		"searching": false, //do this when print
		dom: 't' //do this when print
	});

	$(document).ready(function(){
		var lcAll=[];
		var lcChild = jsondata['lc_child'];
		var lcParent = jsondata['lc_afg'];
		lcAll = (jsondata['lc_afg']).concat(jsondata['lc_child']);

		$('#pop_area_overview').DataTable( {
			data: (jsondata['lc_afg']).concat(jsondata['lc_child']),
			columns: [ // empty objects as placeholder to maintain existing table header titles
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{}
			],
			"columnDefs": [{
				"render": function (data, type, row){
					if (type == 'display') {return humanizeFormatter(data);}
					return data;
				},
				"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
			}]
		});

		$('#health_facilities').DataTable( {
			data: (jsondata['hf_afg']).concat(jsondata['hf_child']),
			columns: [ // empty objects as placeholder to maintain existing table header titles
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{}
			],
			"columnDefs": [{
				"render": function (data, type, row){
					if (type == 'display') {return humanizeFormatter(data);}
					return data;
				},
				"targets": [1, 2, 3, 4, 5, 6, 7, 8]
			}]
		});

		$('#road_network').DataTable( {
			data: (jsondata['rn_afg']).concat(jsondata['rn_child']),
			columns: [ // empty objects as placeholder to maintain existing table header titles
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{},
				{}
			],
			"columnDefs": [{
				"render": function (data, type, row){
					if (type == 'display') {return humanizeFormatter(data);}
					return data;
				},
				"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			}]
		});
	});
});