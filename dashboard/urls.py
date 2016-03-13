from . import views
from django.conf.urls import include, patterns, url

urlpatterns = patterns(
    'dashboard.views',
    url(r'^$', 'dashboard_detail', name='dashboard_detail'),
)