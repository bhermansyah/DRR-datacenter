from django.conf import settings
from django.conf.urls import patterns, url, include
from django.views.static import serve
from geonode.documents.views import uploadpdf
from tastypie.api import Api
import os

document_root = os.path.join(settings.PROJECT_ROOT, "documents")+'/'

api = Api(api_name='api')
api.register(uploadpdf())

urlpatterns = patterns(
    '',
    url(r'', include(api.urls))
)

# special static files for monitoring
urlpatterns += patterns(
    'django.contrib.staticfiles.views',
    url('^documents/uploadpdflog.txt', serve, {'path':'uploadpdflog.txt', 'document_root': document_root}),
    url('^documents/uploadedlist.csv', serve, {'path':'uploadedlist.csv', 'document_root': document_root}),
)
