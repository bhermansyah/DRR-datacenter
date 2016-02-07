from tastypie.api import Api
from .geoapi import FloodRiskStatisticResource, getProvince

geoapi = Api(api_name='geoapi')

geoapi.register(FloodRiskStatisticResource())
geoapi.register(getProvince())

