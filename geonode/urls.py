#########################################################################
#
# Copyright (C) 2012 OpenPlans
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.
#
#########################################################################

from django.conf.urls import include, patterns, url
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static
from geonode.sitemap import LayerSitemap, MapSitemap
from django.views.generic import TemplateView
from django.contrib import admin

import geonode.proxy.urls

from geonode.api.urls import api
from geodb.urls import geoapi

import autocomplete_light
import dashboard
import securitydb

# Setup Django Admin
autocomplete_light.autodiscover()

admin.autodiscover()

js_info_dict = {
    'domain': 'djangojs',
    'packages': ('geonode',)
}

sitemaps = {
    "layer": LayerSitemap,
    "map": MapSitemap
}

v2urlpatterns = patterns('',
                       # ubah
                       url(r'^/?$', TemplateView.as_view(template_name='v2/index.html'), name='home'),
                       url(r'^help/$', TemplateView.as_view(template_name='v2/help.html'), name='help'),
                       url(r'^developer/$', TemplateView.as_view(template_name='v2/developer.html'), name='developer'),
                       url(r'^about/$', TemplateView.as_view(template_name='v2/about.html'), name='about'),
                       url(r'^disclaimer/$', TemplateView.as_view(template_name='v2/disclaimer.html'), name='disclaimer'),
                       url(r'^partners/$', TemplateView.as_view(template_name='v2/partners.html'), name='partners'),
                       url(r'^video/$', TemplateView.as_view(template_name='v2/video.html'), name='video'),
                       url(r'^training/$', TemplateView.as_view(template_name='v2/training.html'), name='training'),
                       url(r'^documentation/$', TemplateView.as_view(template_name='v2/doc.html'), name='documentation'),
                       url(r'^layers/$', TemplateView.as_view(template_name='v2/layer_list.html'), name='layer_browse'),
                       url(r'^maps/$', TemplateView.as_view(template_name='v2/map_list.html'), name='map_browse'),
                       url(r'^documents/$', TemplateView.as_view(template_name='v2/document_list.html'), name='document_browse'),
                       # /ubah
                       # ubah
                       (r'^layers/', include('geonode.layers.urls')),
                       # /ubah
                       # ubah
                       (r'^maps/', include('geonode.maps.urls')),
                       # (r'^maps/$', TemplateView.as_view(template_name='v2/map_list.html'), name='v2_maps_browse'),
                       # /ubah
                       # ubah
                       (r"^account/", include("account.urls")),
                       (r'^people/', include('geonode.people.urls')),
                       # /ubah
                       # ubah
                       (r'^documents/', include('geonode.documents.urls')),
                       # (r'^documents/$', TemplateView.as_view(template_name='v2/document_list.html'), name='document_browse'),
                       # /ubah
                       # ubah
                       (r'^/', include('dashboard.urls')),
                       (r'^dashboard/', include('dashboard.urls')),
                       url(r'', include(geoapi.urls)),
                       (r'^getOverviewMaps/', include('geodb.custom_urls')),
                       (r'^people/', include('geonode.people.urls')),
                       # /ubah
                       )

urlpatterns = patterns('',

                       # Static pages
                       url(r'^/?$', TemplateView.as_view(template_name='index.html'), name='home'),
                       url(r'^help/$', TemplateView.as_view(template_name='help.html'), name='help'),
                       url(r'^developer/$', TemplateView.as_view(template_name='developer.html'), name='developer'),
                       url(r'^about/$', TemplateView.as_view(template_name='about.html'), name='about'),
                       url(r'^disclaimer/$', TemplateView.as_view(template_name='disclaimer.html'), name='disclaimer'),
                       url(r'^partners/$', TemplateView.as_view(template_name='partners.html'), name='partners'),
                       url(r'^video/$', TemplateView.as_view(template_name='video.html'), name='video'),
                       url(r'^training/$', TemplateView.as_view(template_name='training.html'), name='training'),
                       url(r'^documentation/$', TemplateView.as_view(template_name='documentation.html'), name='documentation'),
                       # ubah
                    #    url(r'^v2/?$', TemplateView.as_view(template_name='v2/index.html'), name='home'),
                    #    url(r'^v2/help/$', TemplateView.as_view(template_name='v2/help.html'), name='help'),
                    #    url(r'^v2/developer/$', TemplateView.as_view(template_name='v2/developer.html'), name='developer'),
                    #    url(r'^v2/about/$', TemplateView.as_view(template_name='v2/about.html'), name='about'),
                    #    url(r'^v2/disclaimer/$', TemplateView.as_view(template_name='v2/disclaimer.html'), name='disclaimer'),
                    #    url(r'^v2/partners/$', TemplateView.as_view(template_name='v2/partners.html'), name='partners'),
                    #    url(r'^v2/video/$', TemplateView.as_view(template_name='v2/video.html'), name='video'),
                    #    url(r'^v2/training/$', TemplateView.as_view(template_name='v2/training.html'), name='training'),
                    #    url(r'^v2/documentation/$', TemplateView.as_view(template_name='v2/doc.html'), name='documentation'),
                       # /ubah


                       # Layer views
                       (r'^layers/', include('geonode.layers.urls')),
                       # ubah
                    #    (r'^v2/layers/', include('geonode.layers.urls')),
                       # /ubah


                       # Map views
                       (r'^maps/', include('geonode.maps.urls')),
                       # ubah
                    #    (r'^v2/maps/', include('geonode.maps.urls')),
                    #    # (r'^v2/maps/$', TemplateView.as_view(template_name='v2/map_list.html'), name='v2_maps_browse'),
                       # /ubah


                       # Catalogue views
                       (r'^catalogue/', include('geonode.catalogue.urls')),

                       # Search views
                       url(r'^search/$', TemplateView.as_view(template_name='search/search.html'), name='search'),

                       # Social views
                       (r"^account/", include("account.urls")),
                       (r'^people/', include('geonode.people.urls')),
                       # ubah
                    #    (r"^v2/account/", include("account.urls")),
                    #    (r'^v2/people/', include('geonode.people.urls')),
                       # /ubah
                       (r'^avatar/', include('avatar.urls')),
                       (r'^comments/', include('dialogos.urls')),
                       (r'^ratings/', include('agon_ratings.urls')),
                       (r'^activity/', include('actstream.urls')),
                       (r'^announcements/', include('announcements.urls')),
                       (r'^messages/', include('user_messages.urls')),
                       (r'^social/', include('geonode.social.urls')),
                       (r'^security/', include('geonode.security.urls')),

                       # Users statistics
                       url(r'^userstatistics$', 'userstatistics.views.userstatistics', name='userstatistics'),

                       # Accounts
                       url(r'^account/ajax_login$', 'geonode.views.ajax_login', name='account_ajax_login'),
                       url(r'^account/ajax_lookup$', 'geonode.views.ajax_lookup', name='account_ajax_lookup'),

                       # Meta
                       url(r'^lang\.js$', TemplateView.as_view(template_name='lang.js', content_type='text/javascript'),
                           name='lang'),

                       url(r'^jsi18n/$', 'django.views.i18n.javascript_catalog', js_info_dict, name='jscat'),
                       url(r'^sitemap\.xml$', 'django.contrib.sitemaps.views.sitemap', {'sitemaps': sitemaps},
                           name='sitemap'),

                       (r'^i18n/', include('django.conf.urls.i18n')),
                       (r'^autocomplete/', include('autocomplete_light.urls')),
                       (r'^admin/', include(admin.site.urls)),
                       (r'^groups/', include('geonode.groups.urls')),
                       (r'^documents/', include('geonode.documents.urls')),
                       # ubah
                    #    (r'^v2/documents/', include('geonode.documents.urls')),
                    #    # (r'^v2/documents/$', TemplateView.as_view(template_name='v2/document_list.html'), name='document_browse'),
                       # /ubah

                       (r'^services/', include('geonode.services.urls')),
                       url(r'', include(api.urls)),
                       url(r'', include(geoapi.urls)),
                       (r'^getOverviewMaps/', include('geodb.custom_urls')),
                       (r'^dashboard/', include('dashboard.urls')),
                       # ubah
                    #    (r'^v2/', include('dashboard.urls')),
                    #    (r'^v2/dashboard/', include('dashboard.urls')),
                       # /ubah

                       (r'^securitydb/', include('securitydb.urls')),

                       # v2 will overwrite named url with the same name
                       (r'^v2/', include(v2urlpatterns, namespace='v2')),
                       )

# if 'v2' in request.path:
# if True:
#     urlpatterns += patterns('',
#                        # ubah
#                        url(r'^v2/?$', TemplateView.as_view(template_name='v2/index.html'), name='home'),
#                        url(r'^v2/help/$', TemplateView.as_view(template_name='v2/help.html'), name='help'),
#                        url(r'^v2/developer/$', TemplateView.as_view(template_name='v2/developer.html'), name='developer'),
#                        url(r'^v2/about/$', TemplateView.as_view(template_name='v2/about.html'), name='about'),
#                        url(r'^v2/disclaimer/$', TemplateView.as_view(template_name='v2/disclaimer.html'), name='disclaimer'),
#                        url(r'^v2/partners/$', TemplateView.as_view(template_name='v2/partners.html'), name='partners'),
#                        url(r'^v2/video/$', TemplateView.as_view(template_name='v2/video.html'), name='video'),
#                        url(r'^v2/training/$', TemplateView.as_view(template_name='v2/training.html'), name='training'),
#                        url(r'^v2/documentation/$', TemplateView.as_view(template_name='v2/doc.html'), name='documentation'),
#                        # /ubah
#                        # ubah
#                        (r'^v2/layers/', include('geonode.layers.urls')),
#                        # /ubah
#                        # ubah
#                        (r'^v2/maps/', include('geonode.maps.urls')),
#                        # (r'^v2/maps/$', TemplateView.as_view(template_name='v2/map_list.html'), name='v2_maps_browse'),
#                        # /ubah
#                        # ubah
#                        (r"^v2/account/", include("account.urls")),
#                        (r'^v2/people/', include('geonode.people.urls')),
#                        # /ubah
#                        # ubah
#                        (r'^v2/documents/', include('geonode.documents.urls')),
#                        # (r'^v2/documents/$', TemplateView.as_view(template_name='v2/document_list.html'), name='document_browse'),
#                        # /ubah
#                        # ubah
#                        (r'^v2/', include('dashboard.urls')),
#                        (r'^v2/dashboard/', include('dashboard.urls')),
#                        # /ubah
#                             )

if "geonode.contrib.dynamic" in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
                            (r'^dynamic/', include('geonode.contrib.dynamic.urls')),
                            )

if 'geonode.geoserver' in settings.INSTALLED_APPS:
    # GeoServer Helper Views
    urlpatterns += patterns('',
                            # Upload views
                            (r'^upload/', include('geonode.upload.urls')),
                            (r'^gs/', include('geonode.geoserver.urls')),
                            )

if 'notification' in settings.INSTALLED_APPS:
    urlpatterns += patterns('',
                            (r'^notifications/', include('notification.urls')),
                            )

# Set up proxy
urlpatterns += geonode.proxy.urls.urlpatterns

# Serve static files
urlpatterns += staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
handler403 = 'geonode.views.err403'

# Featured Maps Pattens
urlpatterns += patterns('',
                        (r'^featured/(?P<site>[A-Za-z0-9_\-]+)/$', 'geonode.maps.views.featured_map'),
                        (r'^featured/(?P<site>[A-Za-z0-9_\-]+)/info$', 'geonode.maps.views.featured_map_info'),
                        )
