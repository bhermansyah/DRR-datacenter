from geodb.models import AfgFldzonea100KRiskLandcoverPop, FloodRiskExposure, AfgLndcrva, LandcoverDescription, AfgAvsa, AfgAdmbndaAdm1, AfgPplp, earthquake_shakemap, earthquake_events, villagesummaryEQ, AfgRdsl, AfgHltfac, forecastedLastUpdate, provincesummary, AfgCaptAdm1ItsProvcImmap, AfgCaptAdm1NearestProvcImmap, AfgCaptAdm2NearestDistrictcImmap, AfgCaptAirdrmImmap, AfgCaptHltfacTier1Immap, AfgCaptHltfacTier2Immap
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
from tastypie.cache import SimpleCache
from pytz import timezone, all_timezones


FILTER_TYPES = {
    'flood': AfgFldzonea100KRiskLandcoverPop
}

class FloodRiskStatisticResource(ModelResource):
    """Flood api"""

    class Meta:
        # authorization = DjangoAuthorization()
        resource_name = 'floodrisk'
        allowed_methods = ['post']
        detail_allowed_methods = ['post']
        cache = SimpleCache()
        # always_return_data = True
 

    def getRisk(self, request):
        # saving the user tracking records

        # o = urlparse(request.META.get('HTTP_REFERER')).path
        # o=o.split('/')
        # mapCode = o[2]
        # map_obj = _resolve_map(request, mapCode, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)

        # queryset = matrix(user=request.user,resourceid=map_obj,action='Interactive Calculation')
        # queryset.save()

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
        YEAR = datetime.datetime.utcnow().strftime("%Y")
        MONTH = datetime.datetime.utcnow().strftime("%m")
        DAY = datetime.datetime.utcnow().strftime("%d")
        
        targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
        targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and marshland')
        targetBase = AfgLndcrva.objects.all()
        targetAvalanche = AfgAvsa.objects.all()
        response = {}

        if flag != 'entireAfg':
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

            # Flood Risk
            counts =  getRiskNumber(targetRisk.exclude(mitigated_pop__gt=0), filterLock, 'deeperthan', 'fldarea_population', 'fldarea_sqm', flag, code, None)
            
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

            counts =  getRiskNumber(targetRiskIncludeWater.exclude(mitigated_pop__gt=0), filterLock, 'agg_simplified_description', 'fldarea_population', 'fldarea_sqm', flag, code, None)

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

            # # Number of Settelement on avalanche risk
            # if flag=='drawArea':
            #     countsBase = targetAvalanche.extra(
            #         select={
            #             'numbersettlementsatava': 'count(distinct vuid)'}, 
            #         where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*sum_area_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatava')
            # elif flag=='entireAfg':
            #     countsBase = targetAvalanche.extra(
            #         select={
            #             'numbersettlementsatava': 'count(distinct vuid)'}).values('numbersettlementsatava')
            # elif flag=='currentProvince':
            #     if len(str(code)) > 2:
            #         ff0001 =  "dist_code  = '"+str(code)+"'"
            #     else :
            #         ff0001 =  "prov_code  = '"+str(code)+"'"
            #     countsBase = targetAvalanche.extra(
            #         select={
            #             'numbersettlementsatava': 'count(distinct vuid)'}, 
            #         where = {ff0001}).values('numbersettlementsatava')
            # elif flag=='currentBasin':
            #     countsBase = targetAvalanche.extra(
            #         select={
            #             'numbersettlementsatava': 'count(distinct vuid)'},  
            #         where = {"vuid = '"+str(code)+"'"}).values('numbersettlementsatava')
            # else:
            #     countsBase = targetAvalanche.extra(
            #         select={
            #             'numbersettlementsatava': 'count(distinct vuid)'}, 
            #         where = {'ST_Within(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatava')

            # response['numbersettlementsatava'] = round(countsBase[0]['numbersettlementsatava'],0)

            # Number settlement at risk of flood
            if flag=='drawArea':
                countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Built-up').extra(
                    select={
                        'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                    where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*fldarea_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')
            elif flag=='entireAfg':
                countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Built-up').extra(
                    select={
                        'numbersettlementsatrisk': 'count(distinct vuid)'}).values('numbersettlementsatrisk')
            elif flag=='currentProvince':
                if len(str(code)) > 2:
                    ff0001 =  "dist_code  = '"+str(code)+"'"
                else :
                    ff0001 =  "prov_code  = '"+str(code)+"'"
                countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Built-up').extra(
                    select={
                        'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                    where = {ff0001}).values('numbersettlementsatrisk')
            elif flag=='currentBasin':
                countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Built-up').extra(
                    select={
                        'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                    where = {"vuid = '"+str(code)+"'"}).values('numbersettlementsatrisk')    
            else:
                countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Built-up').extra(
                    select={
                        'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                    where = {'ST_Within(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')

            response['settlements_at_risk'] = round(countsBase[0]['numbersettlementsatrisk'],0)

            # number all settlements
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

            # All population number
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

        else:
            px = provincesummary.objects.aggregate(Sum('high_ava_population'),Sum('med_ava_population'),Sum('low_ava_population'),Sum('total_ava_population'),Sum('high_ava_area'),Sum('med_ava_area'),Sum('low_ava_area'),Sum('total_ava_area'), \
                 Sum('high_risk_population'),Sum('med_risk_population'),Sum('low_risk_population'),Sum('total_risk_population'), Sum('high_risk_area'),Sum('med_risk_area'),Sum('low_risk_area'),Sum('total_risk_area'),  \
                 Sum('water_body_pop_risk'),Sum('barren_land_pop_risk'),Sum('built_up_pop_risk'),Sum('fruit_trees_pop_risk'),Sum('irrigated_agricultural_land_pop_risk'),Sum('permanent_snow_pop_risk'),Sum('rainfed_agricultural_land_pop_risk'),Sum('rangeland_pop_risk'),Sum('sandcover_pop_risk'),Sum('vineyards_pop_risk'),Sum('forest_pop_risk'), \
                 Sum('water_body_area_risk'),Sum('barren_land_area_risk'),Sum('built_up_area_risk'),Sum('fruit_trees_area_risk'),Sum('irrigated_agricultural_land_area_risk'),Sum('permanent_snow_area_risk'),Sum('rainfed_agricultural_land_area_risk'),Sum('rangeland_area_risk'),Sum('sandcover_area_risk'),Sum('vineyards_area_risk'),Sum('forest_area_risk'), \
                 Sum('water_body_pop'),Sum('barren_land_pop'),Sum('built_up_pop'),Sum('fruit_trees_pop'),Sum('irrigated_agricultural_land_pop'),Sum('permanent_snow_pop'),Sum('rainfed_agricultural_land_pop'),Sum('rangeland_pop'),Sum('sandcover_pop'),Sum('vineyards_pop'),Sum('forest_pop'), \
                 Sum('water_body_area'),Sum('barren_land_area'),Sum('built_up_area'),Sum('fruit_trees_area'),Sum('irrigated_agricultural_land_area'),Sum('permanent_snow_area'),Sum('rainfed_agricultural_land_area'),Sum('rangeland_area'),Sum('sandcover_area'),Sum('vineyards_area'),Sum('forest_area'), \
                 Sum('settlements_at_risk'), Sum('settlements'), Sum('Population'), Sum('Area') )
            
            for p in px:
                response[p[:-5]] = px[p]

        counts =  getRiskNumber(targetRisk.exclude(mitigated_pop=0), filterLock, 'deeperthan', 'mitigated_pop', 'fldarea_sqm', flag, code, None)
        temp = dict([(c['deeperthan'], c['count']) for c in counts])
        response['high_risk_mitigated_population']=round(temp.get('271 cm', 0),0)
        response['med_risk_mitigated_population']=round(temp.get('121 cm', 0), 0)
        response['low_risk_mitigated_population']=round(temp.get('029 cm', 0),0)
        response['total_risk_mitigated_population']=response['high_risk_mitigated_population']+response['med_risk_mitigated_population']+response['low_risk_mitigated_population']

        # Avalanche Forecasted
        counts =  getRiskNumber(targetAvalanche.select_related("basinmembersava").exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='snowwater',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'avalanche_pop', 'sum_area_sqm', flag, code, 'afg_avsa')
        temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])
        response['ava_forecast_low_pop']=round(temp.get(1, 0),0) 
        response['ava_forecast_med_pop']=round(temp.get(2, 0),0) 
        response['ava_forecast_high_pop']=round(temp.get(3, 0),0) 
        response['total_ava_forecast_pop']=response['ava_forecast_low_pop'] + response['ava_forecast_med_pop'] + response['ava_forecast_high_pop']

        # River Flood Forecasted
        counts =  getRiskNumber(targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')
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
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
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


        # Flash Flood Forecasted
        # AfgFldzonea100KRiskLandcoverPop.objects.all().select_related("basinmembers").values_list("agg_simplified_description","basinmember__basins__riskstate")
        counts =  getRiskNumber(targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')
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

        # flood risk and flashflood forecast matrix
        px = targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY))
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
            }).values('basinmember__basins__riskstate','deeperthan', 'pop') 

        temp = [ num for num in px if num['basinmember__basins__riskstate'] == 1 ]
        temp = dict([(c['deeperthan'], c['pop']) for c in temp])
        response['flashflood_forecast_verylow_risk_low_pop']=round(temp.get('029 cm', 0),0)
        response['flashflood_forecast_verylow_risk_med_pop']=round(temp.get('121 cm', 0), 0)
        response['flashflood_forecast_verylow_risk_high_pop']=round(temp.get('271 cm', 0),0)

        temp = [ num for num in px if num['basinmember__basins__riskstate'] == 2 ]
        temp = dict([(c['deeperthan'], c['pop']) for c in temp])
        response['flashflood_forecast_low_risk_low_pop']=round(temp.get('029 cm', 0),0)
        response['flashflood_forecast_low_risk_med_pop']=round(temp.get('121 cm', 0), 0) 
        response['flashflood_forecast_low_risk_high_pop']=round(temp.get('271 cm', 0),0)

        temp = [ num for num in px if num['basinmember__basins__riskstate'] == 3 ]
        temp = dict([(c['deeperthan'], c['pop']) for c in temp])
        response['flashflood_forecast_med_risk_low_pop']=round(temp.get('029 cm', 0),0)
        response['flashflood_forecast_med_risk_med_pop']=round(temp.get('121 cm', 0), 0)
        response['flashflood_forecast_med_risk_high_pop']=round(temp.get('271 cm', 0),0) 

        temp = [ num for num in px if num['basinmember__basins__riskstate'] == 4 ]
        temp = dict([(c['deeperthan'], c['pop']) for c in temp])
        response['flashflood_forecast_high_risk_low_pop']=round(temp.get('029 cm', 0),0)
        response['flashflood_forecast_high_risk_med_pop']=round(temp.get('121 cm', 0), 0)
        response['flashflood_forecast_high_risk_high_pop']=round(temp.get('271 cm', 0),0)

        temp = [ num for num in px if num['basinmember__basins__riskstate'] == 5 ]
        temp = dict([(c['deeperthan'], c['pop']) for c in temp])
        response['flashflood_forecast_veryhigh_risk_low_pop']=round(temp.get('029 cm', 0),0)
        response['flashflood_forecast_veryhigh_risk_med_pop']=round(temp.get('121 cm', 0), 0)
        response['flashflood_forecast_veryhigh_risk_high_pop']=round(temp.get('271 cm', 0),0)

        temp = [ num for num in px if num['basinmember__basins__riskstate'] == 6 ]
        temp = dict([(c['deeperthan'], c['pop']) for c in temp])
        response['flashflood_forecast_extreme_risk_low_pop']=round(temp.get('029 cm', 0),0)
        response['flashflood_forecast_extreme_risk_med_pop']=round(temp.get('121 cm', 0), 0)
        response['flashflood_forecast_extreme_risk_high_pop']=round(temp.get('271 cm', 0),0)
        

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

        # Roads 
        if flag=='drawArea':
            countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
            select={
                'road_length' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry'+','+filterLock+') then road_length \
                            else ST_Length(st_intersection(wkb_geometry::geography'+','+filterLock+')) / road_length end \
                    )/1000'
            },
            where = {
                'ST_Intersects(wkb_geometry'+', '+filterLock+')'
            }).values('type_update','road_length') 

            countsHLTBase = AfgHltfac.objects.all().values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
                    select={
                        'numberhospital' : 'count(*)'
                    },
                    where = {
                        'ST_Intersects(wkb_geometry'+', '+filterLock+')'
                    }).values('facility_types_description', 'numberhospital')

        elif flag=='entireAfg':    
            countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
                    select={
                        'road_length' : 'SUM(road_length)/1000'
                    }).values('type_update', 'road_length')
            

            # Health Facilities
            countsHLTBase = AfgHltfac.objects.all().values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
                    select={
                        'numberhospital' : 'count(*)'
                    }).values('facility_types_description', 'numberhospital')
            
        elif flag=='currentProvince':
            if len(str(code)) > 2:
                ff0001 =  "dist_code  = '"+str(code)+"'"
            else :
                if len(str(code))==1:
                    ff0001 =  "left(cast(dist_code as text),1)  = '"+str(code)+"'"
                else:
                    ff0001 =  "left(cast(dist_code as text),2)  = '"+str(code)+"'"    
                    
            countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
                select={
                     'road_length' : 'SUM(road_length)/1000'
                },
                where = {
                    ff0001
                 }).values('type_update','road_length') 

            countsHLTBase = AfgHltfac.objects.all().values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
                select={
                        'numberhospital' : 'count(*)'
                },where = {
                    ff0001
                }).values('facility_types_description', 'numberhospital')

        elif flag=='currentBasin':
            print 'currentBasin'
        else:
            countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
                select={
                    'road_length' : 'SUM(road_length)/1000'
                },
                where = {
                    'ST_Within(wkb_geometry'+', '+filterLock+')'
                }).values('type_update','road_length') 

            countsHLTBase = AfgHltfac.objects.all().values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
                select={
                        'numberhospital' : 'count(*)'
                },where = {
                    'ST_Within(wkb_geometry'+', '+filterLock+')'
                }).values('facility_types_description', 'numberhospital')


        tempRoadBase = dict([(c['type_update'], c['road_length']) for c in countsRoadBase])
        tempHLTBase = dict([(c['facility_types_description'], c['numberhospital']) for c in countsHLTBase])

        response["highway_road_base"]=round(tempRoadBase.get("highway", 0),1)
        response["primary_road_base"]=round(tempRoadBase.get("primary", 0),1)
        response["secondary_road_base"]=round(tempRoadBase.get("secondary", 0),1)
        response["tertiary_road_base"]=round(tempRoadBase.get("tertiary", 0),1)
        response["residential_road_base"]=round(tempRoadBase.get("residential", 0),1)
        response["track_road_base"]=round(tempRoadBase.get("track", 0),1)
        response["path_road_base"]=round(tempRoadBase.get("path", 0),1)
        response["river_crossing_road_base"]=round(tempRoadBase.get("river crossing", 0),1)
        response["bridge_road_base"]=round(tempRoadBase.get("bridge", 0),1)
        response["total_road_base"]=response["highway_road_base"]+response["primary_road_base"]+response["secondary_road_base"]+response["tertiary_road_base"]+response["residential_road_base"]+response["track_road_base"]+response["path_road_base"]+response["river_crossing_road_base"]+response["bridge_road_base"]

        response["h1_health_base"]=round(tempHLTBase.get("Regional / National Hospital (H1)", 0))
        response["h2_health_base"]=round(tempHLTBase.get("Provincial Hospital (H2)", 0))    
        response["h3_health_base"]=round(tempHLTBase.get("District Hospital (H3)", 0))
        response["sh_health_base"]=round(tempHLTBase.get("Special Hospital (SH)", 0))
        response["rh_health_base"]=round(tempHLTBase.get("Rehabilitation Center (RH)", 0))               
        response["mh_health_base"]=round(tempHLTBase.get("Maternity Home (MH)", 0))
        response["datc_health_base"]=round(tempHLTBase.get("Drug Addicted Treatment Center", 0))
        response["tbc_health_base"]=round(tempHLTBase.get("TB Control Center (TBC)", 0))
        response["mntc_health_base"]=round(tempHLTBase.get("Mental Clinic / Hospital", 0))
        response["chc_health_base"]=round(tempHLTBase.get("Comprehensive Health Center (CHC)", 0))
        response["bhc_health_base"]=round(tempHLTBase.get("Basic Health Center (BHC)", 0))
        response["dcf_health_base"]=round(tempHLTBase.get("Day Care Feeding", 0))
        response["mch_health_base"]=round(tempHLTBase.get("MCH Clinic M1 or M2 (MCH)", 0))
        response["shc_health_base"]=round(tempHLTBase.get("Sub Health Center (SHC)", 0))
        response["ec_health_base"]=round(tempHLTBase.get("Eye Clinic / Hospital", 0))
        response["pyc_health_base"]=round(tempHLTBase.get("Physiotherapy Center", 0))
        response["pic_health_base"]=round(tempHLTBase.get("Private Clinic", 0))        
        response["mc_health_base"]=round(tempHLTBase.get("Malaria Center (MC)", 0))
        response["moph_health_base"]=round(tempHLTBase.get("MoPH National", 0))
        response["epi_health_base"]=round(tempHLTBase.get("EPI Fixed Center (EPI)", 0))
        response["sfc_health_base"]=round(tempHLTBase.get("Supplementary Feeding Center (SFC)", 0))
        response["mht_health_base"]=round(tempHLTBase.get("Mobile Health Team (MHT)", 0))
        response["other_health_base"]=round(tempHLTBase.get("Other", 0))
        response["total_health_base"] = response["bhc_health_base"]+response["dcf_health_base"]+response["mch_health_base"]+response["rh_health_base"]+response["h3_health_base"]+response["sh_health_base"]+response["mh_health_base"]+response["datc_health_base"]+response["h1_health_base"]+response["shc_health_base"]+response["ec_health_base"]+response["pyc_health_base"]+response["pic_health_base"]+response["tbc_health_base"]+response["mntc_health_base"]+response["chc_health_base"]+response["other_health_base"]+response["h2_health_base"]+response["mc_health_base"]+response["moph_health_base"]+response["epi_health_base"]+response["sfc_health_base"]+response["mht_health_base"]
        
        sw = forecastedLastUpdate.objects.filter(forecasttype='snowwater').latest('datadate')
        rf = forecastedLastUpdate.objects.filter(forecasttype='riverflood').latest('datadate')

        # print rf.datadate
        tempRF = rf.datadate + datetime.timedelta(hours=4.5)
        tempSW = sw.datadate + datetime.timedelta(hours=4.5)

        response["riverflood_lastupdated"] = tempRF.strftime("%d-%m-%Y %H:%M")
        response["snowwater_lastupdated"] =  tempSW.strftime("%d-%m-%Y %H:%M")
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

        # villagesummaryEQ earthquake_shakemap

        p = earthquake_shakemap.objects.all().filter(event_code=boundaryFilter['event_code'])
        if p.count() == 0:
            return {'message':'Mercalli Intensity Scale are not Available'}

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

class EQEventsSerializer(Serializer):
     def to_json(self, data, options=None):
        options = options or {}
        data = self.to_simple(data, options)
        data2 = self.to_simple({'objects':[]}, options)
        for i in data['objects']:
            if i['evFlag'] == 1 or i['smFlag'] == 1:
                if i['smFlag'] == 1:
                    i['sm_available'] = 'ShakeMap are Available'
                else :
                    i['sm_available'] = 'ShakeMap are not Available'    
                data2['objects'].append(i)

        return json.dumps(data2, cls=DjangoJSONEncoder, sort_keys=True)       

class getEQEvents(ModelResource):
    """Provinces api"""
    detail_title = fields.CharField()
    date_custom = fields.CharField()
    evFlag = fields.IntegerField()
    smFlag = fields.IntegerField()
    sm_available = fields.CharField()
    def dehydrate_detail_title(self, bundle):
        return bundle.obj.title + ' on ' +  bundle.obj.dateofevent.strftime("%d-%m-%Y %H:%M:%S")
    def dehydrate_date_custom(self, bundle):
        return bundle.obj.dateofevent.strftime("%d-%m-%Y %H:%M:%S")
    def dehydrate_evFlag(self, bundle):    
        pEV = earthquake_events.objects.extra(
            tables={'afg_admbnda_adm1'},
            where={"ST_Intersects(afg_admbnda_adm1.wkb_geometry,earthquake_events.wkb_geometry) and earthquake_events.event_code = '"+bundle.obj.event_code+"'"}
        )
        if pEV.count()>0:
            return 1
        else:
            return 0  
    def dehydrate_smFlag(self, bundle):    
        pSM = earthquake_shakemap.objects.extra(
            tables={'afg_admbnda_adm1'},
            where={"ST_Intersects(afg_admbnda_adm1.wkb_geometry,earthquake_shakemap.wkb_geometry) and earthquake_shakemap.event_code = '"+bundle.obj.event_code+"'"}
        )
        if pSM.count()>0:
            return 1
        else:
            return 0                  
    class Meta:
        queryset = earthquake_events.objects.all().order_by('dateofevent')
        # queryset = earthquake_events.objects.extra(
        #     tables={'earthquake_shakemap'},
        #     where={'earthquake_events.event_code=earthquake_shakemap.event_code'
        #            # 'logsource_domain="example.com"',
        #            }
        # ).values('event_code','title','dateofevent','magnitude','depth', 'shakemaptimestamp','wkb_geometry')   
        resource_name = 'geteqevents'
        allowed_methods = ('get')
        filtering = { 
            "dateofevent" : ['gte', 'lte']
        } 
        serializer = EQEventsSerializer()   

      
class getAccessibilities(ModelResource):
    class Meta:
        resource_name = 'getaccessibilities'
        allowed_methods = ['post']
        detail_allowed_methods = ['post']
        cache = SimpleCache() 

    def post_list(self, request, **kwargs):
        self.method_check(request, allowed=['post'])
        response = self.getData(request)
        return self.create_response(request, response)   

    def getData(self, request):
        # AfgCaptAdm1ItsProvcImmap, AfgCaptAdm1NearestProvcImmap, AfgCaptAdm2NearestDistrictcImmap, AfgCaptAirdrmImmap, AfgCaptHltfacTier1Immap, AfgCaptHltfacTier2Immap
        # px = provincesummary.objects.aggregate(Sum('high_ava_population')
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
        flag = boundaryFilter['flag']
        code = boundaryFilter['code']

        response = {}
        if flag=='entireAfg':
            q1 = AfgCaptAdm1ItsProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'))
            q2 = AfgCaptAdm1NearestProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'))
            q3 = AfgCaptAdm2NearestDistrictcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'))
            q4 = AfgCaptAirdrmImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'))
            q5 = AfgCaptHltfacTier1Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population'))
            q6 = AfgCaptHltfacTier2Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population'))
        elif flag =='currentProvince':
            if len(str(boundaryFilter['code'])) > 2:
                ff0001 =  "dist_code  = '"+str(boundaryFilter['code'])+"'"
            else :
                ff0001 =  "left(cast(dist_code as text), "+str(len(str(boundaryFilter['code'])))+") = '"+str(boundaryFilter['code'])+"'"   
            q1 = AfgCaptAdm1ItsProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
                where = {
                    ff0001       
                })
            q2 = AfgCaptAdm1NearestProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
                where = {
                    ff0001       
                })
            q3 = AfgCaptAdm2NearestDistrictcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
                where = {
                    ff0001       
                })
            q4 = AfgCaptAirdrmImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
                where = {
                    ff0001       
                })
            q5 = AfgCaptHltfacTier1Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
                where = {
                    ff0001       
                })
            q6 = AfgCaptHltfacTier2Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
                where = {
                    ff0001       
                })
        elif flag =='drawArea':
            tt = AfgPplp.objects.filter(wkb_geometry__intersects=boundaryFilter['spatialfilter'][0]).values('vuid')
            q1 = AfgCaptAdm1ItsProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q2 = AfgCaptAdm1NearestProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q3 = AfgCaptAdm2NearestDistrictcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q4 = AfgCaptAirdrmImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q5 = AfgCaptHltfacTier1Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q6 = AfgCaptHltfacTier2Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        else:
            tt = AfgPplp.objects.filter(wkb_geometry__intersects=boundaryFilter['spatialfilter'][0]).values('vuid')
            q1 = AfgCaptAdm1ItsProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q2 = AfgCaptAdm1NearestProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q3 = AfgCaptAdm2NearestDistrictcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q4 = AfgCaptAirdrmImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q5 = AfgCaptHltfacTier1Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
            q6 = AfgCaptHltfacTier2Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))

        for i in q1: 
            timelabel = i['time'].replace(' ','_')
            timelabel = timelabel.replace('<','l')
            timelabel = timelabel.replace('>','g')
            response[timelabel+'__itsx_prov']=round(i['pop'])       
        for i in q2:
            timelabel = i['time'].replace(' ','_')
            timelabel = timelabel.replace('<','l')
            timelabel = timelabel.replace('>','g')
            response[timelabel+'__near_prov']=round(i['pop'])    
        for i in q3:
            timelabel = i['time'].replace(' ','_')
            timelabel = timelabel.replace('<','l')
            timelabel = timelabel.replace('>','g')
            response[timelabel+'__near_dist']=round(i['pop'])      
        for i in q4:
            timelabel = i['time'].replace(' ','_')
            timelabel = timelabel.replace('<','l')
            timelabel = timelabel.replace('>','g')
            response[timelabel+'__near_airp']=round(i['pop'])       
        for i in q5:
            timelabel = i['time'].replace(' ','_')
            timelabel = timelabel.replace('<','l')
            timelabel = timelabel.replace('>','g')
            response[timelabel+'__near_hlt1']=round(i['pop'])     
        for i in q6:
            timelabel = i['time'].replace(' ','_')
            timelabel = timelabel.replace('<','l')
            timelabel = timelabel.replace('>','g')
            response[timelabel+'__near_hlt2']=round(i['pop'])     
        
        return response

    