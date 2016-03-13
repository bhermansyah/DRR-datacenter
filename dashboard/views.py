from django.shortcuts import render
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext, loader

# Create your views here.
def dashboard_detail(request):
	return render_to_response(
            "dashboard_base.html",
            RequestContext(request))