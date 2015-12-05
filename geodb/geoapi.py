from geodb.models import AfgFldzonea100KRiskLandcoverPop, FloodRiskExposure, AfgLndcrva, LandcoverDescription 
import json
import time
from tastypie.resources import ModelResource, Resource
from tastypie.serializers import Serializer
from tastypie import fields
from tastypie.constants import ALL
from django.db.models import Count, Sum
from django.core.serializers.json import DjangoJSONEncoder

FILTER_TYPES = {
    'flood': AfgFldzonea100KRiskLandcoverPop
}

class CountJSONSerializer(Serializer):
    """Custom serializer to post process the api and add counts  """

    def get_resources_counts(self, options):
        """Target table"""
        result = []
        resources = AfgFldzonea100KRiskLandcoverPop.objects.all()
        
        if options['district_filter']:
            resources = resources.filter(dist_code__icontains=options['district_filter'])

        counts = list(resources.values(options['count_type']).annotate(count=Sum('fldarea_population'),areaatrisk=Sum('fldarea_sqm'),numbersettlementsatrisk=Count('vuid', distinct=True)))
               
        result.append(dict([(c[options['count_type']], c['count']) for c in counts]))
        result.append(dict([(c[options['count_type']], c['areaatrisk']) for c in counts]))
        result.append(dict([(c[options['count_type']], c['numbersettlementsatrisk']) for c in counts]))
        return result

    def get_resourcesbase_counts(self, options):
        """base table"""
        result = []
        resourcesBase = AfgLndcrva.objects.all()
        
        if options['district_filter']:
            resourcesBase = resourcesBase.filter(dist_code__icontains=options['district_filter'])

        # counts = list(resources.values(options['count_type']).annotate(count=Sum('fldarea_population'),areaatrisk=Sum('fldarea_sqm'),numbersettlementsatrisk=Count('vuid', distinct=True)))
        countsBase = list(resourcesBase.values(options['count_type']).annotate(countbase=Sum('area_population'),areaatriskbase=Sum('area_sqm'),numbersettlements=Count('vuid', distinct=True)))
        print countsBase
        # print countsBase
        # result.append(dict([(c[options['count_type']], c['count']) for c in counts]))
        # result.append(dict([(c[options['count_type']], c['areaatrisk']) for c in counts]))
        # if options['count_type']=='agg_simplified_description':
        #     countsBase = resourcesBase.values(options['count_type']).annotate(countbase=Sum('area_population'),areaatriskbase=Sum('area_sqm'),numbersettlements=Count('vuid', distinct=True))
        #     # print countsBase
        #     result.append(countsBase)
        # else:    
        #     countsBase = resourcesBase.aggregate(countbase=Sum('area_population'),areaatriskbase=Sum('area_sqm'),numbersettlements=Count('vuid', distinct=True))
        #     result.append(countsBase)
        # result.append(dict([(c[options['count_type']], c['numbersettlementsatrisk']) for c in counts]))
        return result    

    def to_json(self, data, options=None):
        options = options or {}
        data = self.to_simple(data, options)
        if options['resource_name'] == 'landcoverbase':
            counts = self.get_resourcesbase_counts(options)
        else:
            counts = self.get_resources_counts(options)
        
        # data['numbersettlementsatrisktotal']=0
        if 'objects' in data:
            for item in data['objects']:
                # print item
                item['popatrisk'] = counts[0].get(item['code'], 0)
                item['areaatrisk'] = counts[1].get(item['code'], 0)
                # item['countpercent']=(counts[0].get(item['code'], 0)/counts[2]['countbase'])*100
                # item['areaatriskpercent']=(counts[1].get(item['code'], 0)/counts[2]['areaatriskbase'])*100
                item['numbersettlementsatrisk'] = counts[2].get(item['code'], 0)
                # data['numbersettlementsatrisktotal'] = data['numbersettlementsatrisktotal'] + counts[3].get(item['code'], 0)

        # data['countbasese'] = counts[2]['countbase']
        # data['areaatriskbase'] = counts[2]['areaatriskbase']
        # data['numbersettlements'] = counts[2]['numbersettlements']
        data['requested_time'] = time.time()    
        
        return json.dumps(data, cls=DjangoJSONEncoder, sort_keys=True)    

class TypeFilteredResource(ModelResource):

    count = fields.IntegerField()
    areaatrisk = fields.IntegerField()

    def build_filters(self, filters={}):
        self.district_filter = None

        orm_filters = super(TypeFilteredResource, self).build_filters(filters)   

        
        if 'dist_code__icontains' in filters:
            self.district_filter = filters['dist_code__icontains']


        return orm_filters

    def serialize(self, request, data, format, options={}):
        options['district_filter'] = self.district_filter
        return super(TypeFilteredResource, self).serialize(request, data, format, options)


class FloodRiskStatisticResource(TypeFilteredResource):
    """Flood api"""

    def serialize(self, request, data, format, options={}):
        options['count_type'] = 'deeperthan'
        options['resource_name'] = 'floodrisk'
        return super(FloodRiskStatisticResource, self).serialize(request, data, format, options)

    class Meta:
        queryset = FloodRiskExposure.objects.all()
        resource_name = 'floodrisk'
        allowed_methods = ['get']
        serializer = CountJSONSerializer()

class LandCoverFloodRiskStatisticResource(TypeFilteredResource):
    """Flood api"""

    def serialize(self, request, data, format, options={}):
        options['count_type'] = 'agg_simplified_description'
        options['resource_name'] = 'landcoveratrisk'
        return super(LandCoverFloodRiskStatisticResource, self).serialize(request, data, format, options)

    class Meta:
        queryset = LandcoverDescription.objects.all()
        resource_name = 'landcoveratrisk'
        allowed_methods = ['get']
        serializer = CountJSONSerializer()

class LandCoverBaseStatisticResource(TypeFilteredResource):
    """Flood api"""

    def serialize(self, request, data, format, options={}):
        options['count_type'] = 'agg_simplified_description'
        options['resource_name'] = 'landcoverbase'
        return super(LandCoverBaseStatisticResource, self).serialize(request, data, format, options)

    class Meta:
        queryset = LandcoverDescription.objects.all()
        resource_name = 'landcoverbase'
        allowed_methods = ['get']
        serializer = CountJSONSerializer()        
