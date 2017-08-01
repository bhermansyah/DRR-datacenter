from itertools import *
import geodb.geoapi 

from django.db.models import Count, Sum
from django.db import connection, connections


def query_to_dicts(cursor, query_string, *query_args):
    """Run a simple query and produce a generator
    that returns the results as a bunch of dictionaries
    with keys for the column values selected.
    """
    cursor.execute(query_string, query_args)
    col_names = [desc[0] for desc in cursor.description]
    while True:
        row = cursor.fetchone()
        if row is None:
            break
        row_dict = dict(izip(col_names, row))
        yield row_dict
    return

def getFloodForecastBySource(sourceType, targetRisk, filterLock, flag, code, YEAR, MONTH, DAY):
	# DAY = int(DAY)-1
	if sourceType == None:
		sourceType = 'GFMS only'
		
	response = {}
	if sourceType == 'GFMS only':
		# River Flood Forecasted (GFMS)
		counts =  geodb.geoapi.getRiskNumber(targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')

		temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])
		response['riverflood_forecast_verylow_pop']=round(temp.get(1, 0),0) 
		response['riverflood_forecast_low_pop']=round(temp.get(2, 0),0) 
		response['riverflood_forecast_med_pop']=round(temp.get(3, 0),0) 
		response['riverflood_forecast_high_pop']=round(temp.get(4, 0),0) 
		response['riverflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0) 
		response['riverflood_forecast_extreme_pop']=round(temp.get(6, 0),0) 
		response['total_riverflood_forecast_pop']=response['riverflood_forecast_verylow_pop'] + response['riverflood_forecast_low_pop'] + response['riverflood_forecast_med_pop'] + response['riverflood_forecast_high_pop'] + response['riverflood_forecast_veryhigh_pop'] + response['riverflood_forecast_extreme_pop']

		temp = dict([(c['basinmember__basins__riskstate'], c['areaatrisk']) for c in counts])
		response['riverflood_forecast_verylow_area']=round(temp.get(1, 0)/1000000,0) 
		response['riverflood_forecast_low_area']=round(temp.get(2, 0)/1000000,0) 
		response['riverflood_forecast_med_area']=round(temp.get(3, 0)/1000000,0) 
		response['riverflood_forecast_high_area']=round(temp.get(4, 0)/1000000,0) 
		response['riverflood_forecast_veryhigh_area']=round(temp.get(5, 0)/1000000,0) 
		response['riverflood_forecast_extreme_area']=round(temp.get(6, 0)/1000000,0) 
		response['total_riverflood_forecast_area']=response['riverflood_forecast_verylow_area'] + response['riverflood_forecast_low_area'] + response['riverflood_forecast_med_area'] + response['riverflood_forecast_high_area'] + response['riverflood_forecast_veryhigh_area'] + response['riverflood_forecast_extreme_area']

		# flood risk and riverflood forecast matrix
		px = targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY))

		if flag=='entireAfg': 
		    px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
		        select={
		            'pop' : 'SUM(fldarea_population)'
		        }).values('basinmember__basins__riskstate','deeperthan', 'pop')
		elif flag=='currentProvince':
		    if len(str(code)) > 2:
		        ff0001 =  "dist_code  = '"+str(code)+"'"
		    else :
		        if len(str(code))==1:
		            ff0001 =  "left(cast(dist_code as text),1)  = '"+str(code)+"'"
		        else:
		            ff0001 =  "left(cast(dist_code as text),2)  = '"+str(code)+"'"   
		    px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
		        select={
		            'pop' : 'SUM(fldarea_population)'
		        },where={
		            ff0001
		        }).values('basinmember__basins__riskstate','deeperthan', 'pop')
		elif flag=='drawArea':
		    px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
		        select={
		            'pop' : 'SUM(  \
		                    case \
		                        when ST_CoveredBy(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry ,'+filterLock+') then fldarea_population \
		                        else st_area(st_intersection(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry,'+filterLock+')) / st_area(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry)* fldarea_population end \
		                )'
		        },
		        where = {
		            'ST_Intersects(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry, '+filterLock+')'
		        }).values('basinmember__basins__riskstate','deeperthan', 'pop')  
		else:
		    px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
		        select={
		            'pop' : 'SUM(fldarea_population)'
		        },
		        where = {
		            'ST_Within(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry, '+filterLock+')'
		        }).values('basinmember__basins__riskstate','deeperthan', 'pop')      

		temp = [ num for num in px if num['basinmember__basins__riskstate'] == 1 ]
		temp = dict([(c['deeperthan'], c['pop']) for c in temp])
		response['riverflood_forecast_verylow_risk_low_pop']=round(temp.get('029 cm', 0),0)
		response['riverflood_forecast_verylow_risk_med_pop']=round(temp.get('121 cm', 0), 0)
		response['riverflood_forecast_verylow_risk_high_pop']=round(temp.get('271 cm', 0),0)

		temp = [ num for num in px if num['basinmember__basins__riskstate'] == 2 ]
		temp = dict([(c['deeperthan'], c['pop']) for c in temp])
		response['riverflood_forecast_low_risk_low_pop']=round(temp.get('029 cm', 0),0)
		response['riverflood_forecast_low_risk_med_pop']=round(temp.get('121 cm', 0), 0) 
		response['riverflood_forecast_low_risk_high_pop']=round(temp.get('271 cm', 0),0)

		temp = [ num for num in px if num['basinmember__basins__riskstate'] == 3 ]
		temp = dict([(c['deeperthan'], c['pop']) for c in temp])
		response['riverflood_forecast_med_risk_low_pop']=round(temp.get('029 cm', 0),0)
		response['riverflood_forecast_med_risk_med_pop']=round(temp.get('121 cm', 0), 0)
		response['riverflood_forecast_med_risk_high_pop']=round(temp.get('271 cm', 0),0) 

		temp = [ num for num in px if num['basinmember__basins__riskstate'] == 4 ]
		temp = dict([(c['deeperthan'], c['pop']) for c in temp])
		response['riverflood_forecast_high_risk_low_pop']=round(temp.get('029 cm', 0),0)
		response['riverflood_forecast_high_risk_med_pop']=round(temp.get('121 cm', 0), 0)
		response['riverflood_forecast_high_risk_high_pop']=round(temp.get('271 cm', 0),0)

		temp = [ num for num in px if num['basinmember__basins__riskstate'] == 5 ]
		temp = dict([(c['deeperthan'], c['pop']) for c in temp])
		response['riverflood_forecast_veryhigh_risk_low_pop']=round(temp.get('029 cm', 0),0)
		response['riverflood_forecast_veryhigh_risk_med_pop']=round(temp.get('121 cm', 0), 0)
		response['riverflood_forecast_veryhigh_risk_high_pop']=round(temp.get('271 cm', 0),0)

		temp = [ num for num in px if num['basinmember__basins__riskstate'] == 6 ]
		temp = dict([(c['deeperthan'], c['pop']) for c in temp])
		response['riverflood_forecast_extreme_risk_low_pop']=round(temp.get('029 cm', 0),0)
		response['riverflood_forecast_extreme_risk_med_pop']=round(temp.get('121 cm', 0), 0)
		response['riverflood_forecast_extreme_risk_high_pop']=round(temp.get('271 cm', 0),0)

	elif sourceType=='GLOFAS only':
		if not code:
			code = 'NULL'
		cursor = connections['geodb'].cursor()
		sql = "select \
		round(sum(extreme)) as riverflood_forecast_extreme_pop, \
		round(sum(veryhigh)) as riverflood_forecast_veryhigh_pop, \
		round(sum(high)) as riverflood_forecast_high_pop, \
		round(sum(moderate)) as riverflood_forecast_med_pop, \
		round(sum(low)) as riverflood_forecast_low_pop, \
		round(sum(verylow)) as riverflood_forecast_verylow_pop, \
		round(sum(extreme_high)) as riverflood_forecast_extreme_risk_high_pop, \
		round(sum(extreme_med)) as riverflood_forecast_extreme_risk_med_pop, \
		round(sum(extreme_low)) as riverflood_forecast_extreme_risk_low_pop, \
		round(sum(veryhigh_high)) as riverflood_forecast_veryhigh_risk_high_pop, \
		round(sum(veryhigh_med)) as riverflood_forecast_veryhigh_risk_med_pop, \
		round(sum(veryhigh_low)) as riverflood_forecast_veryhigh_risk_low_pop, \
		round(sum(high_high)) as riverflood_forecast_high_risk_high_pop, \
		round(sum(high_med)) as riverflood_forecast_high_risk_med_pop, \
		round(sum(high_low)) as riverflood_forecast_high_risk_low_pop, \
		round(sum(moderate_high)) as riverflood_forecast_med_risk_high_pop, \
		round(sum(moderate_med)) as riverflood_forecast_med_risk_med_pop, \
		round(sum(moderate_low)) as riverflood_forecast_med_risk_low_pop,\
		round(sum(low_high)) as riverflood_forecast_low_risk_high_pop, \
		round(sum(low_med)) as riverflood_forecast_low_risk_med_pop, \
		round(sum(low_low)) as riverflood_forecast_low_risk_low_pop, \
		round(sum(verylow_high)) as riverflood_forecast_verylow_risk_high_pop, \
		round(sum(verylow_med)) as riverflood_forecast_verylow_risk_med_pop, \
		round(sum(verylow_low)) as riverflood_forecast_verylow_risk_low_pop, \
		round(sum(extreme_area),1)::double precision as riverflood_forecast_extreme_area, \
		round(sum(veryhigh_area),1)::double precision as riverflood_forecast_veryhigh_area, \
		round(sum(high_area),1)::double precision as riverflood_forecast_high_area, \
		round(sum(moderate_area),1)::double precision as riverflood_forecast_med_area, \
		round(sum(low_area),1)::double precision as riverflood_forecast_low_area, \
		round(sum(verylow_area),1)::double precision as riverflood_forecast_verylow_area \
		from get_glofas(date('%s-%s-%s')-1,'%s',%s,'%s')" %(YEAR,MONTH,DAY,flag,code,filterLock)
		row = query_to_dicts(cursor, sql)
		for item in row:
			response = item
		response['total_riverflood_forecast_pop']=response['riverflood_forecast_verylow_pop'] if response['riverflood_forecast_verylow_pop'] else 0 + response['riverflood_forecast_low_pop'] if response['riverflood_forecast_low_pop'] else 0 + response['riverflood_forecast_med_pop'] if response['riverflood_forecast_med_pop'] else 0 + response['riverflood_forecast_high_pop'] if response['riverflood_forecast_high_pop'] else 0 + response['riverflood_forecast_veryhigh_pop'] if response['riverflood_forecast_veryhigh_pop'] else 0 + response['riverflood_forecast_extreme_pop'] if response['riverflood_forecast_extreme_pop'] else 0
		response['total_riverflood_forecast_area']=response['riverflood_forecast_verylow_area'] if response['riverflood_forecast_verylow_area'] else 0 + response['riverflood_forecast_low_area'] if response['riverflood_forecast_low_area'] else 0 + response['riverflood_forecast_med_area'] if response['riverflood_forecast_med_area'] else 0 + response['riverflood_forecast_high_area'] if response['riverflood_forecast_high_area'] else 0 + response['riverflood_forecast_veryhigh_area'] if response['riverflood_forecast_veryhigh_area'] else 0 + response['riverflood_forecast_extreme_area'] if response['riverflood_forecast_extreme_area'] else 0
		cursor.close()
	elif sourceType=='GFMS + GLOFAS':
		if not code:
			code = 'NULL'
		cursor = connections['geodb'].cursor()
		sql = "select \
		round(sum(extreme)) as riverflood_forecast_extreme_pop, \
		round(sum(veryhigh)) as riverflood_forecast_veryhigh_pop, \
		round(sum(high)) as riverflood_forecast_high_pop, \
		round(sum(moderate)) as riverflood_forecast_med_pop, \
		round(sum(low)) as riverflood_forecast_low_pop, \
		round(sum(verylow)) as riverflood_forecast_verylow_pop, \
		round(sum(extreme_high)) as riverflood_forecast_extreme_risk_high_pop, \
		round(sum(extreme_med)) as riverflood_forecast_extreme_risk_med_pop, \
		round(sum(extreme_low)) as riverflood_forecast_extreme_risk_low_pop, \
		round(sum(veryhigh_high)) as riverflood_forecast_veryhigh_risk_high_pop, \
		round(sum(veryhigh_med)) as riverflood_forecast_veryhigh_risk_med_pop, \
		round(sum(veryhigh_low)) as riverflood_forecast_veryhigh_risk_low_pop, \
		round(sum(high_high)) as riverflood_forecast_high_risk_high_pop, \
		round(sum(high_med)) as riverflood_forecast_high_risk_med_pop, \
		round(sum(high_low)) as riverflood_forecast_high_risk_low_pop, \
		round(sum(moderate_high)) as riverflood_forecast_med_risk_high_pop, \
		round(sum(moderate_med)) as riverflood_forecast_med_risk_med_pop, \
		round(sum(moderate_low)) as riverflood_forecast_med_risk_low_pop,\
		round(sum(low_high)) as riverflood_forecast_low_risk_high_pop, \
		round(sum(low_med)) as riverflood_forecast_low_risk_med_pop, \
		round(sum(low_low)) as riverflood_forecast_low_risk_low_pop, \
		round(sum(verylow_high)) as riverflood_forecast_verylow_risk_high_pop, \
		round(sum(verylow_med)) as riverflood_forecast_verylow_risk_med_pop, \
		round(sum(verylow_low)) as riverflood_forecast_verylow_risk_low_pop, \
		round(sum(extreme_area),1)::double precision as riverflood_forecast_extreme_area, \
		round(sum(veryhigh_area),1)::double precision as riverflood_forecast_veryhigh_area, \
		round(sum(high_area),1)::double precision as riverflood_forecast_high_area, \
		round(sum(moderate_area),1)::double precision as riverflood_forecast_med_area, \
		round(sum(low_area),1)::double precision as riverflood_forecast_low_area, \
		round(sum(verylow_area),1)::double precision as riverflood_forecast_verylow_area \
		from get_merge_glofas_gfms(date('%s-%s-%s'),'%s',%s,'%s')" %(YEAR,MONTH,DAY,flag,code,filterLock)
		row = query_to_dicts(cursor, sql)
		for item in row:
			response = item
		response['total_riverflood_forecast_pop']=response['riverflood_forecast_verylow_pop'] if response['riverflood_forecast_verylow_pop'] else 0 + response['riverflood_forecast_low_pop'] if response['riverflood_forecast_low_pop'] else 0 + response['riverflood_forecast_med_pop'] if response['riverflood_forecast_med_pop'] else 0 + response['riverflood_forecast_high_pop'] if response['riverflood_forecast_high_pop'] else 0 + response['riverflood_forecast_veryhigh_pop'] if response['riverflood_forecast_veryhigh_pop'] else 0 + response['riverflood_forecast_extreme_pop'] if response['riverflood_forecast_extreme_pop'] else 0
		response['total_riverflood_forecast_area']=response['riverflood_forecast_verylow_area'] if response['riverflood_forecast_verylow_area'] else 0 + response['riverflood_forecast_low_area'] if response['riverflood_forecast_low_area'] else 0 + response['riverflood_forecast_med_area'] if response['riverflood_forecast_med_area'] else 0 + response['riverflood_forecast_high_area'] if response['riverflood_forecast_high_area'] else 0 + response['riverflood_forecast_veryhigh_area'] if response['riverflood_forecast_veryhigh_area'] else 0 + response['riverflood_forecast_extreme_area'] if response['riverflood_forecast_extreme_area'] else 0
		cursor.close()

	return response