from . import views
from django.conf.urls import include, patterns, url

urlpatterns = patterns("covid19.views",
    url(r'^$', views.Covid19.as_view(), name="covid_detail"),
)
