from django.shortcuts import render
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext, loader
from geodb.geo_calc import getBaseline, getFloodForecast, getFloodRisk, getAvalancheRisk, getAvalancheForecast, getAccessibility

# Create your views here.
def dashboard_detail(request):
	# print request.GET['page']
	response = {}
	code = None
	flag = 'entireAfg'
	if 'code' in request.GET:
		code = int(request.GET['code'])
		flag = 'currentProvince'

	if request.GET['page'] == 'baseline':
		response = getBaseline(None, flag, code)
	elif request.GET['page'] == 'floodforecast':
		response = getFloodForecast(None, flag, code)
	elif request.GET['page'] == 'floodrisk':
		response = getFloodRisk(None, flag, code)	
	elif request.GET['page'] == 'avalancherisk':
		response = getAvalancheRisk(None, flag, code)
	elif request.GET['page'] == 'avalcheforecast':
		response = getAvalancheForecast(None, flag, code)	
	elif request.GET['page'] == 'accessibility':
		response = getAccessibility(None, flag, code)		

	if 'code' in request.GET:
		response['add_link'] = '&code='+str(code)

	return render_to_response(
            "dashboard_base.html",
            RequestContext(request, response))