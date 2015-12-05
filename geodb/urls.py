from tastypie.api import Api
from .geoapi import FloodRiskStatisticResource, LandCoverFloodRiskStatisticResource, LandCoverBaseStatisticResource

geoapi = Api(api_name='geoapi')

geoapi.register(FloodRiskStatisticResource())
geoapi.register(LandCoverFloodRiskStatisticResource())
geoapi.register(LandCoverBaseStatisticResource())

