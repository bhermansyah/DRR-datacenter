jQuery(function($){
	// Loader
	// setTimeout(function(){
	//         $('body').addClass('loaded');
	//         // $('h1').css('color','#222222');
	//     }, 3000);

	$(document).ready(function(){
	    $(window).scroll(function () {
            if ($(this).scrollTop() > 50) {
                $('#back-to-top').fadeIn();
            } else {
                $('#back-to-top').fadeOut();
            }
	    });
        // scroll body to 0px on click
        $('#back-to-top').click(function () {
            $('#back-to-top').tooltip('hide');
            $('body,html').animate({
                scrollTop: 0
            }, 800);
            return false;
        });
        
        $('#back-to-top').tooltip('show');

	});

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

	// Sync control multi tab (view as)
	$('.controls-product-item .nav-tabs li a').click(function (e) {     
	    //get selected href
	    var href = $(this).attr('href');    
	    
	    //set all nav tabs to inactive
	    $('.controls-product-item .nav-tabs li').removeClass('active');
	    
	    //get all nav tabs matching the href and set to active
	    $('.controls-product-item .nav-tabs li a[href="'+href+'"]').closest('li').addClass('active');

	    //active tab
	    $('.search-result-container .tab-pane').removeClass('active');
	    $('.search-result-container .tab-pane'+href).addClass('active');
	})
	// /Sync control multi tab (view as)

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

	// Popover Mercalli
	$(document).ready(function(){
	    $('[data-toggle="popover_mercalli"]').popover({
	          html: true,
	          content: function() {
	          return $("#popover_mercalli_desc").html();
	    }});
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
	    // $(this).parent().parent().prev().html($(this).html() + ' <i class="fa fa-angle-down"></i>');
	    $('.sorting-menu a').parent().parent().prev().html($(this).html() + ' <i class="fa fa-angle-down"></i>');
	})
	// /Dropdown like Select

	// Carousel Partner
	// function(){
	  // setup your carousels as you normally would using JS
	  // or via data attributes according to the documentation
	  // https://getbootstrap.com/javascript/#carousel
	  $('#carousel123').carousel({ interval: 2000 });
	  // $('#carouselABC').carousel({ interval: 3600 });
	// };

	// function(){
	  $('.carousel-showmanymoveone .item').each(function(){
	    var itemToClone = $(this);

	    for (var i=1;i<3;i++) {
	    	itemToClone = itemToClone.next();

	    	// wrap around if at end of item collection
	    	if (!itemToClone.length) {
	    	  itemToClone = $(this).siblings(':first');
	    	}
	    	// grab item, clone, add marker class, add to collection
	    	itemToClone.children(':first-child').clone()
	    	  .addClass("cloneditem-"+(i))
	    	  .appendTo($(this));
	    }
	});
	// };
	// /Carousel Partner

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
	if (window.location.href.match(/\/dashboard\/*/)) {
		// if (Object.keys(jsondata).length > 0) {
		// 	if (window.location.href.match(/\?page=baseline&*/)) {
		// 		var base_lcAll=[];
		// 		var base_lcChild =[];
		// 		var base_lcParent =[];

		// 		base_lcParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['Buildings'],
		// 			jsondata['settlement'],
		// 			jsondata['built_up_pop'],
		// 			jsondata['built_up_area'],
		// 			jsondata['cultivated_pop'],
		// 			jsondata['cultivated_area'],
		// 			jsondata['barren_pop'],
		// 			jsondata['barren_area'],
		// 			jsondata['Population'],
		// 			jsondata['Area']]];

		// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 			base_lcChild[i] =
		// 				[jsondata['lc_child'][i]['na_en'],
		// 				jsondata['lc_child'][i]['total_buildings'],
		// 				jsondata['lc_child'][i]['settlements'],
		// 				jsondata['lc_child'][i]['built_up_pop'],
		// 				jsondata['lc_child'][i]['built_up_area'],
		// 				jsondata['lc_child'][i]['cultivated_pop'],
		// 				jsondata['lc_child'][i]['cultivated_area'],
		// 				jsondata['lc_child'][i]['barren_land_pop'],
		// 				jsondata['lc_child'][i]['barren_land_area'],
		// 				jsondata['lc_child'][i]['Population'],
		// 				jsondata['lc_child'][i]['Area']];
		// 		}
		// 		base_lcAll = (base_lcParent).concat(base_lcChild);

		// 		var hfAll = [];
		// 		var hfParent =[];
		// 		var hfChild =[];

		// 		hfParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['hlt_h1'],
		// 			jsondata['hlt_h2'],
		// 			jsondata['hlt_h3'],
		// 			jsondata['hlt_chc'],
		// 			jsondata['hlt_bhc'],
		// 			jsondata['hlt_shc'],
		// 			jsondata['hlt_others'],
		// 			jsondata['hltfac']]];

		// 		for (var i = 0; i < jsondata['additional_child'].length; i++) {
		// 			hfChild[i] =
		// 				[jsondata['additional_child'][i]['na_en'],
		// 				jsondata['additional_child'][i]['hlt_h1'],
		// 				jsondata['additional_child'][i]['hlt_h2'],
		// 				jsondata['additional_child'][i]['hlt_h3'],
		// 				jsondata['additional_child'][i]['hlt_chc'],
		// 				jsondata['additional_child'][i]['hlt_bhc'],
		// 				jsondata['additional_child'][i]['hlt_shc'],
		// 				jsondata['additional_child'][i]['hlt_others'],
		// 				jsondata['additional_child'][i]['hlt_total']];
		// 		}
		// 		hfAll = (hfParent).concat(hfChild);

		// 		var rnAll = [];
		// 		var rnParent =[];
		// 		var rnChild =[];

		// 		rnParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['road_highway'],
		// 			jsondata['road_primary'],
		// 			jsondata['road_secondary'],
		// 			jsondata['road_tertiary'],
		// 			jsondata['road_residential'],
		// 			jsondata['road_track'],
		// 			jsondata['road_path'],
		// 			jsondata['road_river_crossing'],
		// 			jsondata['road_bridge'],
		// 			jsondata['roadnetwork']]];

		// 		for (var i = 0; i < jsondata['additional_child'].length; i++) {
		// 			rnChild[i] =
		// 				[jsondata['additional_child'][i]['na_en'],
		// 				jsondata['additional_child'][i]['road_highway'],
		// 				jsondata['additional_child'][i]['road_primary'],
		// 				jsondata['additional_child'][i]['road_secondary'],
		// 				jsondata['additional_child'][i]['road_tertiary'],
		// 				jsondata['additional_child'][i]['road_residential'],
		// 				jsondata['additional_child'][i]['road_track'],
		// 				jsondata['additional_child'][i]['road_path'],
		// 				jsondata['additional_child'][i]['road_river_crossing'],
		// 				jsondata['additional_child'][i]['road_bridge'],
		// 				jsondata['additional_child'][i]['road_total']];
		// 		}
		// 		rnAll = (rnParent).concat(rnChild);
		// 	}
		// 	else if (window.location.href.match(/\?page=accessibility&*/)) {

		// 	}
		// 	else if (window.location.href.match(/\?page=floodforecast&*/)) {
		// 		var rgffoverviewParent = [];
		// 		var rgffoverviewChild = [];
		// 		var rgffoverviewAll=[];

		// 		rgffoverviewParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_veryhigh_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_high_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_med_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_low_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['riverflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['riverflood_forecast_veryhigh_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['riverflood_forecast_high_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['riverflood_forecast_med_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['riverflood_forecast_low_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop']]];

		// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 			rgffoverviewChild[i] =
		// 				[jsondata['lc_child'][i]['na_en'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_veryhigh_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_high_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_med_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_low_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['riverflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['riverflood_forecast_veryhigh_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['riverflood_forecast_high_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['riverflood_forecast_med_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['lc_child'][i]['riverflood_forecast_low_pop'],
		// 				jsondata['lc_child'][i]['flashflood_forecast_extreme_pop']];
		// 		}
		// 		rgffoverviewAll = (rgffoverviewParent).concat(rgffoverviewChild);

		// 		var rggfoverviewParent = [];
		// 		var rggfoverviewChild = [];
		// 		var rggfoverviewAll=[];
		// 		rggfoverviewParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_veryhigh_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_high_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_med_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_low_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['gfms_glofas_riverflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['gfms_glofas_riverflood_forecast_veryhigh_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['gfms_glofas_riverflood_forecast_high_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['gfms_glofas_riverflood_forecast_med_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['gfms_glofas_riverflood_forecast_low_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop']]];
		// 		for (var i = 0; i < jsondata['glofas_gfms_child'].length; i++) {
		// 			rggfoverviewChild[i] =
		// 				[jsondata['glofas_gfms_child'][i]['na_en'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_veryhigh_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_high_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_med_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_low_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['riverflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['riverflood_forecast_veryhigh_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['riverflood_forecast_high_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['riverflood_forecast_med_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop'],
		// 				jsondata['glofas_gfms_child'][i]['riverflood_forecast_low_pop'],
		// 				jsondata['glofas_gfms_child'][i]['flashflood_forecast_extreme_pop']];
		// 		}
		// 		rggfoverviewAll = (rggfoverviewParent).concat(rggfoverviewChild);

		// 		var rglfoverviewParent = [];
		// 		var rglfoverviewChild = [];
		// 		var rglfoverviewAll=[];
		// 		rglfoverviewParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_veryhigh_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_high_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_med_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_low_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_riverflood_forecast_extreme_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_riverflood_forecast_veryhigh_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_riverflood_forecast_high_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_riverflood_forecast_med_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_riverflood_forecast_low_pop'],
		// 			jsondata['flashflood_forecast_extreme_pop']]];

		// 		for (var i = 0; i < jsondata['glofas_child'].length; i++) {
		// 			rglfoverviewChild[i] =
		// 			[jsondata['glofas_child'][i]['na_en'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_veryhigh_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_high_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_med_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_low_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['riverflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['riverflood_forecast_veryhigh_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['riverflood_forecast_high_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['riverflood_forecast_med_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop'],
		// 			jsondata['glofas_child'][i]['riverflood_forecast_low_pop'],
		// 			jsondata['glofas_child'][i]['flashflood_forecast_extreme_pop']];
		// 		}
		// 		rglfoverviewAll = (rglfoverviewParent).concat(rglfoverviewChild);
		// 	}
		// 	else if (window.location.href.match(/\?page=floodrisk&*/)) {
		// 		var fRiskParent = [];
		// 		var fRiskChild = [];
		// 		var fRiskAll=[];
		// 		fRiskParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['settlement_at_floodrisk'],
		// 			jsondata['settlement_at_floodrisk'],
		// 			jsondata['built_up_pop_risk'],
		// 			jsondata['built_up_area_risk'],
		// 			// jsondata['settlement_at_floodrisk'],
		// 			jsondata['cultivated_pop_risk'],
		// 			jsondata['cultivated_area_risk'],
		// 			// jsondata['settlement_at_floodrisk'],
		// 			jsondata['barren_pop_risk'],
		// 			jsondata['barren_area_risk'],
		// 			// jsondata['settlement_at_floodrisk'],
		// 			jsondata['total_risk_population'],
		// 			jsondata['total_risk_area'],
		// 			// jsondata['settlement_at_floodrisk']
		// 			]];
		// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 			fRiskChild[i] =
		// 			[jsondata['lc_child'][i]['na_en'],
		// 			jsondata['lc_child'][i]['total_risk_buildings'],
		// 			jsondata['lc_child'][i]['settlements_at_risk'],
		// 			jsondata['lc_child'][i]['built_up_pop_risk'],
		// 			jsondata['lc_child'][i]['built_up_area_risk'],
		// 			// jsondata['lc_child'][i]['settlements_at_risk'],
		// 			jsondata['lc_child'][i]['cultivated_pop_risk'],
		// 			jsondata['lc_child'][i]['cultivated_area_risk'],
		// 			// jsondata['lc_child'][i]['settlements_at_risk'],
		// 			jsondata['lc_child'][i]['barren_pop_risk'],
		// 			jsondata['lc_child'][i]['barren_area_risk'],
		// 			// jsondata['lc_child'][i]['settlements_at_risk'],
		// 			jsondata['lc_child'][i]['total_risk_population'],
		// 			jsondata['lc_child'][i]['total_risk_area'],
		// 			// jsondata['lc_child'][i]['total_risk_buildings']
		// 			];
		// 		}
		// 		fRiskAll = (fRiskParent).concat(fRiskChild);
		// 	}
		// 	else if (window.location.href.match(/\?page=avalcheforecast&*/)) {
		// 		var aForecastParent = [];
		// 		var aForecastChild = [];
		// 		var aForecastAll=[];
		// 		aForecastParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['ava_forecast_high_pop'],
		// 			jsondata['ava_forecast_high_pop'],
		// 			jsondata['ava_forecast_med_pop'],
		// 			jsondata['ava_forecast_high_pop'],
		// 			jsondata['ava_forecast_low_pop'],
		// 			jsondata['ava_forecast_high_pop'],
		// 			jsondata['total_ava_forecast_pop'],
		// 			jsondata['ava_forecast_high_pop']]];

		// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 			aForecastChild[i] =
		// 			[jsondata['lc_child'][i]['na_en'],
		// 			jsondata['lc_child'][i]['ava_forecast_high_pop'],
		// 			jsondata['lc_child'][i]['high_ava_buildings'],
		// 			jsondata['lc_child'][i]['ava_forecast_med_pop'],
		// 			jsondata['lc_child'][i]['med_ava_buildings'],
		// 			jsondata['lc_child'][i]['ava_forecast_low_pop'],
		// 			jsondata['lc_child'][i]['ava_forecast_high_pop'],
		// 			jsondata['lc_child'][i]['total_ava_forecast_pop'],
		// 			jsondata['lc_child'][i]['total_ava_buildings']];
		// 		}
		// 		aForecastAll = (aForecastParent).concat(aForecastChild);
		// 	}
		// 	else if (window.location.href.match(/\?page=avalancherisk&*/)) {
		// 		var aRiskParent = [];
		// 		var aRiskChild = [];
		// 		var aRiskAll=[];
		// 		aRiskParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['high_ava_population'],
		// 			jsondata['high_ava_population'],
		// 			jsondata['high_ava_area'],
		// 			jsondata['med_ava_population'],
		// 			jsondata['high_ava_population'],
		// 			jsondata['med_ava_area'],
		// 			jsondata['total_ava_population'],
		// 			jsondata['high_ava_population'],
		// 			jsondata['total_ava_area']]];

		// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 			aRiskChild[i] =
		// 				[jsondata['lc_child'][i]['na_en'],
		// 				jsondata['lc_child'][i]['high_ava_population'],
		// 				jsondata['lc_child'][i]['high_ava_buildings'],
		// 				jsondata['lc_child'][i]['high_ava_area'],
		// 				jsondata['lc_child'][i]['med_ava_population'],
		// 				jsondata['lc_child'][i]['med_ava_buildings'],
		// 				jsondata['lc_child'][i]['med_ava_area'],
		// 				jsondata['lc_child'][i]['total_ava_population'],
		// 				jsondata['lc_child'][i]['total_ava_buildings'],
		// 				jsondata['lc_child'][i]['total_ava_area']];
		// 		}
		// 		aRiskAll = (aRiskParent).concat(aRiskChild);
		// 	}
		// 	else if (window.location.href.match(/\?page=earthquake&*/)) {
		// 		var erthqkParent = [];
		// 		var erthqkChild = [];
		// 		var erthqkAll=[];
		// 		erthqkParent =
		// 			[[jsondata['parent_label'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_weak'],
		// 			jsondata['pop_shake_light'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_light'],
		// 			jsondata['pop_shake_moderate'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_moderate'],
		// 			jsondata['pop_shake_strong'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_strong'],
		// 			jsondata['pop_shake_verystrong'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_verystrong'],
		// 			jsondata['pop_shake_severe'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_severe'],
		// 			jsondata['pop_shake_violent'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_violent'],
		// 			jsondata['pop_shake_extreme'],
		// 			jsondata['pop_shake_weak'],
		// 			jsondata['settlement_shake_extreme']]];

		// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 			erthqkChild[i] =
		// 				[jsondata['lc_child'][i]['na_en'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_weak'],
		// 				jsondata['lc_child'][i]['pop_shake_light'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_light'],
		// 				jsondata['lc_child'][i]['pop_shake_moderate'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_moderate'],
		// 				jsondata['lc_child'][i]['pop_shake_strong'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_strong'],
		// 				jsondata['lc_child'][i]['pop_shake_verystrong'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_verystrong'],
		// 				jsondata['lc_child'][i]['pop_shake_severe'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_severe'],
		// 				jsondata['lc_child'][i]['pop_shake_violent'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_violent'],
		// 				jsondata['lc_child'][i]['pop_shake_extreme'],
		// 				jsondata['lc_child'][i]['pop_shake_weak'],
		// 				jsondata['lc_child'][i]['settlement_shake_extreme']];
		// 		}
		// 		erthqkAll = (erthqkParent).concat(erthqkChild);
		// 	}
		// 	else if (window.location.href.match(/\?page=security&*/)) {
		// 		/*var incidentParent = [];
		// 		var incidentAll=[];
		// 		var k = 0;
		// 		var incidentCount = [];
		// 		var incidentViolent = [];
		// 		var incidentInjured = [];
		// 		var incidentDead = [];

		// 		for (var i = 0; i < jsondata['incident_type_group'].length; i++) {
		// 			incidentParent[i] =
		// 			[jsondata['incident_type_group'][i]['main_type'],
		// 			jsondata['incident_type_group'][i]['count'],
		// 			jsondata['incident_type_group'][i]['violent'],
		// 			jsondata['incident_type_group'][i]['injured'],
		// 			jsondata['incident_type_group'][i]['dead']];

		// 			incidentCount[i] = jsondata['incident_type_group'][i]['count'];
		// 			incidentViolent[i] = jsondata['incident_type_group'][i]['violent'];
		// 			incidentInjured[i] = jsondata['incident_type_group'][i]['injured'];
		// 			incidentDead[i] = jsondata['incident_type_group'][i]['dead'];

		// 			incidentAll[k] =
		// 			[jsondata['incident_type_group'][i]['main_type'],
		// 			jsondata['incident_type_group'][i]['count'],
		// 			jsondata['incident_type_group'][i]['violent'],
		// 			jsondata['incident_type_group'][i]['injured'],
		// 			jsondata['incident_type_group'][i]['dead']];
		// 			k++;

		// 			if (jsondata['incident_type_group'][i]['child'].length > 1) {
		// 				for (var j = 0; j < jsondata['incident_type_group'][i]['child'].length; j++) {
		// 					incidentAll[k] =
		// 					[jsondata['incident_type_group'][i]['child'][j]['type'],
		// 					jsondata['incident_type_group'][i]['child'][j]['count'],
		// 					jsondata['incident_type_group'][i]['child'][j]['violent'],
		// 					jsondata['incident_type_group'][i]['child'][j]['injured'],
		// 					jsondata['incident_type_group'][i]['child'][j]['dead']
		// 					];
		// 					k++;
		// 				}
		// 			}
		// 		}

		// 		var targetParent = [];
		// 		var targetAll=[];
		// 		var k = 0;
		// 		var targetCount = [];
		// 		var targetViolent = [];
		// 		var targetInjured = [];
		// 		var targetDead = [];

		// 		for (var i = 0; i < jsondata['incident_target_group'].length; i++) {
		// 			targetParent[i] =
		// 			[jsondata['incident_target_group'][i]['main_target'],
		// 			jsondata['incident_target_group'][i]['count'],
		// 			jsondata['incident_target_group'][i]['violent'],
		// 			jsondata['incident_target_group'][i]['injured'],
		// 			jsondata['incident_target_group'][i]['dead']];

		// 			targetCount[i] = jsondata['incident_target_group'][i]['count'];
		// 			targetViolent[i] = jsondata['incident_target_group'][i]['violent'];
		// 			targetInjured[i] = jsondata['incident_target_group'][i]['injured'];
		// 			targetDead[i] = jsondata['incident_target_group'][i]['dead'];

		// 			targetAll[k] =
		// 			[jsondata['incident_target_group'][i]['main_target'],
		// 			jsondata['incident_target_group'][i]['count'],
		// 			jsondata['incident_target_group'][i]['violent'],
		// 			jsondata['incident_target_group'][i]['injured'],
		// 			jsondata['incident_target_group'][i]['dead']];
		// 			k++;

		// 			if (jsondata['incident_target_group'][i]['child'].length > 1) {
		// 				for (var j = 0; j < jsondata['incident_target_group'][i]['child'].length; j++) {
		// 					targetAll[k] =
		// 					[jsondata['incident_target_group'][i]['child'][j]['target'],
		// 					jsondata['incident_target_group'][i]['child'][j]['count'],
		// 					jsondata['incident_target_group'][i]['child'][j]['violent'],
		// 					jsondata['incident_target_group'][i]['child'][j]['injured'],
		// 					jsondata['incident_target_group'][i]['child'][j]['dead']
		// 					];
		// 					k++;
		// 				}
		// 			}
		// 		}

		// 		var incident_overviewParent = [];
		// 		var incident_overviewChild = [];
		// 		var incident_overviewAll=[];
		// 		incident_overviewParent = [[jsondata['parent_label'], jsondata['total_incident'], jsondata['total_violent'], jsondata['total_injured'], jsondata['total_dead']]];
		// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 			incident_overviewChild[i] = [jsondata['lc_child'][i]['na_en'], jsondata['lc_child'][i]['total_incident'], jsondata['lc_child'][i]['total_violent'], jsondata['lc_child'][i]['total_injured'], jsondata['lc_child'][i]['total_dead']];
		// 		}
		// 		incident_overviewAll = (incident_overviewParent).concat(incident_overviewChild);

		// 		var incident_list = [];

		// 		for (var i = 0; i < jsondata['incident_list_100'].length; i++) {
		// 			incident_list[i] =
		// 			[jsondata['incident_list_100'][i]['incident_date'],
		// 			jsondata['incident_list_100'][i]['description']];
		// 		}*/
		// 	}

		// 	// switch(window.location.search){
		// 	// 	case "?page=baseline":
		// 	// 		lcChild = jsondata['jsondata']['lc_child'];
		// 	// 		lcParent = jsondata['jsondata']['lc_afg'];
		// 	// 		hfParent = jsondata['jsondata']['hf_afg'];
		// 	// 		rnParent = jsondata['jsondata']['rn_afg'];

		// 	// 		lcAll = (lcParent).concat(lcChild);
		// 	// 		hfAll = (hfParent).concat(jsondata['jsondata']['hf_child']);
		// 	// 		rnAll = (rnParent).concat(jsondata['jsondata']['rn_child']);
		// 	// 	break;

		// 	// 	case "?page=accessibility":

		// 	// 	break;

		// 	// 	case "?page=floodforecast":

		// 	// 	break;

		// 	// 	case (/\?page=floodrisk&*/):
		// 	// 		// fRiskParent.push(jsondata['parent_label']);
		// 	// 		// fRiskParent.push(jsondata['settlement_at_floodrisk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		// fRiskParent.push(jsondata['built_up_pop_risk']);
		// 	// 		fRiskParent = [[jsondata['parent_label'], jsondata['settlement_at_floodrisk'], jsondata['built_up_pop_risk'], jsondata['built_up_area_risk'], jsondata['settlement_at_floodrisk'], jsondata['cultivated_pop_risk'], jsondata['cultivated_area_risk'], jsondata['settlement_at_floodrisk'], jsondata['barren_pop_risk'], jsondata['barren_area_risk'], jsondata['settlement_at_floodrisk'], jsondata['total_risk_population'], jsondata['total_risk_area'], jsondata['settlement_at_floodrisk']]];
		// 	// 		for (var i = 0; i < jsondata['lc_child'].length; i++) {
		// 	// 			fRiskChild[i] = [jsondata['lc_child'][i]['na_en'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['built_up_pop_risk'], jsondata['lc_child'][i]['built_up_area_risk'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['cultivated_pop_risk'], jsondata['lc_child'][i]['cultivated_area_risk'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['barren_pop_risk'], jsondata['lc_child'][i]['barren_area_risk'], jsondata['lc_child'][i]['settlements_at_risk'], jsondata['lc_child'][i]['total_risk_population'], jsondata['lc_child'][i]['total_risk_area'], jsondata['lc_child'][i]['total_risk_buildings']];
		// 	// 		}
		// 	// 		fRiskAll = (fRiskParent).concat(fRiskChild);
		// 	// 	break;

		// 	// 	case "?page=avalcheforecast":

		// 	// 	break;

		// 	// 	case "?page=avalancherisk":

		// 	// 	break;

		// 	// 	case "?page=earthquake":

		// 	// 	break;

		// 	// 	case "?page=security":

		// 	// 	break;
		// 	// }

		// }

		function init_echarts2(tabSelect) {

			if( typeof (echarts) === 'undefined'){
				return;
			}

			var humTooltipPie = function(params){
			    // console.log(params)
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
				// console.log(params)

				var v= params.data.value;
				var p= params.percent;
				var n= params.data.name;
				if(v>=1000 && v<1000000){
					return '\n'+((v/1000).toFixed(2))+' K'+'\n(' + p+'%)'
				}
				else if (v>=1000000 && v<1000000000) {
					return '\n'+((v/1000000).toFixed(2))+' M'+'\n(' + p+'%)'
				}
				else{
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
			    // console.log('params', params)
			    // console.log(params);
			    p = params;

			    if (!Array.isArray(params)) {
			    	params = [params];
			    }

			    var s = '';
			    params.forEach(function(item, index) {
			    	// console.log('item', item);
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
			    // console.log('s', s);
			    return(params[0].name+'</br>'+ s);

			};

			var humTooltipRadar = function(params){
			    // console.log(params)

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

			    // console.log('s', s);
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
			    // console.log(params)
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

			var render = function(){
				var dir_read = document.documentElement.dir;
				
				if (dir_read=='rtl') {
					return {renderer: 'canvas'};
				}else {
					return {renderer: 'canvas'};
				};
			}

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
						  	color: '#ddd',
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
						  	color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)'] //background for bar chart
						}
					},
					splitLine: {
						lineStyle: {
						  	color: ['#eee']
						}
					}
				},

				logAxis: {
					axisLine: {
						lineStyle: {
						  	color: '#252525'
						}
					},
					splitArea: {
						show: true,
						areaStyle: {
						  	color: ['rgba(250,250,250,0.1)', 'rgba(200,200,200,0.1)'] //background for bar chart
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
		  			labelLine:{
		  				show: true
		  			}
		  		},
		  		emphasis:{

		  		}
		  	};

		  	var colorDonutDefault = ['#b92527', '#ccc'];

		  	var colorFloodLikelihood = 
		  		function (value, params) {
        	    	// console.log(value);
        	    	// console.log(index);
        	    	// console.log(params);
        	    	if (value==fforecast_cat[0]) {
        	    		return '#00ACC1'
        	    	}else if (value==fforecast_cat[1]) {
        	    		return '#71cc24'
        	    	}else if (value==fforecast_cat[2]) {
        	    		return '#ffd300'
        	    	}else if (value==fforecast_cat[3]) {
        	    		return '#FB8C00'
        	    	}else if (value==fforecast_cat[4]) {
        	    		return '#e53935'
        	    	}   
        	    }

        	var colorFloodRisk = ['#abd9e9', '#74add1', '#4575b4'];

		  	var colorMercalli = [
		  			// /*'#eeeeee', '#bfccff',*/ '#9999ff', '#88ffff', '#7df894', '#ffff00',
		  			// '#ffdd00', '#ff9100', '#ff0000', '#dd0000', '#880000', '#440000'

		  			'#d4e6f1', '#c2fcf7', '#6dffb6', '#ffff5c',
		  			 '#ffe74c', '#ffc600', '#ff5751', '#e84c3d'
		  		];

		  	var colorTimes =
		  		function(params){
		  			var colorList=[
		  				'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', /*'#fffb46',*/ '#fff327', /*'#fffc79', */ /*'#ffdd72',*/
		  				/*'#ffd341',*/ '#ffc43b', '#ff9c00', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
		  			];
		  			return colorList[params.dataIndex]
		  		}

		  	var colorLandslide = [ '#43A047', '#FDD835' , '#FB8C00', '#e84c3d', '#ccc' ];

		  	var colorLandslideBar =
		  		function(params){
		  			return colorLandslide[params.dataIndex]
		  		}

		  	var checkIndicator2 = tc1;

		  	var checkIndicator1 = ic1;

		  	var sizeBubble = 
		  		function (val) {
		            return Math.log(val)*3;
		        }

			var delay = 
				function (idx) {
		            return idx * 5;
		        }

	  		// case "accessibility":
	  			// accessibility tab
	  			//echart Donut

	  			if ($('#echart_donut_gsm_pop').length ){

	  			  	var echartDonutGSMPop = echarts.init(document.getElementById('echart_donut_gsm_pop'), theme, render());

	  			  	echartDonutGSMPop.setOption({
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
	  			  			data: [
	  			  				{
	  			  					value: gsm_pop,
	  			  					name: gsm_legend[0],
	  			  					itemStyle: colorReversed
	  			  				}, 
	  			  				{
	  			  					value: pop - gsm_pop,
	  			  					name: gsm_legend[1],
	  			  					itemStyle: pieNull
	  			  				}
	  			  			]
	  			  		}]
	  			  	});

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutGSMPop.resize();
	  			  	});

	  			}

	  			// echart Donut 2

	  			if ($('#echart_donut_gsm_area').length ){

	  			  	var echartDonutGSMArea = echarts.init(document.getElementById('echart_donut_gsm_area'), theme, render());

	  			  	echartDonutGSMArea.setOption({
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
	  			  			data: [
	  			  				{
	  			  					value: gsm_area,
	  			  					name: gsm_legend[0],
	  			  					itemStyle: colorReversed
	  			  				}, 
	  			  				{
	  			  					value: area - gsm_area,
	  			  					name: gsm_legend[1],
	  			  					itemStyle: pieNull
	  			  				}
	  			  			]
	  			  		}]
	  			  	});

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutGSMArea.resize();
	  			  	});

	  			}

	  			// echart Donut 3

	  			if ($('#echart_donut_gsm_building').length ){

					var echartDonutGSMBuild = echarts.init(document.getElementById('echart_donut_gsm_building'), theme, render());

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
								// magicType: {
								// 	show: true,
								// 	type: ['pie', 'funnel'],
								// 	option: {
								// 		funnel: {
								// 			x: '25%',
								// 			width: '50%',
								// 			funnelAlign: 'center',
								// 			max: 1548
								// 		}
								// 	}
								// },
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
							data: [
								{
									value: gsm_bld,
									name: gsm_legend[0],
									itemStyle: colorReversed
								}, 
								{
									value: build - gsm_bld,
									name: gsm_legend[1],
									itemStyle: pieNull
								}
							]
						}]
					});

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutGSMBuild.resize();
	  			  	});

	  			}

	  			//echart Bar Horizontal 4

				if ($('#echart_bar_horizontal_nAirport').length ){

					var echartBarAirport = echarts.init(document.getElementById('echart_bar_horizontal_nAirport'), theme, render());

					echartBarAirport.setOption({
						tooltip: {
							trigger: 'item',
							axisPointer:{
								type: 'line',
							},
							formatter: humTooltipBar
						},
						legend: {
							x: 'left',
							data: time_legend
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
							data: time_legend
						}],
						series: [{
							name: 'Airport',
							type: 'bar',
							itemStyle:{
								normal:{
									color: colorTimes
								}
							},
							label:{
								normal:{
									formatter: humanizeBar,
									position: 'right',
									textBorderColor: 'auto',
									// textBorderWidth: 2,
									// textShadowBlur: 3,
									// textShadowColor: 'auto',
									color: '#33333352',
									show: true
								}
							},
							data: near_airport
						}]
					});

				  	window.addEventListener("resize", function(){
				  		echartBarAirport.resize();
				  	});

				  	// window.onresize = function(){
				  	// 	echartBar.resize();
				  	// }
				}

				//echart Bar Horizontal 5

				if ($('#echart_bar_horizontal_h1').length ){

				  	var echartBarH1 = echarts.init(document.getElementById('echart_bar_horizontal_h1'), theme, render());

				  	echartBarH1.setOption({
				  		tooltip: {
				  			trigger: 'item',
				  			axisPointer:{
				  				type: 'line',
				  			},
				  			formatter: humTooltipBar
				  		},
				  		legend: {
				  			x: 'left',
				  			data: time_legend
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
				  			data: time_legend
				  		}],
				  		series: [{
				  			name: 'Health Facilities Tier 1',
				  			type: 'bar',
				  			itemStyle:{
				  				normal:{
				  					color: colorTimes
				  				}
				  			},
				  			label:{
				  				normal:{
				  					formatter: humanizeBar,
				  					position: 'right',
				  					textBorderColor: 'auto',
				  					color: '#33333352',
				  					show: true
				  				}
				  			},
				  			data: near_h1
				  		}]
				  	});

				  	window.addEventListener("resize", function(){
				  		echartBarH1.resize();
				  	});

				}

				//echart Bar Horizontal 6

				if ($('#echart_bar_horizontal_h2').length ){

				  	var echartBarH2 = echarts.init(document.getElementById('echart_bar_horizontal_h2'), theme, render());

				  	echartBarH2.setOption({
				  		tooltip: {
				  			trigger: 'item',
				  			axisPointer:{
				  				type: 'line',
				  			},
				  			formatter: humTooltipBar
				  		},
				  		legend: {
				  			x: 'left',
				  			data: time_legend
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
				  			data: time_legend
				  		}],
				  		series: [{
				  			name: 'Health Facilities Tier 2',
				  			type: 'bar',
				  			itemStyle:{
				  				normal:{
				  					color: colorTimes
				  				}
				  			},
				  			label:{
				  				normal:{
				  					formatter: humanizeBar,
				  					position: 'right',
				  					textBorderColor: 'auto',
				  					color: '#33333352',
				  					show: true
				  				}
				  			},
				  			data: near_h2
				  		}]
				  	});

				  	window.addEventListener("resize", function(){
				  		echartBarH2.resize();
				  	});

				}

				//echart Bar Horizontal 7

				if ($('#echart_bar_horizontal_h3').length ){

				  	var echartBarH3 = echarts.init(document.getElementById('echart_bar_horizontal_h3'), theme, render());

				  	echartBarH3.setOption({
				  		tooltip: {
				  			trigger: 'item',
				  			axisPointer:{
				  				type: 'line',
				  			},
				  			formatter: humTooltipBar
				  		},
				  		legend: {
				  			x: 'left',
				  			data: time_legend
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
				  			data: time_legend
				  		}],
				  		series: [{
				  			name: 'Health Facilities Tier 3',
				  			type: 'bar',
				  			itemStyle:{
				  				normal:{
				  					color: colorTimes
				  				}
				  			},
				  			label:{
				  				normal:{
				  					formatter: humanizeBar,
				  					position: 'right',
				  					textBorderColor: 'auto',
				  					color: '#33333352',
				  					show: true
				  				}
				  			},
				  			data: near_h3
				  		}]
				  	});

				  	window.addEventListener("resize", function(){
				  		echartBarH3.resize();
				  	});

				}

				//echart Bar Horizontal 8

				if ($('#echart_bar_horizontal_hAll').length ){

				  	var echartBarHAll = echarts.init(document.getElementById('echart_bar_horizontal_hAll'), theme, render());

				  	echartBarHAll.setOption({
				  		tooltip: {
				  			trigger: 'item',
				  			axisPointer:{
				  				type: 'line',
				  			},
				  			formatter: humTooltipBar
				  		},
				  		legend: {
				  			x: 'left',
				  			data: time_legend
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
				  			data: time_legend
				  		}],
				  		series: [{
				  			name: 'Health Facilities Tier All',
				  			type: 'bar',
				  			itemStyle:{
				  				normal:{
				  					color: colorTimes
				  				}
				  			},
				  			label:{
				  				normal:{
				  					formatter: humanizeBar,
				  					position: 'right',
				  					textBorderColor: 'auto',
				  					color: '#33333352',
				  					show: true
				  				}
				  			},
				  			data: near_h_all
				  		}]
				  	});

				  	window.addEventListener("resize", function(){
				  		echartBarHAll.resize();
				  	});

				}

				//echart Bar Horizontal 9

				if ($('#echart_bar_horizontal_itsProv').length ){

				  	var echartBarItsProv = echarts.init(document.getElementById('echart_bar_horizontal_itsProv'), theme, render());

				  	echartBarItsProv.setOption({
				  		tooltip: {
				  			trigger: 'item',
				  			axisPointer:{
				  				type: 'line',
				  			},
				  			formatter: humTooltipBar
				  		},
				  		legend: {
				  			x: 'left',
				  			data: time_legend
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
				  			data: time_legend
				  		}],
				  		series: [{
				  			name: 'Its Provincial Capital',
				  			type: 'bar',
				  			itemStyle:{
				  				normal:{
				  					color: colorTimes
				  				}
				  			},
				  			label:{
				  				normal:{
				  					formatter: humanizeBar,
				  					position: 'right',
				  					textBorderColor: 'auto',
				  					color: '#33333352',
				  					show: true
				  				}
				  			},
				  			data: near_it_prov_cap
				  		}]
				  	});

				  	window.addEventListener("resize", function(){
				  		echartBarItsProv.resize();
				  	});

				}

				//echart Bar Horizontal 10

				if ($('#echart_bar_horizontal_nProv').length ){

				  	var echartBarProv = echarts.init(document.getElementById('echart_bar_horizontal_nProv'), theme, render());

				  	echartBarProv.setOption({
				  		tooltip: {
				  			trigger: 'item',
				  			axisPointer:{
				  				type: 'line',
				  			},
				  			formatter: humTooltipBar
				  		},
				  		legend: {
				  			x: 'left',
				  			data: time_legend
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
				  			data: time_legend
				  		}],
				  		series: [{
				  			name: 'Nearest Provincial Capital',
				  			type: 'bar',
				  			itemStyle:{
				  				normal:{
				  					color: colorTimes
				  				}
				  			},
				  			label:{
				  				normal:{
				  					formatter: humanizeBar,
				  					position: 'right',
				  					textBorderColor: 'auto',
				  					color: '#33333352',
				  					show: true
				  				}
				  			},
				  			data: near_prov_cap
				  		}]
				  	});

				  	window.addEventListener("resize", function(){
				  		echartBarProv.resize();
				  	});

				}

				//echart Bar Horizontal 11

				if ($('#echart_bar_horizontal_nDist').length ){

				  	var echartBarDist = echarts.init(document.getElementById('echart_bar_horizontal_nDist'), theme, render());

				  	echartBarDist.setOption({
				  		tooltip: {
				  			trigger: 'item',
				  			axisPointer:{
				  				type: 'line',
				  			},
				  			formatter: humTooltipBar
				  		},
				  		legend: {
				  			x: 'left',
				  			data: time_legend
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
				  			data: time_legend
				  		}],
				  		series: [{
				  			name: 'Near District',
				  			type: 'bar',
				  			itemStyle:{
				  				normal:{
				  					color: colorTimes
				  				}
				  			},
				  			label:{
				  				normal:{
				  					formatter: humanizeBar,
				  					position: 'right',
				  					textBorderColor: 'auto',
				  					color: '#33333352',
				  					show: true
				  				}
				  			},
				  			data: near_dist_cap
				  		}]
				  	});

				  	window.addEventListener("resize", function(){
				  		echartBarDist.resize();
				  	});

				}


	  		// case "fforecast":
	  			// fforecast tab
	  			// echart Bar Stack

	  			if ($('#echart_bar_stack_fforecast').length ){

	  				// console.log('init_echarts_bar_stack');

	  				var echartBarFforecast = echarts.init(document.getElementById('echart_bar_stack_fforecast'), theme, render());

	  				echartBarFforecast.setOption({
	  					tooltip : {
	  					    trigger: 'axis',
	  					    axisPointer : {            
	  					        type : 'line'        
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
					    color: colorFloodRisk,
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
								    color: colorFloodLikelihood
								}
							}
	  					}],
	  					yAxis: [{
							type: 'value',
							name: 'Population',
							scale: true,
							axisLabel:{
								// rotate: 30,
								textStyle: {
									color: '#333',
									fontSize: '10'
								},
								formatter: humanizeFormatter
							}
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	// color: colorFloodRisk,
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: fforecast_low_val
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: fforecast_med_val
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: fforecast_hi_val
	  					}]
	  				});

  				  	window.addEventListener("resize", function(){
  				  		echartBarFforecast.resize();
  				  	});

	  			}

	  			// echart Bar Stack 2

	  			if ($('#echart_bar_stack_ggforecast').length ){

	  				// console.log('init_echarts_bar_stack_2');

	  				var echartBarGGforecast = echarts.init(document.getElementById('echart_bar_stack_ggforecast'), theme, render());

	  				echartBarGGforecast.setOption({
	  					tooltip : {
	  					    trigger: 'axis',
	  					    axisPointer : {            
	  					        type : 'line'        
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
					    color: colorFloodRisk,
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
								    color: colorFloodLikelihood
								}
							}
	  					}],
	  					yAxis: [{
							type: 'value',
							name: 'Population',
							scale: true,
							axisLabel:{
								// rotate: 30,
								textStyle: {
									color: '#333',
									fontSize: '10'
								},
								formatter: humanizeFormatter
							}
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	// color: colorFloodRisk,
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: ggforecast_low_val
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: ggforecast_med_val
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20, //galau. kalo pake min height ntar ga sesuai sm log nya hasilnya
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: ggforecast_hi_val
	  					}]
	  				});

  				  	window.addEventListener("resize", function(){
  				  		echartBarGGforecast.resize();
  				  	});

  				  	$('.navbar-forecast a[href="#ggMenu"]').on('shown.bs.tab', function(){
  				  		echartBarGGforecast.resize();
  				  	});

	  			}

	  			// echart Bar Stack 3

	  			if ($('#echart_bar_stack_glforecast').length ){

	  				// console.log('init_echarts_bar_stack_3');

	  				var echartBarGLforecast = echarts.init(document.getElementById('echart_bar_stack_glforecast'), theme);

	  				echartBarGLforecast.setOption({
	  					tooltip : {
	  					    trigger: 'axis',
	  					    axisPointer : {            
	  					        type : 'line'        
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
					    color: colorFloodRisk,
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
								    color: colorFloodLikelihood
								}
							}
	  					}],
	  					yAxis: [{
							type: 'value',
							name: 'Population',
							scale: true,
							axisLabel:{
								// rotate: 30,
								textStyle: {
									color: '#333',
									fontSize: '10'
								},
								formatter: humanizeFormatter
							}
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	// color: colorFloodRisk,
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: glforecast_low_val
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: glforecast_med_val
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20, //galau. kalo pake min height ntar ga sesuai sm log nya hasilnya
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: glforecast_hi_val
	  					}]
	  				});

  				  	window.addEventListener("resize", function(){
  				  		echartBarGLforecast.resize();
  				  	});

	  				$('.navbar-forecast a[href="#glMenu"]').on('shown.bs.tab', function(){
	  					echartBarGLforecast.resize();
	  				});

	  			}

	  			// echart Bar Stack 4

	  			if ($('#echart_bar_stack_gfforecast').length ){

	  				var echartBarGFforecast = echarts.init(document.getElementById('echart_bar_stack_gfforecast'), theme);

	  				echartBarGFforecast.setOption({
	  					tooltip : {
	  					    trigger: 'axis',
	  					    axisPointer : {            
	  					        type : 'line'        
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
					    color: colorFloodRisk,
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
								    color: colorFloodLikelihood
								}
							}
	  					}],
	  					yAxis: [{
							type: 'value',
							name: 'Population',
							scale: true,
							axisLabel:{
								// rotate: 30,
								textStyle: {
									color: '#333',
									fontSize: '10'
								},
								formatter: humanizeFormatter
							}
	  					}],
	  					series: [{
	  					  name: fforecast_legend[0],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	// color: colorFloodRisk,
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar,
	  					  		}
	  					  	}
	  					  },
	  					  data: gfforecast_low_val
	  					}, {
	  					  name: fforecast_legend[1],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20,
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: gfforecast_med_val
	  					},{
	  					  name: fforecast_legend[2],
	  					  type: 'bar',
	  					  stack: 'flash',
	  					  // barMinHeight: 20, //galau. kalo pake min height ntar ga sesuai sm log nya hasilnya
	  					  itemStyle:{
	  					  	normal:{
	  					  		label:{
	  					  			// show:true,
	  					  			position: 'inside',
	  					  			formatter: humanizeBar
	  					  		}
	  					  	}
	  					  },
	  					  data: gfforecast_hi_val
	  					}]
	  				});

  				  	window.addEventListener("resize", function(){
  				  		echartBarGFforecast.resize();
  				  	});

  				  	$('.navbar-forecast a[href="#gfMenu"]').on('shown.bs.tab', function(){
  				  		echartBarGFforecast.resize();
  				  	});

	  			}
	  		// break;

	  		// case "frisk":
	  			// frisk tab
	  			// echart Donut 3

	  			if ($('#echart_donut_frisk_pop').length ){

		  			var echartDonutFriskPop = echarts.init(document.getElementById('echart_donut_frisk_pop'), theme, render());

		  			echartDonutFriskPop.setOption({
		  				tooltip: {
							trigger: 'item',
							formatter: humTooltipPie 
		  				},
		  				legend: {
							x: 'left',
							y: 'top',
							orient: 'vertical',
							data: frisk_cat
		  				},
		  				toolbox: {
		  					show: true,
		  					feature: {
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
								value: frisk_low_pop,
								name: frisk_cat[0]
							}, {
								value: frisk_med_pop,
								name: frisk_cat[1]
							}, {
								value: frisk_hi_pop,
								name: frisk_cat[2]
							}, {
								value: pop - tot_risk_pop,
								name: frisk_cat[3],
								itemStyle: pieNull
							}]
		  				}]
		  			});

	  			  	window.onresize = function(){
	  			  		echartDonutFriskPop.resize();
	  			  	}

	  			}

	  			// echart Donut

	  			if ($('#echart_donut_frisk_build').length ){

	  			  	var echartDonutFRiskBuild = echarts.init(document.getElementById('echart_donut_frisk_build'), theme, render());

	  	  			echartDonutFRiskBuild.setOption({
	  	  				tooltip: {
	  						trigger: 'item',
	  						formatter: humTooltipPie 
	  	  				},
	  	  				legend: {
	  						x: 'left',
	  						y: 'top',
	  						orient: 'vertical',
	  						data: frisk_cat
	  	  				},
	  	  				toolbox: {
	  	  					show: true,
	  	  					feature: {
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
	  							value: frisk_low_build,
	  							name: frisk_cat[0]
	  						}, {
	  							value: frisk_med_build,
	  							name: frisk_cat[1]
	  						}, {
	  							value: frisk_hi_build,
	  							name: frisk_cat[2]
	  						}, {
	  							value: build - tot_risk_build,
	  							name: frisk_cat[3],
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

	  			  	var echartDonutFRiskArea = echarts.init(document.getElementById('echart_donut_frisk_area'), theme, render());

	  	  			echartDonutFRiskArea.setOption({
	  	  				tooltip: {
	  						trigger: 'item',
	  						formatter: humTooltipPie 
	  	  				},
	  	  				legend: {
	  						x: 'left',
	  						y: 'top',
	  						orient: 'vertical',
	  						data: frisk_cat
	  	  				},
	  	  				toolbox: {
	  	  					show: true,
	  	  					feature: {
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
	  							value: frisk_low_area,
	  							name: frisk_cat[0]
	  						}, {
	  							value: frisk_med_area,
	  							name: frisk_cat[1]
	  						}, {
	  							value: frisk_hi_area,
	  							name: frisk_cat[2]
	  						}, {
	  							value: area - tot_risk_area,
	  							name: frisk_cat[3],
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

	  			if ($('#echart_donut_ava_pop_prediction').length ){

	  			  	var echartDonutAvaPopPredict = echarts.init(document.getElementById('echart_donut_ava_pop_prediction'), theme, render());

					echartDonutAvaPopPredict.setOption({
						tooltip: {
	  						trigger: 'item',
	  						formatter: humTooltipPie 
	  	  				},
	  	  				legend: {
	  						x: 'left',
	  						y: 'top',
	  						orient: 'vertical',
	  						data: aforecast_cat
	  	  				},
	  	  				toolbox: {
	  	  					show: true,
	  	  					feature: {
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
								value: (afo_low_pop || '-'),
								name: aforecast_cat[0]
							}, {
								value: (afo_med_pop || '-'),
								name: aforecast_cat[1]
							}, {
								value: (afo_hi_pop || '-'),
								name: aforecast_cat[2]
							}, {
								value: pop - tot_ava_pop,
								name: aforecast_cat[3],
								itemStyle: pieNull
							}]
						}]
					});

	  			  	window.onresize = function(){
	  			  		echartDonutAvaPopPredict.resize();
	  			  	}

	  			}

	  			// echart Donut

	  			if ($('#echart_donut_ava_building_prediction').length ){

	  			  	var echartDonutAvaBuildingPredict = echarts.init(document.getElementById('echart_donut_ava_building_prediction'), theme, render());

	  			  	echartDonutAvaBuildingPredict.setOption({
						tooltip: {
	  						trigger: 'item',
	  						formatter: humTooltipPie 
	  	  				},
	  	  				legend: {
	  						x: 'left',
	  						y: 'top',
	  						orient: 'vertical',
	  						data: aforecast_cat
	  	  				},
	  	  				toolbox: {
	  	  					show: true,
	  	  					feature: {
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
								value: (afo_low_build || '-'),
								name: aforecast_cat[0]
							}, {
								value: (afo_med_build || '-'),
								name: aforecast_cat[1]
							}, {
								value: (afo_hi_build || '-'),
								name: aforecast_cat[2]
							}, {
								value: build - tot_ava_build,
								name: aforecast_cat[3],
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

	  			if ($('#echart_donut_ava_risk_pop').length ){

	  			  	var echartDonutAvaRiskPop = echarts.init(document.getElementById('echart_donut_ava_risk_pop'), theme, render());

	  			  	echartDonutAvaRiskPop.setOption({
						tooltip: {
	  						trigger: 'item',
	  						formatter: humTooltipPie 
	  	  				},
	  	  				legend: {
	  						x: 'left',
	  						y: 'top',
	  						orient: 'vertical',
	  						data: arisk_cat
	  	  				},
	  	  				toolbox: {
	  	  					show: true,
	  	  					feature: {
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
								value: (arisk_med_pop || '-'),
								name: arisk_cat[0]
							}, {
								value: (arisk_hi_pop || '-'),
								name: arisk_cat[1]
							}, {
								value: pop - tot_risk_pop,
								name: arisk_cat[2],
								itemStyle: pieNull
							}]
						}]
					});

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutAvaRiskPop.resize();
	  			  	});

	  			}

	  			// echart Donut

	  			if ($('#echart_donut_ava_risk_building').length ){

	  			  	var echartDonutAvaBuildingRisk = echarts.init(document.getElementById('echart_donut_ava_risk_building'), theme, render());

	  			  	echartDonutAvaBuildingRisk.setOption({
						tooltip: {
	  						trigger: 'item',
	  						formatter: humTooltipPie 
	  	  				},
	  	  				legend: {
	  						x: 'left',
	  						y: 'top',
	  						orient: 'vertical',
	  						data: arisk_cat
	  	  				},
	  	  				toolbox: {
	  	  					show: true,
	  	  					feature: {
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
								value: (arisk_med_build || '-'),
								name: arisk_cat[0]
							}, {
								value: (arisk_hi_build || '-'),
								name: arisk_cat[1]
							}, {
								value: build - tot_risk_build,
								name: arisk_cat[2],
								itemStyle: pieNull
							}]
						}]
					});

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutAvaBuildingRisk.resize();
	  			  	});

	  			}

	  			// echart Donut 6

	  			if ($('#echart_donut_ava_risk_area').length ){

		  			var echartDonutAvaPopRisk = echarts.init(document.getElementById('echart_donut_ava_risk_area'), theme, render());

		  			echartDonutAvaPopRisk.setOption({
						tooltip: {
	  						trigger: 'item',
	  						formatter: humTooltipPie 
	  	  				},
	  	  				legend: {
	  						x: 'left',
	  						y: 'top',
	  						orient: 'vertical',
	  						data: arisk_cat
	  	  				},
	  	  				toolbox: {
	  	  					show: true,
	  	  					feature: {
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
								value: (arisk_med_area || '-'),
								name: arisk_cat[0]
							}, {
								value: (arisk_hi_area || '-'),
								name: arisk_cat[1]
							}, {
								value: area - tot_risk_area,
								name: arisk_cat[2],
								itemStyle: pieNull
							}]
						}]
					});

	  			  	window.addEventListener("resize", function(){
	  			  		echartDonutAvaPopRisk.resize();
	  			  	});

	  			}

	  		// break;

	  		// case "lndslide" :
	  			// Landslide tab
	  			if ($('#echart_donut_lsi').length ){

	  			  	var echartDonutLSI = echarts.init(document.getElementById('echart_donut_lsi'), theme, render());

					echartDonutLSI.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipPie
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
						color: colorLandslide,
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
								name: level_risk_pie[4]
							}]
						}]
					});

	  			  	window.onresize = function(){
	  			  		echartDonutLSI.resize();
	  			  	}

	  			}

	  			if ($('#echart_donut_ku').length ){

	  			  	var echartDonutKU = echarts.init(document.getElementById('echart_donut_ku'), theme, render());

					echartDonutKU.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipPie 
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
						color: colorLandslide,
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
								name: level_risk_pie[4]
							}]
						}]
					});

	  			  	window.onresize = function(){
	  			  		echartDonutKU.resize();
	  			  	}

	  			}

	  			if ($('#echart_donut_S1').length ){

					var echartDonutS1 = echarts.init(document.getElementById('echart_donut_S1'), theme, render());

					echartDonutS1.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipPie 
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
						color: colorLandslide,
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
								name: level_risk_pie[4]
							}]
						}]
					});

	  			  	window.onresize = function(){
	  			  		echartDonutS1.resize();
	  			  	}

	  			}

	  			if ($('#echart_donut_S2').length ){

		  			var echartDonutS2 = echarts.init(document.getElementById('echart_donut_S2'), theme, render());

		  			echartDonutS2.setOption({
		  				tooltip: {
							trigger: 'item',
							formatter: humTooltipPie 
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
		  				color: colorLandslide,
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
								name: level_risk_pie[4]
							}]
		  				}]
		  			});

	  			  	window.onresize = function(){
	  			  		echartDonutS2.resize();
	  			  	}

	  			}

	  			if ($('#echart_donut_S3').length ){

		  			var echartDonutS3 = echarts.init(document.getElementById('echart_donut_S3'), theme, render());

		  			echartDonutS3.setOption({
		  				tooltip: {
							trigger: 'item',
							formatter: humTooltipPie 
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
		  				color: colorLandslide,
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
								name: level_risk_pie[4]
							}]
		  				}]
		  			});

	  			  	window.onresize = function(){
	  			  		echartDonutS3.resize();
	  			  	}

	  			}

	  			if ($('#echart_bar_horizontal_lsi').length ){

	  			  	var echartBarLSI = echarts.init(document.getElementById('echart_bar_horizontal_lsi'), theme, render());

	  			  	echartBarLSI.setOption({
						tooltip: {
							trigger: 'item',
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
									color: colorLandslideBar
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

	  			}

	  			if ($('#echart_bar_horizontal_ku').length ){

	  			  	var echartBarKU = echarts.init(document.getElementById('echart_bar_horizontal_ku'), theme, render());

  	  			  	echartBarKU.setOption({
  						tooltip: {
  							trigger: 'item',
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
  									color: colorLandslideBar
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

	  			}

	  			if ($('#echart_bar_horizontal_s1').length ){

	  			  	var echartBarS1 = echarts.init(document.getElementById('echart_bar_horizontal_s1'), theme, render());

  	  			  	echartBarS1.setOption({
  						tooltip: {
  							trigger: 'item',
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
  									color: colorLandslideBar
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

	  			}

	  			if ($('#echart_bar_horizontal_s2').length ){

	  			  	var echartBarS2 = echarts.init(document.getElementById('echart_bar_horizontal_s2'), theme, render());

  	  			  	echartBarS2.setOption({
  						tooltip: {
  							trigger: 'item',
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
  									color: colorLandslideBar
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

	  			}

	  			if ($('#echart_bar_horizontal_s3').length ){

	  			  	var echartBarS3 = echarts.init(document.getElementById('echart_bar_horizontal_s3'), theme, render());

  	  			  	echartBarS3.setOption({
  						tooltip: {
  							trigger: 'item',
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
  									color: colorLandslideBar
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

	  			}
	  		// break

	  		// case "earthquake":
	  			// earthquake tab
	  			// echart Pie 8

	  			if ($('#echart_pie_erthqk_pop').length ){

	  			  	var echartPieErthqkPop = echarts.init(document.getElementById('echart_pie_erthqk_pop'), theme, render());

					echartPieErthqkPop.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipPie 
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
						color: colorDonutDefault,
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
								value: erthqk_pop,
								name: erthqk_cat[0]
							},{
								value: pop - erthqk_pop,
								name: erthqk_cat[1]
							}]
						}]
					});

	  			  	window.addEventListener("resize", function(){
	  			  		echartPieErthqkPop.resize();
	  			  	});

	  			}

	  			// echart Pie 8

	  			if ($('#echart_pie_erthqk_building').length ){

	  			  	var echartPieErthqkBuilding = echarts.init(document.getElementById('echart_pie_erthqk_building'), theme, render());

	  			  	echartPieErthqkBuilding.setOption({
	  			  		tooltip: {
	  			  			trigger: 'item',
	  			  			formatter: humTooltipPie 
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
	  			  		color: colorDonutDefault,
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
	  			  				value: erthqk_build,
	  			  				name: erthqk_cat[0]
	  			  			},{
	  			  				value: build - erthqk_build,
	  			  				name: erthqk_cat[1]
	  			  			}]
	  			  		}]
	  			  	});

	  			  	window.addEventListener("resize", function(){
	  			  		echartPieErthqkBuilding.resize();
	  			  	});

	  			}

	  			// echart Pie 9

	  			if ($('#echart_pie_erthqk_settl').length ){

	  			  	var echartPieErthqkSettl = echarts.init(document.getElementById('echart_pie_erthqk_settl'), theme, render());

	  			  	echartPieErthqkSettl.setOption({
	  			  		tooltip: {
	  			  			trigger: 'item',
	  			  			formatter: humTooltipPie 
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
	  			  		color: colorDonutDefault,
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
	  			  				value: erthqk_settl,
	  			  				name: erthqk_cat[0]
	  			  			},{
	  			  				value: settl - erthqk_settl,
	  			  				name: erthqk_cat[1]
	  			  			}]
	  			  		}]
	  			  	});

	  			  	window.addEventListener("resize", function(){
	  			  		echartPieErthqkSettl.resize();
	  			  	});

	  			}

	  			// echart Pie 11

	  			if ($('#echart_pie_mercalli_pop').length ){

	  			  	var echartPieMercallPop = echarts.init(document.getElementById('echart_pie_mercalli_pop'), theme, render());

					echartPieMercallPop.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipPie 
						},
						legend: {
							x: 'center',
							y: 'bottom',
							// orient: 'vertical',
							data: mercalli_cat
						},
						toolbox: {
							show: true,
							feature: {
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
						color: colorMercalli,
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
										textBorderColor: 'auto',
										color: '#33333352',
										formatter: humanizePie
									},
									labelLine: {
										show: true
									}
								},
								emphasis: {
									label: {
										show: true,
										// position: 'center',
										textStyle: {
										  fontSize: '14',
										  fontWeight: 'normal'
										}
									}
								}
							},
							data: [{
								value: (pop_weak || '-'),
								name: mercalli_cat[0]
							}, {
								value: (pop_light || '-'),
								name: mercalli_cat[1]
							}, {
								value: (pop_mod || '-'),
								name: mercalli_cat[2]
							}, {
								value: (pop_strong || '-'),
								name: mercalli_cat[3]
							}, {
								value: (pop_vstrong || '-'),
								name: mercalli_cat[4]
							}, {
								value: (pop_severe || '-'),
								name: mercalli_cat[5]
							}, {
								value: (pop_violent || '-'),
								name: mercalli_cat[6]
							}, {
								value: (pop_ext || '-'),
								name: mercalli_cat[7]
							}]
						}]
					});

	  			  	window.addEventListener("resize", function(){
	  			  		echartPieMercallPop.resize();
	  			  	});

	  			}

	  			// echart Pie 11

	  			if ($('#echart_pie_mercalli_build').length ){

	  			  	var echartPieMercallBuild = echarts.init(document.getElementById('echart_pie_mercalli_build'), theme, render());

	  			  	echartPieMercallBuild.setOption({
	  			  		tooltip: {
	  			  			trigger: 'item',
	  			  			formatter: humTooltipPie 
	  			  		},
	  			  		legend: {
	  			  			x: 'center',
	  			  			y: 'bottom',
	  			  			// orient: 'vertical',
	  			  			data: mercalli_cat
	  			  		},
	  			  		toolbox: {
	  			  			show: true,
	  			  			feature: {
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
	  			  		color: colorMercalli,
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
	  			  						textBorderColor: 'auto',
	  			  						color: '#33333352',
	  			  						formatter: humanizePie
	  			  					},
	  			  					labelLine: {
	  			  						show: true
	  			  					}
	  			  				},
	  			  				emphasis: {
	  			  					label: {
	  			  						show: true,
	  			  						// position: 'center',
	  			  						textStyle: {
	  			  						  fontSize: '14',
	  			  						  fontWeight: 'normal'
	  			  						}
	  			  					}
	  			  				}
	  			  			},
	  			  			data: [{
	  			  				value: (buildings_weak || '-'),
	  			  				name: mercalli_cat[0]
	  			  			}, {
	  			  				value: (buildings_light || '-'),
	  			  				name: mercalli_cat[1]
	  			  			}, {
	  			  				value: (buildings_mod || '-'),
	  			  				name: mercalli_cat[2]
	  			  			}, {
	  			  				value: (buildings_strong || '-'),
	  			  				name: mercalli_cat[3]
	  			  			}, {
	  			  				value: (buildings_vstrong || '-'),
	  			  				name: mercalli_cat[4]
	  			  			}, {
	  			  				value: (buildings_severe || '-'),
	  			  				name: mercalli_cat[5]
	  			  			}, {
	  			  				value: (buildings_violent || '-'),
	  			  				name: mercalli_cat[6]
	  			  			}, {
	  			  				value: (buildings_ext || '-'),
	  			  				name: mercalli_cat[7]
	  			  			}]
	  			  		}]
	  			  	});

	  			  	window.addEventListener("resize", function(){
	  			  		echartPieMercallBuild.resize();
	  			  	});

	  			}

	  			// echart Pie 11

	  			if ($('#echart_pie_mercalli_settl').length ){

	  			  	var echartPieMercallSettl = echarts.init(document.getElementById('echart_pie_mercalli_settl'), theme, render());

	  			  	echartPieMercallSettl.setOption({
	  			  		tooltip: {
	  			  			trigger: 'item',
	  			  			formatter: humTooltipPie 
	  			  		},
	  			  		legend: {
	  			  			x: 'center',
	  			  			y: 'bottom',
	  			  			// orient: 'vertical',
	  			  			data: mercalli_cat
	  			  		},
	  			  		toolbox: {
	  			  			show: true,
	  			  			feature: {
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
	  			  		color: colorMercalli,
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
	  			  						textBorderColor: 'auto',
	  			  						color: '#33333352',
	  			  						formatter: humanizePie
	  			  					},
	  			  					labelLine: {
	  			  						show: true
	  			  					}
	  			  				},
	  			  				emphasis: {
	  			  					label: {
	  			  						show: true,
	  			  						// position: 'center',
	  			  						textStyle: {
	  			  						  fontSize: '14',
	  			  						  fontWeight: 'normal'
	  			  						}
	  			  					}
	  			  				}
	  			  			},
	  			  			data: [{
	  			  				value: (settlement_weak || '-'),
	  			  				name: mercalli_cat[0]
	  			  			}, {
	  			  				value: (settlement_light || '-'),
	  			  				name: mercalli_cat[1]
	  			  			}, {
	  			  				value: (settlement_mod || '-'),
	  			  				name: mercalli_cat[2]
	  			  			}, {
	  			  				value: (settlement_strong || '-'),
	  			  				name: mercalli_cat[3]
	  			  			}, {
	  			  				value: (settlement_vstrong || '-'),
	  			  				name: mercalli_cat[4]
	  			  			}, {
	  			  				value: (settlement_severe || '-'),
	  			  				name: mercalli_cat[5]
	  			  			}, {
	  			  				value: (settlement_violent || '-'),
	  			  				name: mercalli_cat[6]
	  			  			}, {
	  			  				value: (settlement_ext || '-'),
	  			  				name: mercalli_cat[7]
	  			  			}]
	  			  		}]
	  			  	});

	  			  	window.addEventListener("resize", function(){
	  			  		echartPieMercallSettl.resize();
	  			  	});

	  			}
	  		// break;

	  		// case "haccess":
	  			// haccess tab
	  			// echart Polar
	  			if ($('#echart_polar_target_type').length ){
	  				var echartPolarTarget = echarts.init(document.getElementById('echart_polar_target_type'), theme/*, render()*/);

	  				echartPolarTarget.setOption({
	  					legend: {
					        data: polar_cat,
					        orient: 'vertical',
					        left: 'right'
					    },
					    polar: {},
					    tooltip: {
					    	formatter: humTooltipPolar
					    },
					    angleAxis: {
					        type: 'category',
					        data: target_cat,
					        startAngle: 0,
					        // boundaryGap: false,
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
					        	padding: [0, 10]
					        },
					        axisLine: {
					            show: false
					        }
					    },
					    radiusAxis: {
					        type: 'log',
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
					            formatter: humanizeFormatter
					        }
					    },
					    series: [{
					        name: polar_cat[0],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        areaStyle: {
					        	normal: {
	                            	// color: '#000'
	                        	}
					        },
					        symbolSize: sizeBubble,
					        data: targetCount,
					        animationDelay: delay
					    },
					    {
					        name: polar_cat[1],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: sizeBubble,
					        data: targetDead,
					        animationDelay: delay
					    },
					    {
					        name: polar_cat[2],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: sizeBubble,
					        data: targetInjured,
					        animationDelay: delay
					    },
					    {
					        name: polar_cat[3],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: sizeBubble,
					        data: targetViolent,
					        animationDelay: delay
					    }]
	  				});

					window.addEventListener("resize", function(){
						echartPolarTarget.resize();
					});
	  			}

	  			// echart Polar
	  			if ($('#echart_polar_incident_type').length ){
	  				var echartPolarIncident = echarts.init(document.getElementById('echart_polar_incident_type'), theme/*, render()*/);

	  				echartPolarIncident.setOption({
	  					legend: {
					        data: polar_cat,
					        orient: 'vertical',
					        left: 'right'
					    },
					    polar: {},
					    tooltip: {
					    	formatter: humTooltipPolar
					    },
					    angleAxis: {
					        type: 'category',
					        data: incident_cat,
					        startAngle: 0,
					        // boundaryGap: false,
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
					        	padding: [0, 10]
					        },
					        axisLine: {
					            show: false
					        }
					    },
					    radiusAxis: {
					        type: 'log',
					        splitArea: {
					        	show: false
					        },
					        axisLine: {
					            show: false
					        },
					        axisLabel: {
					            formatter: humanizeFormatter
					        }
					    },
					    series: [{
					        name: polar_cat[0],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: sizeBubble,
					        data: incidentCount,
					        animationDelay: delay
					    },
					    {
					        name: polar_cat[1],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: sizeBubble,
					        data: incidentDead,
					        animationDelay: delay
					    },
					    {
					        name: polar_cat[2],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: sizeBubble,
					        data: incidentInjured,
					        animationDelay: delay
					    },
					    {
					        name: polar_cat[3],
					        type: 'scatter',
					        coordinateSystem: 'polar',
					        symbolSize: sizeBubble,
					        data: incidentViolent,
					        animationDelay: delay
					    }]
	  				});

					window.addEventListener("resize", function(){
						echartPolarIncident.resize();
					});
	  			}

	  			// echart Bar Horizontal Casualties

	  			if ($('#echart_bar_horizontal_casualty_incident').length ){

	  			  	var echartBarCasInc = echarts.init(document.getElementById('echart_bar_horizontal_casualty_incident'), theme, render());

					echartBarCasInc.setOption({
						tooltip: {
							trigger: 'item',
							axisPointer:{
								type:'line'
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
							data: incident_cat
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
	  			  		echartBarCasInc.resize();
	  			  	});

	  			}

	  			// echart Bar Horizontal Incident

	  			if ($('#echart_bar_horizontal_incident_incident').length ){

	  			  	var echartBarIncInc = echarts.init(document.getElementById('echart_bar_horizontal_incident_incident'), theme, render());

					echartBarIncInc.setOption({
						tooltip: {
							trigger: 'axis',
							axisPointer:{
								type:'line'
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
							data: incident_cat
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
	  			  		echartBarIncInc.resize();
	  			  	});

	  			}

	  			// echart Bar Horizontal Casualties by Target

	  			if ($('#echart_bar_horizontal_casualty_target').length ){

	  			  	var echartBarCasTarg = echarts.init(document.getElementById('echart_bar_horizontal_casualty_target'), theme, render());

					echartBarCasTarg.setOption({
						tooltip: {
							trigger: 'item',
							// axisPointer:{
							// 	type:'line'
							// },
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
							data: target_cat
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
	  			  		echartBarCasTarg.resize();
	  			  	});

	  			}

	  			// echart Bar Horizontal Incident by Target

	  			if ($('#echart_bar_horizontal_incident_target').length ){
		  			var echartBarIncTarg = echarts.init(document.getElementById('echart_bar_horizontal_incident_target'), theme, render());

		  			echartBarIncTarg.setOption({
		  				tooltip: {
							trigger: 'item',
							// axisPointer:{
							// 	type:'shadow'
							// },
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
		  					data: target_cat
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
	  			  		echartBarIncTarg.resize();
	  			  	});

		  		}
		  	// break;

		  	// default:
			  	// baseline tab
			  	//echart Bar Horizontal

				if ($('#echart_bar_horizontal_pop').length ){

				  	var echartBarPop = echarts.init(document.getElementById('echart_bar_horizontal_pop'), theme, render());

					echartBarPop.setOption({
						tooltip: {
							trigger: 'item',
							// axisPointer:{
							// 	type: 'shadow',
							// },
							formatter: humTooltipBar
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
						    top: '10%',
						    containLabel: true
						},
						calculable: true,
						xAxis: [{
							type: 'log',
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
							data: landcover_pop
						}]
					});

				  	window.addEventListener("resize", function(){
				  		echartBarPop.resize();
				  	});

				}

			  	//echart Bar Horizontal

				if ($('#echart_bar_horizontal_build').length ){

					var echartBarBuild = echarts.init(document.getElementById('echart_bar_horizontal_build'), theme, render());

					echartBarBuild.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipBar
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
					        top: '10%',
					        containLabel: true
					    },
						calculable: true,
						xAxis: [{
							type: 'log',
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
							name: overview_legend[2],
							type: 'bar',
							label:{
								normal:{
									formatter: humanizeBar,
									position: 'right',
									show: true
								}
							},
							data: landcover_building
						}]
					});

				  	window.addEventListener("resize", function(){
				  		echartBarBuild.resize();
				  	});

				}

			  	//echart Bar Horizontal

				if ($('#echart_bar_horizontal_area').length ){

					var echartBarArea = echarts.init(document.getElementById('echart_bar_horizontal_area'), theme, render());

					echartBarArea.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipBar
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
							name: overview_legend[1],
							type: 'bar',
							label:{
								normal:{
									formatter: humanizeBar,
									position: 'right',
									show: true
								}
							},
							data: landcover_area
						}]
					});

				  	window.addEventListener("resize", function(){
				  		echartBarArea.resize();
				  	});

				}

				// echart Bar Horizontal 2

				if ($('#echart_bar_horizontal_health_fac').length ){

				  	var echartBarHF = echarts.init(document.getElementById('echart_bar_horizontal_health_fac'), theme, render());

					echartBarHF.setOption({
						tooltip: {
							trigger: 'item',
							// formatter: humTooltipBar
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
						}]
					});

				  	window.addEventListener("resize", function(){
				  		echartBarHF.resize();
				  	});

				}

				// echart Bar Horizontal 3

				if ($('#echart_bar_horizontal_road').length ){

				  var echartBarRoad = echarts.init(document.getElementById('echart_bar_horizontal_road'), theme, render());

					echartBarRoad.setOption({
						tooltip: {
							trigger: 'item',
							formatter: humTooltipBar
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
						}]
					});

				  	window.addEventListener("resize", function(){
				  		echartBarRoad.resize();
				  	});

				}

	  			// break;

		};

		$(document).ready(function(){
			init_echarts2();
		});

		// Show Echart on active tab
		// $('a[data-toggle="pill"]').on('shown.bs.tab', function(e){
		// 	init_echarts();
		// })

		// Show Echart based on active tab
		// $('.navbar-forecast a[href="#ggMenu"]').on('shown.bs.tab', function(){
		// 	init_echarts2();
		// });

		// $('.navbar-forecast a[href="#glMenu"]').on('shown.bs.tab', function(){
		// 	init_echarts2();
		// });

		// $('.navbar-forecast a[href="#gfMenu"]').on('shown.bs.tab', function(){
		// 	init_echarts2();
		// });

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

		$(document).ready(function(){
			var humanizeTableFormatter = function(value){
				// console.log(value)

				var v= value;
				// var n= params.name;
				if(v>=1000 && v<1000000){
					return (parseFloat((v/1000).toPrecision(3)))+' K'
					// return (parseFloat((v/1000).toFixed(1)))+' K'
				}
				else if (v>=1000000 && v<1000000000) {
					return (parseFloat((v/1000000).toPrecision(3)))+' M'
					// return (parseFloat((v/1000000).toFixed(1)))+' M'
				}else{
					if (v==null || isNaN(parseFloat(v))) {
						v=0;
					}
					// console.log(parseFloat((v).toPrecision(3)));
					return (parseFloat((v*1).toPrecision(3)))
					// return (parseFloat((v).toFixed(1)))
				}

			};

			// if( typeof ($.fn.DataTable) === 'undefined'){
			// 	return;
			// }

	    	$.fn.dataTable.moment( 'MMM D, YYYY' );

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
	    				filename: 'ASDC Data',
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "excel",
	    				filename: 'ASDC Data',
	    				className: "btn-sm"
	    			},
	    			{
	    				extend: "print",
	    				filename: 'ASDC Data',
	    				// customize: 
	    				// 	function ( win ) {
			      //               $(win.document.body)
			      //                   .css( 'font-size', '10pt' )
			      //                   .prepend(
			      //                   	'<img src="static/v2/images/usaid-logo.png" style="position:absolute; top:0; left:0;" />')
			      //                   .prepend(
			      //                       '<img src="static/v2/images/iMMAP.png" style="position:absolute; top:0; left:220px;" />'
			      //                   );
			 
			      //               $(win.document.body).find( 'table' )
			      //                   .addClass( 'compact' )
			      //                   .css( 'font-size', 'inherit' );
			      //           },
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
