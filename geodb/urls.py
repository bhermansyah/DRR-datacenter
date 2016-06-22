from tastypie.api import Api
from .geoapi import FloodRiskStatisticResource, getProvince, EarthQuakeStatisticResource, getEQEvents, getAccessibilities, getSAMParameters, getIncidentsRaw

geoapi = Api(api_name='geoapi')

geoapi.register(FloodRiskStatisticResource())
geoapi.register(getProvince())
geoapi.register(EarthQuakeStatisticResource())
geoapi.register(getEQEvents())
geoapi.register(getAccessibilities())
geoapi.register(getSAMParameters())
geoapi.register(getIncidentsRaw())
