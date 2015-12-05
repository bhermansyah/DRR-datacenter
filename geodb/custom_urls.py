from django.conf.urls import patterns, url

urlpatterns = patterns(
    'geodb.views',
    url(r'^$', 'exportdata', name='exportdata'),
)