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

from django.conf.urls import patterns, url, include
from django.contrib.auth.decorators import login_required
from django.views.generic import TemplateView

urlpatterns = patterns('',
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
                       # /ubah
                       )
