from . import views
from django.conf.urls import include, patterns, url

urlpatterns = patterns(
    'dashboard.views',
    url(r'^$', 'dashboard_detail', name='dashboard_detail'),
    url(r'^print$', 'dashboard_print', name='dashboard_print'),
    url(r'^multiple$', 'dashboard_multiple', name='dashboard_multiple'),
    url(r'^getprovinces$', 'get_provinces', name='get_provinces'),
    url(r'^classmarker$', 'classmarkerRedirect', name='classmarkerRedirect'),
    url(r'^classmarker_insert$', 'classmarkerInsert', name='classmarkerInsert'),
    url(r'^downloadPDFFile$', 'downloadPDFFile', name='downloadPDFFile'),
    
)