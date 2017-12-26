from django.conf.urls import patterns, url

from django.contrib.gis.geos import GEOSGeometry
from django.contrib.auth import views as auth_views
from .views import scresysls, scresysed, get_districts, get_settlements, get_settlements2, geoadm_from_lonlat, toggle_approve, permanentremove

urlpatterns = [
    # ex: /asdcscre/
    url(r'^$', scresysed, name='security_home'),
    url(r'^list/$', scresysls, name='security_list'),
    url(r'^(?P<chosen_prov_code>[0-9]+)/get_districts/$', get_districts, name='get_districts'),
    url(r'^(?P<chosen_dist_code>[0-9]+)/get_settlements2/$', get_settlements2, name='get_settlements2'),
    url(r'^(?P<chosen_dist_code>[0-9]+)/get_settlements/$', get_settlements, name='get_settlements'),
    url(r'^geoadm_from_lonlat/', geoadm_from_lonlat, name='geoadm_from_lonlat'),
    url(r'^(?P<criteria_id>[0-9]+)/scref/$', scresysed, name='scref'),
    url(r'^(?P<record_id>[0-9]+)/toggle_approve/$', toggle_approve, name='toggle_approve'),
    url(r'^(?P<record_id>[0-9]+)/permanentremove/$', permanentremove, name='permanentremove'),
]
