from django.conf.urls import patterns, url

urlpatterns = patterns(
    'geodb.views',
    # url(r'^$', 'exportdata', name='exportdata'),
    url(r'^$', 'getOverviewMaps', name='getOverviewMaps'),
    url(r'^generalinfo$', 'getGeneralInfoVillages', name='getGeneralInfoVillages'),
    url(r'^snowinfo$', 'getSnowVillage', name='getSnowVillage'),
    url(r'^accessibilityinfo$', 'getAccesibilityInfoVillages', name='getAccesibilityInfoVillages'),
    url(r'^floodinfo$', 'getFloodInfoVillages', name='getFloodInfoVillages'),
)