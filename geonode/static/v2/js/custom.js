jQuery(function($){
	// Go to Top
	$('.gototop').click(function(event) {
		 event.preventDefault();
		 $('html, body').animate({
			 scrollTop: $("body").offset().top
		 }, 500);
	});
	//End go to top

	// Counter Number Animation
	$('.counting').each(function () {
	    $(this).prop('Counter',0).animate({
	        Counter: $(this).text()
	    }, {
	        duration: 4000,
	        easing: 'swing',
	        step: function (now) {
	            $(this).text(Math.ceil(now));
	        }
	    });
	});

	// Add active class based on current page
	$(document).ready(function () {
		var pathname= window.location.pathname;
		var search= window.location.search;
		var fullpath= pathname+search;
		var path_baseline = '?page=baseline';
		var hrefpath= $('nav.navbar-upper .nav>li>a')[0].pathname;
		// if (hrefpath==pathname) {
		// 	$('nav.navbar-upper .nav>li>a').parent().addClass('active');
		// }
		// $('nav.navbar-upper .nav>li>a[href="'+fullpath+'"]').parent().addClass('active');
		if (window.location.href.match(/\/dashboard\/*/)) {
			$('nav.navbar-upper .nav>li>a[href="'+pathname+path_baseline+'"]').parent().addClass('active');
		}

		if (window.location.href.match(/\/layers\/*/)) {
			$('nav.navbar-upper .nav>li>a[href="'+pathname+'"]').parent().addClass('active');
		}

		if (window.location.href.match(/maps*/) || window.location.href.match(/documents*/) || window.location.href.match(/partners*/) || window.location.href.match(/documentation*/) || window.location.href.match(/training*/) || window.location.href.match(/about*/) || window.location.href.match(/disclaimer*/)) {
			$('nav.navbar-upper .nav .dropdown-menu>li>a[href="'+pathname+'"]').parent().parent().parent().addClass('active');
		}
	});

	// Add active class based on dashboard page
	$(document).ready(function () {
		var pathname2= window.location.pathname;
		var search2= window.location.search;
		var fullpath2= pathname2+search2;
		// if (window.location.href.match(/\?page=baseline&*/) || window.location.href.match(/\?page=accessibility&*/) || window.location.href.match(/\?page=floodforecast&*/) || window.location.href.match(/\?page=floodrisk&*/) || window.location.href.match(/\?page=avalcheforecast&*/) || window.location.href.match(/\?page=avalancherisk&*/) || window.location.href.match(/\?page=earthquake&*/) || window.location.href.match(/\?page=security&*/) || window.location.href.match(/\?page=naturaldisaster&*/) || window.location.href.match(/\?page=weather&*/)){
			$('nav.navbar-lower .nav>li>a[href="'+fullpath2+'"]').parent().addClass('active');
		// }

		if (window.location.href.match(/\?page=floodforecast&*/) || window.location.href.match(/\?page=floodrisk&*/) || window.location.href.match(/\?page=avalcheforecast&*/) || window.location.href.match(/\?page=avalancherisk&*/)) {
			$('nav.navbar-lower .nav .dropdown-menu>li>a[href="'+fullpath2+'"]').parent().parent().parent().addClass('active');
		}

	});

	// Search animation
	$("body")
	.on("click", "div.thirteen button.btn-search", function(event) {
	    event.preventDefault();
	    var $input = $("div.thirteen input");
	    $input.focus();
	    // if ($input.val().length() > 0) {
	    //   // submit form
	    // }
	  })
	// /Search animation

	// Panel toolbox
	$(document).ready(function() {
	    $('.collapse-link').on('click', function() {
	        var $BOX_PANEL = $(this).closest('.x_panel'),
	            $ICON = $(this).find('i'),
	            $BOX_CONTENT = $BOX_PANEL.find('.x_content');

	        // fix for some div with hardcoded fix class
	        if ($BOX_PANEL.attr('style')) {
	            $BOX_CONTENT.slideToggle(200, function(){
	                $BOX_PANEL.removeAttr('style');
	            });
	        } else {
	            $BOX_CONTENT.slideToggle(200);
	            $BOX_PANEL.css('height', 'auto');
	        }

	        $ICON.toggleClass('fa-chevron-up fa-chevron-down');
	    });

	    $('.close-link').click(function () {
	        // var $BOX_PANEL = $(this).closest('.x_panel');
	        var $BOX_PANEL = $(this).closest('.col-xs-12');

	        $BOX_PANEL.remove();
	    });
	});
	// /Panel toolbox

	// Tooltip
	$(document).ready(function(){
	    $('[data-toggle="tooltip"]').tooltip();   
	});
	// /Tooltip

	// Popover
	$(document).ready(function(){
	    $('[data-toggle="popover"]').popover();   
	});
	// /Popover

	// Accordion plus-minus
	function toggleIcon(e) {
	    $(e.target)
	        .prev('.panel-heading')
	        .find(".more-less")
	        .toggleClass('glyphicon-minus glyphicon-plus');
	}
	$('.panel-group').on('hidden.bs.collapse', toggleIcon);
	$('.panel-group').on('shown.bs.collapse', toggleIcon);
	// /Accordion plus-minus

	// More Less
	$(document).ready(function() {
	  var showChar = 200;
	  var ellipsestext = "...";
	  var moretext = "Read more";
	  var lesstext = "Less";
	  $('.desc-more').each(function() {
	    var content = $(this).html();

	    if(content.length > showChar) {

	      var c = content.substr(0, showChar);
	      var h = content.substr(showChar-0, content.length - showChar);

	      var html = c+'<span class="moreelipses">'+ellipsestext+'</span><span class="morecontent"><span>'+h+'</span>&nbsp;&nbsp;<a href="" class="morelink">'+moretext+'</a></span>';

	      $(this).html(html);
	    }

	  });

	  $(".morelink").click(function(){
	    if($(this).hasClass("less")) {
	      $(this).removeClass("less");
	      $(this).html(moretext);
	    } else {
	      $(this).addClass("less");
	      $(this).html(lesstext);
	    }
	    $(this).parent().prev().toggle();
	    $(this).prev().toggle();
	    return false;
	  });
	});

	// Dropdown like Select
	$('.sorting-menu a').on('click', function(){    
	    $(this).parent().parent().prev().html($(this).html() + ' <i class="fa fa-angle-down"></i>');    
	})
	// /Dropdown like Select

	// // DateRangePicker
	// var start = moment().subtract(29, 'days');
	// var end = moment();

	// function cb(start, end){
	// 	$('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
	// }

	// function init_daterangepicker(){
	// 	$('#reportrange').daterangepicker({
	// 		startDate: start,
	// 		endDate: end,
	// 		ranges: {
	// 			'Today': [moment(), moment()],
	//            	'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
	//            	'Last 7 Days': [moment().subtract(6, 'days'), moment()],
	//            	'Last 30 Days': [moment().subtract(29, 'days'), moment()],
	//            	'This Month': [moment().startOf('month'), moment().endOf('month')],
	//            	'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
	// 		}
	// 	}, cb);

	// 	cb(start, end);
	// }

	// $(document).ready(function(){
	// 	init_daterangepicker();
	// });
	// // /DateRangePicker

	// Select All/None
	$(document).ready(function () {
	    $('.checkbox-group .parents-checkbox .panel-select-all :checkbox').change(function () {
	        $(this).closest('.checkbox-group').find(':checkbox').not(this).prop('checked', this.checked).closest('label');
	    });

	    $('.child-checkbox :checkbox').change(function () {
	        var $group = $(this).closest('.checkbox-group');
	        $group.find('.parents-checkbox .panel-select-all :checkbox').prop('checked', !$group.find('.child-checkbox :checkbox:not(:checked)').length);
	    });
	});
	// /Select All/None

	// Get checkbox value
	// document.addEventListener('DOMContentLoaded', function() {
	// 	var tcTemp=[];
	// 	var icTemp=[];

	// 	var target_unselect = $('.checkTarget:checkbox:not(:checked)');
	// 	$('button.ply-trget').on('click', function(event) {
	// 		$('.checkTarget:checkbox').each(function(){
	// 			if ($(this).checked){
	// 				$(this).val();
	// 				tcTemp.push($(this).val());
	// 			}
	// 		});
	// 	});
	// 	console.log(Object.values(tcTemp));
	// });
	
	// $('button.ply-trget').on('click', function(event) {
	//  var chart6dataselected = {};
	//   chart6dataselected.incident = [];
	//   chart6dataselected.dead = [];
	//   chart6dataselected.injured = [];
	//   chart6dataselected.violent = [];
	//   var indicatorselected = [];
	  
	//   $('#indicatorTarget .checkTarget').each(function(index, item) {
	//     if ($(item).checked == true) {
	//       chart6dataselected.incident.push(jsondata.chart6data.incident[index]);
	//       chart6dataselected.dead.push(jsondata.chart6data.dead[index]);
	//       chart6dataselected.injured.push(jsondata.chart6data.injured[index]);
	//       chart6dataselected.violent.push(jsondata.chart6data.violent[index]);
	//       indicatorselected.push($(item).text());
	//     }
	//   });
	  
	//   var option = echartRadar6.getOption();
	//   option.series[0].data[0].value = chart6dataselected.incident;
	//   option.series[1].data[0].value = chart6dataselected.dead;
	//   option.series[2].data[0].value = chart6dataselected.injured;
	//   option.series[3].data[0].value = chart6dataselected.violent;
	//   option.radar.indicator = indicatorselected;
	//   echartRadar6.setOption(option);
	// });

	var tc1=[];
	var ic1=[];
	var tc2=[];
	var ic2=[];

	// // sebelumnya cari max value dari data trus variabelnya masukin ke tc1 max
	var tcMax = 15;
	var icData = [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221];
	var icMax = Math.max.apply(null, icData);
	var icValue = [];

	// document.addEventListener('DOMContentLoaded', function(){
	// 	// console.log("DOM fully loaded and parsed");
	// 	$('button.ply-trget').on('click', function(event) {
	// 		var icDataIncident = [];
	// 		var icDataDead = [];
	// 		var icDataInjured = [];
	// 		var icDataViolent = [];

	// 		$('#indicatorTarget .checkTarget').each(function(index, item) {
	// 		  if ($(item).checked == true) {
	// 		  	icDataIncident.push(icData);
	// 		  	icDataDead.push(icData);
	// 		  	icDataInjured.push(icData);
	// 		  	icDataViolent.push(icData);
	// 		  	tc1.push({text: $(item).text(), max: tcMax});
	// 		  }
	// 		});
	// 	});
	// });
	
	// $('#indicatorTarget :checkbox').each(function(index){
	// 	$(this).on("change", function(){
	// 		if ($(this).is(':checked')) {

	// 			tc2.push($(this).val());
	// 			icDataIncident.push(data[index]);
	// 			icDataDead.push(data1[index]);
	// 			icDataInjured.push(data2[index]);
	// 			icDataViolent.push(data3[index]);
	// 		}
	// 	});
	// });

	// $('.checkTarget:checkbox:checked').each(function(index){
	// 	// tc1.push({text: $(this).val(), max: tcMax});
	// 	tc2.push($(this).val());
	// 	// tcDataIncident.push(TargetData[index]);
	// 	// tcDataDead.push(TargetData1[index]);
	// 	// tcDataInjured.push(TargetData2[index]);
	// 	// tcDataViolent.push(TargetData3[index]);
	// });
	// // console.log(Object.values(tc1));

	// $('.checkIncident:checkbox:checked').each(function(index){
	// 	// ic1.push({text: $(this).val(), max: icMax});
	// 	ic2.push($(this).val());
	// 	// icDataIncident.push(TypeData[index]);
	// 	// icDataDead.push(TypeData1[index]);
	// 	// icDataInjured.push(TypeData2[index]);
	// 	// icDataViolent.push(TypeData3[index]);
	// });
	// console.log(Object.values(ic1));

	// $('#indicatorTarget :checkbox').each(function(index, item) {
	//   if ($(item).checked == true) {
	//   	icDataIncident.push(data);
	//   	console.log(icDataIncident);
	//   	icDataDead.push(data1);
	//   	console.log(icDataDead);
	//   	icDataInjured.push(data2);
	//   	console.log(icDataInjured);
	//   	icDataViolent.push(data3);
	//   	console.log(icDataViolent);
	//   	// tc1.push({text: $(item).text(), max: tcMax});
	//   }
	// });

	// Echart
	// function init_echarts() {

	// 	if( typeof (echarts) === 'undefined'){
	// 		return;
	// 	}

	// 	console.log('init_echarts');

	// 	var humTooltipPie = function(params){
	// 	    console.log(params)
	// 	    var v= params.data.value;
	// 	    var p= params.percent;
	// 	    var n= params.data.name;
	// 	    if(v>=1000 && v<1000000){
	// 	        return n+'</br>'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 	    }
	// 	    else if (v>=1000000 && v<1000000000) {
	// 	        return n+'</br>'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 	    }else{
	// 	        return n+ '</br>'+ v+ ' ('+ p+'%)'
	// 	    }

	// 	};

	// 	var humanizePie = function(params){
	// 		console.log(params)

	// 		var v= params.data.value;
	// 		var p= params.percent;
	// 		var n= params.data.name;
	// 		if(v>=1000 && v<1000000){
	// 			return n+'\n'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 		}
	// 		else if (v>=1000000 && v<1000000000) {
	// 			return n+'\n'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 		}else{
	// 			return n+ '\n'+ v+ ' ('+ p+'%)'
	// 		}

	// 	};

	// 	var humTooltipBar = function(params){
	// 	    console.log(params)
	// 	    params1 = params[0];
	// 	    params2 = params[1];
	// 	    var v1= params1.value;
	// 	    var n1= params1.name;
	// 	    var v2= params2.value;
	// 	    var n2= params2.name;
	// 	    var vN1; var vN2;
	// 	    if(v1>=1000 && v1<1000000){
	// 	    	vN1=((v1/1000).toFixed(2))+' K'
	// 	        // return n1+' '+((v1/1000).toFixed(2))+' K'+'</br>'
	// 	    }
	// 	    if (v1>=1000000 && v1<1000000000) {
	// 	    	vN1=((v1/1000000).toFixed(2))+' M'
	// 	        // return n1+' '+((v1/1000000).toFixed(2))+' M'+'</br>'
	// 	    }if (v1<1000){
	// 	    	vN1=v1;
	// 	        // return n1+' '+ v1+'</br>'
	// 	    }

	// 	    if(v2>=1000 && v2<1000000){
	// 	    	vN2=((v2/1000).toFixed(2))+' K'
	// 	        // return n2+' '+((v2/1000).toFixed(2))+' K'
	// 	    }
	// 	    if (v2>=1000000 && v2<1000000000) {
	// 	    	vN2=((v2/1000000).toFixed(2))+' M'
	// 	        // return n2+' '+((v2/1000000).toFixed(2))+' M'
	// 	    }if (v2<1000){
	// 	    	vN2=v2;
	// 	        // return n2+' '+ v2
	// 	    }
	// 	    return (n1+' '+vN1+'</br>'+n2+' '+vN2)

	// 	};

	// 	var humanizeBar = function(params){
	// 		console.log(params)

	// 		var v= params.data;
	// 		// var n= params.name;
	// 		if(v>=1000 && v<1000000){
	// 			return ((v/1000).toFixed(2))+' K'
	// 		}
	// 		else if (v>=1000000 && v<1000000000) {
	// 			return ((v/1000000).toFixed(2))+' M'
	// 		}else{
	// 			return v
	// 		}

	// 	};

	// 	var theme = {
	// 		  color: [
	// 			  // '#c3272b', '#c93756', '#8e44ad', '#317589', '#003171',
	// 			  // rainbow
	// 			  // '#800026', '#bd0026', '#e31a1c', '#fc4e2a',
	// 			  // '#fd8d3c', '#feb24c', '#fed976', '#ffeda0'
	// 			  //blue to light blue
	// 			  // '#abd9e9', '#74add1',
	// 			  // '#4575b4'

	// 			  // '#84caec', '#5cbae5',
	// 			  // '#27a3dd'

	// 			  // '#c0392b',    '#e74c3c',    '#f39c12',
	// 			  // '#f1c40f',    '#8e44ad',    '#9b59b6',
	// 			  // '#ca2c68'    //'#ff6c5c',    '#ff7c6c'

	// 			  // graphic flat ui color dark red to light
	// 			  // '#870000',    '#a70c00',    '#b71c0c',
	// 			  // '#c72c1c',    '#d73c2c',    '#e74c3c',
	// 			  // '#f75c4c',    '#ff6c5c',    '#ff7c6c'

	// 			  // '#f99494',    '#f66364',    '#f33334',
	// 			  // '#dc0d0e',    '#b90c0d',    '#930a0a'

	// 			  // sap
	// 			  '#5cbae6',    '#b6d957',    '#fac364',
	// 			  '#8cd3ff',    '#d998cb',    '#f2d249',
	// 			  '#93b9c6',    '#ccc5a8',    '#52bacc',
	// 			  '#dbdb46',    '#98aafb'

	// 			  // colorbrewer
	// 			  // red and yellow
	// 			  // '#ffeda0',
	// 			  // '#fed976',
	// 			  // '#feb24c',
	// 			  // '#fd8d3c',
	// 			  // '#fc4e2a',
	// 			  // '#e31a1c',
	// 			  // '#bd0026',
	// 			  // '#800026'

	// 			  // red
	// 			  // '#fee0d2',
	// 			  // '#fcbba1',
	// 			  // '#fc9272',
	// 			  // '#fb6a4a',
	// 			  // '#ef3b2c',
	// 			  // '#cb181d',
	// 			  // '#a50f15',
	// 			  // '#67000d'

	// 			  // red to gray
	// 			  // '#b2182b',
	// 			  // '#d6604d',
	// 			  // '#f4a582',
	// 			  // '#fddbc7',
	// 			  // // '#ffffff',
	// 			  // '#e0e0e0',
	// 			  // '#bababa',
	// 			  // '#878787',
	// 			  // '#4d4d4d'

	// 			  // red to green 6
	// 			  // '#d73027',
	// 			  // '#fc8d59',
	// 			  // '#fee08b',
	// 			  // '#d9ef8b',
	// 			  // '#91cf60',
	// 			  // '#1a9850'

	// 			  // qualitative 12
	// 			  // '#a6cee3',
	// 			  // '#1f78b4',
	// 			  // '#b2df8a',
	// 			  // '#33a02c',
	// 			  // '#fb9a99',
	// 			  // '#e31a1c',
	// 			  // '#fdbf6f',
	// 			  // '#ff7f00',
	// 			  // '#cab2d6',
	// 			  // '#6a3d9a',
	// 			  // '#ffff99',
	// 			  // '#b15928'



	// 			  // '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
	// 			  // '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
	// 		  ],

	// 		  title: {
	// 			  itemGap: 8,
	// 			  textStyle: {
	// 				  fontWeight: 'normal',
	// 				  color: '#408829'
	// 			  }
	// 		  },

	// 		  dataRange: {
	// 			  color: ['#1f610a', '#97b58d']
	// 		  },

	// 		  toolbox: {
	// 			  color: ['#408829', '#408829', '#408829', '#408829']
	// 		  },

	// 		  tooltip: {
	// 			  backgroundColor: 'rgba(0,0,0,0.5)',
	// 			  axisPointer: {
	// 				  type: 'line',
	// 				  lineStyle: {
	// 					  color: '#408829',
	// 					  type: 'dashed'
	// 				  },
	// 				  crossStyle: {
	// 					  color: '#408829'
	// 				  },
	// 				  shadowStyle: {
	// 					  color: 'rgba(200,200,200,0.3)'
	// 				  }
	// 			  }
	// 		  },

	// 		  dataZoom: {
	// 			  dataBackgroundColor: '#eee',
	// 			  fillerColor: 'rgba(64,136,41,0.2)',
	// 			  handleColor: '#408829'
	// 		  },
	// 		  grid: {
	// 			  borderWidth: 0
	// 		  },

	// 		  categoryAxis: {
	// 			  axisLine: {
	// 				  lineStyle: {
	// 					  color: '#408829'
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  lineStyle: {
	// 					  color: ['#eee']
	// 				  }
	// 			  }
	// 		  },

	// 		  valueAxis: {
	// 			  axisLine: {
	// 				  lineStyle: {
	// 					  color: '#408829'
	// 				  }
	// 			  },
	// 			  splitArea: {
	// 				  show: true,
	// 				  areaStyle: {
	// 					  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  lineStyle: {
	// 					  color: ['#eee']
	// 				  }
	// 			  }
	// 		  },
	// 		  timeline: {
	// 			  lineStyle: {
	// 				  color: '#408829'
	// 			  },
	// 			  controlStyle: {
	// 				  normal: {color: '#408829'},
	// 				  emphasis: {color: '#408829'}
	// 			  }
	// 		  },

	// 		  k: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  color: '#68a54a',
	// 					  color0: '#a9cba2',
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: '#408829',
	// 						  color0: '#86b379'
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  map: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  areaStyle: {
	// 						  color: '#ddd'
	// 					  },
	// 					  label: {
	// 						  textStyle: {
	// 							  color: '#c12e34'
	// 						  }
	// 					  }
	// 				  },
	// 				  emphasis: {
	// 					  areaStyle: {
	// 						  color: '#99d2dd'
	// 					  },
	// 					  label: {
	// 						  textStyle: {
	// 							  color: '#c12e34'
	// 						  }
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  force: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  linkStyle: {
	// 						  strokeColor: '#408829'
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  chord: {
	// 			  padding: 4,
	// 			  itemStyle: {
	// 				  normal: {
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: 'rgba(128, 128, 128, 0.5)'
	// 					  },
	// 					  chordStyle: {
	// 						  lineStyle: {
	// 							  width: 1,
	// 							  color: 'rgba(128, 128, 128, 0.5)'
	// 						  }
	// 					  }
	// 				  },
	// 				  emphasis: {
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: 'rgba(128, 128, 128, 0.5)'
	// 					  },
	// 					  chordStyle: {
	// 						  lineStyle: {
	// 							  width: 1,
	// 							  color: 'rgba(128, 128, 128, 0.5)'
	// 						  }
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  gauge: {
	// 			  startAngle: 225,
	// 			  endAngle: -45,
	// 			  axisLine: {
	// 				  show: true,
	// 				  lineStyle: {
	// 					  color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
	// 					  width: 8
	// 				  }
	// 			  },
	// 			  axisTick: {
	// 				  splitNumber: 10,
	// 				  length: 12,
	// 				  lineStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  axisLabel: {
	// 				  textStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  length: 18,
	// 				  lineStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  pointer: {
	// 				  length: '90%',
	// 				  color: 'auto'
	// 			  },
	// 			  title: {
	// 				  textStyle: {
	// 					  color: '#333'
	// 				  }
	// 			  },
	// 			  detail: {
	// 				  textStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  }
	// 		  },
	// 		  textStyle: {
	// 			  fontFamily: 'Arial, Verdana, sans-serif'
	// 		  }
	//   	};


	// 	//echart Bar

	// 	if ($('#mainb').length ){

	// 		  var echartBar = echarts.init(document.getElementById('mainb'), theme);

	// 		  echartBar.setOption({
	// 			title: {
	// 			  text: 'Graph title',
	// 			  subtext: 'Graph Sub-text'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'axis'
	// 			},
	// 			legend: {
	// 			  data: ['sales', 'purchases']
	// 			},
	// 			toolbox: {
	// 			  show: false
	// 			},
	// 			calculable: false,
	// 			xAxis: [{
	// 			  type: 'category',
	// 			  data: ['1?', '2?', '3?', '4?', '5?', '6?', '7?', '8?', '9?', '10?', '11?', '12?']
	// 			}],
	// 			yAxis: [{
	// 			  type: 'value'
	// 			}],
	// 			series: [{
	// 			  name: 'sales',
	// 			  type: 'bar',
	// 			  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
	// 			  markPoint: {
	// 				data: [{
	// 				  type: 'max',
	// 				  name: '???'
	// 				}, {
	// 				  type: 'min',
	// 				  name: '???'
	// 				}]
	// 			  },
	// 			  markLine: {
	// 				data: [{
	// 				  type: 'average',
	// 				  name: '???'
	// 				}]
	// 			  }
	// 			}, {
	// 			  name: 'purchases',
	// 			  type: 'bar',
	// 			  data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3],
	// 			  markPoint: {
	// 				data: [{
	// 				  name: 'sales',
	// 				  value: 182.2,
	// 				  xAxis: 7,
	// 				  yAxis: 183,
	// 				}, {
	// 				  name: 'purchases',
	// 				  value: 2.3,
	// 				  xAxis: 11,
	// 				  yAxis: 3
	// 				}]
	// 			  },
	// 			  markLine: {
	// 				data: [{
	// 				  type: 'average',
	// 				  name: '???'
	// 				}]
	// 			  }
	// 			}]
	// 		  });

	// 	}

	// 	// echart Bar 2

	// 	if ($('#echart_bar').length ){

	// 		  var echartBar = echarts.init(document.getElementById('echart_bar'), theme);

	// 		  echartBar.setOption({
	// 			title: {
	// 			  text: 'Graph title',
	// 			  subtext: 'Graph Sub-text'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'axis'
	// 			},
	// 			legend: {
	// 			  data: ['River Flood']
	// 			},
	// 			toolbox: {
	// 			  show: false
	// 			},
	// 			calculable: false,
	// 			xAxis: [{
	// 			  type: 'category',
	// 			  data: ['1?', '2?', '3?', '4?', '5?', '6?', '7?', '8?', '9?', '10?', '11?', '12?']
	// 			}],
	// 			yAxis: [{
	// 			  type: 'value'
	// 			}],
	// 			series: [{
	// 			  name: 'River Flood',
	// 			  type: 'bar',
	// 			  data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3],
	// 			  markPoint: {
	// 				data: [{
	// 				  type: 'max',
	// 				  name: '???'
	// 				}, {
	// 				  type: 'min',
	// 				  name: '???'
	// 				}]
	// 			  },
	// 			  markLine: {
	// 				data: [{
	// 				  type: 'average',
	// 				  name: '???'
	// 				}]
	// 			  }
	// 			}]
	// 		  });

	// 	}

	// 	   //echart Radar

	// 	if ($('#echart_sonar').length ){

	// 	  var echartRadar = echarts.init(document.getElementById('echart_sonar'), theme);

	// 	  echartRadar.setOption({
	// 		title: {
	// 		  text: 'Incident Type',
	// 		  subtext: 'Subtitle'
	// 		},
	// 		 tooltip: {
	// 			trigger: 'item'
	// 		},
	// 		legend: {
	// 		  orient: 'vertical',
	// 		  x: 'right',
	// 		  y: 'bottom',
	// 		  data: ['Incident', 'Dead', 'Injured', 'Violent']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		polar: [{
	// 		  indicator: [{
	// 			text: 'Abandonment',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Attack',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Demonstration',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Kidnapping',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Murder',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Small Arms Fire',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Weapons',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Arrest',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Civillian Accident',
	// 			max: 5000
	// 		  }, {
	// 			text: 'IED',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Military/Non-Military Operation',
	// 			max: 5000
	// 		  }, {
	// 			text: 'Others',
	// 			max: 5000
	// 		  }, {
	// 			text: 'UXO',
	// 			max: 5000
	// 		  }]
	// 		}],
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Incident Type',
	// 		  type: 'radar',
	// 		  data: [{
	// 			value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	// 			name: 'Incident'
	// 		  }, {
	// 			value: [5, 2024, 10, 2, 418, 538, 41, 5, 314, 1219, 173, 37, 122],
	// 			name: 'Dead'
	// 		  }, {
	// 			value: [0, 3076, 7, 3, 36, 1694, 193, 4, 767, 2595, 190, 57, 315],
	// 			name: 'Injured'
	// 		  }, {
	// 			value: [59, 1845, 149, 115, 10, 3420, 70, 101, 122, 178, 909, 3, 42],
	// 			name: 'Violent'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Radar 2

	// 	if ($('#echart_sonar_2').length ){

	// 	  var echartRadar2 = echarts.init(document.getElementById('echart_sonar_2'), theme);

	// 	  echartRadar2.setOption({
	// 		title: {
	// 		  text: 'Budget vs spending',
	// 		  subtext: 'Subtitle'
	// 		},
	// 		 tooltip: {
	// 			trigger: 'item'
	// 		},
	// 		legend: {
	// 		  orient: 'vertical',
	// 		  x: 'right',
	// 		  y: 'bottom',
	// 		  data: ['Allocated Budget', 'Actual Spending']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		polar: [{
	// 		  indicator: [{
	// 			text: 'Sales',
	// 			max: 6000
	// 		  }, {
	// 			text: 'Administration',
	// 			max: 16000
	// 		  }, {
	// 			text: 'Information Techology',
	// 			max: 30000
	// 		  }, {
	// 			text: 'Customer Support',
	// 			max: 38000
	// 		  }, {
	// 			text: 'Development',
	// 			max: 52000
	// 		  }, {
	// 			text: 'Marketing',
	// 			max: 25000
	// 		  }]
	// 		}],
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Budget vs spending',
	// 		  type: 'radar',
	// 		  data: [{
	// 			value: [4300, 10000, 28000, 35000, 50000, 19000],
	// 			name: 'Allocated Budget'
	// 		  }, {
	// 			value: [5000, 14000, 28000, 31000, 42000, 21000],
	// 			name: 'Actual Spending'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Radar 3

	// 	if ($('#echart_sonar_3').length ){

	// 	  var echartRadar = echarts.init(document.getElementById('echart_sonar_3'), theme);

	// 	  echartRadar.setOption({
	// 		// title: {
	// 		//   text: 'Number of Incident and Casualties by Incident Type',
	// 		//   subtext: 'Subtitle'
	// 		// },
	// 		 tooltip: {
	// 			trigger: 'item'
	// 		},
	// 		legend: {
	// 		  // orient: 'vertical',
	// 		  x: 'left',
	// 		  y: 'top',
	// 		  data: ['Incident', 'Dead', 'Injured', 'Violent']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		polar: [{
	// 	  	  indicator: [
	// 	  	  {
	// 	  		text: 'Abandonment',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Demonstration',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Attack',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Kidnapping',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Murder',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Small Arms Fire',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Weapons',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Military/Non-Military Operation',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Civillian Accident',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'IED',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Arrest',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'Others',
	// 	  		max: 5000
	// 	  	  }, {
	// 	  		text: 'UXO',
	// 	  		max: 5000
	// 		  }
	// 		  ], center:['13%', 150],
	// 		  radius: 60
	// 		},{
	// 	  	  indicator: [
	// 	  	  {
	// 	  		text: 'Abandonment',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Attack',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Demonstration',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Kidnapping',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Murder',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Small Arms Fire',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Weapons',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Arrest',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Civillian Accident',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'IED',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Military/Non-Military Operation',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'Others',
	// 	  		max: 2500
	// 	  	  }, {
	// 	  		text: 'UXO',
	// 	  		max: 2500
	// 		  }
	// 		  ], center:['45%', 150],
	// 		  radius: 60
	// 		},{
	// 	  	  indicator: [
	// 	  	  {
	// 	  		text: 'Abandonment',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Attack',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Demonstration',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Kidnapping',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Murder',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Small Arms Fire',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Weapons',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Military/Non-Military Operation',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Civillian Accident',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'IED',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Arrest',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Others',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'UXO',
	// 	  		max: 3500
	// 		  }
	// 		  ], center:['13%', 350],
	// 		  radius: 60
	// 		},{
	// 	  	  indicator: [
	// 	  	  {
	// 	  		text: 'Abandonment',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Attack',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Demonstration',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Kidnapping',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Murder',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Small Arms Fire',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Weapons',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Military/Non-Military Operation',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Civillian Accident',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'IED',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Arrest',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'Others',
	// 	  		max: 3500
	// 	  	  }, {
	// 	  		text: 'UXO',
	// 	  		max: 3500
	// 		  }
	// 		  ], center:['45%', 350],
	// 		  radius: 60
	// 		}],
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Incident Type',
	// 		  type: 'radar',
	// 		  data: [{
	// 			value: [68, 158, 3446, 132, 332, 4602, 138, 1572, 416, 1232, 118, 33, 221],
	// 			name: 'Incident'
	// 		  }]
	// 		}, {
	// 		  name: 'Casualties',
	// 		  type: 'radar',
	// 		  polarIndex: 1,
	// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	// 		  data: [{
	// 			value: [5, 2024, 10, 2, 418, 538, 41, 5, 314, 1219, 173, 37, 122],
	// 			name: 'Dead'
	// 		  }]
	// 		}, {
	// 		  name: 'Casualties',
	// 		  type: 'radar',
	// 		  polarIndex: 2,
	// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	// 		  data: [{
	// 			value: [0, 3076, 7, 3, 36, 1694, 193, 190, 767, 2595, 4, 57, 315],
	// 			name: 'Injured'
	// 		  }]
	// 		}, {
	// 		  name: 'Casualties',
	// 		  type: 'radar',
	// 		  polarIndex: 3,
	// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	// 		  data: [{
	// 			value: [59, 1845, 149, 115, 10, 3420, 70, 101, 122, 178, 909, 3, 42],
	// 			name: 'Violent'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	//echart Line

	// 	if ($('#echart_line').length ){

	// 	  var echartLine = echarts.init(document.getElementById('echart_line'), theme);

	// 	  echartLine.setOption({
	// 		title: {
	// 		  text: 'Line Graph',
	// 		  subtext: 'Subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 220,
	// 		  y: 40,
	// 		  data: ['River Flood', 'Flash Flood']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  title: {
	// 				line: 'Line',
	// 				bar: 'Bar',
	// 				stack: 'Stack',
	// 				tiled: 'Tiled'
	// 			  },
	// 			  type: ['line', 'bar', 'stack', 'tiled']
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'category',
	// 		  boundaryGap: false,
	// 		  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	// 		}],
	// 		yAxis: [{
	// 		  type: 'value'
	// 		}],
	// 		series: [{
	// 		  name: 'River Flood',
	// 		  type: 'line',
	// 		  smooth: true,
	// 		  itemStyle: {
	// 			normal: {
	// 			  areaStyle: {
	// 				type: 'default'
	// 			  }
	// 			}
	// 		  },
	// 		  data: [10, 12, 21, 54, 260, 830, 710]
	// 		}, {
	// 		  name: 'Flash Flood',
	// 		  type: 'line',
	// 		  smooth: true,
	// 		  itemStyle: {
	// 			normal: {
	// 			  areaStyle: {
	// 				type: 'default'
	// 			  }
	// 			}
	// 		  },
	// 		  data: [30, 182, 434, 791, 390, 30, 10]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Line 2

	// 	if ($('#echart_line_2').length ){

	// 	  var echartLine = echarts.init(document.getElementById('echart_line_2'), theme);

	// 	  echartLine.setOption({
	// 		title: {
	// 		  text: 'Line Graph',
	// 		  subtext: 'Subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 220,
	// 		  y: 40,
	// 		  data: ['River Flood']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  title: {
	// 				line: 'Line',
	// 				bar: 'Bar',
	// 				stack: 'Stack',
	// 				tiled: 'Tiled'
	// 			  },
	// 			  type: ['line', 'bar', 'stack', 'tiled']
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'category',
	// 		  boundaryGap: false,
	// 		  data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	// 		}],
	// 		yAxis: [{
	// 		  type: 'value'
	// 		}],
	// 		series: [{
	// 		  name: 'River Flood',
	// 		  type: 'line',
	// 		  smooth: true,
	// 		  itemStyle: {
	// 			normal: {
	// 			  areaStyle: {
	// 				type: 'default'
	// 			  }
	// 			}
	// 		  },
	// 		  data: [10, 12, 21, 54, 260, 830, 710]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Line 3

	// 	if ($('#echart_line_3').length ){

	// 	  var echartLine = echarts.init(document.getElementById('echart_line_3'), theme);

	// 	  echartLine.setOption({
	// 		title: {
	// 		  text: 'Beijing Graph',
	// 		  subtext: 'Subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		xAxis: {
	//             data: data.map(function (item) {
	//                 return item[0];
	//             })
	//         },
	//         yAxis: {
	//             splitLine: {
	//                 show: false
	//             }
	//         },
	// 		// legend: {
	// 		//   x: 220,
	// 		//   y: 40,
	// 		//   data: ['River Flood']
	// 		// },
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			dataZoom: {
 //                    yAxisIndex: 'none'
 //                },
	// 			magicType: {
	// 			  show: true,
	// 			  title: {
	// 				line: 'Line',
	// 				bar: 'Bar',
	// 				stack: 'Stack',
	// 				tiled: 'Tiled'
	// 			  },
	// 			  type: ['line', 'bar', 'stack', 'tiled']
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		dataZoom: [{
	//             startValue: '2014-06-01'
	//         }, {
	//             type: 'inside'
	//         }],
	//         visualMap: {
	//             top: 10,
	//             right: 10,
	//             pieces: [{
	//                 gt: 0,
	//                 lte: 50,
	//                 color: '#096'
	//             }, {
	//                 gt: 50,
	//                 lte: 100,
	//                 color: '#ffde33'
	//             }, {
	//                 gt: 100,
	//                 lte: 150,
	//                 color: '#ff9933'
	//             }, {
	//                 gt: 150,
	//                 lte: 200,
	//                 color: '#cc0033'
	//             }, {
	//                 gt: 200,
	//                 lte: 300,
	//                 color: '#660099'
	//             }, {
	//                 gt: 300,
	//                 color: '#7e0023'
	//             }],
	//             outOfRange: {
	//                 color: '#999'
	//             }
	//         },
	// 		// calculable: true,
	// 		// xAxis: [{
	// 		//   type: 'category',
	// 		//   boundaryGap: false,
	// 		//   data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
	// 		// }],
	// 		// yAxis: [{
	// 		//   type: 'value'
	// 		// }],
	// 		series: [{
	// 		  name: 'River Flood',
	// 		  type: 'line',
	// 		  data: data.map(function (item) {
 //                  return item[1];
 //              }),
 //              markLine: {
 //                  silent: true,
 //                  data: [{
 //                      yAxis: 50
 //                  }, {
 //                      yAxis: 100
 //                  }, {
 //                      yAxis: 150
 //                  }, {
 //                      yAxis: 200
 //                  }, {
 //                      yAxis: 300
 //                  }]
 //              }
	// 		 //  smooth: true,
	// 		 //  itemStyle: {
	// 			// normal: {
	// 			//   areaStyle: {
	// 			// 	type: 'default'
	// 			//   }
	// 			// }
	// 		 //  },
	// 		 //  data: [10, 12, 21, 54, 260, 830, 710]
	// 		}]
	// 	  });

	// 	}

	// 	if ($('#echart_line_3').length ){

	// 	  var echartLine = echarts.init(document.getElementById('echart_line_3'), theme);

	// 	  echartLine.setOption({
	// 		title: {
	//             text: 'Beijing AQI'
	//         },
	//         tooltip: {
	//             trigger: 'axis'
	//         },
	//         xAxis: {
	//             data: data.map(function (item) {
	//                 return item[0];
	//             })
	//         },
	//         yAxis: {
	//             splitLine: {
	//                 show: false
	//             }
	//         },
	//         toolbox: {
	//             left: 'center',
	//             feature: {
	//                 dataZoom: {
	//                     yAxisIndex: 'none'
	//                 },
	//                 restore: {},
	//                 saveAsImage: {}
	//             }
	//         },
	//         dataZoom: [{
	//             startValue: '2014-06-01'
	//         }, {
	//             type: 'inside'
	//         }],
	//         visualMap: {
	//             top: 10,
	//             right: 10,
	//             pieces: [{
	//                 gt: 0,
	//                 lte: 50,
	//                 color: '#096'
	//             }, {
	//                 gt: 50,
	//                 lte: 100,
	//                 color: '#ffde33'
	//             }, {
	//                 gt: 100,
	//                 lte: 150,
	//                 color: '#ff9933'
	//             }, {
	//                 gt: 150,
	//                 lte: 200,
	//                 color: '#cc0033'
	//             }, {
	//                 gt: 200,
	//                 lte: 300,
	//                 color: '#660099'
	//             }, {
	//                 gt: 300,
	//                 color: '#7e0023'
	//             }],
	//             outOfRange: {
	//                 color: '#999'
	//             }
	//         },
	//         series: {
	//             name: 'Beijing AQI',
	//             type: 'line',
	//             data: data.map(function (item) {
	//                 return item[1];
	//             }),
	//             markLine: {
	//                 silent: true,
	//                 data: [{
	//                     yAxis: 50
	//                 }, {
	//                     yAxis: 100
	//                 }, {
	//                     yAxis: 150
	//                 }, {
	//                     yAxis: 200
	//                 }, {
	//                     yAxis: 300
	//                 }]
	//             }
	//         }
	// 	  });

	// 	}

	// 	//echart Bar Horizontal

	// 	if ($('#echart_bar_horizontal').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal'), theme, humTooltipBar, humanizeBar);

	// 	  echartBar.setOption({
	// 		// title: {
	// 		//   text: 'Overview 1',
	// 		//   subtext: 'Graph subtitle'
	// 		// },
	// 		tooltip: {
	// 		  trigger: 'axis',
	// 		  axisPointer:{
	// 		  	type: 'shadow',
	// 		  },
	// 		  formatter: humTooltipBar
	// 		},
	// 		legend: {
	// 		  x: 'left',
	// 		  data: ['Population', 'Area (km2)']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 		  	magicType: {
	// 	    	  show: true,
	// 	    	  title: {
	// 	    		line: 'Line',
	// 	    		bar: 'Bar',
	// 	    		stack: 'Stack',
	// 	    		tiled: 'Tiled'
	// 	    	  },
	// 	    	  type: ['line', 'bar', 'stack', 'tiled']
	// 	    	},
	// 	    	restore: {
	// 	    	  show: true,
	// 	    	  title: "Restore"
	// 	    	},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		grid: {
	// 	        left: '0%',
	// 	        right: '4%',
	// 	        bottom: '8%',
	// 	        containLabel: true
	// 	    },
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01],
	// 		  axisLabel:{
	// 		  	rotate: 30
	// 		  }
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Built-Up', 'Cultivated', 'Barrend/Rangeland']
	// 		}],
	// 		series: [{
	// 		  name: 'Population',
	// 		  type: 'bar',
	// 		  label:{
	// 		  	normal:{
	// 		  		formatter: humanizeBar,
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [12550853, 13002950, 5554167]
	// 		}, {
	// 		  name: 'Area (km2)',
	// 		  type: 'bar',
	// 		  label:{
	// 		  	normal:{
	// 		  		formatter: humanizeBar,
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [3050.5, 76153.2, 568421.5]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Bar Horizontal 2

	// 	if ($('#echart_bar_horizontal_2').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_2'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal 3

	// 	if ($('#echart_bar_horizontal_3').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_3'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal 4

	// 	if ($('#echart_bar_horizontal_4').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_4'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal 5

	// 	if ($('#echart_bar_horizontal_5').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_5'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal 6

	// 	if ($('#echart_bar_horizontal_6').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_6'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal 7

	// 	if ($('#echart_bar_horizontal_7').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_7'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal Casualties

	// 	if ($('#echart_bar_horizontal_8').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_8'), theme);

	// 	  echartBar.setOption({
	// 		// title: {
	// 		//   text: 'Overview 1',
	// 		//   subtext: 'Graph subtitle'
	// 		// },
	// 		tooltip: {
	// 		  trigger: 'axis',
	// 		  axisPointer:{
	// 		  	type:'shadow'
	// 		  }
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Dead', 'Injured']
	// 		},
	// 		toolbox: {
	// 	      show: true,
	// 	      feature: {
	// 	    	magicType: {
	// 	    	  show: true,
	// 	    	  title: {
	// 	    		line: 'Line',
	// 	    		bar: 'Bar',
	// 	    		stack: 'Stack',
	// 	    		tiled: 'Tiled'
	// 	    	  },
	// 	    	  type: ['line', 'bar', 'stack', 'tiled']
	// 	    	},
	// 	    	restore: {
	// 	    	  show: true,
	// 	    	  title: "Restore"
	// 	    	},
	// 	    	saveAsImage: {
	// 	    	  show: true,
	// 	    	  title: "Save Image"
	// 	    	}
	// 	      }
	// 		},
	// 		grid: {
	// 	        left: '0%',
	// 	        right: '4%',
	// 	        bottom: '8%',
	// 	        containLabel: true
	// 	    },
	// 		// grid:[{
	// 		// 	top: 50,
	// 		// 	width: '50%',
	// 		// 	bottom: '45%',
	// 		// 	left: 10,
	// 		// 	containLabel: true
	// 		// }],
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'log',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 			type: 'category',
	// 			data: ['Abandonment', 'Demonstration', 'Attack', 'Kidnapping', 'Murder', 'Small Arms Fire', 'Weapons', 'Military/Non-Military Operation', 'Civillian Accident', 'IED', 'Arrest', 'Others', 'UXO'],
	// 			axisLabel:{
	// 				// rotate: 30
	// 			}
	// 		}],
	// 		series: [{
	// 		  name: 'Dead',
	// 		  type: 'bar',
	// 		  label:{
	// 		  	normal:{
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [5, 2024, 10, 2, 418, 538, 41, 5, 314, 1219, 173, 37, 122]
	// 		}, {
	// 		  name: 'Injured',
	// 		  type: 'bar',
	// 		  label:{
	// 		  	normal:{
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [0, 3076, 7, 3, 36, 1694, 193, 190, 767, 2595, 4, 57, 315]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal Incident

	// 	if ($('#echart_bar_horizontal_9').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_9'), theme);

	// 	  echartBar.setOption({
	// 		// title: {
	// 		//   text: 'Overview 1',
	// 		//   subtext: 'Graph subtitle'
	// 		// },
	// 		tooltip: {
	// 		  trigger: 'axis',
	// 		  axisPointer:{
	// 		  	type:'shadow'
	// 		  }
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Incident', 'Violent']
	// 		},
	// 		toolbox: {
	// 	      show: true,
	// 	      feature: {
	// 	    	magicType: {
	// 	    	  show: true,
	// 	    	  title: {
	// 	    		line: 'Line',
	// 	    		bar: 'Bar',
	// 	    		stack: 'Stack',
	// 	    		tiled: 'Tiled'
	// 	    	  },
	// 	    	  type: ['line', 'bar', 'stack', 'tiled']
	// 	    	},
	// 	    	restore: {
	// 	    	  show: true,
	// 	    	  title: "Restore"
	// 	    	},
	// 	    	saveAsImage: {
	// 	    	  show: true,
	// 	    	  title: "Save Image"
	// 	    	}
	// 	      }
	// 		},
	// 		grid: {
	// 	        left: '0%',
	// 	        right: '4%',
	// 	        bottom: '8%',
	// 	        containLabel: true
	// 	    },
	// 		// grid:[{
	// 		// 	top: 50,
	// 		// 	width: '50%',
	// 		// 	bottom: '45%',
	// 		// 	left: 10,
	// 		// 	containLabel: true
	// 		// }],
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'log',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 			type: 'category',
	// 			data: ['Abandonment', 'Demonstration', 'Attack', 'Kidnapping', 'Murder', 'Small Arms Fire', 'Weapons', 'Military/Non-Military Operation', 'Civillian Accident', 'IED', 'Arrest', 'Others', 'UXO'],
	// 			axisLabel:{
	// 				// rotate: 30
	// 			}
	// 		}],
	// 		series: [{
	// 		  name: 'Incident',
	// 		  type: 'bar',
	// 		  // barMinHeight: 10,
	// 		  // barWidth: 15,
	// 		  label:{
	// 		  	normal:{
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [68, 158, 3446, 132, 332, 4602, 138, 1572, 416, 1232, 118, 33, 221]
	// 		}, {
	// 		  name: 'Violent',
	// 		  type: 'bar',
	// 		  label:{
	// 		  	normal:{
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [59, 1845, 149, 115, 10, 3420, 70, 101, 122, 178, 909, 3, 42]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Stack

	// 	if ($('#echart_bar_stack').length ){

	// 		  var echartBar = echarts.init(document.getElementById('echart_bar_stack'), theme);

	// 		  echartBar.setOption({
	// 			title: {
	// 			  text: 'Graph title',
	// 			  subtext: 'Graph Sub-text',
	// 			  x: 'center'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'axis',
	// 			  axisPointer:{
	// 			  	type:'shadow'
	// 			  }
	// 			},
	// 			legend: {
	// 				x: 'center',
	// 				y: 'bottom',
	// 			  data: ['Low', 'Medium', 'High']
	// 			},
	// 			toolbox: {
	// 		      show: true,
	// 		      feature: {
	// 		    	magicType: {
	// 		    	  show: true,
	// 		    	  title: {
	// 		    		line: 'Line',
	// 		    		bar: 'Bar',
	// 		    		stack: 'Stack',
	// 		    		tiled: 'Tiled'
	// 		    	  },
	// 		    	  type: ['line', 'bar', 'stack', 'tiled']
	// 		    	},
	// 		    	restore: {
	// 		    	  show: true,
	// 		    	  title: "Restore"
	// 		    	},
	// 		    	saveAsImage: {
	// 		    	  show: true,
	// 		    	  title: "Save Image"
	// 		    	}
	// 		      }
	// 			},
	// 			calculable: true,
	// 			xAxis: [{
	// 			  type: 'category',
	// 			  name: 'likelihood',
	// 			  data: ['Extreme', 'Very High', 'High', 'Moderate', 'Low']
	// 			}],
	// 			yAxis: [{
	// 			  type: 'log',
	// 			  name: 'population'
	// 			}],
	// 			series: [{
	// 			  name: 'Low',
	// 			  type: 'bar',
	// 			  stack: 'flash',
	// 			  // barMinHeight: 20,
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [0, 28073, 4708, 196553, 237405]
	// 			}, {
	// 			  name: 'Medium',
	// 			  type: 'bar',
	// 			  stack: 'flash',
	// 			  // barMinHeight: 20,
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [0, 21875, 8484, 149036, 238381]
	// 			},{
	// 			  name: 'High',
	// 			  type: 'bar',
	// 			  stack: 'flash',
	// 			  // barMinHeight: 20,
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [0, 10150, 11396, 161921, 177592]
	// 			 //  markPoint: {
	// 				// data: [{
	// 				//   type: 'max',
	// 				//   name: '???'
	// 				// }, {
	// 				//   type: 'min',
	// 				//   name: '???'
	// 				// }]
	// 			 //  },
	// 			 //  markLine: {
	// 				// data: [{
	// 				//   type: 'average',
	// 				//   name: '???'
	// 				// }]
	// 			 //  }
	// 			}]
	// 		  });

	// 	}

	// 	// echart Bar Stack 3

	// 	if ($('#echart_bar_stack_3').length ){

	// 		  var echartBar = echarts.init(document.getElementById('echart_bar_stack_3'), theme);

	// 		  echartBar.setOption({
	// 			title: {
	// 			  text: 'Graph title',
	// 			  subtext: 'Graph Sub-text',
	// 			  x: 'center'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'axis',
	// 			  axisPointer:{
	// 			  	type:'shadow'
	// 			  }
	// 			},
	// 			legend: {
	// 				x: 'center',
	// 				y: 'bottom',
	// 			  data: ['Low', 'Medium', 'High']
	// 			},
	// 			toolbox: {
	// 		      show: true,
	// 		      feature: {
	// 		    	magicType: {
	// 		    	  show: true,
	// 		    	  title: {
	// 		    		line: 'Line',
	// 		    		bar: 'Bar',
	// 		    		stack: 'Stack',
	// 		    		tiled: 'Tiled'
	// 		    	  },
	// 		    	  type: ['line', 'bar', 'stack', 'tiled']
	// 		    	},
	// 		    	restore: {
	// 		    	  show: true,
	// 		    	  title: "Restore"
	// 		    	},
	// 		    	saveAsImage: {
	// 		    	  show: true,
	// 		    	  title: "Save Image"
	// 		    	}
	// 		      }
	// 			},
	// 			calculable: true,
	// 			xAxis: [{
	// 			  type: 'category',
	// 			  name: 'likelihood',
	// 			  data: ['Extreme', 'Very High', 'High', 'Moderate', 'Low']
	// 			}],
	// 			yAxis: [{
	// 			  type: 'log',
	// 			  name: 'population'
	// 			}],
	// 			series: [{
	// 			  name: 'Low',
	// 			  type: 'bar',
	// 			  stack: 'flash',
	// 			  // barMinHeight: 20,
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [0, 28073, 4708, 196553, 237405]
	// 			}, {
	// 			  name: 'Medium',
	// 			  type: 'bar',
	// 			  stack: 'flash',
	// 			  // barMinHeight: 20,
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [0, 21875, 8484, 149036, 238381]
	// 			},{
	// 			  name: 'High',
	// 			  type: 'bar',
	// 			  stack: 'flash',
	// 			  // barMinHeight: 20,
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [0, 10150, 11396, 161921, 177592]
	// 			 //  markPoint: {
	// 				// data: [{
	// 				//   type: 'max',
	// 				//   name: '???'
	// 				// }, {
	// 				//   type: 'min',
	// 				//   name: '???'
	// 				// }]
	// 			 //  },
	// 			 //  markLine: {
	// 				// data: [{
	// 				//   type: 'average',
	// 				//   name: '???'
	// 				// }]
	// 			 //  }
	// 			}]
	// 		  });

	// 	}

	// 	// echart Bar Stack Casualties

	// 	if ($('#echart_bar_stack_2').length ){

	// 		  var echartBar = echarts.init(document.getElementById('echart_bar_stack_2'), theme);

	// 		  echartBar.setOption({
	// 			title: {
	// 			  text: 'Graph title',
	// 			  subtext: 'Graph Sub-text',
	// 			  x: 'center'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'axis',
	// 			  axisPointer:{
	// 			  	type:'shadow'
	// 			  }
	// 			},
	// 			legend: {
	// 				x: 'center',
	// 				y: 'bottom',
	// 			  data: ['Abandonment', 'Attack', 'Demonstration', 'Kidnapping', 'Murder', 'Small Arms Fire', 'Weapons', 'Arrest', 'Civillian Accident', 'IED', 'Military/Non-Military Operation', 'Others', 'UXO']
	// 			},
	// 			toolbox: {
	// 		      show: true,
	// 		      feature: {
	// 		    	magicType: {
	// 		    	  show: true,
	// 		    	  title: {
	// 		    		line: 'Line',
	// 		    		bar: 'Bar',
	// 		    		stack: 'Stack',
	// 		    		tiled: 'Tiled'
	// 		    	  },
	// 		    	  type: ['line', 'bar', 'stack', 'tiled']
	// 		    	},
	// 		    	restore: {
	// 		    	  show: true,
	// 		    	  title: "Restore"
	// 		    	},
	// 		    	saveAsImage: {
	// 		    	  show: true,
	// 		    	  title: "Save Image"
	// 		    	}
	// 		      }
	// 			},
	// 			calculable: true,
	// 			xAxis: [{
	// 			  type: 'category',
	// 			  // name: '',
	// 			  data: ['Incident', 'Dead', 'Injured', 'Violent']
	// 			}],
	// 			yAxis: [{
	// 			  type: 'log',
	// 			  name: 'Population'
	// 			}],
	// 			series: [{
	// 			  name: 'Abandonment',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [68, 5, 0, 59]
	// 			}, {
	// 			  name: 'Attack',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [3446, 2024, 3076, 1845]
	// 			},{
	// 			  name: 'Demonstration',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [158, 10, 7, 149]
	// 			},{
	// 			  name: 'Kidnapping',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [132, 2, 3, 115]
	// 			}, {
	// 			  name: 'Murder',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [332, 418, 36, 10]
	// 			},{
	// 			  name: 'Small Arms Fire',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [4602, 538, 1694, 10]
	// 			},{
	// 			  name: 'Weapons',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [138, 41, 193, 3420]
	// 			}, {
	// 			  name: 'Arrest',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [118, 5, 4, 70]
	// 			},{
	// 			  name: 'Civillian Accident',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [416, 314, 767, 101]
	// 			},{
	// 			  name: 'IED',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [1232, 1219, 2595, 122]
	// 			}, {
	// 			  name: 'Military/Non-Military Operation',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [1572, 173, 190, 909]
	// 			},{
	// 			  name: 'Others',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [33, 37, 57, 3]
	// 			},{
	// 			  name: 'UXO',
	// 			  type: 'bar',
	// 			  stack: 'casualties',
	// 			  itemStyle:{
	// 			  	normal:{
	// 			  		label:{
	// 			  			show:true,
	// 			  			position: 'inside'
	// 			  		}
	// 			  	}
	// 			  },
	// 			  data: [221, 122, 315, 42]
	// 			}]
	// 		  });

	// 	}

	// 	//echart Pie Collapse

	// 	if ($('#echart_pie2').length ){

	// 	  var echartPieCollapse = echarts.init(document.getElementById('echart_pie2'), theme);

	// 	  echartPieCollapse.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel']
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Area Mode',
	// 		  type: 'pie',
	// 		  radius: [25, 90],
	// 		  center: ['50%', 170],
	// 		  roseType: 'area',
	// 		  x: '50%',
	// 		  max: 40,
	// 		  sort: 'ascending',
	// 		  data: [{
	// 			value: 10,
	// 			name: 'rose1'
	// 		  }, {
	// 			value: 5,
	// 			name: 'rose2'
	// 		  }, {
	// 			value: 15,
	// 			name: 'rose3'
	// 		  }, {
	// 			value: 25,
	// 			name: 'rose4'
	// 		  }, {
	// 			value: 20,
	// 			name: 'rose5'
	// 		  }, {
	// 			value: 35,
	// 			name: 'rose6'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	//echart Donut

	// 	if ($('#echart_donut').length ){

	// 	  var echartDonut = echarts.init(document.getElementById('echart_donut'), theme, humTooltipPie, humanizePie);

	// 	 //  var humTooltip = function(params){
	// 		//     console.log(params)
	// 		//     var v= params.data.value;
	// 		//     var p= params.percent;
	// 		//     var n= params.data.name;
	// 		//     if(v>=1000 && v<1000000){
	// 		//         return n+'</br>'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 		//     }
	// 		//     else if (v>=1000000 && v<1000000000) {
	// 		//         return n+'</br>'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 		//     }else{
	// 		//         return n+ '</br>'+ v+ ' ('+ p+'%)'
	// 		//     }

	// 		// };

	// 	  // var humanize = function(params){
	// 	  // 				console.log(params)
	// 			// 		var v= params.data.value;
	// 			// 		var p= params.percent;
	// 			// 		var n= params.data.name;
	// 			// 		if(v>=1000 && v<1000000){
	// 			// 			return n+'\n'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 			// 		}
	// 			// 		else if (v>=1000000 && v<1000000000) {
	// 			// 			return n+'\n'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 			// 		}else{
	// 			// 			return n+ '\n'+ v+ ' ('+ p+'%)'
	// 			// 		}

	// 			// 	};

	// 	  echartDonut.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie
	// 		},
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['With GSM Coverage','Without GSM Coverage']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Population',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle:
	// 		  {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie
	// 				// "{b} \n"+humanize+" ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 21051822,
	// 			name: 'With GSM Coverage'
	// 		  }, {
	// 			value: 10056148,
	// 			name: 'Without GSM Coverage'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Donut 2

	// 	if ($('#echart_donut_2').length ){

	// 	  var echartDonut2 = echarts.init(document.getElementById('echart_donut_2'), theme, humTooltipPie, humanizePie);

	// 	  echartDonut2.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie
	// 		},
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['With GSM Coverage','Without GSM Coverage']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Area',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 105732,
	// 			name: 'With GSM Coverage'
	// 		  }, {
	// 			value: 541893,
	// 			name: 'Without GSM Coverage'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Donut 3

	// 	if ($('#echart_donut_3').length ){

	// 	  var echartDonut = echarts.init(document.getElementById('echart_donut_3'), theme, humTooltipPie, humanizePie);

	// 	  echartDonut.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Low Risk','Medium Risk', 'High Risk', 'Not at Risk']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Area',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie //"{b} \n{c} ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 2600000,
	// 			name: 'Low Risk'
	// 		  }, {
	// 			value: 2800000,
	// 			name: 'Medium Risk'
	// 		  }, {
	// 			value: 1700000,
	// 			name: 'High Risk'
	// 		  }, {
	// 			value: 24000000,
	// 			name: 'Not at Risk'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Donut 4

	// 	if ($('#echart_donut_4').length ){

	// 	  var echartDonut = echarts.init(document.getElementById('echart_donut_4'), theme, humTooltipPie, humanizePie);

	// 	  echartDonut.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Low Risk','Medium Risk', 'High Risk', 'Not at Risk']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Area',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie //"{b} \n{c} ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 1714,
	// 			name: 'Low Risk'
	// 		  }, {
	// 			value: 292,
	// 			name: 'Medium Risk'
	// 		  }, {
	// 			value: 902,
	// 			name: 'High Risk'
	// 		  }, {
	// 			value: 31097092,
	// 			name: 'Not at Risk'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Donut 5

	// 	if ($('#echart_donut_5').length ){

	// 	  var echartDonut = echarts.init(document.getElementById('echart_donut_5'), theme, humTooltipPie ,humanizePie);

	// 	  echartDonut.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		title:[{
	// 			text: 'Avalanche Population',
	// 			subtext: 'Population at Risk of Avalanche',
	// 			x: '25%',
	// 			textAlign: 'center'
	// 		}, {
	// 			text: 'Avalanche Area',
	// 			subtext: 'Area at Risk of Avalanche',
	// 			x: '50%',
	// 			textAlign: 'center'
	// 		}
	// 		],
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'left',
	// 		  y: 'bottom',
	// 		  data: ['Moderate Risk Pop', 'High Risk Pop', 'Not at Risk Pop', 'Moderate Risk Area', 'High Risk Area', 'Not at Risk Area']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Population',
	// 		  type: 'pie',
	// 		  center:['18%', '50%'],
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie //"{b} \n{c} ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 508637,
	// 			name: 'Moderate Risk Pop'
	// 		  }, {
	// 			value: 134917,
	// 			name: 'High Risk Pop'
	// 		  }, {
	// 			value: 30356446,
	// 			name: 'Not at Risk Pop'
	// 		  }]
	// 		}, {
	// 		  name: 'Area',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: "{b} \n{d}%"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 28861,
	// 			name: 'Moderate Risk Area'
	// 		  }, {
	// 			value: 4954,
	// 			name: 'High Risk Area'
	// 		  }, {
	// 			value: 613809,
	// 			name: 'Not at Risk Area'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Donut 6

	// 	if ($('#echart_donut_6').length ){

	// 	  var echartDonut = echarts.init(document.getElementById('echart_donut_6'), theme, humTooltipPie, humanizePie);

	// 	  echartDonut.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Moderate Risk', 'High Risk', 'Not at Risk']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Area',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie //"{b} \n{c} ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 508637,
	// 			name: 'Moderate Risk'
	// 		  }, {
	// 			value: 134917,
	// 			name: 'High Risk'
	// 		  }, {
	// 			value: 30356446,
	// 			name: 'Not at Risk'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	   //echart Pie

	// 	if ($('#echart_pie').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie'), theme, humTooltipPie, humanizePie);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Nearest Airport',
	// 		  type: 'pie',
	// 		  radius: '30%',
	// 		  center: ['50%', '48%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie //"{b} \n{c} ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 14900000,
	// 			name: '< 1h'
	// 		  }, {
	// 			value: 7400000,
	// 			name: '< 2h'
	// 		  }, {
	// 			value: 3600000,
	// 			name: '< 3h'
	// 		  }, {
	// 			value: 1600000,
	// 			name: '< 4h'
	// 		  }, {
	// 			value: 775996,
	// 			name: '< 5h'
	// 		  }, {
	// 			value: 477632,
	// 			name: '< 6h'
	// 		  }, {
	// 			value: 359146,
	// 			name: '< 7h'
	// 		  }, {
	// 			value: 593026,
	// 			name: '< 8h'
	// 		  }, {
	// 			value: 1400000,
	// 			name: '> 5h'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 2

	// 	if ($('#echart_pie_2').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_2'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 3

	// 	if ($('#echart_pie_3').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_3'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 4

	// 	if ($('#echart_pie_4').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_4'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 5

	// 	if ($('#echart_pie_5').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_5'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 6

	// 	if ($('#echart_pie_6').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_6'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 7

	// 	if ($('#echart_pie_7').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_7'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 8

	// 	if ($('#echart_pie_8').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_8'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Not Affected Population', 'Affected Population']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Population Affected',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 27800000,
	// 			name: 'Not Affected Population'
	// 		  }, {
	// 			value: 3300000,
	// 			name: 'Affected Population'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 9

	// 	if ($('#echart_pie_9').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_9'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Affected Settlement', 'Not Affected Settlement']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Earthquake Impact',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 3966,
	// 			name: 'Affected Settlement'
	// 		  }, {
	// 			value: 39723,
	// 			name: 'Not Affected Settlement'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie and Donut

	// 	if ($('#echart_pieDonut').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pieDonut'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Extreme', 'Very High', 'High', 'Moderate', 'Low', 'High', 'Medium', 'Low']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'River Flood',
	// 		  type: 'pie',
	// 		  selectedMode: 'single',
	// 		  radius: [0, '30%'],
	// 		  // center: ['50%', '48%'],

	// 		  label:{
	// 		  	normal:{
	// 		  		position: 'inner'
	// 		  	}
	// 		  },
	// 		  labelLine:{
	// 		  	normal: {
	// 		  		show: false
	// 		  	}
	// 		  },
	// 		  data: [{
	// 			value: 0,
	// 			name: 'Extreme'
	// 		  }, {
	// 			value: 60098,
	// 			name: 'Very High'
	// 		  }, {
	// 			value: 24588,
	// 			name: 'High'
	// 		  }, {
	// 			value: 507510,
	// 			name: 'Moderate'
	// 		  }, {
	// 			value: 653378,
	// 			name: 'Low'
	// 		  }]
	// 		},
	// 		{
	// 			name: 'Flood Risk Level',
	// 			type: 'pie',
	// 			radius: ['40%', '55%'],

	// 			data:[{
	// 				value: 0,
	// 				name: 'High'
	// 			}, {
	// 				value: 0,
	// 				name: 'Medium'
	// 			}, {
	// 				value: 0,
	// 				name: 'Low'
	// 			}, {
	// 				value: 10150,
	// 				name: 'High'
	// 			}, {
	// 				value: 21875,
	// 				name: 'Medium'
	// 			},{
	// 				value: 28073,
	// 				name: 'Low'
	// 			}, {
	// 				value: 11396,
	// 				name: 'High'
	// 			}, {
	// 				value: 8484,
	// 				name: 'Medium'
	// 			}, {
	// 				value: 4708,
	// 				name: 'Low'
	// 			}, {
	// 				value: 161921,
	// 				name: 'High'
	// 			}, {
	// 				value: 149036,
	// 				name: 'Medium'
	// 			}, {
	// 				value: 196553,
	// 				name: 'Low'
	// 			}, {
	// 				value: 177592,
	// 				name: 'High'
	// 			}, {
	// 				value: 238381,
	// 				name: 'Medium'
	// 			}, {
	// 				value: 237405,
	// 				name: 'Low'
	// 			}
	// 			]
	// 		}
	// 		]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	   //echart Mini Pie

	// 	if ($('#echart_mini_pie').length ){

	// 	  var echartMiniPie = echarts.init(document.getElementById('echart_mini_pie'), theme);

	// 	  var dataStyle = {
	// 	      normal: {
	// 	          label: {show:false},
	// 	          labelLine: {show:false}
	// 	      }
	// 	  };
	// 	  var placeHolderStyle = {
	// 	      normal : {
	// 	          color: 'rgba(0,0,0,0)',
	// 	          label: {show:false},
	// 	          labelLine: {show:false}
	// 	      },
	// 	      emphasis : {
	// 	          color: 'rgba(0,0,0,0)'
	// 	      }
	// 	  };

	// 	  echartMiniPie .setOption({
	// 		title: {
	// 		  text: 'Flood Risk',
	// 		  subtext: 'Population at Risk of Flood',
	// 		  // sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
	// 		  x: 'center',
	// 		  y: 'center',
	// 		  itemGap: 20,
	// 		  textStyle: {
	// 			color: 'rgba(30,144,255,0.8)',
	// 			fontFamily: '微软雅黑',
	// 			fontSize: 35,
	// 			fontWeight: 'bolder'
	// 		  }
	// 		},
	// 		tooltip: {
	// 		  show: true,
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  orient: 'vertical',
	// 		  x: '50%',
	// 		  y: 45,
	// 		  itemGap: 12,
	// 		  data: ['Low Risk', 'Medium Risk', 'High Risk'],
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			mark: {
	// 			  show: true
	// 			},
	// 			dataView: {
	// 			  show: true,
	// 			  title: "Text View",
	// 			  lang: [
	// 				"Text View",
	// 				"Close",
	// 				"Refresh",
	// 			  ],
	// 			  readOnly: false
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Flood Risk',
	// 		  type: 'pie',
	// 		  clockWise: false,
	// 		  radius: [105, 130],
	// 		  itemStyle: dataStyle,
	// 		  data: [{
	// 			value: 2600000,
	// 			name: 'Low Risk'
	// 		  }, {
	// 			value: 4500000,
	// 			name: 'Others',
	// 			itemStyle: placeHolderStyle
	// 		  }]
	// 		}, {
	// 		  name: 'Flood Risk',
	// 		  type: 'pie',
	// 		  clockWise: false,
	// 		  radius: [80, 105],
	// 		  itemStyle: dataStyle,
	// 		  data: [{
	// 			value: 2800000,
	// 			name: 'Medium Risk'
	// 		  }, {
	// 			value: 4300000,
	// 			name: 'Others',
	// 			itemStyle: placeHolderStyle
	// 		  }]
	// 		}, {
	// 		  name: 'Flood Risk',
	// 		  type: 'pie',
	// 		  clockWise: false,
	// 		  radius: [25, 80],
	// 		  itemStyle: dataStyle,
	// 		  data: [{
	// 			value: 1700000,
	// 			name: 'High Risk'
	// 		  }, {
	// 			value: 5400000,
	// 			name: 'Others',
	// 			itemStyle: placeHolderStyle
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Mini Pie 2

	// 	if ($('#echart_mini_pie_2').length ){

	// 	  var echartMiniPie = echarts.init(document.getElementById('echart_mini_pie_2'), theme);

	// 	  var dataStyle = {
	// 	      normal: {
	// 	          label: {show:false},
	// 	          labelLine: {show:false}
	// 	      }
	// 	  };
	// 	  var placeHolderStyle = {
	// 	      normal : {
	// 	          color: 'rgba(0,0,0,0)',
	// 	          label: {show:false},
	// 	          labelLine: {show:false}
	// 	      },
	// 	      emphasis : {
	// 	          color: 'rgba(0,0,0,0)'
	// 	      }
	// 	  };

	// 	  echartMiniPie .setOption({
	// 		title: {
	// 		  text: 'Chart #2',
	// 		  subtext: 'From ExcelHome',
	// 		  sublink: 'http://e.weibo.com/1341556070/AhQXtjbqh',
	// 		  x: 'center',
	// 		  y: 'center',
	// 		  itemGap: 20,
	// 		  textStyle: {
	// 			color: 'rgba(30,144,255,0.8)',
	// 			fontFamily: '微软雅黑',
	// 			fontSize: 35,
	// 			fontWeight: 'bolder'
	// 		  }
	// 		},
	// 		tooltip: {
	// 		  show: true,
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  orient: 'vertical',
	// 		  x: '50%',
	// 		  y: 45,
	// 		  itemGap: 12,
	// 		  data: ['68%Something #1', '29%Something #2', '3%Something #3'],
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			mark: {
	// 			  show: true
	// 			},
	// 			dataView: {
	// 			  show: true,
	// 			  title: "Text View",
	// 			  lang: [
	// 				"Text View",
	// 				"Close",
	// 				"Refresh",
	// 			  ],
	// 			  readOnly: false
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: '1',
	// 		  type: 'pie',
	// 		  clockWise: false,
	// 		  radius: [105, 130],
	// 		  itemStyle: dataStyle,
	// 		  data: [{
	// 			value: 68,
	// 			name: '68%Something #1'
	// 		  }, {
	// 			value: 32,
	// 			name: 'invisible',
	// 			itemStyle: placeHolderStyle
	// 		  }]
	// 		}, {
	// 		  name: '2',
	// 		  type: 'pie',
	// 		  clockWise: false,
	// 		  radius: [80, 105],
	// 		  itemStyle: dataStyle,
	// 		  data: [{
	// 			value: 29,
	// 			name: '29%Something #2'
	// 		  }, {
	// 			value: 71,
	// 			name: 'invisible',
	// 			itemStyle: placeHolderStyle
	// 		  }]
	// 		}, {
	// 		  name: '3',
	// 		  type: 'pie',
	// 		  clockWise: false,
	// 		  radius: [25, 80],
	// 		  itemStyle: dataStyle,
	// 		  data: [{
	// 			value: 3,
	// 			name: '3%Something #3'
	// 		  }, {
	// 			value: 97,
	// 			name: 'invisible',
	// 			itemStyle: placeHolderStyle
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	   //echart Map

	// 	if ($('#echart_world_map').length ){

	// 		  var echartMap = echarts.init(document.getElementById('echart_world_map'), theme);


	// 		  echartMap.setOption({
	// 			title: {
	// 			  text: 'World Population (2010)',
	// 			  subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
	// 			  x: 'center',
	// 			  y: 'top'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'item',
	// 			  formatter: function(params) {
	// 				var value = (params.value + '').split('.');
	// 				value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
	// 				return params.seriesName + '<br/>' + params.name + ' : ' + value;
	// 			  }
	// 			},
	// 			toolbox: {
	// 			  show: true,
	// 			  orient: 'vertical',
	// 			  x: 'right',
	// 			  y: 'center',
	// 			  feature: {
	// 				mark: {
	// 				  show: true
	// 				},
	// 				dataView: {
	// 				  show: true,
	// 				  title: "Text View",
	// 				  lang: [
	// 					"Text View",
	// 					"Close",
	// 					"Refresh",
	// 				  ],
	// 				  readOnly: false
	// 				},
	// 				restore: {
	// 				  show: true,
	// 				  title: "Restore"
	// 				},
	// 				saveAsImage: {
	// 				  show: true,
	// 				  title: "Save Image"
	// 				}
	// 			  }
	// 			},
	// 			dataRange: {
	// 			  orient: 'horizontal',
	// 			  min: 0,
	// 			  max: 1000000,
	// 			  text: ['High', 'Low'],
	// 			  realtime: false,
	// 			  calculable: true,
	// 			  color: ['#087E65', '#26B99A', '#CBEAE3']
	// 			},
	// 			series: [{
	// 			  name: 'World Population (2010)',
	// 			  type: 'map',
	// 			  mapType: 'world',
	// 			  roam: false,
	// 			  mapLocation: {
	// 				y: 60
	// 			  },
	// 			  itemStyle: {
	// 				emphasis: {
	// 				  label: {
	// 					show: true
	// 				  }
	// 				}
	// 			  },
	// 			  data: [{
	// 				name: 'Afghanistan',
	// 				value: 28397.812
	// 			  }, {
	// 				name: 'Angola',
	// 				value: 19549.124
	// 			  }, {
	// 				name: 'Albania',
	// 				value: 3150.143
	// 			  }, {
	// 				name: 'United Arab Emirates',
	// 				value: 8441.537
	// 			  }, {
	// 				name: 'Argentina',
	// 				value: 40374.224
	// 			  }, {
	// 				name: 'Armenia',
	// 				value: 2963.496
	// 			  }, {
	// 				name: 'French Southern and Antarctic Lands',
	// 				value: 268.065
	// 			  }, {
	// 				name: 'Australia',
	// 				value: 22404.488
	// 			  }, {
	// 				name: 'Austria',
	// 				value: 8401.924
	// 			  }, {
	// 				name: 'Azerbaijan',
	// 				value: 9094.718
	// 			  }, {
	// 				name: 'Burundi',
	// 				value: 9232.753
	// 			  }, {
	// 				name: 'Belgium',
	// 				value: 10941.288
	// 			  }, {
	// 				name: 'Benin',
	// 				value: 9509.798
	// 			  }, {
	// 				name: 'Burkina Faso',
	// 				value: 15540.284
	// 			  }, {
	// 				name: 'Bangladesh',
	// 				value: 151125.475
	// 			  }, {
	// 				name: 'Bulgaria',
	// 				value: 7389.175
	// 			  }, {
	// 				name: 'The Bahamas',
	// 				value: 66402.316
	// 			  }, {
	// 				name: 'Bosnia and Herzegovina',
	// 				value: 3845.929
	// 			  }, {
	// 				name: 'Belarus',
	// 				value: 9491.07
	// 			  }, {
	// 				name: 'Belize',
	// 				value: 308.595
	// 			  }, {
	// 				name: 'Bermuda',
	// 				value: 64.951
	// 			  }, {
	// 				name: 'Bolivia',
	// 				value: 716.939
	// 			  }, {
	// 				name: 'Brazil',
	// 				value: 195210.154
	// 			  }, {
	// 				name: 'Brunei',
	// 				value: 27.223
	// 			  }, {
	// 				name: 'Bhutan',
	// 				value: 716.939
	// 			  }, {
	// 				name: 'Botswana',
	// 				value: 1969.341
	// 			  }, {
	// 				name: 'Central African Republic',
	// 				value: 4349.921
	// 			  }, {
	// 				name: 'Canada',
	// 				value: 34126.24
	// 			  }, {
	// 				name: 'Switzerland',
	// 				value: 7830.534
	// 			  }, {
	// 				name: 'Chile',
	// 				value: 17150.76
	// 			  }, {
	// 				name: 'China',
	// 				value: 1359821.465
	// 			  }, {
	// 				name: 'Ivory Coast',
	// 				value: 60508.978
	// 			  }, {
	// 				name: 'Cameroon',
	// 				value: 20624.343
	// 			  }, {
	// 				name: 'Democratic Republic of the Congo',
	// 				value: 62191.161
	// 			  }, {
	// 				name: 'Republic of the Congo',
	// 				value: 3573.024
	// 			  }, {
	// 				name: 'Colombia',
	// 				value: 46444.798
	// 			  }, {
	// 				name: 'Costa Rica',
	// 				value: 4669.685
	// 			  }, {
	// 				name: 'Cuba',
	// 				value: 11281.768
	// 			  }, {
	// 				name: 'Northern Cyprus',
	// 				value: 1.468
	// 			  }, {
	// 				name: 'Cyprus',
	// 				value: 1103.685
	// 			  }, {
	// 				name: 'Czech Republic',
	// 				value: 10553.701
	// 			  }, {
	// 				name: 'Germany',
	// 				value: 83017.404
	// 			  }, {
	// 				name: 'Djibouti',
	// 				value: 834.036
	// 			  }, {
	// 				name: 'Denmark',
	// 				value: 5550.959
	// 			  }, {
	// 				name: 'Dominican Republic',
	// 				value: 10016.797
	// 			  }, {
	// 				name: 'Algeria',
	// 				value: 37062.82
	// 			  }, {
	// 				name: 'Ecuador',
	// 				value: 15001.072
	// 			  }, {
	// 				name: 'Egypt',
	// 				value: 78075.705
	// 			  }, {
	// 				name: 'Eritrea',
	// 				value: 5741.159
	// 			  }, {
	// 				name: 'Spain',
	// 				value: 46182.038
	// 			  }, {
	// 				name: 'Estonia',
	// 				value: 1298.533
	// 			  }, {
	// 				name: 'Ethiopia',
	// 				value: 87095.281
	// 			  }, {
	// 				name: 'Finland',
	// 				value: 5367.693
	// 			  }, {
	// 				name: 'Fiji',
	// 				value: 860.559
	// 			  }, {
	// 				name: 'Falkland Islands',
	// 				value: 49.581
	// 			  }, {
	// 				name: 'France',
	// 				value: 63230.866
	// 			  }, {
	// 				name: 'Gabon',
	// 				value: 1556.222
	// 			  }, {
	// 				name: 'United Kingdom',
	// 				value: 62066.35
	// 			  }, {
	// 				name: 'Georgia',
	// 				value: 4388.674
	// 			  }, {
	// 				name: 'Ghana',
	// 				value: 24262.901
	// 			  }, {
	// 				name: 'Guinea',
	// 				value: 10876.033
	// 			  }, {
	// 				name: 'Gambia',
	// 				value: 1680.64
	// 			  }, {
	// 				name: 'Guinea Bissau',
	// 				value: 10876.033
	// 			  }, {
	// 				name: 'Equatorial Guinea',
	// 				value: 696.167
	// 			  }, {
	// 				name: 'Greece',
	// 				value: 11109.999
	// 			  }, {
	// 				name: 'Greenland',
	// 				value: 56.546
	// 			  }, {
	// 				name: 'Guatemala',
	// 				value: 14341.576
	// 			  }, {
	// 				name: 'French Guiana',
	// 				value: 231.169
	// 			  }, {
	// 				name: 'Guyana',
	// 				value: 786.126
	// 			  }, {
	// 				name: 'Honduras',
	// 				value: 7621.204
	// 			  }, {
	// 				name: 'Croatia',
	// 				value: 4338.027
	// 			  }, {
	// 				name: 'Haiti',
	// 				value: 9896.4
	// 			  }, {
	// 				name: 'Hungary',
	// 				value: 10014.633
	// 			  }, {
	// 				name: 'Indonesia',
	// 				value: 240676.485
	// 			  }, {
	// 				name: 'India',
	// 				value: 1205624.648
	// 			  }, {
	// 				name: 'Ireland',
	// 				value: 4467.561
	// 			  }, {
	// 				name: 'Iran',
	// 				value: 240676.485
	// 			  }, {
	// 				name: 'Iraq',
	// 				value: 30962.38
	// 			  }, {
	// 				name: 'Iceland',
	// 				value: 318.042
	// 			  }, {
	// 				name: 'Israel',
	// 				value: 7420.368
	// 			  }, {
	// 				name: 'Italy',
	// 				value: 60508.978
	// 			  }, {
	// 				name: 'Jamaica',
	// 				value: 2741.485
	// 			  }, {
	// 				name: 'Jordan',
	// 				value: 6454.554
	// 			  }, {
	// 				name: 'Japan',
	// 				value: 127352.833
	// 			  }, {
	// 				name: 'Kazakhstan',
	// 				value: 15921.127
	// 			  }, {
	// 				name: 'Kenya',
	// 				value: 40909.194
	// 			  }, {
	// 				name: 'Kyrgyzstan',
	// 				value: 5334.223
	// 			  }, {
	// 				name: 'Cambodia',
	// 				value: 14364.931
	// 			  }, {
	// 				name: 'South Korea',
	// 				value: 51452.352
	// 			  }, {
	// 				name: 'Kosovo',
	// 				value: 97.743
	// 			  }, {
	// 				name: 'Kuwait',
	// 				value: 2991.58
	// 			  }, {
	// 				name: 'Laos',
	// 				value: 6395.713
	// 			  }, {
	// 				name: 'Lebanon',
	// 				value: 4341.092
	// 			  }, {
	// 				name: 'Liberia',
	// 				value: 3957.99
	// 			  }, {
	// 				name: 'Libya',
	// 				value: 6040.612
	// 			  }, {
	// 				name: 'Sri Lanka',
	// 				value: 20758.779
	// 			  }, {
	// 				name: 'Lesotho',
	// 				value: 2008.921
	// 			  }, {
	// 				name: 'Lithuania',
	// 				value: 3068.457
	// 			  }, {
	// 				name: 'Luxembourg',
	// 				value: 507.885
	// 			  }, {
	// 				name: 'Latvia',
	// 				value: 2090.519
	// 			  }, {
	// 				name: 'Morocco',
	// 				value: 31642.36
	// 			  }, {
	// 				name: 'Moldova',
	// 				value: 103.619
	// 			  }, {
	// 				name: 'Madagascar',
	// 				value: 21079.532
	// 			  }, {
	// 				name: 'Mexico',
	// 				value: 117886.404
	// 			  }, {
	// 				name: 'Macedonia',
	// 				value: 507.885
	// 			  }, {
	// 				name: 'Mali',
	// 				value: 13985.961
	// 			  }, {
	// 				name: 'Myanmar',
	// 				value: 51931.231
	// 			  }, {
	// 				name: 'Montenegro',
	// 				value: 620.078
	// 			  }, {
	// 				name: 'Mongolia',
	// 				value: 2712.738
	// 			  }, {
	// 				name: 'Mozambique',
	// 				value: 23967.265
	// 			  }, {
	// 				name: 'Mauritania',
	// 				value: 3609.42
	// 			  }, {
	// 				name: 'Malawi',
	// 				value: 15013.694
	// 			  }, {
	// 				name: 'Malaysia',
	// 				value: 28275.835
	// 			  }, {
	// 				name: 'Namibia',
	// 				value: 2178.967
	// 			  }, {
	// 				name: 'New Caledonia',
	// 				value: 246.379
	// 			  }, {
	// 				name: 'Niger',
	// 				value: 15893.746
	// 			  }, {
	// 				name: 'Nigeria',
	// 				value: 159707.78
	// 			  }, {
	// 				name: 'Nicaragua',
	// 				value: 5822.209
	// 			  }, {
	// 				name: 'Netherlands',
	// 				value: 16615.243
	// 			  }, {
	// 				name: 'Norway',
	// 				value: 4891.251
	// 			  }, {
	// 				name: 'Nepal',
	// 				value: 26846.016
	// 			  }, {
	// 				name: 'New Zealand',
	// 				value: 4368.136
	// 			  }, {
	// 				name: 'Oman',
	// 				value: 2802.768
	// 			  }, {
	// 				name: 'Pakistan',
	// 				value: 173149.306
	// 			  }, {
	// 				name: 'Panama',
	// 				value: 3678.128
	// 			  }, {
	// 				name: 'Peru',
	// 				value: 29262.83
	// 			  }, {
	// 				name: 'Philippines',
	// 				value: 93444.322
	// 			  }, {
	// 				name: 'Papua New Guinea',
	// 				value: 6858.945
	// 			  }, {
	// 				name: 'Poland',
	// 				value: 38198.754
	// 			  }, {
	// 				name: 'Puerto Rico',
	// 				value: 3709.671
	// 			  }, {
	// 				name: 'North Korea',
	// 				value: 1.468
	// 			  }, {
	// 				name: 'Portugal',
	// 				value: 10589.792
	// 			  }, {
	// 				name: 'Paraguay',
	// 				value: 6459.721
	// 			  }, {
	// 				name: 'Qatar',
	// 				value: 1749.713
	// 			  }, {
	// 				name: 'Romania',
	// 				value: 21861.476
	// 			  }, {
	// 				name: 'Russia',
	// 				value: 21861.476
	// 			  }, {
	// 				name: 'Rwanda',
	// 				value: 10836.732
	// 			  }, {
	// 				name: 'Western Sahara',
	// 				value: 514.648
	// 			  }, {
	// 				name: 'Saudi Arabia',
	// 				value: 27258.387
	// 			  }, {
	// 				name: 'Sudan',
	// 				value: 35652.002
	// 			  }, {
	// 				name: 'South Sudan',
	// 				value: 9940.929
	// 			  }, {
	// 				name: 'Senegal',
	// 				value: 12950.564
	// 			  }, {
	// 				name: 'Solomon Islands',
	// 				value: 526.447
	// 			  }, {
	// 				name: 'Sierra Leone',
	// 				value: 5751.976
	// 			  }, {
	// 				name: 'El Salvador',
	// 				value: 6218.195
	// 			  }, {
	// 				name: 'Somaliland',
	// 				value: 9636.173
	// 			  }, {
	// 				name: 'Somalia',
	// 				value: 9636.173
	// 			  }, {
	// 				name: 'Republic of Serbia',
	// 				value: 3573.024
	// 			  }, {
	// 				name: 'Suriname',
	// 				value: 524.96
	// 			  }, {
	// 				name: 'Slovakia',
	// 				value: 5433.437
	// 			  }, {
	// 				name: 'Slovenia',
	// 				value: 2054.232
	// 			  }, {
	// 				name: 'Sweden',
	// 				value: 9382.297
	// 			  }, {
	// 				name: 'Swaziland',
	// 				value: 1193.148
	// 			  }, {
	// 				name: 'Syria',
	// 				value: 7830.534
	// 			  }, {
	// 				name: 'Chad',
	// 				value: 11720.781
	// 			  }, {
	// 				name: 'Togo',
	// 				value: 6306.014
	// 			  }, {
	// 				name: 'Thailand',
	// 				value: 66402.316
	// 			  }, {
	// 				name: 'Tajikistan',
	// 				value: 7627.326
	// 			  }, {
	// 				name: 'Turkmenistan',
	// 				value: 5041.995
	// 			  }, {
	// 				name: 'East Timor',
	// 				value: 10016.797
	// 			  }, {
	// 				name: 'Trinidad and Tobago',
	// 				value: 1328.095
	// 			  }, {
	// 				name: 'Tunisia',
	// 				value: 10631.83
	// 			  }, {
	// 				name: 'Turkey',
	// 				value: 72137.546
	// 			  }, {
	// 				name: 'United Republic of Tanzania',
	// 				value: 44973.33
	// 			  }, {
	// 				name: 'Uganda',
	// 				value: 33987.213
	// 			  }, {
	// 				name: 'Ukraine',
	// 				value: 46050.22
	// 			  }, {
	// 				name: 'Uruguay',
	// 				value: 3371.982
	// 			  }, {
	// 				name: 'United States of America',
	// 				value: 312247.116
	// 			  }, {
	// 				name: 'Uzbekistan',
	// 				value: 27769.27
	// 			  }, {
	// 				name: 'Venezuela',
	// 				value: 236.299
	// 			  }, {
	// 				name: 'Vietnam',
	// 				value: 89047.397
	// 			  }, {
	// 				name: 'Vanuatu',
	// 				value: 236.299
	// 			  }, {
	// 				name: 'West Bank',
	// 				value: 13.565
	// 			  }, {
	// 				name: 'Yemen',
	// 				value: 22763.008
	// 			  }, {
	// 				name: 'South Africa',
	// 				value: 51452.352
	// 			  }, {
	// 				name: 'Zambia',
	// 				value: 13216.985
	// 			  }, {
	// 				name: 'Zimbabwe',
	// 				value: 13076.978
	// 			  }]
	// 			}]
	// 		  });

	// 	}

	// 	// echart Map 2

	// 	if ($('#echart_world_map_2').length ){

	// 		  var echartMap2 = echarts.init(document.getElementById('echart_world_map_2'), theme);


	// 		  echartMap2.setOption({
	// 			title: {
	// 			  text: 'World Population (2010)',
	// 			  subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
	// 			  x: 'center',
	// 			  y: 'top'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'item',
	// 			  formatter: function(params) {
	// 				var value = (params.value + '').split('.');
	// 				value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
	// 				return params.seriesName + '<br/>' + params.name + ' : ' + value;
	// 			  }
	// 			},
	// 			toolbox: {
	// 			  show: true,
	// 			  orient: 'vertical',
	// 			  x: 'right',
	// 			  y: 'center',
	// 			  feature: {
	// 				mark: {
	// 				  show: true
	// 				},
	// 				dataView: {
	// 				  show: true,
	// 				  title: "Text View",
	// 				  lang: [
	// 					"Text View",
	// 					"Close",
	// 					"Refresh",
	// 				  ],
	// 				  readOnly: false
	// 				},
	// 				restore: {
	// 				  show: true,
	// 				  title: "Restore"
	// 				},
	// 				saveAsImage: {
	// 				  show: true,
	// 				  title: "Save Image"
	// 				}
	// 			  }
	// 			},
	// 			dataRange: {
	// 			  min: 0,
	// 			  max: 1000000,
	// 			  text: ['High', 'Low'],
	// 			  realtime: false,
	// 			  calculable: true,
	// 			  color: ['#087E65', '#26B99A', '#CBEAE3']
	// 			},
	// 			series: [{
	// 			  name: 'World Population (2010)',
	// 			  type: 'map',
	// 			  mapType: 'world',
	// 			  roam: false,
	// 			  mapLocation: {
	// 				y: 60
	// 			  },
	// 			  itemStyle: {
	// 				emphasis: {
	// 				  label: {
	// 					show: true
	// 				  }
	// 				}
	// 			  },
	// 			  data: [{
	// 				name: 'Afghanistan',
	// 				value: 28397.812
	// 			  }, {
	// 				name: 'Angola',
	// 				value: 19549.124
	// 			  }, {
	// 				name: 'Albania',
	// 				value: 3150.143
	// 			  }, {
	// 				name: 'United Arab Emirates',
	// 				value: 8441.537
	// 			  }, {
	// 				name: 'Argentina',
	// 				value: 40374.224
	// 			  }, {
	// 				name: 'Armenia',
	// 				value: 2963.496
	// 			  }, {
	// 				name: 'French Southern and Antarctic Lands',
	// 				value: 268.065
	// 			  }, {
	// 				name: 'Australia',
	// 				value: 22404.488
	// 			  }, {
	// 				name: 'Austria',
	// 				value: 8401.924
	// 			  }, {
	// 				name: 'Azerbaijan',
	// 				value: 9094.718
	// 			  }, {
	// 				name: 'Burundi',
	// 				value: 9232.753
	// 			  }, {
	// 				name: 'Belgium',
	// 				value: 10941.288
	// 			  }, {
	// 				name: 'Benin',
	// 				value: 9509.798
	// 			  }, {
	// 				name: 'Burkina Faso',
	// 				value: 15540.284
	// 			  }, {
	// 				name: 'Bangladesh',
	// 				value: 151125.475
	// 			  }, {
	// 				name: 'Bulgaria',
	// 				value: 7389.175
	// 			  }, {
	// 				name: 'The Bahamas',
	// 				value: 66402.316
	// 			  }, {
	// 				name: 'Bosnia and Herzegovina',
	// 				value: 3845.929
	// 			  }, {
	// 				name: 'Belarus',
	// 				value: 9491.07
	// 			  }, {
	// 				name: 'Belize',
	// 				value: 308.595
	// 			  }, {
	// 				name: 'Bermuda',
	// 				value: 64.951
	// 			  }, {
	// 				name: 'Bolivia',
	// 				value: 716.939
	// 			  }, {
	// 				name: 'Brazil',
	// 				value: 195210.154
	// 			  }, {
	// 				name: 'Brunei',
	// 				value: 27.223
	// 			  }, {
	// 				name: 'Bhutan',
	// 				value: 716.939
	// 			  }, {
	// 				name: 'Botswana',
	// 				value: 1969.341
	// 			  }, {
	// 				name: 'Central African Republic',
	// 				value: 4349.921
	// 			  }, {
	// 				name: 'Canada',
	// 				value: 34126.24
	// 			  }, {
	// 				name: 'Switzerland',
	// 				value: 7830.534
	// 			  }, {
	// 				name: 'Chile',
	// 				value: 17150.76
	// 			  }, {
	// 				name: 'China',
	// 				value: 1359821.465
	// 			  }, {
	// 				name: 'Ivory Coast',
	// 				value: 60508.978
	// 			  }, {
	// 				name: 'Cameroon',
	// 				value: 20624.343
	// 			  }, {
	// 				name: 'Democratic Republic of the Congo',
	// 				value: 62191.161
	// 			  }, {
	// 				name: 'Republic of the Congo',
	// 				value: 3573.024
	// 			  }, {
	// 				name: 'Colombia',
	// 				value: 46444.798
	// 			  }, {
	// 				name: 'Costa Rica',
	// 				value: 4669.685
	// 			  }, {
	// 				name: 'Cuba',
	// 				value: 11281.768
	// 			  }, {
	// 				name: 'Northern Cyprus',
	// 				value: 1.468
	// 			  }, {
	// 				name: 'Cyprus',
	// 				value: 1103.685
	// 			  }, {
	// 				name: 'Czech Republic',
	// 				value: 10553.701
	// 			  }, {
	// 				name: 'Germany',
	// 				value: 83017.404
	// 			  }, {
	// 				name: 'Djibouti',
	// 				value: 834.036
	// 			  }, {
	// 				name: 'Denmark',
	// 				value: 5550.959
	// 			  }, {
	// 				name: 'Dominican Republic',
	// 				value: 10016.797
	// 			  }, {
	// 				name: 'Algeria',
	// 				value: 37062.82
	// 			  }, {
	// 				name: 'Ecuador',
	// 				value: 15001.072
	// 			  }, {
	// 				name: 'Egypt',
	// 				value: 78075.705
	// 			  }, {
	// 				name: 'Eritrea',
	// 				value: 5741.159
	// 			  }, {
	// 				name: 'Spain',
	// 				value: 46182.038
	// 			  }, {
	// 				name: 'Estonia',
	// 				value: 1298.533
	// 			  }, {
	// 				name: 'Ethiopia',
	// 				value: 87095.281
	// 			  }, {
	// 				name: 'Finland',
	// 				value: 5367.693
	// 			  }, {
	// 				name: 'Fiji',
	// 				value: 860.559
	// 			  }, {
	// 				name: 'Falkland Islands',
	// 				value: 49.581
	// 			  }, {
	// 				name: 'France',
	// 				value: 63230.866
	// 			  }, {
	// 				name: 'Gabon',
	// 				value: 1556.222
	// 			  }, {
	// 				name: 'United Kingdom',
	// 				value: 62066.35
	// 			  }, {
	// 				name: 'Georgia',
	// 				value: 4388.674
	// 			  }, {
	// 				name: 'Ghana',
	// 				value: 24262.901
	// 			  }, {
	// 				name: 'Guinea',
	// 				value: 10876.033
	// 			  }, {
	// 				name: 'Gambia',
	// 				value: 1680.64
	// 			  }, {
	// 				name: 'Guinea Bissau',
	// 				value: 10876.033
	// 			  }, {
	// 				name: 'Equatorial Guinea',
	// 				value: 696.167
	// 			  }, {
	// 				name: 'Greece',
	// 				value: 11109.999
	// 			  }, {
	// 				name: 'Greenland',
	// 				value: 56.546
	// 			  }, {
	// 				name: 'Guatemala',
	// 				value: 14341.576
	// 			  }, {
	// 				name: 'French Guiana',
	// 				value: 231.169
	// 			  }, {
	// 				name: 'Guyana',
	// 				value: 786.126
	// 			  }, {
	// 				name: 'Honduras',
	// 				value: 7621.204
	// 			  }, {
	// 				name: 'Croatia',
	// 				value: 4338.027
	// 			  }, {
	// 				name: 'Haiti',
	// 				value: 9896.4
	// 			  }, {
	// 				name: 'Hungary',
	// 				value: 10014.633
	// 			  }, {
	// 				name: 'Indonesia',
	// 				value: 240676.485
	// 			  }, {
	// 				name: 'India',
	// 				value: 1205624.648
	// 			  }, {
	// 				name: 'Ireland',
	// 				value: 4467.561
	// 			  }, {
	// 				name: 'Iran',
	// 				value: 240676.485
	// 			  }, {
	// 				name: 'Iraq',
	// 				value: 30962.38
	// 			  }, {
	// 				name: 'Iceland',
	// 				value: 318.042
	// 			  }, {
	// 				name: 'Israel',
	// 				value: 7420.368
	// 			  }, {
	// 				name: 'Italy',
	// 				value: 60508.978
	// 			  }, {
	// 				name: 'Jamaica',
	// 				value: 2741.485
	// 			  }, {
	// 				name: 'Jordan',
	// 				value: 6454.554
	// 			  }, {
	// 				name: 'Japan',
	// 				value: 127352.833
	// 			  }, {
	// 				name: 'Kazakhstan',
	// 				value: 15921.127
	// 			  }, {
	// 				name: 'Kenya',
	// 				value: 40909.194
	// 			  }, {
	// 				name: 'Kyrgyzstan',
	// 				value: 5334.223
	// 			  }, {
	// 				name: 'Cambodia',
	// 				value: 14364.931
	// 			  }, {
	// 				name: 'South Korea',
	// 				value: 51452.352
	// 			  }, {
	// 				name: 'Kosovo',
	// 				value: 97.743
	// 			  }, {
	// 				name: 'Kuwait',
	// 				value: 2991.58
	// 			  }, {
	// 				name: 'Laos',
	// 				value: 6395.713
	// 			  }, {
	// 				name: 'Lebanon',
	// 				value: 4341.092
	// 			  }, {
	// 				name: 'Liberia',
	// 				value: 3957.99
	// 			  }, {
	// 				name: 'Libya',
	// 				value: 6040.612
	// 			  }, {
	// 				name: 'Sri Lanka',
	// 				value: 20758.779
	// 			  }, {
	// 				name: 'Lesotho',
	// 				value: 2008.921
	// 			  }, {
	// 				name: 'Lithuania',
	// 				value: 3068.457
	// 			  }, {
	// 				name: 'Luxembourg',
	// 				value: 507.885
	// 			  }, {
	// 				name: 'Latvia',
	// 				value: 2090.519
	// 			  }, {
	// 				name: 'Morocco',
	// 				value: 31642.36
	// 			  }, {
	// 				name: 'Moldova',
	// 				value: 103.619
	// 			  }, {
	// 				name: 'Madagascar',
	// 				value: 21079.532
	// 			  }, {
	// 				name: 'Mexico',
	// 				value: 117886.404
	// 			  }, {
	// 				name: 'Macedonia',
	// 				value: 507.885
	// 			  }, {
	// 				name: 'Mali',
	// 				value: 13985.961
	// 			  }, {
	// 				name: 'Myanmar',
	// 				value: 51931.231
	// 			  }, {
	// 				name: 'Montenegro',
	// 				value: 620.078
	// 			  }, {
	// 				name: 'Mongolia',
	// 				value: 2712.738
	// 			  }, {
	// 				name: 'Mozambique',
	// 				value: 23967.265
	// 			  }, {
	// 				name: 'Mauritania',
	// 				value: 3609.42
	// 			  }, {
	// 				name: 'Malawi',
	// 				value: 15013.694
	// 			  }, {
	// 				name: 'Malaysia',
	// 				value: 28275.835
	// 			  }, {
	// 				name: 'Namibia',
	// 				value: 2178.967
	// 			  }, {
	// 				name: 'New Caledonia',
	// 				value: 246.379
	// 			  }, {
	// 				name: 'Niger',
	// 				value: 15893.746
	// 			  }, {
	// 				name: 'Nigeria',
	// 				value: 159707.78
	// 			  }, {
	// 				name: 'Nicaragua',
	// 				value: 5822.209
	// 			  }, {
	// 				name: 'Netherlands',
	// 				value: 16615.243
	// 			  }, {
	// 				name: 'Norway',
	// 				value: 4891.251
	// 			  }, {
	// 				name: 'Nepal',
	// 				value: 26846.016
	// 			  }, {
	// 				name: 'New Zealand',
	// 				value: 4368.136
	// 			  }, {
	// 				name: 'Oman',
	// 				value: 2802.768
	// 			  }, {
	// 				name: 'Pakistan',
	// 				value: 173149.306
	// 			  }, {
	// 				name: 'Panama',
	// 				value: 3678.128
	// 			  }, {
	// 				name: 'Peru',
	// 				value: 29262.83
	// 			  }, {
	// 				name: 'Philippines',
	// 				value: 93444.322
	// 			  }, {
	// 				name: 'Papua New Guinea',
	// 				value: 6858.945
	// 			  }, {
	// 				name: 'Poland',
	// 				value: 38198.754
	// 			  }, {
	// 				name: 'Puerto Rico',
	// 				value: 3709.671
	// 			  }, {
	// 				name: 'North Korea',
	// 				value: 1.468
	// 			  }, {
	// 				name: 'Portugal',
	// 				value: 10589.792
	// 			  }, {
	// 				name: 'Paraguay',
	// 				value: 6459.721
	// 			  }, {
	// 				name: 'Qatar',
	// 				value: 1749.713
	// 			  }, {
	// 				name: 'Romania',
	// 				value: 21861.476
	// 			  }, {
	// 				name: 'Russia',
	// 				value: 21861.476
	// 			  }, {
	// 				name: 'Rwanda',
	// 				value: 10836.732
	// 			  }, {
	// 				name: 'Western Sahara',
	// 				value: 514.648
	// 			  }, {
	// 				name: 'Saudi Arabia',
	// 				value: 27258.387
	// 			  }, {
	// 				name: 'Sudan',
	// 				value: 35652.002
	// 			  }, {
	// 				name: 'South Sudan',
	// 				value: 9940.929
	// 			  }, {
	// 				name: 'Senegal',
	// 				value: 12950.564
	// 			  }, {
	// 				name: 'Solomon Islands',
	// 				value: 526.447
	// 			  }, {
	// 				name: 'Sierra Leone',
	// 				value: 5751.976
	// 			  }, {
	// 				name: 'El Salvador',
	// 				value: 6218.195
	// 			  }, {
	// 				name: 'Somaliland',
	// 				value: 9636.173
	// 			  }, {
	// 				name: 'Somalia',
	// 				value: 9636.173
	// 			  }, {
	// 				name: 'Republic of Serbia',
	// 				value: 3573.024
	// 			  }, {
	// 				name: 'Suriname',
	// 				value: 524.96
	// 			  }, {
	// 				name: 'Slovakia',
	// 				value: 5433.437
	// 			  }, {
	// 				name: 'Slovenia',
	// 				value: 2054.232
	// 			  }, {
	// 				name: 'Sweden',
	// 				value: 9382.297
	// 			  }, {
	// 				name: 'Swaziland',
	// 				value: 1193.148
	// 			  }, {
	// 				name: 'Syria',
	// 				value: 7830.534
	// 			  }, {
	// 				name: 'Chad',
	// 				value: 11720.781
	// 			  }, {
	// 				name: 'Togo',
	// 				value: 6306.014
	// 			  }, {
	// 				name: 'Thailand',
	// 				value: 66402.316
	// 			  }, {
	// 				name: 'Tajikistan',
	// 				value: 7627.326
	// 			  }, {
	// 				name: 'Turkmenistan',
	// 				value: 5041.995
	// 			  }, {
	// 				name: 'East Timor',
	// 				value: 10016.797
	// 			  }, {
	// 				name: 'Trinidad and Tobago',
	// 				value: 1328.095
	// 			  }, {
	// 				name: 'Tunisia',
	// 				value: 10631.83
	// 			  }, {
	// 				name: 'Turkey',
	// 				value: 72137.546
	// 			  }, {
	// 				name: 'United Republic of Tanzania',
	// 				value: 44973.33
	// 			  }, {
	// 				name: 'Uganda',
	// 				value: 33987.213
	// 			  }, {
	// 				name: 'Ukraine',
	// 				value: 46050.22
	// 			  }, {
	// 				name: 'Uruguay',
	// 				value: 3371.982
	// 			  }, {
	// 				name: 'United States of America',
	// 				value: 312247.116
	// 			  }, {
	// 				name: 'Uzbekistan',
	// 				value: 27769.27
	// 			  }, {
	// 				name: 'Venezuela',
	// 				value: 236.299
	// 			  }, {
	// 				name: 'Vietnam',
	// 				value: 89047.397
	// 			  }, {
	// 				name: 'Vanuatu',
	// 				value: 236.299
	// 			  }, {
	// 				name: 'West Bank',
	// 				value: 13.565
	// 			  }, {
	// 				name: 'Yemen',
	// 				value: 22763.008
	// 			  }, {
	// 				name: 'South Africa',
	// 				value: 51452.352
	// 			  }, {
	// 				name: 'Zambia',
	// 				value: 13216.985
	// 			  }, {
	// 				name: 'Zimbabwe',
	// 				value: 13076.978
	// 			  }]
	// 			}]
	// 		  });

	// 	}

	// 	// echart Map 3

	// 	if ($('#echart_world_map_3').length ){

	// 		  var echartMap2 = echarts.init(document.getElementById('echart_world_map_3'), theme);


	// 		  echartMap2.setOption({
	// 			title: {
	// 			  text: 'World Population (2010)',
	// 			  subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
	// 			  x: 'center',
	// 			  y: 'top'
	// 			},
	// 			tooltip: {
	// 			  trigger: 'item',
	// 			  formatter: function(params) {
	// 				var value = (params.value + '').split('.');
	// 				value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
	// 				return params.seriesName + '<br/>' + params.name + ' : ' + value;
	// 			  }
	// 			},
	// 			toolbox: {
	// 			  show: true,
	// 			  orient: 'vertical',
	// 			  x: 'right',
	// 			  y: 'center',
	// 			  feature: {
	// 				mark: {
	// 				  show: true
	// 				},
	// 				dataView: {
	// 				  show: true,
	// 				  title: "Text View",
	// 				  lang: [
	// 					"Text View",
	// 					"Close",
	// 					"Refresh",
	// 				  ],
	// 				  readOnly: false
	// 				},
	// 				restore: {
	// 				  show: true,
	// 				  title: "Restore"
	// 				},
	// 				saveAsImage: {
	// 				  show: true,
	// 				  title: "Save Image"
	// 				}
	// 			  }
	// 			},
	// 			dataRange: {
	// 			  min: 0,
	// 			  max: 1000000,
	// 			  text: ['High', 'Low'],
	// 			  realtime: false,
	// 			  calculable: true,
	// 			  color: ['#087E65', '#26B99A', '#CBEAE3']
	// 			},
	// 			series: [{
	// 			  name: 'World Population (2010)',
	// 			  type: 'map',
	// 			  mapType: 'world',
	// 			  roam: false,
	// 			  mapLocation: {
	// 				y: 60
	// 			  },
	// 			  itemStyle: {
	// 				emphasis: {
	// 				  label: {
	// 					show: true
	// 				  }
	// 				}
	// 			  },
	// 			  data: [{
	// 				name: 'Afghanistan',
	// 				value: 28397.812
	// 			  }, {
	// 				name: 'Angola',
	// 				value: 19549.124
	// 			  }, {
	// 				name: 'Albania',
	// 				value: 3150.143
	// 			  }, {
	// 				name: 'United Arab Emirates',
	// 				value: 8441.537
	// 			  }, {
	// 				name: 'Argentina',
	// 				value: 40374.224
	// 			  }, {
	// 				name: 'Armenia',
	// 				value: 2963.496
	// 			  }, {
	// 				name: 'French Southern and Antarctic Lands',
	// 				value: 268.065
	// 			  }, {
	// 				name: 'Australia',
	// 				value: 22404.488
	// 			  }, {
	// 				name: 'Austria',
	// 				value: 8401.924
	// 			  }, {
	// 				name: 'Azerbaijan',
	// 				value: 9094.718
	// 			  }, {
	// 				name: 'Burundi',
	// 				value: 9232.753
	// 			  }, {
	// 				name: 'Belgium',
	// 				value: 10941.288
	// 			  }, {
	// 				name: 'Benin',
	// 				value: 9509.798
	// 			  }, {
	// 				name: 'Burkina Faso',
	// 				value: 15540.284
	// 			  }, {
	// 				name: 'Bangladesh',
	// 				value: 151125.475
	// 			  }, {
	// 				name: 'Bulgaria',
	// 				value: 7389.175
	// 			  }, {
	// 				name: 'The Bahamas',
	// 				value: 66402.316
	// 			  }, {
	// 				name: 'Bosnia and Herzegovina',
	// 				value: 3845.929
	// 			  }, {
	// 				name: 'Belarus',
	// 				value: 9491.07
	// 			  }, {
	// 				name: 'Belize',
	// 				value: 308.595
	// 			  }, {
	// 				name: 'Bermuda',
	// 				value: 64.951
	// 			  }, {
	// 				name: 'Bolivia',
	// 				value: 716.939
	// 			  }, {
	// 				name: 'Brazil',
	// 				value: 195210.154
	// 			  }, {
	// 				name: 'Brunei',
	// 				value: 27.223
	// 			  }, {
	// 				name: 'Bhutan',
	// 				value: 716.939
	// 			  }, {
	// 				name: 'Botswana',
	// 				value: 1969.341
	// 			  }, {
	// 				name: 'Central African Republic',
	// 				value: 4349.921
	// 			  }, {
	// 				name: 'Canada',
	// 				value: 34126.24
	// 			  }, {
	// 				name: 'Switzerland',
	// 				value: 7830.534
	// 			  }, {
	// 				name: 'Chile',
	// 				value: 17150.76
	// 			  }, {
	// 				name: 'China',
	// 				value: 1359821.465
	// 			  }, {
	// 				name: 'Ivory Coast',
	// 				value: 60508.978
	// 			  }, {
	// 				name: 'Cameroon',
	// 				value: 20624.343
	// 			  }, {
	// 				name: 'Democratic Republic of the Congo',
	// 				value: 62191.161
	// 			  }, {
	// 				name: 'Republic of the Congo',
	// 				value: 3573.024
	// 			  }, {
	// 				name: 'Colombia',
	// 				value: 46444.798
	// 			  }, {
	// 				name: 'Costa Rica',
	// 				value: 4669.685
	// 			  }, {
	// 				name: 'Cuba',
	// 				value: 11281.768
	// 			  }, {
	// 				name: 'Northern Cyprus',
	// 				value: 1.468
	// 			  }, {
	// 				name: 'Cyprus',
	// 				value: 1103.685
	// 			  }, {
	// 				name: 'Czech Republic',
	// 				value: 10553.701
	// 			  }, {
	// 				name: 'Germany',
	// 				value: 83017.404
	// 			  }, {
	// 				name: 'Djibouti',
	// 				value: 834.036
	// 			  }, {
	// 				name: 'Denmark',
	// 				value: 5550.959
	// 			  }, {
	// 				name: 'Dominican Republic',
	// 				value: 10016.797
	// 			  }, {
	// 				name: 'Algeria',
	// 				value: 37062.82
	// 			  }, {
	// 				name: 'Ecuador',
	// 				value: 15001.072
	// 			  }, {
	// 				name: 'Egypt',
	// 				value: 78075.705
	// 			  }, {
	// 				name: 'Eritrea',
	// 				value: 5741.159
	// 			  }, {
	// 				name: 'Spain',
	// 				value: 46182.038
	// 			  }, {
	// 				name: 'Estonia',
	// 				value: 1298.533
	// 			  }, {
	// 				name: 'Ethiopia',
	// 				value: 87095.281
	// 			  }, {
	// 				name: 'Finland',
	// 				value: 5367.693
	// 			  }, {
	// 				name: 'Fiji',
	// 				value: 860.559
	// 			  }, {
	// 				name: 'Falkland Islands',
	// 				value: 49.581
	// 			  }, {
	// 				name: 'France',
	// 				value: 63230.866
	// 			  }, {
	// 				name: 'Gabon',
	// 				value: 1556.222
	// 			  }, {
	// 				name: 'United Kingdom',
	// 				value: 62066.35
	// 			  }, {
	// 				name: 'Georgia',
	// 				value: 4388.674
	// 			  }, {
	// 				name: 'Ghana',
	// 				value: 24262.901
	// 			  }, {
	// 				name: 'Guinea',
	// 				value: 10876.033
	// 			  }, {
	// 				name: 'Gambia',
	// 				value: 1680.64
	// 			  }, {
	// 				name: 'Guinea Bissau',
	// 				value: 10876.033
	// 			  }, {
	// 				name: 'Equatorial Guinea',
	// 				value: 696.167
	// 			  }, {
	// 				name: 'Greece',
	// 				value: 11109.999
	// 			  }, {
	// 				name: 'Greenland',
	// 				value: 56.546
	// 			  }, {
	// 				name: 'Guatemala',
	// 				value: 14341.576
	// 			  }, {
	// 				name: 'French Guiana',
	// 				value: 231.169
	// 			  }, {
	// 				name: 'Guyana',
	// 				value: 786.126
	// 			  }, {
	// 				name: 'Honduras',
	// 				value: 7621.204
	// 			  }, {
	// 				name: 'Croatia',
	// 				value: 4338.027
	// 			  }, {
	// 				name: 'Haiti',
	// 				value: 9896.4
	// 			  }, {
	// 				name: 'Hungary',
	// 				value: 10014.633
	// 			  }, {
	// 				name: 'Indonesia',
	// 				value: 240676.485
	// 			  }, {
	// 				name: 'India',
	// 				value: 1205624.648
	// 			  }, {
	// 				name: 'Ireland',
	// 				value: 4467.561
	// 			  }, {
	// 				name: 'Iran',
	// 				value: 240676.485
	// 			  }, {
	// 				name: 'Iraq',
	// 				value: 30962.38
	// 			  }, {
	// 				name: 'Iceland',
	// 				value: 318.042
	// 			  }, {
	// 				name: 'Israel',
	// 				value: 7420.368
	// 			  }, {
	// 				name: 'Italy',
	// 				value: 60508.978
	// 			  }, {
	// 				name: 'Jamaica',
	// 				value: 2741.485
	// 			  }, {
	// 				name: 'Jordan',
	// 				value: 6454.554
	// 			  }, {
	// 				name: 'Japan',
	// 				value: 127352.833
	// 			  }, {
	// 				name: 'Kazakhstan',
	// 				value: 15921.127
	// 			  }, {
	// 				name: 'Kenya',
	// 				value: 40909.194
	// 			  }, {
	// 				name: 'Kyrgyzstan',
	// 				value: 5334.223
	// 			  }, {
	// 				name: 'Cambodia',
	// 				value: 14364.931
	// 			  }, {
	// 				name: 'South Korea',
	// 				value: 51452.352
	// 			  }, {
	// 				name: 'Kosovo',
	// 				value: 97.743
	// 			  }, {
	// 				name: 'Kuwait',
	// 				value: 2991.58
	// 			  }, {
	// 				name: 'Laos',
	// 				value: 6395.713
	// 			  }, {
	// 				name: 'Lebanon',
	// 				value: 4341.092
	// 			  }, {
	// 				name: 'Liberia',
	// 				value: 3957.99
	// 			  }, {
	// 				name: 'Libya',
	// 				value: 6040.612
	// 			  }, {
	// 				name: 'Sri Lanka',
	// 				value: 20758.779
	// 			  }, {
	// 				name: 'Lesotho',
	// 				value: 2008.921
	// 			  }, {
	// 				name: 'Lithuania',
	// 				value: 3068.457
	// 			  }, {
	// 				name: 'Luxembourg',
	// 				value: 507.885
	// 			  }, {
	// 				name: 'Latvia',
	// 				value: 2090.519
	// 			  }, {
	// 				name: 'Morocco',
	// 				value: 31642.36
	// 			  }, {
	// 				name: 'Moldova',
	// 				value: 103.619
	// 			  }, {
	// 				name: 'Madagascar',
	// 				value: 21079.532
	// 			  }, {
	// 				name: 'Mexico',
	// 				value: 117886.404
	// 			  }, {
	// 				name: 'Macedonia',
	// 				value: 507.885
	// 			  }, {
	// 				name: 'Mali',
	// 				value: 13985.961
	// 			  }, {
	// 				name: 'Myanmar',
	// 				value: 51931.231
	// 			  }, {
	// 				name: 'Montenegro',
	// 				value: 620.078
	// 			  }, {
	// 				name: 'Mongolia',
	// 				value: 2712.738
	// 			  }, {
	// 				name: 'Mozambique',
	// 				value: 23967.265
	// 			  }, {
	// 				name: 'Mauritania',
	// 				value: 3609.42
	// 			  }, {
	// 				name: 'Malawi',
	// 				value: 15013.694
	// 			  }, {
	// 				name: 'Malaysia',
	// 				value: 28275.835
	// 			  }, {
	// 				name: 'Namibia',
	// 				value: 2178.967
	// 			  }, {
	// 				name: 'New Caledonia',
	// 				value: 246.379
	// 			  }, {
	// 				name: 'Niger',
	// 				value: 15893.746
	// 			  }, {
	// 				name: 'Nigeria',
	// 				value: 159707.78
	// 			  }, {
	// 				name: 'Nicaragua',
	// 				value: 5822.209
	// 			  }, {
	// 				name: 'Netherlands',
	// 				value: 16615.243
	// 			  }, {
	// 				name: 'Norway',
	// 				value: 4891.251
	// 			  }, {
	// 				name: 'Nepal',
	// 				value: 26846.016
	// 			  }, {
	// 				name: 'New Zealand',
	// 				value: 4368.136
	// 			  }, {
	// 				name: 'Oman',
	// 				value: 2802.768
	// 			  }, {
	// 				name: 'Pakistan',
	// 				value: 173149.306
	// 			  }, {
	// 				name: 'Panama',
	// 				value: 3678.128
	// 			  }, {
	// 				name: 'Peru',
	// 				value: 29262.83
	// 			  }, {
	// 				name: 'Philippines',
	// 				value: 93444.322
	// 			  }, {
	// 				name: 'Papua New Guinea',
	// 				value: 6858.945
	// 			  }, {
	// 				name: 'Poland',
	// 				value: 38198.754
	// 			  }, {
	// 				name: 'Puerto Rico',
	// 				value: 3709.671
	// 			  }, {
	// 				name: 'North Korea',
	// 				value: 1.468
	// 			  }, {
	// 				name: 'Portugal',
	// 				value: 10589.792
	// 			  }, {
	// 				name: 'Paraguay',
	// 				value: 6459.721
	// 			  }, {
	// 				name: 'Qatar',
	// 				value: 1749.713
	// 			  }, {
	// 				name: 'Romania',
	// 				value: 21861.476
	// 			  }, {
	// 				name: 'Russia',
	// 				value: 21861.476
	// 			  }, {
	// 				name: 'Rwanda',
	// 				value: 10836.732
	// 			  }, {
	// 				name: 'Western Sahara',
	// 				value: 514.648
	// 			  }, {
	// 				name: 'Saudi Arabia',
	// 				value: 27258.387
	// 			  }, {
	// 				name: 'Sudan',
	// 				value: 35652.002
	// 			  }, {
	// 				name: 'South Sudan',
	// 				value: 9940.929
	// 			  }, {
	// 				name: 'Senegal',
	// 				value: 12950.564
	// 			  }, {
	// 				name: 'Solomon Islands',
	// 				value: 526.447
	// 			  }, {
	// 				name: 'Sierra Leone',
	// 				value: 5751.976
	// 			  }, {
	// 				name: 'El Salvador',
	// 				value: 6218.195
	// 			  }, {
	// 				name: 'Somaliland',
	// 				value: 9636.173
	// 			  }, {
	// 				name: 'Somalia',
	// 				value: 9636.173
	// 			  }, {
	// 				name: 'Republic of Serbia',
	// 				value: 3573.024
	// 			  }, {
	// 				name: 'Suriname',
	// 				value: 524.96
	// 			  }, {
	// 				name: 'Slovakia',
	// 				value: 5433.437
	// 			  }, {
	// 				name: 'Slovenia',
	// 				value: 2054.232
	// 			  }, {
	// 				name: 'Sweden',
	// 				value: 9382.297
	// 			  }, {
	// 				name: 'Swaziland',
	// 				value: 1193.148
	// 			  }, {
	// 				name: 'Syria',
	// 				value: 7830.534
	// 			  }, {
	// 				name: 'Chad',
	// 				value: 11720.781
	// 			  }, {
	// 				name: 'Togo',
	// 				value: 6306.014
	// 			  }, {
	// 				name: 'Thailand',
	// 				value: 66402.316
	// 			  }, {
	// 				name: 'Tajikistan',
	// 				value: 7627.326
	// 			  }, {
	// 				name: 'Turkmenistan',
	// 				value: 5041.995
	// 			  }, {
	// 				name: 'East Timor',
	// 				value: 10016.797
	// 			  }, {
	// 				name: 'Trinidad and Tobago',
	// 				value: 1328.095
	// 			  }, {
	// 				name: 'Tunisia',
	// 				value: 10631.83
	// 			  }, {
	// 				name: 'Turkey',
	// 				value: 72137.546
	// 			  }, {
	// 				name: 'United Republic of Tanzania',
	// 				value: 44973.33
	// 			  }, {
	// 				name: 'Uganda',
	// 				value: 33987.213
	// 			  }, {
	// 				name: 'Ukraine',
	// 				value: 46050.22
	// 			  }, {
	// 				name: 'Uruguay',
	// 				value: 3371.982
	// 			  }, {
	// 				name: 'United States of America',
	// 				value: 312247.116
	// 			  }, {
	// 				name: 'Uzbekistan',
	// 				value: 27769.27
	// 			  }, {
	// 				name: 'Venezuela',
	// 				value: 236.299
	// 			  }, {
	// 				name: 'Vietnam',
	// 				value: 89047.397
	// 			  }, {
	// 				name: 'Vanuatu',
	// 				value: 236.299
	// 			  }, {
	// 				name: 'West Bank',
	// 				value: 13.565
	// 			  }, {
	// 				name: 'Yemen',
	// 				value: 22763.008
	// 			  }, {
	// 				name: 'South Africa',
	// 				value: 51452.352
	// 			  }, {
	// 				name: 'Zambia',
	// 				value: 13216.985
	// 			  }, {
	// 				name: 'Zimbabwe',
	// 				value: 13076.978
	// 			  }]
	// 			}]
	// 		  });

	// 	}

	// 	// echart Map and Pie

	// 	if ($('#echart_map_4').length ){

	// 	  var echartMap = echarts.init(document.getElementById('echart_map_4'), theme);


	// 	  echartMap.setOption({
	// 		title : {
	// 		        text: '2011全国GDP（亿元）',
	// 		        subtext: '数据来自国家统计局'
	// 		    },
	// 		    tooltip : {
	// 		        trigger: 'item'
	// 		    },
	// 		    legend: {
	// 		        x:'right',
	// 		        selectedMode:false,
	// 		        data:['北京','上海','广东']
	// 		    },
	// 		    dataRange: {
	// 		        orient: 'horizontal',
	// 		        min: 0,
	// 		        max: 55000,
	// 		        text:['高','低'],           // 文本，默认为数值文本
	// 		        splitNumber:0
	// 		    },
	// 		    toolbox: {
	// 		        show : true,
	// 		        orient: 'vertical',
	// 		        x:'right',
	// 		        y:'center',
	// 		        feature : {
	// 		            mark : {show: true},
	// 		            dataView : {show: true, readOnly: false}
	// 		        }
	// 		    },
	// 		    series : [
	// 		        {
	// 		            name: '2011全国GDP分布',
	// 		            type: 'map',
	// 		            mapType: 'china',
	// 		            mapLocation: {
	// 		                x: 'left'
	// 		            },
	// 		            selectedMode : 'multiple',
	// 		            itemStyle:{
	// 		                normal:{label:{show:true}},
	// 		                emphasis:{label:{show:true}}
	// 		            },
	// 		            data:[
	// 		                {name:'西藏', value:605.83},
	// 		                {name:'青海', value:1670.44},
	// 		                {name:'宁夏', value:2102.21},
	// 		                {name:'海南', value:2522.66},
	// 		                {name:'甘肃', value:5020.37},
	// 		                {name:'贵州', value:5701.84},
	// 		                {name:'新疆', value:6610.05},
	// 		                {name:'云南', value:8893.12},
	// 		                {name:'重庆', value:10011.37},
	// 		                {name:'吉林', value:10568.83},
	// 		                {name:'山西', value:11237.55},
	// 		                {name:'天津', value:11307.28},
	// 		                {name:'江西', value:11702.82},
	// 		                {name:'广西', value:11720.87},
	// 		                {name:'陕西', value:12512.3},
	// 		                {name:'黑龙江', value:12582},
	// 		                {name:'内蒙古', value:14359.88},
	// 		                {name:'安徽', value:15300.65},
	// 		                {name:'北京', value:16251.93, selected:true},
	// 		                {name:'福建', value:17560.18},
	// 		                {name:'上海', value:19195.69, selected:true},
	// 		                {name:'湖北', value:19632.26},
	// 		                {name:'湖南', value:19669.56},
	// 		                {name:'四川', value:21026.68},
	// 		                {name:'辽宁', value:22226.7},
	// 		                {name:'河北', value:24515.76},
	// 		                {name:'河南', value:26931.03},
	// 		                {name:'浙江', value:32318.85},
	// 		                {name:'山东', value:45361.85},
	// 		                {name:'江苏', value:49110.27},
	// 		                {name:'广东', value:53210.28, selected:true}
	// 		            ]
	// 		        },
	// 		        {
	// 		            name:'2011全国GDP对比',
	// 		            type:'pie',
	// 		            roseType : 'area',
	// 		            tooltip: {
	// 		                trigger: 'item',
	// 		                formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		            },
	// 		            center: [document.getElementById('main').offsetWidth - 250, 225],
	// 		            radius: [30, 120],
	// 		            data:[
	// 		                {name: '北京', value: 16251.93},
	// 		                {name: '上海', value: 19195.69},
	// 		                {name: '广东', value: 53210.28}
	// 		            ]
	// 		        }
	// 		    ],
	// 		    animation: false
	// 	  });

	// 	  var ecConfig = require('echarts/config');
	// 	  myChart.on(ecConfig.EVENT.MAP_SELECTED, function (param){
	// 	      var selected = param.selected;
	// 	      var mapSeries = option.series[0];
	// 	      var data = [];
	// 	      var legendData = [];
	// 	      var name;
	// 	      for (var p = 0, len = mapSeries.data.length; p < len; p++) {
	// 	          name = mapSeries.data[p].name;
	// 	          //mapSeries.data[p].selected = selected[name];
	// 	          if (selected[name]) {
	// 	              data.push({
	// 	                  name: name,
	// 	                  value: mapSeries.data[p].value
	// 	              });
	// 	              legendData.push(name);
	// 	          }
	// 	      }
	// 	      option.legend.data = legendData;
	// 	      option.series[1].data = data;
	// 	      myChart.setOption(option, true);
	// 	  })

	// 	}

	// };

	// function init_baseline() {

	// 	if( typeof (echarts) === 'undefined'){
	// 		return;
	// 	}

	// 	console.log('init_baseline');

	// 	var humTooltipBar = function(params){
	// 	    console.log(params)
	// 	    params1 = params[0];
	// 	    params2 = params[1];
	// 	    var v1= params1.value;
	// 	    var n1= params1.name;
	// 	    var v2= params2.value;
	// 	    var n2= params2.name;
	// 	    var vN1; var vN2;
	// 	    if(v1>=1000 && v1<1000000){
	// 	    	vN1=((v1/1000).toFixed(2))+' K'
	// 	        // return n1+' '+((v1/1000).toFixed(2))+' K'+'</br>'
	// 	    }
	// 	    if (v1>=1000000 && v1<1000000000) {
	// 	    	vN1=((v1/1000000).toFixed(2))+' M'
	// 	        // return n1+' '+((v1/1000000).toFixed(2))+' M'+'</br>'
	// 	    }if (v1<1000){
	// 	    	vN1=v1;
	// 	        // return n1+' '+ v1+'</br>'
	// 	    }

	// 	    if(v2>=1000 && v2<1000000){
	// 	    	vN2=((v2/1000).toFixed(2))+' K'
	// 	        // return n2+' '+((v2/1000).toFixed(2))+' K'
	// 	    }
	// 	    if (v2>=1000000 && v2<1000000000) {
	// 	    	vN2=((v2/1000000).toFixed(2))+' M'
	// 	        // return n2+' '+((v2/1000000).toFixed(2))+' M'
	// 	    }if (v2<1000){
	// 	    	vN2=v2;
	// 	        // return n2+' '+ v2
	// 	    }
	// 	    return (n1+' '+vN1+'</br>'+n2+' '+vN2)

	// 	};

	// 	var humanizeBar = function(params){
	// 		console.log(params)

	// 		var v= params.data;
	// 		// var n= params.name;
	// 		if(v>=1000 && v<1000000){
	// 			return ((v/1000).toFixed(2))+' K'
	// 		}
	// 		else if (v>=1000000 && v<1000000000) {
	// 			return ((v/1000000).toFixed(2))+' M'
	// 		}else{
	// 			return v
	// 		}

	// 	};

	// 	var theme = {
	// 		  color: [
	// 			  // '#c3272b', '#c93756', '#8e44ad', '#317589', '#003171',
	// 			  // rainbow
	// 			  // '#800026', '#bd0026', '#e31a1c', '#fc4e2a',
	// 			  // '#fd8d3c', '#feb24c', '#fed976', '#ffeda0'
	// 			  //blue to light blue
	// 			  // '#abd9e9', '#74add1',
	// 			  // '#4575b4'

	// 			  // '#84caec', '#5cbae5',
	// 			  // '#27a3dd'

	// 			  // '#c0392b',    '#e74c3c',    '#f39c12',
	// 			  // '#f1c40f',    '#8e44ad',    '#9b59b6',
	// 			  // '#ca2c68'    //'#ff6c5c',    '#ff7c6c'

	// 			  // graphic flat ui color dark red to light
	// 			  // '#870000',    '#a70c00',    '#b71c0c',
	// 			  // '#c72c1c',    '#d73c2c',    '#e74c3c',
	// 			  // '#f75c4c',    '#ff6c5c',    '#ff7c6c'

	// 			  // '#f99494',    '#f66364',    '#f33334',
	// 			  // '#dc0d0e',    '#b90c0d',    '#930a0a'

	// 			  // sap
	// 			  '#5cbae6',    '#b6d957',    '#fac364',
	// 			  '#8cd3ff',    '#d998cb',    '#f2d249',
	// 			  '#93b9c6',    '#ccc5a8',    '#52bacc',
	// 			  '#dbdb46',    '#98aafb'

	// 			  // colorbrewer
	// 			  // red and yellow
	// 			  // '#ffeda0',
	// 			  // '#fed976',
	// 			  // '#feb24c',
	// 			  // '#fd8d3c',
	// 			  // '#fc4e2a',
	// 			  // '#e31a1c',
	// 			  // '#bd0026',
	// 			  // '#800026'

	// 			  // red
	// 			  // '#fee0d2',
	// 			  // '#fcbba1',
	// 			  // '#fc9272',
	// 			  // '#fb6a4a',
	// 			  // '#ef3b2c',
	// 			  // '#cb181d',
	// 			  // '#a50f15',
	// 			  // '#67000d'

	// 			  // red to gray
	// 			  // '#b2182b',
	// 			  // '#d6604d',
	// 			  // '#f4a582',
	// 			  // '#fddbc7',
	// 			  // // '#ffffff',
	// 			  // '#e0e0e0',
	// 			  // '#bababa',
	// 			  // '#878787',
	// 			  // '#4d4d4d'

	// 			  // red to green 6
	// 			  // '#d73027',
	// 			  // '#fc8d59',
	// 			  // '#fee08b',
	// 			  // '#d9ef8b',
	// 			  // '#91cf60',
	// 			  // '#1a9850'

	// 			  // qualitative 12
	// 			  // '#a6cee3',
	// 			  // '#1f78b4',
	// 			  // '#b2df8a',
	// 			  // '#33a02c',
	// 			  // '#fb9a99',
	// 			  // '#e31a1c',
	// 			  // '#fdbf6f',
	// 			  // '#ff7f00',
	// 			  // '#cab2d6',
	// 			  // '#6a3d9a',
	// 			  // '#ffff99',
	// 			  // '#b15928'



	// 			  // '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
	// 			  // '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
	// 		  ],

	// 		  title: {
	// 			  itemGap: 8,
	// 			  textStyle: {
	// 				  fontWeight: 'normal',
	// 				  color: '#408829'
	// 			  }
	// 		  },

	// 		  dataRange: {
	// 			  color: ['#1f610a', '#97b58d']
	// 		  },

	// 		  toolbox: {
	// 			  color: ['#408829', '#408829', '#408829', '#408829']
	// 		  },

	// 		  tooltip: {
	// 			  backgroundColor: 'rgba(0,0,0,0.5)',
	// 			  axisPointer: {
	// 				  type: 'line',
	// 				  lineStyle: {
	// 					  color: '#408829',
	// 					  type: 'dashed'
	// 				  },
	// 				  crossStyle: {
	// 					  color: '#408829'
	// 				  },
	// 				  shadowStyle: {
	// 					  color: 'rgba(200,200,200,0.3)'
	// 				  }
	// 			  }
	// 		  },

	// 		  dataZoom: {
	// 			  dataBackgroundColor: '#eee',
	// 			  fillerColor: 'rgba(64,136,41,0.2)',
	// 			  handleColor: '#408829'
	// 		  },
	// 		  grid: {
	// 			  borderWidth: 0
	// 		  },

	// 		  categoryAxis: {
	// 			  axisLine: {
	// 				  lineStyle: {
	// 					  color: '#408829'
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  lineStyle: {
	// 					  color: ['#eee']
	// 				  }
	// 			  }
	// 		  },

	// 		  valueAxis: {
	// 			  axisLine: {
	// 				  lineStyle: {
	// 					  color: '#408829'
	// 				  }
	// 			  },
	// 			  splitArea: {
	// 				  show: true,
	// 				  areaStyle: {
	// 					  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  lineStyle: {
	// 					  color: ['#eee']
	// 				  }
	// 			  }
	// 		  },
	// 		  timeline: {
	// 			  lineStyle: {
	// 				  color: '#408829'
	// 			  },
	// 			  controlStyle: {
	// 				  normal: {color: '#408829'},
	// 				  emphasis: {color: '#408829'}
	// 			  }
	// 		  },

	// 		  k: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  color: '#68a54a',
	// 					  color0: '#a9cba2',
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: '#408829',
	// 						  color0: '#86b379'
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  map: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  areaStyle: {
	// 						  color: '#ddd'
	// 					  },
	// 					  label: {
	// 						  textStyle: {
	// 							  color: '#c12e34'
	// 						  }
	// 					  }
	// 				  },
	// 				  emphasis: {
	// 					  areaStyle: {
	// 						  color: '#99d2dd'
	// 					  },
	// 					  label: {
	// 						  textStyle: {
	// 							  color: '#c12e34'
	// 						  }
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  force: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  linkStyle: {
	// 						  strokeColor: '#408829'
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  chord: {
	// 			  padding: 4,
	// 			  itemStyle: {
	// 				  normal: {
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: 'rgba(128, 128, 128, 0.5)'
	// 					  },
	// 					  chordStyle: {
	// 						  lineStyle: {
	// 							  width: 1,
	// 							  color: 'rgba(128, 128, 128, 0.5)'
	// 						  }
	// 					  }
	// 				  },
	// 				  emphasis: {
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: 'rgba(128, 128, 128, 0.5)'
	// 					  },
	// 					  chordStyle: {
	// 						  lineStyle: {
	// 							  width: 1,
	// 							  color: 'rgba(128, 128, 128, 0.5)'
	// 						  }
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  gauge: {
	// 			  startAngle: 225,
	// 			  endAngle: -45,
	// 			  axisLine: {
	// 				  show: true,
	// 				  lineStyle: {
	// 					  color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
	// 					  width: 8
	// 				  }
	// 			  },
	// 			  axisTick: {
	// 				  splitNumber: 10,
	// 				  length: 12,
	// 				  lineStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  axisLabel: {
	// 				  textStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  length: 18,
	// 				  lineStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  pointer: {
	// 				  length: '90%',
	// 				  color: 'auto'
	// 			  },
	// 			  title: {
	// 				  textStyle: {
	// 					  color: '#333'
	// 				  }
	// 			  },
	// 			  detail: {
	// 				  textStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  }
	// 		  },
	// 		  textStyle: {
	// 			  fontFamily: 'Arial, Verdana, sans-serif'
	// 		  }
	//   	};

	// 	//echart Bar Horizontal

	// 	if ($('#echart_bar_horizontal').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal'), theme, humTooltipBar, humanizeBar);

	// 	  echartBar.setOption({
	// 		// title: {
	// 		//   text: 'Overview 1',
	// 		//   subtext: 'Graph subtitle'
	// 		// },
	// 		tooltip: {
	// 		  trigger: 'axis',
	// 		  axisPointer:{
	// 		  	type: 'shadow',
	// 		  },
	// 		  formatter: humTooltipBar
	// 		},
	// 		legend: {
	// 		  x: 'left',
	// 		  data: ['Population', 'Area (km2)']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 		  	magicType: {
	// 	    	  show: true,
	// 	    	  title: {
	// 	    		line: 'Line',
	// 	    		bar: 'Bar',
	// 	    		stack: 'Stack',
	// 	    		tiled: 'Tiled'
	// 	    	  },
	// 	    	  type: ['line', 'bar', 'stack', 'tiled']
	// 	    	},
	// 	    	restore: {
	// 	    	  show: true,
	// 	    	  title: "Restore"
	// 	    	},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		grid: {
	// 	        left: '0%',
	// 	        right: '4%',
	// 	        bottom: '8%',
	// 	        containLabel: true
	// 	    },
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01],
	// 		  axisLabel:{
	// 		  	rotate: 30
	// 		  }
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Built-Up', 'Cultivated', 'Barrend/Rangeland']
	// 		}],
	// 		series: [{
	// 		  name: 'Population',
	// 		  type: 'bar',
	// 		  label:{
	// 		  	normal:{
	// 		  		formatter: humanizeBar,
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [12550853, 13002950, 5554167]
	// 		}, {
	// 		  name: 'Area (km2)',
	// 		  type: 'bar',
	// 		  label:{
	// 		  	normal:{
	// 		  		formatter: humanizeBar,
	// 		  		position: 'right',
	// 		  		show: true
	// 		  	}
	// 		  },
	// 		  data: [3050.5, 76153.2, 568421.5]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Bar Horizontal 2

	// 	if ($('#echart_bar_horizontal_2').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_2'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// 	// echart Bar Horizontal 3

	// 	if ($('#echart_bar_horizontal_3').length ){

	// 	  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_3'), theme);

	// 	  echartBar.setOption({
	// 		title: {
	// 		  text: 'Bar Graph',
	// 		  subtext: 'Graph subtitle'
	// 		},
	// 		tooltip: {
	// 		  trigger: 'axis'
	// 		},
	// 		legend: {
	// 		  x: 100,
	// 		  data: ['2015', '2016']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		xAxis: [{
	// 		  type: 'value',
	// 		  boundaryGap: [0, 0.01]
	// 		}],
	// 		yAxis: [{
	// 		  type: 'category',
	// 		  data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
	// 		}],
	// 		series: [{
	// 		  name: '2015',
	// 		  type: 'bar',
	// 		  data: [18203, 23489, 29034, 104970, 131744, 630230]
	// 		}, {
	// 		  name: '2016',
	// 		  type: 'bar',
	// 		  data: [19325, 23438, 31000, 121594, 134141, 681807]
	// 		}]
	// 	  });

	// 	}

	// };

	// function init_accsblty() {

	// 	if( typeof (echarts) === 'undefined'){
	// 		return;
	// 	}

	// 	console.log('init_accsblty');

	// 	var humTooltipPie = function(params){
	// 	    console.log(params)
	// 	    var v= params.data.value;
	// 	    var p= params.percent;
	// 	    var n= params.data.name;
	// 	    if(v>=1000 && v<1000000){
	// 	        return n+'</br>'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 	    }
	// 	    else if (v>=1000000 && v<1000000000) {
	// 	        return n+'</br>'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 	    }else{
	// 	        return n+ '</br>'+ v+ ' ('+ p+'%)'
	// 	    }

	// 	};

	// 	var humanizePie = function(params){
	// 		console.log(params)

	// 		var v= params.data.value;
	// 		var p= params.percent;
	// 		var n= params.data.name;
	// 		if(v>=1000 && v<1000000){
	// 			return n+'\n'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 		}
	// 		else if (v>=1000000 && v<1000000000) {
	// 			return n+'\n'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 		}else{
	// 			return n+ '\n'+ v+ ' ('+ p+'%)'
	// 		}

	// 	};

	// 	var theme = {
	// 		  color: [
	// 			  // '#c3272b', '#c93756', '#8e44ad', '#317589', '#003171',
	// 			  // rainbow
	// 			  // '#800026', '#bd0026', '#e31a1c', '#fc4e2a',
	// 			  // '#fd8d3c', '#feb24c', '#fed976', '#ffeda0'
	// 			  //blue to light blue
	// 			  // '#abd9e9', '#74add1',
	// 			  // '#4575b4'

	// 			  // '#84caec', '#5cbae5',
	// 			  // '#27a3dd'

	// 			  // '#c0392b',    '#e74c3c',    '#f39c12',
	// 			  // '#f1c40f',    '#8e44ad',    '#9b59b6',
	// 			  // '#ca2c68'    //'#ff6c5c',    '#ff7c6c'

	// 			  // graphic flat ui color dark red to light
	// 			  // '#870000',    '#a70c00',    '#b71c0c',
	// 			  // '#c72c1c',    '#d73c2c',    '#e74c3c',
	// 			  // '#f75c4c',    '#ff6c5c',    '#ff7c6c'

	// 			  // '#f99494',    '#f66364',    '#f33334',
	// 			  // '#dc0d0e',    '#b90c0d',    '#930a0a'

	// 			  // sap
	// 			  '#5cbae6',    '#b6d957',    '#fac364',
	// 			  '#8cd3ff',    '#d998cb',    '#f2d249',
	// 			  '#93b9c6',    '#ccc5a8',    '#52bacc',
	// 			  '#dbdb46',    '#98aafb'

	// 			  // colorbrewer
	// 			  // red and yellow
	// 			  // '#ffeda0',
	// 			  // '#fed976',
	// 			  // '#feb24c',
	// 			  // '#fd8d3c',
	// 			  // '#fc4e2a',
	// 			  // '#e31a1c',
	// 			  // '#bd0026',
	// 			  // '#800026'

	// 			  // red
	// 			  // '#fee0d2',
	// 			  // '#fcbba1',
	// 			  // '#fc9272',
	// 			  // '#fb6a4a',
	// 			  // '#ef3b2c',
	// 			  // '#cb181d',
	// 			  // '#a50f15',
	// 			  // '#67000d'

	// 			  // red to gray
	// 			  // '#b2182b',
	// 			  // '#d6604d',
	// 			  // '#f4a582',
	// 			  // '#fddbc7',
	// 			  // // '#ffffff',
	// 			  // '#e0e0e0',
	// 			  // '#bababa',
	// 			  // '#878787',
	// 			  // '#4d4d4d'

	// 			  // red to green 6
	// 			  // '#d73027',
	// 			  // '#fc8d59',
	// 			  // '#fee08b',
	// 			  // '#d9ef8b',
	// 			  // '#91cf60',
	// 			  // '#1a9850'

	// 			  // qualitative 12
	// 			  // '#a6cee3',
	// 			  // '#1f78b4',
	// 			  // '#b2df8a',
	// 			  // '#33a02c',
	// 			  // '#fb9a99',
	// 			  // '#e31a1c',
	// 			  // '#fdbf6f',
	// 			  // '#ff7f00',
	// 			  // '#cab2d6',
	// 			  // '#6a3d9a',
	// 			  // '#ffff99',
	// 			  // '#b15928'



	// 			  // '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
	// 			  // '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
	// 		  ],

	// 		  title: {
	// 			  itemGap: 8,
	// 			  textStyle: {
	// 				  fontWeight: 'normal',
	// 				  color: '#408829'
	// 			  }
	// 		  },

	// 		  dataRange: {
	// 			  color: ['#1f610a', '#97b58d']
	// 		  },

	// 		  toolbox: {
	// 			  color: ['#408829', '#408829', '#408829', '#408829']
	// 		  },

	// 		  tooltip: {
	// 			  backgroundColor: 'rgba(0,0,0,0.5)',
	// 			  axisPointer: {
	// 				  type: 'line',
	// 				  lineStyle: {
	// 					  color: '#408829',
	// 					  type: 'dashed'
	// 				  },
	// 				  crossStyle: {
	// 					  color: '#408829'
	// 				  },
	// 				  shadowStyle: {
	// 					  color: 'rgba(200,200,200,0.3)'
	// 				  }
	// 			  }
	// 		  },

	// 		  dataZoom: {
	// 			  dataBackgroundColor: '#eee',
	// 			  fillerColor: 'rgba(64,136,41,0.2)',
	// 			  handleColor: '#408829'
	// 		  },
	// 		  grid: {
	// 			  borderWidth: 0
	// 		  },

	// 		  categoryAxis: {
	// 			  axisLine: {
	// 				  lineStyle: {
	// 					  color: '#408829'
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  lineStyle: {
	// 					  color: ['#eee']
	// 				  }
	// 			  }
	// 		  },

	// 		  valueAxis: {
	// 			  axisLine: {
	// 				  lineStyle: {
	// 					  color: '#408829'
	// 				  }
	// 			  },
	// 			  splitArea: {
	// 				  show: true,
	// 				  areaStyle: {
	// 					  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  lineStyle: {
	// 					  color: ['#eee']
	// 				  }
	// 			  }
	// 		  },
	// 		  timeline: {
	// 			  lineStyle: {
	// 				  color: '#408829'
	// 			  },
	// 			  controlStyle: {
	// 				  normal: {color: '#408829'},
	// 				  emphasis: {color: '#408829'}
	// 			  }
	// 		  },

	// 		  k: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  color: '#68a54a',
	// 					  color0: '#a9cba2',
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: '#408829',
	// 						  color0: '#86b379'
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  map: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  areaStyle: {
	// 						  color: '#ddd'
	// 					  },
	// 					  label: {
	// 						  textStyle: {
	// 							  color: '#c12e34'
	// 						  }
	// 					  }
	// 				  },
	// 				  emphasis: {
	// 					  areaStyle: {
	// 						  color: '#99d2dd'
	// 					  },
	// 					  label: {
	// 						  textStyle: {
	// 							  color: '#c12e34'
	// 						  }
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  force: {
	// 			  itemStyle: {
	// 				  normal: {
	// 					  linkStyle: {
	// 						  strokeColor: '#408829'
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  chord: {
	// 			  padding: 4,
	// 			  itemStyle: {
	// 				  normal: {
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: 'rgba(128, 128, 128, 0.5)'
	// 					  },
	// 					  chordStyle: {
	// 						  lineStyle: {
	// 							  width: 1,
	// 							  color: 'rgba(128, 128, 128, 0.5)'
	// 						  }
	// 					  }
	// 				  },
	// 				  emphasis: {
	// 					  lineStyle: {
	// 						  width: 1,
	// 						  color: 'rgba(128, 128, 128, 0.5)'
	// 					  },
	// 					  chordStyle: {
	// 						  lineStyle: {
	// 							  width: 1,
	// 							  color: 'rgba(128, 128, 128, 0.5)'
	// 						  }
	// 					  }
	// 				  }
	// 			  }
	// 		  },
	// 		  gauge: {
	// 			  startAngle: 225,
	// 			  endAngle: -45,
	// 			  axisLine: {
	// 				  show: true,
	// 				  lineStyle: {
	// 					  color: [[0.2, '#86b379'], [0.8, '#68a54a'], [1, '#408829']],
	// 					  width: 8
	// 				  }
	// 			  },
	// 			  axisTick: {
	// 				  splitNumber: 10,
	// 				  length: 12,
	// 				  lineStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  axisLabel: {
	// 				  textStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  splitLine: {
	// 				  length: 18,
	// 				  lineStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  },
	// 			  pointer: {
	// 				  length: '90%',
	// 				  color: 'auto'
	// 			  },
	// 			  title: {
	// 				  textStyle: {
	// 					  color: '#333'
	// 				  }
	// 			  },
	// 			  detail: {
	// 				  textStyle: {
	// 					  color: 'auto'
	// 				  }
	// 			  }
	// 		  },
	// 		  textStyle: {
	// 			  fontFamily: 'Arial, Verdana, sans-serif'
	// 		  }
	//   	};

	// 	//echart Donut

	// 	if ($('#echart_donut').length ){

	// 	  var echartDonut = echarts.init(document.getElementById('echart_donut'), theme, humTooltipPie, humanizePie);

	// 	 //  var humTooltip = function(params){
	// 		//     console.log(params)
	// 		//     var v= params.data.value;
	// 		//     var p= params.percent;
	// 		//     var n= params.data.name;
	// 		//     if(v>=1000 && v<1000000){
	// 		//         return n+'</br>'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 		//     }
	// 		//     else if (v>=1000000 && v<1000000000) {
	// 		//         return n+'</br>'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 		//     }else{
	// 		//         return n+ '</br>'+ v+ ' ('+ p+'%)'
	// 		//     }

	// 		// };

	// 	  // var humanize = function(params){
	// 	  // 				console.log(params)
	// 			// 		var v= params.data.value;
	// 			// 		var p= params.percent;
	// 			// 		var n= params.data.name;
	// 			// 		if(v>=1000 && v<1000000){
	// 			// 			return n+'\n'+((v/1000).toFixed(2))+' K (' + p+'%)'
	// 			// 		}
	// 			// 		else if (v>=1000000 && v<1000000000) {
	// 			// 			return n+'\n'+((v/1000000).toFixed(2))+' M (' + p+'%)'
	// 			// 		}else{
	// 			// 			return n+ '\n'+ v+ ' ('+ p+'%)'
	// 			// 		}

	// 			// 	};

	// 	  echartDonut.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie
	// 		},
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['With GSM Coverage','Without GSM Coverage']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Population',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle:
	// 		  {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie
	// 				// "{b} \n"+humanize+" ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 21051822,
	// 			name: 'With GSM Coverage'
	// 		  }, {
	// 			value: 10056148,
	// 			name: 'Without GSM Coverage'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	 // echart Donut 2

	// 	if ($('#echart_donut_2').length ){

	// 	  var echartDonut2 = echarts.init(document.getElementById('echart_donut_2'), theme, humTooltipPie, humanizePie);

	// 	  echartDonut2.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie
	// 		},
	// 		calculable: true,
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['With GSM Coverage','Without GSM Coverage']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'center',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		series: [{
	// 		  name: 'Area',
	// 		  type: 'pie',
	// 		  radius: ['35%', '55%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 105732,
	// 			name: 'With GSM Coverage'
	// 		  }, {
	// 			value: 541893,
	// 			name: 'Without GSM Coverage'
	// 		  }]
	// 		}]
	// 	  });

	// 	}

	// 	//echart Pie

	// 	if ($('#echart_pie').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie'), theme, humTooltipPie, humanizePie);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: humTooltipPie
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Nearest Airport',
	// 		  type: 'pie',
	// 		  radius: '30%',
	// 		  center: ['50%', '48%'],
	// 		  itemStyle: {
	// 			normal: {
	// 			  label: {
	// 				show: true,
	// 				formatter: humanizePie //"{b} \n{c} ({d}%)"
	// 			  },
	// 			  labelLine: {
	// 				show: true
	// 			  }
	// 			},
	// 			emphasis: {
	// 			  label: {
	// 				show: true,
	// 				position: 'center',
	// 				textStyle: {
	// 				  fontSize: '14',
	// 				  fontWeight: 'normal'
	// 				}
	// 			  }
	// 			}
	// 		  },
	// 		  data: [{
	// 			value: 14900000,
	// 			name: '< 1h'
	// 		  }, {
	// 			value: 7400000,
	// 			name: '< 2h'
	// 		  }, {
	// 			value: 3600000,
	// 			name: '< 3h'
	// 		  }, {
	// 			value: 1600000,
	// 			name: '< 4h'
	// 		  }, {
	// 			value: 775996,
	// 			name: '< 5h'
	// 		  }, {
	// 			value: 477632,
	// 			name: '< 6h'
	// 		  }, {
	// 			value: 359146,
	// 			name: '< 7h'
	// 		  }, {
	// 			value: 593026,
	// 			name: '< 8h'
	// 		  }, {
	// 			value: 1400000,
	// 			name: '> 5h'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 2

	// 	if ($('#echart_pie_2').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_2'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 3

	// 	if ($('#echart_pie_3').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_3'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 4

	// 	if ($('#echart_pie_4').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_4'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 5

	// 	if ($('#echart_pie_5').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_5'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 6

	// 	if ($('#echart_pie_6').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_6'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 7

	// 	if ($('#echart_pie_7').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_7'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Direct Access', 'E-mail Marketing', 'Union Ad', 'Video Ads', 'Search Engine']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: '访问来源',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 335,
	// 			name: 'Direct Access'
	// 		  }, {
	// 			value: 310,
	// 			name: 'E-mail Marketing'
	// 		  }, {
	// 			value: 234,
	// 			name: 'Union Ad'
	// 		  }, {
	// 			value: 135,
	// 			name: 'Video Ads'
	// 		  }, {
	// 			value: 1548,
	// 			name: 'Search Engine'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// 	// echart Pie 8

	// 	if ($('#echart_pie_8').length ){

	// 	  var echartPie = echarts.init(document.getElementById('echart_pie_8'), theme);

	// 	  echartPie.setOption({
	// 		tooltip: {
	// 		  trigger: 'item',
	// 		  formatter: "{a} <br/>{b} : {c} ({d}%)"
	// 		},
	// 		legend: {
	// 		  x: 'center',
	// 		  y: 'bottom',
	// 		  data: ['Not Affected Population', 'Affected Population']
	// 		},
	// 		toolbox: {
	// 		  show: true,
	// 		  feature: {
	// 			magicType: {
	// 			  show: true,
	// 			  type: ['pie', 'funnel'],
	// 			  option: {
	// 				funnel: {
	// 				  x: '25%',
	// 				  width: '50%',
	// 				  funnelAlign: 'left',
	// 				  max: 1548
	// 				}
	// 			  }
	// 			},
	// 			restore: {
	// 			  show: true,
	// 			  title: "Restore"
	// 			},
	// 			saveAsImage: {
	// 			  show: true,
	// 			  title: "Save Image"
	// 			}
	// 		  }
	// 		},
	// 		calculable: true,
	// 		series: [{
	// 		  name: 'Population Affected',
	// 		  type: 'pie',
	// 		  radius: '55%',
	// 		  center: ['50%', '48%'],
	// 		  data: [{
	// 			value: 27800000,
	// 			name: 'Not Affected Population'
	// 		  }, {
	// 			value: 3300000,
	// 			name: 'Affected Population'
	// 		  }]
	// 		}]
	// 	  });

	// 	  var dataStyle = {
	// 		normal: {
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		}
	// 	  };

	// 	  var placeHolderStyle = {
	// 		normal: {
	// 		  color: 'rgba(0,0,0,0)',
	// 		  label: {
	// 			show: false
	// 		  },
	// 		  labelLine: {
	// 			show: false
	// 		  }
	// 		},
	// 		emphasis: {
	// 		  color: 'rgba(0,0,0,0)'
	// 		}
	// 	  };

	// 	}

	// };

	if (window.location.href.match(/\/dashboard\/*/)) {
		if (Object.keys(jsondata).length > 0) {
			if (window.location.href.match(/\?page=baseline&*/)) {
				var base_lcAll=[];
				var base_lcChild =[];
				var base_lcParent =[];

				base_lcParent = 
					[[jsondata['parent_label'], 
					jsondata['Buildings'], 
					jsondata['settlement'], 
					jsondata['built_up_pop'], 
					jsondata['built_up_area'], 
					jsondata['cultivated_pop'], 
					jsondata['cultivated_area'], 
					jsondata['barren_pop'], 
					jsondata['barren_area'], 
					jsondata['Population'], 
					jsondata['Area']]];

				for (var i = 0; i < jsondata['lc_child'].length; i++) {
					base_lcChild[i] = 
						[jsondata['lc_child'][i]['na_en'], 
						jsondata['lc_child'][i]['total_buildings'], 
						jsondata['lc_child'][i]['settlements'], 
						jsondata['lc_child'][i]['built_up_pop'], 
						jsondata['lc_child'][i]['built_up_area'], 
						jsondata['lc_child'][i]['cultivated_pop'], 
						jsondata['lc_child'][i]['cultivated_area'], 
						jsondata['lc_child'][i]['barren_land_pop'], 
						jsondata['lc_child'][i]['barren_land_area'], 
						jsondata['lc_child'][i]['Population'], 
						jsondata['lc_child'][i]['Area']];
				}
				base_lcAll = (base_lcParent).concat(base_lcChild);

				var hfAll = [];
				var hfParent =[];
				var hfChild =[];

				hfParent = 
					[[jsondata['parent_label'], 
					jsondata['hlt_h1'], 
					jsondata['hlt_h2'], 
					jsondata['hlt_h3'], 
					jsondata['hlt_chc'], 
					jsondata['hlt_bhc'], 
					jsondata['hlt_shc'], 
					jsondata['hlt_others'], 
					jsondata['hltfac']]];

				for (var i = 0; i < jsondata['additional_child'].length; i++) {
					hfChild[i] = 
						[jsondata['additional_child'][i]['na_en'], 
						jsondata['additional_child'][i]['hlt_h1'], 
						jsondata['additional_child'][i]['hlt_h2'], 
						jsondata['additional_child'][i]['hlt_h3'], 
						jsondata['additional_child'][i]['hlt_chc'], 
						jsondata['additional_child'][i]['hlt_bhc'], 
						jsondata['additional_child'][i]['hlt_shc'], 
						jsondata['additional_child'][i]['hlt_others'], 
						jsondata['additional_child'][i]['hlt_total']];
				}
				hfAll = (hfParent).concat(hfChild);

				var rnAll = [];
				var rnParent =[];
				var rnChild =[];

				rnParent = 
					[[jsondata['parent_label'], 
					jsondata['road_highway'], 
					jsondata['road_primary'], 
					jsondata['road_secondary'], 
					jsondata['road_tertiary'], 
					jsondata['road_residential'], 
					jsondata['road_track'], 
					jsondata['road_path'], 
					jsondata['road_river_crossing'], 
					jsondata['road_bridge'], 
					jsondata['roadnetwork']]];

				for (var i = 0; i < jsondata['additional_child'].length; i++) {
					rnChild[i] = 
						[jsondata['additional_child'][i]['na_en'], 
						jsondata['additional_child'][i]['road_highway'], 
						jsondata['additional_child'][i]['road_primary'], 
						jsondata['additional_child'][i]['road_secondary'], 
						jsondata['additional_child'][i]['road_tertiary'], 
						jsondata['additional_child'][i]['road_residential'], 
						jsondata['additional_child'][i]['road_track'], 
						jsondata['additional_child'][i]['road_path'], 
						jsondata['additional_child'][i]['road_river_crossing'],
						jsondata['additional_child'][i]['road_bridge'], 
						jsondata['additional_child'][i]['road_total']];
				}
				rnAll = (rnParent).concat(rnChild);
			}
			else if (window.location.href.match(/\?page=accessibility&*/)) {

			}
			else if (window.location.href.match(/\?page=floodforecast&*/)) {
				var rgffoverviewParent = [];
				var rgffoverviewChild = [];
				var rgffoverviewAll=[];

				rgffoverviewParent = 
					[[jsondata['parent_label'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_veryhigh_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_high_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_med_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_low_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['riverflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['riverflood_forecast_veryhigh_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['riverflood_forecast_high_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['riverflood_forecast_med_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['riverflood_forecast_low_pop'], 
					jsondata['flashflood_forecast_extreme_pop']]];

				for (var i = 0; i < jsondata['lc_child'].length; i++) {
					rgffoverviewChild[i] = 
						[jsondata['lc_child'][i]['na_en'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_veryhigh_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_high_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_med_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_low_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['riverflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['riverflood_forecast_veryhigh_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['riverflood_forecast_high_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['riverflood_forecast_med_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['lc_child'][i]['riverflood_forecast_low_pop'], 
						jsondata['lc_child'][i]['flashflood_forecast_extreme_pop']];
				}
				rgffoverviewAll = (rgffoverviewParent).concat(rgffoverviewChild);

				var rggfoverviewParent = [];
				var rggfoverviewChild = [];
				var rggfoverviewAll=[];
				rggfoverviewParent = 
					[[jsondata['parent_label'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_veryhigh_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_high_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_med_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_low_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['gfms_glofas_riverflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['gfms_glofas_riverflood_forecast_veryhigh_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['gfms_glofas_riverflood_forecast_high_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['gfms_glofas_riverflood_forecast_med_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['gfms_glofas_riverflood_forecast_low_pop'],
					jsondata['flashflood_forecast_extreme_pop']]];
				for (var i = 0; i < jsondata['glofas_gfms_child'].length; i++) {
					rggfoverviewChild[i] = 
						[jsondata['glofas_gfms_child'][i]['na_en'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_veryhigh_pop'],
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],  
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_high_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_med_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_low_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['riverflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['riverflood_forecast_veryhigh_pop'],
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],  
						jsondata['glofas_gfms_child'][i]['riverflood_forecast_high_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['riverflood_forecast_med_pop'], 
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'], 
						jsondata['glofas_gfms_child'][i]['riverflood_forecast_low_pop'],
						jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop']];
				}
				rggfoverviewAll = (rggfoverviewParent).concat(rggfoverviewChild);

				var rglfoverviewParent = [];
				var rglfoverviewChild = [];
				var rglfoverviewAll=[];
				rglfoverviewParent = 
					[[jsondata['parent_label'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_veryhigh_pop'],
					jsondata['flashflood_forecast_extreme_pop'],  
					jsondata['flashflood_forecast_high_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_med_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_low_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_riverflood_forecast_extreme_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_riverflood_forecast_veryhigh_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_riverflood_forecast_high_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_riverflood_forecast_med_pop'], 
					jsondata['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_riverflood_forecast_low_pop'],
					jsondata['flashflood_forecast_extreme_pop']]];
				
				for (var i = 0; i < jsondata['glofas_child'].length; i++) {
					rglfoverviewChild[i] = 
					[jsondata['glofas_child'][i]['na_en'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_veryhigh_pop'],
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],  
					jsondata['glofas_child'][i]['flashflood_forecast_high_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_med_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_low_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['riverflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['riverflood_forecast_veryhigh_pop'],
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],  
					jsondata['glofas_child'][i]['riverflood_forecast_high_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['riverflood_forecast_med_pop'], 
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'], 
					jsondata['glofas_child'][i]['riverflood_forecast_low_pop'],
					jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop']];
				}
				rglfoverviewAll = (rglfoverviewParent).concat(rglfoverviewChild);
			}
			else if (window.location.href.match(/\?page=floodrisk&*/)) {
				var fRiskParent = [];
				var fRiskChild = [];
				var fRiskAll=[];
				fRiskParent = 
					[[jsondata['parent_label'], 
					jsondata['settlement_at_floodrisk'], 
					jsondata['settlement_at_floodrisk'], 
					jsondata['built_up_pop_risk'], 
					jsondata['built_up_area_risk'], 
					// jsondata['settlement_at_floodrisk'], 
					jsondata['cultivated_pop_risk'], 
					jsondata['cultivated_area_risk'], 
					// jsondata['settlement_at_floodrisk'], 
					jsondata['barren_pop_risk'], 
					jsondata['barren_area_risk'], 
					// jsondata['settlement_at_floodrisk'], 
					jsondata['total_risk_population'], 
					jsondata['total_risk_area'], 
					// jsondata['settlement_at_floodrisk']
					]];
				for (var i = 0; i < jsondata['lc_child'].length; i++) {
					fRiskChild[i] = 
					[jsondata['lc_child'][i]['na_en'], 
					jsondata['lc_child'][i]['total_risk_buildings'],
					jsondata['lc_child'][i]['settlements_at_risk'], 
					jsondata['lc_child'][i]['built_up_pop_risk'], 
					jsondata['lc_child'][i]['built_up_area_risk'], 
					// jsondata['lc_child'][i]['settlements_at_risk'], 
					jsondata['lc_child'][i]['cultivated_pop_risk'], 
					jsondata['lc_child'][i]['cultivated_area_risk'], 
					// jsondata['lc_child'][i]['settlements_at_risk'], 
					jsondata['lc_child'][i]['barren_pop_risk'], 
					jsondata['lc_child'][i]['barren_area_risk'], 
					// jsondata['lc_child'][i]['settlements_at_risk'], 
					jsondata['lc_child'][i]['total_risk_population'], 
					jsondata['lc_child'][i]['total_risk_area'], 
					// jsondata['lc_child'][i]['total_risk_buildings']
					];
				}
				fRiskAll = (fRiskParent).concat(fRiskChild);
			}
			else if (window.location.href.match(/\?page=avalcheforecast&*/)) {
				var aForecastParent = [];
				var aForecastChild = [];
				var aForecastAll=[];
				aForecastParent = 
					[[jsondata['parent_label'], 
					jsondata['ava_forecast_high_pop'], 
					jsondata['ava_forecast_high_pop'], 
					jsondata['ava_forecast_med_pop'], 
					jsondata['ava_forecast_high_pop'], 
					jsondata['ava_forecast_low_pop'], 
					jsondata['ava_forecast_high_pop'], 
					jsondata['total_ava_forecast_pop'],
					jsondata['ava_forecast_high_pop']]];

				for (var i = 0; i < jsondata['lc_child'].length; i++) {
					aForecastChild[i] = 
					[jsondata['lc_child'][i]['na_en'], 
					jsondata['lc_child'][i]['ava_forecast_high_pop'], 
					jsondata['lc_child'][i]['high_ava_buildings'], 
					jsondata['lc_child'][i]['ava_forecast_med_pop'], 
					jsondata['lc_child'][i]['med_ava_buildings'], 
					jsondata['lc_child'][i]['ava_forecast_low_pop'], 
					jsondata['lc_child'][i]['ava_forecast_high_pop'], 
					jsondata['lc_child'][i]['total_ava_forecast_pop'],
					jsondata['lc_child'][i]['total_ava_buildings']];
				}
				aForecastAll = (aForecastParent).concat(aForecastChild);
			}
			else if (window.location.href.match(/\?page=avalancherisk&*/)) {
				var aRiskParent = [];
				var aRiskChild = [];
				var aRiskAll=[];
				aRiskParent = 
					[[jsondata['parent_label'], 
					jsondata['high_ava_population'], 
					jsondata['high_ava_population'], 
					jsondata['high_ava_area'], 
					jsondata['med_ava_population'], 
					jsondata['high_ava_population'], 
					jsondata['med_ava_area'], 
					jsondata['total_ava_population'], 
					jsondata['high_ava_population'], 
					jsondata['total_ava_area']]];
				
				for (var i = 0; i < jsondata['lc_child'].length; i++) {
					aRiskChild[i] = 
						[jsondata['lc_child'][i]['na_en'], 
						jsondata['lc_child'][i]['high_ava_population'], 
						jsondata['lc_child'][i]['high_ava_buildings'], 
						jsondata['lc_child'][i]['high_ava_area'], 
						jsondata['lc_child'][i]['med_ava_population'], 
						jsondata['lc_child'][i]['med_ava_buildings'], 
						jsondata['lc_child'][i]['med_ava_area'], 
						jsondata['lc_child'][i]['total_ava_population'], 
						jsondata['lc_child'][i]['total_ava_buildings'], 
						jsondata['lc_child'][i]['total_ava_area']];
				}
				aRiskAll = (aRiskParent).concat(aRiskChild);
			}
			else if (window.location.href.match(/\?page=earthquake&*/)) {
				var erthqkParent = [];
				var erthqkChild = [];
				var erthqkAll=[];
				erthqkParent = 
					[[jsondata['parent_label'], 
					jsondata['pop_shake_weak'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_weak'], 
					jsondata['pop_shake_light'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_light'], 
					jsondata['pop_shake_moderate'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_moderate'], 
					jsondata['pop_shake_strong'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_strong'], 
					jsondata['pop_shake_verystrong'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_verystrong'], 
					jsondata['pop_shake_severe'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_severe'], 
					jsondata['pop_shake_violent'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_violent'], 
					jsondata['pop_shake_extreme'], 
					jsondata['pop_shake_weak'], 
					jsondata['settlement_shake_extreme']]];

				for (var i = 0; i < jsondata['lc_child'].length; i++) {
					erthqkChild[i] = 
						[jsondata['lc_child'][i]['na_en'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_weak'], 
						jsondata['lc_child'][i]['pop_shake_light'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_light'], 
						jsondata['lc_child'][i]['pop_shake_moderate'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_moderate'], 
						jsondata['lc_child'][i]['pop_shake_strong'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_strong'], 
						jsondata['lc_child'][i]['pop_shake_verystrong'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_verystrong'], 
						jsondata['lc_child'][i]['pop_shake_severe'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_severe'], 
						jsondata['lc_child'][i]['pop_shake_violent'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_violent'], 
						jsondata['lc_child'][i]['pop_shake_extreme'], 
						jsondata['lc_child'][i]['pop_shake_weak'], 
						jsondata['lc_child'][i]['settlement_shake_extreme']];
				}
				erthqkAll = (erthqkParent).concat(erthqkChild);
			}
			else if (window.location.href.match(/\?page=security&*/)) {
				/*var incidentParent = [];
				var incidentAll=[];
				var k = 0;
				var incidentCount = [];
				var incidentViolent = [];
				var incidentInjured = [];
				var incidentDead = [];

				for (var i = 0; i < jsondata['incident_type_group'].length; i++) {
					incidentParent[i] = 
					[jsondata['incident_type_group'][i]['main_type'],
					jsondata['incident_type_group'][i]['count'], 
					jsondata['incident_type_group'][i]['violent'], 
					jsondata['incident_type_group'][i]['injured'], 
					jsondata['incident_type_group'][i]['dead']];

					incidentCount[i] = jsondata['incident_type_group'][i]['count'];
					incidentViolent[i] = jsondata['incident_type_group'][i]['violent'];
					incidentInjured[i] = jsondata['incident_type_group'][i]['injured'];
					incidentDead[i] = jsondata['incident_type_group'][i]['dead'];

					incidentAll[k] = 
					[jsondata['incident_type_group'][i]['main_type'],
					jsondata['incident_type_group'][i]['count'], 
					jsondata['incident_type_group'][i]['violent'], 
					jsondata['incident_type_group'][i]['injured'], 
					jsondata['incident_type_group'][i]['dead']];
					k++;

					if (jsondata['incident_type_group'][i]['child'].length > 1) {
						for (var j = 0; j < jsondata['incident_type_group'][i]['child'].length; j++) {
							incidentAll[k] = 
							[jsondata['incident_type_group'][i]['child'][j]['type'],
							jsondata['incident_type_group'][i]['child'][j]['count'],
							jsondata['incident_type_group'][i]['child'][j]['violent'],
							jsondata['incident_type_group'][i]['child'][j]['injured'],
							jsondata['incident_type_group'][i]['child'][j]['dead']
							];
							k++;
						}
					}
				}

				var targetParent = [];
				var targetAll=[];
				var k = 0;
				var targetCount = [];
				var targetViolent = [];
				var targetInjured = [];
				var targetDead = [];

				for (var i = 0; i < jsondata['incident_target_group'].length; i++) {
					targetParent[i] = 
					[jsondata['incident_target_group'][i]['main_target'],
					jsondata['incident_target_group'][i]['count'], 
					jsondata['incident_target_group'][i]['violent'], 
					jsondata['incident_target_group'][i]['injured'], 
					jsondata['incident_target_group'][i]['dead']];

					targetCount[i] = jsondata['incident_target_group'][i]['count'];
					targetViolent[i] = jsondata['incident_target_group'][i]['violent'];
					targetInjured[i] = jsondata['incident_target_group'][i]['injured'];
					targetDead[i] = jsondata['incident_target_group'][i]['dead'];

					targetAll[k] = 
					[jsondata['incident_target_group'][i]['main_target'],
					jsondata['incident_target_group'][i]['count'], 
					jsondata['incident_target_group'][i]['violent'], 
					jsondata['incident_target_group'][i]['injured'], 
					jsondata['incident_target_group'][i]['dead']];
					k++;

					if (jsondata['incident_target_group'][i]['child'].length > 1) {
						for (var j = 0; j < jsondata['incident_target_group'][i]['child'].length; j++) {
							targetAll[k] = 
							[jsondata['incident_target_group'][i]['child'][j]['target'],
							jsondata['incident_target_group'][i]['child'][j]['count'],
							jsondata['incident_target_group'][i]['child'][j]['violent'],
							jsondata['incident_target_group'][i]['child'][j]['injured'],
							jsondata['incident_target_group'][i]['child'][j]['dead']
							];
							k++;
						}
					}
				}

				var incident_overviewParent = [];
				var incident_overviewChild = [];
				var incident_overviewAll=[];
				incident_overviewParent = [[jsondata['parent_label'], jsondata['total_incident'], jsondata['total_violent'], jsondata['total_injured'], jsondata['total_dead']]];
				for (var i = 0; i < jsondata['lc_child'].length; i++) {
					incident_overviewChild[i] = [jsondata['lc_child'][i]['na_en'], jsondata['lc_child'][i]['total_incident'], jsondata['lc_child'][i]['total_violent'], jsondata['lc_child'][i]['total_injured'], jsondata['lc_child'][i]['total_dead']];
				}
				incident_overviewAll = (incident_overviewParent).concat(incident_overviewChild);

				var incident_list = [];

				for (var i = 0; i < jsondata['incident_list_100'].length; i++) {
					incident_list[i] = 
					[jsondata['incident_list_100'][i]['incident_date'],
					jsondata['incident_list_100'][i]['description']];
				}*/
			}

			// switch(window.location.search){
			// 	case "?page=baseline":
			// 		lcChild = jsondata['jsondata']['lc_child'];
			// 		lcParent = jsondata['jsondata']['lc_afg'];
			// 		hfParent = jsondata['jsondata']['hf_afg'];
			// 		rnParent = jsondata['jsondata']['rn_afg'];

			// 		lcAll = (lcParent).concat(lcChild);
			// 		hfAll = (hfParent).concat(jsondata['jsondata']['hf_child']);
			// 		rnAll = (rnParent).concat(jsondata['jsondata']['rn_child']);
			// 	break;

			// 	case "?page=accessibility":

			// 	break;

			// 	case "?page=floodforecast":

			// 	break;

			// 	case (/\?page=floodrisk&*/):
			// 		// fRiskParent.push(jsondata['parent_label']);
			// 		// fRiskParent.push(jsondata['settlement_at_floodrisk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
			// 		fRiskParent = [[jsondata['parent_label'], jsondata['settlement_at_floodrisk'], jsondata['built_up_pop_risk'], jsondata['built_up_area_risk'], jsondata['settlement_at_floodrisk'], jsondata['cultivated_pop_risk'], jsondata['cultivated_area_risk'], jsondata['settlement_at_floodrisk'], jsondata['barren_pop_risk'], jsondata['barren_area_risk'], jsondata['settlement_at_floodrisk'], jsondata['total_risk_population'], jsondata['total_risk_area'], jsondata['settlement_at_floodrisk']]];
			// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
			// 			fRiskChild[i] = [jsondata['lc_child'][i]['na_en'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['built_up_pop_risk'], jsondata['lc_child'][i]['built_up_area_risk'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['cultivated_pop_risk'], jsondata['lc_child'][i]['cultivated_area_risk'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['barren_pop_risk'], jsondata['lc_child'][i]['barren_area_risk'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['total_risk_population'], jsondata['lc_child'][i]['total_risk_area'], jsondata['lc_child'][i]['total_risk_buildings']];
			// 		}
			// 		fRiskAll = (fRiskParent).concat(fRiskChild);
			// 	break;

			// 	case "?page=avalcheforecast":

			// 	break;

			// 	case "?page=avalancherisk":

			// 	break;

			// 	case "?page=earthquake":

			// 	break;

			// 	case "?page=security":

			// 	break;
			// }
			
		}

		function init_echarts2(tabSelect) {

			if( typeof (echarts) === 'undefined'){
				return;
			}

			// console.log('init_echarts2');

			var humTooltipPie = function(params){
			    console.log(params)
			    var v= params.data.value;
			    var p= params.percent;
			    var n= params.data.name;
			    if(v>=1000 && v<1000000){
			        return n+'</br>'+((v/1000).toFixed(2))+' K (' + p+'%)'
			    }
			    else if (v>=1000000 && v<1000000000) {
			        return n+'</br>'+((v/1000000).toFixed(2))+' M (' + p+'%)'
			    }else{
			        return n+ '</br>'+ v+ ' ('+ p+'%)'
			    }

			};

			var humanizePie = function(params){
				console.log(params)

				var v= params.data.value;
				var p= params.percent;
				var n= params.data.name;
				if(v>=1000 && v<1000000){
					return '\n'+((v/1000).toFixed(2))+' K'+'\n(' + p+'%)'
				}
				else if (v>=1000000 && v<1000000000) {
					return '\n'+((v/1000000).toFixed(2))+' M'+'\n(' + p+'%)'
				}else{
					return '\n'+ v+ '\n('+ p+'%)'
				}

			};

			var humanizeBar = function(params){
				// console.log(params);

				var v= params.data;
				// var n= params.name;
				if(v>=1000 && v<1000000){
					return ((v/1000).toFixed(2))+' K'
				}
				else if (v>=1000000 && v<1000000000) {
					return ((v/1000000).toFixed(2))+' M'
				}else{
					return v
				}

			};

			var humTooltipBar = function(params){
			    console.log('params', params)
			    p = params;
			    if (!Array.isArray(params)) {
			    	params = [params];
			    }

			    var s = '';
			    params.forEach(function(item, index) {
			    	console.log('item', item);
			    	if(item.value>=1000 && item.value<1000000){
			    		vN1=((item.value/1000).toFixed(2))+' K'
			    	    // return n1+' '+((item.value/1000).toFixed(2))+' K'+'</br>'
			    	}
			    	if (item.value>=1000000 && item.value<1000000000) {
			    		vN1=((item.value/1000000).toFixed(2))+' M'
			    	    // return n1+' '+((item.value/1000000).toFixed(2))+' M'+'</br>'
			    	}if (item.value<1000){
			    		vN1=item.value;
			    	    // return n1+' '+ item.value+'</br>'
			    	}
			    	s += item.seriesName+' '+vN1+'</br>';
			    	// item.value;
			    	// item.seriesName;
			    	// item.color; //munculin kode warna grafik
			    });
			    console.log('s', s);
			    return(params[0].name+'</br>'+ s);

			};

			var humTooltipRadar = function(params){
			    console.log(params)

			    var s = '';
			    params.data.value.forEach(function(item, index){
			    	console.log('item', item);
			    	if(item>=1000 && item<1000000){
			    		vN1=((item/1000).toFixed(2))+' K'
			    	}
			    	else if (item>=1000000 && item<1000000000) {
			    		vN1=((item/1000000).toFixed(2))+' M'
			    	}
			    	else {
			    		vN1=item;
			    	}
			    	s += vN1+'</br>';
			    });

			    console.log('s', s);
			    return(params.name+'</br>'+ s);
			    // var v= params.data.value;
			    // var n= params.data.name;
			    // if(v>=1000 && v<1000000){
			    //     return n+'</br>'+((v/1000).toFixed(2))+' K'
			    // }
			    // else if (v>=1000000 && v<1000000000) {
			    //     return n+'</br>'+((v/1000000).toFixed(2))+' M'
			    // }else{
			    //     return n+ '</br>'+ v
			    // }

			};

			var humanizeFormatter = function(value){
				// console.log(value)

				var v= value;
				// var n= params.name;
				if(v>=1000 && v<1000000){
					return (parseFloat((v/1000).toFixed(1)))+' K'
				}
				else if (v>=1000000 && v<1000000000) {
					return (parseFloat((v/1000000).toFixed(1)))+' M'
				}else{
					return (parseFloat((v).toFixed(1)))
				}

			};

			var humTooltipPolar = function(params){
			    console.log(params)
			    var v= params.value;
			    var n= params.name;
			    var s= params.seriesName;
			    if(v>=1000 && v<1000000){
			        return n+'</br>'+ s+' : '+ ((v/1000).toFixed(2))+' K'
			    }
			    else if (v>=1000000 && v<1000000000) {
			        return n+'</br>'+ s+' : '+ ((v/1000000).toFixed(2))+' M'
			    }else{
			        return n+ '</br>'+ s+' : '+ v
			    }

			};

			var theme = {
				  color: [
					  // '#c3272b', '#c93756', '#8e44ad', '#317589', '#003171',
					  // rainbow
					  // '#800026', '#bd0026', '#e31a1c', '#fc4e2a',
					  // '#fd8d3c', '#feb24c', '#fed976', '#ffeda0'
					  //blue to light blue
					  // '#abd9e9', '#74add1',
					  // '#4575b4'

					  // '#84caec', '#5cbae5',
					  // '#27a3dd'

					  // '#c0392b',    '#e74c3c',    '#f39c12',
					  // '#f1c40f',    '#8e44ad',    '#9b59b6',
					  // '#ca2c68'    //'#ff6c5c',    '#ff7c6c'

					  // graphic flat ui color dark red to light
					  // '#870000',    '#a70c00',    '#b71c0c',
					  // '#c72c1c',    '#d73c2c',    '#e74c3c',
					  // '#f75c4c',    '#ff6c5c',    '#ff7c6c'

					  // neon theme
					  '#ffaaab', '#ff6264', '#d13c3e', '#b92527'

					  // elmo
					  // '#edd382', '#fc9e4f', '#e24e1b', '#f2f3ae'

					  // red sap
					  // /*'#930a0a',*/ '#b90c0d', /*'#dc0d0e',*/
					  // '#f33334', '#f66364', '#f99494'

					  // gray sap
					  //'#596468', /*'#69767c',*/ '#848f94', '#9ea8ad', '#bac1c4', '#d5dadc'

					  // sap
					  // '#5cbae6',    '#b6d957',    '#fac364',
					  // '#8cd3ff',    '#d998cb',    '#f2d249',
					  // '#93b9c6',    '#ccc5a8',    '#52bacc',
					  // '#dbdb46',    '#98aafb'

					  // colorbrewer
					  // red and yellow
					  // '#ffeda0',
					  // '#fed976',
					  // '#feb24c',
					  // '#fd8d3c',
					  // '#fc4e2a',
					  // '#e31a1c',
					  // '#bd0026',
					  // '#800026'

					  // red
					  // '#fee0d2',
					  // '#fcbba1',
					  // '#fc9272',
					  // '#fb6a4a',
					  // '#ef3b2c',
					  // '#cb181d',
					  // '#a50f15',
					  // '#67000d'

					  // red to gray
					  // '#b2182b',
					  // '#d6604d',
					  // '#f4a582',
					  // '#fddbc7',
					  // // '#ffffff',
					  // '#e0e0e0',
					  // '#bababa',
					  // '#878787',
					  // '#4d4d4d'

					  // red to green 6
					  // '#d73027',
					  // '#fc8d59',
					  // '#fee08b',
					  // '#d9ef8b',
					  // '#91cf60',
					  // '#1a9850'

					  // qualitative 12
					  // '#a6cee3',
					  // '#1f78b4',
					  // '#b2df8a',
					  // '#33a02c',
					  // '#fb9a99',
					  // '#e31a1c',
					  // '#fdbf6f',
					  // '#ff7f00',
					  // '#cab2d6',
					  // '#6a3d9a',
					  // '#ffff99',
					  // '#b15928'



					  // '#26B99A', '#34495E', '#BDC3C7', '#3498DB',
					  // '#9B59B6', '#8abb6f', '#759c6a', '#bfd3b7'
				  ],

				  title: {
					  itemGap: 8,
					  textStyle: {
						  fontWeight: 'normal',
						  color: '#408829'
					  }
				  },

				  dataRange: {
					  color: ['#1f610a', '#97b58d']
				  },

				  toolbox: {
					  color: ['#408829', '#408829', '#408829', '#408829']
				  },

				  tooltip: {
					  backgroundColor: 'rgba(0,0,0,0.5)',
					  axisPointer: {
						  type: 'line',
						  lineStyle: {
							  color: '#408829',
							  type: 'dashed'
						  },
						  crossStyle: {
							  color: '#408829'
						  },
						  shadowStyle: {
							  color: 'rgba(200,200,200,0.3)'
						  }
					  }
				  },

				  dataZoom: {
					  dataBackgroundColor: '#eee',
					  fillerColor: 'rgba(64,136,41,0.2)',
					  handleColor: '#408829'
				  },
				  grid: {
					  borderWidth: 0
				  },

				  categoryAxis: {
					  axisLine: {
						  lineStyle: {
							  color: '#252525'
						  }
					  },
					  splitLine: {
						  lineStyle: {
							  color: ['#eee']
						  }
					  }
				  },

				  valueAxis: {
					  axisLine: {
						  lineStyle: {
							  color: '#252525'
						  }
					  },
					  splitArea: {
						  show: true,
						  areaStyle: {
							  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
						  }
					  },
					  splitLine: {
						  lineStyle: {
							  color: ['#eee']
						  }
					  }
				  },
				  timeline: {
					  lineStyle: {
						  color: '#408829'
					  },
					  controlStyle: {
						  normal: {color: '#408829'},
						  emphasis: {color: '#408829'}
					  }
				  },
				  textStyle: {
					  fontFamily: 'Arial, Verdana, sans-serif'
				  },
				  animation: animate
		  	};

		  	var w = ['#ffaaab', '#ff6264', '#d13c3e', '#b92527']

		  	var colorReversed= {
		  		normal:{
		  			color: '#b92527'
		  		}
		  	}

		  	var pieNull={
		  		normal:{
		  			color: '#ccc',
		  			// label: {
		  			// 	show: true,
		  			// 	position: 'center'
		  			// },
		  			labelLine:{
		  				show: true
		  			}
		  		},
		  		emphasis:{

		  		}
		  	};

		  	var colorBlue = {
		  		color:[
		  			//blue to light blue
					'#abd9e9', '#74add1', '#4575b4'
					// '#84caec', '#5cbae5', '#27a3dd'
		  		],
		  		valueAxis: {
					  axisLine: {
						  lineStyle: {
							  color: '#FF0000'
						  }
					  },
					  splitArea: {
						  show: true,
						  areaStyle: {
							  color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)']
						  }
					  },
					  splitLine: {
						  lineStyle: {
							  color: ['#eee']
						  }
					  }
				  },
		  		dataRange: {
					  color: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF']
				}
		  	}

		  	var colorMercalli = {
		  		color:[
		  			// /*'#eeeeee', '#bfccff',*/ '#9999ff', '#88ffff', '#7df894', '#ffff00',
		  			// '#ffdd00', '#ff9100', '#ff0000', '#dd0000', '#880000', '#440000'

		  			'#d4e6f1', '#c2fcf7', '#6dffb6', '#ffff5c',
		  			 '#ffe74c', '#ffc600', '#ff5751', '#e84c3d'
		  		]
		  	}

		  	var colorTime = {
		  		color:[
		  			'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', /*'#fffc79',*/ /*'#ffe641', '#FFD341', '#FFC041',*/ '#fffe7f', '#feb24c', '#fd8d3c', /*'#ffdd72',*/
		  			/*'#ffd341',*/ '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
		  		]
		  	}

		  	var colorBar = 
		  		function(params){	
		  			return color[params.dataIndex]
		  		}
		  	

		  	var checkIndicator2 = tc1;
		  	// [
		  	// 	{
			  // 		text: 'Armed Opposition Group',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Intl. Humanitarian Cmty.',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Government',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Police/ Military Gov.',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Infrastructure',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Civilians',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Humanitarian Cmty.',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Unknown',
			  // 		// max: 10
			  // 	  }, {
			  // 		text: 'Intl. Military',
			  // 		// max: 10
			  // 	  }
		  	// ]

		  	var checkIndicator1 = ic1;
		  	// [
				 //  {
					// text: 'Military/Non-Military Operation',
					// // max: 5000
				 //  }, {
					// text: 'Attack',
					// // max: 5000
				 //  }, {
					// text: 'Kidnapping',
					// // max: 5000
				 //  }, {
					// text: 'Murder',
					// // max: 5000
				 //  }, {
					// text: 'Weapons',
					// // max: 5000
				 //  }, {
					// text: 'Abandonment',
					// // max: 5000
				 //  }, {
					// text: 'Small Arms Fire',
					// // max: 5000
				 //  }, {
					// text: 'Civillian Accident',
					// // max: 5000
				 //  }, {
					// text: 'Demonstration',
					// // max: 5000
				 //  }, {
					// text: 'IED',
					// // max: 5000
				 //  }, {
					// text: 'Arrest',
					// // max: 5000
				 //  }, {
					// text: 'Others',
					// // max: 5000
				 //  }, {
					// text: 'UXO',
					// // max: 5000
				 //  }
		  	// ]

	  		// case "accessibility":
	  			// accessibility tab
	  			//echart Donut
	  			  
	  			if ($('#echart_donut').length ){  

	  				// console.log('init_echart_donut');
	  			  
	  			  var echartDonut = echarts.init(document.getElementById('echart_donut'), theme, humTooltipPie, humanizePie, pieNull);
	  			  
	  			  echartDonut.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: gsm_legend
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Population',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: 
	  				  {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie
	  						// "{b} \n"+humanize+" ({d}%)"
	  					  }/*,
	  					  labelLine: {
	  						show: true
	  					  }*/
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: gsm_pop,
	  					name: gsm_legend[0],
	  					itemStyle: colorReversed
	  				  }, {
	  					value: tot_pop - gsm_pop,
	  					name: gsm_legend[1],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonut.resize();
	  			  	});

	  			}

	  			// echart Donut 2

	  			if ($('#echart_donut_2').length ){  
	  			  
	  			  var echartDonut2 = echarts.init(document.getElementById('echart_donut_2'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonut2.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: gsm_legend
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: gsm_area,
	  					name: gsm_legend[0],
	  					itemStyle: colorReversed
	  				  }, {
	  					value: tot_area - gsm_area,
	  					name: gsm_legend[1],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonut2.resize();
	  			  	});

	  			} 

	  			// echart Donut 3

	  			if ($('#echart_donut_gsm_building').length ){  
	  			  
	  			  var echartDonutGSMBuild = echarts.init(document.getElementById('echart_donut_gsm_building'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonutGSMBuild.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: gsm_legend
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: gsm_area,
	  					name: gsm_legend[0],
	  					itemStyle: colorReversed
	  				  }, {
	  					value: tot_area - gsm_area,
	  					name: gsm_legend[1],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutGSMBuild.resize();
	  			  	});

	  			} 

	  			//echart Bar Horizontal 4
					  
				if ($('#echart_bar_horizontal_4').length ){ 
				  
				  var echartBar = echarts.init(document.getElementById('echart_bar_horizontal_4'), colorTime, humTooltipBar, humanizeBar);

				  echartBar.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_airport
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

				//echart Bar Horizontal 5
				  
				if ($('#echart_bar_horizontal_5').length ){ 
				  
				  var echartBar5 = echarts.init(document.getElementById('echart_bar_horizontal_5'), colorTime, humTooltipBar, humanizeBar);

				  echartBar5.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_h1
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar5.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

				//echart Bar Horizontal 6
				  
				if ($('#echart_bar_horizontal_6').length ){ 
				  
				  var echartBar6 = echarts.init(document.getElementById('echart_bar_horizontal_6'), colorTime, humTooltipBar, humanizeBar);

				  echartBar6.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_h2
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar6.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

				//echart Bar Horizontal 7
				  
				if ($('#echart_bar_horizontal_7').length ){ 
				  
				  var echartBar7 = echarts.init(document.getElementById('echart_bar_horizontal_7'), colorTime, humTooltipBar, humanizeBar);

				  echartBar7.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_h3
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar7.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

				//echart Bar Horizontal 8
				  
				if ($('#echart_bar_horizontal_8').length ){ 
				  
				  var echartBar8 = echarts.init(document.getElementById('echart_bar_horizontal_8'), colorTime, humTooltipBar, humanizeBar);

				  echartBar8.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_h_all
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar8.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

				//echart Bar Horizontal 9
				  
				if ($('#echart_bar_horizontal_9').length ){ 
				  
				  var echartBar9 = echarts.init(document.getElementById('echart_bar_horizontal_9'), colorTime, humTooltipBar, humanizeBar);

				  echartBar9.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_it_prov_cap
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar9.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

				//echart Bar Horizontal 10
				  
				if ($('#echart_bar_horizontal_10').length ){ 
				  
				  var echartBar10 = echarts.init(document.getElementById('echart_bar_horizontal_10'), colorTime, humTooltipBar, humanizeBar);

				  echartBar10.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_prov_cap
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar10.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

				//echart Bar Horizontal 11
				  
				if ($('#echart_bar_horizontal_11').length ){ 
				  
				  var echartBar11 = echarts.init(document.getElementById('echart_bar_horizontal_11'), colorTime, humTooltipBar, humanizeBar);

				  echartBar11.setOption({
				  	// backgroundColor: '#000',
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar'
				    	  },
				    	  type: ['line', 'bar']
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
					}],
					series: [{
					  name: 'Airport',
					  type: 'bar',
					  itemStyle:{
					  	normal:{
					  		color: function(params){
					  			var colorList=[
					  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', '#fffc79', '#ffdd72',
					  				'#ffd341', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
					  			];
					  			return colorList[params.dataIndex]
					  		}
					  	}
					  },
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: near_dist_cap
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar11.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }

				}

	  			// //echart Pie
	  			  
	  			// if ($('#echart_pie').length ){  
	  			  
	  			//   var echartPie1 = echarts.init(document.getElementById('echart_pie'), colorTime, humTooltipPie, humanizePie);

	  			//   echartPie1.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: [/*'15%', '25%'*/30, 110],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  roseType : 'area',
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 14900000,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 7400000,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 3600000,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 1600000,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 775996,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 477632,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 359146,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 593026,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1400000,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   var dataStyle = {
	  			// 	normal: {
	  			// 	  label: {
	  			// 		show: false
	  			// 	  },
	  			// 	  labelLine: {
	  			// 		show: false
	  			// 	  }
	  			// 	}
	  			//   };

	  			//   var placeHolderStyle = {
	  			// 	normal: {
	  			// 	  color: 'rgba(0,0,0,0)',
	  			// 	  label: {
	  			// 		show: false
	  			// 	  },
	  			// 	  labelLine: {
	  			// 		show: false
	  			// 	  }
	  			// 	},
	  			// 	emphasis: {
	  			// 	  color: 'rgba(0,0,0,0)'
	  			// 	}
	  			//   };

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie1.resize();
	  			//   	});

	  			//   	// window.onresize = function(){
	  			//   	// 	echartPie.resize();
	  			//   	// }

	  			// } 

	  			// // echart Pie 2

	  			// if ($('#echart_pie_2').length ){  
	  			  
	  			//   var echartPie2 = echarts.init(document.getElementById('echart_pie_2'), colorTime);

	  			//   echartPie2.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: ['15%', '25%'],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 21395164,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 4203840,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 1940909,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 945379,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 537423,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 346062,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 287884,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 460079,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1022070,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie2.resize();
	  			//   	});

	  			// } 

	  			// // echart Pie 3

	  			// if ($('#echart_pie_3').length ){  
	  			  
	  			//   var echartPie3 = echarts.init(document.getElementById('echart_pie_3'), colorTime);

	  			//   echartPie3.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: ['15%', '25%'],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 14900000,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 7400000,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 3600000,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 1600000,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 775996,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 477632,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 359146,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 593026,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1400000,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie3.resize();
	  			//   	});

	  			// } 

	  			// // echart Pie 4

	  			// if ($('#echart_pie_4').length ){  
	  			  
	  			//   var echartPie4 = echarts.init(document.getElementById('echart_pie_4'), colorTime);

	  			//   echartPie4.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: ['15%', '25%'],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 14900000,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 7400000,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 3600000,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 1600000,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 775996,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 477632,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 359146,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 593026,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1400000,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie4.resize();
	  			//   	});

	  			// } 

	  			// // echart Pie 5

	  			// if ($('#echart_pie_5').length ){  
	  			  
	  			//   var echartPie5 = echarts.init(document.getElementById('echart_pie_5'), colorTime);

	  			//   echartPie5.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: ['15%', '25%'],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 14900000,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 7400000,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 3600000,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 1600000,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 775996,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 477632,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 359146,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 593026,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1400000,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie5.resize();
	  			//   	});

	  			// } 

	  			// // echart Pie 6

	  			// if ($('#echart_pie_6').length ){  
	  			  
	  			//   var echartPie6 = echarts.init(document.getElementById('echart_pie_6'), colorTime);

	  			//   echartPie6.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: ['15%', '25%'],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 14900000,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 7400000,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 3600000,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 1600000,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 775996,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 477632,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 359146,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 593026,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1400000,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie6.resize();
	  			//   	});

	  			// } 

	  			// // echart Pie 7

	  			// if ($('#echart_pie_7').length ){  
	  			  
	  			//   var echartPie7 = echarts.init(document.getElementById('echart_pie_7'), colorTime);

	  			//   echartPie7.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: ['15%', '25%'],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 14900000,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 7400000,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 3600000,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 1600000,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 775996,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 477632,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 359146,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 593026,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1400000,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie7.resize();
	  			//   	});

	  			// } 

	  			// // echart Pie 10

	  			// if ($('#echart_pie_10').length ){  
	  			  
	  			//   var echartPie8 = echarts.init(document.getElementById('echart_pie_10'), colorTime);

	  			//   echartPie8.setOption({
	  			// 	tooltip: {
	  			// 	  trigger: 'item',
	  			// 	  formatter: humTooltipPie
	  			// 	},
	  			// 	legend: {
	  			// 	  x: 'center',
	  			// 	  y: 'bottom',
	  			// 	  data: ['< 1h', '< 2h', '< 3h', '< 4h', '< 5h', '< 6h', '< 7h', '< 8h', '> 8h']
	  			// 	},
	  			// 	toolbox: {
	  			// 	  show: true,
	  			// 	  feature: {
	  			// 		magicType: {
	  			// 		  show: true,
	  			// 		  type: ['pie', 'funnel'],
	  			// 		  option: {
	  			// 			funnel: {
	  			// 			  x: '25%',
	  			// 			  width: '50%',
	  			// 			  funnelAlign: 'left',
	  			// 			  max: 1548
	  			// 			}
	  			// 		  }
	  			// 		},
	  			// 		restore: {
	  			// 		  show: true,
	  			// 		  title: "Restore"
	  			// 		},
	  			// 		saveAsImage: {
	  			// 		  show: true,
	  			// 		  title: "Save Image"
	  			// 		}
	  			// 	  }
	  			// 	},
	  			// 	calculable: true,
	  			// 	series: [{
	  			// 	  name: 'Nearest Airport',
	  			// 	  type: 'pie',
	  			// 	  radius: ['15%', '25%'],
	  			// 	  // radius: '30%',
	  			// 	  center: ['50%', '40%'],
	  			// 	  itemStyle: {
	  			// 		normal: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			formatter: humanizePie //"{b} \n{c} ({d}%)"
	  			// 		  },
	  			// 		  labelLine: {
	  			// 			show: true
	  			// 		  }
	  			// 		},
	  			// 		emphasis: {
	  			// 		  label: {
	  			// 			show: true,
	  			// 			position: 'center',
	  			// 			textStyle: {
	  			// 			  fontSize: '14',
	  			// 			  fontWeight: 'normal'
	  			// 			}
	  			// 		  }
	  			// 		}
	  			// 	  },
	  			// 	  data: [{
	  			// 		value: 14900000,
	  			// 		name: '< 1h'
	  			// 	  }, {
	  			// 		value: 7400000,
	  			// 		name: '< 2h'
	  			// 	  }, {
	  			// 		value: 3600000,
	  			// 		name: '< 3h'
	  			// 	  }, {
	  			// 		value: 1600000,
	  			// 		name: '< 4h'
	  			// 	  }, {
	  			// 		value: 775996,
	  			// 		name: '< 5h'
	  			// 	  }, {
	  			// 		value: 477632,
	  			// 		name: '< 6h'
	  			// 	  }, {
	  			// 		value: 359146,
	  			// 		name: '< 7h'
	  			// 	  }, {
	  			// 		value: 593026,
	  			// 		name: '< 8h'
	  			// 	  }, {
	  			// 		value: 1400000,
	  			// 		name: '> 8h'
	  			// 	  }]
	  			// 	}]
	  			//   });

	  			//   	window.addEventListener("resize", function(){
	  			//   		echartPie8.resize();
	  			//   	});

	  			// } 
	  		// break;

	  		// case "fforecast":
	  			// fforecast tab
	  			// echart Bar Stack

	  			if ($('#echart_bar_stack').length ){

	  				// console.log('init_echarts_bar_stack');
	  			  
	  				var echartBar1 = echarts.init(document.getElementById('echart_bar_stack'), colorBlue, humanizeBar);

	  				echartBar1.setOption({
	  					// title: {
	  					//   text: 'Graph title',
	  					//   subtext: 'Graph Sub-text',
	  					//   x: 'center'
	  					// },
	  					animation: animate,
	  					tooltip: {
	  					  trigger: 'axis',
	  					  axisPointer:{
	  					  	type:'shadow'
	  					  },
	  					  formatter: humTooltipBar
	  					},
	  					legend: {
	  						x: 'center',
	  						y: 'bottom',
	  					  data: fforecast_legend
	  					},
	  					toolbox: {
	  				      show: true,
	  				      feature: {
	  				    	magicType: {
	  				    	  show: true,
	  				    	  title: {
	  				    		line: 'Line',
	  				    		bar: 'Bar',
	  				    		stack: 'Stack',
	  				    		tiled: 'Tiled'
	  				    	  },
	  				    	  type: ['line', 'bar', 'stack', 'tiled']
	  				    	},
	  				    	restore: {
	  				    	  show: true,
	  				    	  title: "Restore"
	  				    	},
	  				    	saveAsImage: {
	  				    	  show: true,
	  				    	  title: "Save Image"
	  				    	}
	  				      }
	  					},
							grid: {
						        left: '1%',
						        right: '20%',
						        bottom: '8%',
						        containLabel: true
						    },
	  					calculable: true,
	  					textStyle:{
	  						fontSize: '10'
	  					},
	  					xAxis: [{
	  					  type: 'category',
	  					  name: 'Likelihood',
	  					  // nameRotate: 30,
	  					  data: fforecast_cat,
	  					  // data: ['Extreme', 'Very High', 'High', 'Moderate', 'Low'],
	  					  axisLabel:{
	  					  	textStyle: {
	  					  		fontSize: '10',
	  					  		color: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF']
	  					  	}
	  					  }
	  					}],
	  					yAxis: [{
	  					  type: 'log',
	  					  name: 'Population',
	  					  axisLabel:{
	  					  	// rotate: 30,
	  					  	textStyle: {
	  					  		fontSize: '10'
	  					  	},
	  					  	formatter: humanizeFormatter
	  					  }
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: fforecast_low_val
	  					  // data: [jsondata['flashflood_forecast_extreme_risk_low_pop'], jsondata['flashflood_forecast_veryhigh_risk_low_pop'], jsondata['flashflood_forecast_high_risk_low_pop'], jsondata['flashflood_forecast_med_risk_low_pop'], jsondata['flashflood_forecast_low_risk_low_pop']]
	  					  // data: [0, 28073, 4708, 196553, 237405]
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: fforecast_med_val
	  					  // data: [jsondata['flashflood_forecast_extreme_risk_med_pop'], jsondata['flashflood_forecast_veryhigh_risk_med_pop'], jsondata['flashflood_forecast_high_risk_med_pop'], jsondata['flashflood_forecast_med_risk_med_pop'], jsondata['flashflood_forecast_low_risk_med_pop']]
	  					  // data: [0, 21875, 8484, 149036, 238381]
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20, //galau. kalo pake min height ntar ga sesuai sm log nya hasilnya
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: fforecast_hi_val
	  					  // data: [jsondata['flashflood_forecast_extreme_risk_high_pop'], jsondata['flashflood_forecast_veryhigh_risk_high_pop'], jsondata['flashflood_forecast_high_risk_high_pop'], jsondata['flashflood_forecast_med_risk_high_pop'], jsondata['flashflood_forecast_low_risk_high_pop']]
	  					  // data: [0, 10150, 11396, 161921, 177592]
	  					 //  markPoint: {
	  						// data: [{
	  						//   type: 'max',
	  						//   name: '???'
	  						// }, {
	  						//   type: 'min',
	  						//   name: '???'
	  						// }]
	  					 //  },
	  					 //  markLine: {
	  						// data: [{
	  						//   type: 'average',
	  						//   name: '???'
	  						// }]
	  					 //  }
	  					}]
	  				});

  				  	window.addEventListener("resize", function(){
  				  		echartBar1.resize();
  				  	});

	  			}

	  			// echart Bar Stack 2

	  			if ($('#echart_bar_stack_2').length ){

	  				// console.log('init_echarts_bar_stack_2');
	  			  
	  				var echartBar2 = echarts.init(document.getElementById('echart_bar_stack_2'), colorBlue, humanizeBar);

	  				echartBar2.setOption({
	  					// title: {
	  					//   text: 'Graph title',
	  					//   subtext: 'Graph Sub-text',
	  					//   x: 'center'
	  					// },
	  					tooltip: {
	  					  trigger: 'axis',
	  					  axisPointer:{
	  					  	type:'shadow'
	  					  },
	  					  formatter: humTooltipBar
	  					},
	  					legend: {
	  						x: 'center',
	  						y: 'bottom',
	  					  data: fforecast_legend
	  					},
	  					toolbox: {
	  				      show: true,
	  				      feature: {
	  				    	magicType: {
	  				    	  show: true,
	  				    	  title: {
	  				    		line: 'Line',
	  				    		bar: 'Bar',
	  				    		stack: 'Stack',
	  				    		tiled: 'Tiled'
	  				    	  },
	  				    	  type: ['line', 'bar', 'stack', 'tiled']
	  				    	},
	  				    	restore: {
	  				    	  show: true,
	  				    	  title: "Restore"
	  				    	},
	  				    	saveAsImage: {
	  				    	  show: true,
	  				    	  title: "Save Image"
	  				    	}
	  				      }
	  					},
							grid: {
						        left: '1%',
						        right: '20%',
						        bottom: '8%',
						        containLabel: true
						    },
	  					calculable: true,
	  					textStyle:{
	  						fontSize: '10'
	  					},
	  					xAxis: [{
	  					  type: 'category',
	  					  name: 'Likelihood',
	  					  // nameRotate: 30,
	  					  data: fforecast_cat,
	  					  axisLabel:{
	  					  	textStyle: {
	  					  		fontSize: '10',
	  					  		color: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF']
	  					  	}
	  					  }
	  					}],
	  					yAxis: [{
	  					  type: 'log',
	  					  name: 'Population',
	  					  axisLabel:{
	  					  	// rotate: 30,
	  					  	textStyle: {
	  					  		fontSize: '10'
	  					  	},
	  					  	formatter: humanizeFormatter
	  					  }
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: ggforecast_low_val
	  					  // data: [jsondata['gfms_glofas_riverflood_forecast_extreme_risk_low_pop'], jsondata['gfms_glofas_riverflood_forecast_veryhigh_risk_low_pop'], jsondata['gfms_glofas_riverflood_forecast_high_risk_low_pop'], jsondata['gfms_glofas_riverflood_forecast_med_risk_low_pop'], jsondata['gfms_glofas_riverflood_forecast_low_risk_low_pop']]
	  					  // data: [jsondata[''], jsondata[''], jsondata[''], jsondata[''], jsondata['']]
	  					  // data: [0, 28073, 4708, 196553, 237405]
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: ggforecast_med_val
	  					  // data: [jsondata['gfms_glofas_riverflood_forecast_extreme_risk_med_pop'], jsondata['gfms_glofas_riverflood_forecast_veryhigh_risk_med_pop'], jsondata['gfms_glofas_riverflood_forecast_high_risk_med_pop'], jsondata['gfms_glofas_riverflood_forecast_med_risk_med_pop'], jsondata['gfms_glofas_riverflood_forecast_low_risk_med_pop']]
	  					  // data: [0, 21875, 8484, 149036, 238381]
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20, //galau. kalo pake min height ntar ga sesuai sm log nya hasilnya
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: ggforecast_hi_val
	  					  // data: [jsondata['gfms_glofas_riverflood_forecast_extreme_risk_high_pop'], jsondata['gfms_glofas_riverflood_forecast_veryhigh_risk_high_pop'], jsondata['gfms_glofas_riverflood_forecast_high_risk_high_pop'], jsondata['gfms_glofas_riverflood_forecast_med_risk_high_pop'], jsondata['gfms_glofas_riverflood_forecast_low_risk_high_pop']]
	  					  // data: [0, 10150, 11396, 161921, 177592]
	  					 //  markPoint: {
	  						// data: [{
	  						//   type: 'max',
	  						//   name: '???'
	  						// }, {
	  						//   type: 'min',
	  						//   name: '???'
	  						// }]
	  					 //  },
	  					 //  markLine: {
	  						// data: [{
	  						//   type: 'average',
	  						//   name: '???'
	  						// }]
	  					 //  }
	  					}]
	  				});

	  				  	window.addEventListener("resize", function(){
	  				  		echartBar2.resize();
	  				  	});

	  			}

	  			// echart Bar Stack 3

	  			if ($('#echart_bar_stack_3').length ){

	  				// console.log('init_echarts_bar_stack_3');
	  			  
	  				var echartBar3 = echarts.init(document.getElementById('echart_bar_stack_3'), colorBlue, humanizeBar);

	  				echartBar3.setOption({
	  					// title: {
	  					//   text: 'Graph title',
	  					//   subtext: 'Graph Sub-text',
	  					//   x: 'center'
	  					// },
	  					tooltip: {
	  					  trigger: 'axis',
	  					  axisPointer:{
	  					  	type:'shadow'
	  					  },
	  					  formatter: humTooltipBar
	  					},
	  					legend: {
	  						x: 'center',
	  						y: 'bottom',
	  					  data: fforecast_legend
	  					},
	  					toolbox: {
	  				      show: true,
	  				      feature: {
	  				    	magicType: {
	  				    	  show: true,
	  				    	  title: {
	  				    		line: 'Line',
	  				    		bar: 'Bar',
	  				    		stack: 'Stack',
	  				    		tiled: 'Tiled'
	  				    	  },
	  				    	  type: ['line', 'bar', 'stack', 'tiled']
	  				    	},
	  				    	restore: {
	  				    	  show: true,
	  				    	  title: "Restore"
	  				    	},
	  				    	saveAsImage: {
	  				    	  show: true,
	  				    	  title: "Save Image"
	  				    	}
	  				      }
	  					},
							grid: {
						        left: '1%',
						        right: '20%',
						        bottom: '8%',
						        containLabel: true
						    },
	  					calculable: true,
	  					textStyle:{
	  						fontSize: '10'
	  					},
	  					xAxis: [{
	  					  type: 'category',
	  					  name: 'Likelihood',
	  					  // nameRotate: 30,
	  					  data: fforecast_cat,
	  					  axisLabel:{
	  					  	textStyle: {
	  					  		fontSize: '10',
	  					  		color: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF']
	  					  	}
	  					  }
	  					}],
	  					yAxis: [{
	  					  type: 'log',
	  					  name: 'Population',
	  					  axisLabel:{
	  					  	// rotate: 30,
	  					  	textStyle: {
	  					  		fontSize: '10'
	  					  	},
	  					  	formatter: humanizeFormatter
	  					  }
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: glforecast_low_val
	  					  // data: [jsondata['glofas_riverflood_forecast_extreme_risk_low_pop'], jsondata['glofas_riverflood_forecast_veryhigh_risk_low_pop'], jsondata['glofas_riverflood_forecast_high_risk_low_pop'], jsondata['glofas_riverflood_forecast_med_risk_low_pop'], jsondata['glofas_riverflood_forecast_low_risk_low_pop']]
	  					  // data: [0, 28073, 4708, 196553, 237405]
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: glforecast_med_val
	  					  // data: [jsondata['glofas_riverflood_forecast_extreme_risk_med_pop'], jsondata['glofas_riverflood_forecast_veryhigh_risk_med_pop'], jsondata['glofas_riverflood_forecast_high_risk_med_pop'], jsondata['glofas_riverflood_forecast_med_risk_med_pop'], jsondata['glofas_riverflood_forecast_low_risk_med_pop']]
	  					  // data: [0, 21875, 8484, 149036, 238381]
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20, //galau. kalo pake min height ntar ga sesuai sm log nya hasilnya
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: glforecast_hi_val
	  					  // data: [jsondata['glofas_riverflood_forecast_extreme_risk_high_pop'], jsondata['glofas_riverflood_forecast_veryhigh_risk_high_pop'], jsondata['glofas_riverflood_forecast_high_risk_high_pop'], jsondata['glofas_riverflood_forecast_med_risk_high_pop'], jsondata['glofas_riverflood_forecast_low_risk_high_pop']]
	  					  // data: [0, 10150, 11396, 161921, 177592]
	  					 //  markPoint: {
	  						// data: [{
	  						//   type: 'max',
	  						//   name: '???'
	  						// }, {
	  						//   type: 'min',
	  						//   name: '???'
	  						// }]
	  					 //  },
	  					 //  markLine: {
	  						// data: [{
	  						//   type: 'average',
	  						//   name: '???'
	  						// }]
	  					 //  }
	  					}]
	  				});

	  				  	window.addEventListener("resize", function(){
	  				  		echartBar3.resize();
	  				  	});

	  			}

	  			// echart Bar Stack 4

	  			if ($('#echart_bar_stack_4').length ){
	  			  
	  				var echartBar4 = echarts.init(document.getElementById('echart_bar_stack_4'), colorBlue, humanizeBar);

	  				echartBar4.setOption({
	  					// title: {
	  					//   text: 'Graph title',
	  					//   subtext: 'Graph Sub-text',
	  					//   x: 'center'
	  					// },
	  					tooltip: {
	  					  trigger: 'axis',
	  					  axisPointer:{
	  					  	type:'shadow'
	  					  },
	  					  formatter: humTooltipBar
	  					},
	  					legend: {
	  						x: 'center',
	  						y: 'bottom',
	  					  data: fforecast_legend
	  					},
	  					toolbox: {
	  				      show: true,
	  				      feature: {
	  				    	magicType: {
	  				    	  show: true,
	  				    	  title: {
	  				    		line: 'Line',
	  				    		bar: 'Bar',
	  				    		stack: 'Stack',
	  				    		tiled: 'Tiled'
	  				    	  },
	  				    	  type: ['line', 'bar', 'stack', 'tiled']
	  				    	},
	  				    	restore: {
	  				    	  show: true,
	  				    	  title: "Restore"
	  				    	},
	  				    	saveAsImage: {
	  				    	  show: true,
	  				    	  title: "Save Image"
	  				    	}
	  				      }
	  					},
							grid: {
						        left: '1%',
						        right: '20%',
						        bottom: '8%',
						        containLabel: true
						    },
	  					calculable: true,
	  					textStyle:{
	  						fontSize: '10'
	  					},
	  					xAxis: [{
	  					  type: 'category',
	  					  name: 'Likelihood',
	  					  // nameRotate: 30,
	  					  data: fforecast_cat,
	  					  axisLabel:{
	  					  	textStyle: {
	  					  		fontSize: '10',
	  					  		color: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF']
	  					  	}
	  					  }
	  					}],
	  					yAxis: [{
	  					  type: 'log',
	  					  name: 'Population',
	  					  axisLabel:{
	  					  	// rotate: 30,
	  					  	textStyle: {
	  					  		fontSize: '10'
	  					  	},
	  					  	formatter: humanizeFormatter
	  					  }
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: gfforecast_low_val
	  					  // data: [jsondata['riverflood_forecast_extreme_risk_low_pop'], jsondata['riverflood_forecast_veryhigh_risk_low_pop'], jsondata['riverflood_forecast_high_risk_low_pop'], jsondata['riverflood_forecast_med_risk_low_pop'], jsondata['riverflood_forecast_low_risk_low_pop']]
	  					  // data: [0, 28073, 4708, 196553, 237405]
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: gfforecast_med_val
	  					  // data: [jsondata['riverflood_forecast_extreme_risk_med_pop'], jsondata['riverflood_forecast_veryhigh_risk_med_pop'], jsondata['riverflood_forecast_high_risk_med_pop'], jsondata['riverflood_forecast_med_risk_med_pop'], jsondata['riverflood_forecast_low_risk_med_pop']]
	  					  // data: [0, 21875, 8484, 149036, 238381]
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  barMinHeight: 20, //galau. kalo pake min height ntar ga sesuai sm log nya hasilnya
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: gfforecast_hi_val
	  					  // data: [jsondata['riverflood_forecast_extreme_risk_high_pop'], jsondata['riverflood_forecast_veryhigh_risk_high_pop'], jsondata['riverflood_forecast_high_risk_high_pop'], jsondata['riverflood_forecast_med_risk_high_pop'], jsondata['riverflood_forecast_low_risk_high_pop']]
	  					  // data: [0, 10150, 11396, 161921, 177592]
	  					 //  markPoint: {
	  						// data: [{
	  						//   type: 'max',
	  						//   name: '???'
	  						// }, {
	  						//   type: 'min',
	  						//   name: '???'
	  						// }]
	  					 //  },
	  					 //  markLine: {
	  						// data: [{
	  						//   type: 'average',
	  						//   name: '???'
	  						// }]
	  					 //  }
	  					}]
	  				});

	  				  	window.addEventListener("resize", function(){
	  				  		echartBar4.resize();
	  				  	});

	  			}
	  		// break;

	  		// case "frisk":
	  			// frisk tab
	  			// echart Donut 3

	  			if ($('#echart_donut_3').length ){  
	  			  
		  			var echartDonut = echarts.init(document.getElementById('echart_donut_3'), theme, humTooltipPie, humanizePie);
		  			  
		  			echartDonut.setOption({
		  				tooltip: {
		  				  trigger: 'item',
		  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
		  				},
		  				calculable: true,
		  				legend: {
		  				  x: 'left',
		  				  y: 'top',
		  				  orient: 'vertical',
		  				  data: frisk_cat
		  				  // data: ['Low Risk','Medium Risk', 'High Risk', 'Not at Risk']
		  				},
		  				toolbox: {
		  				  show: true,
		  				  feature: {
		  					magicType: {
		  					  show: true,
		  					  type: ['pie', 'funnel'],
		  					  option: {
		  						funnel: {
		  						  x: '25%',
		  						  width: '50%',
		  						  funnelAlign: 'center',
		  						  max: 1548
		  						}
		  					  }
		  					},
		  					restore: {
		  					  show: true,
		  					  title: "Restore"
		  					},
		  					saveAsImage: {
		  					  show: true,
		  					  title: "Save Image"
		  					}
		  				  }
		  				},
		  				series: [{
		  				  name: 'Area',
		  				  type: 'pie',
		  				  radius: ['35%', '55%'],
		  				  itemStyle: {
		  					normal: {
		  					  label: {
		  						show: true,
		  						formatter: humanizePie //"{b} \n{c} ({d}%)"
		  					  },
		  					  labelLine: {
		  						show: true
		  					  }
		  					},
		  					emphasis: {
		  					  label: {
		  						show: true,
		  						position: 'center',
		  						textStyle: {
		  						  fontSize: '14',
		  						  fontWeight: 'normal'
		  						}
		  					  }
		  					}
		  				  },
		  				  data: [{
		  				  	value: frisk_low_pop,
		  					// value: jsondata['low_risk_population'],
		  					name: frisk_cat[0]
		  				  }, {
		  				  	value: frisk_med_pop,
		  					// value: jsondata['med_risk_population'] ,
		  					name: frisk_cat[1]
		  				  }, {
		  				  	value: frisk_hi_pop,
		  					// value: jsondata['high_risk_population'] ,
		  					name: frisk_cat[2]
		  				  }, {
		  				  	value: pop - tot_risk_pop,
		  					// value: jsondata['Population'] - jsondata['total_risk_population'],
		  					name: frisk_cat[3],
		  					itemStyle: pieNull
		  				  }]
		  				}]
		  			});

	  			  	window.onresize = function(){
	  			  		echartDonut.resize();
	  			  	}

	  			} 

	  			// echart Donut 

	  			if ($('#echart_donut_frisk_build').length ){  
	  			  
	  			  var echartDonutFRiskBuild = echarts.init(document.getElementById('echart_donut_frisk_build'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonutFRiskBuild.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: frisk_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  				  	value: frisk_low_build,
	  					// value: jsondata['low_risk_buildings'],
	  					name: frisk_cat[0]
	  					// name: 'Low Risk'
	  				  }, {
	  				  	value: frisk_med_build,
	  					// value: jsondata['med_risk_buildings'],
	  					name: frisk_cat[1]
	  					// name: 'Medium Risk'
	  				  }, {
	  				  	value: frisk_hi_build,
	  					// value: jsondata['high_risk_buildings'],
	  					name: frisk_cat[2]
	  					// name: 'High Risk'
	  				  }, {
	  				  	value: pop - tot_risk_build,
	  					// value: jsondata['Population'] - jsondata['total_risk_buildings'],
	  					name: frisk_cat[3],
	  					// name: 'Not at Risk',
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.onresize = function(){
	  			  		echartDonutFRiskBuild.resize();
	  			  	}

	  			} 

	  			// echart Donut 3

	  			if ($('#echart_donut_frisk_area').length ){  
	  			  
	  			  var echartDonutFRiskArea = echarts.init(document.getElementById('echart_donut_frisk_area'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonutFRiskArea.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: frisk_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: frisk_low_area,
	  					// value: jsondata['low_risk_area'],
	  					name: frisk_cat[0]
	  					// name: 'Low Risk'
	  				  }, {
	  					value: frisk_med_area,
	  					// value: jsondata['med_risk_area'] ,
	  					name: frisk_cat[1]
	  					// name: 'Medium Risk'
	  				  }, {
	  					value: frisk_hi_area,
	  					// value: jsondata['high_risk_area'] ,
	  					name: frisk_cat[2]
	  					// name: 'High Risk'
	  				  }, {
	  					value: pop - tot_risk_area,
	  					// value: jsondata['Area'] - jsondata['total_risk_area'],
	  					name: frisk_cat[3],
	  					// name: 'Not at Risk',
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.onresize = function(){
	  			  		echartDonutFRiskArea.resize();
	  			  	}

	  			} 
	  		// break;

	  		// case "aforecast":
	  			// aforecast tab
	  			// echart Donut 4

	  			if ($('#echart_donut_4').length ){  
	  			  
	  			  var echartDonut = echarts.init(document.getElementById('echart_donut_4'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonut.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: aforecast_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: afo_low_pop,
	  					// value: jsondata['ava_forecast_low_pop'],
	  					name: aforecast_cat[0]
	  				  }, {
	  					value: afo_med_pop,
	  					// value: jsondata['ava_forecast_med_pop'],
	  					name: aforecast_cat[1]
	  				  }, {
	  					value: afo_hi_pop,
	  					// value: jsondata['ava_forecast_high_pop'],
	  					name: aforecast_cat[2]
	  				  }, {
	  					value: pop - tot_ava_pop,
	  					// value: jsondata['Population'] - jsondata['total_ava_forecast_pop'],
	  					name: aforecast_cat[3],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.onresize = function(){
	  			  		echartDonut.resize();
	  			  	}

	  			} 

	  			// echart Donut

	  			if ($('#echart_donut_ava_building_prediction').length ){  
	  			  
	  			  var echartDonutAvaBuildingPredict = echarts.init(document.getElementById('echart_donut_ava_building_prediction'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonutAvaBuildingPredict.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: aforecast_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: afo_low_build,
	  					// value: jsondata['ava_forecast_low_pop'],
	  					name: aforecast_cat[0]
	  					// name: 'Low Risk'
	  				  }, {
	  					value: afo_med_build,
	  					// value: jsondata['ava_forecast_low_pop'],
	  					name: aforecast_cat[1]
	  					// name: 'Medium Risk'
	  				  }, {
	  					value: afo_hi_build,
	  					// value: jsondata['ava_forecast_low_pop'],
	  					name: aforecast_cat[2]
	  					// name: 'High Risk'
	  				  }, {
	  					value: pop - tot_ava_build,
	  					// value: jsondata['Population'] - jsondata['total_ava_forecast_pop'],
	  					name: aforecast_cat[3],
	  					// name: 'Not at Risk',
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.onresize = function(){
	  			  		echartDonutAvaBuildingPredict.resize();
	  			  	}

	  			} 
	  		// break;

	  		// case "arisk":
	  			// arisk tab
	  			// echart Donut 5

	  			if ($('#echart_donut_5').length ){  
	  			  
	  			  var echartDonut1 = echarts.init(document.getElementById('echart_donut_5'), theme, humTooltipPie ,humanizePie);
	  			  
	  			  echartDonut1.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				// title:[{
	  				// 	text: 'Avalanche Area',
	  				// 	subtext: 'Area at Risk of Avalanche',
	  				// 	x: '50%',
	  				// 	textAlign: 'center'
	  				// }
	  				// ],
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: arisk_cat
	  				  // data: ['Moderate Risk Pop', 'High Risk Pop', 'Not at Risk Pop', 'Moderate Risk Area', 'High Risk Area', 'Not at Risk Area']
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{d}%"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: arisk_med_pop,
	  					// value: jsondata['med_ava_population'],
	  					name: arisk_cat[0]
	  				  }, {
	  					value: arisk_hi_pop,
	  					// value: jsondata['high_ava_population'],
	  					name: arisk_cat[1]
	  				  }, {
	  					value: pop - tot_risk_pop,
	  					// value: jsondata['Population'] - jsondata['total_ava_population'],
	  					name: arisk_cat[2],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonut1.resize();
	  			  	});

	  			} 

	  			 // echart Donut 6

	  			if ($('#echart_donut_6').length ){  
	  			  
	  			  var echartDonut2 = echarts.init(document.getElementById('echart_donut_6'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonut2.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: arisk_cat
	  				  // data: ['Moderate Risk', 'High Risk', 'Not at Risk']
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: arisk_med_area,
	  					// value: jsondata['med_ava_area'],
	  					name: arisk_cat[0]
	  				  }, {
	  					value: arisk_hi_area,
	  					// value: jsondata['high_ava_area'],
	  					name: arisk_cat[1]
	  				  }, {
	  					value: pop - tot_risk_area,
	  					// value: jsondata['Area'] - jsondata['total_ava_area'],
	  					name: arisk_cat[2],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonut2.resize();
	  			  	});

	  			}

	  			// echart Donut

	  			if ($('#echart_donut_ava_building').length ){  
	  			  
	  			  var echartDonutAvaBuildingRisk = echarts.init(document.getElementById('echart_donut_ava_building'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonutAvaBuildingRisk.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: arisk_cat
	  				  // data: ['Moderate Risk', 'High Risk', 'Not at Risk']
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: arisk_med_build,
	  					// value: jsondata['med_ava_area'],
	  					name: arisk_cat[0]
	  				  }, {
	  					value: arisk_hi_build,
	  					// value: jsondata['high_ava_area'],
	  					name: arisk_cat[1]
	  				  }, {
	  					value: pop - tot_risk_build,
	  					// value: jsondata['Area'] - jsondata['total_ava_area'],
	  					name: arisk_cat[2],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutAvaBuildingRisk.resize();
	  			  	});

	  			}
	  		// break;

	  		// case "lndslide" :
	  			// Landslide tab
	  			if ($('#echart_donut_lsi').length ){  
	  			  
	  			  var echartDonutLSI = echarts.init(document.getElementById('echart_donut_lsi'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonutLSI.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: level_risk_pie
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				color: color,
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: lsi[0],
	  					name: level_risk_pie[0]
	  				  }, {
	  					value: lsi[1] ,
	  					name: level_risk_pie[1]
	  				  }, {
	  					value: lsi[2] ,
	  					name: level_risk_pie[2]
	  				  }, {
	  					value: lsi[3] ,
	  					name: level_risk_pie[3]
	  				  }, {
	  					value: pop - (lsi[0]+lsi[1]+lsi[2]+lsi[3]),
	  					name: level_risk_pie[4],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.onresize = function(){
	  			  		echartDonutLSI.resize();
	  			  	}

	  			} 

	  			if ($('#echart_donut_ku').length ){  
	  			  
	  			  var echartDonutKU = echarts.init(document.getElementById('echart_donut_ku'), theme, humTooltipPie, humanizePie);
	  			  
	  			  echartDonutKU.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				calculable: true,
	  				legend: {
	  				  x: 'left',
	  				  y: 'bottom',
	  				  orient: 'vertical',
	  				  data: level_risk_pie
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'center',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				color: color,
	  				series: [{
	  				  name: 'Area',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{c} ({d}%)"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: lsi_ku[0],
	  					name: level_risk_pie[0]
	  				  }, {
	  					value: lsi_ku[1] ,
	  					name: level_risk_pie[1]
	  				  }, {
	  					value: lsi_ku[2] ,
	  					name: level_risk_pie[2]
	  				  }, {
	  					value: lsi_ku[3] ,
	  					name: level_risk_pie[3]
	  				  }, {
	  					value: pop - (lsi_ku[0]+lsi_ku[1]+lsi_ku[2]+lsi_ku[3]),
	  					name: level_risk_pie[4],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  	window.onresize = function(){
	  			  		echartDonutKU.resize();
	  			  	}

	  			}

	  			if ($('#echart_donut_S1').length ){  
	  			  
					var echartDonutS1 = echarts.init(document.getElementById('echart_donut_S1'), theme, humTooltipPie, humanizePie);

					echartDonutS1.setOption({
						tooltip: {
						  trigger: 'item',
						  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
						},
						calculable: true,
						legend: {
						  x: 'left',
						  y: 'top',
						  orient: 'vertical',
						  data: level_risk_pie
						},
						toolbox: {
						  show: true,
						  feature: {
							magicType: {
							  show: true,
							  type: ['pie', 'funnel'],
							  option: {
								funnel: {
								  x: '25%',
								  width: '50%',
								  funnelAlign: 'center',
								  max: 1548
								}
							  }
							},
							restore: {
							  show: true,
							  title: "Restore"
							},
							saveAsImage: {
							  show: true,
							  title: "Save Image"
							}
						  }
						},
						color: color,
						series: [{
						  name: 'Area',
						  type: 'pie',
						  radius: ['35%', '55%'],
						  itemStyle: {
							normal: {
							  label: {
								show: true,
								formatter: humanizePie //"{b} \n{c} ({d}%)"
							  },
							  labelLine: {
								show: true
							  }
							},
							emphasis: {
							  label: {
								show: true,
								position: 'center',
								textStyle: {
								  fontSize: '14',
								  fontWeight: 'normal'
								}
							  }
							}
						  },
						  data: [{
							value: ls_s1_wb[0],
							name: level_risk_pie[0]
						  }, {
							value: ls_s1_wb[1] ,
							name: level_risk_pie[1]
						  }, {
							value: ls_s1_wb[2] ,
							name: level_risk_pie[2]
						  }, {
							value: ls_s1_wb[3] ,
							name: level_risk_pie[3]
						  }, {
							value: pop - (ls_s1_wb[0]+ls_s1_wb[1]+ls_s1_wb[2]+ls_s1_wb[3]),
							name: level_risk_pie[4],
							itemStyle: pieNull
						  }]
						}]
					});

	  			  	window.onresize = function(){
	  			  		echartDonutS1.resize();
	  			  	}

	  			}

	  			if ($('#echart_donut_S2').length ){  
	  			  
		  			var echartDonutS2 = echarts.init(document.getElementById('echart_donut_S2'), theme, humTooltipPie, humanizePie);
		  			  
		  			echartDonutS2.setOption({
		  				tooltip: {
		  				  trigger: 'item',
		  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
		  				},
		  				calculable: true,
		  				legend: {
		  				  x: 'left',
		  				  y: 'top',
		  				  orient: 'vertical',
		  				  data: level_risk_pie
		  				},
		  				toolbox: {
		  				  show: true,
		  				  feature: {
		  					magicType: {
		  					  show: true,
		  					  type: ['pie', 'funnel'],
		  					  option: {
		  						funnel: {
		  						  x: '25%',
		  						  width: '50%',
		  						  funnelAlign: 'center',
		  						  max: 1548
		  						}
		  					  }
		  					},
		  					restore: {
		  					  show: true,
		  					  title: "Restore"
		  					},
		  					saveAsImage: {
		  					  show: true,
		  					  title: "Save Image"
		  					}
		  				  }
		  				},
		  				color: color,
		  				series: [{
		  				  name: 'Area',
		  				  type: 'pie',
		  				  radius: ['35%', '55%'],
		  				  itemStyle: {
		  					normal: {
		  					  label: {
		  						show: true,
		  						formatter: humanizePie //"{b} \n{c} ({d}%)"
		  					  },
		  					  labelLine: {
		  						show: true
		  					  }
		  					},
		  					emphasis: {
		  					  label: {
		  						show: true,
		  						position: 'center',
		  						textStyle: {
		  						  fontSize: '14',
		  						  fontWeight: 'normal'
		  						}
		  					  }
		  					}
		  				  },
		  				  data: [{
		  					value: ls_s2_wb[0],
		  					name: level_risk_pie[0]
		  				  }, {
		  					value: ls_s2_wb[1] ,
		  					name: level_risk_pie[1]
		  				  }, {
		  					value: ls_s2_wb[2] ,
		  					name: level_risk_pie[2]
		  				  }, {
		  					value: ls_s2_wb[3] ,
		  					name: level_risk_pie[3]
		  				  }, {
		  					value: pop - (ls_s2_wb[0]+ls_s2_wb[1]+ls_s2_wb[2]+ls_s2_wb[3]),
		  					name: level_risk_pie[4],
		  					itemStyle: pieNull
		  				  }]
		  				}]
		  			});

	  			  	window.onresize = function(){
	  			  		echartDonutS2.resize();
	  			  	}

	  			}

	  			if ($('#echart_donut_S3').length ){  
	  			  
		  			var echartDonutS3 = echarts.init(document.getElementById('echart_donut_S3'), theme, humTooltipPie, humanizePie);
		  			  
		  			echartDonutS3.setOption({
		  				tooltip: {
		  				  trigger: 'item',
		  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
		  				},
		  				calculable: true,
		  				legend: {
		  				  x: 'left',
		  				  y: 'top',
		  				  orient: 'vertical',
		  				  data: level_risk_pie
		  				},
		  				toolbox: {
		  				  show: true,
		  				  feature: {
		  					magicType: {
		  					  show: true,
		  					  type: ['pie', 'funnel'],
		  					  option: {
		  						funnel: {
		  						  x: '25%',
		  						  width: '50%',
		  						  funnelAlign: 'center',
		  						  max: 1548
		  						}
		  					  }
		  					},
		  					restore: {
		  					  show: true,
		  					  title: "Restore"
		  					},
		  					saveAsImage: {
		  					  show: true,
		  					  title: "Save Image"
		  					}
		  				  }
		  				},
		  				color: color,
		  				series: [{
		  				  name: 'Area',
		  				  type: 'pie',
		  				  radius: ['35%', '55%'],
		  				  itemStyle: {
		  					normal: {
		  					  label: {
		  						show: true,
		  						formatter: humanizePie //"{b} \n{c} ({d}%)"
		  					  },
		  					  labelLine: {
		  						show: true
		  					  }
		  					},
		  					emphasis: {
		  					  label: {
		  						show: true,
		  						position: 'center',
		  						textStyle: {
		  						  fontSize: '14',
		  						  fontWeight: 'normal'
		  						}
		  					  }
		  					}
		  				  },
		  				  data: [{
		  					value: ls_s3_wb[0],
		  					name: level_risk_pie[0]
		  				  }, {
		  					value: ls_s3_wb[1] ,
		  					name: level_risk_pie[1]
		  				  }, {
		  					value: ls_s3_wb[2] ,
		  					name: level_risk_pie[2]
		  				  }, {
		  					value: ls_s3_wb[3] ,
		  					name: level_risk_pie[3]
		  				  }, {
		  					value: pop - (ls_s3_wb[0]+ls_s3_wb[1]+ls_s3_wb[2]+ls_s3_wb[3]),
		  					name: level_risk_pie[4],
		  					itemStyle: pieNull
		  				  }]
		  				}]
		  			});

	  			  	window.onresize = function(){
	  			  		echartDonutS3.resize();
	  			  	}

	  			}

	  			if ($('#echart_bar_horizontal_lsi').length ){ 
	  			  
	  			  var echartBarLSI = echarts.init(document.getElementById('echart_bar_horizontal_lsi'), humTooltipBar, humanizeBar);

	  			  echartBarLSI.setOption({
	  			  	// backgroundColor: '#000',
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type: 'shadow',
	  				  },
	  				  formatter: humTooltipBar
	  				},
	  				legend: {
	  				  x: 'left',
	  				  data: level_risk
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  				  	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar'
	  			    	  },
	  			    	  type: ['line', 'bar']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '15%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel:{
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  				  type: 'category',
	  				  data: level_risk
	  				}],
	  				series: [{
	  				  name: 'Landslide Index',
	  				  type: 'bar',
	  				  itemStyle:{
	  				  	normal:{
	  				  		color: colorBar
	  				  	}
	  				  },
	  				  label:{
	  				  	normal:{
	  				  		formatter: humanizeBar,
	  				  		position: 'right',
	  				  		show: true
	  				  	}
	  				  },
	  				  data: lsi
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBarLSI.resize();
	  			  	});

	  			  	// window.onresize = function(){
	  			  	// 	echartBar.resize();
	  			  	// }

	  			}

	  			if ($('#echart_bar_horizontal_ku').length ){ 
	  			  
	  			  var echartBarKU = echarts.init(document.getElementById('echart_bar_horizontal_ku'), humTooltipBar, humanizeBar);

	  			  echartBarKU.setOption({
	  			  	// backgroundColor: '#000',
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type: 'shadow',
	  				  },
	  				  formatter: humTooltipBar
	  				},
	  				legend: {
	  				  x: 'left',
	  				  data: level_risk
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  				  	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar'
	  			    	  },
	  			    	  type: ['line', 'bar']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '15%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel:{
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  				  type: 'category',
	  				  data: level_risk
	  				}],
	  				series: [{
	  				  name: 'Landslide Index',
	  				  type: 'bar',
	  				  itemStyle:{
	  				  	normal:{
	  				  		color: colorBar
	  				  	}
	  				  },
	  				  label:{
	  				  	normal:{
	  				  		formatter: humanizeBar,
	  				  		position: 'right',
	  				  		show: true
	  				  	}
	  				  },
	  				  data: lsi_ku
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBarKU.resize();
	  			  	});

	  			  	// window.onresize = function(){
	  			  	// 	echartBar.resize();
	  			  	// }

	  			}

	  			if ($('#echart_bar_horizontal_s1').length ){ 
	  			  
	  			  var echartBarS1 = echarts.init(document.getElementById('echart_bar_horizontal_s1'), humTooltipBar, humanizeBar);

	  			  echartBarS1.setOption({
	  			  	// backgroundColor: '#000',
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type: 'shadow',
	  				  },
	  				  formatter: humTooltipBar
	  				},
	  				legend: {
	  				  x: 'left',
	  				  data: level_risk
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  				  	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar'
	  			    	  },
	  			    	  type: ['line', 'bar']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '15%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel:{
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  				  type: 'category',
	  				  data: level_risk
	  				}],
	  				series: [{
	  				  name: 'Landslide Index',
	  				  type: 'bar',
	  				  itemStyle:{
	  				  	normal:{
	  				  		color: colorBar
	  				  	}
	  				  },
	  				  label:{
	  				  	normal:{
	  				  		formatter: humanizeBar,
	  				  		position: 'right',
	  				  		show: true
	  				  	}
	  				  },
	  				  data: ls_s1_wb
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBarS1.resize();
	  			  	});

	  			  	// window.onresize = function(){
	  			  	// 	echartBar.resize();
	  			  	// }

	  			}

	  			if ($('#echart_bar_horizontal_s2').length ){ 
	  			  
	  			  var echartBarS2 = echarts.init(document.getElementById('echart_bar_horizontal_s2'), humTooltipBar, humanizeBar);

	  			  echartBarS2.setOption({
	  			  	// backgroundColor: '#000',
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type: 'shadow',
	  				  },
	  				  formatter: humTooltipBar
	  				},
	  				legend: {
	  				  x: 'left',
	  				  data: level_risk
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  				  	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar'
	  			    	  },
	  			    	  type: ['line', 'bar']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '15%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel:{
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  				  type: 'category',
	  				  data: level_risk
	  				}],
	  				series: [{
	  				  name: 'Landslide Index',
	  				  type: 'bar',
	  				  itemStyle:{
	  				  	normal:{
	  				  		color: colorBar
	  				  	}
	  				  },
	  				  label:{
	  				  	normal:{
	  				  		formatter: humanizeBar,
	  				  		position: 'right',
	  				  		show: true
	  				  	}
	  				  },
	  				  data: ls_s2_wb
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBarS2.resize();
	  			  	});

	  			  	// window.onresize = function(){
	  			  	// 	echartBar.resize();
	  			  	// }

	  			}

	  			if ($('#echart_bar_horizontal_s3').length ){ 
	  			  
	  			  var echartBarS3 = echarts.init(document.getElementById('echart_bar_horizontal_s3'), humTooltipBar, humanizeBar);

	  			  echartBarS3.setOption({
	  			  	// backgroundColor: '#000',
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type: 'shadow',
	  				  },
	  				  formatter: humTooltipBar
	  				},
	  				legend: {
	  				  x: 'left',
	  				  data: level_risk
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  				  	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar'
	  			    	  },
	  			    	  type: ['line', 'bar']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '15%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel:{
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  				  type: 'category',
	  				  data: level_risk
	  				}],
	  				series: [{
	  				  name: 'Landslide Index',
	  				  type: 'bar',
	  				  itemStyle:{
	  				  	normal:{
	  				  		color: colorBar
	  				  	}
	  				  },
	  				  label:{
	  				  	normal:{
	  				  		formatter: humanizeBar,
	  				  		position: 'right',
	  				  		show: true
	  				  	}
	  				  },
	  				  data: ls_s3_wb
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBarS3.resize();
	  			  	});

	  			  	// window.onresize = function(){
	  			  	// 	echartBar.resize();
	  			  	// }

	  			}
	  		// break

	  		// case "earthquake":
	  			// earthquake tab
	  			// echart Pie 8

	  			if ($('#echart_pie_8').length ){  
	  			  
	  			  var echartPie1 = echarts.init(document.getElementById('echart_pie_8'), theme);

	  			  echartPie1.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: erthqk_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'left',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				calculable: true,
	  				series: [{
	  				  name: 'Population Affected',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  center: ['50%', '48%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{d}%"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: erthqk_pop,
	  					// value: jsondata['total_eq_pop'],
	  					name: erthqk_cat[0],
	  					itemStyle: colorReversed
	  				  },{
	  					value: pop - erthqk_pop,
	  					// value: jsondata['Population']-jsondata['total_eq_pop'],
	  					name: erthqk_cat[1],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  var dataStyle = {
	  				normal: {
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				}
	  			  };

	  			  var placeHolderStyle = {
	  				normal: {
	  				  color: 'rgba(0,0,0,0)',
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				},
	  				emphasis: {
	  				  color: 'rgba(0,0,0,0)'
	  				}
	  			  };

	  			  	window.addEventListener("resize", function(){
	  			  		echartPie1.resize();
	  			  	});

	  			} 

	  			// echart Pie 8

	  			if ($('#echart_pie_erthqk_building').length ){  
	  			  
	  			  var echartPieErthqkBuilding = echarts.init(document.getElementById('echart_pie_erthqk_building'), theme);

	  			  echartPieErthqkBuilding.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: erthqk_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'left',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				calculable: true,
	  				series: [{
	  				  name: 'Population Affected',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  center: ['50%', '48%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{d}%"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: erthqk_build,
	  					// value: jsondata['total_eq_pop'],
	  					name: erthqk_cat[0],
	  					itemStyle: colorReversed
	  				  },{
	  					value: pop - erthqk_pop,
	  					// value: jsondata['Population']-jsondata['total_eq_pop'],
	  					name: erthqk_cat[1],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  var dataStyle = {
	  				normal: {
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				}
	  			  };

	  			  var placeHolderStyle = {
	  				normal: {
	  				  color: 'rgba(0,0,0,0)',
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				},
	  				emphasis: {
	  				  color: 'rgba(0,0,0,0)'
	  				}
	  			  };

	  			  	window.addEventListener("resize", function(){
	  			  		echartPieErthqkBuilding.resize();
	  			  	});

	  			} 

	  			// echart Pie 9

	  			if ($('#echart_pie_9').length ){  
	  			  
	  			  var echartPie2 = echarts.init(document.getElementById('echart_pie_9'), theme);

	  			  echartPie2.setOption({
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: erthqk_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'left',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				calculable: true,
	  				series: [{
	  				  name: 'Earthquake Impact',
	  				  type: 'pie',
	  				  radius: ['35%', '55%'],
	  				  // radius: '55%',
	  				  center: ['50%', '48%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{d}%"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: erthqk_settl,
	  					// value: jsondata['total_eq_settlements'],
	  					name: erthqk_cat[0],
	  					itemStyle: colorReversed
	  				  }, {
	  					value: pop - erthqk_settl,
	  					// value: jsondata['settlement']-jsondata['total_eq_settlements'],
	  					name: erthqk_cat[1],
	  					itemStyle: pieNull
	  				  }]
	  				}]
	  			  });

	  			  var dataStyle = {
	  				normal: {
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				}
	  			  };

	  			  var placeHolderStyle = {
	  				normal: {
	  				  color: 'rgba(0,0,0,0)',
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				},
	  				emphasis: {
	  				  color: 'rgba(0,0,0,0)'
	  				}
	  			  };

	  			  	window.addEventListener("resize", function(){
	  			  		echartPie2.resize();
	  			  	});

	  			} 

	  			// echart Pie 11

	  			if ($('#echart_pie_11').length ){  
	  			  
	  			  var echartPie3 = echarts.init(document.getElementById('echart_pie_11'), colorMercalli);

	  			  echartPie3.setOption({
	  			  	animation: animate,
	  				tooltip: {
	  				  trigger: 'item',
	  				  formatter: humTooltipPie //"{a} <br/>{b} : {c} ({d}%)"
	  				},
	  				legend: {
	  				  x: 'left',
	  				  y: 'top',
	  				  orient: 'vertical',
	  				  data: mercalli_cat
	  				},
	  				toolbox: {
	  				  show: true,
	  				  feature: {
	  					magicType: {
	  					  show: true,
	  					  type: ['pie', 'funnel'],
	  					  option: {
	  						funnel: {
	  						  x: '25%',
	  						  width: '50%',
	  						  funnelAlign: 'left',
	  						  max: 1548
	  						}
	  					  }
	  					},
	  					restore: {
	  					  show: true,
	  					  title: "Restore"
	  					},
	  					saveAsImage: {
	  					  show: true,
	  					  title: "Save Image"
	  					}
	  				  }
	  				},
	  				calculable: true,
	  				series: [{
	  				  name: 'Earthquake Impact',
	  				  type: 'pie',
	  				  radius: '55%',
	  				  center: ['50%', '48%'],
	  				  itemStyle: {
	  					normal: {
	  					  label: {
	  						show: true,
	  						formatter: humanizePie //"{b} \n{d}%"
	  					  },
	  					  labelLine: {
	  						show: true
	  					  }
	  					},
	  					emphasis: {
	  					  label: {
	  						show: true,
	  						position: 'center',
	  						textStyle: {
	  						  fontSize: '14',
	  						  fontWeight: 'normal'
	  						}
	  					  }
	  					}
	  				  },
	  				  data: [{
	  					value: pop_weak,
	  					// value: jsondata['pop_shake_weak'],
	  					name: mercalli_cat[0]
	  				  }, {
	  					value: pop_light,
	  					// value: jsondata['pop_shake_light'],
	  					name: mercalli_cat[1]
	  				  }, {
	  					value: pop_mod,
	  					// value: jsondata['pop_shake_moderate'],
	  					name: mercalli_cat[2]
	  				  }, {
	  					value: pop_strong,
	  					// value: jsondata['pop_shake_strong'],
	  					name: mercalli_cat[3]
	  				  }, {
	  					value: pop_vstrong,
	  					// value: jsondata['pop_shake_verystrong'],
	  					name: mercalli_cat[4]
	  				  }, {
	  					value: pop_severe,
	  					// value: jsondata['pop_shake_severe'],
	  					name: mercalli_cat[5]
	  				  }, {
	  					value: pop_violent,
	  					// value: jsondata['pop_shake_violent'],
	  					name: mercalli_cat[6]
	  				  }, {
	  					value: pop_ext,
	  					// value: jsondata['pop_shake_extreme'],
	  					name: mercalli_cat[7]
	  				  }]
	  				}]
	  			  });

	  			  var dataStyle = {
	  				normal: {
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				}
	  			  };

	  			  var placeHolderStyle = {
	  				normal: {
	  				  color: 'rgba(0,0,0,0)',
	  				  label: {
	  					show: false
	  				  },
	  				  labelLine: {
	  					show: false
	  				  }
	  				},
	  				emphasis: {
	  				  color: 'rgba(0,0,0,0)'
	  				}
	  			  };

	  			  	window.addEventListener("resize", function(){
	  			  		echartPie3.resize();
	  			  	});

	  			} 
	  		// break;

	  		// case "haccess":
	  			// haccess tab
	  			// echart Radar masing2
	  		// 	if ($('#echart_sonar').length ){ 
	  		// 		  var echartRadar3 = echarts.init(document.getElementById('echart_sonar'), theme);

	  		// 		  echartRadar3.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator1,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar3.resize();
	  		// 			});
	  		// 	}

	  		// 	// echart Radar 2
	  		// 	if ($('#echart_sonar_2').length ){ 
	  		// 		  var echartRadar2 = echarts.init(document.getElementById('echart_sonar_2'), theme);

	  		// 		  echartRadar2.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator1,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar2.resize();
	  		// 			});
	  		// 	}

	  		// 	// echart Radar 4
	  		// 	if ($('#echart_sonar_4').length ){ 
	  		// 		  var echartRadar4 = echarts.init(document.getElementById('echart_sonar_4'), theme);

	  		// 		  echartRadar4.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator1,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar4.resize();
	  		// 			});
	  		// 	}

	  		// 	// echart Radar 5
	  		// 	if ($('#echart_sonar_5').length ){ 
	  		// 		  var echartRadar5 = echarts.init(document.getElementById('echart_sonar_5'), theme);

	  		// 		  echartRadar5.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator1,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar5.resize();
	  		// 			});
	  		// 	}

	  		// 	// echart Radar 3

	  		// 	if ($('#echart_sonar_3').length ){ 
	  			  
	  		// 	  var echartRadar1 = echarts.init(document.getElementById('echart_sonar_3'), theme);

	  		// 	  echartRadar1.setOption({
	  		// 		// title: {
	  		// 		//   text: 'Number of Incident and Casualties by Incident Type',
	  		// 		//   subtext: 'Subtitle'
	  		// 		// },
	  		// 		 tooltip: {
	  		// 			trigger: 'item'
	  		// 			// formatter: humTooltipRadar
	  		// 		},
	  		// 		legend: {
	  		// 		  // orient: 'vertical',
	  		// 		  x: 'center',
	  		// 		  y: 'bottom',
	  		// 		  data: ['Incident', 'Dead', 'Injured', 'Violent'],
	  		// 		  selectedMode: 'single'
	  		// 		},
	  		// 		toolbox: {
	  		// 		  show: true,
	  		// 		  feature: {
	  		// 			restore: {
	  		// 			  show: true,
	  		// 			  title: "Restore"
	  		// 			},
	  		// 			saveAsImage: {
	  		// 			  show: true,
	  		// 			  title: "Save Image"
	  		// 			}
	  		// 		  }
	  		// 		},
	  		// 		radar: [{
				 //  	  	indicator: checkIndicator1,
				 //  	  	// axisLine:{
				 //  	  	// 	lineStyle:{
				 //  	  	// 		type: 'dotted'
				 //  	  	// 	}
				 //  	  	// },
				 //  	  	splitNumber: 3,
				 //  	  	nameGap: 20,
				 //  	  	name: {
		  	//   	            textStyle: {
		  	//   	                fontWeight: 'bold'
		  	//   	            }
				 //  	  	},
				 //  	  	axisTick:{
				 //  	  		// show: true,
				 //  	  		alignWithLabel: true
				 //  	  	},
				 //  	  	axisLabel:{
				 //  	  		show: true,
				 //  	  		margin: 5,
				 //  	  		// rotate: 60,
				 //  	  		showMinLabel: false,
				 //  	  		formatter: humanizeFormatter
				 //  	  		// showMinLabel: true,
				 //  	  		// showMaxLabel: true

				 //  	  	},
				 //  	  	splitLine: false,
				 //  	  	splitArea: false,
				 //  	  	scale: true,
		  	// 			center:['50%', '45%'],
		  	// 			radius: '75%'
	  		// 		}],
	  		// 		calculable: true,
	  		// 		series: [{
	  		// 		  name: 'Incident Type',
	  		// 		  type: 'radar',
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 			name: 'Incident',
	  		// 			label:{
	  		// 				normal: {
	  		// 					// show: true,
	  		// 					showMaxLabel: true,
	  		// 					// formatter: function(params){
	  		// 					// 	return params.value;
	  		// 					// }
	  		// 				}
	  		// 			}
	  		// 		  }]
	  		// 		}, {
	  		// 		  name: 'Casualties',
	  		// 		  type: 'radar',
	  		// 		  // polarIndex: 1,
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 			name: 'Dead'
	  		// 		  }]
	  		// 		}, {
	  		// 		  name: 'Casualties',
	  		// 		  type: 'radar',
	  		// 		  // polarIndex: 2,
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 			name: 'Injured'
	  		// 		  }]
	  		// 		}, {
	  		// 		  name: 'Casualties',
	  		// 		  type: 'radar',
	  		// 		  // polarIndex: 3,
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [68, 3446, 158, 132, 332, 4602, 138, 118, 416, 1232, 1572, 33, 221],
	  		// 			name: 'Violent'
	  		// 		  }]
	  		// 		}]
	  		// 	  });

					// window.addEventListener("resize", function(){
					// 	echartRadar1.resize();
					// });

	  		// 	}

	  		// 	// echart Radar 6

	  		// 	if ($('#echart_sonar_6').length ){ 
	  			  
	  		// 	  var echartRadar6 = echarts.init(document.getElementById('echart_sonar_6'), theme);

	  		// 	  echartRadar6.setOption({
	  		// 		// title: {
	  		// 		//   text: 'Number of Incident and Casualties by Incident Type',
	  		// 		//   subtext: 'Subtitle'
	  		// 		// },
	  		// 		 tooltip: {
	  		// 			trigger: 'item'
	  		// 		},
	  		// 		legend: {
	  		// 		  // orient: 'vertical',
	  		// 		  x: 'center',
	  		// 		  y: 'bottom',
	  		// 		  data: ['Incident', 'Dead', 'Injured', 'Violent'],
	  		// 		  selectedMode: 'single'
	  		// 		},
	  		// 		toolbox: {
	  		// 		  show: true,
	  		// 		  feature: {
	  		// 			restore: {
	  		// 			  show: true,
	  		// 			  title: "Restore"
	  		// 			},
	  		// 			saveAsImage: {
	  		// 			  show: true,
	  		// 			  title: "Save Image"
	  		// 			}
	  		// 		  }
	  		// 		},
	  		// 		radar: [{
				 //  	  	indicator: checkIndicator2,
				 //  	  	// axisLine:{
				 //  	  	// 	lineStyle:{
				 //  	  	// 		type: 'dotted'
				 //  	  	// 	}
				 //  	  	// },
				 //  	  	axisTick:{
				 //  	  		show: true
				 //  	  	},
				 //  	  	axisLabel:{
				 //  	  		show: true,
				 //  	  		// showMinLabel: true,
				 //  	  		// showMaxLabel: true

				 //  	  	},
				 //  	  	splitLine: false,
				 //  	  	// splitArea: true,
		  	// 			center:['50%', '45%'],
		  	// 			radius: '65%'
	  		// 		}],
	  		// 		calculable: true,
	  		// 		series: [{
	  		// 		  name: 'Incident Type',
	  		// 		  type: 'radar',
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [1, 5, 7, 4, 9, 2, 8, 2, 3],
	  		// 			name: 'Incident',
	  		// 			label:{
	  		// 				normal: {
	  		// 					// show: true,
	  		// 					showMaxLabel: true,
	  		// 					// formatter: function(params){
	  		// 					// 	return params.value;
	  		// 					// }
	  		// 				}
	  		// 			}
	  		// 		  }]
	  		// 		}, {
	  		// 		  name: 'Casualties',
	  		// 		  type: 'radar',
	  		// 		  // polarIndex: 1,
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [5, 4, 10, 2, 6, 9, 1, 9, 3],
	  		// 			name: 'Dead'
	  		// 		  }]
	  		// 		}, {
	  		// 		  name: 'Casualties',
	  		// 		  type: 'radar',
	  		// 		  // polarIndex: 2,
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [0, 4, 7, 3, 9, 8, 2, 1, 2],
	  		// 			name: 'Injured'
	  		// 		  }]
	  		// 		}, {
	  		// 		  name: 'Casualties',
	  		// 		  type: 'radar',
	  		// 		  // polarIndex: 3,
	  		// 		  itemStyle: {normal: {areaStyle: {type: 'default'}}},
	  		// 		  data: [{
	  		// 			value: [10, 1, 5, 8, 2, 3, 6, 8, 7],
	  		// 			name: 'Violent'
	  		// 		  }]
	  		// 		}]
	  		// 	  });

					// window.addEventListener("resize", function(){
					// 	echartRadar6.resize();
					// });

	  		// 	}

	  		// 	// echart Radar 7
	  		// 	if ($('#echart_sonar_7').length ){ 
	  		// 		  var echartRadar7 = echarts.init(document.getElementById('echart_sonar_7'), theme);

	  		// 		  echartRadar7.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator2,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [5, 4, 10, 2, 6, 9, 1, 9, 3],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar7.resize();
	  		// 			});
	  		// 	}

	  		// 	// echart Radar 8
	  		// 	if ($('#echart_sonar_8').length ){ 
	  		// 		  var echartRadar8 = echarts.init(document.getElementById('echart_sonar_8'), theme);

	  		// 		  echartRadar8.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator2,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [0, 4, 7, 3, 9, 8, 2, 1, 2],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar8.resize();
	  		// 			});
	  		// 	}

	  		// 	// echart Radar 9
	  		// 	if ($('#echart_sonar_9').length ){ 
	  		// 		  var echartRadar9 = echarts.init(document.getElementById('echart_sonar_9'), theme);

	  		// 		  echartRadar9.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator2,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [1, 5, 7, 4, 9, 2, 8, 2, 3],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar9.resize();
	  		// 			});
	  		// 	}

	  		// 	// echart Radar 10
	  		// 	if ($('#echart_sonar_10').length ){ 
	  		// 		  var echartRadar10 = echarts.init(document.getElementById('echart_sonar_10'), theme);

	  		// 		  echartRadar10.setOption({
	  		// 			// title: {
	  		// 			//   text: 'Incident Type',
	  		// 			//   subtext: 'Subtitle'
	  		// 			// },
	  		// 			 tooltip: {
	  		// 				trigger: 'item'
	  		// 			},
	  		// 			legend: {
	  		// 			  // orient: 'vertical',
	  		// 			  x: 'left',
	  		// 			  y: 'top',
	  		// 			  data: ['Incident']
	  		// 			},
	  		// 			toolbox: {
	  		// 			  show: true,
	  		// 			  feature: {
	  		// 				restore: {
	  		// 				  show: true,
	  		// 				  title: "Restore"
	  		// 				},
	  		// 				saveAsImage: {
	  		// 				  show: true,
	  		// 				  title: "Save Image"
	  		// 				}
	  		// 			  }
	  		// 			},
	  		// 			polar: [{
	  		// 			  indicator: checkIndicator2,
	  		// 			  center:['50%', '55%'],
	  		// 			  radius: 60
	  		// 			}],
	  		// 			calculable: true,
	  		// 			series: [{
	  		// 			  name: 'Incident Type',
	  		// 			  type: 'radar',
	  		// 			  data: [{
	  		// 				value: [10, 1, 5, 8, 2, 3, 6, 8, 7],
	  		// 				name: 'Incident'
	  		// 			  }]
	  		// 			}]
	  		// 		  });
	  		// 			window.addEventListener("resize", function(){
	  		// 				echartRadar10.resize();
	  		// 			});
	  		// 	}

	  			// echart Polar
	  			if ($('#echart_polar_1').length ){ 
	  				var echartPolar1 = echarts.init(document.getElementById('echart_polar_1'), theme);

	  				// var hours = tc2;
	  				// var data = [1744, 563, 373, 22, 11, 16, 29, 871, 8385];
	  				// var data1 = [204, 220, 11, 23, 2, 121, 26, 975, 3759];
	  				// var data2 = [221, 555, 7, 40, 12, 531, 55, 1646, 6532];
	  				// var data3 = [1026, 413, 347, 9, 3, 6, 17, 129, 4645];
	  				// var links = data.map(function (item, idx) {
			        //     if (idx == data.length-1) {
			        //     	coba = 0
			        //     }else{
			        //     	coba = idx + 1
			        //     }
			        //     return {
			        //         source: idx,
			        //         target: coba
			        //     };
			        // });
			        // var datas=[];
			        // for (var i = 0; i < data.length; i++) {
			        //     datas.push({
			        //         nodes: data[i],
			        //         edges: createEdges(i + 2)
			        //     });
			        // }
	  				echartPolar1.setOption({
	  					legend: {
					        data: polar_cat,
					        orient: 'vertical',
					        // selectedMode: 'single',
					        left: 'right'
					    },
					    polar: {},
					    tooltip: {
					    	formatter: humTooltipPolar
					        // formatter: function (params) {
					        //     return params.value[2] + ' commits in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
					        // }
					    },
					    angleAxis: {
					        type: 'category',
					        data: target_cat,
					        boundaryGap: false,
					        clockwise: false,
					        splitLine: {
					            show: true,
					            lineStyle: {
					                color: '#999',
					                type: 'dashed'
					            }
					        },
					        axisLabel:{
					        	inside: true,
					        	padding: [0, 10],
					        	width: 20
					        	// margin: 20
					        },
					        axisLine: {
					            show: false
					        }
					    },
					    radiusAxis: {
					        type: 'log',
					        // data: days,
					        // splitLine: {
					        // 	show: false
					        // },
					        splitArea: {
					        	show: false
					        },
					        axisLine: {
					            show: false
					        },
					        axisLabel: {
					            // rotate: 45
					            formatter: humanizeFormatter
					        }
					    },
					    series: [{
					        name: 'Incidents',
					        // type: 'graph',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        // layout: 'force',
					        // force: {
		           //              // initLayout: 'circular'
		           //              // gravity: 0
		           //              repulsion: 60,
		           //              edgeLength: 2
		           //          },
		                    // links: links,
					        areaStyle: {
					        	normal: {
	                            	// color: '#000'
	                        	}
					        },
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        // data: data,
					        data: targetCount,
					        // jsondata.jsondata.main_target.series.values[0],
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    },
					    {
					        name: 'Dead',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        // data: data1,
					        data: targetDead,
					        // jsondata.jsondata.main_target.series.values[1],
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    },
					    {
					        name: 'Injured',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        // data: data2,
					        data: targetInjured,
					        // jsondata.jsondata.main_target.series.values[3],
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    },
					    {
					        name: 'Violent',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        // data: data3,
					        data: targetViolent,
					        // jsondata.jsondata.main_target.series.values[2],
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    }]
	  				});
					window.addEventListener("resize", function(){
						echartPolar1.resize();
					});
	  			}

	  			// echart Polar
	  			if ($('#echart_polar_2').length ){ 
	  				var echartPolar2 = echarts.init(document.getElementById('echart_polar_2'), theme);

	  				// var hours = ic2;
	  				// var data = [1306, 3405, 124, 130, 328, 68, 4315, 411, 162, 1192, 100, 35, 244];
	  				// var data1 = [193, 2232, 9, 35, 420, 5, 505, 341, 15, 1310, 5, 41, 163];
	  				// var data2 = [208, 3099, 1, 144, 52, 0, 1686, 839, 31, 2910, 2, 62, 339];
	  				// var data3 = [710, 1816, 111, 69, 7, 61, 3136, 104, 154, 162, 93, 1, 43];
	  				
	  				echartPolar2.setOption({
	  					legend: {
					        data: polar_cat,
					        orient: 'vertical',
					        // selectedMode: 'single',
					        left: 'right'
					    },
					    polar: {},
					    tooltip: {
					    	formatter: humTooltipPolar
					        // formatter: function (params) {
					        //     return params.value[2] + ' commits in ' + hours[params.value[1]] + ' of ' + days[params.value[0]];
					        // }
					    },
					    angleAxis: {
					        type: 'category',
					        data: incident_cat,
					        startAngle: 0,
					        boundaryGap: false,
					        clockwise: false,
					        splitLine: {
					            show: true,
					            lineStyle: {
					                color: '#999',
					                type: 'dashed'
					            }
					        },
					        axisLabel:{
					        	inside: true,
					        	padding: [0, 100],
					        	width: 20
					        	// margin: 20
					        },
					        axisLine: {
					            show: false
					        }
					    },
					    radiusAxis: {
					        type: 'log',
					        // data: days,
					        // splitLine: {
					        // 	show: false
					        // },
					        splitArea: {
					        	show: false
					        },
					        axisLine: {
					            show: false
					        },
					        axisLabel: {
					            // rotate: 45
					            formatter: humanizeFormatter
					        }
					    },
					    series: [{
					        name: 'Incidents',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        data: incidentCount,
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    },
					    {
					        name: 'Dead',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        data: incidentDead,
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    },
					    {
					        name: 'Injured',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        data: incidentInjured,
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    },
					    {
					        name: 'Violent',
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: function (val) {
					            return Math.log(val)*3;
					        },
					        data: incidentViolent,
					        animationDelay: function (idx) {
					            return idx * 5;
					        }
					    }]
	  				});
					window.addEventListener("resize", function(){
						echartPolar2.resize();
					});
	  			}

	  			// echart Bar Horizontal Casualties

	  			if ($('#echart_bar_horizontal_12').length ){ 
	  			  
	  			  var echartBar12 = echarts.init(document.getElementById('echart_bar_horizontal_12'), theme);

	  			  echartBar12.setOption({
	  				// title: {
	  				//   text: 'Overview 1',
	  				//   subtext: 'Graph subtitle'
	  				// },
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type:'shadow'
	  				  },
	  				  formatter: humTooltipBar
	  				},
	  				legend: {
	  				  x: 'center',
	  				  y: 'bottom',
	  				  data: bar_cas_cat
	  				},
	  				toolbox: {
	  			      show: true,
	  			      feature: {
	  			    	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar',
	  			    		stack: 'Stack',
	  			    		tiled: 'Tiled'
	  			    	  },
	  			    	  type: ['line', 'bar', 'stack', 'tiled']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  			    	saveAsImage: {
	  			    	  show: true,
	  			    	  title: "Save Image"
	  			    	}
	  			      }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '10%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				// grid:[{
	  				// 	top: 50,
	  				// 	width: '50%',
	  				// 	bottom: '45%',
	  				// 	left: 10,
	  				// 	containLabel: true
	  				// }],
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel:{
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  					type: 'category',
	  					data: incident_cat,
	  					// data: jsondata['incident_type'],
	  					// data: ['Abandonment', 'Demonstration', 'Attack', 'Kidnapping', 'Murder', 'Small Arms Fire', 'Weapons', 'Mil./Non-Mil. Operation', 'Civillian Accident', 'IED', 'Arrest', 'Others', 'UXO'],
	  					axisLabel:{
	  						// rotate: 30
	  					}
	  				}],
	  				series: [{
	  				  name: bar_cas_cat[0],
	  				  type: 'bar',
	  				  label:{
	  				  	normal:{
	  				  		position: 'right',
	  				  		show: true,
	  				  		formatter: humanizeBar
	  				  	}
	  				  },
	  				  data: incidentDead
	  				}, {
	  				  name: bar_cas_cat[1],
	  				  type: 'bar',
	  				  label:{
	  				  	normal:{
	  				  		position: 'right',
	  				  		show: true,
	  				  		formatter: humanizeBar
	  				  	}
	  				  },
	  				  data: incidentInjured
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBar12.resize();
	  			  	});

	  			}

	  			// echart Bar Horizontal Incident

	  			if ($('#echart_bar_horizontal_13').length ){ 
	  			  
	  			  var echartBar13 = echarts.init(document.getElementById('echart_bar_horizontal_13'), theme);

	  			  echartBar13.setOption({
	  				// title: {
	  				//   text: 'Overview 1',
	  				//   subtext: 'Graph subtitle'
	  				// },
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type:'shadow'
	  				  },
	  				  formatter: humTooltipBar
	  				},
	  				legend: {
	  				  x: 'center',
	  				  y: 'bottom',
	  				  data: bar_inc_cat
	  				},
	  				toolbox: {
	  			      show: true,
	  			      feature: {
	  			    	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar',
	  			    		stack: 'Stack',
	  			    		tiled: 'Tiled'
	  			    	  },
	  			    	  type: ['line', 'bar', 'stack', 'tiled']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  			    	saveAsImage: {
	  			    	  show: true,
	  			    	  title: "Save Image"
	  			    	}
	  			      }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '10%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				// grid:[{
	  				// 	top: 50,
	  				// 	width: '50%',
	  				// 	bottom: '45%',
	  				// 	left: 10,
	  				// 	containLabel: true
	  				// }],
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel: {
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  					type: 'category',
	  					data: incident_cat,
	  					// data: jsondata['incident_type'],
	  					// data: ['Abandonment', 'Demonstration', 'Attack', 'Kidnapping', 'Murder', 'Small Arms Fire', 'Weapons', 'Mil./Non-Mil. Operation', 'Civillian Accident', 'IED', 'Arrest', 'Others', 'UXO'],
	  					axisLabel:{
	  						// rotate: 30
	  					}
	  				}],
	  				series: [{
	  				  name: bar_inc_cat[0],
	  				  type: 'bar',
	  				  // barMinHeight: 10,
	  				  // barWidth: 15,
	  				  label:{
	  				  	normal:{
	  				  		position: 'right',
	  				  		show: true,
	  				  		formatter: humanizeBar
	  				  	}
	  				  },
	  				  data: incidentCount
	  				}, {
	  				  name: bar_inc_cat[1],
	  				  type: 'bar',
	  				  label:{
	  				  	normal:{
	  				  		position: 'right',
	  				  		show: true,
	  				  		formatter: humanizeBar
	  				  	}
	  				  },
	  				  data: incidentViolent
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBar13.resize();
	  			  	});

	  			}

	  			// echart Bar Horizontal Casualties by Target

	  			if ($('#echart_bar_horizontal_14').length ){ 
	  			  
	  			  var echartBar14 = echarts.init(document.getElementById('echart_bar_horizontal_14'), theme);

	  			  echartBar14.setOption({
	  				// title: {
	  				//   text: 'Overview 1',
	  				//   subtext: 'Graph subtitle'
	  				// },
	  				tooltip: {
	  				  trigger: 'axis',
	  				  axisPointer:{
	  				  	type:'shadow',
	  				  	formatter: humTooltipBar
	  				  }
	  				},
	  				legend: {
	  				  x: 'center',
	  				  y: 'bottom',
	  				  data: bar_cas_cat
	  				},
	  				toolbox: {
	  			      show: true,
	  			      feature: {
	  			    	magicType: {
	  			    	  show: true,
	  			    	  title: {
	  			    		line: 'Line',
	  			    		bar: 'Bar',
	  			    		stack: 'Stack',
	  			    		tiled: 'Tiled'
	  			    	  },
	  			    	  type: ['line', 'bar', 'stack', 'tiled']
	  			    	},
	  			    	restore: {
	  			    	  show: true,
	  			    	  title: "Restore"
	  			    	},
	  			    	saveAsImage: {
	  			    	  show: true,
	  			    	  title: "Save Image"
	  			    	}
	  			      }
	  				},
	  				grid: {
	  			        left: '0%',
	  			        right: '10%',
	  			        bottom: '8%',
	  			        containLabel: true
	  			    },
	  				// grid:[{
	  				// 	top: 50,
	  				// 	width: '50%',
	  				// 	bottom: '45%',
	  				// 	left: 10,
	  				// 	containLabel: true
	  				// }],
	  				calculable: true,
	  				xAxis: [{
	  				  type: 'value',
	  				  boundaryGap: [0, 0.01],
	  				  axisLabel:{
	  				  	rotate: 30,
	  				  	formatter: humanizeFormatter
	  				  }
	  				}],
	  				yAxis: [{
	  					type: 'category',
	  					data: target_cat,
	  					// data: jsondata['incident_target'],
	  					// data: ['Armed Opposition Group', 'Civilians', 'Government', 'Humanitarian Community', 'Infrastructure', 'Intl. Humanitarian Comm.', 'Intl. Millitary', 'Police/Millitary Gov.', 'Unknown'],
	  					axisLabel:{
	  						// rotate: 30
	  					}
	  				}],
	  				series: [{
	  				  name: bar_cas_cat[0],
	  				  type: 'bar',
	  				  label:{
	  				  	normal:{
	  				  		position: 'right',
	  				  		show: true,
	  				  		formatter: humanizeBar
	  				  	}
	  				  },
	  				  data: targetDead
	  				}, {
	  				  name: bar_cas_cat[1],
	  				  type: 'bar',
	  				  label:{
	  				  	normal:{
	  				  		position: 'right',
	  				  		show: true,
	  				  		formatter: humanizeBar
	  				  	}
	  				  },
	  				  data: targetInjured
	  				}]
	  			  });

	  			  	window.addEventListener("resize", function(){
	  			  		echartBar14.resize();
	  			  	});

	  			}

	  			// echart Bar Horizontal Incident by Target

	  			if ($('#echart_bar_horizontal_15').length ){ 
		  			  var echartBar15 = echarts.init(document.getElementById('echart_bar_horizontal_15'), theme);

		  			  echartBar15.setOption({
		  				// title: {
		  				//   text: 'Overview 1',
		  				//   subtext: 'Graph subtitle'
		  				// },
		  				tooltip: {
		  				  trigger: 'axis',
		  				  axisPointer:{
		  				  	type:'shadow',
		  				  	formatter: humTooltipBar,
		  				  }
		  				},
		  				legend: {
		  				  x: 'center',
		  				  y: 'bottom',
		  				  data: bar_inc_cat
		  				},
		  				toolbox: {
		  			      show: true,
		  			      feature: {
		  			    	magicType: {
		  			    	  show: true,
		  			    	  title: {
		  			    		line: 'Line',
		  			    		bar: 'Bar',
		  			    		stack: 'Stack',
		  			    		tiled: 'Tiled'
		  			    	  },
		  			    	  type: ['line', 'bar', 'stack', 'tiled']
		  			    	},
		  			    	restore: {
		  			    	  show: true,
		  			    	  title: "Restore"
		  			    	},
		  			    	saveAsImage: {
		  			    	  show: true,
		  			    	  title: "Save Image"
		  			    	}
		  			      }
		  				},
		  				grid: {
		  			        left: '0%',
		  			        right: '10%',
		  			        bottom: '8%',
		  			        containLabel: true
		  			    },
		  				// grid:[{
		  				// 	top: 50,
		  				// 	width: '50%',
		  				// 	bottom: '45%',
		  				// 	left: 10,
		  				// 	containLabel: true
		  				// }],
		  				calculable: true,
		  				xAxis: [{
		  				  type: 'value',
		  				  boundaryGap: [0, 0.01],
		  				  axisLabel:{
		  				  	rotate: 30,
		  				  	formatter: humanizeFormatter
		  				  }
		  				}],
		  				yAxis: [{
		  					type: 'category',
		  					data: target_cat,
		  					// data: jsondata['incident_target'],
		  					// data: ['Armed Opposition Group', 'Civilians', 'Government', 'Humanitarian Community', 'Infrastructure', 'Intl. Humanitarian Comm.', 'Intl. Millitary', 'Police/Millitary Gov.', 'Unknown'],
		  					axisLabel:{
		  						// rotate: 30
		  					}
		  				}],
		  				series: [{
		  				  name: bar_inc_cat[0],
		  				  type: 'bar',
		  				  label:{
		  				  	normal:{
		  				  		position: 'right',
		  				  		show: true,
		  				  		formatter: humanizeBar
		  				  	}
		  				  },
		  				  data: targetCount
		  				}, {
		  				  name: bar_inc_cat[1],
		  				  type: 'bar',
		  				  label:{
		  				  	normal:{
		  				  		position: 'right',
		  				  		show: true,
		  				  		formatter: humanizeBar
		  				  	}
		  				  },
		  				  data: targetViolent
		  				}]
		  			  });

		  			  	window.addEventListener("resize", function(){
		  			  		echartBar15.resize();
		  			  	});

		  		}
		  	// break;
		  	// default:
			  	// baseline tab
			  	//echart Bar Horizontal
				  
				if ($('#echart_bar_horizontal').length ){ 
				  
				  var echartBar16 = echarts.init(document.getElementById('echart_bar_horizontal'), theme, humTooltipBar, humanizeBar);

				  echartBar16.setOption({
					// title: {
					//   text: 'Overview 1',
					//   subtext: 'Graph subtitle'
					// },
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  formatter: humTooltipBar
					},
					legend: {
					  x: 'left',
					  y: 'top',
					  orient: 'vertical',
					  data: overview_legend
					},
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar',
				    		/*stack: 'Stack',*/
				    		// tiled: 'Tiled'
				    	  },
				    	  type: ['line', 'bar'/*, 'stack', 'tiled'*/]
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        top: '10%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: category_ov
					}],
					series: [{
					  name: overview_legend[0],
					  type: 'bar',
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: pop
					  // data: [jsondata['built_up_pop'], jsondata['cultivated_pop'], jsondata['barren_pop']]
					  // data: jsondata['jsondata']['landcover_echart_hbar']['population']
					}, {
					  name: overview_legend[1],
					  type: 'bar',
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: area
					  // data: [jsondata['built_up_area'], jsondata['cultivated_area'], jsondata['barren_area']]
					}, {
					  name: overview_legend[2],
					  type: 'bar',
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: building
					  // data: [jsondata['built_up_buildings'], jsondata['cultivated_buildings'], jsondata['barren_buildings']]
					},]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar16.resize();
				  	});

				}

				// echart Bar Horizontal 2

				if ($('#echart_bar_horizontal_2').length ){ 
				  
				  var echartBar17 = echarts.init(document.getElementById('echart_bar_horizontal_2'), theme);

				  echartBar17.setOption({
					// title: {
					//   text: 'Bar Graph',
					//   subtext: 'Graph subtitle'
					// },
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow',
					  },
					  // formatter: humTooltipBar
					},
					// legend: {
					//   // x: 'center',
					//   // y: 'bottom',
					//   data: ['Health Facilities']
					// },
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar',
				    		/*stack: 'Stack',*/
				    		// tiled: 'Tiled'
				    	  },
				    	  type: ['line', 'bar'/*, 'stack', 'tiled'*/]
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        top: '10%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  // formatter: humanizeFormatter
					}],
					yAxis: [{
					  type: 'category',
					  data: hlt_category
					}],
					series: [{
					  name: 'Health Facilities',
					  type: 'bar',
					  label:{
					  	normal:{
					  		// formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: hlt_val
					  // data: [jsondata['hlt_h1'], jsondata['hlt_h2'], jsondata['hlt_h3'], jsondata['hlt_chc'], jsondata['hlt_bhc'], jsondata['hlt_shc'], jsondata['hlt_others']]
					  // data: jsondata['jsondata']['healthfacility_echart']
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar17.resize();
				  	});

				}

				// echart Bar Horizontal 3

				if ($('#echart_bar_horizontal_3').length ){ 
				  
				  var echartBar3 = echarts.init(document.getElementById('echart_bar_horizontal_3'), theme);

				  echartBar3.setOption({
					// title: {
					//   text: 'Bar Graph',
					//   subtext: 'Graph subtitle'
					// },
					tooltip: {
					  trigger: 'axis',
					  axisPointer:{
					  	type: 'shadow'
					  },
					  formatter: humTooltipBar
					},
					// legend: {
					//   x: 100,
					//   data: ['Road Network']
					// },
					toolbox: {
					  show: true,
					  feature: {
					  	magicType: {
				    	  show: true,
				    	  title: {
				    		line: 'Line',
				    		bar: 'Bar',
				    		/*stack: 'Stack',*/
				    		// tiled: 'Tiled'
				    	  },
				    	  type: ['line', 'bar'/*, 'stack', 'tiled'*/]
				    	},
				    	restore: {
				    	  show: true,
				    	  title: "Restore"
				    	},
						saveAsImage: {
						  show: true,
						  title: "Save Image"
						}
					  }
					},
					grid: {
				        left: '0%',
				        right: '15%',
				        bottom: '8%',
				        top: '10%',
				        containLabel: true
				    },
					calculable: true,
					xAxis: [{
					  type: 'value',
					  boundaryGap: [0, 0.01],
					  axisLabel:{
					  	rotate: 30,
					  	formatter: humanizeFormatter
					  }
					}],
					yAxis: [{
					  type: 'category',
					  data: roadnetwork_category
					  // data: ['Highway', 'Primary', 'Secondary', 'Tertiary', 'Residential', 'Track', 'Path', 'River Crossing', 'Bridge']
					}],
					series: [{
					  name: 'Road Network',
					  type: 'bar',
					  label:{
					  	normal:{
					  		formatter: humanizeBar,
					  		position: 'right',
					  		show: true
					  	}
					  },
					  data: roadnetwork
					  // data: [jsondata['road_highway'], jsondata['road_primary'], jsondata['road_secondary'], jsondata['road_tertiary'], jsondata['road_residential'], jsondata['road_track'], jsondata['road_path'], jsondata['road_river_crossing'], jsondata['road_bridge']]
					}]
				  });

				  	window.addEventListener("resize", function(){
				  		echartBar3.resize();
				  	});

				}

					//echart Map
					  
					// if ($('#echart_baseline_map').length ){ 
					  
					// 	var echartMap = echarts.init(document.getElementById('echart_baseline_map'), theme);
						
					// 	var provinces = ['Kabul', 'Badakhshan'];

					// 	function showProvince() {
					// 	    var name = provinces[currentIdx]; // klik prov, ubh sesuai name prov

					// 	    // myChart.showLoading();

					// 	    $.get('vendors/echarts/map/json/province/' + name + '.json', function (geoJson) { //klo afg panggil json afg

					// 	        // myChart.hideLoading();

					// 	        echarts.registerMap(name, geoJson);

					// 	        myChart.setOption(option = {
					// 	            backgroundColor: '#404a59',
					// 	            series: [
					// 	                {
					// 	                    type: 'map',
					// 	                    mapType: name, //Json ssuai prov					                    label: {
					// 	                        emphasis: {
					// 	                            textStyle: {
					// 	                                color: '#fff'
					// 	                            }
					// 	                        }
					// 	                    },
					// 	                    itemStyle: {
					// 	                        normal: {
					// 	                            borderColor: '#389BB7',
					// 	                            areaColor: '#fff',
					// 	                        },
					// 	                        emphasis: {
					// 	                            areaColor: '#389BB7',
					// 	                            borderWidth: 0
					// 	                        }
					// 	                    },
					// 	                    animation: false
					// 	                    // animationDurationUpdate: 1000,
					// 	                    // animationEasingUpdate: 'quinticInOut'
					// 	                }
					// 	            ]
					// 	        });
					// 	    });
					// 	}

					// 	var data = [
					// 	    {name: 'Kabul', value: 9},
					// 	    {name: 'Badakhshan', value: 12}
					// 	];

					// 	var geoCoordMap = {
					// 	   'Kabul':[34.543896, 69.160652],
					// 	   'Badakhshan':[109.781327,39.608266],
					// 	};

					// 	function convertData(data) {
					// 	   var res = [];
					// 	   for (var i = 0; i < data.length; i++) {
					// 	       var geoCoord = geoCoordMap[data[i].name];
					// 	       if (geoCoord) {
					// 	           res.push({
					// 	               name: data[i].name,
					// 	               value: geoCoord.concat(data[i].value)
					// 	           });
					// 	       }
					// 	   }
					// 	   return res;
					// 	};

					// 	echartMap.setOption({
					// 		// title: {
					// 		//   text: 'World Population (2010)',
					// 		//   subtext: 'from United Nations, Total population, both sexes combined, as of 1 July (thousands)',
					// 		//   x: 'center',
					// 		//   y: 'top'
					// 		// },
					// 		tooltip: {
					// 		  trigger: 'item',
					// 		  formatter: function(params) {
					// 			var value = (params.value + '').split('.');
					// 			value = value[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1,') + '.' + value[1];
					// 			return params.seriesName + '<br/>' + params.name + ' : ' + value;
					// 		  }
					// 		},
					// 		toolbox: {
					// 		  show: true,
					// 		  orient: 'vertical',
					// 		  x: 'right',
					// 		  y: 'center',
					// 		  feature: {
					// 			mark: {
					// 			  show: true
					// 			},
					// 			dataView: {
					// 			  show: true,
					// 			  title: "Text View",
					// 			  lang: [
					// 				"Text View",
					// 				"Close",
					// 				"Refresh",
					// 			  ],
					// 			  readOnly: false
					// 			},
					// 			restore: {
					// 			  show: true,
					// 			  title: "Restore"
					// 			},
					// 			saveAsImage: {
					// 			  show: true,
					// 			  title: "Save Image"
					// 			}
					// 		  }
					// 		},
					// 		dataRange: {
					// 		  min: 0,
					// 		  max: 1000000,
					// 		  text: ['High', 'Low'],
					// 		  realtime: false,
					// 		  calculable: true,
					// 		  color: ['#087E65', '#26B99A', '#CBEAE3']
					// 		},
					// 		series: [
					// 		{
					//            type: 'scatter',
					//            coordinateSystem: 'geo',
					//            data: convertData(data),
					//            symbolSize: 20,
					//            symbol: 'path://M1705.06,1318.313v-89.254l-319.9-221.799l0.073-208.063c0.521-84.662-26.629-121.796-63.961-121.491c-37.332-0.305-64.482,36.829-63.961,121.491l0.073,208.063l-319.9,221.799v89.254l330.343-157.288l12.238,241.308l-134.449,92.931l0.531,42.034l175.125-42.917l175.125,42.917l0.531-42.034l-134.449-92.931l12.238-241.308L1705.06,1318.313z',
					//            symbolRotate: 35,
					//            label: {
					//                normal: {
					//                    formatter: '{b}',
					//                    position: 'right',
					//                    show: false
					//                },
					//                emphasis: {
					//                    show: true
					//                }
					//            },
					//            itemStyle: {
					//                normal: {
					//                     color: '#F06C00'
					//                }
					//            }
					//         },
					// 		{
					// 		  name: 'Population',
					// 		  type: 'map',
					// 		  mapType: 'afg',
					// 		  roam: false,
					// 		  mapLocation: {
					// 			y: 60
					// 		  },
					// 		  itemStyle: {
					// 			emphasis: {
					// 			  label: {
					// 				show: true
					// 			  }
					// 			}
					// 		  },
					// 		  data: [{
					// 			name: 'Badakhshan',
					// 			value: 28397.812
					// 		  }, {
					// 			name: 'Kabul',
					// 			value: 19549.124
					// 		  }, {
					// 			name: 'Albania',
					// 			value: 3150.143
					// 		  }, {
					// 			name: 'United Arab Emirates',
					// 			value: 8441.537
					// 		  }, {
					// 			name: 'Argentina',
					// 			value: 40374.224
					// 		  }, {
					// 			name: 'Armenia',
					// 			value: 2963.496
					// 		  }, {
					// 			name: 'French Southern and Antarctic Lands',
					// 			value: 268.065
					// 		  }, {
					// 			name: 'Australia',
					// 			value: 22404.488
					// 		  }, {
					// 			name: 'Austria',
					// 			value: 8401.924
					// 		  }, {
					// 			name: 'Azerbaijan',
					// 			value: 9094.718
					// 		  }, {
					// 			name: 'Burundi',
					// 			value: 9232.753
					// 		  }, {
					// 			name: 'Belgium',
					// 			value: 10941.288
					// 		  }, {
					// 			name: 'Benin',
					// 			value: 9509.798
					// 		  }, {
					// 			name: 'Burkina Faso',
					// 			value: 15540.284
					// 		  }, {
					// 			name: 'Bangladesh',
					// 			value: 151125.475
					// 		  }, {
					// 			name: 'Bulgaria',
					// 			value: 7389.175
					// 		  }, {
					// 			name: 'The Bahamas',
					// 			value: 66402.316
					// 		  }, {
					// 			name: 'Bosnia and Herzegovina',
					// 			value: 3845.929
					// 		  }, {
					// 			name: 'Belarus',
					// 			value: 9491.07
					// 		  }, {
					// 			name: 'Belize',
					// 			value: 308.595
					// 		  }, {
					// 			name: 'Bermuda',
					// 			value: 64.951
					// 		  }, {
					// 			name: 'Bolivia',
					// 			value: 716.939
					// 		  }, {
					// 			name: 'Brazil',
					// 			value: 195210.154
					// 		  }, {
					// 			name: 'Brunei',
					// 			value: 27.223
					// 		  }, {
					// 			name: 'Bhutan',
					// 			value: 716.939
					// 		  }, {
					// 			name: 'Botswana',
					// 			value: 1969.341
					// 		  }, {
					// 			name: 'Central African Republic',
					// 			value: 4349.921
					// 		  }, {
					// 			name: 'Canada',
					// 			value: 34126.24
					// 		  }, {
					// 			name: 'Switzerland',
					// 			value: 7830.534
					// 		  }, {
					// 			name: 'Chile',
					// 			value: 17150.76
					// 		  }, {
					// 			name: 'China',
					// 			value: 1359821.465
					// 		  }, {
					// 			name: 'Ivory Coast',
					// 			value: 60508.978
					// 		  }, {
					// 			name: 'Cameroon',
					// 			value: 20624.343
					// 		  }, {
					// 			name: 'Democratic Republic of the Congo',
					// 			value: 62191.161
					// 		  }, {
					// 			name: 'Republic of the Congo',
					// 			value: 3573.024
					// 		  }, {
					// 			name: 'Colombia',
					// 			value: 46444.798
					// 		  }, {
					// 			name: 'Costa Rica',
					// 			value: 4669.685
					// 		  }, {
					// 			name: 'Cuba',
					// 			value: 11281.768
					// 		  }, {
					// 			name: 'Northern Cyprus',
					// 			value: 1.468
					// 		  }, {
					// 			name: 'Cyprus',
					// 			value: 1103.685
					// 		  }, {
					// 			name: 'Czech Republic',
					// 			value: 10553.701
					// 		  }, {
					// 			name: 'Germany',
					// 			value: 83017.404
					// 		  }, {
					// 			name: 'Djibouti',
					// 			value: 834.036
					// 		  }, {
					// 			name: 'Denmark',
					// 			value: 5550.959
					// 		  }, {
					// 			name: 'Dominican Republic',
					// 			value: 10016.797
					// 		  }, {
					// 			name: 'Algeria',
					// 			value: 37062.82
					// 		  }, {
					// 			name: 'Ecuador',
					// 			value: 15001.072
					// 		  }, {
					// 			name: 'Egypt',
					// 			value: 78075.705
					// 		  }, {
					// 			name: 'Eritrea',
					// 			value: 5741.159
					// 		  }, {
					// 			name: 'Spain',
					// 			value: 46182.038
					// 		  }, {
					// 			name: 'Estonia',
					// 			value: 1298.533
					// 		  }, {
					// 			name: 'Ethiopia',
					// 			value: 87095.281
					// 		  }, {
					// 			name: 'Finland',
					// 			value: 5367.693
					// 		  }, {
					// 			name: 'Fiji',
					// 			value: 860.559
					// 		  }, {
					// 			name: 'Falkland Islands',
					// 			value: 49.581
					// 		  }, {
					// 			name: 'France',
					// 			value: 63230.866
					// 		  }, {
					// 			name: 'Gabon',
					// 			value: 1556.222
					// 		  }, {
					// 			name: 'United Kingdom',
					// 			value: 62066.35
					// 		  }, {
					// 			name: 'Georgia',
					// 			value: 4388.674
					// 		  }, {
					// 			name: 'Ghana',
					// 			value: 24262.901
					// 		  }, {
					// 			name: 'Guinea',
					// 			value: 10876.033
					// 		  }, {
					// 			name: 'Gambia',
					// 			value: 1680.64
					// 		  }, {
					// 			name: 'Guinea Bissau',
					// 			value: 10876.033
					// 		  }, {
					// 			name: 'Equatorial Guinea',
					// 			value: 696.167
					// 		  }, {
					// 			name: 'Greece',
					// 			value: 11109.999
					// 		  }, {
					// 			name: 'Greenland',
					// 			value: 56.546
					// 		  }, {
					// 			name: 'Guatemala',
					// 			value: 14341.576
					// 		  }, {
					// 			name: 'French Guiana',
					// 			value: 231.169
					// 		  }, {
					// 			name: 'Guyana',
					// 			value: 786.126
					// 		  }, {
					// 			name: 'Honduras',
					// 			value: 7621.204
					// 		  }, {
					// 			name: 'Croatia',
					// 			value: 4338.027
					// 		  }, {
					// 			name: 'Haiti',
					// 			value: 9896.4
					// 		  }, {
					// 			name: 'Hungary',
					// 			value: 10014.633
					// 		  }, {
					// 			name: 'Indonesia',
					// 			value: 240676.485
					// 		  }, {
					// 			name: 'India',
					// 			value: 1205624.648
					// 		  }, {
					// 			name: 'Ireland',
					// 			value: 4467.561
					// 		  }, {
					// 			name: 'Iran',
					// 			value: 240676.485
					// 		  }, {
					// 			name: 'Iraq',
					// 			value: 30962.38
					// 		  }, {
					// 			name: 'Iceland',
					// 			value: 318.042
					// 		  }, {
					// 			name: 'Israel',
					// 			value: 7420.368
					// 		  }, {
					// 			name: 'Italy',
					// 			value: 60508.978
					// 		  }, {
					// 			name: 'Jamaica',
					// 			value: 2741.485
					// 		  }, {
					// 			name: 'Jordan',
					// 			value: 6454.554
					// 		  }, {
					// 			name: 'Japan',
					// 			value: 127352.833
					// 		  }, {
					// 			name: 'Kazakhstan',
					// 			value: 15921.127
					// 		  }, {
					// 			name: 'Kenya',
					// 			value: 40909.194
					// 		  }, {
					// 			name: 'Kyrgyzstan',
					// 			value: 5334.223
					// 		  }, {
					// 			name: 'Cambodia',
					// 			value: 14364.931
					// 		  }, {
					// 			name: 'South Korea',
					// 			value: 51452.352
					// 		  }, {
					// 			name: 'Kosovo',
					// 			value: 97.743
					// 		  }, {
					// 			name: 'Kuwait',
					// 			value: 2991.58
					// 		  }, {
					// 			name: 'Laos',
					// 			value: 6395.713
					// 		  }, {
					// 			name: 'Lebanon',
					// 			value: 4341.092
					// 		  }, {
					// 			name: 'Liberia',
					// 			value: 3957.99
					// 		  }, {
					// 			name: 'Libya',
					// 			value: 6040.612
					// 		  }, {
					// 			name: 'Sri Lanka',
					// 			value: 20758.779
					// 		  }, {
					// 			name: 'Lesotho',
					// 			value: 2008.921
					// 		  }, {
					// 			name: 'Lithuania',
					// 			value: 3068.457
					// 		  }, {
					// 			name: 'Luxembourg',
					// 			value: 507.885
					// 		  }, {
					// 			name: 'Latvia',
					// 			value: 2090.519
					// 		  }, {
					// 			name: 'Morocco',
					// 			value: 31642.36
					// 		  }, {
					// 			name: 'Moldova',
					// 			value: 103.619
					// 		  }, {
					// 			name: 'Madagascar',
					// 			value: 21079.532
					// 		  }, {
					// 			name: 'Mexico',
					// 			value: 117886.404
					// 		  }, {
					// 			name: 'Macedonia',
					// 			value: 507.885
					// 		  }, {
					// 			name: 'Mali',
					// 			value: 13985.961
					// 		  }, {
					// 			name: 'Myanmar',
					// 			value: 51931.231
					// 		  }, {
					// 			name: 'Montenegro',
					// 			value: 620.078
					// 		  }, {
					// 			name: 'Mongolia',
					// 			value: 2712.738
					// 		  }, {
					// 			name: 'Mozambique',
					// 			value: 23967.265
					// 		  }, {
					// 			name: 'Mauritania',
					// 			value: 3609.42
					// 		  }, {
					// 			name: 'Malawi',
					// 			value: 15013.694
					// 		  }, {
					// 			name: 'Malaysia',
					// 			value: 28275.835
					// 		  }, {
					// 			name: 'Namibia',
					// 			value: 2178.967
					// 		  }, {
					// 			name: 'New Caledonia',
					// 			value: 246.379
					// 		  }, {
					// 			name: 'Niger',
					// 			value: 15893.746
					// 		  }, {
					// 			name: 'Nigeria',
					// 			value: 159707.78
					// 		  }, {
					// 			name: 'Nicaragua',
					// 			value: 5822.209
					// 		  }, {
					// 			name: 'Netherlands',
					// 			value: 16615.243
					// 		  }, {
					// 			name: 'Norway',
					// 			value: 4891.251
					// 		  }, {
					// 			name: 'Nepal',
					// 			value: 26846.016
					// 		  }, {
					// 			name: 'New Zealand',
					// 			value: 4368.136
					// 		  }, {
					// 			name: 'Oman',
					// 			value: 2802.768
					// 		  }, {
					// 			name: 'Pakistan',
					// 			value: 173149.306
					// 		  }, {
					// 			name: 'Panama',
					// 			value: 3678.128
					// 		  }, {
					// 			name: 'Peru',
					// 			value: 29262.83
					// 		  }, {
					// 			name: 'Philippines',
					// 			value: 93444.322
					// 		  }, {
					// 			name: 'Papua New Guinea',
					// 			value: 6858.945
					// 		  }, {
					// 			name: 'Poland',
					// 			value: 38198.754
					// 		  }, {
					// 			name: 'Puerto Rico',
					// 			value: 3709.671
					// 		  }, {
					// 			name: 'North Korea',
					// 			value: 1.468
					// 		  }, {
					// 			name: 'Portugal',
					// 			value: 10589.792
					// 		  }, {
					// 			name: 'Paraguay',
					// 			value: 6459.721
					// 		  }, {
					// 			name: 'Qatar',
					// 			value: 1749.713
					// 		  }, {
					// 			name: 'Romania',
					// 			value: 21861.476
					// 		  }, {
					// 			name: 'Russia',
					// 			value: 21861.476
					// 		  }, {
					// 			name: 'Rwanda',
					// 			value: 10836.732
					// 		  }, {
					// 			name: 'Western Sahara',
					// 			value: 514.648
					// 		  }, {
					// 			name: 'Saudi Arabia',
					// 			value: 27258.387
					// 		  }, {
					// 			name: 'Sudan',
					// 			value: 35652.002
					// 		  }, {
					// 			name: 'South Sudan',
					// 			value: 9940.929
					// 		  }, {
					// 			name: 'Senegal',
					// 			value: 12950.564
					// 		  }, {
					// 			name: 'Solomon Islands',
					// 			value: 526.447
					// 		  }, {
					// 			name: 'Sierra Leone',
					// 			value: 5751.976
					// 		  }, {
					// 			name: 'El Salvador',
					// 			value: 6218.195
					// 		  }, {
					// 			name: 'Somaliland',
					// 			value: 9636.173
					// 		  }, {
					// 			name: 'Somalia',
					// 			value: 9636.173
					// 		  }, {
					// 			name: 'Republic of Serbia',
					// 			value: 3573.024
					// 		  }, {
					// 			name: 'Suriname',
					// 			value: 524.96
					// 		  }, {
					// 			name: 'Slovakia',
					// 			value: 5433.437
					// 		  }, {
					// 			name: 'Slovenia',
					// 			value: 2054.232
					// 		  }, {
					// 			name: 'Sweden',
					// 			value: 9382.297
					// 		  }, {
					// 			name: 'Swaziland',
					// 			value: 1193.148
					// 		  }, {
					// 			name: 'Syria',
					// 			value: 7830.534
					// 		  }, {
					// 			name: 'Chad',
					// 			value: 11720.781
					// 		  }, {
					// 			name: 'Togo',
					// 			value: 6306.014
					// 		  }, {
					// 			name: 'Thailand',
					// 			value: 66402.316
					// 		  }, {
					// 			name: 'Tajikistan',
					// 			value: 7627.326
					// 		  }, {
					// 			name: 'Turkmenistan',
					// 			value: 5041.995
					// 		  }, {
					// 			name: 'East Timor',
					// 			value: 10016.797
					// 		  }, {
					// 			name: 'Trinidad and Tobago',
					// 			value: 1328.095
					// 		  }, {
					// 			name: 'Tunisia',
					// 			value: 10631.83
					// 		  }, {
					// 			name: 'Turkey',
					// 			value: 72137.546
					// 		  }, {
					// 			name: 'United Republic of Tanzania',
					// 			value: 44973.33
					// 		  }, {
					// 			name: 'Uganda',
					// 			value: 33987.213
					// 		  }, {
					// 			name: 'Ukraine',
					// 			value: 46050.22
					// 		  }, {
					// 			name: 'Uruguay',
					// 			value: 3371.982
					// 		  }, {
					// 			name: 'United States of America',
					// 			value: 312247.116
					// 		  }, {
					// 			name: 'Uzbekistan',
					// 			value: 27769.27
					// 		  }, {
					// 			name: 'Venezuela',
					// 			value: 236.299
					// 		  }, {
					// 			name: 'Vietnam',
					// 			value: 89047.397
					// 		  }, {
					// 			name: 'Vanuatu',
					// 			value: 236.299
					// 		  }, {
					// 			name: 'West Bank',
					// 			value: 13.565
					// 		  }, {
					// 			name: 'Yemen',
					// 			value: 22763.008
					// 		  }, {
					// 			name: 'South Africa',
					// 			value: 51452.352
					// 		  }, {
					// 			name: 'Zambia',
					// 			value: 13216.985
					// 		  }, {
					// 			name: 'Zimbabwe',
					// 			value: 13076.978
					// 		  }]
					// 		}]
					// 	});
					// }
	  			// break;

		};

		$(document).ready(function(){
			// init_echarts();
			// init_baseline();
			// init_accsblty();
			init_echarts2();
		});

		// Show Echart on active tab
		// $('a[data-toggle="pill"]').on('shown.bs.tab', function(e){
		// 	init_echarts();
		// })

		// Show Echart based on active tab
		$('.navbar-forecast a[href="#ggMenu"]').on('shown.bs.tab', function(){
			init_echarts2();
		});

		$('.navbar-forecast a[href="#glMenu"]').on('shown.bs.tab', function(){
			init_echarts2();
		});

		$('.navbar-forecast a[href="#gfMenu"]').on('shown.bs.tab', function(){
			init_echarts2();
		});

		$('.visible-print-block div#echart_sonar').on('shown.bs.tab', function(){
			init_echarts2();
		});

		$('.nav-pills a[href="#baseline"]').on('shown.bs.tab', function(){
			// init_baseline();
			init_echarts2();
		});

		$('.nav-pills a[href="#accessibility"]').on('shown.bs.tab', function(){
			// init_accsblty();
			init_echarts2("accessibility");
		});

		$('.nav-pills a[href="#fforecast"]').on('shown.bs.tab', function(){
			init_echarts2("fforecast");
		});

		$('.nav-pills a[href="#frisk"]').on('shown.bs.tab', function(){
			init_echarts2("frisk");
		});

		$('.nav-pills a[href="#aforecast"]').on('shown.bs.tab', function(){
			init_echarts2("aforecast");
		});

		$('.nav-pills a[href="#arisk"]').on('shown.bs.tab', function(){
			init_echarts2("arisk");
		});

		$('.nav-pills a[href="#earthquake"]').on('shown.bs.tab', function(){
			init_echarts2("earthquake");
		});

		$('.nav-pills a[href="#haccess"]').on('shown.bs.tab', function(){
			init_echarts2("haccess");
		});

		// $('a[data-toggle="pill"] #baseline').on('shown.bs.tab', function(e){
		// 	init_echarts(['chart1', 'chart2']);
		// })

		$('.nav-pills a[href="#ndisaster"]').on('shown.bs.tab', function(){
			$("#ndisaster").show(function(){
				// Find the iframes
				$(this).find("iframe").prop("src", function(){
					// Set their src attribute to the value of data-src
					return $(this).data("src");
				})
			});
		});

		var humanizeTableFormatter = function(value){
			// console.log(value)

			var v= value;
			// var n= params.name;
			if(v>=1000 && v<1000000){
				return (parseFloat((v/1000).toFixed(1)))+' K'
			}
			else if (v>=1000000 && v<1000000000) {
				return (parseFloat((v/1000000).toFixed(1)))+' M'
			}else{
				if (v==null || isNaN(parseFloat(v))) {
					v=0;
				}
				// console.log(v);
				return (parseFloat((v)))
				// return (parseFloat((v).toFixed(1)))
			}

		};

		$(document).ready(function(){
			// var xxx = {{ Buildings }};
			// console.log(xxx);
			
			// console.log('run_datatables');

			// if( typeof ($.fn.DataTable) === 'undefined'){
			// 	return;
			// }

	    	// console.log('jsondata[\'lc_child\']', jsondata['lc_child']);

	    	$('.print').DataTable({
	    		"ordering": false, //do this when print
	    		"paging": false, //do this when print
	    		"info": false, //do this when print
	    		"searching": false, //do this when print
	    		dom: 't', //do this when print

	    		"columnDefs": [{
	    			"render": function (data, type, row){
	    				if (type == 'display') {return humanizeTableFormatter(data);}
	    				return data;
	    			},
	    			"targets": 'hum'
	    		}]
	    	});

	    	$('.online').DataTable({
	    		dom: 'Bfrtip',
	    		buttons: [
	    			{
	    				extend: "copy",
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "csv",
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "excel",
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "print",
	    				className: "btn-sm"
	    			},
	    			// {
	    			//   extend: "colvis"
	    			//   className: "btn-sm"
	    			// }
	    		],

	    		"columnDefs": [{
	    			"render": function (data, type, row){
	    				if (type == 'display') {return humanizeTableFormatter(data);}
	    				return data;
	    			},
	    			"targets": 'hum'
	    		}]
	    	});

	    	$('.online_security').DataTable({
	    		"ordering": false,
	    		// "pageLength": 30,
	    		dom: 'Bfrtip',
	    		buttons: [
	    			{
	    				extend: "copy",
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "csv",
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "excel",
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "print",
	    				className: "btn-sm"
	    			},
	    			// {
	    			//   extend: "colvis"
	    			//   className: "btn-sm"
	    			// }
	    		],

	    		"columnDefs": [{
	    			"render": function (data, type, row){
	    				if (type == 'display') {return humanizeTableFormatter(data);}
	    				return data;
	    			},
	    			"targets": 'hum'
	    		}]
	    	});

			// $('#pop_area_overview').DataTable( {
			// 	data: base_lcAll,
			// 	columns: [ // empty objects as placeholder to maintain existing table header titles
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 		// { title: "Region" },
			// 		// { title: "Settl." },
			// 		// { title: "Built-up Pop" },
			// 		// { title: "Built-up Area" },
			// 		// { title: "Cultivated Pop" },
			// 		// { title: "Cultivated Area" },
			// 		// { title: "Barren/Rangeland Pop" },
			// 		// { title: "Barren/Rangeland Area" },
			// 		// { title: "Total Pop" },
			// 		// { title: "Total Area" }
			// 	],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],
			// 	// responsive: true,

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[1] == base_lcParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		// "type": "num",
			// 		// "visible": false,
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 			// console.log(data, type, row);
			// 			// return data+'K';
			// 		// },
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			// 	}]
			// });

			// $('#pop_area_overview_p').DataTable( {
			// 	data: base_lcAll,
			// 	columns: [ // empty objects as placeholder to maintain existing table header titles
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[1] == base_lcParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			// 	}]
			// });

			// $('#health_facilities').DataTable( {
			// 	data: hfAll,
			// 	columns: [ // empty objects as placeholder to maintain existing table header titles
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 		// { title: "Region" },
			// 		// { title: "Settl." },
			// 		// { title: "Built-up Pop" },
			// 		// { title: "Built-up Area" },
			// 		// { title: "Cultivated Pop" },
			// 		// { title: "Cultivated Area" },
			// 		// { title: "Barren/Rangeland Pop" },
			// 		// { title: "Barren/Rangeland Area" },
			// 		// { title: "Total Pop" },
			// 		// { title: "Total Area" }
			// 	],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],
			// 	// responsive: true,

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[8] == hfParent[0][8] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		// "type": "num",
			// 		// "visible": false,
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 			// console.log(data, type, row);
			// 			// return data+'K';
			// 		// },
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8]
			// 	}]
			// });

			// $('#health_facilities_p').DataTable( {
			// 	data: hfAll,
			// 	columns: [ // empty objects as placeholder to maintain existing table header titles
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[8] == hfParent[0][8] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8]
			// 	}]
			// });

			// $('#road_network').DataTable( {
			// 	data: rnAll,
			// 	columns: [ // empty objects as placeholder to maintain existing table header titles
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 		// { title: "Region" },
			// 		// { title: "Settl." },
			// 		// { title: "Built-up Pop" },
			// 		// { title: "Built-up Area" },
			// 		// { title: "Cultivated Pop" },
			// 		// { title: "Cultivated Area" },
			// 		// { title: "Barren/Rangeland Pop" },
			// 		// { title: "Barren/Rangeland Area" },
			// 		// { title: "Total Pop" },
			// 		// { title: "Total Area" }
			// 	],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],
			// 	// responsive: true,

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[10] == rnParent[0][10] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		// "type": "num",
			// 		// "visible": false,
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 			// console.log(data, type, row);
			// 			// return data+'K';
			// 		// },
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			// 	}]
			// });

			// $('#road_network_p').DataTable( {
			// 	data: rnAll,
			// 	columns: [ // empty objects as placeholder to maintain existing table header titles
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[10] == rnParent[0][10] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			// 	}]
			// });

			// $('.accessibility_table').DataTable({
			// 	// columns: [
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{}
			// 	// ],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
			// 	}]
			// });

			// $('.accessibility_table_print').DataTable({
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
			// 	}]
			// });

			/*$('#n_Health1').DataTable({
				// columns: [
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{}
				// ],
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
				}]
			});

			$('#nHealth2').DataTable({
				// columns: [
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{}
				// ],
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nHealth3').DataTable({
				// columns: [
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{}
				// ],
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nHealth4').DataTable({
				// columns: [
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{}
				// ],
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#ProvC').DataTable({
				// columns: [
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{}
				// ],
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nProv').DataTable({
				// columns: [
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{}
				// ],
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nDist').DataTable({
				// columns: [
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{},
				// 	{}
				// ],
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});*/

			/*$('#nAirport_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nHealth1_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nHealth2_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nHealth3_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nHealth4_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#ProvC_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nProv_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});

			$('#nDist_p').DataTable({
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
				}]
			});*/

			// $('.flood_overview').DataTable({
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
			// 	}]
			// });

			// $('.flood_overview_print').DataTable({
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
			// 	}]
			// });

			/*$('#rggfoverview').DataTable({
				data: rggfoverviewAll,
				columns: [
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
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"rowCallback": function( row, data, index ) {
				    if ( data[0] == rggfoverviewParent[0][0] && data[1] == rggfoverviewParent[0][1] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
				}]
			});

			$('#rggfoverview_p').DataTable({
				data: rggfoverviewAll,
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"rowCallback": function( row, data, index ) {
				    if ( data[0] == rggfoverviewParent[0][0] && data[1] == rggfoverviewParent[0][1] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
				}]
			});

			$('#rgffoverview').DataTable({
				data: rgffoverviewAll,
				columns: [
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
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"rowCallback": function( row, data, index ) {
				    if ( data[0] == rgffoverviewParent[0][0] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
				}]
			});

			$('#rgffoverview_p').DataTable({
				data: rgffoverviewAll,
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"rowCallback": function( row, data, index ) {
				    if ( data[0] == rgffoverviewParent[0][0] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
				}]
			});

			$('#rglfoverview').DataTable({
				data: rglfoverviewAll,
				columns: [
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
				dom: 'Bfrtip',
				buttons: [
					{
						extend: "copy",
						className: "btn-sm"
					},
					{
						extend: "csv",
						className: "btn-sm"
					},
					{
						extend: "excel",
						className: "btn-sm"
					},
					{
						extend: "print",
						className: "btn-sm"
					},
					// {
					//   extend: "colvis"
					//   className: "btn-sm"
					// }
				],

				"rowCallback": function( row, data, index ) {
				    if ( data[0] == rglfoverviewParent[0][0] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
				}]
			});

			$('#rglfoverview_p').DataTable({
				data: rglfoverviewAll,
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"rowCallback": function( row, data, index ) {
				    if ( data[0] == rglfoverviewParent[0][0] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
				}]
			});*/

			// $('.frisk').DataTable({
			// 	/*data: fRiskAll,
			// 	columns: [
			// 		// {},
			// 		// {},
			// 		// {},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],*/
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	/*"rowCallback": function( row, data, index ) {
			// 	    if ( data[1] == fRiskParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},*/

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10/*, 11, 12, 13*/]
			// 	}]
			// });

			/*$('#frisk_p').DataTable({
				data: fRiskAll,
				columns: [
					// {},
					// {},
					// {},
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't',

				"rowCallback": function( row, data, index ) {
				    if ( data[1] == fRiskParent[0][1] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
				}]
			});*/

			// $('.frisk_print').DataTable({
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't',

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
			// 	}]
			// });

			// $('.aforecast').DataTable({
			// 	// data: aForecastAll,
			// 	// columns: [
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{}
			// 	// ],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	// "rowCallback": function( row, data, index ) {
			// 	//     if ( data[0] == aForecastParent[0][0] ) {
			// 	//       $('td', row).addClass('boldRow');
			// 	//     }
			// 	// },

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8]
			// 	}]
			// });

			/*$('#aforecast_p').DataTable({
				data: aForecastAll,
				columns: [
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
				"ordering": false, //do this when print
				"paging": false, //do this when print
				"info": false, //do this when print
				"searching": false, //do this when print
				dom: 't', //do this when print

				"rowCallback": function( row, data, index ) {
				    if ( data[0] == aForecastParent[0][0] ) {
				      $('td', row).addClass('boldRow');
				    }
				},

				"columnDefs": [{
					"render": function (data, type, row){
						if (type == 'display') {return humanizeTableFormatter(data);}
						return data;
					},
					"targets": [1, 2, 3, 4]
				}]
			});*/

			// $('.aforecast_print').DataTable({
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8]
			// 	}]
			// });

			// $('#arisk').DataTable({
			// 	data: aRiskAll,
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[1] == aRiskParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
			// 	}]
			// });

			// $('#arisk_p').DataTable({
			// 	data: aRiskAll,
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[1] == aRiskParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9]
			// 	}]
			// });

			// $('.landslide_table').DataTable({
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('.landslide_table_print').DataTable({
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('#erthqkTable').DataTable({
			// 	// data: erthqkAll,
			// 	// columns: [
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{},
			// 	// 	{}
			// 	// ],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[0] == erthqkParent[0][0] && data[1] == erthqkParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
			// 	}]
			// });

			// $('#erthqkTable_p').DataTable({
			// 	data: erthqkAll,
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[0] == erthqkParent[0][0] && data[1] == erthqkParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
			// 	}]
			// });

			// $('#incident').DataTable({
			// 	data: incidentAll,
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false,
			// 	"pageLength": 30,
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"rowCallback": function( row, data, index ) {
			// 		for (var i = 0; i < incidentParent.length; i++) {
			// 			if ( data[0] == incidentParent[i][0] && data[1] == incidentParent[i][1] ) {
			// 			  $('td', row).addClass('boldRow');
			// 			}
			// 		}
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('#target').DataTable({
			// 	data: targetAll,
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false,
			// 	"pageLength": 20,
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"rowCallback": function( row, data, index ) {
			// 		for (var i = 0; i < targetParent.length; i++) {
			// 			if ( data[0] == targetParent[i][0] && data[1] == targetParent[i][1] ) {
			// 			  	$('td', row).addClass('boldRow');
			// 			}
			// 		}
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('#incident_overview').DataTable({
			// 	data: incident_overviewAll,
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	dom: 'Bfrtip',
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	],

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[0] == incident_overviewParent[0][0] && data[1] == incident_overviewParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('#incident_list').DataTable({
			// 	data: incident_list,
			// 	columns: [
			// 		{},
			// 		{},
			// 	],
			// 	dom: 'Bfrtip',
			// 	"order": [[0, "desc"]],
			// 	buttons: [
			// 		{
			// 			extend: "copy",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "csv",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "excel",
			// 			className: "btn-sm"
			// 		},
			// 		{
			// 			extend: "print",
			// 			className: "btn-sm"
			// 		},
			// 		// {
			// 		//   extend: "colvis"
			// 		//   className: "btn-sm"
			// 		// }
			// 	]
			// });

			// $('#incident_p').DataTable({
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('#target_p').DataTable({
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('#incident_overview_p').DataTable({
			// 	data: incident_overviewAll,
			// 	columns: [
			// 		{},
			// 		{},
			// 		{},
			// 		{},
			// 		{}
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print

			// 	"rowCallback": function( row, data, index ) {
			// 	    if ( data[0] == incident_overviewParent[0][0] && data[1] == incident_overviewParent[0][1] ) {
			// 	      $('td', row).addClass('boldRow');
			// 	    }
			// 	},

			// 	"columnDefs": [{
			// 		"render": function (data, type, row){
			// 			if (type == 'display') {return humanizeTableFormatter(data);}
			// 			return data;
			// 		},
			// 		"targets": [1, 2, 3, 4]
			// 	}]
			// });

			// $('#incident_list_p').DataTable({
			// 	columns: [
			// 		{},
			// 		{},
			// 	],
			// 	"ordering": false, //do this when print
			// 	"paging": false, //do this when print
			// 	"info": false, //do this when print
			// 	"searching": false, //do this when print
			// 	dom: 't', //do this when print
			// });

			// var tblpop = $('#pop_area_overview').DataTable({
			// 	columns: [
			// 		{ title: "Region" },
			// 		{ title: "Settl." },
			// 		{ title: "Built-up Pop" },
			// 		{ title: "Built-up Area" },
			// 		{ title: "Cultivated Pop" },
			// 		{ title: "Cultivated Area" },
			// 		{ title: "Barren/Rangeland Pop" },
			// 		{ title: "Barren/Rangeland Area" },
			// 		{ title: "Total Pop" },
			// 		{ title: "Total Area" }
			// ]});
			// var tblpopdata = tblpop.data();
			// tblpopdata = jsondata['lc_child'];
			// console.log('tblpop.data()', tblpop.data());
			// tblpop.rows().invalidate().draw();

			// console.log('init_DataTables');

			// var handleDataTableButtons = function() {
			//   	if ($("table.datatable-buttons").length) {
					// $('table.datatable-buttons').DataTable({
					// 	/*columnDefs: [ {
					// 	    targets: 3,
					// 	    render: $.fn.dataTable.render.intlNumber()
					// 	} ],*/
					// 	dom: 'Bfrtip',
					// 	buttons: [
					// 	{
					// 		extend: "copy",
					// 		className: "btn-sm"
					// 	},
					// 	{
					// 	  extend: "csv",
					// 	  className: "btn-sm"
					// 	},
					// 	{
					// 	  extend: "excel",
					// 	  className: "btn-sm"
					// 	},
					// 	{
					// 	  extend: "print",
					// 	  className: "btn-sm"
					// 	},
					// 	// {
					// 	//   extend: "colvis"
					// 	//   className: "btn-sm"
					// 	// }
					// 	],
					// 	// responsive: true,

					// 	// "columnDefs": [{
					// 	// 	// "type": "num",
					// 	// 	// "visible": false,
					// 	// 	"render": function (data, type, row){
					// 	// 		if(data>=1000 && data<1000000){
					// 	// 			return ((data/1000).toFixed(2))+' K';
					// 	// 		}
					// 	// 		else if (data>=1000000 && data<1000000000) {
					// 	// 			return ((data/1000000).toFixed(2))+' M';
					// 	// 		}else{
					// 	// 			return data;
					// 	// 		}
					// 	// 		// console.log(data, type, row);
					// 	// 		// return data+'K';
					// 	// 	},
					// 	// 	"targets": 3
					// 	// }],

					// 	// "aoColumns":[{
					// 	// 	"sType": "rank",
					// 	// 	"bSortable": true
					// 	// },
					// 	// {
					// 	// 	"bSortable": false
					// 	// }]
					// });
			// 	}
			// };

			// TableManageButtons = function() {
			// 	"use strict";
			// 	return {
			// 		init: function() {
			// 		  	handleDataTableButtons();
			// 		}
			// 	};
			// }();

		});
	}


	// Datatables Button
	// $.extend(true, $.fn.dataTable.defaults, {
	// 	// "ordering": false, //do this when print
	// 	// "paging": false, //do this when print
	// 	// "info": false, //do this when print
	// 	// "searching": false, //do this when print
	// 	// dom: 't' //do this when print

	// 	dom: 'Bfrtip',
	// 	buttons: [
	// 		{
	// 			extend: "copy",
	// 			className: "btn-sm"
	// 		},
	// 		{
	// 			extend: "csv",
	// 			className: "btn-sm"
	// 		},
	// 		{
	// 			extend: "excel",
	// 			className: "btn-sm"
	// 		},
	// 		{
	// 			extend: "print",
	// 			className: "btn-sm"
	// 		},
	// 		{
	// 		  extend: "colvis"
	// 		  className: "btn-sm"
	// 		}
	// 	]
	// });

	

	// Coba complex header
	// $(document).ready(function(){
	//     // Standard initialisation
	// 	$('.datatable-buttons').DataTable({
	// 		"columnDefs":[{
	// 			"targets": 3,
	// 			"type": "num",
	// 			"render": function(data, type, row){
	// 				if(data>=1000 && data<1000000){
	// 					return ((data/1000).toFixed(2))+' K';
	// 				}
	// 				else if (data>=1000000 && data<1000000000) {
	// 					return ((data/1000000).toFixed(2))+' M';
	// 				}else{
	// 					return data;
	// 				}
	// 			}
	// 		}]
	// 	});
	// });

	// Do this when printing, cancel datatable class
	// $('#pdf').click(function(){
	// 	$('table').removeClass('datatable-buttons');
	// 	window.print();
	// });


});
