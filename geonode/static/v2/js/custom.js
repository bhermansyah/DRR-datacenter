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
					return {renderer: 'svg'};
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

				animation: false
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

		  	colorDonutDefault = ['#b92527', '#ccc'];

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

        	var colorFloodRiskForecast = ['#abd9e9', '#74add1', '#4575b4'];

        	colorFloodRisk = ['#ffaaab', '#ff6264', '#d13c3e', '#b92527'];

        	colorList=[
        	    '#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', /*'#fffb46',*/ '#fff327', /*'#fffc79', */ /*'#ffdd72',*/
        	    /*'#ffd341',*/ '#ffc43b', '#ff9c00', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
        	];

		  	var colorTimes =
		  		function(params){
		  			// var colorList=[
		  			// 	'#c0fee5', /*'#99fcff',*/ '#94fdd5', '#75fcc9', /*'#fffb46',*/ '#fff327', /*'#fffc79', */ '#ffdd72',
		  			// 	/*'#ffd341',*/ '#ffc43b', '#ff9c00', '#ffc9c7', '#ffa8a4', /*'#fdbbac',*/ '#ff9d99' /*'#ffa19a'*/
		  			// ];
		  			return colorList[params.dataIndex]
		  		}
		  	colorLandslide = [ '#43A047', '#FDD835' , '#FB8C00', '#e84c3d', '#ccc' ];

		  	var colorLandslideBar =
		  		function(params){
		  			return colorLandslide[params.dataIndex]
		  		}

		  	colorMercalli = [
		  	        // /*'#eeeeee', '#bfccff',*/ '#9999ff', '#88ffff', '#7df894', '#ffff00',
		  	        // '#ffdd00', '#ff9100', '#ff0000', '#dd0000', '#880000', '#440000'

		  	        '#d4e6f1', '#c2fcf7', '#6dffb6', '#ffff5c',
		  	         '#ffe74c', '#ffc600', '#ff5751', '#e84c3d'
		  	    ];

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
					    color: colorFloodRiskForecast,
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
					    color: colorFloodRiskForecast,
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
					    color: colorFloodRiskForecast,
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
					    color: colorFloodRiskForecast,
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

		$(document).ready(function(){
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

	$(document).ready(function(){
		// function num_max(feature){
			// console.log(feature.properties.hlt_total);
			// Data for legend on the map
			// if (pop_collection.length) {
			// 	console.log(pop_collection);
			// 	var max = pop_collection.reduce(function(a, b) {
			// 	    return Math.max(a, b);
			// 	});
			// }

			// console.log(max);
		// }
		legend_num_arr = [];
		val_collection = [];

		function getMax(geojson, prop){
		    var max = 0;
		    for (var i = 0; i < geojson.length; i++) {
		        max = Math.max(parseInt(geojson[i]["properties"][prop]), max);
		    }
		    // console.log(max);
		    return max;
		}

		function dataLegend(v){
			var max = v;
			var roundup;

			if (max >= 0 && max < 100) {
			    roundup = Math.ceil(max/10) * 10;
			}else if (max >= 100 && max < 1000) {
			    roundup = Math.ceil(max/100) * 100;
			}else if (max >= 1000 && max < 10000) {
			    roundup = Math.ceil(max/1000) * 1000;
			}else if (max >= 10000 && max < 100000) {
			    roundup = Math.ceil(max/10000) * 10000;
			}else if (max >= 100000 && max < 1000000) {
			    roundup = Math.ceil(max/100000) * 100000;
			}else{
			    roundup = Math.ceil(max/1000000) * 1000000;
			}

			console.log(roundup);
			// roundup=roundup/8;
			// console.log(roundup);

			legend_num_arr = [0];
			var legend_num = 0;
			for (var i = 0; i < 7; i++) {
			    legend_num = legend_num + roundup;
			    legend_num_arr.push(legend_num);
			}
			console.log(legend_num_arr);

			// return legend_num_arr;
		}

		function rounding(num){
			if (num >= 0 && num < 100) {
			    roundup = Math.ceil(num/10) * 10;
			}else if (num >= 100 && num < 1000) {
			    roundup = Math.ceil(num/100) * 100;
			}else if (num >= 1000 && num < 10000) {
			    roundup = Math.ceil(num/1000) * 1000;
			}else if (num >= 10000 && num < 100000) {
			    roundup = Math.ceil(num/10000) * 10000;
			}else if (num >= 100000 && num < 1000000) {
			    roundup = Math.ceil(num/100000) * 100000;
			}else{
			    roundup = Math.ceil(num/1000000) * 1000000;
			}

			return num;
		}

		function range(num){
			num.length/8;
			
			rounding();
		}

		// Getting Date Information for Flood Forecast Map
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		if(dd<10) {
		    dd = '0'+dd
		} 

		if(mm<10) {
		    mm = '0'+mm
		}

		today = 'year:'+ yyyy +';month:'+ mm +';day:'+ dd +';';

		if ($('.ch-size-map').length) {
			var id_map = document.querySelector('.ch-size-map').id;
		}

		function fillValue() {
			var sum=0;
			for (var i = 0; i < document.erthqk_checkbox.length; i++) {
				if (document.erthqk_checkbox[i].checked) {
					sum = sum + boundary['features'][i]['properties'][this.value]
				}
				boundary['features'][i]['properties']['value'] = sum;
				console.log(sum);
			}
		}

		function median(numbers) {
		    // median of [3, 5, 4, 4, 1, 1, 2, 3] = 3
		    var median = 0, numsLen = numbers.length;
		    // numbers.sort();
		    numbers.sort(function(a, b){return a-b});
		 
		    if (numsLen % 2 === 0 ) { // is even
		        // average of two middle numbers
		        median = (numbers[(numsLen / 2) - 1] + numbers[numsLen / 2]) / 2;
		    } else { // is odd
		        // middle number only
		        median = numbers[(numsLen - 1) / 2];
		    }
		 
		    return median;
		}

		function isZero(currentValue) {
		  return currentValue == 0;
		}

		function unique(list) {
		    var result = [];
		    $.each(list, function(i, e) {
		        if ($.inArray(e, result) == -1) result.push(e);
		    });
		    return result;
		}

		function changeValueProp(selected){
			// console.log(val_collection);
			// val_collection is an array that has all value of each prov/dist
			val_collection.splice(0, val_collection.length);
			for (var i = 0; i < boundary.features.length; i++) {
				if (boundary['features'][i]['properties'][selected]==null) {
					console.log("null");
					boundary['features'][i]['properties']['value']=0;
					val_collection.push(0);
				}else{
					boundary['features'][i]['properties']['value']=boundary['features'][i]['properties'][selected];
					val_collection.push(boundary['features'][i]['properties']['value']);
				}
			}

			// console.log(val_collection);
			
			// Check if all val_collection value is 0, if not, delete 0
			if (val_collection.every(isZero)==false) {
				// val_collection = val_collection.filter(Number);
			}

			// Set jenk number
			set_jenk_divider = setJenkNumb(val_collection.length);

			// console.log(val_collection);
			// console.log(set_jenk_divider);

		}

		function sumValueProp(selected){
	    	// var max_val = 0;
	    	var checked = selected;
	    	if ((checked.length==0)) {
	    		for (var i = 0; i < boundary.features.length; i++) {
	    			boundary['features'][i]['properties']['value']=0;
	    		}
	    		val_collection.splice(0, val_collection.length);
	    		val_collection.push(0);
	    	}else{
	    		val_collection.splice(0, val_collection.length);
			    for (var i = 0; i < boundary.features.length; i++) {
			    	//declare a variable to keep the sum of the values
			    	var sum = 0;
		    	    //using an iterator find and sum the properties values of checked checkboxes
		    	    checked.each(function() {
		    			sum += boundary['features'][i]['properties'][$(this).val()];
		    	    });
		    	    boundary['features'][i]['properties']['value']=sum;

		    	    val_collection.push(sum);

		    	    // if (max_val < sum) {
		    	    //   max_val = sum;
		    	    // }
			    }

			    // Check if all val_collection value is 0, if not, delete 0
			    if (val_collection.every(isZero)==false) {
			    	val_collection = val_collection.filter(Number);
			    }
	    	}

	    	// Set jenk number
	    	set_jenk_divider = setJenkNumb(val_collection.length);

	    	// console.log(val_collection);
	    	// console.log(set_jenk_divider);
		}

		function setJenkNumb(numb){
			if (numb < 8) {
				divider = numb-1;
			}else{
				divider = 7;
			}

			// console.log(divider);
			return divider;
		}

		function setLegendSeries(series_numb){
			var data_series = new geostats(series_numb);
			var series_jenks = data_series.getJenks(set_jenk_divider);

			// console.log(series_jenks);
			series_jenks = unique(series_jenks);

			return series_jenks;
		}

		// Function initialize map
		function initMap(){
			var map = L.map((id_map), {
				zoomSnap: 0
			}).setView([centroid[1],centroid[0]], 8);
	        var geojsonLayer = L.geoJson(boundary);
	        map.fitBounds(geojsonLayer.getBounds());
			
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
			    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			    maxZoom: 19
			}).addTo(map);

			// Add Zoom Back Home Button
			L.easyButton( 'fa-arrows-alt', function(){
			  map.fitBounds(geojsonLayer.getBounds());
			}).addTo(map);

			// console.log(map);

			return map;
		}

		// Function to Create Legend
		function createLegend(){
			// Add legend to the map
			var legend = L.control({position: 'bottomright'});

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			    	// grades = [0, legend_num_arr[0], legend_num_arr[1], legend_num_arr[2], legend_num_arr[3]],
			        labels = [];

			    // Add transparent color to legend
			    // div.innerHTML += '<span style="background:' + clamped_scale(0) + '"></span> ';

			    // loop through our density intervals and generate a label with a colored square for each interval
			    for (var i = 0; i < legend_num_arr.length-1; i++) {
			        // div.innerHTML +=
			        	//legend in horizontal view
			        	// '<span style="background:' + clamped_scale(legend_num_arr[i]) + '"></span> ';
			            // legend in vertical view
			            // console.log(clamped_scale(legend_num_arr[i]));
			            if (clamped_scale(legend_num_arr[i])=='transparent') {
			            	div.innerHTML;
			            }else{
			            	div.innerHTML +=
			            	'<i style="background:' + clamped_scale(legend_num_arr[i]) + '"></i> ' +
			            	humanizeTableFormatter(legend_num_arr[i]) + (legend_num_arr[i + 1] ? '<br>' : '+');
			            }
			    }

			    // legend in horizontal view
			    // a line break
			    // div.innerHTML += '<br>';
			    // div.innerHTML += '<label>' + humanizeTableFormatter(0) + '&ndash;' + humanizeTableFormatter(legend_num_arr[0]) + '</label>';

			    // // second loop for text
		     //    for (var i = 0; i < legend_num_arr.length-1; i++) {
		     //        div.innerHTML +=
		     //            '<label>' + humanizeTableFormatter(legend_num_arr[i]) + (legend_num_arr[i + 1] ? '&ndash;' + humanizeTableFormatter(legend_num_arr[i + 1]) : '+') + '</label>';
		     //    }

			    return div;
			};

			return legend;
		}

		// Function to Add Color to the Boundary (static)
		function getColor(d) {
		    return d > legend_num_arr[7] ? '#800026' :
		           d > legend_num_arr[6]  ? '#BD0026' :
		           d > legend_num_arr[5]  ? '#E31A1C' :
		           d > legend_num_arr[4]  ? '#FC4E2A' :
		           d > legend_num_arr[3]   ? '#FD8D3C' :
		           d > legend_num_arr[2]   ? '#FEB24C' :
		           d > legend_num_arr[1]   ? '#FED976' :
		           d > 0   ? '#FFEDA0' :
		                      'transparent';
		}
		
		//calculate radius so that resulting circles will be proportional by area
		function getRadius(y) {
		    r = Math.sqrt(y / Math.PI)
		    return r;
		}

		// Function add color to boundary dynamically
		function clamped_scale(v) { 
			return v < 1 ? 'transparent' : getChroma(v); 
		}

		// Function to Style the Interactive Map
		function style(feature) {
			// console.log(feature.properties.na_en);
			// console.log(clamped_scale(feature.properties.value));

		    return {
		        // fillColor: getColor(feature.properties.Population), //Add color based on population data
		        // fillColor: getColor(feature.properties[layer_selected]), //Add color based on selected layer data
		        // fillColor: getColor(feature.properties.value), //Add color based on accrued selected layer data
		        fillColor: clamped_scale(feature.properties.value),
		        // weight: 2,
		        weight: 1,
		        opacity: 1,
		        color: '#ddd',
		        // dashArray: '3',
		        fillOpacity: 0.7
		    };
		}

		// Function to Bubble Style the Interactive Map
		function styleBubble(feature) {
		    return {
		    	radius: getRadius(feature.properties.value), // Calculated radius based on value
		        fillColor: getColor(feature.properties.value), //Add color based on accrued selected layer data
		        weight: 1,
		        opacity: 0,
		        color: 'white',
		        fillOpacity: 0.8
		    };
		}

		// Function to Add Info
		function addInfo(){
			// Add info of Population
			var info = L.control();

			info.onAdd = function (map) {
				// this.infok = L.DomUtil.get("mapInfo"); // get that DIV
				// this.infok = L.DomUtil.getClass('mapInfo');	// get that class
			    this._div = L.DomUtil.create('div', 'infoOutside'); // create a div with a class "info"
			    this.update();
			    return this._div;
			};

			return info;
		}

		// Function to Add Chart
		function addChart(){
			var chart = L.control();

			chart.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'ChartOutside'); // create a div with a class "info"
			    this.update();
			    return this._div;
			};

			return chart;
		}

		function highlightFeature(layer) {
		    // var layer = e.target;
		    // console.log(layer);

		    layer.setStyle({
		        // weight: 5,
		        // color: '#666',
		        weight: 1,
		        color: '#000',
		        dashArray: '',
		        fillOpacity: 0.7
		    });

		    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		        layer.bringToFront();
		    }

		    // info.update(layer.feature.properties);
		}

		//create highlight style, with darker color and larger radius
		function styleHighlightBubble(feature) {
		    return {
		    	radius: getRadius(feature.properties.value)+1.5,
		        weight: 1,
		        opacity: 0,
		        color: 'white',
		        fillOpacity: 0.8
		    };
		}

		//attach styles and popups to the marker layer
		function highlightBubbleFeature(layer) {
			bubbleStyleHighlight = styleHighlightBubble(layer.feature);
		    layer.setStyle(bubbleStyleHighlight);

		    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		        layer.bringToFront();
		    }
		}

		function resetHighlight(layer) {
			// console.log(selected);
			// console.log(layer);
			if (selected === null || selected._leaflet_id !== layer._leaflet_id) {
				geojson.resetStyle(layer);
			}
		    // info.update();
		}

		function resetHighlight2(e){
			geojson.resetStyle(e.target);
		}

		function selectHighlight(layer){
			if (selected !== null) {
				var previous = selected;
			}
			selected = layer;
			if (previous) {
				resetHighlight(previous)
			}
			info.update(layer.feature.properties);

			if (chart !== null) {
				chart.update(layer.feature.properties);
			}
		}

		function zoomToFeature(e) {
		    map.fitBounds(e.target.getBounds());
		}

		function onEachFeature(feature, layer) {
		    layer.on({
		    	'mouseover': function (e) {
		    	  		      highlightFeature(e.target);
		    	  		    },
	  		    'mouseout': function (e) {
	  		      resetHighlight(e.target);
	  		    },
  				'click': function (e) {
  				  selectHighlight(e.target);
  				}
		        // click : selectHighlight,
		        // mouseout : resetHighlight,
		        // mouseover : highlightFeature
		        // click: zoomToFeature
		    });

		    // layer.on('click', function(layer){
		    // 	if (selected) {
		    // 		resetHighlight(layer.target);
		    // 	}
		    // 	var selected = true;
		    // 	highlightFeature(layer.target);
		    // });
		}

		function onEachBubbleFeature(feature, layer) {
		    layer.on({
		    	'mouseover': function (e) {
		    	  		      highlightBubbleFeature(e.target);
		    	  		    },
	  		    'mouseout': function (e) {
	  		      resetHighlight(e.target);
	  		    },
  				'click': function (e) {
  				  selectHighlight(e.target);
  				}
		    });
		}

		function onEachFeature2(feature, layer) {
		    layer.on({
		    	'mouseover': function (e) {
		    	  		      highlightFeature(e.target);
		    	  		    },
	  		    'mouseout': function (e) {
	  		      resetHighlight2(e.target);
	  		    },
  				'click': function (e) {
  				  selectHighlight(e.target);
  				}
		    });
		}

		function setSliderHandle(i, value) {
			var r = [null,null];
			r[i] = value;
			sliderRangeValue.noUiSlider.set(r);
		}

		function updateSliderRange ( min, max ) {
			if (min == max) {
				sliderRangeValue.setAttribute('disabled', true);
				$('#input-with-keypress-0').prop('disabled', true);
				$('#input-with-keypress-1').prop('disabled', true);
			}else{
				sliderRangeValue.removeAttribute('disabled');
				$('#input-with-keypress-0').prop('disabled', false);
				$('#input-with-keypress-1').prop('disabled', false);
				sliderRangeValue.noUiSlider.updateOptions({
					start: [min, max],
					range: {
						'min': min,
						'max': max
					}
				});
			}
		}

		function addSlider(){
			var keypressSlider = document.getElementById('keypress');
			var input0 = document.getElementById('input-with-keypress-0');
			var input1 = document.getElementById('input-with-keypress-1');
			var inputs = [input0, input1];

			if (set_jenk_divider<7) {
				range_slider_divider = 
				{
					'min': [0],
					'max': legend_num_arr[(legend_num_arr.length)-1]
				}
			}else{
				range_slider_divider = 
				{
					'min': legend_num_arr[0],
					'25%': legend_num_arr[1],
					'50%': legend_num_arr[3],
					'75%': legend_num_arr[5],
					'max': legend_num_arr[(legend_num_arr.length)-1]
				}
			}

			noUiSlider.create(keypressSlider, {
				start: [0, legend_num_arr[(legend_num_arr.length)-1]],
				connect: true,
				// direction: 'rtl',
				// tooltips: [true, wNumb({ decimals: 0 })],
				// snap: true,
				range: range_slider_divider,
				format: wNumb({
					decimals: 1
				})
				// format: {
				// 	to: function ( value ) {
				// 		return humanizeTableFormatter(value);
				// 	},
				// 	from: function ( value ) {
				// 		if(value>=1000 && value<1000000){
				// 			return value.replace(' K', '')*1000;
				// 		}
				// 		else if (value>=1000000 && value<1000000000) {
				// 			return value.replace(' M', '')*1000000;
				// 		}else{
				// 			return value;
				// 		}
				// 	}
				// }
			});

			if (range_slider_divider.min == range_slider_divider.max) {
				keypressSlider.setAttribute('disabled', true);
				$('#input-with-keypress-0').prop('disabled', true);
				$('#input-with-keypress-1').prop('disabled', true);

			}else{
				keypressSlider.removeAttribute('disabled');
				$('#input-with-keypress-0').prop('disabled', false);
				$('#input-with-keypress-1').prop('disabled', false);
			}

			keypressSlider.noUiSlider.on('update', function( values, handle ) {
				group.clearLayers();
				inputs[handle].value = values[handle];

				range = keypressSlider.noUiSlider.get();
				rangeMin = range.slice(0, 1);
				rangeMax = range.slice(1);

				// console.log(range);
				// console.log(rangeMin);
				// console.log(rangeMax);

				getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

				// geojson.clearLayers();
				digital_zips = L.geoJson(boundary, {
				    onEachFeature: onEachFeature,
				    style: style,
				    filter: function (feature, layer) {
				        return (feature.properties.value <= rangeMax) & (feature.properties.value >= rangeMin);
				    }
				});
				console.log("ini");
				group = L.featureGroup().addLayer(digital_zips);
				group.addTo(this_map);
				console.log("itu");

				// geojson = L.featureGroup().addLayer(digital_zips);
				// geojson.addTo(baselineMap);
			});

			// Listen to keydown events on the input field.
			inputs.forEach(function(input, handle) {

				input.addEventListener('change', function(){
					setSliderHandle(handle, this.value);
				});

				input.addEventListener('keydown', function( e ) {

					var values = keypressSlider.noUiSlider.get();
					var value = Number(values[handle]);

					// [[handle0_down, handle0_up], [handle1_down, handle1_up]]
					var steps = keypressSlider.noUiSlider.steps();

					// [down, up]
					var step = steps[handle];

					var position;

					// 13 is enter,
					// 38 is key up,
					// 40 is key down.
					switch ( e.which ) {

						case 13:
							setSliderHandle(handle, this.value);
							break;

						case 38:

							// Get step to go increase slider value (up)
							position = step[1];

							// false = no step is set
							if ( position === false ) {
								position = 1;
							}

							// null = edge of slider
							if ( position !== null ) {
								setSliderHandle(handle, value + position);
							}

							break;

						case 40:

							position = step[0];

							if ( position === false ) {
								position = 1;
							}

							if ( position !== null ) {
								setSliderHandle(handle, value - position);
							}

							break;
					}
				});
			});

			return keypressSlider;
		}

		// Leaflet JS
		if ($('#leaflet_baseline_map_lama').length ){
			var geojson;
			// var map = L.map('leaflet_baseline_map').setView([37.8, -96], 4);
			var map = L.map('leaflet_baseline_map_coba').setView([centroid[1],centroid[0]],7);
			var geojsonLayer = L.geoJson(boundary);
			map.fitBounds(geojsonLayer.getBounds());

			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
			    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			    maxZoom: 19
			}).addTo(map);

			// Marker point
			var markers = L.markerClusterGroup();

			// for (var num = 0; num < breweries.length; num++) {
			//  	var brewery = breweries[num];
			//  	var brewery_lat = brewery["latitude"];
			//  	var brewery_long = brewery["longitude"];
			//  	var brewery_name = brewery["brewery"];
			//  	var brewery_address = brewery["address"];
			//  	var brewery_city = brewery["city"];

			//  	var marker = L.marker([brewery_lat, brewery_long]).addTo(map);
			 	
			//  	var popup_html = '<h4>' + brewery_name + '</h4>';
			//  	popup_html += '<div>' + brewery_address + '</div>';
			//  	popup_html += '<div>' + brewery_city + '</div>'

			//  	marker.bindPopup(popup_html);
			//  	markers.addLayer(marker);
			//  }

			//  map.addLayer(markers);

			// function getColor(d) {
			//     return d > 150000 ? '#800026' :
			//            d > 125000  ? '#BD0026' :
			//            d > 100000  ? '#E31A1C' :
			//            d > 75000  ? '#FC4E2A' :
			//            d > 50000   ? '#FD8D3C' :
			//            d > 25000   ? '#FEB24C' :
			//            d > 10000   ? '#FED976' :
			//                       '#FFEDA0';
			// }

			function getColor(d) {
			    return d > legend_num_arr[7] ? '#800026' :
			           d > legend_num_arr[6]  ? '#BD0026' :
			           d > legend_num_arr[5]  ? '#E31A1C' :
			           d > legend_num_arr[4]  ? '#FC4E2A' :
			           d > legend_num_arr[3]   ? '#FD8D3C' :
			           d > legend_num_arr[2]   ? '#FEB24C' :
			           d > legend_num_arr[1]   ? '#FED976' :
			                      '#FFEDA0';
			}

			function style(feature) {
			    return {
			        fillColor: getColor(feature.properties.Population),
			        weight: 2,
			        opacity: 1,
			        color: 'white',
			        dashArray: '3',
			        fillOpacity: 0.7
			    };
			}

			// Add legend to the map
			var legend = L.control({position: 'bottomright'});

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			        grades = [0, legend_num_arr[0], legend_num_arr[1], legend_num_arr[2], legend_num_arr[3], legend_num_arr[4]],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
			    for (var i = 0; i < grades.length; i++) {
			        div.innerHTML +=
			            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
			            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
			    }

			    return div;
			};

			legend.addTo(map);

			// Add info of Population
			var info = L.control();

			info.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			    this.update();
			    return this._div;
			};

			// method that we will use to update the control based on feature properties passed
			info.update = function (props) {
				// console.log(props);
			    this._div.innerHTML = '<h4>Iowa Population Density</h4>' +  (props ?
			        '<b>' + props.name + '</b><br />' + props.population + ' people / mi<sup>2</sup>'
			        : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
			};

			info.addTo(map);

			function highlightFeature(e) {
			    var layer = e.target;

			    layer.setStyle({
			        weight: 5,
			        color: '#666',
			        dashArray: '',
			        fillOpacity: 0.7
			    });

			    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			        layer.bringToFront();
			    }

			    info.update(layer.feature.properties);
			}

			function resetHighlight(e) {
			    geojson.resetStyle(e.target);
			    info.update();
			}

			function zoomToFeature(e) {
			    map.fitBounds(e.target.getBounds());
			}

			function onEachFeature(feature, layer) {
			    layer.on({
			        mouseover: highlightFeature,
			        mouseout: resetHighlight,
			        click: zoomToFeature
			    });
			}

			// geojson = L.geoJson(statesData, {
			//     style: style,
			//     onEachFeature: onEachFeature
			// }).addTo(map);

			geojson = L.geoJson(iowa_counties, {
			    style: style,
			    onEachFeature: onEachFeature
			}).addTo(map);
		}

		if ($('#leaflet_baseline_map_coba').length ){
			var baselineMap = L.map('leaflet_baseline_map_coba').setView([centroid[1],centroid[0]], 8);
	        var geojsonLayer = L.geoJson(boundary);
	        baselineMap.fitBounds(geojsonLayer.getBounds());
			
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
			    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			    maxZoom: 19
			}).addTo(baselineMap);

			//Set zoom control with your options
			// baselineMap.zoomControl.setPosition('bottomright');

			// var countriesAndBoundaries = L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
			//     layers: 'ne:ne_10m_admin_0_countries,ne:ne_10m_admin_0_boundary_lines_land'
			// }).addTo(baselineMap);

			// var wmsLayer = L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
			//     layers: 'geonode:afg_ls_500m_ku_lsi,geonode:afg_admbnda_adm1'
			//     format: 'image/png',
			//     transparent: true
			// }).addTo(baselineMap);

			var wmsLayer = 

			{
				"Travel time to nearest airport" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_airdrm',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to nearest hospital tier 1" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_hltfac_tier1',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to nearest hospital tier 2" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_hltfac_tier2',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to nearest hospital tier 3" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_hltfac_tier3',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to nearest hospital (All)" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_hltfac_tierall',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to nearest airport" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_airdrm',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to its provincial capital" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_adm1_its_provc',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to nearest provincial capital" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_adm1_nearest_provc',
						    format: 'image/png',
						    transparent: true
				}),
				"Travel time to nearest district center" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_capa_adm2_nearest_districtc',
						    format: 'image/png',
						    transparent: true
				}),

				"Flood Prediction" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:glofas_gfms_merge',
						    viewparams: today,
						    format: 'image/png',
						    transparent: true
				}),

				"Flood Risk Zone" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_fldzonea_100k_risk_landcover_pop',
						    format: 'image/png',
						    transparent: true
				}),

				"Avalanche Prediction" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:avalanche_risk_villages',
						    format: 'image/png',
						    transparent: true
				}),

				"Avalanche Risk Zone" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_avsa',
						    format: 'image/png',
						    transparent: true
				}),

				"Multi-criteria Susceptibility Index" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_ls_500m_ku_lsi',
						    format: 'image/png',
						    transparent: true
				}),
				"Landslide Susceptibility (S1)" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_ls_30m_wb_s1',
						    format: 'image/png',
						    transparent: true
				}),
				"Landslide Susceptibility (S2)" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_ls_30m_wb_s2',
						    format: 'image/png',
						    transparent: true
				}),
				"Landslide Susceptibility (S3)" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_ls_30m_wb_s3',
						    format: 'image/png',
						    transparent: true
				}),
				"Earthquake Shakemap" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:earthquake_shakemap',
						    cql_filter: "event_code='10008rah'",
						    format: 'image/png',
						    transparent: true
				}),
				"Provincial Boundary" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
						    layers: 'geonode:afg_admbnda_adm1',
						    format: 'image/png',
						    transparent: true
				})


			};

			// L.control.layers(wmsLayer).addTo(baselineMap);
			var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(baselineMap);

			// var testTimeLayer = L.timeDimension.layer.wms(wmsLayer, {
			// 	setDefaultTime: true
			// 	// requestTimeFromCapabilities: true,
			//  //    updateTimeDimension: true
			// });
			// testTimeLayer.addTo(baselineMap);

			// L.timeDimension.layer.wms(wmsLayer).addTo(baselineMap);

			// wmsLayer.addTo(baselineMap);

			// Marker point
			var markers = L.markerClusterGroup();

			// for (var num = 0; num < breweries.length; num++) {
			//  	var brewery = breweries[num];
			//  	var brewery_lat = brewery["latitude"];
			//  	var brewery_long = brewery["longitude"];
			//  	var brewery_name = brewery["brewery"];
			//  	var brewery_address = brewery["address"];
			//  	var brewery_city = brewery["city"];

			//  	var marker = L.marker([brewery_lat, brewery_long]).addTo(baselineMap);
			 	
			//  	var popup_html = '<h4>' + brewery_name + '</h4>';
			//  	popup_html += '<div>' + brewery_address + '</div>';
			//  	popup_html += '<div>' + brewery_city + '</div>'

			//  	marker.bindPopup(popup_html);
			//  	markers.addLayer(marker);
			//  }

			//  map.addLayer(markers);

			// Add Color to the Boundary
			// function getColor(d) {
			//     return d > 3000000 ? '#800026' :
			//            d > 2000000  ? '#BD0026' :
			//            d > 1000000  ? '#E31A1C' :
			//            d > 750000  ? '#FC4E2A' :
			//            d > 500000   ? '#FD8D3C' :
			//            d > 250000   ? '#FEB24C' :
			//            d > 100000   ? '#FED976' :
			//                       '#FFEDA0';
			// }

			function getColor(d) {
			    return d > legend_num_arr[7] ? '#800026' :
			           d > legend_num_arr[6]  ? '#BD0026' :
			           d > legend_num_arr[5]  ? '#E31A1C' :
			           d > legend_num_arr[4]  ? '#FC4E2A' :
			           d > legend_num_arr[3]   ? '#FD8D3C' :
			           d > legend_num_arr[2]   ? '#FEB24C' :
			           d > legend_num_arr[1]   ? '#FED976' :
			                      '#FFEDA0';
			}

			function style(feature) {
			    return {
			        // fillColor: getColor(feature.properties.Population), //Add color based on population data
			        fillColor: 'transparent',
			        weight: 2,
			        opacity: 1,
			        color: 'white',
			        dashArray: '3',
			        fillOpacity: 0.7
			    };
			}

			// Add legend to the map
			var legend = L.control({position: 'bottomleft'});

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			    	// grades = [0, legend_num_arr[0], legend_num_arr[1], legend_num_arr[2], legend_num_arr[3]],
			        // grades = [0, 100000, 250000, 500000, 750000, 1000000, 2000000, 3000000],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
			    for (var i = 0; i < legend_num_arr.length; i++) {
			        div.innerHTML +=
			            '<i style="background:' + getColor(legend_num_arr[i] + 1) + '"></i> ' +
			            humanizeTableFormatter(legend_num_arr[i]) + (legend_num_arr[i + 1] ? ' &ndash; ' + humanizeTableFormatter(legend_num_arr[i + 1]) + '<br>' : '+');
			    }

			    return div;
			};

			legend.addTo(baselineMap);

			// Add info of Population
			var info = L.control();

			info.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			    this.update();
			    return this._div;
			};

			// method that we will use to update the control based on feature properties passed
			info.update = function (props) {
				// console.log(props);
			    this._div.innerHTML = 
			    	'<h4>' + chosen_label + '</h4>' 
			    	+ (props ?
			        	'<b>' + props.na_en 
			        	+ '</b><br />' + overview_legend[0] + ' : ' + humanizeTableFormatter(props.Population) 
			        	+ '<br />'+ total_category[0] + ' : ' + humanizeTableFormatter(props.hlt_total)
			        	+ '<br />' + hlt_category[0] + ' : ' + humanizeTableFormatter(props.hlt_h1)
			        	+ '<br />' + hlt_category[1] + ' : ' + humanizeTableFormatter(props.hlt_h2)
			        	+ '<br />' + hlt_category[2] + ' : ' + humanizeTableFormatter(props.hlt_h3)
			        	+ '<br />' + hlt_category[3] + ' : ' + humanizeTableFormatter(props.hlt_chc)
			        	+ '<br />' + hlt_category[4] + ' : ' + humanizeTableFormatter(props.hlt_bhc)
			        	+ '<br />' + hlt_category[5] + ' : ' + humanizeTableFormatter(props.hlt_shc)
			        	+ '<br />' + hlt_category[6] + ' : ' + humanizeTableFormatter(props.hlt_others)
			        	+ '<br />' + total_category[1] + ' : ' + humanizeTableFormatter(props.road_total) + ' km'
			        	+ '<br />' + roadnetwork_category[0] + ' : ' + humanizeTableFormatter(props.road_highway) + ' km'
			        	+ '<br />' + roadnetwork_category[1] + ' : ' + humanizeTableFormatter(props.road_primary) + ' km'
			        	+ '<br />' + roadnetwork_category[2] + ' : ' + humanizeTableFormatter(props.road_secondary) + ' km'
			        	+ '<br />' + roadnetwork_category[3] + ' : ' + humanizeTableFormatter(props.road_tertiary) + ' km'
			        	+ '<br />' + roadnetwork_category[4] + ' : ' + humanizeTableFormatter(props.road_residential) + ' km'
			        	+ '<br />' + roadnetwork_category[5] + ' : ' + humanizeTableFormatter(props.road_track) + ' km'
			        	+ '<br />' + roadnetwork_category[6] + ' : ' + humanizeTableFormatter(props.road_path) + ' km'
			        : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
			};

			info.addTo(baselineMap);

			function highlightFeature(e) {
			    var layer = e.target;

			    layer.setStyle({
			        weight: 5,
			        color: '#666',
			        dashArray: '',
			        fillOpacity: 0.7
			    });

			    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			        layer.bringToFront();
			    }

			    info.update(layer.feature.properties);
			}

			function resetHighlight(e) {
			    geojson.resetStyle(e.target);
			    info.update();
			}

			function zoomToFeature(e) {
			    map.fitBounds(e.target.getBounds());
			}

			function onEachFeature(feature, layer) {
			    layer.on({
			        mouseover: highlightFeature,
			        mouseout: resetHighlight,
			        // click: zoomToFeature
			    });
			}

			geojson = L.geoJson(boundary, {
			    style: style,
			    onEachFeature: onEachFeature
			}).addTo(baselineMap);

			// Call the getContainer routine.
			var htmlObject = controlLayer.getContainer();
			// Get the desired parent node.
			var a = document.getElementById('control_layer');

			// Finally append that node to the new parent.
			function setParent(el, newParent)
			{
			    newParent.appendChild(el);
			}
			setParent(htmlObject, a);
		}

		if ($('#leaflet_baseline_map').length ){
			var geojson;
			var baselineMap = L.map('leaflet_baseline_map').setView([centroid[1],centroid[0]], 8);
	        var geojsonLayer = L.geoJson(boundary);
	        baselineMap.fitBounds(geojsonLayer.getBounds());
			
			L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
			    attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
			    maxZoom: 19
			}).addTo(baselineMap);

			// Marker point
			var markers = L.markerClusterGroup();

			// for (var num = 0; num < breweries.length; num++) {
			//  	var brewery = breweries[num];
			//  	var brewery_lat = brewery["latitude"];
			//  	var brewery_long = brewery["longitude"];
			//  	var brewery_name = brewery["brewery"];
			//  	var brewery_address = brewery["address"];
			//  	var brewery_city = brewery["city"];

			//  	var marker = L.marker([brewery_lat, brewery_long]).addTo(baselineMap);
			 	
			//  	var popup_html = '<h4>' + brewery_name + '</h4>';
			//  	popup_html += '<div>' + brewery_address + '</div>';
			//  	popup_html += '<div>' + brewery_city + '</div>'

			//  	marker.bindPopup(popup_html);
			//  	markers.addLayer(marker);
			//  }

			//  map.addLayer(markers);

			// Add Color to the Boundary
			// function getColor(d) {
			//     return d > 3000000 ? '#800026' :
			//            d > 2000000  ? '#BD0026' :
			//            d > 1000000  ? '#E31A1C' :
			//            d > 750000  ? '#FC4E2A' :
			//            d > 500000   ? '#FD8D3C' :
			//            d > 250000   ? '#FEB24C' :
			//            d > 100000   ? '#FED976' :
			//                       '#FFEDA0';
			// }

			// var colorMap =
			// 	{
			// 		"tot_pop" : getColor(feature.properties.Population),
			// 		"tot_build" : getColor(feature.properties.total_buildings),
			// 		"tot_area" : getColor(feature.properties.Area),
			// 		"hlt_fac" : getColor(feature.properties.hlt_total),
			// 		"road_ntwrk" : getColor(feature.properties.road_total)
			// 	}

			function getColor(d) {
			    return d > legend_num_arr[7] ? '#800026' :
			           d > legend_num_arr[6]  ? '#BD0026' :
			           d > legend_num_arr[5]  ? '#E31A1C' :
			           d > legend_num_arr[4]  ? '#FC4E2A' :
			           d > legend_num_arr[3]   ? '#FD8D3C' :
			           d > legend_num_arr[2]   ? '#FEB24C' :
			           d > legend_num_arr[1]   ? '#FED976' :
			                      '#FFEDA0';
			}

			function style(feature) {
			    return {
			        fillColor: getColor(feature.properties.Population), //Add color based on population data
			        weight: 2,
			        opacity: 1,
			        color: 'white',
			        dashArray: '3',
			        fillOpacity: 0.7
			    };
			}

			// console.log(style);

			// Add legend to the map
			var legend = L.control({position: 'bottomleft'});

			legend.onAdd = function (map) {

			    var div = L.DomUtil.create('div', 'info legend'),
			    	// grades = [0, legend_num_arr[0], legend_num_arr[1], legend_num_arr[2], legend_num_arr[3]],
			        // grades = [0, 100000, 250000, 500000, 750000, 1000000, 2000000, 3000000],
			        labels = [];

			    // loop through our density intervals and generate a label with a colored square for each interval
			    for (var i = 0; i < legend_num_arr.length; i++) {
			        div.innerHTML +=
			            '<i style="background:' + getColor(legend_num_arr[i] + 1) + '"></i> ' +
			            humanizeTableFormatter(legend_num_arr[i]) + (legend_num_arr[i + 1] ? ' &ndash; ' + humanizeTableFormatter(legend_num_arr[i + 1]) + '<br>' : '+');
			    }

			    return div;
			};

			legend.addTo(baselineMap);

			// Add info of Population
			var info = L.control();

			info.onAdd = function (map) {
			    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
			    this.update();
			    return this._div;
			};

			// method that we will use to update the control based on feature properties passed
			info.update = function (props) {
				// console.log(props);
			    this._div.innerHTML = 
			    	'<h4>' + chosen_label + '</h4>' 
			    	+ (props ?
			        	'<b>' + props.na_en 
			        	+ '</b><br />' + overview_legend[0] + ' : ' + humanizeTableFormatter(props.Population) 
			        	+ '<br />'+ total_category[0] + ' : ' + humanizeTableFormatter(props.hlt_total)
			        	+ '<br />' + hlt_category[0] + ' : ' + humanizeTableFormatter(props.hlt_h1)
			        	+ '<br />' + hlt_category[1] + ' : ' + humanizeTableFormatter(props.hlt_h2)
			        	+ '<br />' + hlt_category[2] + ' : ' + humanizeTableFormatter(props.hlt_h3)
			        	+ '<br />' + hlt_category[3] + ' : ' + humanizeTableFormatter(props.hlt_chc)
			        	+ '<br />' + hlt_category[4] + ' : ' + humanizeTableFormatter(props.hlt_bhc)
			        	+ '<br />' + hlt_category[5] + ' : ' + humanizeTableFormatter(props.hlt_shc)
			        	+ '<br />' + hlt_category[6] + ' : ' + humanizeTableFormatter(props.hlt_others)
			        	+ '<br />' + total_category[1] + ' : ' + humanizeTableFormatter(props.road_total) + ' km'
			        	+ '<br />' + roadnetwork_category[0] + ' : ' + humanizeTableFormatter(props.road_highway) + ' km'
			        	+ '<br />' + roadnetwork_category[1] + ' : ' + humanizeTableFormatter(props.road_primary) + ' km'
			        	+ '<br />' + roadnetwork_category[2] + ' : ' + humanizeTableFormatter(props.road_secondary) + ' km'
			        	+ '<br />' + roadnetwork_category[3] + ' : ' + humanizeTableFormatter(props.road_tertiary) + ' km'
			        	+ '<br />' + roadnetwork_category[4] + ' : ' + humanizeTableFormatter(props.road_residential) + ' km'
			        	+ '<br />' + roadnetwork_category[5] + ' : ' + humanizeTableFormatter(props.road_track) + ' km'
			        	+ '<br />' + roadnetwork_category[6] + ' : ' + humanizeTableFormatter(props.road_path) + ' km'
			        : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
			};

			info.addTo(baselineMap);

			function highlightFeature(e) {
			    var layer = e.target;

			    layer.setStyle({
			        weight: 5,
			        color: '#666',
			        dashArray: '',
			        fillOpacity: 0.7
			    });

			    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			        layer.bringToFront();
			    }

			    info.update(layer.feature.properties);
			}

			function resetHighlight(e) {
			    geojson.resetStyle(e.target);
			    info.update();
			}

			function zoomToFeature(e) {
			    map.fitBounds(e.target.getBounds());
			}

			function onEachFeature(feature, layer) {
			    layer.on({
			        mouseover: highlightFeature,
			        mouseout: resetHighlight,
			        // click: zoomToFeature
			    });
			}

			geojson = L.geoJson(boundary, {
			    style: style,
			    onEachFeature: onEachFeature
			});

			// use jQuery to listen for checkbox change event
			$('div#layercontrol input[type="checkbox"]').on('change', function() {    
			    var checkbox = $(this);
			    var layer_type = checkbox.data().type;
			    // console.log(layer_type);
			    // lyr = checkbox.data().layer;
			    var lyr = checkbox.attr('data-layer');
			    // var selected_layer = colorMap[lyr]

			    if (layer_type == "geojson") {
			    	// toggle the layer
			    	if ((checkbox).is(':checked')) {
			    		// console.log(selected_layer);

			    	    // accessMap.addLayer(nAirprt);
			    	    geojson.addTo(baselineMap);
			    	    // accessMap.addLayer(selected_layer);
			    	    
			    	} else {
			    		// console.log(lyr);
			    		geojson.remove();
			    	    // accessMap.removeLayer(selected_layer);
			    	    // layer.remove();
			    	}
			    }

			})
		}

		if ($('#leaflet_baseline_map_lagi').length ){
			// console.log($(this));
			var baselineMap = initMap();

			// Data for legend based on selected layer
			// dataLegend(max_collection.Population);
			var layer_selected = "Population";

			changeValueProp(layer_selected);
			// console.log(val_collection);
			legend_num_arr = setLegendSeries(val_collection);
			// console.log(legend_num_arr);

			val_theme = 'YlOrRd';
			var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

			legend = createLegend();
			legend.addTo(baselineMap);

			var selected = null;

			var info = addInfo();
			// method that we will use to update the control based on feature properties passed
			info.update = function (props) {
				// console.log(props);
			    this._div.innerHTML = /*'<h4>' + chosen_label + '</h4>'*/ 
			    // this.info.innerHTML = '<h4>' + chosen_label + '</h4>' 
			    	
			    	/*+*/ (props ?
			        	'<span class="chosen_area">' + props.na_en + '</span>'
			        	// + '<span>' + chosen_label + '</span>'
			        	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
			        	+ '<div class="row"><div class="col-md-3 col-sm-12 col-xs-12">'
			        	+ '<div class="circle_container"><i class="icon-people_affected_population fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.Population) + '</span><span class="circle_title">' + overview_legend[0] + '</span></div>'
			        	+ '<div class="circle_container"><i class="icon-infrastructure_building fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.Buildings) + '</span><span class="circle_title">' + overview_legend[2] + '</span></div>'
			        	+ '<div class="circle_container"><i class="fa fa-tree fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.Area) + '</span><span class="circle_title">' + overview_legend[1] + '</span></div>'
			        	+ '<div class="circle_container"><i class="fa fa-hospital-o fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.hlt_total) + '</span><span class="circle_title">' + total_category[0] + '</span></div>'
			        	+ '<div class="circle_container"><i class="fa fa-road fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.road_total) + '</span><span class="circle_title">' + total_category[1] + '</span></div>'
			        	+ '</div>'

			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 Population"><div id="chart_map_pop" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 Buildings"><div id="chart_map_build" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 Area"><div id="chart_map_area" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 hlt_total"><div id="chart_map_hlt_fac" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 road_total"><div id="chart_map_road_network" class="ch-map-size" style="height:280px;"></div></div>'

			        	// + '<table class="table table-bordered table-condensed"><thead><tr><th rowspan="2"></th><th colspan="3">Tier 1</th><th>Tier 2</th><th colspan="2">Tier 3</th><th rowspan="2">Others</th><th rowspan="2">Total</th></tr><tr><th>H1</th><th>H2</th><th>H3</th><th>CHC</th><th>BHC</th><th>SHC</th></tr></thead><tbody><tr><td>Health Facilities</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_h1) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_h2) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_h3) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_chc) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_bhc) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_shc) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_others) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.hlt_total) + '</td>'
			        	// + '</tr></tbody></table>'
			        	// + '<table class="table table-bordered table-condensed"><thead><tr><th></th><th>Highway</th><th>Primary</th><th>Secondary</th><th>Tertiary</th><th>Residential</th><th>Track</th><th>Path</th><th>Total</th></tr></thead><tbody><tr><td>Road Network (km)</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_highway) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_primary) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_secondary) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_tertiary) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_residential) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_track) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_path) + '</td>'
			        	// + '<td>' + humanizeTableFormatter(props.road_total) + '</td>'
			        	// + '</tr></tbody></table>'

			        	+ '<div style="display:none;" class="col-md-2 col-sm-12 col-xs-12 hlt_total"><table class="table table-bordered table-condensed"><tr><th colspan="3">Health Facilities</th></tr><tr><th rowspan="3" class="rotate">Tier 1</th><th>H1</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_h1) + '</td></tr><tr><th>H2</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_h2) + '</td></tr><tr><th>H3</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_h3) + '</td></tr><tr><th class="rotate">Tier 2</th><th>CHC</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_chc) + '</td></tr><tr><th rowspan="2" class="rotate">Tier 3</th><th>BHC</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_bhc) + '</td></tr><tr><th>SHC</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_shc) + '</td></tr><tr><th colspan="2">Others</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_others) + '</td></tr><tr><th colspan="2" style="text-align: right;">Total</th>'
			        	+ '<td>' + humanizeTableFormatter(props.hlt_total) + '</td></tr></table></div>'

			        	+ '<div style="display:none;" class="col-md-2 col-sm-12 col-xs-12 road_total"><table class="table table-bordered table-condensed"><tr><th colspan="2">Road Network</th></tr><tr><th>Highway</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_highway) + '</td></tr><tr><th>Primary</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_primary) + '</td></tr><tr><th>Secondary</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_secondary) + '</td></tr><tr><th>Tertiary</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_tertiary) + '</td></tr><tr><th>Residential</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_residential) + '</td></tr><tr><th>Track</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_track) + '</td></tr><tr><th>Path</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_path) + '</td></tr><tr><th style="text-align: right;">Total</th>'
			        	+ '<td>' + humanizeTableFormatter(props.road_total) + '</td></tr></table></div>'

			        	+ '</div>'

			        	// + '<br />'+ total_category[0] + ' : ' + humanizeTableFormatter(props.hlt_total)
			        	// + '<br />' + hlt_category[0] + ' : ' + humanizeTableFormatter(props.hlt_h1)
			        	// + '<br />' + hlt_category[1] + ' : ' + humanizeTableFormatter(props.hlt_h2)
			        	// + '<br />' + hlt_category[2] + ' : ' + humanizeTableFormatter(props.hlt_h3)
			        	// + '<br />' + hlt_category[3] + ' : ' + humanizeTableFormatter(props.hlt_chc)
			        	// + '<br />' + hlt_category[4] + ' : ' + humanizeTableFormatter(props.hlt_bhc)
			        	// + '<br />' + hlt_category[5] + ' : ' + humanizeTableFormatter(props.hlt_shc)
			        	// + '<br />' + hlt_category[6] + ' : ' + humanizeTableFormatter(props.hlt_others)
			        	// + '<br />' + total_category[1] + ' : ' + humanizeTableFormatter(props.road_total) + ' km'
			        	// + '<br />' + roadnetwork_category[0] + ' : ' + humanizeTableFormatter(props.road_highway) + ' km'
			        	// + '<br />' + roadnetwork_category[1] + ' : ' + humanizeTableFormatter(props.road_primary) + ' km'
			        	// + '<br />' + roadnetwork_category[2] + ' : ' + humanizeTableFormatter(props.road_secondary) + ' km'
			        	// + '<br />' + roadnetwork_category[3] + ' : ' + humanizeTableFormatter(props.road_tertiary) + ' km'
			        	// + '<br />' + roadnetwork_category[4] + ' : ' + humanizeTableFormatter(props.road_residential) + ' km'
			        	// + '<br />' + roadnetwork_category[5] + ' : ' + humanizeTableFormatter(props.road_track) + ' km'
			        	// + '<br />' + roadnetwork_category[6] + ' : ' + humanizeTableFormatter(props.road_path) + ' km'
			        : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
				$('a.linkPopup').on('click', function() {
				    window.document.location="?page=baseline&code=" + (props.code) ;
				});
				$('.' + $('select#baselineOpt').val()).show();
			};

			// info.addTo(baselineMap);

			var chart = addChart();
			chart.update = function (props) { 
				chart_map_pop = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_pop',
    	                type: 'pie',
    	                // margin: [],
    	                style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
    	            },
    	            title: {
    	                text: 'Population',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            yAxis: {
    	                title: {
    	                    text: 'Total percent market share'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false,
    	                    // point: {
	                        //     events: {
	                        //         mouseOver: function(){
	                        //             this.series.chart.innerText.attr({text: Math.round(this.percentage*100)/100 + '%'});
	                        //         }//, 
	                        //         // mouseOut: function(){
	                        //         //     this.series.chart.innerText.attr({text: 112});
	                        //         // }
	                        //     }
	                        // }
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y) + ' (' + Math.round(this.percentage*100)/100 + ' %)';
    	                }
    	            },
    	            legend: {
    	            	enabled: false,
    	                align: 'center',
    	                // layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // floating: true,
    	                // margin: 20
    	                // x: 40,
    	                // y: -20
    	            },
    	            colors: colorDonutDefault,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Population',
    	                data: [[props.na_en,props.Population],[chosen_label,props.all_population-props.Population]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        }/*,
    	            function(chart) { // on complete
    	                
    	                var xpos = '50%';
    	                var ypos = '53%';
    	                var circleradius = 102;
    	            
    	            // Render the text 
    	            chart.innerText = chart.renderer.text('112', 112, 125).css({
    	                    width: circleradius*2,
    	                    color: '#a72b1f',
    	                    fontSize: '20px',
    	                    textAlign: 'center'
    	                }).attr({
    	                    // why doesn't zIndex get the text in front of the chart?
    	                    zIndex: 999
    	                }).add();
    	        	}*/
    	        );

    	        chart_map_build = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_build',
    	                type: 'pie',
    	                style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
    	            },
    	            title: {
    	                text: 'Buildings',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            yAxis: {
    	                title: {
    	                    text: ''
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y) + ' (' + Math.round(this.percentage*100)/100 + ' %)';
    	                }
    	            },
    	            legend: {
    	            	enabled: false,
    	                align: 'center',
    	                verticalAlign: 'bottom'
    	            },
    	            colors: colorDonutDefault,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Buildings',
    	                data: [[props.na_en,props.Buildings],[chosen_label,props.all_buildings-props.Buildings]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });	

    	        chart_map_area = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_area',
    	                type: 'pie',
    	                style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
    	            },
    	            title: {
    	                text: 'Area',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            yAxis: {
    	                title: {
    	                    text: ''
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y) + ' (' + Math.round(this.percentage*100)/100 + ' %)';
    	                }
    	            },
    	            legend: {
    	            	enabled: false,
    	                align: 'center',
    	                verticalAlign: 'bottom'
    	            },
    	            colors: colorDonutDefault,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Area',
    	                data: [[props.na_en,props.Area],[chosen_label,props.all_area-props.Area]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });			

				chart_map_hlt_fac = new Highcharts.Chart({
		            chart: {
		                renderTo: 'chart_map_hlt_fac',
		                type: 'pie',
		                style: {
		                    fontFamily: '"Arial", Verdana, sans-serif'
		                }
		            },
		            title: {
		                text: 'Health Facilities',
		                style: {
		                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
		                }
		            },
		            plotOptions: {
		                pie: {
		                    shadow: false
		                }
		            },
		            tooltip: {
		                formatter: function() {
		                	return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
		                }
		            },
		            legend: {
		                align: 'right',
		                layout: 'vertical',
		                verticalAlign: 'bottom'
		                // x: 40,
		                // y: 0
		            },
		            // colors: ['#ffdead','#fbccb4','#efb5ab','#df9996','#ce7977','#bd5451','#ae2029'],
		            // colors: ['#fae5c2','#f9d1ac','#f4aa92','#e76b74','#cd6768','#ba5045','#a81c07'],
		            // colors: ['#5d1e26', '#b48484', '#ecc4c2', '#806700', '#fbcc82', '#fae5c2', '#E76B74'],
		            colors: ['#ffffe0','#ffd59b','#ffa474','#f47461','#db4551','#b81b34','#8b0000'],
		            credits: {
		                enabled: false
		            },
		            series: [{
		                name: 'Health Facilities',
		                // data: [
		                // 	{
		                // 		"name": "Tier 1",
		                // 		"y": props.hlt_h1 + props.hlt_h2 + props.hlt_h3,
		                // 		"drilldown": "Tier 1"
		                // 	},
		                // 	{
		                // 		"name": "Tier 2",
		                // 		"y": props.hlt_chc,
		                // 		"drilldown": null
		                // 	},
		                // 	{
		                // 		"name": "Tier 3",
		                // 		"y": props.hlt_bhc + props.hlt_shc,
		                // 		"drilldown": "Tier 3"
		                // 	},
		                // 	{
		                // 		"name": "Others",
		                // 		"y": props.hlt_others,
		                // 		"drilldown": null
		                // 	}
		                // ],
		                data: [[hlt_category[0],props.hlt_h1],[hlt_category[1],props.hlt_h2],[hlt_category[2],props.hlt_h3],[hlt_category[3],props.hlt_chc],[hlt_category[4],props.hlt_bhc],[hlt_category[5],props.hlt_shc],[hlt_category[6],props.hlt_others]],
		                size: '90%',
		                innerSize: '65%',
		                showInLegend:true,
		                dataLabels: {
		                    enabled: false
		                }
		            }]/*,
		            drilldown: {
		            	series: [
		            		{
			            		"name": "Tier 1",
			            		"id": "Tier 1",
			            		"data": [[hlt_category[0],props.hlt_h1],[hlt_category[1],props.hlt_h2],[hlt_category[2],props.hlt_h3]]
		            		},
		            		{
			            		"name": "Tier 3",
			            		"id": "Tier 3",
			            		"data": [[hlt_category[4],props.hlt_bhc],[hlt_category[5],props.hlt_shc]]
		            		}
		            	]
		            }*/
		        });

		        chart_map_road = new Highcharts.Chart({
		        	chart: {
		        		renderTo: 'chart_map_road_network',
	        	        type: 'bar',
	        	        style: {
	        	            fontFamily: '"Arial", Verdana, sans-serif'
	        	        }
	        	    },
	        	    title: {
	        	        text: 'Road Network',
	        	        style: {
	        	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
	        	        }
	        	    },
	        	    xAxis: {
	        	        categories: roadnetwork_category,
	        	        title: {
	        	            text: null
	        	        }
	        	    },
	        	    yAxis: {
	        	        min: 0,
	        	        title: {
	        	            text: 'Length of Road (km)',
	        	            align: 'high'
	        	        },
	        	        labels: {
	        	            overflow: 'justify'
	        	        }
	        	    },
	        	    tooltip: {
	        	    	formatter: function() {
	        	    	    return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y) + ' km';
	        	    	}
	        	    },
	        	    plotOptions: {
	        	        bar: {
	        	            dataLabels: {
	        	                enabled: true,
	        	                formatter: function() {
	        	                    return humanizeTableFormatter(this.y);
	        	                }
	        	            }
	        	        }
	        	    },
	        	    legend: {
	        	    	enabled: false
	        	    },
	        	    colors: ['#CF000F'],
	        	    credits: {
	        	        enabled: false
	        	    },
	        	    series: [{
	        	        name: 'Road Network',
	        	        data: [props.road_highway, props.road_primary, props.road_secondary, props.road_tertiary, props.road_residential, props.road_track, props.road_path]
	        	    }]
		        });
			}

			geojson = L.geoJson(boundary, {
			    style: style,
			    onEachFeature: onEachFeature
			});
			// geojson.addTo(baselineMap);

			group = L.featureGroup([geojson]).addLayer(geojson)/*.addTo(baselineMap)*/;
			this_map = baselineMap;

			document.getElementById("mapInfo").appendChild(info.onAdd(baselineMap));
			// document.getElementById("group_chart").appendChild(chart.onAdd(baselineMap));

			// // Enabling pop up when clicked
			// geojson.eachLayer(function (layer) {
			//     layer.bindPopup(layer.feature.properties.na_en);
			// });

			sliderRangeValue = addSlider();

			$('select#baselineOpt').change(function(){
				group.clearLayers();
				info.update();
				// chart.update();
				layer_selected = (this.value);
			    // console.log(layer_selected);

			    // geojson.remove();
			    legend.remove();
			    // dataLegend(max_collection[layer_selected]);
			    changeValueProp(layer_selected);
			    legend_num_arr = setLegendSeries(val_collection);
			    // console.log(val_theme);
			    // console.log(legend_num_arr);
			    getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
			    legend.addTo(baselineMap);
			    // geojson.setStyle(style);
			    // geojson.addTo(baselineMap);

			    if (legend_num_arr.length==1) {
			    	updateSliderRange(0,legend_num_arr[legend_num_arr.length-1]);
			    }else{
			    	updateSliderRange(legend_num_arr[0],legend_num_arr[legend_num_arr.length-1]);
			    }

			    // group = L.featureGroup().addLayer(geojson);
			    group.setStyle(style);
			    group.addTo(baselineMap);

			});

			$('#themes').on('click','button', function (evt) {
				// add active class on selected button
				$(this).siblings().removeClass('active')
				$(this).addClass('active');

			   	val_theme = $(this).data('btn');
			   	// console.log(val_theme);
			   	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
			   	// geojson.setStyle(style);
			   	group.setStyle(style);
			   	legend.addTo(baselineMap);
			});

			// use jQuery to listen for checkbox change event
			$('div#layercontrol input[type="checkbox"]').on('change', function() {    
			    var checkbox = $(this);
			    var layer_type = checkbox.data().type;
			    // console.log(layer_type);
			    // lyr = checkbox.data().layer;
			    var lyr = checkbox.attr('data-layer');

			    // console.log( boundary.features.length);
			    // var isi = []
			    for (var i = 0; i < boundary.features.length; i++) {
			    	console.log(boundary.features.properties['total_buildings'])
			    	// isi = boundary['features'][i]['properties']['total_buildings']
			    }
				// var isi = boundary.features.properties["total_buildings"];
				// console.log(isi);

			 //    if (pop_collection.length) {
				// 	console.log(pop_collection);
				// 	var max = pop_collection.reduce(function(a, b) {
				// 	    return Math.max(a, b);
				// 	});
				// }

			    // var selected_layer = colorMap[lyr]

			    if (layer_type == "geojson") {
			    	// toggle the layer
			    	if ((checkbox).is(':checked')) {
			    		// console.log(lyr);
			    		pilih=lyr;
			    		// console.log(pilih);
			    		// console.log(style(pilih));
			    		// console.log(selected_layer);

			    	    // accessMap.addLayer(nAirprt);
			    	    geojson.addTo(baselineMap);
			    	    // accessMap.addLayer(selected_layer);
			    	    
			    	} else {
			    		// console.log(lyr);
			    		geojson.remove();
			    	    // accessMap.removeLayer(selected_layer);
			    	    // layer.remove();
			    	}
			    }

			})
		}

		if ($('#leaflet_baseline_map_lain').length ){

			L.mapbox.accessToken = 'pk.eyJ1IjoiZmlyaW5uYSIsImEiOiJjamFqMXowOGQyNTZoMzJvMmJtYWQ2ZnV4In0.89rliKnFD6YQXbxhF-zBwQ';
			var map = L.mapbox.map('leaflet_baseline_map_lain', 'mapbox.light')
			    .setView([40, -96], 4);

			// Be nice and credit our data source, Census Reporter.
			map.attributionControl.addAttribution('Data from ' +
			  '<a href="http://censusreporter.org/data/map/?table=B06011&geo_ids=040%7C01000US#">' +
			  'Census Reporter</a>');

			// Choropleth colors from http://colorbrewer2.org/
			// You can choose your own range (or different number of colors)
			// and the code will compensate.
			var hues = [
			    '#eff3ff',
			    '#bdd7e7',
			    '#6baed6',
			    '#3182bd',
			    '#08519c'];

			// The names of variables that we'll show in the UI for
			// styling. These need to match exactly.
			var variables = [
			    'B06011002 - Born in state of residence',
			    'B06011003 - Born in other state of the United States',
			    'B06011004 - Native; born outside the United States'];

			// Collect the range of each variable over the full set, so
			// we know what to color the brightest or darkest.
			var ranges = {};
			var $select = $('<select></select>')
			    .appendTo($('#variables'))
			    .on('change', function() {
			        setVariable($(this).val());
			    });
			for (var i = 0; i < variables.length; i++) {
			    ranges[variables[i]] = { min: Infinity, max: -Infinity };
			    // Simultaneously, build the UI for selecting different
			    // ranges
			    $('<option></option>')
			        .text(variables[i])
			        .attr('value', variables[i])
			        .appendTo($select);
			}

			// Create a layer of state features, and when it's done
			// loading, run loadData
			var usLayer = L.mapbox.featureLayer()
			    .loadURL('/mapbox.js/assets/data/us.geojson')
			    .addTo(map)
			    .on('ready', loadData);

			// Grab the spreadsheet of data as JSON. If you have CSV
			// data, you should convert it to JSON with
			// http://shancarter.github.io/mr-data-converter/
			function loadData() {
			    $.getJSON('/mapbox.js/assets/data/censusdata.json')
			        .done(function(data) {
			            joinData(data, usLayer);
			        });
			}

			function joinData(data, layer) {
			    // First, get the US state GeoJSON data for reference.
			    var usGeoJSON = usLayer.getGeoJSON(),
			        byState = {};

			    // Rearrange it so that instead of being a big array,
			    // it's an object that is indexed by the state name,
			    // that we'll use to join on.
			    for (var i = 0; i < usGeoJSON.features.length; i++) {
			        byState[usGeoJSON.features[i].properties.name] =
			            usGeoJSON.features[i];
			    }
			    for (i = 0; i < data.length; i++) {
			        // Match the GeoJSON data (byState) with the tabular data
			        // (data), replacing the GeoJSON feature properties
			        // with the full data.
			        byState[data[i].name].properties = data[i];
			        for (var j = 0; j < variables.length; j++) {
			            // Simultaneously build the table of min and max
			            // values for each attribute.
			            var n = variables[j];
			            ranges[n].min = Math.min(data[i][n], ranges[n].min);
			            ranges[n].max = Math.max(data[i][n], ranges[n].max);
			        }
			    }
			    // Create a new GeoJSON array of features and set it
			    // as the new usLayer content.
			    var newFeatures = [];
			    for (i in byState) {
			        newFeatures.push(byState[i]);
			    }
			    usLayer.setGeoJSON(newFeatures);
			    // Kick off by filtering on an attribute.
			    setVariable(variables[0]);
			}

			// Excuse the short function name: this is not setting a JavaScript
			// variable, but rather the variable by which the map is colored.
			// The input is a string 'name', which specifies which column
			// of the imported JSON file is used to color the map.
			function setVariable(name) {
			    var scale = ranges[name];
			    usLayer.eachLayer(function(layer) {
			        // Decide the color for each state by finding its
			        // place between min & max, and choosing a particular
			        // color as index.
			        var division = Math.floor(
			            (hues.length - 1) *
			            ((layer.feature.properties[name] - scale.min) /
			            (scale.max - scale.min)));
			        // See full path options at
			        // http://leafletjs.com/reference.html#path
			        layer.setStyle({
			            fillColor: hues[division],
			            fillOpacity: 0.8,
			            weight: 0.5
			        });
			    });
			}
		}

		if ($('#leaflet_access_map').length ){
			// Disabling checkbox if no data available
			var accessCheckbox=document.getElementsByName("access_checkbox");
			for (var i = 0; i < accessCheckbox.length; i++) {
				var r = accessCheckbox[i];
				var terpilih = r.value;
				// console.log(getMax(boundary.features, [terpilih]));
				if (getMax(boundary.features, [terpilih])==0) {
					// console.log(terpilih);
					accessCheckbox[i].disabled=true;
					$(r).closest("div").addClass("disabled");
				}
			}

			var accessMap = initMap();
		    // var accessMap = L.map('leaflet_access_map').setView([centroid[1],centroid[0]], 8);
		    // var geojsonLayer = L.geoJson(boundary);
		    // accessMap.fitBounds(geojsonLayer.getBounds());
		    
		    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
		    //     attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		    //     maxZoom: 19
		    // }).addTo(accessMap);

		    // console.log(accessMap);

		    //Set zoom control with your options
		    // accessMap.zoomControl.setPosition('bottomright');

		    var wmsLayer = 

		    {
		        "nAirprt" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_airdrm',
		                    format: 'image/png',
		                    transparent: true
		        }),
		        "nHlt1" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_hltfac_tier1',
		                    format: 'image/png',
		                    transparent: true
		        }),
		        "nHlt2" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_hltfac_tier2',
		                    format: 'image/png',
		                    transparent: true
		        }),
		        "nHlt3" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_hltfac_tier3',
		                    format: 'image/png',
		                    transparent: true
		        }),
		        "nHltAll" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_hltfac_tierall',
		                    format: 'image/png',
		                    transparent: true
		        }),
		        "nItProvCap" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_adm1_its_provc',
		                    format: 'image/png',
		                    transparent: true
		        }),
		        "nProvCap" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_adm1_nearest_provc',
		                    format: 'image/png',
		                    transparent: true
		        }),
		        "nDistCntr" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_capa_adm2_nearest_districtc',
		                    format: 'image/png',
		                    transparent: true
		        }),

		        "Provincial Boundary" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:afg_admbnda_adm1',
		                    format: 'image/png',
		                    transparent: true
		        })


		    };

		    // wmsLayer.nAirprt.addTo(accessMap);


		    // L.control.layers(wmsLayer).addTo(accessMap);
		    // var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(accessMap);

		    // Data for legend based on selected layer
		    // var layer_selected = "l1_h__near_airp";
		    // changeValueProp(layer_selected);

		    $('.lvl_choice .access_checkbox_nAirprt :checkbox:enabled').prop('checked', true);
		    sumValueProp($('.lvl_choice .access_checkbox_nAirprt :checkbox:enabled'));

		    // set_jenk_divider = setJenkNumb(val_collection.length);

			legend_num_arr = setLegendSeries(val_collection);
			// console.log(legend_num_arr);

			val_theme = 'YlOrRd';
			var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

		    legend = createLegend();
		    legend.addTo(accessMap);

		    var selected = null;

		    geojson = L.geoJson(boundary, {
		        style: style,
		        onEachFeature: onEachFeature
		    }).addTo(accessMap);

		    // var popupContent = function (e){
		    // 	// console.log(e);
		    // 	var featureProp = e.feature.properties;
		    // 	var div_popup = L.DomUtil.create('div', 'customPopupContent');
		    // 	// var div_popup = L.DomUtil.get("mapInfo");
		    // 	div_popup.innerHTML = 
		    // 		'<h4>' + featureProp.na_en + '</h4>'
		    // 		+'<table class="table table-bordered table-condensed"><thead><tr><th></th><th class="l1h">&lt; 1 h</th><th class="l2h">&lt; 2 h</th><th class="l3h">&lt; 3 h</th><th class="l4h">&lt; 4 h</th><th class="l5h">&lt; 5 h</th><th class="l6h">&lt; 6 h</th><th class="l7h">&lt; 7 h</th><th class="l8h">&lt; 8 h</th><th class="m8h">&gt; 8 h</th></tr></thead><tbody><tr><td>Nearest Airport'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__near_airp)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__near_airp)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__near_airp)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__near_airp)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__near_airp)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__near_airp)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__near_airp)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__near_airp)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__near_airp)
		    // 		// +'</td></tr><tr><td>Nearest Hospital Tier 1'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__near_hlt1)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__near_hlt1)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__near_hlt1)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__near_hlt1)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__near_hlt1)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__near_hlt1)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__near_hlt1)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__near_hlt1)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__near_hlt1)
		    // 		// +'</td></tr><tr><td>Nearest Hospital Tier 2'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__near_hlt2)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__near_hlt2)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__near_hlt2)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__near_hlt2)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__near_hlt2)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__near_hlt2)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__near_hlt2)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__near_hlt2)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__near_hlt2)
		    // 		// +'</td></tr><tr><td>Nearest Hospital Tier 3'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__near_hlt3)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__near_hlt3)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__near_hlt3)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__near_hlt3)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__near_hlt3)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__near_hlt3)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__near_hlt3)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__near_hlt3)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__near_hlt3)
		    // 		// +'</td></tr><tr><td>Nearest Hospital Tier All'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__near_hltall)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__near_hltall)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__near_hltall)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__near_hltall)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__near_hltall)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__near_hltall)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__near_hltall)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__near_hltall)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__near_hltall)
		    // 		// +'</td></tr><tr><td>Its Provincial Capital'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__itsx_prov)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__itsx_prov)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__itsx_prov)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__itsx_prov)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__itsx_prov)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__itsx_prov)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__itsx_prov)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__itsx_prov)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__itsx_prov)
		    // 		// +'</td></tr><tr><td>Nearest Provincial Capital'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__near_prov)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__near_prov)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__near_prov)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__near_prov)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__near_prov)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__near_prov)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__near_prov)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__near_prov)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__near_prov)
		    // 		// +'</td></tr><tr><td>Nearest District Center'
		    // 		// +'</td><td class="l1h">' + humanizeTableFormatter(featureProp.l1_h__near_dist)
		    // 		// +'</td><td class="l2h">' + humanizeTableFormatter(featureProp.l2_h__near_dist)
		    // 		// +'</td><td class="l3h">' + humanizeTableFormatter(featureProp.l3_h__near_dist)
		    // 		// +'</td><td class="l4h">' + humanizeTableFormatter(featureProp.l4_h__near_dist)
		    // 		// +'</td><td class="l5h">' + humanizeTableFormatter(featureProp.l5_h__near_dist)
		    // 		// +'</td><td class="l6h">' + humanizeTableFormatter(featureProp.l6_h__near_dist)
		    // 		// +'</td><td class="l7h">' + humanizeTableFormatter(featureProp.l7_h__near_dist)
		    // 		// +'</td><td class="l8h">' + humanizeTableFormatter(featureProp.l8_h__near_dist)
		    // 		// +'</td><td class="m8h">' + humanizeTableFormatter(featureProp.g8_h__near_dist)
		    // 		+'</td></tr></tbody></table>'
		    // 		+ '<a class="linkPopup">Go To ' + (featureProp.na_en) +'</a>';
		    // 	$('a.linkPopup', div_popup).on('click', function() {
		    // 	    window.document.location="?page=accessibility&code=" + (featureProp.code) ;
		    // 	});

		    // 	return div_popup;
		    // }

		    var info = addInfo();

		    // var info = L.control();

		    // info.onAdd = function (map) {
		    // 	this.info = L.DomUtil.get("mapInfo"); // get that DIV
		    //     //this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
		    //     this.update();
		    //     console.log(this._div);
		    //     console.log(this.info);
		    //     // return this._div;
		    // };

		    info.update = function (props) {
		    	// console.log(props);
		        this._div.innerHTML = 
		        // this.info.innerHTML = '<h4>' + chosen_label + '</h4>' 
		        	(props ?
		            	'<span class="chosen_area">' + props.na_en + '</span>'
		            	+ '<div class="row">'

		            	+ '<div style="display:none;" class="col-md-1 col-sm-12 col-xs-12 access_radio_gsm">'
		            	// + '<div class="circle_container"><i class="icon-people_affected_population fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.Population) + '</span><span class="circle_title">' + 'Population' + '</span></div>'
		            	// + '<div class="circle_container"><i class="icon-infrastructure_building fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.Buildings) + '</span><span class="circle_title">' + 'Buildings' + '</span></div>'
		            	// + '<div class="circle_container"><i class="fa fa-tree fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.Area) + '</span><span class="circle_title">' + 'Area' + '</span></div>'

		            	+ '<div style="display:none;" class="circle_container pop_on_gsm_coverage"><i class="icon-people_affected_population fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.pop_on_gsm_coverage) + '</span><span class="circle_title">' + 'Pop on GSM Cov' + '</span></div>'
		            	+ '<div style="display:none;" class="circle_container buildings_on_gsm_coverage"><i class="icon-infrastructure_building fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.buildings_on_gsm_coverage) + '</span><span class="circle_title">' + 'Build on GSM Cov' + '</span></div>'
		            	+ '<div style="display:none;" class="circle_container area_on_gsm_coverage"><i class="fa fa-tree fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.area_on_gsm_coverage) + '</span><span class="circle_title">' + 'Area on GSM Cov' + '</span></div>'
		            	+ '</div>'

		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nAirprt"><div id="chart_map_nAirport" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nHlt1"><div id="chart_map_nHlt1" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nHlt2"><div id="chart_map_nHlt2" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nHlt3"><div id="chart_map_nHlt3" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nHltAll"><div id="chart_map_nHltAll" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nItProvCap"><div id="chart_map_nItProvCap" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nProvCap"><div id="chart_map_nProvCap" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 access_checkbox_nDistCntr"><div id="chart_map_nDistCntr" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 pop_on_gsm_coverage"><div id="chart_map_gsmPop" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12"><div id="chart_map_gsmBuilding" class="ch-map-size" style="height:280px;"></div></div>'
		            	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 area_on_gsm_coverage"><div id="chart_map_gsmArea" class="ch-map-size" style="height:280px;"></div></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nAirprt"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Nearest Airport</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_airp)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_airp)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_airp)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_airp)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_airp)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_airp)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_airp)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_airp)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_airp)
		            	+ '</td></tr></table></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nHlt1"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Nearest Hospital Tier 1</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hlt1)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hlt1)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hlt1)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hlt1)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hlt1)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hlt1)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hlt1)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hlt1)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hlt1)
		            	+ '</td></tr></table></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nHlt2"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Nearest Hospital Tier 2</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hlt2)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hlt2)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hlt2)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hlt2)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hlt2)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hlt2)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hlt2)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hlt2)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hlt2)
		            	+ '</td></tr></table></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nHlt3"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Nearest Hospital Tier 3</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hlt3)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hlt3)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hlt3)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hlt3)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hlt3)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hlt3)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hlt3)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hlt3)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hlt3)
		            	+ '</td></tr></table></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nHltAll"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Nearest Hospital Tier All</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hltall)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hltall)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hltall)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hltall)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hltall)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hltall)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hltall)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hltall)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hltall)
		            	+ '</td></tr></table></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nItProvCap"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Its Provincial Capital</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__itsx_prov)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__itsx_prov)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__itsx_prov)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__itsx_prov)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__itsx_prov)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__itsx_prov)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__itsx_prov)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__itsx_prov)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__itsx_prov)
		            	+ '</td></tr></table></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nProvCap"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Nearest Provincial Capital</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_prov)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_prov)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_prov)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_prov)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_prov)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_prov)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_prov)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_prov)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_prov)
		            	+ '</td></tr></table></div>'

		            	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 access_checkbox_nDistCntr"><table class="table table-bordered table-condensed"><tr><th>Travel Time</th><th>Nearest District Center</th></tr><tr>'
		            	+ '<th class="l1h">' + time_legend[0]
		            	+ '</th><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_dist)
		            	+ '</td></tr><tr><th class="l2h">' + time_legend[1]
		            	+ '</th><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_dist)
		            	+ '</td></tr><tr><th class="l3h">' + time_legend[2]
		            	+ '</th><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_dist)
		            	+ '</td></tr><tr><th class="l4h">' + time_legend[3]
		            	+ '</th><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_dist)
		            	+ '</td></tr><tr><th class="l5h">' + time_legend[4]
		            	+ '</th><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_dist)
		            	+ '</td></tr><tr><th class="l6h">' + time_legend[5]
		            	+ '</th><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_dist)
		            	+ '</td></tr><tr><th class="l7h">' + time_legend[6]
		            	+ '</th><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_dist)
		            	+ '</td></tr><tr><th class="l8h">' + time_legend[7]
		            	+ '</th><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_dist)
		            	+ '</td></tr><tr><th class="m8h">' + time_legend[8]
		            	+ '</th><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_dist)
		            	+ '</td></tr></table></div>'

		            	+ '</div>'

		            	// +'<div class="col-md-12 col-sm-12 col-xs-12"><table class="table table-bordered table-condensed"><thead><tr><th></th><th class="l1h">&lt; 1 h</th><th class="l2h">&lt; 2 h</th><th class="l3h">&lt; 3 h</th><th class="l4h">&lt; 4 h</th><th class="l5h">&lt; 5 h</th><th class="l6h">&lt; 6 h</th><th class="l7h">&lt; 7 h</th><th class="l8h">&lt; 8 h</th><th class="m8h">&gt; 8 h</th></tr></thead><tbody><tr><td>Nearest Airport'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_airp)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_airp)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_airp)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_airp)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_airp)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_airp)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_airp)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_airp)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_airp)
		            	// +'</td></tr><tr><td>Nearest Hospital Tier 1'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hlt1)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hlt1)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hlt1)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hlt1)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hlt1)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hlt1)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hlt1)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hlt1)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hlt1)
		            	// +'</td></tr><tr><td>Nearest Hospital Tier 2'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hlt2)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hlt2)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hlt2)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hlt2)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hlt2)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hlt2)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hlt2)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hlt2)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hlt2)
		            	// +'</td></tr><tr><td>Nearest Hospital Tier 3'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hlt3)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hlt3)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hlt3)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hlt3)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hlt3)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hlt3)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hlt3)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hlt3)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hlt3)
		            	// +'</td></tr><tr><td>Nearest Hospital Tier All'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_hltall)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_hltall)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_hltall)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_hltall)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_hltall)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_hltall)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_hltall)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_hltall)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_hltall)
		            	// +'</td></tr><tr><td>Its Provincial Capital'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__itsx_prov)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__itsx_prov)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__itsx_prov)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__itsx_prov)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__itsx_prov)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__itsx_prov)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__itsx_prov)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__itsx_prov)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__itsx_prov)
		            	// +'</td></tr><tr><td>Nearest Provincial Capital'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_prov)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_prov)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_prov)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_prov)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_prov)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_prov)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_prov)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_prov)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_prov)
		            	// +'</td></tr><tr><td>Nearest District Center'
		            	// +'</td><td class="l1h">' + humanizeTableFormatter(props.l1_h__near_dist)
		            	// +'</td><td class="l2h">' + humanizeTableFormatter(props.l2_h__near_dist)
		            	// +'</td><td class="l3h">' + humanizeTableFormatter(props.l3_h__near_dist)
		            	// +'</td><td class="l4h">' + humanizeTableFormatter(props.l4_h__near_dist)
		            	// +'</td><td class="l5h">' + humanizeTableFormatter(props.l5_h__near_dist)
		            	// +'</td><td class="l6h">' + humanizeTableFormatter(props.l6_h__near_dist)
		            	// +'</td><td class="l7h">' + humanizeTableFormatter(props.l7_h__near_dist)
		            	// +'</td><td class="l8h">' + humanizeTableFormatter(props.l8_h__near_dist)
		            	// +'</td><td class="m8h">' + humanizeTableFormatter(props.g8_h__near_dist)
		            	// +'</td></tr></tbody></table></div>'
		            	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
		            : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
				$('a.linkPopup').on('click', function() {
				    window.document.location="?page=accessibility&code=" + (props.code) ;
				});
				// $('#accessOpt').val();
				$('.' + $('#accessOpt').val()).show();
				$('.' + $('input[name=access_radio]:checked').val()).show();
		    };

    		var chart = addChart();
    		chart.update = function (props) { 
    	        chart_map_nAirport = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nAirport',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Nearest Airport',
            	        // verticalAlign: 'bottom',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Near Airport',
            	        data: [props.l1_h__near_airp, props.l2_h__near_airp, props.l3_h__near_airp, props.l4_h__near_airp, props.l5_h__near_airp, props.l6_h__near_airp, props.l7_h__near_airp, props.l8_h__near_airp, props.g8_h__near_airp]
            	    }]
    	        });
    	        chart_map_nHlt1 = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nHlt1',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Nearest Health Facilities Tier 1',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Near Health Facilities Tier 1',
            	        data: [props.l1_h__near_hlt1, props.l2_h__near_hlt1, props.l3_h__near_hlt1, props.l4_h__near_hlt1, props.l5_h__near_hlt1, props.l6_h__near_hlt1, props.l7_h__near_hlt1, props.l8_h__near_hlt1, props.g8_h__near_hlt1]
            	    }]
    	        });
    	        chart_map_nHlt2 = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nHlt2',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Nearest Health Facilities Tier 2',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Near Health Facilities Tier 2',
            	        data: [props.l1_h__near_hlt2, props.l2_h__near_hlt2, props.l3_h__near_hlt2, props.l4_h__near_hlt2, props.l5_h__near_hlt2, props.l6_h__near_hlt2, props.l7_h__near_hlt2, props.l8_h__near_hlt2, props.g8_h__near_hlt2]
            	    }]
    	        });
    	        chart_map_nHlt3 = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nHlt3',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Nearest Health Facilities Tier 3',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Near Health Facilities Tier 3',
            	        data: [props.l1_h__near_hlt3, props.l2_h__near_hlt3, props.l3_h__near_hlt3, props.l4_h__near_hlt3, props.l5_h__near_hlt3, props.l6_h__near_hlt3, props.l7_h__near_hlt3, props.l8_h__near_hlt3, props.g8_h__near_hlt3]
            	    }]
    	        });
    	        chart_map_nHltAll = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nHltAll',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Nearest Health Facilities All Tier',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Near Health Facilities All Tier',
            	        data: [props.l1_h__near_hltall, props.l2_h__near_hltall, props.l3_h__near_hltall, props.l4_h__near_hltall, props.l5_h__near_hltall, props.l6_h__near_hltall, props.l7_h__near_hltall, props.l8_h__near_hltall, props.g8_h__near_hltall]
            	    }]
    	        });
    	        chart_map_nItProvCap = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nItProvCap',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Its Provincial Capital',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Its Provincial Capital',
            	        data: [props.l1_h__itsx_prov, props.l2_h__itsx_prov, props.l3_h__itsx_prov, props.l4_h__itsx_prov, props.l5_h__itsx_prov, props.l6_h__itsx_prov, props.l7_h__itsx_prov, props.l8_h__itsx_prov, props.g8_h__itsx_prov]
            	    }]
    	        });
    	        chart_map_nProvCap = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nProvCap',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Nearest Provincial Capital',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Near Provincial Capital',
            	        data: [props.l1_h__near_prov, props.l2_h__near_prov, props.l3_h__near_prov, props.l4_h__near_prov, props.l5_h__near_prov, props.l6_h__near_prov, props.l7_h__near_prov, props.l8_h__near_prov, props.g8_h__near_prov]
            	    }]
    	        });
    	        chart_map_nDistCntr = new Highcharts.Chart({
    	        	chart: {
    	        		renderTo: 'chart_map_nDistCntr',
            	        type: 'bar',
            	        style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
            	    },
            	    title: {
            	        text: 'Travel Time to Nearest District Center',
            	        style: {
            	            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
            	        }
            	    },
            	    xAxis: {
            	        categories: time_legend,
            	        title: {
            	            text: 'Travel Time'
            	        }
            	    },
            	    yAxis: {
            	        min: 0,
            	        title: {
            	            text: 'Population',
            	            align: 'high'
            	        },
            	        labels: {
            	            overflow: 'justify'
            	        }
            	    },
            	    tooltip: {
            	        formatter: function() {
            	            return '<b>'+ this.x +'</b>: '+ humanizeTableFormatter(this.y);
            	        }
            	    },
            	    plotOptions: {
            	        bar: {
            	        	colorByPoint: true,
            	            dataLabels: {
            	                enabled: true,
            	                formatter: function() {
            	                    return humanizeTableFormatter(this.y);
            	                }
            	            }
            	        }
            	    },
            	    legend: {
            	        enabled: false
            	    },
            	    colors: colorList,
            	    credits: {
            	        enabled: false
            	    },
            	    series: [{
            	        name: 'Travel Time Near District Center',
            	        data: [props.l1_h__near_dist, props.l2_h__near_dist, props.l3_h__near_dist, props.l4_h__near_dist, props.l5_h__near_dist, props.l6_h__near_dist, props.l7_h__near_dist, props.l8_h__near_dist, props.g8_h__near_dist]
            	    }]
    	        });
    	        chart_map_gsmPop = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_gsmPop',
    	                type: 'pie',
    	                // margin: [],
    	                style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
    	            },
    	            title: {
    	                text: 'GSM Coverage Population',
    	                verticalAlign: 'bottom',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            yAxis: {
    	                title: {
    	                    text: 'Total percent market share'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'left',
    	                // layout: 'vertical',
    	                verticalAlign: 'top'
    	                // floating: true,
    	                // margin: 20
    	                // x: 40,
    	                // y: -20
    	            },
    	            colors: colorDonutDefault,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'GSM Coverage Population',
    	                data: [[gsm_legend[0],props.pop_on_gsm_coverage],[gsm_legend[1],props.Population-props.pop_on_gsm_coverage]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    	        chart_map_gsmArea = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_gsmArea',
    	                type: 'pie',
    	                style: {
            	            fontFamily: '"Arial", Verdana, sans-serif'
            	        }
    	            },
    	            title: {
    	                text: 'GSM Coverage Area',
    	                verticalAlign: 'bottom',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'left',
    	                verticalAlign: 'top'
    	            },
    	            colors: colorDonutDefault,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'GSM Coverage Area',
    	                data: [[gsm_legend[0],props.area_on_gsm_coverage],[gsm_legend[1],props.Area-props.area_on_gsm_coverage]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });

    	        // chart_map_nAirport.setOptions(Highcharts.theme);
    		}

		    // var popupOptions = {
		    // 	className: "customPopup"
		    // }

		    // info.addTo(accessMap);

		    // Enabling pop up when clicked
		    // geojson.eachLayer(function (layer) {
		    // 	popupContent(layer);
		    //     layer.bindPopup(popupContent, popupOptions);
		    // });

		    document.getElementById("mapInfo").appendChild(info.onAdd(accessMap));

		    $('#accessOpt').on('change', function() {
		    	info.update();
		    	var selected_opt = $(this).val();
		    	$("input[name='access_checkbox']").each(function () {
                    $(this).prop('checked', false);
                });
                $('input[name=access_radio]:checked').prop('checked', false);
		    	$('.access_opt').hide();
		    	$('.' + selected_opt).show();

		    	if (selected_opt == 'access_radio_gsm') {
		    		$('.lvl_choice .' + selected_opt + ' :radio:first').prop('checked', true);
		    		changeValueProp($('.lvl_choice .' + selected_opt + ' :radio:first').val());
		    	}else{
		    		// $('.lvl_choice .' + selected_opt + ' :checkbox:first').prop('checked', true);
		    		// changeValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:first').val());

		    		// Checked every checkbox which not disabled and change the value
		    		$('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
		    		sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));
		    	}

		    	// console.log(legend_num_arr);
	    	    
	    	    legend.remove();
	    		legend_num_arr = setLegendSeries(val_collection);
	    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	    		legend.addTo(accessMap);
	    		geojson.setStyle(style);
		    });

		    $('#themes').on('click','button', function (evt) {
		    	// add active class on selected button
		    	$(this).siblings().removeClass('active')
		    	$(this).addClass('active');

		       	val_theme = $(this).data('btn');
		       	// console.log(val_theme);
		       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		       	geojson.setStyle(style);
		       	// group.setStyle(style);
		       	legend.addTo(accessMap);
		    });

		    $('#layercontrol input[type=radio]').change(function(){
		    	info.update();

		    	layer_selected = (this.value);
		        // console.log(layer_selected);

		        legend.remove();
		        changeValueProp(layer_selected);
		        legend_num_arr = setLegendSeries(val_collection);
		        getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		        legend.addTo(accessMap);
		        geojson.setStyle(style);

		    });

		    $("input[name='access_checkbox']:checkbox").on("change", function() {
		    	var choosen_cat = $("input[name='access_checkbox']:checkbox:checked");
		    	if (choosen_cat.length > 0) {
		    		sumValueProp(choosen_cat);
		    		legend.remove();
		    		legend_num_arr = setLegendSeries(val_collection);
		    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		    		legend.addTo(accessMap);
		    		geojson.setStyle(style);
		    	}else{
		    		legend.remove();
		    		sumValueProp(choosen_cat);
		    		geojson.setStyle(style);
		    	}
		    	
		    });

		    // use jQuery to listen for checkbox change event
		    $('div#layercontrol .wms_check input[type="checkbox"]').on('change', function() {    
		        var checkbox = $(this);
		        // lyr = checkbox.data().layer;
		        var lyr = checkbox.attr('data-layer');
		        var selected_layer = wmsLayer[lyr];

		        // toggle the layer
		        if ((checkbox).is(':checked')) {
		        	// console.log(selected_layer);

		            // accessMap.addLayer(nAirprt);

		            accessMap.addLayer(selected_layer);
		            
		        } else {
		        	// console.log(lyr);
		            accessMap.removeLayer(selected_layer);
		            // layer.remove();
		        }
		    })
		}

		if ($('#leaflet_fforecast_map').length ){
			var fforecastMap = initMap();

		    // var fforecastMap = L.map('leaflet_fforecast_map').setView([centroid[1],centroid[0]], 8);
		    // var geojsonLayer = L.geoJson(boundary);
		    // fforecastMap.fitBounds(geojsonLayer.getBounds());
		    
		    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
		    //     attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		    //     maxZoom: 19
		    // }).addTo(fforecastMap);

		    //Set zoom control with your options
		    // fforecastMap.zoomControl.setPosition('bottomright');

		    var wmsLayer = 

		    {

		        "fforecast" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:glofas_gfms_merge',
		                    viewparams: today,
		                    format: 'image/png',
		                    transparent: true
		        })

		    };

		    wmsLayer.fforecast.addTo(fforecastMap);

		    // L.control.layers(wmsLayer).addTo(fforecastMap);
		    // var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(fforecastMap);

	        // Data for legend based on selected layer
	        // dataLegend(max_collection.pop_shake_weak);

	        // var layer_selected = "flashflood_forecast_low_pop";
	        // changeValueProp(layer_selected);

	        $('.lvl_choice .fforecast_checkbox_flash_pop :checkbox:enabled').prop('checked', true);
	        sumValueProp($('.lvl_choice .fforecast_checkbox_flash_pop :checkbox:enabled'));
	    	legend_num_arr = setLegendSeries(val_collection);

	    	val_theme = 'YlOrRd';
	    	var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

	        legend = createLegend();
	        legend.addTo(fforecastMap);

	        var info = addInfo();
            info.update = function (props) {
            	// console.log(props);
                this._div.innerHTML = 
                // this.info.innerHTML = '<h4>' + chosen_label + '</h4>' 
                	(props ?
                    	'<span class="chosen_area">' + props.na_en + '</span>'
                    	+ '<div class="row">'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_flash_pop"><div id="chart_map_fforecast" class="ch-map-size" style="height:280px;"></div></div>'
                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_river_gg_pop"><div id="chart_map_ggfforecast" class="ch-map-size" style="height:280px;"></div></div>'
                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_river_gl_pop"><div id="chart_map_glfforecast" class="ch-map-size" style="height:280px;"></div></div>'
                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_river_gf_pop"><div id="chart_map_gffforecast" class="ch-map-size" style="height:280px;"></div></div>'

                    	+ '<div style="display: none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_flash_pop"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Affected Population</th></tr><tr>'
                    	+ '<th class="low">' + fforecast_cat[0]
                    	+ '</th><td class="low">' + humanizeTableFormatter(props.flashflood_forecast_low_pop)
                    	+ '</td></tr><tr><th class="mod">' + fforecast_cat[1]
                    	+ '</th><td class="mod">' + humanizeTableFormatter(props.flashflood_forecast_med_pop)
                    	+ '</td></tr><tr><th class="high">' + fforecast_cat[2]
                    	+ '</th><td class="high">' + humanizeTableFormatter(props.flashflood_forecast_high_pop)
                    	+ '</td></tr><tr><th class="vhigh">' + fforecast_cat[3]
                    	+ '</th><td class="vhigh">' + humanizeTableFormatter(props.flashflood_forecast_veryhigh_pop)
                    	+ '</td></tr><tr><th class="ext">' + fforecast_cat[4]
                    	+ '</th><td class="ext">' + humanizeTableFormatter(props.flashflood_forecast_extreme_pop)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display: none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_river_gg_pop"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Affected Population</th></tr><tr>'
                    	+ '<th class="low">' + fforecast_cat[0]
                    	+ '</th><td class="low">' + humanizeTableFormatter(props.gfms_glofas_riverflood_forecast_low_pop)
                    	+ '</td></tr><tr><th class="mod">' + fforecast_cat[1]
                    	+ '</th><td class="mod">' + humanizeTableFormatter(props.gfms_glofas_riverflood_forecast_med_pop)
                    	+ '</td></tr><tr><th class="high">' + fforecast_cat[2]
                    	+ '</th><td class="high">' + humanizeTableFormatter(props.gfms_glofas_riverflood_forecast_high_pop)
                    	+ '</td></tr><tr><th class="vhigh">' + fforecast_cat[3]
                    	+ '</th><td class="vhigh">' + humanizeTableFormatter(props.gfms_glofas_riverflood_forecast_veryhigh_pop)
                    	+ '</td></tr><tr><th class="ext">' + fforecast_cat[4]
                    	+ '</th><td class="ext">' + humanizeTableFormatter(props.gfms_glofas_riverflood_forecast_extreme_pop)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display: none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_river_gl_pop"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Affected Population</th></tr><tr>'
                    	+ '<th class="low">' + fforecast_cat[0]
                    	+ '</th><td class="low">' + humanizeTableFormatter(props.glofas_riverflood_forecast_low_pop)
                    	+ '</td></tr><tr><th class="mod">' + fforecast_cat[1]
                    	+ '</th><td class="mod">' + humanizeTableFormatter(props.glofas_riverflood_forecast_med_pop)
                    	+ '</td></tr><tr><th class="high">' + fforecast_cat[2]
                    	+ '</th><td class="high">' + humanizeTableFormatter(props.glofas_riverflood_forecast_high_pop)
                    	+ '</td></tr><tr><th class="vhigh">' + fforecast_cat[3]
                    	+ '</th><td class="vhigh">' + humanizeTableFormatter(props.glofas_riverflood_forecast_veryhigh_pop)
                    	+ '</td></tr><tr><th class="ext">' + fforecast_cat[4]
                    	+ '</th><td class="ext">' + humanizeTableFormatter(props.glofas_riverflood_forecast_extreme_pop)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display: none;" class="col-md-4 col-sm-12 col-xs-12 fforecast_checkbox_river_gf_pop"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Affected Population</th></tr><tr>'
                    	+ '<th class="low">' + fforecast_cat[0]
                    	+ '</th><td class="low">' + humanizeTableFormatter(props.riverflood_forecast_low_pop)
                    	+ '</td></tr><tr><th class="mod">' + fforecast_cat[1]
                    	+ '</th><td class="mod">' + humanizeTableFormatter(props.riverflood_forecast_med_pop)
                    	+ '</td></tr><tr><th class="high">' + fforecast_cat[2]
                    	+ '</th><td class="high">' + humanizeTableFormatter(props.riverflood_forecast_high_pop)
                    	+ '</td></tr><tr><th class="vhigh">' + fforecast_cat[3]
                    	+ '</th><td class="vhigh">' + humanizeTableFormatter(props.riverflood_forecast_veryhigh_pop)
                    	+ '</td></tr><tr><th class="ext">' + fforecast_cat[4]
                    	+ '</th><td class="ext">' + humanizeTableFormatter(props.riverflood_forecast_extreme_pop)
                    	+ '</td></tr></table></div>'

                    	+ '</div>'

                    	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
                    : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
        		$('a.linkPopup').on('click', function() {
        		    window.document.location="?page=floodforecast&code=" + (props.code) ;
        		});
        		$('.' + $('select#fforecastOpt').val()).show();
            };

    		var chart = addChart();
    		chart.update = function (props) { 
    			chart_map_fforecast = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_fforecast',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Flash Flood',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ this.y;
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	            },
    	            colors: colorFloodLikelihood,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Health Facilities',
    	                data: [[fforecast_cat[0],props.flashflood_forecast_low_pop],[fforecast_cat[1],props.flashflood_forecast_med_pop],[fforecast_cat[2],props.flashflood_forecast_high_pop],[fforecast_cat[3],props.flashflood_forecast_veryhigh_pop],[fforecast_cat[4],props.flashflood_forecast_extreme_pop]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
        		chart_map_ggfforecast = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chart_map_ggfforecast',
                        type: 'pie',
                        style: {
                            fontFamily: '"Arial", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'River Flood GLOFAS GFMS',
                        style: {
                            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y;
                        }
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        verticalAlign: 'bottom'
                    },
                    colors: colorFloodLikelihood,
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Health Facilities',
                        data: [[fforecast_cat[0],props.gfms_glofas_riverflood_forecast_low_pop],[fforecast_cat[1],props.gfms_glofas_riverflood_forecast_med_pop],[fforecast_cat[2],props.gfms_glofas_riverflood_forecast_high_pop],[fforecast_cat[3],props.gfms_glofas_riverflood_forecast_veryhigh_pop],[fforecast_cat[4],props.gfms_glofas_riverflood_forecast_extreme_pop]],
                        size: '90%',
                        innerSize: '65%',
                        showInLegend:true,
                        dataLabels: {
                            enabled: false
                        }
                    }]
                });
        		chart_map_glfforecast = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chart_map_glfforecast',
                        type: 'pie',
                        style: {
                            fontFamily: '"Arial", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'River Flood GLOFAS',
                        style: {
                            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y;
                        }
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        verticalAlign: 'bottom'
                    },
                    colors: colorFloodLikelihood,
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'GLOFAS',
                        data: [[fforecast_cat[0],props.glofas_riverflood_forecast_low_pop],[fforecast_cat[1],props.glofas_riverflood_forecast_med_pop],[fforecast_cat[2],props.glofas_riverflood_forecast_high_pop],[fforecast_cat[3],props.glofas_riverflood_forecast_veryhigh_pop],[fforecast_cat[4],props.glofas_riverflood_forecast_extreme_pop]],
                        size: '90%',
                        innerSize: '65%',
                        showInLegend:true,
                        dataLabels: {
                            enabled: false
                        }
                    }]
                });
                chart_map_gffforecast = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chart_map_gffforecast',
                        type: 'pie',
                        style: {
                            fontFamily: '"Arial", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'River Flood GFMS',
                        style: {
                            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ this.y;
                        }
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        verticalAlign: 'bottom'
                    },
                    colors: colorFloodLikelihood,
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'GFMS',
                        data: [[fforecast_cat[0],props.riverflood_forecast_low_pop],[fforecast_cat[1],props.riverflood_forecast_med_pop],[fforecast_cat[2],props.riverflood_forecast_high_pop],[fforecast_cat[3],props.riverflood_forecast_veryhigh_pop],[fforecast_cat[4],props.riverflood_forecast_extreme_pop]],
                        size: '90%',
                        innerSize: '65%',
                        showInLegend:true,
                        dataLabels: {
                            enabled: false
                        }
                    }]
                });
    		}

            var selected = null;

		    geojson = L.geoJson(boundary, {
		        style: style,
		        onEachFeature: onEachFeature
		    }).addTo(fforecastMap);

		    document.getElementById("mapInfo").appendChild(info.onAdd(fforecastMap));

		    // Show Related checkbox and checked the first one if dropdown changes
		    $('#fforecastOpt').on('change', function() {
		    	info.update();
		    	var selected_opt = $(this).val();
		    	$("input[name='fforecast_checkbox']").each(function () {
                    $(this).prop('checked', false);
                });
		    	$('.fforecast_opt').hide();

		    	// $('.' + selected_opt + ' :checkbox:first').prop('checked', true);
	    	    // changeValueProp($('.' + selected_opt + ' :checkbox:first').val());

	    	    $('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
	    	    sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));
	    	    $('.' + selected_opt).show();

	    	    legend.remove();
	    		legend_num_arr = setLegendSeries(val_collection);
	    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	    		legend.addTo(fforecastMap);
	    		geojson.setStyle(style);
		    });

		    // Disabling checkbox if no data available
		    var fforecastCheckbox=document.getElementsByName("fforecast_checkbox");
		    for (var i = 0; i < fforecastCheckbox.length; i++) {
		    	var r = fforecastCheckbox[i];
		    	var terpilih = r.value;
		    	if (getMax(boundary.features, [terpilih])==0) {
		    		fforecastCheckbox[i].disabled=true;
		    		$(r).prop('checked', false);
		    		$(r).closest("div").addClass("disabled");
		    	}
		    }

		    $('#themes').on('click','button', function (evt) {
		    	// add active class on selected button
		    	$(this).siblings().removeClass('active')
		    	$(this).addClass('active');

		       	val_theme = $(this).data('btn');
		       	// console.log(val_theme);
		       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		       	geojson.setStyle(style);
		       	// group.setStyle(style);
		       	legend.addTo(fforecastMap);
		    });

		    $("input[name='fforecast_checkbox']:checkbox").on("change", function() {
		    	var choosen_cat = $("input[name='fforecast_checkbox']:checkbox:checked");
		    	if (choosen_cat.length > 0) {
		    		sumValueProp(choosen_cat);
		    		legend.remove();
		    		legend_num_arr = setLegendSeries(val_collection);
		    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		    		legend.addTo(fforecastMap);
		    		geojson.setStyle(style);
		    	}else{
		    		legend.remove();
		    		sumValueProp(choosen_cat);
		    		geojson.setStyle(style);
		    	}
		    	
		    });

		    // use jQuery to listen for checkbox change event
		    $('div#layercontrol .wms_check input[type="checkbox"]').on('change', function() {    
		        var checkbox = $(this);
		        // lyr = checkbox.data().layer;
		        var lyr = checkbox.attr('data-layer');
		        var selected_layer = wmsLayer[lyr];

		        // toggle the layer
		        if ((checkbox).is(':checked')) {
		        	// console.log(selected_layer);

		            // accessMap.addLayer(nAirprt);

		            fforecastMap.addLayer(selected_layer);
		            
		        } else {
		        	// console.log(lyr);
		            fforecastMap.removeLayer(selected_layer);
		            // layer.remove();
		        }
		    })
		}

		if ($('#leaflet_floodrisk_map').length ){
			var floodRiskMap = initMap();

			//Set zoom control with your options
			// fforecastMap.zoomControl.setPosition('bottomright');

			var wmsLayer = 

			{
			    "frisk" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
			    		    layers: 'geonode:afg_fldzonea_100k_risk_landcover_pop',
			    		    format: 'image/png',
			    		    transparent: true
			    })
			};

			wmsLayer.frisk.addTo(floodRiskMap);

			// L.control.layers(wmsLayer).addTo(floodRiskMap);
			// var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(floodRiskMap);

			// Data for legend based on selected layer
			var layer_selected = "total_risk_population";
			changeValueProp(layer_selected);
			legend_num_arr = setLegendSeries(val_collection);

			val_theme = 'YlOrRd';
			var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

			legend = createLegend();
			legend.addTo(floodRiskMap);

			var selected = null;

			var info = addInfo();
            info.update = function (props) {
                this._div.innerHTML = 
                	(props ?
			        	'<span class="chosen_area">' + props.na_en + '</span>'

                    	+ '<div class="row"><div class="col-md-3 col-sm-12 col-xs-12"><div class="circle_container"><i class="icon-people_affected_population fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_risk_population) + '</span><span class="circle_title">' + map_category[0] + '</span></div>'
                    	+ '<div class="circle_container"><i class="icon-infrastructure_building fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.settlements_at_risk) + '</span><span class="circle_title">' + map_category[2] + '</span></div>'
                    	+ '<div class="circle_container"><i class="icon-socioeconomic_urban fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_risk_buildings) + '</span><span class="circle_title">' + map_category[1] + '</span></div>'
                    	+ '<div class="circle_container"><i class="fa fa-tree fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_risk_area) + '</span><span class="circle_title">' + map_category[3] + '</span></div></div>'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 total_risk_population"><div id="chart_map_frisk_pop" class="ch-map-size" style="height:280px;"></div></div>'
                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 total_risk_area"><div id="chart_map_frisk_area" class="ch-map-size" style="height:280px;"></div></div>'

                    	+ '<div style="display: none;" class="col-md-3 col-sm-12 col-xs-12 total_risk_population"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Population</th></tr><tr>'
                    	+ '<th>' + frisk_cat[0]
                    	+ '</th><td>' + humanizeTableFormatter(props.low_risk_population)
                    	+ '</td></tr><tr><th>' + frisk_cat[1]
                    	+ '</th><td>' + humanizeTableFormatter(props.med_risk_population)
                    	+ '</td></tr><tr><th>' + frisk_cat[2]
                    	+ '</th><td>' + humanizeTableFormatter(props.high_risk_population)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display: none;" class="col-md-3 col-sm-12 col-xs-12 total_risk_area"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Area</th></tr><tr>'
                    	+ '<th>' + frisk_cat[0]
                    	+ '</th><td>' + humanizeTableFormatter(props.low_risk_area)
                    	+ '</td></tr><tr><th>' + frisk_cat[1]
                    	+ '</th><td>' + humanizeTableFormatter(props.med_risk_area)
                    	+ '</td></tr><tr><th>' + frisk_cat[2]
                    	+ '</th><td>' + humanizeTableFormatter(props.high_risk_area)
                    	+ '</td></tr></table></div>'

                    	+ '</div>'

                    	// + '<table><tr><td>Flood Risk Population : </td><td>' + humanizeTableFormatter(props.total_risk_population)
                    	// + '</td></tr><tr><td>Flood Risk Building</td><td>' + humanizeTableFormatter(props.total_risk_buildings)
                    	// + '</td></tr><tr><td>Flood Risk Settlement</td><td>' + humanizeTableFormatter(props.settlements_at_risk)
                    	// + '</td></tr><tr><td>Flood Risk Area : </td><td>' + humanizeTableFormatter(props.total_risk_area)
                    	// + '</td></tr></table>'
                    	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
                    : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
        		$('a.linkPopup').on('click', function() {
        		    window.document.location="?page=floodrisk&code=" + (props.code) ;
        		});
        		$('.' + $('select#friskOpt').val()).show();
            };

            var chart = addChart();
    		chart.update = function (props) { 
    			chart_map_frisk_pop = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_frisk_pop',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Flood Risk Population',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'center',
						verticalAlign: 'bottom'
    	            },
    	            colors: colorFloodRisk,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: '...',
    	                data: [[frisk_cat[0],props.low_risk_population],[frisk_cat[1],props.med_risk_population],[frisk_cat[2],props.high_risk_population]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });

    	        chart_map_frisk_area = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_frisk_area',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Flood Risk Area',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'center',
						verticalAlign: 'bottom'
    	            },
    	            colors: colorFloodRisk,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: '...',
    	                data: [[frisk_cat[0],props.low_risk_area],[frisk_cat[1],props.med_risk_area],[frisk_cat[2],props.high_risk_area]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    		}

			geojson = L.geoJson(boundary, {
			    style: style,
			    onEachFeature: onEachFeature
			})/*.addTo(floodRiskMap)*/;

			group = L.featureGroup([geojson]).addLayer(geojson);
			this_map = floodRiskMap;

			document.getElementById("mapInfo").appendChild(info.onAdd(floodRiskMap));

			// var popupContent = function (e){
			// 	// console.log(e);
			// 	var featureProp = e.feature.properties;
			// 	var div_popup = L.DomUtil.create('div', 'customPopupContent');
			// 	div_popup.innerHTML = 
			// 		'<h4>' + featureProp.na_en + '</h4>'
			// 		+ '<table><tr><td>Flood Risk Population : </td><td>' + humanizeTableFormatter(featureProp.total_risk_population)
			// 		+ '</td></tr><tr><td>Flood Risk Building</td><td>' + humanizeTableFormatter(featureProp.total_risk_buildings)
			// 		+ '</td></tr><tr><td>Flood Risk Settlement</td><td>' + humanizeTableFormatter(featureProp.settlements_at_risk)
			// 		+ '</td></tr><tr><td>Flood Risk Area : </td><td>' + humanizeTableFormatter(featureProp.total_risk_area)
			// 		+ '</td></tr></table>'
			// 		+ '<a class="linkPopup">Go To ' + (featureProp.na_en) +'</a>';
			// 	$('a.linkPopup', div_popup).on('click', function() {
			// 	    window.document.location="?page=floodrisk&code=" + (featureProp.code);
			// 	});

			// 	return div_popup;
			// }

			// var popupOptions = {
			// 	className: "customPopup"
			// }

			// // Enabling pop up when clicked
			// geojson.eachLayer(function (layer) {
			// 	popupContent(layer);
			//     layer.bindPopup(popupContent, popupOptions);
			// });

			sliderRangeValue = addSlider();

			$('select#friskOpt').change(function(){
				group.clearLayers();
				info.update();
				layer_selected = (this.value);
			    // console.log(layer_selected);

			    legend.remove();
			    changeValueProp(layer_selected);
			    legend_num_arr = setLegendSeries(val_collection);
			    getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
			    legend.addTo(floodRiskMap);
			    geojson.setStyle(style);

			    if (legend_num_arr.length<2) {
			    	updateSliderRange(0,legend_num_arr[0]);
			    }else{
			    	updateSliderRange(legend_num_arr[0],legend_num_arr[legend_num_arr.length-1]);
			    }
			    group.setStyle(style);
			    group.addTo(floodRiskMap);

			});

			$('#themes').on('click','button', function (evt) {
				// add active class on selected button
				$(this).siblings().removeClass('active')
				$(this).addClass('active');

			   	val_theme = $(this).data('btn');
			   	// console.log(val_theme);
			   	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
			   	// geojson.setStyle(style);
			   	group.setStyle(style);
			   	legend.addTo(floodRiskMap);
			});

			// use jQuery to listen for checkbox change event
			$('div#layercontrol input[type="checkbox"]').on('change', function() {    
			    var checkbox = $(this);
			    // lyr = checkbox.data().layer;
			    var lyr = checkbox.attr('data-layer');
			    var selected_layer = wmsLayer[lyr];

			    // toggle the layer
			    if ((checkbox).is(':checked')) {
			    	// console.log(selected_layer);

			        // accessMap.addLayer(nAirprt);

			        floodRiskMap.addLayer(selected_layer);
			        
			    } else {
			    	// console.log(lyr);
			        floodRiskMap.removeLayer(selected_layer);
			        // layer.remove();
			    }
			})
		}

		if ($('#leaflet_aforecast_map').length ){
			// Disabling checkbox if no data available
		    var aforecastCheckbox=document.getElementsByName("aforecast_checkbox");
		    for (var i = 0; i < aforecastCheckbox.length; i++) {
		    	var r = aforecastCheckbox[i];
		    	var terpilih = r.value;
		    	if (getMax(boundary.features, [terpilih])==0) {
		    		aforecastCheckbox[i].disabled=true;
		    		$(r).closest("div").addClass("disabled");
		    	}
		    }

		    var aforecastMap = initMap();

		    //Set zoom control with your options
		    // aforecastMap.zoomControl.setPosition('bottomright');

		    var wmsLayer = 

		    {
		        "aforecast" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		        		    layers: 'geonode:avalanche_risk_villages',
		        		    format: 'image/png',
		        		    transparent: true
		        })
		    };

		    wmsLayer.aforecast.addTo(aforecastMap);

		    // L.control.layers(wmsLayer).addTo(aforecastMap);
		    // var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(aforecastMap);

		    // Data for legend based on selected layer
			// var layer_selected = "ava_forecast_low_pop";
	        // changeValueProp(layer_selected);

	        $('.lvl_choice .aforecast_checkbox_pop :checkbox:enabled').prop('checked', true);
	        sumValueProp($('.lvl_choice .aforecast_checkbox_pop :checkbox:enabled'));
	    	legend_num_arr = setLegendSeries(val_collection);

	    	val_theme = 'YlOrRd';
	    	var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

			legend = createLegend();
			legend.addTo(aforecastMap);

			var selected = null;

			var info = addInfo();
            info.update = function (props) {
                this._div.innerHTML =
                	(props ?
			        	'<span class="chosen_area">' + props.na_en + '</span>'
                    	+ '<div class="row">'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 aforecast_checkbox_pop"><div id="chart_map_aforecast" class="ch-map-size" style="height:280px;"></div></div>'

                    	+ '<div style="display: none;" class="col-md-3 col-sm-12 col-xs-12 aforecast_checkbox_pop"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Affected Population</th></tr><tr>'
                    	+ '<th>' + aforecast_cat[0]
                    	+ '</th><td>' + humanizeTableFormatter(props.ava_forecast_low_pop)
                    	+ '</td></tr><tr><th>' + aforecast_cat[1]
                    	+ '</th><td>' + humanizeTableFormatter(props.ava_forecast_med_pop)
                    	+ '</td></tr><tr><th>' + aforecast_cat[2]
                    	+ '</th><td>' + humanizeTableFormatter(props.ava_forecast_high_pop)
                    	+ '</td></tr></table></div>'

                    	+ '</div>'

                    	// + '<table><tr><td>Lvl</td><td>Pop'
                    	// + '</td></tr><tr><td>Low</td><td>' + humanizeTableFormatter(props.ava_forecast_low_pop)
                    	// + '</td></tr><tr><td>Moderate</td><td>' + humanizeTableFormatter(props.ava_forecast_med_pop)
                    	// + '</td></tr><tr><td>High</td><td>' + humanizeTableFormatter(props.ava_forecast_high_pop)
                    	// + '</td></tr></table>'
                    	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
                    : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
        		$('a.linkPopup').on('click', function() {
        		    window.document.location="?page=avalcheforecast&code=" + (props.code) ;
        		});
        		$('.' + $('select#aforecastOpt').val()).show();
            };

    		var chart = addChart();
    		chart.update = function (props) { 
    			chart_map_aforecast = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_aforecast',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Avalanche Forecast',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'center',
						verticalAlign: 'bottom'
    	            },
    	            colors: colorFloodRisk,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: '...',
    	                data: [[aforecast_cat[0],props.ava_forecast_low_pop],[aforecast_cat[1],props.ava_forecast_med_pop],[aforecast_cat[2],props.ava_forecast_high_pop]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    		}

		    geojson = L.geoJson(boundary, {
		        style: style,
		        onEachFeature: onEachFeature
		    }).addTo(aforecastMap);

		    document.getElementById("mapInfo").appendChild(info.onAdd(aforecastMap));

			// var popupContent = function (e){
			// 	// console.log(e);
			// 	var featureProp = e.feature.properties;
			// 	var div_popup = L.DomUtil.create('div', 'customPopupContent');
			// 	div_popup.innerHTML = 
			// 		'<h4>' + featureProp.na_en + '</h4>'
			// 		+ '<table><tr><td>Lvl</td><td>Pop'
			// 		+ '</td></tr><tr><td>Low</td><td>' + humanizeTableFormatter(featureProp.ava_forecast_low_pop)
			// 		+ '</td></tr><tr><td>Moderate</td><td>' + humanizeTableFormatter(featureProp.ava_forecast_med_pop)
			// 		+ '</td></tr><tr><td>High</td><td>' + humanizeTableFormatter(featureProp.ava_forecast_high_pop)
			// 		+ '</td></tr></table>'
			// 		+ '<a class="linkPopup">Go To ' + (featureProp.na_en) +'</a>';
			// 	$('a.linkPopup', div_popup).on('click', function() {
			// 	    window.document.location="?page=avalcheforecast&code=" + (featureProp.code);
			// 	});

			// 	return div_popup;
			// }

			// var popupOptions = {
			// 	className: "customPopup"
			// }

			// // Enabling pop up when clicked
			// geojson.eachLayer(function (layer) {
			// 	popupContent(layer);
			//     layer.bindPopup(popupContent, popupOptions);
			// });

		    $('#aforecastOpt').on('change', function() {
		    	info.update();
		    	var selected_opt = $(this).val();
		    	$("input[name='aforecast_checkbox']").each(function () {
                    $(this).prop('checked', false);
                });
		    	$('.aforecast_opt').hide();
		    	// $('.' + selected_opt + ' :checkbox:first').prop('checked', true);
	    	    // changeValueProp($('.' + selected_opt + ' :checkbox:first').val());

	    	    $('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
	    	    sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));
	    	    $('.' + selected_opt).show();

	    	    legend.remove();
	    		legend_num_arr = setLegendSeries(val_collection);
	    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	    		legend.addTo(aforecastMap);
	    		geojson.setStyle(style);
		    });

		    $('#themes').on('click','button', function (evt) {
		    	// add active class on selected button
		    	$(this).siblings().removeClass('active')
		    	$(this).addClass('active');

		       	val_theme = $(this).data('btn');
		       	// console.log(val_theme);
		       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		       	geojson.setStyle(style);
		       	// group.setStyle(style);
		       	legend.addTo(aforecastMap);
		    });

		    $("input[name='aforecast_checkbox']:checkbox").on("change", function() {
		    	var choosen_cat = $("input[name='aforecast_checkbox']:checkbox:checked");
		    	if (choosen_cat.length > 0) {
		    		sumValueProp(choosen_cat);
		    		legend.remove();
		    		legend_num_arr = setLegendSeries(val_collection);
		    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		    		legend.addTo(aforecastMap);
		    		geojson.setStyle(style);
		    	}else{
		    		legend.remove();
		    		sumValueProp(choosen_cat);
		    		geojson.setStyle(style);
		    	}
		    	
		    });

		    // use jQuery to listen for checkbox change event
		    $('div#layercontrol .wms_check input[type="checkbox"]').on('change', function() {    
		        var checkbox = $(this);
		        // lyr = checkbox.data().layer;
		        var lyr = checkbox.attr('data-layer');
		        var selected_layer = wmsLayer[lyr];

		        // toggle the layer
		        if ((checkbox).is(':checked')) {
		            // console.log(selected_layer);

		            // accessMap.addLayer(nAirprt);

		            aforecastMap.addLayer(selected_layer);
		            
		        } else {
		            // console.log(lyr);
		            aforecastMap.removeLayer(selected_layer);
		            // layer.remove();
		        }
		    })
		}

		if ($('#leaflet_avarisk_map').length ){
			// Disabling checkbox if no data available
			var ariskCheckbox=document.getElementsByName("arisk_checkbox");
			for (var i = 0; i < ariskCheckbox.length; i++) {
				var r = ariskCheckbox[i];
				var terpilih = r.value;
				if (getMax(boundary.features, [terpilih])==0) {
					ariskCheckbox[i].disabled=true;
					$(r).closest("div").addClass("disabled");
				}
			}

		    var avaRiskMap = initMap();

		    //Set zoom control with your options
		    // aforecastMap.zoomControl.setPosition('bottomright');

		    var wmsLayer = 

		    {
		        "arisk" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		        						    layers: 'geonode:afg_avsa',
		        						    format: 'image/png',
		        						    transparent: true
		        				})
		    };

		    wmsLayer.arisk.addTo(avaRiskMap);

		    // L.control.layers(wmsLayer).addTo(aforecastMap);
		    // var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(aforecastMap);

		    // Data for legend based on selected layer
			// var layer_selected = "med_ava_population";
			// changeValueProp(layer_selected);

			$('.lvl_choice .arisk_checkbox_pop :checkbox:enabled').prop('checked', true);
			sumValueProp($('.lvl_choice .arisk_checkbox_pop :checkbox:enabled'));
			legend_num_arr = setLegendSeries(val_collection);

			val_theme = 'YlOrRd';
			var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

			legend = createLegend();
			legend.addTo(avaRiskMap);

			var selected = null;

			var info = addInfo();
            info.update = function (props) {
                this._div.innerHTML = 
                	(props ?
			        	'<span class="chosen_area">' + props.na_en + '</span>'
                    	+ '<div class="row">'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 arisk_checkbox_pop"><div id="chart_map_ava_risk_pop" class="ch-map-size" style="height:280px;"></div></div>'
                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 arisk_checkbox_build"><div id="chart_map_ava_risk_build" class="ch-map-size" style="height:280px;"></div></div>'
                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 arisk_checkbox_area"><div id="chart_map_ava_risk_area" class="ch-map-size" style="height:280px;"></div></div>'

                    	+ '<div style="display: none;" class="col-md-3 col-sm-12 col-xs-12 arisk_checkbox_pop"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Population</th></tr><tr>'
                    	+ '<td>Moderate</td><td>' + humanizeTableFormatter(props.med_ava_population) + '</td></tr><tr>'
                    	+ '<td>High</td><td>' + humanizeTableFormatter(props.high_ava_population) + '</td></tr></table></div>'

						+ '<div style="display: none;" class="col-md-3 col-sm-12 col-xs-12 arisk_checkbox_build"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Buildings</th></tr><tr>'
						+ '<td>Moderate</td><td>' + humanizeTableFormatter(props.med_ava_buildings)  + '</td></tr><tr>'
						+ '<td>High</td><td>' + humanizeTableFormatter(props.high_ava_buildings) + '</td></tr></table></div>'

						+ '<div style="display: none;" class="col-md-3 col-sm-12 col-xs-12 arisk_checkbox_area"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Area (km<sup>2</sup>)</th></tr><tr>'
						+ '<td>Moderate</td><td>' + humanizeTableFormatter(props.med_ava_area) + '</td></tr><tr>'
						+ '<td>High</td><td>' + humanizeTableFormatter(props.high_ava_area) + '</td></tr></table></div>'

                    	+ '</div>'

                    	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
                    : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
        		$('a.linkPopup').on('click', function() {
        		    window.document.location="?page=avalancherisk&code=" + (props.code) ;
        		});
        		$('.' + $('select#ariskOpt').val()).show();
            };

        	var chart = addChart();
        	chart.update = function (props) { 
        		chart_map_ava_risk_pop = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chart_map_ava_risk_pop',
                        type: 'pie',
                        style: {
                            fontFamily: '"Arial", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'Avalanche Risk Population',
                        style: {
                            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
                        }
                    },
                    legend: {
                        align: 'center',
						verticalAlign: 'bottom'
                    },
                    colors: colorFloodRisk,
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: '...',
                        data: [[arisk_cat[0],props.med_ava_population],[arisk_cat[1],props.high_ava_population]],
                        size: '90%',
                        innerSize: '65%',
                        showInLegend:true,
                        dataLabels: {
                            enabled: false
                        }
                    }]
                });

                chart_map_ava_risk_build = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chart_map_ava_risk_build',
                        type: 'pie',
                        style: {
                            fontFamily: '"Arial", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'Avalanche Risk Buildings',
                        style: {
                            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
                        }
                    },
                    legend: {
                        align: 'center',
						verticalAlign: 'bottom'
                    },
                    colors: colorFloodRisk,
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: '...',
                        data: [[arisk_cat[0],props.med_ava_buildings],[arisk_cat[1],props.high_ava_buildings]],
                        size: '90%',
                        innerSize: '65%',
                        showInLegend:true,
                        dataLabels: {
                            enabled: false
                        }
                    }]
                });

                chart_map_ava_risk_area = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chart_map_ava_risk_area',
                        type: 'pie',
                        style: {
                            fontFamily: '"Arial", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'Avalanche Risk Area',
                        style: {
                            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
                        }
                    },
                    legend: {
                        align: 'center',
						verticalAlign: 'bottom'
                    },
                    colors: colorFloodRisk,
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: '...',
                        data: [[arisk_cat[0],props.med_ava_area],[arisk_cat[1],props.high_ava_area]],
                        size: '90%',
                        innerSize: '65%',
                        showInLegend:true,
                        dataLabels: {
                            enabled: false
                        }
                    }]
                });
        	}

		    geojson = L.geoJson(boundary, {
		        style: style,
		        onEachFeature: onEachFeature
		    }).addTo(avaRiskMap);

		    document.getElementById("mapInfo").appendChild(info.onAdd(avaRiskMap));

		    // var popupContent = function (e){
		    // 	// console.log(e);
		    // 	var featureProp = e.feature.properties;
		    // 	var div_popup = L.DomUtil.create('div', 'customPopupContent');
		    // 	div_popup.innerHTML = 
		    // 		'<h4>' + featureProp.na_en + '</h4>'
		    // 		+ '<table><tr><td>Lvl</td><td>Pop</td><td>Build</td><td>Area</td></tr><tr>'
		    // 		+ '<td>Moderate</td><td>' + humanizeTableFormatter(featureProp.med_ava_population) + '</td><td>' + humanizeTableFormatter(featureProp.med_ava_buildings) + '</td><td>' + humanizeTableFormatter(featureProp.med_ava_area) + '</td></tr><tr>'
		    // 		+ '<td>High</td><td>' + humanizeTableFormatter(featureProp.high_ava_population) + '</td><td>' + humanizeTableFormatter(featureProp.high_ava_buildings) + '</td><td>' + humanizeTableFormatter(featureProp.high_ava_area) + '</td></tr></table>'
		    // 		+ '<a class="linkPopup">Go To ' + (featureProp.na_en) +'</a>';
		    // 	$('a.linkPopup', div_popup).on('click', function() {
		    // 	    window.document.location="?page=avalancherisk&code=" + (featureProp.code);
		    // 	});

		    // 	return div_popup;
		    // }

		    // var popupOptions = {
		    // 	className: "customPopup"
		    // }

		    // // Enabling pop up when clicked
		    // geojson.eachLayer(function (layer) {
		    // 	popupContent(layer);
		    //     layer.bindPopup(popupContent, popupOptions);
		    // });

		    $('#ariskOpt').on('change', function() {
		    	info.update();
		    	var selected_opt = $(this).val();
		    	$("input[name='arisk_checkbox']").each(function () {
                    $(this).prop('checked', false);
                });
		    	$('.arisk_opt').hide();

		    	// $('.' + selected_opt + ' :checkbox:first').prop('checked', true);
	    	    // changeValueProp($('.' + selected_opt + ' :checkbox:first').val());

	    	    $('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
	    	    sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));
	    	    $('.' + selected_opt).show();

	    	    legend.remove();
	    		legend_num_arr = setLegendSeries(val_collection);
	    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	    		legend.addTo(avaRiskMap);
	    		geojson.setStyle(style);
		    });

		    $('#themes').on('click','button', function (evt) {
		    	// add active class on selected button
		    	$(this).siblings().removeClass('active')
		    	$(this).addClass('active');

		       	val_theme = $(this).data('btn');
		       	// console.log(val_theme);
		       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		       	geojson.setStyle(style);
		       	// group.setStyle(style);
		       	legend.addTo(avaRiskMap);
		    });

		    $("input[name='arisk_checkbox']:checkbox").on("change", function() {
		    	var choosen_cat = $("input[name='arisk_checkbox']:checkbox:checked");
		    	if (choosen_cat.length > 0) {
		    		sumValueProp(choosen_cat);
		    		legend.remove();
		    		legend_num_arr = setLegendSeries(val_collection);
		    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		    		legend.addTo(avaRiskMap);
		    		geojson.setStyle(style);
		    	}else{
		    		legend.remove();
		    		sumValueProp(choosen_cat);
		    		geojson.setStyle(style);
		    	}
		    	
		    });

		    // use jQuery to listen for checkbox change event
		    $('div#layercontrol .wms_check input[type="checkbox"]').on('change', function() {    
		        var checkbox = $(this);
		        // lyr = checkbox.data().layer;
		        var lyr = checkbox.attr('data-layer');
		        var selected_layer = wmsLayer[lyr];

		        // toggle the layer
		        if ((checkbox).is(':checked')) {
		        	// console.log(selected_layer);

		            // accessMap.addLayer(nAirprt);

		            avaRiskMap.addLayer(selected_layer);
		            
		        } else {
		        	// console.log(lyr);
		            avaRiskMap.removeLayer(selected_layer);
		            // layer.remove();
		        }
		    })
		}

		if ($('#leaflet_lndslide_map').length ){
			// Disabling checkbox if no data available
		    var landslideCheckbox=document.getElementsByName("landslide_checkbox");
		    for (var i = 0; i < landslideCheckbox.length; i++) {
		    	var r = landslideCheckbox[i];
		    	var terpilih = r.value;
		    	if (getMax(boundary.features, [terpilih])==0) {
		    		landslideCheckbox[i].disabled=true;
		    		$(r).closest("div").addClass("disabled");
		    	}
		    }

		    var lndslideMap = initMap();
		    // L.map('leaflet_lndslide_map').setView([centroid[1],centroid[0]], 8);
		    // var geojsonLayer = L.geoJson(boundary);
		    // lndslideMap.fitBounds(geojsonLayer.getBounds());
		    
		    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
		    //     attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		    //     maxZoom: 19
		    // }).addTo(lndslideMap);

		    //Set zoom control with your options
		    // lndslideMap.zoomControl.setPosition('bottomright');

		    var wmsLayer = 

		    {
		    	"ku" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		    			    layers: 'geonode:afg_ls_500m_ku_lsi',
		    			    format: 'image/png',
		    			    transparent: true
		    	}),
		    	"s1" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		    			    layers: 'geonode:afg_ls_30m_wb_s1',
		    			    format: 'image/png',
		    			    transparent: true
		    	}),
		    	"s2" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		    			    layers: 'geonode:afg_ls_30m_wb_s2',
		    			    format: 'image/png',
		    			    transparent: true
		    	}),
		    	"s3" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		    			    layers: 'geonode:afg_ls_30m_wb_s3',
		    			    format: 'image/png',
		    			    transparent: true
		    	})
		    	// ,
		     //    "provincial_boundary" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		     //                layers: 'geonode:afg_admbnda_adm1',
		     //                format: 'image/png',
		     //                transparent: true
		     //    })


		    };

		    // wmsLayer.ku.addTo(lndslideMap);
		    // wmsLayer.provincial_boundary.addTo(lndslideMap);

		    //Add Layer Control to the map
		    // L.control.layers(wmsLayer).addTo(lndslideMap);
		    // var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(lndslideMap);

		    // var layer_selected = "lsi_ku_low";
			// changeValueProp(layer_selected);

			$('.lvl_choice .landslide_checkbox_ku :checkbox:enabled').prop('checked', true);
			sumValueProp($('.lvl_choice .landslide_checkbox_ku :checkbox:enabled'));

	    	legend_num_arr = setLegendSeries(val_collection);

	    	val_theme = 'YlOrRd';
	    	var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

			legend = createLegend();
			legend.addTo(lndslideMap);

			var info = addInfo();
            info.update = function (props) {
            	// console.log(props);
                this._div.innerHTML = 
                // this.info.innerHTML = '<h4>' + chosen_label + '</h4>' 
                	(props ?
			        	'<span class="chosen_area">' + props.na_en + '</span>'
			        	+ '<div class="row">'

			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_immap"><div id="chart_map_donut_lsi" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_ku"><div id="chart_map_donut_ku" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_s1"><div id="chart_map_donut_s1" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_s2"><div id="chart_map_donut_s2" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_s3"><div id="chart_map_donut_s3" class="ch-map-size" style="height:280px;"></div></div>'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_immap"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Landslide Indexes (iMMAP 2017)</th></tr><tr>'
                    	+ '<th class="landslide_vhigh">' + level_risk[3]
                    	+ '</th><td class="landslide_vhigh">' + humanizeTableFormatter(props.lsi_immap_very_high)
                    	+ '</td></tr><tr><th class="landslide_high">' + level_risk[2]
                    	+ '</th><td class="landslide_high">' + humanizeTableFormatter(props.lsi_immap_high)
                    	+ '</td></tr><tr><th class="landslide_mod">' + level_risk[1]
                    	+ '</th><td class="landslide_mod">' + humanizeTableFormatter(props.lsi_immap_moderate)
                    	+ '</td></tr><tr><th class="landslide_low">' + level_risk[0]
                    	+ '</th><td class="landslide_low">' + humanizeTableFormatter(props.lsi_immap_low)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_ku"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Multi-criteria Susceptibility Index</th></tr><tr>'
                    	+ '<th class="landslide_vhigh">' + level_risk[3]
                    	+ '</th><td class="landslide_vhigh">' + humanizeTableFormatter(props.lsi_ku_very_high)
                    	+ '</td></tr><tr><th class="landslide_high">' + level_risk[2]
                    	+ '</th><td class="landslide_high">' + humanizeTableFormatter(props.lsi_ku_high)
                    	+ '</td></tr><tr><th class="landslide_mod">' + level_risk[1]
                    	+ '</th><td class="landslide_mod">' + humanizeTableFormatter(props.lsi_ku_moderate)
                    	+ '</td></tr><tr><th class="landslide_low">' + level_risk[0]
                    	+ '</th><td class="landslide_low">' + humanizeTableFormatter(props.lsi_ku_low)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_s1"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Landslide Susceptibility (S1)</th></tr><tr>'
                    	+ '<th class="landslide_vhigh">' + level_risk[3]
                    	+ '</th><td class="landslide_vhigh">' + humanizeTableFormatter(props.ls_s1_wb_very_high)
                    	+ '</td></tr><tr><th class="landslide_high">' + level_risk[2]
                    	+ '</th><td class="landslide_high">' + humanizeTableFormatter(props.ls_s1_wb_high)
                    	+ '</td></tr><tr><th class="landslide_mod">' + level_risk[1]
                    	+ '</th><td class="landslide_mod">' + humanizeTableFormatter(props.ls_s1_wb_moderate)
                    	+ '</td></tr><tr><th class="landslide_low">' + level_risk[0]
                    	+ '</th><td class="landslide_low">' + humanizeTableFormatter(props.ls_s1_wb_low)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_s2"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Landslide Susceptibility (S2)</th></tr><tr>'
                    	+ '<th class="landslide_vhigh">' + level_risk[3]
                    	+ '</th><td class="landslide_vhigh">' + humanizeTableFormatter(props.ls_s2_wb_very_high)
                    	+ '</td></tr><tr><th class="landslide_high">' + level_risk[2]
                    	+ '</th><td class="landslide_high">' + humanizeTableFormatter(props.ls_s2_wb_high)
                    	+ '</td></tr><tr><th class="landslide_mod">' + level_risk[1]
                    	+ '</th><td class="landslide_mod">' + humanizeTableFormatter(props.ls_s2_wb_moderate)
                    	+ '</td></tr><tr><th class="landslide_low">' + level_risk[0]
                    	+ '</th><td class="landslide_low">' + humanizeTableFormatter(props.ls_s2_wb_low)
                    	+ '</td></tr></table></div>'

                    	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 landslide_checkbox_s3"><table class="table table-bordered table-condensed"><tr><th>Risk Level</th><th>Landslide Susceptibility (S3)</th></tr><tr>'
                    	+ '<th class="landslide_vhigh">' + level_risk[3]
                    	+ '</th><td class="landslide_vhigh">' + humanizeTableFormatter(props.ls_s3_wb_very_high)
                    	+ '</td></tr><tr><th class="landslide_high">' + level_risk[2]
                    	+ '</th><td class="landslide_high">' + humanizeTableFormatter(props.ls_s3_wb_high)
                    	+ '</td></tr><tr><th class="landslide_mod">' + level_risk[1]
                    	+ '</th><td class="landslide_mod">' + humanizeTableFormatter(props.ls_s3_wb_moderate)
                    	+ '</td></tr><tr><th class="landslide_low">' + level_risk[0]
                    	+ '</th><td class="landslide_low">' + humanizeTableFormatter(props.ls_s3_wb_low)
                    	+ '</td></tr></table></div>'

                    	+ '<div>'

                    	// + '<table class="table table-bordered table-condensed"><thead><tr><th></th><th class="landslide_vhigh">Very High</th><th class="landslide_high">High</th><th class="landslide_mod">Moderate</th><th class="landslide_low">Low</th></tr></thead><tbody>'
                    	// + '<tr><td>Landslide Indexes (iMMAP 2017)</td>'
                    	// + '<td class="landslide_vhigh">' + humanizeTableFormatter(props.lsi_immap_very_high) + '</td>'
                    	// + '<td class="landslide_high">' + humanizeTableFormatter(props.lsi_immap_high) + '</td>'
                    	// + '<td class="landslide_mod">' + humanizeTableFormatter(props.lsi_immap_moderate) + '</td>'
                    	// + '<td class="landslide_low">' + humanizeTableFormatter(props.lsi_immap_low) + '</td>'
                    	// + '</tr><tr><td>Multi-criteria Susceptibility Index</td>'
                    	// + '<td class="landslide_vhigh">' + humanizeTableFormatter(props.lsi_ku_very_high) + '</td>'
                    	// + '<td class="landslide_high">' + humanizeTableFormatter(props.lsi_ku_high) + '</td>'
                    	// + '<td class="landslide_mod">' + humanizeTableFormatter(props.lsi_ku_moderate) + '</td>'
                    	// + '<td class="landslide_low">' + humanizeTableFormatter(props.lsi_ku_low) + '</td>'
                    	// + '</tr><tr><td>Landslide Susceptibility (S1)</td>'
                    	// + '<td class="landslide_vhigh">' + humanizeTableFormatter(props.ls_s1_wb_very_high) + '</td>'
                    	// + '<td class="landslide_high">' + humanizeTableFormatter(props.ls_s1_wb_high) + '</td>'
                    	// + '<td class="landslide_mod">' + humanizeTableFormatter(props.ls_s1_wb_moderate) + '</td>'
                    	// + '<td class="landslide_low">' + humanizeTableFormatter(props.ls_s1_wb_low) + '</td>'
                    	// + '</tr><tr><td>Landslide Susceptibility (S2)</td>'
                    	// + '<td class="landslide_vhigh">' + humanizeTableFormatter(props.ls_s2_wb_very_high) + '</td>'
                    	// + '<td class="landslide_high">' + humanizeTableFormatter(props.ls_s2_wb_high) + '</td>'
                    	// + '<td class="landslide_mod">' + humanizeTableFormatter(props.ls_s2_wb_moderate) + '</td>'
                    	// + '<td class="landslide_low">' + humanizeTableFormatter(props.ls_s2_wb_low) + '</td>'
                    	// + '</tr><tr><td>Landslide Susceptibility (S3)</td>'
                    	// + '<td class="landslide_vhigh">' + humanizeTableFormatter(props.ls_s3_wb_very_high) + '</td>'
                    	// + '<td class="landslide_high">' + humanizeTableFormatter(props.ls_s3_wb_high) + '</td>'
                    	// + '<td class="landslide_mod">' + humanizeTableFormatter(props.ls_s3_wb_moderate) + '</td>'
                    	// + '<td class="landslide_low">' + humanizeTableFormatter(props.ls_s3_wb_low) + '</td>'
                    	// + '</tr></tbody></table>'
                    	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
                    : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
        		$('a.linkPopup').on('click', function() {
        		    window.document.location="?page=landslide&code=" + (props.code) ;
        		});
        		$('.' + $('select#landslideOpt').val()).show();
            };

    		var chart = addChart();
    		chart.update = function (props) { 
    			chart_map_donut_lsi = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_donut_lsi',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Landslide Indexes (iMMAP 2017)',
    	                verticalAlign: 'top',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // x: 40,
    	                // y: 0
    	            },
    	            colors: colorLandslide,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Landslide',
    	                data: [[level_risk_pie[0],props.lsi_immap_low],[level_risk_pie[1],props.lsi_immap_moderate],[level_risk_pie[2],props.lsi_immap_high],[level_risk_pie[3],props.lsi_immap_very_high]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    	        chart_map_donut_ku = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_donut_ku',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Multi-criteria Susceptibility Index',
    	                verticalAlign: 'top',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            yAxis: {
    	                title: {
    	                    text: 'Total percent market share'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // x: 40,
    	                // y: 0
    	            },
    	            colors: colorLandslide,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Landslide',
    	                data: [[level_risk_pie[0],props.lsi_ku_low],[level_risk_pie[1],props.lsi_ku_moderate],[level_risk_pie[2],props.lsi_ku_high],[level_risk_pie[3],props.lsi_ku_very_high]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    	        chart_map_donut_s1 = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_donut_s1',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Landslide Susceptibility (S1)',
    	                verticalAlign: 'top',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // x: 40,
    	                // y: 0
    	            },
    	            colors: colorLandslide,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Landslide',
    	                data: [[level_risk_pie[0],props.ls_s1_wb_low],[level_risk_pie[1],props.ls_s1_wb_moderate],[level_risk_pie[2],props.ls_s1_wb_high],[level_risk_pie[3],props.ls_s1_wb_very_high]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    	        chart_map_donut_s2 = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_donut_s2',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Landslide Susceptibility (S2)',
    	                verticalAlign: 'top',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // x: 40,
    	                // y: 0
    	            },
    	            colors: colorLandslide,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Landslide',
    	                data: [[level_risk_pie[0],props.ls_s2_wb_low],[level_risk_pie[1],props.ls_s2_wb_moderate],[level_risk_pie[2],props.ls_s2_wb_high],[level_risk_pie[3],props.ls_s2_wb_very_high]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    	        chart_map_donut_s3 = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_donut_s3',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Landslide Susceptibility (S3)',
    	                verticalAlign: 'top',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // x: 40,
    	                // y: 0
    	            },
    	            colors: colorLandslide,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Landslide',
    	                data: [[level_risk_pie[0],props.ls_s3_wb_low],[level_risk_pie[1],props.ls_s3_wb_moderate],[level_risk_pie[2],props.ls_s3_wb_high],[level_risk_pie[3],props.ls_s3_wb_very_high]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    		}

            var selected = null;

		    geojson = L.geoJson(boundary, {
		        style: style,
		        onEachFeature: onEachFeature
		    }).addTo(lndslideMap);

		    document.getElementById("mapInfo").appendChild(info.onAdd(lndslideMap));

		 //    $('select#landslideOpt').change(function(){
			// 	layer_selected = (this.value);
			//     console.log(layer_selected);

			//     legend.remove();
			//     dataLegend(max_collection[layer_selected]);
			//     legend.addTo(lndslideMap);
			//     geojson.setStyle(style);

			// });

		    $('#landslideOpt').on('change', function() {
		    	info.update();
		    	var selected_opt = $(this).val();
		    	$("input[name='landslide_checkbox']").each(function () {
                    $(this).prop('checked', false);
                });
		    	$('.landslide_opt').hide();

		    	// Checked every checkbox which not disabled and change the value
		    	// $('.lvl_choice .' + selected_opt + ' :checkbox').each(function () {
		    	// 	if($(this).is(":enabled") == true){
		    	// 		$(this).prop('checked', true);
		    	// 		changeValueProp($(this).val());
		    	// 	}
                // });
       			$('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
       			sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));

       			// Checked only the first checkbox and change the value
		    	// $('.lvl_choice .' + selected_opt + ' :checkbox:first').prop('checked', true);
	    	    // changeValueProp($('.' + selected_opt + ' :checkbox:first').val());
	    	    $('.' + selected_opt).show();

	    	    legend.remove();
	    		legend_num_arr = setLegendSeries(val_collection);
	    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	    		legend.addTo(lndslideMap);
	    		geojson.setStyle(style);
		    });

		    $('#themes').on('click','button', function (evt) {
		    	// add active class on selected button
		    	$(this).siblings().removeClass('active')
		    	$(this).addClass('active');

		       	val_theme = $(this).data('btn');
		       	// console.log(val_theme);
		       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		       	geojson.setStyle(style);
		       	// group.setStyle(style);
		       	legend.addTo(lndslideMap);
		    });

		    $("input[name='landslide_checkbox']:checkbox").on("change", function() {
		    	var choosen_cat = $("input[name='landslide_checkbox']:checkbox:checked");
		    	if (choosen_cat.length > 0) {
		    		sumValueProp(choosen_cat);
		    		legend.remove();
		    		legend_num_arr = setLegendSeries(val_collection);
		    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		    		legend.addTo(lndslideMap);
		    		geojson.setStyle(style);
		    	}else{
		    		legend.remove();
		    		sumValueProp(choosen_cat);
		    		geojson.setStyle(style);
		    	}
		    	
		    });

		    // use jQuery to listen for checkbox change event
		    $('div#layercontrol .wms_check input[type="checkbox"]').on('change', function() {    
		        var checkbox = $(this);
		        // lyr = checkbox.data().layer;
		        var lyr = checkbox.attr('data-layer');
		        var selected_layer = wmsLayer[lyr];

		        // toggle the layer
		        if ((checkbox).is(':checked')) {
		            // console.log(selected_layer);

		            // lndslideMap.addLayer(nAirprt);

		            lndslideMap.addLayer(selected_layer);
		            
		        } else {
		            // console.log(lyr);
		            lndslideMap.removeLayer(selected_layer);
		            // layer.remove();
		        }
		    })
		}

		if ($('#leaflet_erthqk_map').length ){
			// Disabling checkbox if no data available
			var erthqkCheckbox=document.getElementsByName("erthqk_checkbox");
			for (var i = 0; i < erthqkCheckbox.length; i++) {
				var r = erthqkCheckbox[i];
				var terpilih = r.value;
				if (getMax(boundary.features, [terpilih])==0) {
					erthqkCheckbox[i].disabled=true;
					$(r).closest("div").addClass("disabled");
				}
			}

			// Setting additional data for earthquake map
			var erthqk_event = "event_code='" + erthqk_code +"'";
			// console.log(erthqk_event);

			var erthqkMap = initMap();
		    // var erthqkMap = L.map('leaflet_erthqk_map').setView([centroid[1],centroid[0]], 8);
		    // var geojsonLayer = L.geoJson(boundary);
		    // erthqkMap.fitBounds(geojsonLayer.getBounds());
		    
		    // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
		    //     attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a>',
		    //     maxZoom: 19
		    // }).addTo(erthqkMap);

		    //Set zoom control with your choosen position
		    // erthqkMap.zoomControl.setPosition('bottomright');

		    var wmsLayer = 
		    {
		        
		        "erthqk" : L.tileLayer.wms('http://asdc.immap.org/geoserver/wms?', {
		                    layers: 'geonode:earthquake_shakemap',
		                    cql_filter: erthqk_event,
		                    format: 'image/png',
		                    transparent: true
		        })


		    };

		    wmsLayer.erthqk.addTo(erthqkMap);

		    // L.control.layers(wmsLayer).addTo(erthqkMap);
		    // var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(erthqkMap);

		    // Data for legend based on selected layer
		    // dataLegend(max_collection.pop_shake_weak);

		    // var layer_selected = "pop_shake_weak";
		    // changeValueProp(layer_selected);

		    $('.lvl_choice .erthqk_checkbox_pop :checkbox:enabled').prop('checked', true);
		    sumValueProp($('.lvl_choice .erthqk_checkbox_pop :checkbox:enabled'));

			legend_num_arr = setLegendSeries(val_collection);

			val_theme = 'YlOrRd';
			var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

		    legend = createLegend();
		    legend.addTo(erthqkMap);

		    var info = addInfo();
            info.update = function (props) {
            	// console.log(props);
                this._div.innerHTML =  
                // this.info.innerHTML = '<h4>' + chosen_label + '</h4>' 
                	(props ?
			        	'<span class="chosen_area">' + props.na_en + '</span>'
			        	+ '<div class="row">'

			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 erthqk_checkbox_pop"><div id="chart_map_mercall_pop" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 erthqk_checkbox_settl"><div id="chart_map_mercall_settl" class="ch-map-size" style="height:280px;"></div></div>'
			        	+ '<div style="display:none;" class="col-md-4 col-sm-12 col-xs-12 erthqk_checkbox_build"><div id="chart_map_mercall_build" class="ch-map-size" style="height:280px;"></div></div>'

                    	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 erthqk_checkbox_pop"><table class="table table-bordered table-condensed"><thead><tr><th>Risk Level</th><th title="Population"><i class="icon-people_affected_population fa-3x"></i></th></tr></thead><tbody>'
                    	+ '<tr><td class="weak">Weak</td><td class="weak">' + humanizeTableFormatter(props.pop_shake_weak)
                    	+ '</td></tr><tr><td class="light">Light</td><td class="light">' + humanizeTableFormatter(props.pop_shake_light)
                    	+ '</td></tr><tr><td class="modrt">Moderate</td><td class="modrt">' + humanizeTableFormatter(props.pop_shake_moderate)
                    	+ '</td></tr><tr><td class="strong">Strong</td><td class="strong">' + humanizeTableFormatter(props.pop_shake_strong)
                    	+ '</td></tr><tr><td class="vstrong">Very Strong</td><td class="vstrong">' + humanizeTableFormatter(props.pop_shake_verystrong)
                    	+ '</td></tr><tr><td class="severe">Severe</td><td class="severe">' + humanizeTableFormatter(props.pop_shake_severe)
                    	+ '</td></tr><tr><td class="violent">Violent</td><td class="violent">' + humanizeTableFormatter(props.pop_shake_violent)
                    	+ '</td></tr><tr><td class="extrme">Extreme</td><td class="extrme">' + humanizeTableFormatter(props.pop_shake_extreme)
                    	+ '</td></tr></tbody></table></div>'

                    	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 erthqk_checkbox_settl"><table class="table table-bordered table-condensed"><thead><tr><th>Risk Level</th><th title="Settlements"><i class="icon-socioeconomic_urban"></i></th></tr></thead><tbody>'
                    	+ '<tr><td class="weak">Weak</td><td class="weak">' + humanizeTableFormatter(props.settlement_shake_weak)
                    	+ '</td></tr><tr><td class="light">Light</td><td class="light">' + humanizeTableFormatter(props.settlement_shake_light)
                    	+ '</td></tr><tr><td class="modrt">Moderate</td><td class="modrt">' + humanizeTableFormatter(props.settlement_shake_moderate)
                    	+ '</td></tr><tr><td class="strong">Strong</td><td class="strong">' + humanizeTableFormatter(props.settlement_shake_strong)
                    	+ '</td></tr><tr><td class="vstrong">Very Strong</td><td class="vstrong">' + humanizeTableFormatter(props.settlement_shake_verystrong)
                    	+ '</td></tr><tr><td class="severe">Severe</td><td class="severe">' + humanizeTableFormatter(props.settlement_shake_severe)
                    	+ '</td></tr><tr><td class="violent">Violent</td><td class="violent">' + humanizeTableFormatter(props.settlement_shake_violent)
                    	+ '</td></tr><tr><td class="extrme">Extreme</td><td class="extrme">' + humanizeTableFormatter(props.settlement_shake_extreme)
                    	+ '</td></tr></tbody></table></div>'

                    	+ '<div style="display:none;" class="col-md-3 col-sm-12 col-xs-12 erthqk_checkbox_build"><table class="table table-bordered table-condensed"><thead><tr><th>Risk Level</th><th title="Buildings"><i class="icon-infrastructure_building fa-3x"></i></th></tr></thead><tbody>'
                    	+ '<tr><td class="weak">Weak</td><td class="weak">' + humanizeTableFormatter(props.buildings_shake_weak)
                    	+ '</td></tr><tr><td class="light">Light</td><td class="light">' + humanizeTableFormatter(props.buildings_shake_light)
                    	+ '</td></tr><tr><td class="modrt">Moderate</td><td class="modrt">' + humanizeTableFormatter(props.buildings_shake_moderate)
                    	+ '</td></tr><tr><td class="strong">Strong</td><td class="strong">' + humanizeTableFormatter(props.buildings_shake_strong)
                    	+ '</td></tr><tr><td class="vstrong">Very Strong</td><td class="vstrong">' + humanizeTableFormatter(props.buildings_shake_verystrong)
                    	+ '</td></tr><tr><td class="severe">Severe</td><td class="severe">' + humanizeTableFormatter(props.buildings_shake_severe)
                    	+ '</td></tr><tr><td class="violent">Violent</td><td class="violent">' + humanizeTableFormatter(props.buildings_shake_violent)
                    	+ '</td></tr><tr><td class="extrme">Extreme</td><td class="extrme">' + humanizeTableFormatter(props.buildings_shake_extreme)
                    	+ '</td></tr></tbody></table></div>'

                    	+ '</div>'

                    	+ '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
                    : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
        		$('a.linkPopup').on('click', function() {
        		    window.document.location="?page=earthquake&code=" + (props.code) + erthqk_link ;
        		});
        		$('.' + $('select#erthqkOpt').val()).show();
            };

            var chart = addChart();
    		chart.update = function (props) { 
    			chart_map_mercall_pop = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_mercall_pop',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Mercalli Population',
    	                verticalAlign: 'top',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // x: 40,
    	                // y: 0
    	            },
    	            colors: colorMercalli,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Mercalli',
    	                data: [[mercalli_cat[0],props.pop_shake_weak],[mercalli_cat[1],props.pop_shake_light],[mercalli_cat[2],props.pop_shake_moderate],[mercalli_cat[3],props.pop_shake_strong],[mercalli_cat[4],props.pop_shake_verystrong],[mercalli_cat[5],props.pop_shake_severe],[mercalli_cat[6],props.pop_shake_violent],[mercalli_cat[7],props.pop_shake_extreme]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });

        		chart_map_mercall_settl = new Highcharts.Chart({
                    chart: {
                        renderTo: 'chart_map_mercall_settl',
                        type: 'pie',
                        style: {
                            fontFamily: '"Arial", Verdana, sans-serif'
                        }
                    },
                    title: {
                        text: 'Mercalli Settlements',
                        verticalAlign: 'top',
                        style: {
                            font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
                        }
                    },
                    plotOptions: {
                        pie: {
                            shadow: false
                        }
                    },
                    tooltip: {
                        formatter: function() {
                            return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
                        }
                    },
                    legend: {
                        align: 'right',
                        layout: 'vertical',
                        verticalAlign: 'bottom'
                        // x: 40,
                        // y: 0
                    },
                    colors: colorMercalli,
                    credits: {
                        enabled: false
                    },
                    series: [{
                        name: 'Mercalli',
                        data: [[mercalli_cat[0],props.settlement_shake_weak],[mercalli_cat[1],props.settlement_shake_light],[mercalli_cat[2],props.settlement_shake_moderate],[mercalli_cat[3],props.settlement_shake_strong],[mercalli_cat[4],props.settlement_shake_verystrong],[mercalli_cat[5],props.settlement_shake_severe],[mercalli_cat[6],props.settlement_shake_violent],[mercalli_cat[7],props.settlement_shake_extreme]],
                        size: '90%',
                        innerSize: '65%',
                        showInLegend:true,
                        dataLabels: {
                            enabled: false
                        }
                    }]
                });

                chart_map_mercall_build = new Highcharts.Chart({
    	            chart: {
    	                renderTo: 'chart_map_mercall_build',
    	                type: 'pie',
    	                style: {
    	                    fontFamily: '"Arial", Verdana, sans-serif'
    	                }
    	            },
    	            title: {
    	                text: 'Mercalli Buildings',
    	                verticalAlign: 'top',
    	                style: {
    	                    font: 'bold 13px "Trebuchet MS", Verdana, sans-serif'
    	                }
    	            },
    	            plotOptions: {
    	                pie: {
    	                    shadow: false
    	                }
    	            },
    	            tooltip: {
    	                formatter: function() {
    	                    return '<b>'+ this.point.name +'</b>: '+ humanizeTableFormatter(this.y);
    	                }
    	            },
    	            legend: {
    	                align: 'right',
    	                layout: 'vertical',
    	                verticalAlign: 'bottom'
    	                // x: 40,
    	                // y: 0
    	            },
    	            colors: colorMercalli,
    	            credits: {
    	                enabled: false
    	            },
    	            series: [{
    	                name: 'Mercalli',
    	                data: [[mercalli_cat[0],props.buildings_shake_weak],[mercalli_cat[1],props.buildings_shake_light],[mercalli_cat[2],props.buildings_shake_moderate],[mercalli_cat[3],props.buildings_shake_strong],[mercalli_cat[4],props.buildings_shake_verystrong],[mercalli_cat[5],props.buildings_shake_severe],[mercalli_cat[6],props.buildings_shake_violent],[mercalli_cat[7],props.buildings_shake_extreme]],
    	                size: '90%',
    	                innerSize: '65%',
    	                showInLegend:true,
    	                dataLabels: {
    	                    enabled: false
    	                }
    	            }]
    	        });
    		}

            var selected = null;

		    geojson = L.geoJson(boundary, {
		        style: style,
		        onEachFeature: onEachFeature
		    }).addTo(erthqkMap);

		    document.getElementById("mapInfo").appendChild(info.onAdd(erthqkMap));

		    // var popupContent = function (e){
		    // 	// console.log(e);
		    // 	var featureProp = e.feature.properties;
		    // 	var div_popup = L.DomUtil.create('div', 'customPopupContent');
		    // 	div_popup.innerHTML = 
		    // 		'<h4>' + featureProp.na_en + '</h4>'
		    // 		+ '<table class="table table-bordered table-condensed"><thead><tr><th>Risk Level</th><th title="Population"><i class="icon-people_affected_population fa-3x"></i></th><th title="Settlements"><i class="icon-socioeconomic_urban"></i></th><th title="Buildings"><i class="icon-infrastructure_building fa-3x"></i></th></tr></thead><tbody>'
		    // 		+ '<tr><td class="weak">Weak</td><td class="weak">' + humanizeTableFormatter(featureProp.pop_shake_weak)
		    // 		+ '</td><td class="weak">' + humanizeTableFormatter(featureProp.settlement_shake_weak)
		    // 		+ '</td><td class="weak">' + humanizeTableFormatter(featureProp.buildings_shake_weak)
		    // 		+ '</tr><tr><td class="light">Light</td><td class="light">' + humanizeTableFormatter(featureProp.pop_shake_light)
		    // 		+ '</td><td class="light">' + humanizeTableFormatter(featureProp.settlement_shake_light)
		    // 		+ '</td><td class="light">' + humanizeTableFormatter(featureProp.buildings_shake_light)
		    // 		+ '</tr><tr><td class="modrt">Moderate</td><td class="modrt">' + humanizeTableFormatter(featureProp.pop_shake_moderate)
		    // 		+ '</td><td class="modrt">' + humanizeTableFormatter(featureProp.settlement_shake_moderate)
		    // 		+ '</td><td class="modrt">' + humanizeTableFormatter(featureProp.buildings_shake_moderate)
		    // 		+ '</tr><tr><td class="strong">Strong</td><td class="strong">' + humanizeTableFormatter(featureProp.pop_shake_strong)
		    // 		+ '</td><td class="strong">' + humanizeTableFormatter(featureProp.settlement_shake_strong)
		    // 		+ '</td><td class="strong">' + humanizeTableFormatter(featureProp.buildings_shake_strong)
		    // 		+ '</tr><tr><td class="vstrong">Very Strong</td><td class="vstrong">' + humanizeTableFormatter(featureProp.pop_shake_verystrong)
		    // 		+ '</td><td class="vstrong">' + humanizeTableFormatter(featureProp.settlement_shake_verystrong)
		    // 		+ '</td><td class="vstrong">' + humanizeTableFormatter(featureProp.buildings_shake_verystrong)
		    // 		+ '</tr><tr><td class="severe">Severe</td><td class="severe">' + humanizeTableFormatter(featureProp.pop_shake_severe)
		    // 		+ '</td><td class="severe">' + humanizeTableFormatter(featureProp.settlement_shake_severe)
		    // 		+ '</td><td class="severe">' + humanizeTableFormatter(featureProp.buildings_shake_severe)
		    // 		+ '</tr><tr><td class="violent">Violent</td><td class="violent">' + humanizeTableFormatter(featureProp.pop_shake_violent)
		    // 		+ '</td><td class="violent">' + humanizeTableFormatter(featureProp.settlement_shake_violent)
		    // 		+ '</td><td class="violent">' + humanizeTableFormatter(featureProp.buildings_shake_violent)
		    // 		+ '</tr><tr><td class="extrme">Extreme</td><td class="extrme">' + humanizeTableFormatter(featureProp.pop_shake_extreme)
		    // 		+ '</td><td class="extrme">' + humanizeTableFormatter(featureProp.settlement_shake_extreme)
		    // 		+ '</td><td class="extrme">' + humanizeTableFormatter(featureProp.buildings_shake_extreme)
		    // 		+ '</tr></tbody></table>'
		    // 		+ '<a class="linkPopup">Go To ' + (featureProp.na_en) +'</a>';
		    // 	$('a.linkPopup', div_popup).on('click', function() {
		    // 	    window.document.location="?page=earthquake&code=" + (featureProp.code) + erthqk_link ;
		    // 	});

		    // 	return div_popup;
		    // }

		    // var popupOptions = {
		    // 	className: "customPopup"
		    // }

		    // // Enabling pop up when clicked
		    // geojson.eachLayer(function (layer) {
		    // 	popupContent(layer);
		    //     layer.bindPopup(popupContent, popupOptions);
		    // });

		    // Disabling radio button if no data
		    var erthqkRadio=document.getElementsByName("erthqk_radio");
		    for (var i = 0; i < erthqkRadio.length; i++) {
		    	var r = erthqkRadio[i];
		    	var terpilih = r.value;
		    	if (getMax(boundary.features, [terpilih])==0) {
		    		erthqkRadio[i].disabled=true;
		    		$(r).closest("div").addClass("disabled");
		    	}
		    }

		    $('#erthqkOpt').on('change', function() {
		    	info.update();
		    	var selected_opt = $(this).val();
		    	$("input[name='erthqk_checkbox']").each(function () {
                    $(this).prop('checked', false);
                });
		    	$('.erthqk_opt').hide();

		    	// Checked only the first checkbox and change the value
		    	// $('.' + selected_opt + ' :checkbox:first').prop('checked', true);
	    	    // changeValueProp($('.' + selected_opt + ' :checkbox:first').val());

	    	    // Checked every checkbox which not disabled and sum the value
	    	    $('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
	    	    sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));
	    	    $('.' + selected_opt).show();

	    	    legend.remove();
	    		legend_num_arr = setLegendSeries(val_collection);
	    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	    		legend.addTo(erthqkMap);
	    		geojson.setStyle(style);
		    });

		    $('#themes').on('click','button', function (evt) {
		    	// add active class on selected button
		    	$(this).siblings().removeClass('active')
		    	$(this).addClass('active');

		       	val_theme = $(this).data('btn');
		       	// console.log(val_theme);
		       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		       	geojson.setStyle(style);
		       	// group.setStyle(style);
		       	legend.addTo(erthqkMap);
		    });

		    $('#layercontrol input[type=radio]').change(function(){
		    	layer_selected = (this.value);
		        // console.log(layer_selected);

		        legend.remove();
		        dataLegend(max_collection[layer_selected]);
		        legend.addTo(erthqkMap);
		        geojson.setStyle(style);

		    });

		    $("input[name='erthqk_checkbox']:checkbox").on("change", function() {
		    	var choosen_cat = $("input[name='erthqk_checkbox']:checkbox:checked");
		    	if (choosen_cat.length > 0) {
		    		sumValueProp(choosen_cat);
		    		legend.remove();
		    		legend_num_arr = setLegendSeries(val_collection);
		    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		    		legend.addTo(erthqkMap);
		    		geojson.setStyle(style);

    		    	// var max_val = 0;
    			    // for (var i = 0; i < boundary.features.length; i++) {
    			    // 	//declare a variable to keep the sum of the values
    			    // 	var sum = 0;
    		    	//     //using an iterator find and sum the properties values of checked checkboxes
    		    	//     $("input[name='erthqk_checkbox']:checkbox:checked").each(function() {
    		    	// 		sum += boundary['features'][i]['properties'][$(this).val()];
    		    	//     });
    		    	//     boundary['features'][i]['properties']['value']=sum;

    		    	//     // if (sum > 0) { //put only the value > 0
    		    	//     	val_collection.push(sum);
    		    	//     // }
    		    	//     if (max_val < sum) {
    		    	//       max_val = sum;
    		    	//     }
    			    // }

    			    // data_series = new geostats(val_collection);

    			    // console.log(data_series.getJenks(6));
    			    // console.log(val_collection);
    			    // console.log(median(val_collection));
    			    // legend.remove();
    			    // legend_num_arr = data_series.getJenks(7);
    			    // // dataLegend(median(val_collection));
    			    // legend.addTo(erthqkMap);
    			    // geojson.setStyle(style);
		    	}else{
		    		legend.remove();
		    		sumValueProp(choosen_cat);
		    		geojson.setStyle(style);
		    	}
		    	
		    });

		    // use jQuery to listen for checkbox change event
		    $('div#layercontrol .wms_check input[type="checkbox"]').on('change', function() {    
		        var checkbox = $(this);
		        // lyr = checkbox.data().layer;
		        var lyr = checkbox.attr('data-layer');
		        var selected_layer = wmsLayer[lyr];

		        // toggle the layer
		        if ((checkbox).is(':checked')) {
		        	// console.log(selected_layer);

		            // accessMap.addLayer(nAirprt);

		            erthqkMap.addLayer(selected_layer);
		            
		        } else {
		            erthqkMap.removeLayer(selected_layer);
		            // layer.remove();
		        }
		    })
		}

		if ($('#leaflet_haccess_map').length ){
		    var haccessMap = initMap();

		    // Data for legend based on selected layer
			var layer_selected = "total_incident";

			changeValueProp(layer_selected);
			legend_num_arr = setLegendSeries(val_collection);

			val_theme = 'YlOrRd';
			var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

			legend = createLegend();
			legend.addTo(haccessMap);

		    var info = addInfo();

		    // method that we will use to update the control based on feature properties passed
		    info.update = function (props) {
		        // console.log(props);
		        this._div.innerHTML = 
		            (props ?
			        	'<span class="chosen_area">' + props.na_en + '</span>'
			        	+ '<div class="row"><div class="col-md-12 col-sm-12 col-xs-12"><div class="circle_container"><i class="icon-security_attack fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_incident) + '</span><span class="circle_title">' + map_category[0] + '</span></div>'
			        	+ '<div class="circle_container"><i class="icon-security_murder fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_violent) + '</span><span class="circle_title">' + map_category[1] + '</span></div>'
			        	+ '<div class="circle_container"><i class="icon-people_injured fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_injured) + '</span><span class="circle_title">' + map_category[2] + '</span></div>'
			        	+ '<div class="circle_container"><i class="icon-people_dead fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_dead) + '</span><span class="circle_title">' + map_category[3] + '</span></div></div>'

			        	+ '</div>'

		                // + '</b><br />' + map_category[0] + ' : ' + humanizeTableFormatter(props.total_incident)
		                // + '<br />' + map_category[1] + ' : ' + humanizeTableFormatter(props.total_violent)
		                // + '<br />' + map_category[2] + ' : ' + humanizeTableFormatter(props.total_injured)
		                // + '<br />' + map_category[3] + ' : ' + humanizeTableFormatter(props.total_dead)
		                + '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
		            : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
		            $('a.linkPopup').on('click', function() {
		            	jump_url(props.code);
		                // window.document.location="?page=earthquake&code=" + (props.code) ;
		            });
		    };

		    var chart = null;

		    var selected = null;

		    // geojson = L.geoJson(boundary, {
		    // 	pointToLayer: function (feature, latlng) {
		    // 	        return L.circleMarker(latlng, styleBubble(feature));
		    // 	    },
		    //     // style: styleBubble,
		    //     onEachFeature: onEachBubbleFeature
		    // }).addTo(haccessMap);

		    geojson = L.geoJson(boundary, {
		        style: style,
		        onEachFeature: onEachFeature
		    })/*.addTo(haccessMap)*/;

		    group = L.featureGroup([geojson]).addLayer(geojson);
		    this_map = haccessMap;

		    document.getElementById("mapInfo").appendChild(info.onAdd(haccessMap));

		    sliderRangeValue = addSlider();

		    $('select#haccessOpt').change(function(){
		    	group.clearLayers();
		    	info.update();
		    	layer_selected = (this.value);
		        // console.log(layer_selected);

		        legend.remove();
		        changeValueProp(layer_selected);
		        legend_num_arr = setLegendSeries(val_collection);
		        getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		        legend.addTo(haccessMap);
		        

		        if (legend_num_arr.length<2) {
		        	updateSliderRange(0,legend_num_arr[0]);
		        }else{
		        	updateSliderRange(legend_num_arr[0],legend_num_arr[legend_num_arr.length-1]);
		        }

		        console.log("bawah");
		        geojson.setStyle(style);
		        group.setStyle(style);
		        group.addTo(haccessMap);
		        console.log("bawah lagi");
		    });

		    $('#themes').on('click','button', function (evt) {
		    	// add active class on selected button
		    	$(this).siblings().removeClass('active')
		    	$(this).addClass('active');

		       	val_theme = $(this).data('btn');
		       	// console.log(val_theme);
		       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		       	group.setStyle(style);
		       	legend.addTo(haccessMap);
		    });
		}
		
	});


});
