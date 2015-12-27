from tastypie.api import Api
from .geoapi import FloodRiskStatisticResource

geoapi = Api(api_name='geoapi')

geoapi.register(FloodRiskStatisticResource())

