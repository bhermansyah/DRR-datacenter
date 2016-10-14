from . import views
from django.conf.urls import include, patterns, url

urlpatterns = patterns(
    'dashboard.views',
    url(r'^$', 'dashboard_detail', name='dashboard_detail'),
    url(r'^print$', 'dashboard_print', name='dashboard_print'),
    url(r'^getprovinces$', 'get_provinces', name='get_provinces'),
)