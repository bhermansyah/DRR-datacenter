// Add active class based on dashboard page
function addActiveDashboard(){
	var pathname2= window.location.pathname;
	var search2= window.location.search;
	var fullpath2= pathname2+search2;
	// if (window.location.href.match(/\?page=baseline&*/) || window.location.href.match(/\?page=accessibility&*/) || window.location.href.match(/\?page=floodforecast&*/) || window.location.href.match(/\?page=floodrisk&*/) || window.location.href.match(/\?page=avalcheforecast&*/) || window.location.href.match(/\?page=avalancherisk&*/) || window.location.href.match(/\?page=earthquake&*/) || window.location.href.match(/\?page=security&*/) || window.location.href.match(/\?page=naturaldisaster&*/) || window.location.href.match(/\?page=weather&*/)){
		$('nav.navbar-lower .nav>li>a[href="'+fullpath2+'"]').parent().addClass('active');
	// }

	if (window.location.href.match(/\?page=floodforecast&*/) || window.location.href.match(/\?page=floodrisk&*/) || window.location.href.match(/\?page=avalcheforecast&*/) || window.location.href.match(/\?page=avalancherisk&*/)) {
		$('nav.navbar-lower .nav .dropdown-menu>li>a[href="'+fullpath2+'"]').parent().parent().parent().addClass('active');
	}
}

// Panel toolbox
function panel_toolbox(){
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
}
// /Panel toolbox

function humanizeTableFormatter(value){
	// console.log(value)
	var v= value;
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
}

// Echart
function init_echarts() {

	var humTooltipPie = function(params){
	    // console.log(params)
	    var v= params.data.value;
	    var p= params.percent;
	    var n= params.name;
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
		var v= params.data.value;
		var p= params.percent;
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
		var v= params.data;
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
	    var s = '';
	    params.data.value.forEach(function(item, index){
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
	};

	var humanizeFormatter = function(value){
		var v= value;
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

  	// var w = ['#ffaaab', '#ff6264', '#d13c3e', '#b92527']

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

  	var sizeBubble = 
  		function (val) {
            return Math.log(val)*3;
        }

	var delay = 
		function (idx) {
            return idx * 5;
        }

	// case "accessibility":
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
			    series: [
				    {
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
				    }
			    ]
			});

			window.addEventListener("resize", function(){
				echartPolarTarget.resize();
			});
		}

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
			    series: [
				    {
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
				    }
			    ]
			});

			window.addEventListener("resize", function(){
				echartPolarIncident.resize();
			});
		}

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

// Datatables
function init_datatable(){
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
}

// Leaflet
function init_leaflet(){
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

	// Get map ID
	if ($('.ch-size-map').length) {
		var id_map = document.querySelector('.ch-size-map').id;
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

		if (set_jenk_divider<=7) {
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
			group = L.featureGroup().addLayer(digital_zips);
			group.addTo(this_map);

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
	if ($('#leaflet_baseline_map').length ){
		var baselineMap = initMap();

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
		    this._div.innerHTML = 
		    	(props ?
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
		        : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
			$('a.linkPopup').on('click', function() {
			    window.document.location="?page=baseline&code=" + (props.code) ;
			});
			$('.' + $('select#baselineOpt').val()).show();
		};

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

		sliderRangeValue = addSlider();

		$('select#baselineOpt').change(function(){
			group.clearLayers();
			info.update();
			layer_selected = (this.value);

		    // geojson.remove();
		    legend.remove();
		    changeValueProp(layer_selected);
		    legend_num_arr = setLegendSeries(val_collection);
		    // console.log(legend_num_arr);
		    getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		    legend.addTo(baselineMap);

		    if (legend_num_arr.length==1) {
		    	updateSliderRange(0,legend_num_arr[legend_num_arr.length-1]);
		    }else{
		    	updateSliderRange(legend_num_arr[0],legend_num_arr[legend_num_arr.length-1]);
		    }

		    group.setStyle(style);
		    group.addTo(baselineMap);

		});

		$('#themes').on('click','button', function (evt) {
			// add active class on selected button
			$(this).siblings().removeClass('active')
			$(this).addClass('active');

		   	val_theme = $(this).data('btn');
		   	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
		   	group.setStyle(style);
		   	legend.addTo(baselineMap);
		});
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

	    $('.lvl_choice .access_checkbox_nAirprt :checkbox:enabled').prop('checked', true);
	    sumValueProp($('.lvl_choice .access_checkbox_nAirprt :checkbox:enabled'));

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

	    var info = addInfo();
	    info.update = function (props) {
	    	// console.log(props);
	        this._div.innerHTML = 
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
	            accessMap.addLayer(selected_layer);
	            
	        } else {
	            accessMap.removeLayer(selected_layer);
	            // layer.remove();
	        }
	    })
	}

	if ($('#leaflet_fforecast_map').length ){
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

		var fforecastMap = initMap();

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

        $('.lvl_choice .fforecast_checkbox_flash_pop :checkbox:enabled').prop('checked', true);
        sumValueProp($('.lvl_choice .fforecast_checkbox_flash_pop :checkbox:enabled'));
    	legend_num_arr = setLegendSeries(val_collection);

    	val_theme = 'YlOrRd';
    	var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

        legend = createLegend();
        legend.addTo(fforecastMap);

        var info = addInfo();
        info.update = function (props) {
            this._div.innerHTML = 
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

	    // Show Related checkbox and checked all the option if dropdown changes
	    $('#fforecastOpt').on('change', function() {
	    	info.update();
	    	var selected_opt = $(this).val();
	    	$("input[name='fforecast_checkbox']").each(function () {
                $(this).prop('checked', false);
            });
	    	$('.fforecast_opt').hide();

    	    $('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
    	    sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));
    	    $('.' + selected_opt).show();

    	    legend.remove();
    		legend_num_arr = setLegendSeries(val_collection);
    		getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
    		legend.addTo(fforecastMap);
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
	            fforecastMap.addLayer(selected_layer);
	            
	        } else {
	        	// console.log(lyr);
	            fforecastMap.removeLayer(selected_layer);
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
		});

		group = L.featureGroup([geojson]).addLayer(geojson);
		this_map = floodRiskMap;

		document.getElementById("mapInfo").appendChild(info.onAdd(floodRiskMap));

		sliderRangeValue = addSlider();

		$('select#friskOpt').change(function(){
			group.clearLayers();
			info.update();
			layer_selected = (this.value);

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
		   	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
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
		        floodRiskMap.addLayer(selected_layer);
		        
		    } else {
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

	    $('#aforecastOpt').on('change', function() {
	    	info.update();
	    	var selected_opt = $(this).val();
	    	$("input[name='aforecast_checkbox']").each(function () {
                $(this).prop('checked', false);
            });
	    	$('.aforecast_opt').hide();

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
	       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	       	geojson.setStyle(style);
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
	            aforecastMap.addLayer(selected_layer);
	            
	        } else {
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

	    $('#ariskOpt').on('change', function() {
	    	info.update();
	    	var selected_opt = $(this).val();
	    	$("input[name='arisk_checkbox']").each(function () {
                $(this).prop('checked', false);
            });
	    	$('.arisk_opt').hide();

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
	            avaRiskMap.addLayer(selected_layer);
	            
	        } else {
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

	    //Add Layer Control to the map
	    // L.control.layers(wmsLayer).addTo(lndslideMap);
	    // var controlLayer = L.control.layers({}, wmsLayer, {position: 'topleft', collapsed: false}).addTo(lndslideMap);

		$('.lvl_choice .landslide_checkbox_ku :checkbox:enabled').prop('checked', true);
		sumValueProp($('.lvl_choice .landslide_checkbox_ku :checkbox:enabled'));

    	legend_num_arr = setLegendSeries(val_collection);

    	val_theme = 'YlOrRd';
    	var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

		legend = createLegend();
		legend.addTo(lndslideMap);

		var info = addInfo();
        info.update = function (props) {
            this._div.innerHTML = 
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

	    $('#landslideOpt').on('change', function() {
	    	info.update();
	    	var selected_opt = $(this).val();
	    	$("input[name='landslide_checkbox']").each(function () {
                $(this).prop('checked', false);
            });
	    	$('.landslide_opt').hide();

	    	// Checked every checkbox which not disabled and change the value
   			$('.lvl_choice .' + selected_opt + ' :checkbox:enabled').prop('checked', true);
   			sumValueProp($('.lvl_choice .' + selected_opt + ' :checkbox:enabled'));

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
	            lndslideMap.addLayer(selected_layer);
	            
	        } else {
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

	    $('.lvl_choice .erthqk_checkbox_pop :checkbox:enabled').prop('checked', true);
	    sumValueProp($('.lvl_choice .erthqk_checkbox_pop :checkbox:enabled'));

		legend_num_arr = setLegendSeries(val_collection);

		val_theme = 'YlOrRd';
		var getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");

	    legend = createLegend();
	    legend.addTo(erthqkMap);

	    var info = addInfo();
        info.update = function (props) {
            this._div.innerHTML =  
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
	       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	       	geojson.setStyle(style);
	       	legend.addTo(erthqkMap);
	    });

	    $('#layercontrol input[type=radio]').change(function(){
	    	layer_selected = (this.value);
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
	        this._div.innerHTML = 
	            (props ?
		        	'<span class="chosen_area">' + props.na_en + '</span>'
		        	+ '<div class="row"><div class="col-md-12 col-sm-12 col-xs-12"><div class="circle_container"><i class="icon-security_attack fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_incident) + '</span><span class="circle_title">' + map_category[0] + '</span></div>'
		        	+ '<div class="circle_container"><i class="icon-security_murder fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_violent) + '</span><span class="circle_title">' + map_category[1] + '</span></div>'
		        	+ '<div class="circle_container"><i class="icon-people_injured fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_injured) + '</span><span class="circle_title">' + map_category[2] + '</span></div>'
		        	+ '<div class="circle_container"><i class="icon-people_dead fa-3x circle_info"></i><span class="circle_data">' + humanizeTableFormatter(props.total_dead) + '</span><span class="circle_title">' + map_category[3] + '</span></div></div>'

		        	+ '</div>'

	                + '<a class="btn btn-primary linkPopup">Go To ' + (props.na_en) +'</a>'
	            : '<h4>' + chosen_label + '</h4>' + 'Click on an area to show information');
	            $('a.linkPopup').on('click', function() {
	            	jump_url(props.code);
	            });
	    };

	    var chart = null;

	    var selected = null;

	    geojson = L.geoJson(boundary, {
	        style: style,
	        onEachFeature: onEachFeature
	    });

	    group = L.featureGroup([geojson]).addLayer(geojson);
	    this_map = haccessMap;

	    document.getElementById("mapInfo").appendChild(info.onAdd(haccessMap));

	    sliderRangeValue = addSlider();

	    $('select#haccessOpt').change(function(){
	    	group.clearLayers();
	    	info.update();
	    	layer_selected = (this.value);
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

	        geojson.setStyle(style);
	        group.setStyle(style);
	        group.addTo(haccessMap);
	    });

	    $('#themes').on('click','button', function (evt) {
	    	// add active class on selected button
	    	$(this).siblings().removeClass('active')
	    	$(this).addClass('active');

	       	val_theme = $(this).data('btn');
	       	getChroma = chroma.scale(val_theme).classes(legend_num_arr).out("hex");
	       	group.setStyle(style);
	       	legend.addTo(haccessMap);
	    });
	}
}

$(document).ready(function(){
	addActiveDashboard()
	init_echarts();
	init_datatable();
	init_leaflet();
});