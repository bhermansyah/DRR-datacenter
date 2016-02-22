from geodb.models import AfgFldzonea100KRiskLandcoverPop, FloodRiskExposure, AfgLndcrva, LandcoverDescription, AfgAvsa, AfgAdmbndaAdm1
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

# addded by boedy
from matrix.models import matrix


YEAR = datetime.datetime.utcnow().strftime("%Y")
MONTH = datetime.datetime.utcnow().strftime("%m")
DAY = datetime.datetime.utcnow().strftime("%d")


FILTER_TYPES = {
    'flood': AfgFldzonea100KRiskLandcoverPop
}

# class CountJSONSerializer(Serializer):
#     """Custom serializer to post process the api and add counts  """

#     def get_resources_counts(self, options):
#         """Target table"""
#         result = []
#         resources = AfgFldzonea100KRiskLandcoverPop.objects.all()

#         counts = list(resources.values(options['count_type']).annotate(count=Sum('fldarea_population'),areaatrisk=Sum('fldarea_sqm'),numbersettlementsatrisk=Count('vuid', distinct=True)))
               
#         result.append(dict([(c[options['count_type']], c['count']) for c in counts]))
#         result.append(dict([(c[options['count_type']], c['areaatrisk']) for c in counts]))
#         result.append(dict([(c[options['count_type']], c['numbersettlementsatrisk']) for c in counts]))
#         return result 

#     def to_json(self, data, options=None):
#         options = options or {}
#         data = self.to_simple(data, options)

#         counts = self.get_resources_counts(options)
#         print data
#         if 'objects' in data:
#             for item in data['objects']:
#                 print item
#                 item['popatrisk'] = counts[0].get(item['code'], 0)
#                 item['areaatrisk'] = counts[1].get(item['code'], 0)

#                 item['numbersettlementsatrisk'] = counts[2].get(item['code'], 0)

#         data['requested_time'] = time.time()    
        
#         return json.dumps(data, cls=DjangoJSONEncoder, sort_keys=True)    

# class TypeFilteredResource(ModelResource):

#     count = fields.IntegerField()
#     areaatrisk = fields.IntegerField()

#     def build_filters(self, filters={}):
#         # self.district_filter = None
#         # print filters
#         orm_filters = super(TypeFilteredResource, self).build_filters(filters)   

        
#         # if 'dist_code__icontains' in filters:
#         #     self.district_filter = filters['dist_code__icontains']


#         return orm_filters

#     def serialize(self, request, data, format, options={}):
#         # print request
#         # options['district_filter'] = self.district_filter
#         return super(TypeFilteredResource, self).serialize(request, data, format, options)


# class FloodRiskStatisticResource(TypeFilteredResource):
#     """Flood api"""

#     def serialize(self, request, data, format, options={}):
#         options['count_type'] = 'deeperthan'
#         options['resource_name'] = 'floodrisk'
#         return super(FloodRiskStatisticResource, self).serialize(request, data, format, options)

#     class Meta:
#         queryset = FloodRiskExposure.objects.all()
#         resource_name = 'floodrisk'
#         allowed_methods = ['post']
#         serializer = CountJSONSerializer()


class FloodRiskStatisticResource(ModelResource):
    """Flood api"""

    # def serialize(self, request, data, format, options={}):
    #     options['count_type'] = 'deeperthan'
    #     options['resource_name'] = 'floodrisk'
    #     return super(FloodRiskStatisticResource, self).serialize(request, data, format, options)

    class Meta:
        authorization = DjangoAuthorization()
        # queryset = FloodRiskExposure.objects.all()

        resource_name = 'floodrisk'
        allowed_methods = ['post']
        detail_allowed_methods = ['post']
        always_return_data = True

    # def getRiskNumber(self, data, filterLock, fieldGroup, popField, areaField):
    #     counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
    #         select={
    #             'count' : 'SUM(  \
    #                     case \
    #                         when ST_CoveredBy(wkb_geometry,'+filterLock+') then '+popField+' \
    #                         else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*'+popField+' end \
    #                 )',
    #             # 'areaatrisk': 'SUM(st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_sqm)'
    #             'areaatrisk' : 'SUM(  \
    #                     case \
    #                         when ST_CoveredBy(wkb_geometry,'+filterLock+') then '+areaField+' \
    #                         else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*'+areaField+' end \
    #                 )'
    #         },
    #         where = {
    #             'ST_Intersects(wkb_geometry, '+filterLock+')'
    #         }).values(fieldGroup,'count','areaatrisk')) 
    #     return counts    

    # def getRiskExecute(self, filterLock):
    #     targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
    #     targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and marshland')
    #     targetBase = AfgLndcrva.objects.all()
    #     targetAvalanche = AfgAvsa.objects.all()
    #     response = {}

    #     #Avalanche Risk
    #     counts =  self.getRiskNumber(targetAvalanche, filterLock, 'avalanche_cat', 'avalanche_pop', 'sum_area_sqm')
    #     # pop at risk level
    #     temp = dict([(c['avalanche_cat'], c['count']) for c in counts])
    #     response['high_ava_population']=round(temp.get('High', 0),0)
    #     response['med_ava_population']=round(temp.get('Moderate', 0), 0)
    #     response['low_ava_population']=0
    #     response['total_ava_population']=response['high_ava_population']+response['med_ava_population']+response['low_ava_population']

    #     # area at risk level
    #     temp = dict([(c['avalanche_cat'], c['areaatrisk']) for c in counts])
    #     response['high_ava_area']=round(temp.get('High', 0)/1000000,1)
    #     response['med_ava_area']=round(temp.get('Moderate', 0)/1000000,1)
    #     response['low_ava_area']=0    
    #     response['total_ava_area']=round(response['high_ava_area']+response['med_ava_area']+response['low_ava_area'],2) 


    #     # Flood Risk
    #     counts =  self.getRiskNumber(targetRisk, filterLock, 'deeperthan', 'fldarea_population', 'fldarea_sqm')
        
    #     # pop at risk level
    #     temp = dict([(c['deeperthan'], c['count']) for c in counts])
    #     response['high_risk_population']=round(temp.get('271 cm', 0),0)
    #     response['med_risk_population']=round(temp.get('121 cm', 0), 0)
    #     response['low_risk_population']=round(temp.get('029 cm', 0),0)
    #     response['total_risk_population']=response['high_risk_population']+response['med_risk_population']+response['low_risk_population']

    #     # area at risk level
    #     temp = dict([(c['deeperthan'], c['areaatrisk']) for c in counts])
    #     response['high_risk_area']=round(temp.get('271 cm', 0)/1000000,1)
    #     response['med_risk_area']=round(temp.get('121 cm', 0)/1000000,1)
    #     response['low_risk_area']=round(temp.get('029 cm', 0)/1000000,1)    
    #     response['total_risk_area']=round(response['high_risk_area']+response['med_risk_area']+response['low_risk_area'],2) 

    #     counts =  self.getRiskNumber(targetRiskIncludeWater, filterLock, 'agg_simplified_description', 'fldarea_population', 'fldarea_sqm')

    #     # landcover/pop/atrisk
    #     temp = dict([(c['agg_simplified_description'], c['count']) for c in counts])
    #     response['built_up_pop_risk']=round(temp.get('Built-up', 0),0)
    #     response['irrigated_agricultural_land_pop_risk']=round(temp.get('Irrigated agricultural land', 0),0)

    #     temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
    #     response['built_up_area_risk']=round(temp.get('Built-up', 0)/1000000,1)
    #     response['irrigated_agricultural_land_area_risk']=round(temp.get('Irrigated agricultural land', 0)/1000000,1)

    #     # landcover all
    #     counts =  self.getRiskNumber(targetBase, filterLock, 'agg_simplified_description', 'area_population', 'area_sqm')
    #     temp = dict([(c['agg_simplified_description'], c['count']) for c in counts])
    #     response['built_up_pop']=round(temp.get('Built-up', 0),0)
    #     response['irrigated_agricultural_land_pop']=round(temp.get('Irrigated agricultural land', 0),0)

    #     temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
    #     response['built_up_area']=round(temp.get('Built-up', 0)/1000000,1)
    #     response['irrigated_agricultural_land_area']=round(temp.get('Irrigated agricultural land', 0)/1000000,1)

    #     countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
    #         select={
    #             'numbersettlementsatrisk': 'count(distinct vuid)'}, 
    #         where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*fldarea_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')
    #     response['settlements_at_risk'] = round(countsBase[0]['numbersettlementsatrisk'],0)

    #     countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
    #         select={
    #             'numbersettlements': 'count(distinct vuid)'}, 
    #         where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlements')
    #     response['settlements'] = round(countsBase[0]['numbersettlements'],0)

    #     countsBase = targetBase.extra(
    #         select={
    #             'countbase' : 'SUM(  \
    #                     case \
    #                         when ST_CoveredBy(wkb_geometry,'+filterLock+') then area_population \
    #                         else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_population end \
    #                 )'
    #         },
    #         where = {
    #             'ST_Intersects(wkb_geometry, '+filterLock+')'
    #         }).values('countbase')
    #     response['Population']=round(countsBase[0]['countbase'],0)

    #     countsBase = targetBase.extra(
    #         select={
    #             'areabase' : 'SUM(  \
    #                     case \
    #                         when ST_CoveredBy(wkb_geometry,'+filterLock+') then area_sqm \
    #                         else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_sqm end \
    #                 )'
    #         },
    #         where = {
    #             'ST_Intersects(wkb_geometry, '+filterLock+')'
    #         }).values('areabase')
    #     response['Area']=round(countsBase[0]['areabase']/1000000,0)

    #     response['percent_total_risk_population'] = round((response['total_risk_population']/response['Population'])*100,0)
    #     response['percent_high_risk_population'] = round((response['high_risk_population']/response['Population'])*100,0)
    #     response['percent_med_risk_population'] = round((response['med_risk_population']/response['Population'])*100,0)
    #     response['percent_low_risk_population'] = round((response['low_risk_population']/response['Population'])*100,0)

    #     response['percent_total_risk_area'] = round((response['total_risk_area']/response['Area'])*100,0)
    #     response['percent_high_risk_area'] = round((response['high_risk_area']/response['Area'])*100,0)
    #     response['percent_med_risk_area'] = round((response['med_risk_area']/response['Area'])*100,0)
    #     response['percent_low_risk_area'] = round((response['low_risk_area']/response['Area'])*100,0)

    #     response['percent_total_ava_population'] = round((response['total_ava_population']/response['Population'])*100,0)
    #     response['percent_high_ava_population'] = round((response['high_ava_population']/response['Population'])*100,0)
    #     response['percent_med_ava_population'] = round((response['med_ava_population']/response['Population'])*100,0)
    #     response['percent_low_ava_population'] = round((response['low_ava_population']/response['Population'])*100,0)

    #     response['percent_total_ava_area'] = round((response['total_ava_area']/response['Area'])*100,0)
    #     response['percent_high_ava_area'] = round((response['high_ava_area']/response['Area'])*100,0)
    #     response['percent_med_ava_area'] = round((response['med_ava_area']/response['Area'])*100,0)
    #     response['percent_low_ava_area'] = round((response['low_ava_area']/response['Area'])*100,0)

    #     response['precent_built_up_pop_risk'] = round((response['built_up_pop_risk']/response['built_up_pop'])*100,0)
    #     response['precent_built_up_area_risk'] = round((response['built_up_area_risk']/response['built_up_area'])*100,0)

    #     response['precent_irrigated_agricultural_land_pop_risk'] = round((response['irrigated_agricultural_land_pop_risk']/response['irrigated_agricultural_land_pop'])*100,0)
    #     response['precent_irrigated_agricultural_land_area_risk'] = round((response['irrigated_agricultural_land_area_risk']/response['irrigated_agricultural_land_area'])*100,0)

        # return response
 

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

        # print self
        # print request
        # print request.body

        response = self.getRisk(request)
        # print tt

        # Do any operation here and return in form of json in next line
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
        counts =  getRiskNumber(targetAvalanche.select_related("basinmembersava").exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='snowwater',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'avalanche_pop', 'sum_area_sqm', flag, code, 'afg_avsa.wkb_geometry')
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
        response['forest_area_risk']=round(temp.get('Forest and shrubs', 0),0)


        # River Flood Forecasted
        counts =  getRiskNumber(targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,int(DAY)-1)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop.wkb_geometry')
        temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])
        response['riverflood_forecast_verylow_pop']=round(temp.get(1, 0),0) 
        response['riverflood_forecast_low_pop']=round(temp.get(2, 0),0) 
        response['riverflood_forecast_med_pop']=round(temp.get(3, 0),0) 
        response['riverflood_forecast_high_pop']=round(temp.get(4, 0),0) 
        response['riverflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0) 
        response['riverflood_forecast_extreme_pop']=round(temp.get(6, 0),0) 
        response['total_riverflood_forecast_pop']=response['riverflood_forecast_verylow_pop'] + response['riverflood_forecast_low_pop'] + response['riverflood_forecast_med_pop'] + response['riverflood_forecast_high_pop'] + response['riverflood_forecast_veryhigh_pop'] + response['riverflood_forecast_extreme_pop']

        temp = dict([(c['basinmember__basins__riskstate'], c['areaatrisk']) for c in counts])
        response['riverflood_forecast_verylow_area']=round(temp.get(1, 0),0) 
        response['riverflood_forecast_low_area']=round(temp.get(2, 0),0) 
        response['riverflood_forecast_med_area']=round(temp.get(3, 0),0) 
        response['riverflood_forecast_high_area']=round(temp.get(4, 0),0) 
        response['riverflood_forecast_veryhigh_area']=round(temp.get(5, 0),0) 
        response['riverflood_forecast_extreme_area']=round(temp.get(6, 0),0) 
        response['total_riverflood_forecast_area']=response['riverflood_forecast_verylow_area'] + response['riverflood_forecast_low_area'] + response['riverflood_forecast_med_area'] + response['riverflood_forecast_high_area'] + response['riverflood_forecast_veryhigh_area'] + response['riverflood_forecast_extreme_area']

        # Flash Flood Forecasted
        # AfgFldzonea100KRiskLandcoverPop.objects.all().select_related("basinmembers").values_list("agg_simplified_description","basinmember__basins__riskstate")
        counts =  getRiskNumber(targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop.wkb_geometry')
        temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])

        response['flashflood_forecast_verylow_pop']=round(temp.get(1, 0),0) 
        response['flashflood_forecast_low_pop']=round(temp.get(2, 0),0) 
        response['flashflood_forecast_med_pop']=round(temp.get(3, 0),0) 
        response['flashflood_forecast_high_pop']=round(temp.get(4, 0),0) 
        response['flashflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0) 
        response['flashflood_forecast_extreme_pop']=round(temp.get(6, 0),0) 
        response['total_flashflood_forecast_pop']=response['flashflood_forecast_verylow_pop'] + response['flashflood_forecast_low_pop'] + response['flashflood_forecast_med_pop'] + response['flashflood_forecast_high_pop'] + response['flashflood_forecast_veryhigh_pop'] + response['flashflood_forecast_extreme_pop']

        temp = dict([(c['basinmember__basins__riskstate'], c['areaatrisk']) for c in counts])
        response['flashflood_forecast_verylow_area']=round(temp.get(1, 0),0) 
        response['flashflood_forecast_low_area']=round(temp.get(2, 0),0) 
        response['flashflood_forecast_med_area']=round(temp.get(3, 0),0) 
        response['flashflood_forecast_high_area']=round(temp.get(4, 0),0) 
        response['flashflood_forecast_veryhigh_area']=round(temp.get(5, 0),0) 
        response['flashflood_forecast_extreme_area']=round(temp.get(6, 0),0) 
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
        response['forest_area']=round(temp.get('Forest and shrubs', 0),0)

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
            countsBase = targetAvalanche.extra(
                select={
                    'numbersettlementsatava': 'count(distinct vuid)'}, 
                where = {"left(cast(dist_code as text), "+str(len(str(code)))+") = '"+str(code)+"'"}).values('numbersettlementsatava')
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
            countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
                select={
                    'numbersettlementsatrisk': 'count(distinct vuid)'}, 
                where = {"left(cast(dist_code as text), "+str(len(str(code)))+") = '"+str(code)+"'"}).values('numbersettlementsatrisk')
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
            countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
                select={
                    'numbersettlements': 'count(distinct vuid)'}, 
                where = {"left(cast(dist_code as text), "+str(len(str(code)))+") = '"+str(code)+"'"}).values('numbersettlements')
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
            countsBase = targetBase.extra(
                select={
                    'countbase' : 'SUM(area_population)'
                },
                where = {
                    "left(cast(dist_code as text), "+str(len(str(code)))+") = '"+str(code)+"'"
                }).values('countbase')
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
            countsBase = targetBase.extra(
                select={
                    'areabase' : 'SUM(area_sqm)'
                },
                where = {
                    "left(cast(dist_code as text), "+str(len(str(code)))+") = '"+str(code)+"'"
                }).values('areabase')

        else:
            countsBase = targetBase.extra(
                select={
                    'areabase' : 'SUM(area_sqm)'
                },
                where = {
                    'ST_Within(wkb_geometry, '+filterLock+')'
                }).values('areabase')

        response['Area']=round(countsBase[0]['areabase']/1000000,0)

        response['percent_total_risk_population'] = round((response['total_risk_population']/response['Population'])*100,0)
        response['percent_high_risk_population'] = round((response['high_risk_population']/response['Population'])*100,0)
        response['percent_med_risk_population'] = round((response['med_risk_population']/response['Population'])*100,0)
        response['percent_low_risk_population'] = round((response['low_risk_population']/response['Population'])*100,0)

        response['percent_total_risk_area'] = round((response['total_risk_area']/response['Area'])*100,0)
        response['percent_high_risk_area'] = round((response['high_risk_area']/response['Area'])*100,0)
        response['percent_med_risk_area'] = round((response['med_risk_area']/response['Area'])*100,0)
        response['percent_low_risk_area'] = round((response['low_risk_area']/response['Area'])*100,0)

        response['percent_total_ava_population'] = round((response['total_ava_population']/response['Population'])*100,0)
        response['percent_high_ava_population'] = round((response['high_ava_population']/response['Population'])*100,0)
        response['percent_med_ava_population'] = round((response['med_ava_population']/response['Population'])*100,0)
        response['percent_low_ava_population'] = round((response['low_ava_population']/response['Population'])*100,0)

        response['percent_total_ava_area'] = round((response['total_ava_area']/response['Area'])*100,0)
        response['percent_high_ava_area'] = round((response['high_ava_area']/response['Area'])*100,0)
        response['percent_med_ava_area'] = round((response['med_ava_area']/response['Area'])*100,0)
        response['percent_low_ava_area'] = round((response['low_ava_area']/response['Area'])*100,0)

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
   
def getRiskNumber(data, filterLock, fieldGroup, popField, areaField, aflag, acode, aGeomField):
    if aGeomField == None:
        geometryField = 'wkb_geometry'
    else:
        geometryField = aGeomField    

    if aflag=='drawArea':
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM(  \
                        case \
                            when ST_CoveredBy('+geometryField+','+filterLock+') then '+popField+' \
                            else st_area(st_intersection('+geometryField+','+filterLock+')) / st_area('+geometryField+')*'+popField+' end \
                    )',
                'areaatrisk' : 'SUM(  \
                        case \
                            when ST_CoveredBy('+geometryField+','+filterLock+') then '+areaField+' \
                            else st_area(st_intersection('+geometryField+','+filterLock+')) / st_area('+geometryField+')*'+areaField+' end \
                    )'
            },
            where = {
                'ST_Intersects('+geometryField+', '+filterLock+')'
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
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM('+popField+')',
                'areaatrisk' : 'SUM('+areaField+')'
            },
            where = {
                "left(cast(dist_code as text), "+str(len(str(acode)))+") = '"+str(acode)+"'"
            }).values(fieldGroup,'count','areaatrisk'))        
    else:
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM('+popField+')',
                'areaatrisk' : 'SUM('+areaField+')'
            },
            where = {
                'ST_Within('+geometryField+', '+filterLock+')'
            }).values(fieldGroup,'count','areaatrisk')) 
    return counts     

class getProvince(ModelResource):
    """Provinces api"""
    class Meta:
        queryset = AfgAdmbndaAdm1.objects.all().defer('wkb_geometry')
        resource_name = 'getprovince'
        allowed_methods = ('get')
        filtering = { "id" : ALL }
    