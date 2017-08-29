import os,sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

import csv
from django.db import connection, connections

from geodb.models import AfgFldzonea100KRiskLandcoverPop, AfgLndcrva, AfgAdmbndaAdm1, AfgAdmbndaAdm2, AfgFldzonea100KRiskMitigatedAreas, AfgAvsa, Forcastedvalue, AfgShedaLvl4, districtsummary, provincesummary, basinsummary, AfgPpla, tempCurrentSC, earthquake_events, earthquake_shakemap, villagesummaryEQ, AfgPplp, AfgSnowaAverageExtent, AfgCaptPpl, AfgAirdrmp, AfgHltfac, forecastedLastUpdate, AfgCaptGmscvr, AfgEqtUnkPplEqHzd, Glofasintegrated, AfgBasinLvl4GlofasPoint, AfgPpltDemographics
from django.shortcuts import render, get_object_or_404
from geodb.views import getConvertedTime, getConvertedDistance, getAngle, getDirectionLabel
from django.db.models import Count, Sum, F

first = True
f_IN = open(sys.argv[1], 'rU')
f_OUT= open(sys.argv[2], 'wt')
ggg = 0
try:
	reader = csv.reader(f_IN)
	writer = csv.writer(f_OUT)
	data = []
	for row in reader:
		if first:
			first = False
		else:
			ggg += 1
			print ggg

			# general Info
			databaseFields = AfgPpla._meta.get_all_field_names()
			databaseFields.remove('ogc_fid')
			databaseFields.remove('wkb_geometry')
			databaseFields.remove('shape_length')
			databaseFields.remove('shape_area')
			databaseFields.remove('name_local')
			px = get_object_or_404(AfgPpla, vuid=row[0])
			context_dict = {}
			context_dict['VUID'] = row[0]
			for i in databaseFields:
				context_dict[i] = getattr(px, i)

			px = get_object_or_404(AfgPplp, vil_uid=row[0])
			context_dict['language_field'] = px.language_field
			context_dict['elevation'] = round(px.elevation,1)
			context_dict['position'] = px.wkb_geometry

			# Demographics
			rowsgenderpercent = AfgPpltDemographics.objects.all().filter(vuidnear=row[0]).values()
			ttt = rowsgenderpercent[0]
			for i in ttt:
				context_dict[i] = ttt[i]

			# accessibilities
			px = get_object_or_404(AfgCaptPpl, vil_uid=row[0])
			context_dict['cl_road_time']=getConvertedTime(px.time_to_road)
			context_dict['cl_road_distance']=getConvertedDistance(px.distance_to_road)

		    # airport
			try:
			    ptemp = get_object_or_404(AfgAirdrmp, geonameid=px.airdrm_id)
			    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			    context_dict['cl_airport_name']=ptemp.namelong
			    context_dict['cl_airport_time']=getConvertedTime(px.airdrm_time)
			    context_dict['cl_airport_distance']=getConvertedDistance(px.airdrm_dist)
			    context_dict['cl_airport_angle']=angle['angle']
			    context_dict['cl_airport_direction_label']=getDirectionLabel(angle['angle'])
			except:
			    print 'not found'

			# closest prov capital
			try:
			    ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_provc_vuid)
			    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			    context_dict['cl_prov_cap_name']=ptemp.name_en
			    context_dict['cl_prov_cap_time']=getConvertedTime(px.ppl_provc_time)
			    context_dict['cl_prov_cap_distance']=getConvertedDistance(px.ppl_provc_dist)
			    context_dict['cl_prov_cap_angle']=angle['angle']
			    context_dict['cl_prov_cap_direction_label']=getDirectionLabel(angle['angle'])
			    context_dict['cl_prov_cap_parent'] = ptemp.prov_na_en
			except:
			    print 'not found'

			# Its prov capital
			try:
			    ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_provc_its_vuid)
			    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			    context_dict['it_prov_cap_name']=ptemp.name_en
			    context_dict['it_prov_cap_time']=getConvertedTime(px.ppl_provc_its_time)
			    context_dict['it_prov_cap_distance']=getConvertedDistance(px.ppl_provc_its_dist)
			    context_dict['it_prov_cap_angle']=angle['angle']
			    context_dict['it_prov_cap_direction_label']=getDirectionLabel(angle['angle'])
			except:
			    print 'not found'

			# closest district capital
			try:
			    ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_distc_vuid)
			    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			    context_dict['cl_dist_cap_name']=ptemp.name_en
			    context_dict['cl_dist_cap_time']=getConvertedTime(px.ppl_distc_time)
			    context_dict['cl_dist_cap_distance']=getConvertedDistance(px.ppl_distc_dist)
			    context_dict['cl_dist_cap_angle']=angle['angle']
			    context_dict['cl_dist_cap_direction_label']=getDirectionLabel(angle['angle'])
			    context_dict['cl_dist_cap_parent'] = ptemp.prov_na_en
			except:
			    print 'not found'

			# Its district capital
			try:
			    ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_distc_its_vuid)
			    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			    context_dict['it_dist_cap_name']=ptemp.name_en
			    context_dict['it_dist_cap_time']=getConvertedTime(px.ppl_distc_its_time)
			    context_dict['it_dist_cap_distance']=getConvertedDistance(px.ppl_distc_its_dist)
			    context_dict['it_dist_cap_angle']=angle['angle']
			    context_dict['it_dist_cap_direction_label']=getDirectionLabel(angle['angle'])
			except:
			    print 'not found'

			# Closest HF tier 1
			try:
			    ptemp = get_object_or_404(AfgHltfac, facility_id=px.hltfac_tier1_id)
			except:
			    ptemp = AfgHltfac.objects.all().filter(facility_id=px.hltfac_tier1_id)[0]
			angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			context_dict['t1_hf_name']=ptemp.facility_name
			context_dict['t1_hf_time']=getConvertedTime(px.hltfac_tier1_time)
			context_dict['t1_hf_distance']=getConvertedDistance(px.hltfac_tier1_dist)
			context_dict['t1_hf_angle']=angle['angle']
			context_dict['t1_hf_direction_label']=getDirectionLabel(angle['angle'])
			context_dict['t1_hf_prov_parent'] = ptemp.prov_na_en
			context_dict['t1_hf_dist_parent'] = ptemp.dist_na_en

			# Closest HF tier 2
			try:
			    ptemp = get_object_or_404(AfgHltfac, facility_id=px.hltfac_tier2_id)
			except:
			    ptemp = AfgHltfac.objects.all().filter(facility_id=px.hltfac_tier2_id)[0]
			angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			context_dict['t2_hf_name']=ptemp.facility_name
			context_dict['t2_hf_time']=getConvertedTime(px.hltfac_tier2_time)
			context_dict['t2_hf_distance']=getConvertedDistance(px.hltfac_tier2_dist)
			context_dict['t2_hf_angle']=angle['angle']
			context_dict['t2_hf_direction_label']=getDirectionLabel(angle['angle'])
			context_dict['t2_hf_prov_parent'] = ptemp.prov_na_en
			context_dict['t2_hf_dist_parent'] = ptemp.dist_na_en

			# Closest HF tier 3
			try:
			    ptemp = get_object_or_404(AfgHltfac, facility_id=px.hltfac_tier3_id)
			except:
			    ptemp = AfgHltfac.objects.all().filter(facility_id=px.hltfac_tier3_id)[0]
			angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
			context_dict['t3_hf_name']=ptemp.facility_name
			context_dict['t3_hf_time']=getConvertedTime(px.hltfac_tier3_time)
			context_dict['t3_hf_distance']=getConvertedDistance(px.hltfac_tier3_dist)
			context_dict['t3_hf_angle']=angle['angle']
			context_dict['t3_hf_direction_label']=getDirectionLabel(angle['angle'])
			context_dict['t3_hf_prov_parent'] = ptemp.prov_na_en
			context_dict['t3_hf_dist_parent'] = ptemp.dist_na_en

			# GSM Coverages
			try:
			    ptemp = get_object_or_404(AfgCaptGmscvr, vuid=row[0])
			    if ptemp:
			        context_dict['gsm_covered'] = 'Yes'
			    else:
			        context_dict['gsm_covered'] = 'No coverage'
			except:
			    ptemp = AfgCaptGmscvr.objects.all().filter(vuid=row[0])
			    if len(ptemp)>0:
			        context_dict['gsm_covered'] = 'Yes'
			    else:
			        context_dict['gsm_covered'] = 'No coverage'

			# flood risk
			targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all().filter(vuid=row[0])
			targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and Marshland')

			floodRisk = targetRisk.values('deeperthan').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm'), buildings=Sum('area_buildings')).values('deeperthan','pop', 'area', 'buildings')
			temp = dict([(c['deeperthan'], c['pop']) for c in floodRisk])
			context_dict['high_flood_risk_population']=round(temp.get('271 cm', 0) or 0,0)
			context_dict['med_flood_risk_population']=round(temp.get('121 cm', 0) or 0, 0)
			context_dict['low_flood_risk_population']=round(temp.get('029 cm', 0) or 0,0)

			temp = dict([(c['deeperthan'], c['buildings']) for c in floodRisk])
			context_dict['high_flood_risk_buildings']=round(temp.get('271 cm', 0) or 0,0)
			context_dict['med_flood_risk_buildings']=round(temp.get('121 cm', 0) or 0, 0)
			context_dict['low_flood_risk_buildings']=round(temp.get('029 cm', 0) or 0,0)

			temp = dict([(c['deeperthan'], c['area']) for c in floodRisk])
			context_dict['high_flood_risk_area']=round(temp.get('271 cm', 0)/1000000,1)
			context_dict['med_flood_risk_area']=round(temp.get('121 cm', 0)/1000000,1)
			context_dict['low_flood_risk_area']=round(temp.get('029 cm', 0)/1000000,1)

			floodRiskLC = targetRiskIncludeWater.values('agg_simplified_description').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('agg_simplified_description','pop', 'area')
			temp = dict([(c['agg_simplified_description'], c['vuid_population']) for c in floodRiskLC])
			context_dict['water_body_pop_flood_risk']=round(temp.get('Water body and Marshland', 0),0)
			context_dict['barren_land_pop_flood_risk']=round(temp.get('Barren land', 0),0)
			context_dict['built_up_pop_flood_risk']=round(temp.get('Build Up', 0),0)
			context_dict['fruit_trees_pop_flood_risk']=round(temp.get('Fruit Trees', 0),0)
			context_dict['irrigated_agricultural_land_pop_flood_risk']=round(temp.get('Irrigated Agricultural Land', 0),0)
			context_dict['permanent_snow_pop_flood_risk']=round(temp.get('Snow', 0),0)
			context_dict['rainfed_agricultural_land_pop_flood_risk']=round(temp.get('Rainfed', 0),0)
			context_dict['rangeland_pop_flood_risk']=round(temp.get('Rangeland', 0),0)
			context_dict['sandcover_pop_flood_risk']=round(temp.get('Sand Covered Areas', 0),0)
			context_dict['vineyards_pop_flood_risk']=round(temp.get('Vineyards', 0),0)
			context_dict['forest_pop_flood_risk']=round(temp.get('Forest & Shrub', 0),0)
			context_dict['sand_dunes_pop_flood_risk']=round(temp.get('Sand Dunes', 0),0)
			temp = dict([(c['agg_simplified_description'], c['vuid_area_sqm']) for c in floodRiskLC])
			context_dict['water_body_area_flood_risk']=round(temp.get('Water body and Marshland', 0)/1000000,1)
			context_dict['barren_land_area_flood_risk']=round(temp.get('Barren land', 0)/1000000,1)
			context_dict['built_up_area_flood_risk']=round(temp.get('Build Up', 0)/1000000,1)
			context_dict['fruit_trees_area_flood_risk']=round(temp.get('Fruit Trees', 0)/1000000,1)
			context_dict['irrigated_agricultural_land_area_flood_risk']=round(temp.get('Irrigated Agricultural Land', 0)/1000000,1)
			context_dict['permanent_snow_area_flood_risk']=round(temp.get('Snow', 0)/1000000,1)
			context_dict['rainfed_agricultural_land_area_flood_risk']=round(temp.get('Rainfed', 0)/1000000,1)
			context_dict['rangeland_area_flood_risk']=round(temp.get('Rangeland', 0)/1000000,1)
			context_dict['sandcover_area_flood_risk']=round(temp.get('Sand Covered Areas', 0)/1000000,1)
			context_dict['vineyards_area_flood_risk']=round(temp.get('Vineyards', 0)/1000000,1)
			context_dict['forest_area_flood_risk']=round(temp.get('Forest & Shrub', 0)/1000000,1)
			context_dict['sand_dunes_area_flood_risk']=round(temp.get('Sand Dunes', 0),0)

			# avalanche Risk
			targetAvalanche = AfgAvsa.objects.all().filter(vuid=row[0])
			# counts =  getRiskNumber(targetAvalanche, filterLock, 'avalanche_cat', 'avalanche_pop', 'sum_area_sqm', 'area_buildings', flag, code, None)
			counts = targetAvalanche.values('avalanche_cat').annotate(pop=Sum('avalanche_pop'), area=Sum('sum_area_sqm'), buildings=Sum('area_buildings')).values('avalanche_cat','pop', 'area', 'buildings')
			# pop at risk level
			temp = dict([(c['avalanche_cat'], c['pop']) for c in counts])
			context_dict['high_ava_population']=round(temp.get('High', 0) or 0,0)
			context_dict['med_ava_population']=round(temp.get('Moderate', 0) or 0,0)
			context_dict['low_ava_population']=0

			# area at risk level
			temp = dict([(c['avalanche_cat'], c['area']) for c in counts])
			context_dict['high_ava_area']=round((temp.get('High', 0) or 0)/1000000,1)
			context_dict['med_ava_area']=round((temp.get('Moderate', 0) or 0)/1000000,1)
			context_dict['low_ava_area']=0    

			# Number of Building on Avalanche Risk
			temp = dict([(c['avalanche_cat'], c['buildings']) for c in counts])
			context_dict['high_ava_buildings']=temp.get('High', 0) or 0
			context_dict['med_ava_buildings']=temp.get('Moderate', 0) or 0

			# EarthQuake
			context_dict['sic_1']=''
			context_dict['sic_2']=''
			context_dict['sic_3']=''
			context_dict['sic_4']=''
			context_dict['sic_5']=''
			context_dict['sic_6']=''
			context_dict['sic_7']=''
			context_dict['sic_8']=''

			px = AfgEqtUnkPplEqHzd.objects.all().filter(vuid=row[0])
			for i in px:
			    if i.seismic_intensity_cat == 'II':
			       context_dict['sic_1']='X'
			    if i.seismic_intensity_cat == 'III':
			       context_dict['sic_1']='X'
			    if i.seismic_intensity_cat == 'IV':
			       context_dict['sic_2']='X'
			    if i.seismic_intensity_cat == 'V':
			       context_dict['sic_3']='X'
			    if i.seismic_intensity_cat == 'VI':
			       context_dict['sic_4']='X'
			    if i.seismic_intensity_cat == 'VII':
			       context_dict['sic_5']='X'
			    if i.seismic_intensity_cat == 'VIII':
			       context_dict['sic_6']='X'
			    if i.seismic_intensity_cat == 'IX':
			       context_dict['sic_7']='X'
			    if i.seismic_intensity_cat == 'X+':
			       context_dict['sic_8']='X'

			# px = earthquake_shakemap.objects.all().filter(wkb_geometry__intersects=context_dict['position']).exclude(grid_value=1).values('event_code','grid_value')

			# event_code = []
			# event_mag = {}

			# data = []
			# for i in px:
			#     event_code.append(i['event_code'])
			#     event_mag[i['event_code']]=i['grid_value']

			# px = earthquake_events.objects.all().filter(event_code__in=event_code).order_by('-dateofevent')
			# for i in px:
			#     data.append({'date':i.dateofevent.strftime("%Y-%m-%d %H:%M") ,'magnitude':i.magnitude,'sic':event_mag[i.event_code]})

			# context_dict['eq_history']=data

			context_dict.pop('position')
			data.append(context_dict)

	# print data
	header = []
	for i in data[0]:
		header.append(i)

	print header
	writer.writerow(header)
	for x in data:	
		baris = []
		for i in header:
			try:
				baris.append(x[i])
			except:
				baris.append('None')

		writer.writerow(baris)

finally:
	f_IN.close()
	f_OUT.close()