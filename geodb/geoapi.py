from geodb.models import AfgFldzonea100KRiskLandcoverPop, FloodRiskExposure, AfgLndcrva, LandcoverDescription, AfgAvsa 
import json
import time
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

    def getRiskNumber(self, data, filterLock, fieldGroup, popField, areaField):
        counts = list(data.values(fieldGroup).annotate(counter=Count('ogc_fid')).extra(
            select={
                'count' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,'+filterLock+') then '+popField+' \
                            else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*'+popField+' end \
                    )',
                # 'areaatrisk': 'SUM(st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_sqm)'
                'areaatrisk' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,'+filterLock+') then '+areaField+' \
                            else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*'+areaField+' end \
                    )'
            },
            where = {
                'ST_Intersects(wkb_geometry, '+filterLock+')'
            }).values(fieldGroup,'count','areaatrisk')) 
        return counts    

    def getRiskExecute(self, filterLock):
        targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
        targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and marshland')
        targetBase = AfgLndcrva.objects.all()
        targetAvalanche = AfgAvsa.objects.all()
        response = {}

        #Avalanche Risk
        counts =  self.getRiskNumber(targetAvalanche, filterLock, 'avalanche_cat', 'avalanche_pop', 'sum_area_sqm')
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
        counts =  self.getRiskNumber(targetRisk, filterLock, 'deeperthan', 'fldarea_population', 'fldarea_sqm')
        
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

        counts =  self.getRiskNumber(targetRiskIncludeWater, filterLock, 'agg_simplified_description', 'fldarea_population', 'fldarea_sqm')

        # landcover/pop/atrisk
        temp = dict([(c['agg_simplified_description'], c['count']) for c in counts])
        response['built_up_pop_risk']=round(temp.get('Built-up', 0),0)
        response['irrigated_agricultural_land_pop_risk']=round(temp.get('Irrigated agricultural land', 0),0)

        temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
        response['built_up_area_risk']=round(temp.get('Built-up', 0)/1000000,1)
        response['irrigated_agricultural_land_area_risk']=round(temp.get('Irrigated agricultural land', 0)/1000000,1)

        # landcover all
        counts =  self.getRiskNumber(targetBase, filterLock, 'agg_simplified_description', 'area_population', 'area_sqm')
        temp = dict([(c['agg_simplified_description'], c['count']) for c in counts])
        response['built_up_pop']=round(temp.get('Built-up', 0),0)
        response['irrigated_agricultural_land_pop']=round(temp.get('Irrigated agricultural land', 0),0)

        temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
        response['built_up_area']=round(temp.get('Built-up', 0)/1000000,1)
        response['irrigated_agricultural_land_area']=round(temp.get('Irrigated agricultural land', 0)/1000000,1)

        countsBase = targetRisk.filter(agg_simplified_description='Built-up').extra(
            select={
                'numbersettlementsatrisk': 'count(distinct vuid)'}, 
            where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*fldarea_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')
        response['settlements_at_risk'] = round(countsBase[0]['numbersettlementsatrisk'],0)

        countsBase = targetBase.exclude(agg_simplified_description='Water body and marshland').extra(
            select={
                'numbersettlements': 'count(distinct vuid)'}, 
            where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlements')
        response['settlements'] = round(countsBase[0]['numbersettlements'],0)

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
        response['Population']=round(countsBase[0]['countbase'],0)

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

        response['precent_built_up_pop_risk'] = round((response['built_up_pop_risk']/response['built_up_pop'])*100,0)
        response['precent_built_up_area_risk'] = round((response['built_up_area_risk']/response['built_up_area'])*100,0)

        response['precent_irrigated_agricultural_land_pop_risk'] = round((response['irrigated_agricultural_land_pop_risk']/response['irrigated_agricultural_land_pop'])*100,0)
        response['precent_irrigated_agricultural_land_area_risk'] = round((response['irrigated_agricultural_land_area_risk']/response['irrigated_agricultural_land_area'])*100,0)

        return response
 

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
        response = self.getRiskExecute(filterLock)

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
   
