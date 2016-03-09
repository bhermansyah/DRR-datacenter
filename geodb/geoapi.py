from geodb.models import AfgFldzonea100KRiskLandcoverPop, FloodRiskExposure, AfgLndcrva, LandcoverDescription, AfgAvsa, AfgAdmbndaAdm1, AfgPplp, earthquake_shakemap, earthquake_events, villagesummaryEQ
import json
import time, datetime
from tastypie.resources import ModelResource, Resource
from tastypie.serializers import Serializer
from tastypie import fields
from tastypie.constants import ALL
from django.db.models import Count, Sum
from django.core.serializers.json import DjangoJSONEncoder
from tastypie.authorization import DjangoAuthorization
from urlparse import urlparse
from geonode.maps.models import Map
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW
from django.db import connection, connections
from itertools import *
# addded by boedy
from matrix.models import matrix


YEAR = datetime.datetime.utcnow().strftime("%Y")
MONTH = datetime.datetime.utcnow().strftime("%m")
DAY = datetime.datetime.utcnow().strftime("%d")


FILTER_TYPES = {
    'flood': AfgFldzonea100KRiskLandcoverPop
}

class FloodRiskStatisticResource(ModelResource):
    """Flood api"""

    class Meta:
        authorization = DjangoAuthorization()
        resource_name = 'floodrisk'
        allowed_methods = ['post']
        detail_allowed_methods = ['post']
        always_return_data = True
 

    def getRisk(self, request):
        # saving the user tracking records

        o = urlparse(request.META.get('HTTP_REFERER')).path
        o=o.split('/')
        mapCode = o[2]
        map_obj = _resolve_map(request, mapCode, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)

        queryset = matrix(user=request.user,resourceid=map_obj,action='Interactive Calculation')
        queryset.save()

        boundaryFilter = json.loads(request.body)

        temp1 = []
        for i in boundaryFilter['spatialfilter']:
            temp1.append('ST_GeomFromText(\''+i+'\',4326)')

        temp2 = 'ARRAY['
        first=True
        for i in temp1:
            if first:
                 temp2 = temp2 + i
                 first=False
            else :
                 temp2 = temp2 + ', ' + i  

        temp2 = temp2+']'
        
        filterLock = 'ST_Union('+temp2+')'
        response = getRiskExecuteExternal(filterLock,boundaryFilter['flag'],boundaryFilter['code'])

        return response

        

    def post_list(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        response = self.getRisk(request)
        return self.create_response(request, response)    

def getRiskExecuteExternal(filterLock, flag, code):
        targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
        targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and marshland')
        targetBase = AfgLndcrva.objects.all()
        targetAvalanche = AfgAvsa.objects.all()
        response = {}

        #Avalanche Risk
        counts =  getRiskNumber(targetAvalanche, filterLock, 'avalanche_cat', 'avalanche_pop', 'sum_area_sqm', flag, code, None)
        # pop at risk level
        temp = dict([(c['avalanche_cat'], c['count']) for c in counts])
        response['high_ava_population']=round(temp.get('High', 0),0)
        response['med_ava_population']=round(temp.get('Moderate', 0), 0)
        response['low_ava_population']=0
        response['total_ava_population']=response['high_ava_population']+response['med_ava_population']+response['low_ava_population']

        # area at risk level
        temp = dict([(c['avalanche_cat'], c['areaatrisk']) for c in counts])
        response['high_ava_area']=round(temp.get('High', 0)/1000000,1)
        response['med_ava_area']=round(temp.get('Moderate', 0)/1000000,1)
        response['low_ava_area']=0    
        response['total_ava_area']=round(response['high_ava_area']+response['med_ava_area']+response['low_ava_area'],2) 

        # Avalanche Forecasted
        counts =  getRiskNumber(targetAvalanche.select_related("basinmembersava").exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='snowwater',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'avalanche_pop', 'sum_area_sqm', flag, code, 'afg_avsa')
        temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])
        response['ava_forecast_low_pop']=round(temp.get(1, 0),0) 
        response['ava_forecast_med_pop']=round(temp.get(2, 0),0) 
        response['ava_forecast_high_pop']=round(temp.get(3, 0),0) 
        response['total_ava_forecast_pop']=response['ava_forecast_low_pop'] + response['ava_forecast_med_pop'] + response['ava_forecast_high_pop']



        # Flood Risk
        counts =  getRiskNumber(targetRisk, filterLock, 'deeperthan', 'fldarea_population', 'fldarea_sqm', flag, code, None)
        
        # pop at risk level
        temp = dict([(c['deeperthan'], c['count']) for c in counts])
        response['high_risk_population']=round(temp.get('271 cm', 0),0)
        response['med_risk_population']=round(temp.get('121 cm', 0), 0)
        response['low_risk_population']=round(temp.get('029 cm', 0),0)
        response['total_risk_population']=response['high_risk_population']+response['med_risk_population']+response['low_risk_population']

        # area at risk level
        temp = dict([(c['deeperthan'], c['areaatrisk']) for c in counts])
        response['high_risk_area']=round(temp.get('271 cm', 0)/1000000,1)
        response['med_risk_area']=round(temp.get('121 cm', 0)/1000000,1)
        response['low_risk_area']=round(temp.get('029 cm', 0)/1000000,1)    
        response['total_risk_area']=round(response['high_risk_area']+response['med_risk_area']+response['low_risk_area'],2) 

        counts =  getRiskNumber(targetRiskIncludeWater, filterLock, 'agg_simplified_description', 'fldarea_population', 'fldarea_sqm', flag, code, None)

        # landcover/pop/atrisk
        temp = dict([(c['agg_simplified_description'], c['count']) for c in counts])
        response['water_body_pop_risk']=round(temp.get('Water body and marshland', 0),0)
        response['barren_land_pop_risk']=round(temp.get('Barren land', 0),0)
        response['built_up_pop_risk']=round(temp.get('Built-up', 0),0)
        response['fruit_trees_pop_risk']=round(temp.get('Fruit trees', 0),0)
        response['irrigated_agricultural_land_pop_risk']=round(temp.get('Irrigated agricultural land', 0),0)
        response['permanent_snow_pop_risk']=round(temp.get('Permanent snow', 0),0)
        response['rainfed_agricultural_land_pop_risk']=round(temp.get('Rainfed agricultural land', 0),0)
        response['rangeland_pop_risk']=round(temp.get('Rangeland', 0),0)
        response['sandcover_pop_risk']=round(temp.get('Sand cover', 0),0)
        response['vineyards_pop_risk']=round(temp.get('Vineyards', 0),0)
        response['forest_pop_risk']=round(temp.get('Forest and shrubs', 0),0)

        temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
        response['water_body_area_risk']=round(temp.get('Water body and marshland', 0)/1000000,1)
        response['barren_land_area_risk']=round(temp.get('Barren land', 0)/1000000,1)
        response['built_up_area_risk']=round(temp.get('Built-up', 0)/1000000,1)
        response['fruit_trees_area_risk']=round(temp.get('Fruit trees', 0)/1000000,1)
        response['irrigated_agricultural_land_area_risk']=round(temp.get('Irrigated agricultural land', 0)/1000000,1)
        response['permanent_snow_area_risk']=round(temp.get('Permanent snow', 0)/1000000,1)
        response['rainfed_agricultural_land_area_risk']=round(temp.get('Rainfed agricultural land', 0)/1000000,1)
        response['rangeland_area_risk']=round(temp.get('Rangeland', 0)/1000000,1)
        response['sandcover_area_risk']=round(temp.get('Sand cover', 0)/1000000,1)
        response['vineyards_area_risk']=round(temp.get('Vineyards', 0)/1000000,1)
        response['forest_area_risk']=round(temp.get('Forest and shrubs', 0)/1000000,1)


        # River Flood Forecasted
        counts =  getRiskNumber(targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')
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

        # Flash Flood Forecasted
        # AfgFldzonea100KRiskLandcoverPop.objects.all().select_related("basinmembers").values_list("agg_simplified_description","basinmember__basins__riskstate")
        counts =  getRiskNumber(targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')
        temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])

        response['flashflood_forecast_verylow_pop']=round(temp.get(1, 0),0) 
        response['flashflood_forecast_low_pop']=round(temp.get(2, 0),0) 
        response['flashflood_forecast_med_pop']=round(temp.get(3, 0),0) 
        response['flashflood_forecast_high_pop']=round(temp.get(4, 0),0) 
        response['flashflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0) 
        response['flashflood_forecast_extreme_pop']=round(temp.get(6, 0),0) 
        response['total_flashflood_forecast_pop']=response['flashflood_forecast_verylow_pop'] + response['flashflood_forecast_low_pop'] + response['flashflood_forecast_med_pop'] + response['flashflood_forecast_high_pop'] + response['flashflood_forecast_veryhigh_pop'] + response['flashflood_forecast_extreme_pop']

        temp = dict([(c['basinmember__basins__riskstate'], c['areaatrisk']) for c in counts])
        response['flashflood_forecast_verylow_area']=round(temp.get(1, 0)/1000000,0) 
        response['flashflood_forecast_low_area']=round(temp.get(2, 0)/1000000,0) 
        response['flashflood_forecast_med_area']=round(temp.get(3, 0)/1000000,0) 
        response['flashflood_forecast_high_area']=round(temp.get(4, 0)/1000000,0) 
        response['flashflood_forecast_veryhigh_area']=round(temp.get(5, 0)/1000000,0) 
        response['flashflood_forecast_extreme_area']=round(temp.get(6, 0)/1000000,0) 
        response['total_flashflood_forecast_area']=response['flashflood_forecast_verylow_area'] + response['flashflood_forecast_low_area'] + response['flashflood_forecast_med_area'] + response['flashflood_forecast_high_area'] + response['flashflood_forecast_veryhigh_area'] + response['flashflood_forecast_extreme_area']

        response['total_flood_forecast_pop'] = response['total_riverflood_forecast_pop'] + response['total_flashflood_forecast_pop']
        response['total_flood_forecast_area'] = response['total_riverflood_forecast_area'] + response['total_flashflood_forecast_area']

        # landcover all
        counts =  getRiskNumber(targetBase, filterLock, 'agg_simplified_description', 'area_population', 'area_sqm', flag, code, None)
        temp = dict([(c['agg_simplified_description'], c['count']) for c in counts])
        response['water_body_pop']=round(temp.get('Water body and marshland', 0),0)
        response['barren_land_pop']=round(temp.get('Barren land', 0),0)
        response['built_up_pop']=round(temp.get('Built-up', 0),0)
        response['fruit_trees_pop']=round(temp.get('Fruit trees', 0),0)
        response['irrigated_agricultural_land_pop']=round(temp.get('Irrigated agricultural land', 0),0)
        response['permanent_snow_pop']=round(temp.get('Permanent snow', 0),0)
        response['rainfed_agricultural_land_pop']=round(temp.get('Rainfed agricultural land', 0),0)
        response['rangeland_pop']=round(temp.get('Rangeland', 0),0)
        response['sandcover_pop']=round(temp.get('Sand cover', 0),0)
        response['vineyards_pop']=round(temp.get('Vineyards', 0),0)
        response['forest_pop']=round(temp.get('Forest and shrubs', 0),0)

        temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
        response['water_body_area']=round(temp.get('Water body and marshland', 0)/1000000,1)
        response['barren_land_area']=round(temp.get('Barren land', 0)/1000000,1)
        response['built_up_area']=round(temp.get('Built-up', 0)/1000000,1)
        response['fruit_trees_area']=round(temp.get('Fruit trees', 0)/1000000,1)
        response['irrigated_agricultural_land_area']=round(temp.get('Irrigated agricultural land', 0)/1000000,1)
        response['permanent_snow_area']=round(temp.get('Permanent snow', 0)/1000000,1)
        response['rainfed_agricultural_land_area']=round(temp.get('Rainfed agricultural land', 0)/1000000,1)
        response['rangeland_area']=round(temp.get('Rangeland', 0)/1000000,1)
        response['sandcover_area']=round(temp.get('Sand cover', 0)/1000000,1)
        response['vineyards_area']=round(temp.get('Vineyards', 0)/1000000,1)
        response['forest_area']=round(temp.get('Forest and shrubs', 0)/1000000,1)

        if flag=='drawArea':
            countsBase = targetAvalanche.extra(
                select={
                    'numbersettlementsatava': 'count(distinct vuid)'}, 
                where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*sum_area_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatava')
        elif flag=='entireAfg':
            countsBase = targetAvalanche.extra(
                select={
                    'numbersettlementsatava': 'count(distinct vuid)'}).values('numbersettlementsatava')
        elif flag=='currentProvince':
            if len(str(code)) > 2:
                ff0001 =  "dist_code  = '"+str(code)+"'"
            else :
                ff0001 =  "prov_code  = '"+str(code)+"'"
            countsBase = targetAvalanche.extra(
                select={
                    'numbersettlementsatava': 'count(distinct vuid)'}, 
                where = {ff0001}).values('numbersettlementsatava')
        elif flag=='currentBasin':
            countsBase = targetAvalanche.extra(
                select={
                    'numbersettlementsatava': 'count(distinct vuid)'},  
                where = {"vuid = '"+str(code)+"'"}).values('numbersettlementsatava')
        else:
            countsBase = targetAvalanche.extra(
                select={
                    'numbersettlementsatava': 'count(distinct vuid)'}, 
                where = {'ST_Within(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatava')

        response['numbersettlementsatava'] = round(countsBase[0]['numbersettlementsatava'],0)

        if flag=='drawArea':
            countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
                select={
                    'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*fldarea_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')
        elif flag=='entireAfg':
            countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
                select={
                    'numbersettlementsatrisk': 'count(distinct vuid)'}).values('numbersettlementsatrisk')
        elif flag=='currentProvince':
            if len(str(code)) > 2:
                ff0001 =  "dist_code  = '"+str(code)+"'"
            else :
                ff0001 =  "prov_code  = '"+str(code)+"'"
            countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
                select={
                    'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                where = {ff0001}).values('numbersettlementsatrisk')
        elif flag=='currentBasin':
            countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
                select={
                    'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                where = {"vuid = '"+str(code)+"'"}).values('numbersettlementsatrisk')    
        else:
            countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
                select={
                    'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                where = {'ST_Within(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')

        response['settlements_at_risk'] = round(countsBase[0]['numbersettlementsatrisk'],0)

        if flag=='drawArea':
            countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
                select={
                    'numbersettlements': 'count(distinct vuid)'}, 
                where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlements')
        elif flag=='entireAfg':
            countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
                select={
                    'numbersettlements': 'count(distinct vuid)'}).values('numbersettlements')
        elif flag=='currentProvince':
            if len(str(code)) > 2:
                ff0001 =  "dist_code  = '"+str(code)+"'"
            else :
                ff0001 =  "prov_code  = '"+str(code)+"'"
            countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
                select={
                    'numbersettlements': 'count(distinct vuid)'}, 
                where = {"left(cast(dist_code as text), "+str(len(str(code)))+") = '"+str(code)+"'"}).values('numbersettlements')
        elif flag=='currentBasin':
            countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
                select={
                    'numbersettlements': 'count(distinct vuid)'}, 
                where = {"vuid = '"+str(code)+"'"}).values('numbersettlements')   
        else:
            countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
                select={
                    'numbersettlements': 'count(distinct vuid)'}, 
                where = {'ST_Within(wkb_geometry, '+filterLock+')'}).values('numbersettlements')
        
        response['settlements'] = round(countsBase[0]['numbersettlements'],0)

        if flag=='drawArea':
            countsBase = targetBase.extra(
                select={
                    'countbase' : 'SUM(  \
                            case \
                                when ST_CoveredBy(wkb_geometry,'+filterLock+') then area_population \
                                else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_population end \
                        )'
                },
                where = {
                    'ST_Intersects(wkb_geometry, '+filterLock+')'
                }).values('countbase')
        elif flag=='entireAfg':
            countsBase = targetBase.extra(
                select={
                    'countbase' : 'SUM(area_population)'
                }).values('countbase')
        elif flag=='currentProvince':
            if len(str(code)) > 2:
                ff0001 =  "dist_code  = '"+str(code)+"'"
            else :
                ff0001 =  "prov_code  = '"+str(code)+"'"
            countsBase = targetBase.extra(
                select={
                    'countbase' : 'SUM(area_population)'
                },
                where = {
                    ff0001
                }).values('countbase')
        elif flag=='currentBasin':
            countsBase = targetBase.extra(
                select={
                    'countbase' : 'SUM(area_population)'
                }, 
                where = {"vuid = '"+str(code)+"'"}).values('countbase')     
        else:
            countsBase = targetBase.extra(
                select={
                    'countbase' : 'SUM(area_population)'
                },
                where = {
                    'ST_Within(wkb_geometry, '+filterLock+')'
                }).values('countbase')
                    
        response['Population']=round(countsBase[0]['countbase'],0)

        if flag=='drawArea':
            countsBase = targetBase.extra(
                select={
                    'areabase' : 'SUM(  \
                            case \
                                when ST_CoveredBy(wkb_geometry,'+filterLock+') then area_sqm \
                                else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_sqm end \
                        )'
                },
                where = {
                    'ST_Intersects(wkb_geometry, '+filterLock+')'
                }).values('areabase')
        elif flag=='entireAfg':
            countsBase = targetBase.extra(
                select={
                    'areabase' : 'SUM(area_sqm)'
                }).values('areabase')
        elif flag=='currentProvince':
            if len(str(code)) > 2:
                ff0001 =  "dist_code  = '"+str(code)+"'"
            else :
                ff0001 =  "prov_code  = '"+str(code)+"'"
            countsBase = targetBase.extra(
                select={
                    'areabase' : 'SUM(area_sqm)'
                },
                where = {
                    ff0001
                }).values('areabase')
        elif flag=='currentBasin':
            countsBase = targetBase.extra(
                select={
                    'areabase' : 'SUM(area_sqm)'
                },
                where = {"vuid = '"+str(code)+"'"}).values('areabase')      

        else:
            countsBase = targetBase.extra(
                select={
                    'areabase' : 'SUM(area_sqm)'
                },
                where = {
                    'ST_Within(wkb_geometry, '+filterLock+')'
                }).values('areabase')

        response['Area']=round(countsBase[0]['areabase']/1000000,0)

        try:
            response['percent_total_risk_population'] = round((response['total_risk_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_total_risk_population'] = 0
            
        try:
            response['percent_high_risk_population'] = round((response['high_risk_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_high_risk_population'] = 0

        try:
            response['percent_med_risk_population'] = round((response['med_risk_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_med_risk_population'] = 0

        try:
            response['percent_low_risk_population'] = round((response['low_risk_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_low_risk_population'] = 0

        try:
            response['percent_total_risk_area'] = round((response['total_risk_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_total_risk_area'] = 0

        try:
            response['percent_high_risk_area'] = round((response['high_risk_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_high_risk_area'] = 0

        try:
            response['percent_med_risk_area'] = round((response['med_risk_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_med_risk_area'] = 0
        
        try:
            response['percent_low_risk_area'] = round((response['low_risk_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_low_risk_area'] = 0

        try:
            response['percent_total_ava_population'] = round((response['total_ava_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_total_ava_population'] = 0
        
        try:
            response['percent_high_ava_population'] = round((response['high_ava_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_high_ava_population'] = 0    
        
        try:
            response['percent_med_ava_population'] = round((response['med_ava_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_med_ava_population'] = 0

        try:
            response['percent_low_ava_population'] = round((response['low_ava_population']/response['Population'])*100,0)
        except ZeroDivisionError:
            response['percent_low_ava_population'] = 0

        try:
            response['percent_total_ava_area'] = round((response['total_ava_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_total_ava_area'] = 0

        try:
            response['percent_high_ava_area'] = round((response['high_ava_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_high_ava_area'] = 0

        try:
            response['percent_med_ava_area'] = round((response['med_ava_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_med_ava_area'] = 0
        try:
            response['percent_low_ava_area'] = round((response['low_ava_area']/response['Area'])*100,0)
        except ZeroDivisionError:
            response['percent_low_ava_area'] = 0    

        # Population percentage
        try:
            response['precent_barren_land_pop_risk'] = round((response['barren_land_pop_risk']/response['barren_land_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_barren_land_pop_risk'] = 0
        try:
            response['precent_built_up_pop_risk'] = round((response['built_up_pop_risk']/response['built_up_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_built_up_pop_risk'] = 0       
        try:
            response['precent_fruit_trees_pop_risk'] = round((response['fruit_trees_pop_risk']/response['fruit_trees_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_fruit_trees_pop_risk'] = 0
        try:
            response['precent_irrigated_agricultural_land_pop_risk'] = round((response['irrigated_agricultural_land_pop_risk']/response['irrigated_agricultural_land_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_irrigated_agricultural_land_pop_risk'] = 0     
        try:
            response['precent_permanent_snow_pop_risk'] = round((response['permanent_snow_pop_risk']/response['permanent_snow_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_permanent_snow_pop_risk'] = 0 
        try:
            response['precent_rainfed_agricultural_land_pop_risk'] = round((response['rainfed_agricultural_land_pop_risk']/response['rainfed_agricultural_land_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_rainfed_agricultural_land_pop_risk'] = 0  
        try:
            response['precent_rangeland_pop_risk'] = round((response['rangeland_pop_risk']/response['rangeland_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_rangeland_pop_risk'] = 0  
        try:
            response['precent_sandcover_pop_risk'] = round((response['sandcover_pop_risk']/response['sandcover_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_sandcover_pop_risk'] = 0  
        try:
            response['precent_vineyards_pop_risk'] = round((response['vineyards_pop_risk']/response['vineyards_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_vineyards_pop_risk'] = 0  
        try:
            response['precent_water_body_pop_risk'] = round((response['water_body_pop_risk']/response['water_body_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_water_body_pop_risk'] = 0     
        try:
            response['precent_forest_pop_risk'] = round((response['forest_pop_risk']/response['forest_pop'])*100,0)
        except ZeroDivisionError:
            response['precent_forest_pop_risk'] = 0                         


        # Area percentage
        try:
            response['precent_barren_land_area_risk'] = round((response['barren_land_area_risk']/response['barren_land_area'])*100,0)
        except ZeroDivisionError:
            response['precent_barren_land_area_risk'] = 0
        try:        
            response['precent_built_up_area_risk'] = round((response['built_up_area_risk']/response['built_up_area'])*100,0)
        except ZeroDivisionError:
            response['precent_built_up_area_risk'] = 0    
        try:
            response['precent_fruit_trees_area_risk'] = round((response['fruit_trees_area_risk']/response['fruit_trees_area'])*100,0)
        except ZeroDivisionError:
            response['precent_fruit_trees_area_risk'] = 0        
        try:
            response['precent_irrigated_agricultural_land_area_risk'] = round((response['irrigated_agricultural_land_area_risk']/response['irrigated_agricultural_land_area'])*100,0)
        except ZeroDivisionError:
            response['precent_irrigated_agricultural_land_area_risk'] = 0 
        try:
            response['precent_permanent_snow_area_risk'] = round((response['permanent_snow_area_risk']/response['permanent_snow_area'])*100,0)
        except ZeroDivisionError:
            response['precent_permanent_snow_area_risk'] = 0 
        try:
            response['precent_rainfed_agricultural_land_area_risk'] = round((response['rainfed_agricultural_land_area_risk']/response['rainfed_agricultural_land_area'])*100,0)
        except ZeroDivisionError:
            response['precent_rainfed_agricultural_land_area_risk'] = 0  
        try:
            response['precent_rangeland_area_risk'] = round((response['rangeland_area_risk']/response['rangeland_area'])*100,0)
        except ZeroDivisionError:
            response['precent_rangeland_area_risk'] = 0  
        try:
            response['precent_sandcover_area_risk'] = round((response['sandcover_area_risk']/response['sandcover_area'])*100,0)
        except ZeroDivisionError:
            response['precent_sandcover_area_risk'] = 0  
        try:
            response['precent_vineyards_area_risk'] = round((response['vineyards_area_risk']/response['vineyards_area'])*100,0)
        except ZeroDivisionError:
            response['precent_vineyards_area_risk'] = 0  
        try:
            response['precent_water_body_area_risk'] = round((response['water_body_area_risk']/response['water_body_area'])*100,0)
        except ZeroDivisionError:
            response['precent_water_body_area_risk'] = 0     
        try:
            response['precent_forest_area_risk'] = round((response['forest_area_risk']/response['forest_area'])*100,0)
        except ZeroDivisionError:
            response['precent_forest_area_risk'] = 0 

        return response        

def getRisk(request):
        # saving the user tracking records
        o = urlparse(request.META.get('HTTP_REFERER')).path
        o=o.split('/')
        mapCode = o[2]
        map_obj = _resolve_map(request, mapCode, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)

        queryset = matrix(user=request.user,resourceid=map_obj,action='Interactive Calculation')
        queryset.save()

        boundaryFilter = json.loads(request.body)
        temp1 = []
        for i in boundaryFilter['spatialfilter']:
            temp1.append('ST_GeomFromText(\''+i+'\',4326)')

        temp2 = 'ARRAY['
        first=True
        for i in temp1:
            if first:
                 temp2 = temp2 + i
                 first=False
            else :
                 temp2 = temp2 + ', ' + i  

        temp2 = temp2+']'
        
        filterLock = 'ST_Union('+temp2+')'
        response = self.getRiskExecute(filterLock)

        return response        
   
def getRiskNumber(data, filterLock, fieldGroup, popField, areaField, aflag, acode, atablename):
    if atablename == None:
        atablename = ''
    else:
        atablename = atablename+'.'
            
    if aflag=='drawArea':
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM(  \
                        case \
                            when ST_CoveredBy('+atablename+'wkb_geometry'+','+filterLock+') then '+popField+' \
                            else st_area(st_intersection('+atablename+'wkb_geometry'+','+filterLock+')) / st_area('+atablename+'wkb_geometry'+')*'+popField+' end \
                    )',
                'areaatrisk' : 'SUM(  \
                        case \
                            when ST_CoveredBy('+atablename+'wkb_geometry'+','+filterLock+') then '+areaField+' \
                            else st_area(st_intersection('+atablename+'wkb_geometry'+','+filterLock+')) / st_area('+atablename+'wkb_geometry'+')*'+areaField+' end \
                    )'
            },
            where = {
                'ST_Intersects('+atablename+'wkb_geometry'+', '+filterLock+')'
            }).values(fieldGroup,'count','areaatrisk')) 
    elif aflag=='entireAfg':
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM('+popField+')',
                'areaatrisk' : 'SUM('+areaField+')'
            }).values(fieldGroup,'count','areaatrisk'))   
    elif aflag=='currentProvince':
        # print "left(dist_code), "+str(len(str(acode)))+") = '"+str(acode)+"'"
        # print "left(dist_code, "+len(str(acode))+") = '"+str(acode)+"'"
        if len(str(acode)) > 2:
            ff0001 =  "dist_code  = '"+str(acode)+"'"
        else :
            ff0001 =  "prov_code  = '"+str(acode)+"'"
                
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM('+popField+')',
                'areaatrisk' : 'SUM('+areaField+')'
            },
            where = {
                ff0001
            }).values(fieldGroup,'count','areaatrisk'))    
    elif aflag=='currentBasin':
            counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
                select={
                    'count' : 'SUM('+popField+')',
                    'areaatrisk' : 'SUM('+areaField+')'
                },
                where = {
                    atablename+"vuid = '"+str(acode)+"'"
                }).values(fieldGroup,'count','areaatrisk'))                
    else:
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM('+popField+')',
                'areaatrisk' : 'SUM('+areaField+')'
            },
            where = {
                'ST_Within('+atablename+'wkb_geometry'+', '+filterLock+')'
            }).values(fieldGroup,'count','areaatrisk')) 
    return counts     

class getProvince(ModelResource):
    """Provinces api"""
    class Meta:
        queryset = AfgAdmbndaAdm1.objects.all().defer('wkb_geometry')
        resource_name = 'getprovince'
        allowed_methods = ('get')
        filtering = { "id" : ALL }
       
class EarthQuakeStatisticResource(ModelResource):
    """Flood api"""

    class Meta:
        authorization = DjangoAuthorization()
        resource_name = 'earthquakestat'
        allowed_methods = ['post']
        detail_allowed_methods = ['post']
        always_return_data = True

    def post_list(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        response = self.getEarthQuakeStats(request)
        return self.create_response(request, response)   

    def getEarthQuakeStats(self, request):
        # o = urlparse(request.META.get('HTTP_REFERER')).path
        # o=o.split('/')
        # mapCode = o[2]
        # map_obj = _resolve_map(request, mapCode, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)

        # queryset = matrix(user=request.user,resourceid=map_obj,action='Interactive Calculation')
        # queryset.save()

        boundaryFilter = json.loads(request.body)
        flag = boundaryFilter['flag']
        temp1 = []
        for i in boundaryFilter['spatialfilter']:
            temp1.append('ST_GeomFromText(\''+i+'\',4326)')

        temp2 = 'ARRAY['
        first=True
        for i in temp1:
            if first:
                 temp2 = temp2 + i
                 first=False
            else :
                 temp2 = temp2 + ', ' + i  

        temp2 = temp2+']'
        
        filterLock = 'ST_Union('+temp2+')'

        # villagesummaryEQ
        # Book.objects.all().aggregate(Avg('price'))
        # response = getEarthQuakeExecuteExternal(filterLock,boundaryFilter['flag'],boundaryFilter['code'])  
        if flag=='drawArea':
            cursor = connections['geodb'].cursor()
            cursor.execute("\
                select coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_weak \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_weak \
                    end \
                )),0) as pop_shake_weak,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_light \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_light \
                    end \
                )),0) as pop_shake_light,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_moderate \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_moderate \
                    end \
                )),0) as pop_shake_moderate,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_strong \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_strong \
                    end \
                )),0) as pop_shake_strong,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_verystrong \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_verystrong \
                    end \
                )),0) as pop_shake_verystrong,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_severe \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_severe \
                    end \
                )),0) as pop_shake_severe,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_violent \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_violent \
                    end \
                )),0) as pop_shake_violent,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_extreme \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_extreme \
                    end \
                )),0) as pop_shake_extreme,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_weak \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_weak \
                    end \
                )),0) as settlement_shake_weak,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_light \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_light \
                    end \
                )),0) as settlement_shake_light,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_moderate \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_moderate \
                    end \
                )),0) as settlement_shake_moderate,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_strong \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_strong \
                    end \
                )),0) as settlement_shake_strong,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_verystrong \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_verystrong \
                    end \
                )),0) as settlement_shake_verystrong,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_severe \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_severe \
                    end \
                )),0) as settlement_shake_severe,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_violent \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_violent \
                    end \
                )),0) as settlement_shake_violent,     \
                coalesce(round(sum(   \
                    case    \
                        when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_extreme \
                        else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_extreme \
                    end \
                )),0) as settlement_shake_extreme     \
                from afg_ppla a, villagesummary_eq b   \
                where  a.vuid = b.village and b.event_code = '"+boundaryFilter['event_code']+"'  \
                and ST_Intersects(a.wkb_geometry,"+filterLock+")    \
            ")
            col_names = [desc[0] for desc in cursor.description]
           
            row = cursor.fetchone()
            row_dict = dict(izip(col_names, row))

            cursor.close()
            counts={}
            counts[0] = row_dict

        elif flag=='entireAfg':    
            counts = list(villagesummaryEQ.objects.all().extra(
                select={
                    'pop_shake_weak' : 'coalesce(SUM(pop_shake_weak),0)',
                    'pop_shake_light' : 'coalesce(SUM(pop_shake_light),0)',
                    'pop_shake_moderate' : 'coalesce(SUM(pop_shake_moderate),0)',
                    'pop_shake_strong' : 'coalesce(SUM(pop_shake_strong),0)',
                    'pop_shake_verystrong' : 'coalesce(SUM(pop_shake_verystrong),0)',
                    'pop_shake_severe' : 'coalesce(SUM(pop_shake_severe),0)',
                    'pop_shake_violent' : 'coalesce(SUM(pop_shake_violent),0)',
                    'pop_shake_extreme' : 'coalesce(SUM(pop_shake_extreme),0)',

                    'settlement_shake_weak' : 'coalesce(SUM(settlement_shake_weak),0)',
                    'settlement_shake_light' : 'coalesce(SUM(settlement_shake_light),0)',
                    'settlement_shake_moderate' : 'coalesce(SUM(settlement_shake_moderate),0)',
                    'settlement_shake_strong' : 'coalesce(SUM(settlement_shake_strong),0)',
                    'settlement_shake_verystrong' : 'coalesce(SUM(settlement_shake_verystrong),0)',
                    'settlement_shake_severe' : 'coalesce(SUM(settlement_shake_severe),0)',
                    'settlement_shake_violent' : 'coalesce(SUM(settlement_shake_violent),0)',
                    'settlement_shake_extreme' : 'coalesce(SUM(settlement_shake_extreme),0)'
                },
                where = {
                    "event_code = '"+boundaryFilter['event_code']+"'"
                }).values(
                    'pop_shake_weak',
                    'pop_shake_light',
                    'pop_shake_moderate',
                    'pop_shake_strong',
                    'pop_shake_verystrong',
                    'pop_shake_severe',
                    'pop_shake_violent',
                    'pop_shake_extreme',
                    'settlement_shake_weak',
                    'settlement_shake_light',
                    'settlement_shake_moderate',
                    'settlement_shake_strong',
                    'settlement_shake_verystrong',
                    'settlement_shake_severe',
                    'settlement_shake_violent',
                    'settlement_shake_extreme'
                ))   
        elif flag =='currentProvince':
            if len(str(boundaryFilter['code'])) > 2:
                ff0001 =  "district  = '"+str(boundaryFilter['code'])+"'"
            else :
                ff0001 =  "left(cast(district as text), "+str(len(str(boundaryFilter['code'])))+") = '"+str(boundaryFilter['code'])+"'"
            counts = list(villagesummaryEQ.objects.all().extra(
                select={
                    'pop_shake_weak' : 'coalesce(SUM(pop_shake_weak),0)',
                    'pop_shake_light' : 'coalesce(SUM(pop_shake_light),0)',
                    'pop_shake_moderate' : 'coalesce(SUM(pop_shake_moderate),0)',
                    'pop_shake_strong' : 'coalesce(SUM(pop_shake_strong),0)',
                    'pop_shake_verystrong' : 'coalesce(SUM(pop_shake_verystrong),0)',
                    'pop_shake_severe' : 'coalesce(SUM(pop_shake_severe),0)',
                    'pop_shake_violent' : 'coalesce(SUM(pop_shake_violent),0)',
                    'pop_shake_extreme' : 'coalesce(SUM(pop_shake_extreme),0)',

                    'settlement_shake_weak' : 'coalesce(SUM(settlement_shake_weak),0)',
                    'settlement_shake_light' : 'coalesce(SUM(settlement_shake_light),0)',
                    'settlement_shake_moderate' : 'coalesce(SUM(settlement_shake_moderate),0)',
                    'settlement_shake_strong' : 'coalesce(SUM(settlement_shake_strong),0)',
                    'settlement_shake_verystrong' : 'coalesce(SUM(settlement_shake_verystrong),0)',
                    'settlement_shake_severe' : 'coalesce(SUM(settlement_shake_severe),0)',
                    'settlement_shake_violent' : 'coalesce(SUM(settlement_shake_violent),0)',
                    'settlement_shake_extreme' : 'coalesce(SUM(settlement_shake_extreme),0)'
                },
                where = {
                    "event_code = '"+boundaryFilter['event_code']+"' and "+ff0001       
                }).values(
                    'pop_shake_weak',
                    'pop_shake_light',
                    'pop_shake_moderate',
                    'pop_shake_strong',
                    'pop_shake_verystrong',
                    'pop_shake_severe',
                    'pop_shake_violent',
                    'pop_shake_extreme',
                    'settlement_shake_weak',
                    'settlement_shake_light',
                    'settlement_shake_moderate',
                    'settlement_shake_strong',
                    'settlement_shake_verystrong',
                    'settlement_shake_severe',
                    'settlement_shake_violent',
                    'settlement_shake_extreme'
                ))  
        else:
            cursor = connections['geodb'].cursor()
            cursor.execute("\
                select coalesce(round(sum(b.pop_shake_weak)),0) as pop_shake_weak,     \
                coalesce(round(sum(b.pop_shake_light)),0) as pop_shake_light,     \
                coalesce(round(sum(b.pop_shake_moderate)),0) as pop_shake_moderate,     \
                coalesce(round(sum(b.pop_shake_strong)),0) as pop_shake_strong,     \
                coalesce(round(sum(b.pop_shake_verystrong)),0) as pop_shake_verystrong,     \
                coalesce(round(sum(b.pop_shake_severe)),0) as pop_shake_severe,     \
                coalesce(round(sum(b.pop_shake_violent)),0) as pop_shake_violent,     \
                coalesce(round(sum(b.pop_shake_extreme)),0) as pop_shake_extreme,     \
                coalesce(round(sum(b.settlement_shake_weak)),0) as settlement_shake_weak,     \
                coalesce(round(sum(b.settlement_shake_light)),0) as settlement_shake_light,     \
                coalesce(round(sum(b.settlement_shake_moderate)),0) as settlement_shake_moderate,     \
                coalesce(round(sum(b.settlement_shake_strong)),0) as settlement_shake_strong,     \
                coalesce(round(sum(b.settlement_shake_verystrong)),0) as settlement_shake_verystrong,     \
                coalesce(round(sum(b.settlement_shake_severe)),0) as settlement_shake_severe,     \
                coalesce(round(sum(b.settlement_shake_violent)),0) as settlement_shake_violent,     \
                coalesce(round(sum(b.settlement_shake_extreme)),0) as settlement_shake_extreme     \
                from afg_ppla a, villagesummary_eq b   \
                where  a.vuid = b.village and b.event_code = '"+boundaryFilter['event_code']+"'  \
                and ST_Within(a.wkb_geometry,"+filterLock+")    \
            ")
            col_names = [desc[0] for desc in cursor.description]
           
            row = cursor.fetchone()
            row_dict = dict(izip(col_names, row))

            cursor.close()
            counts={}
            counts[0] = row_dict

        return counts[0] 

def getEarthQuakeExecuteExternal(filterLock, flag, code, event_code):   
    response = {} 
    cursor = connections['geodb'].cursor()
    cursor.execute("\
        select b.grid_value, sum(   \
        case    \
            when ST_CoveredBy(a.wkb_geometry,b.wkb_geometry) then a.area_population \
            else st_area(st_intersection(a.wkb_geometry,b.wkb_geometry))/st_area(a.wkb_geometry)*a.area_population \
        end) as pop     \
        from afg_lndcrva a, earthquake_shakemap b   \
        where b.event_code = '"+event_code+"' and b.grid_value > 1 and a.vuid = '"+str(code)+"'    \
        and ST_Intersects(a.wkb_geometry,b.wkb_geometry)    \
        group by b.grid_value\
    ")
    # cursor.execute("\
    #     select b.grid_value, sum(   \
    #     case    \
    #         when ST_CoveredBy(a.wkb_geometry,b.wkb_geometry) then a.vuid_population_landscan \
    #         else st_area(st_intersection(a.wkb_geometry,b.wkb_geometry))/st_area(a.wkb_geometry)*a.vuid_population_landscan \
    #     end) as pop     \
    #     from afg_ppla a, earthquake_shakemap b   \
    #     where b.event_code = '"+event_code+"' and b.grid_value > 1 and a.vuid = '"+str(code)+"'    \
    #     and ST_Intersects(a.wkb_geometry,b.wkb_geometry)    \
    #     group by b.grid_value\
    # ")
    row = cursor.fetchall()

    temp = dict([(c[0], c[1]) for c in row])
    response['pop_shake_weak']=round(temp.get(2, 0),0) + round(temp.get(3, 0),0) 
    response['pop_shake_light']=round(temp.get(4, 0),0) 
    response['pop_shake_moderate']=round(temp.get(5, 0),0) 
    response['pop_shake_strong']=round(temp.get(6, 0),0) 
    response['pop_shake_verystrong']=round(temp.get(7, 0),0)
    response['pop_shake_severe']=round(temp.get(8, 0),0)  
    response['pop_shake_violent']=round(temp.get(9, 0),0) 
    response['pop_shake_extreme']=round(temp.get(10, 0),0)+round(temp.get(11, 0),0)+round(temp.get(12, 0),0)+round(temp.get(13, 0),0)+round(temp.get(14, 0),0)+round(temp.get(15, 0),0)

    cursor.execute("\
        select b.grid_value, count(*) as numbersettlements     \
        from afg_pplp a, earthquake_shakemap b   \
        where b.event_code = '"+event_code+"' and b.grid_value > 1 and a.vuid = '"+str(code)+"'    \
        and ST_Within(a.wkb_geometry,b.wkb_geometry)    \
        group by b.grid_value\
    ")
    row = cursor.fetchall()

    temp = dict([(c[0], c[1]) for c in row])
    response['settlement_shake_weak']=round(temp.get(2, 0),0) + round(temp.get(3, 0),0) 
    response['settlement_shake_light']=round(temp.get(4, 0),0) 
    response['settlement_shake_moderate']=round(temp.get(5, 0),0) 
    response['settlement_shake_strong']=round(temp.get(6, 0),0) 
    response['settlement_shake_verystrong']=round(temp.get(7, 0),0)
    response['settlement_shake_severe']=round(temp.get(8, 0),0)  
    response['settlement_shake_violent']=round(temp.get(9, 0),0) 
    response['settlement_shake_extreme']=round(temp.get(10, 0),0)+round(temp.get(11, 0),0)+round(temp.get(12, 0),0)+round(temp.get(13, 0),0)+round(temp.get(14, 0),0)+round(temp.get(15, 0),0)
    
    cursor.close()
    return response

class getEQEvents(ModelResource):
    """Provinces api"""
    detail_title = fields.CharField()
    date_custom = fields.CharField()
    def dehydrate_detail_title(self, bundle):
        return bundle.obj.title + ' on ' +  bundle.obj.dateofevent.strftime("%d-%m-%Y %H:%M:%S")
    def dehydrate_date_custom(self, bundle):
        return bundle.obj.dateofevent.strftime("%d-%m-%Y %H:%M:%S")
    class Meta:
        queryset = earthquake_events.objects.all().order_by('dateofevent')
        resource_name = 'geteqevents'
        allowed_methods = ('get')
        filtering = { "id" : ALL }     


    