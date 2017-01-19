from django.conf.urls import patterns, url

from django.contrib.gis.geos import GEOSGeometry
from django.contrib.auth import views as auth_views
from .views import scresysls
from .views import scresysed
from .views import get_districts

urlpatterns = [
    # ex: /asdcscre/
    url(r'^$', scresysed, name='security_home'),
    url(r'^list/$', scresysls, name='security_list'),
    url(r'^(?P<prov_id>[0-9]+)/get_districts/$', get_districts, name='get_districts'),
    url(r'^(?P<criteria_id>[0-9]+)/scref/$', scresysed, name='scref'),
]
