from tastypie.api import Api
from .geoapi import FloodRiskStatisticResource, getProvince, EarthQuakeStatisticResource, getEQEvents, getAccessibilities, getSAMParameters, getIncidentsRaw, getVillages, getLastUpdatedStatus, getLandslide

geoapi = Api(api_name='geoapi')

geoapi.register(FloodRiskStatisticResource())
geoapi.register(getProvince())
geoapi.register(EarthQuakeStatisticResource())
geoapi.register(getEQEvents())
geoapi.register(getAccessibilities())
geoapi.register(getSAMParameters())
geoapi.register(getIncidentsRaw())
geoapi.register(getVillages())
geoapi.register(getLastUpdatedStatus())
geoapi.register(getLandslide())

