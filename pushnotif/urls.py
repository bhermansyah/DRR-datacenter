from django.conf.urls import patterns, url, include
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView
from django.conf import settings
from django.views.static import serve
from django.conf.urls.static import static

# from .views import triggercheck, getdashboardpage, showtemplate, adminapproval, sendstatus, pushnotif_settings, pushnotif_savesettings, pushnotif_report, pushnotif_report_subscriptions, loadjson, loadcsv, hello

import os

document_root = os.path.join(settings.PROJECT_ROOT,'..', "pushnotif")+'/'

urlpatterns = patterns(
    'pushnotif.views',
    url(r'^triggercheck/', 'triggercheck', name='triggercheck'),
    url(r'^settings/', 'pushnotif_settings', name='pushnotif_settings'),
    url(r'^report/notifications/', 'pushnotif_report', name='pushnotif_report'),
    url(r'^report/subscriptions/$', 'pushnotif_report_subscriptions', name='pushnotif_report_subscriptions'),
    url(r'^savesettings/', 'pushnotif_savesettings', name='pushnotif_savesettings'),
    url(r'^getdashboardpage/', 'getdashboardpage', name='getdashboardpage'),
    url(r'^showtemplate/', 'showtemplate', name='showtemplate'),
    url(r'^adminapproval/(?P<emailid>[-\w]+)/(?P<action>approve|cancel)', 'adminapproval', name='adminapproval'),
    url(r'^sendstatus/(?P<emailid>[-\w]+)/$', 'sendstatus', name='sendstatus'),
    # url(r'^(?P<json_file>[\w]+).json$', loadjson, name='loadjson'),
    # url(r'^(?P<csv_file>[\w]+).csv$', loadcsv, name='loadcsv'),
    # url(r'^pushnotif.log$', serve, {'document_root': document_root,}),
    # url(r'^tmp/(?P<path>.*)$', serve, {'document_root': document_root+'tmp/',}),
    # url(r'pushnotif.log^$', TemplateView.as_view(template_name='pushnotif.log'), name="pushnotif.log"),
    )

# pdf, html and other temp files
urlpatterns += static('tmp/', document_root=document_root+'tmp/')
# urlpatterns += static(r'^(?P<log_file>[\w]+).log$', document_root=document_root)

# special static files for monitoring
urlpatterns += patterns(
    'django.contrib.staticfiles.views',
    # url(r'^(?:pushnotif.log)?$', 'serve', kwargs={'path': 'pushnotif.log', 'document_root':document_root}),
    # url(r'^(?P<path>(?:js|css|img)/.*)$', 'serve'),
    # url(r'^(?P<path>.*)$', serve, {'document_root': document_root}),
    url('pushnotif.log', serve, {'path':'pushnotif.log', 'document_root': document_root}),
    url('emaillist.json', serve, {'path':'emaillist.json', 'document_root': document_root}),
    url('usersettings.csv', serve, {'path':'usersettings.csv', 'document_root': document_root}),
    url('subscriptions.csv', serve, {'path':'subscriptions.csv', 'document_root': document_root}),
    url('logging.conf', serve, {'path':'logging.conf', 'document_root': document_root}),
)
