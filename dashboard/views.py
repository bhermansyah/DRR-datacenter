from django.shortcuts import render
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext, loader
from geodb.geo_calc import getBaseline, getFloodForecast, getFloodRisk, getAvalancheRisk, getAvalancheForecast, getAccessibility, getEarthquake, getSecurity
from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2
from django.shortcuts import HttpResponse
import json

# Create your views here.
def dashboard_detail(request):
	# print request.GET['page']
	response = {}
	code = None
	flag = 'entireAfg'

	if 'page' not in request.GET:
		mutable = request.GET._mutable
		request.GET._mutable = True
		request.GET['page'] = 'baseline'
		request.GET._mutable = mutable

	if 'code' in request.GET:
		code = int(request.GET['code'])
		flag = 'currentProvince'

	if request.GET['page'] == 'baseline':
		response = getBaseline(request, None, flag, code)
	elif request.GET['page'] == 'floodforecast':
		response = getFloodForecast(request, None, flag, code)
	elif request.GET['page'] == 'floodrisk':
		response = getFloodRisk(request, None, flag, code)	
	elif request.GET['page'] == 'avalancherisk':
		response = getAvalancheRisk(request, None, flag, code)
	elif request.GET['page'] == 'avalcheforecast':
		response = getAvalancheForecast(request, None, flag, code)	
	elif request.GET['page'] == 'accessibility':
		response = getAccessibility(request, None, flag, code)	
	elif request.GET['page'] == 'earthquake':
		response = getEarthquake(request, None, flag, code)	
	elif request.GET['page'] == 'security':
		response = getSecurity(request, None, flag, code)			

	if 'code' in request.GET:
		response['add_link'] = '&code='+str(code)

	return render_to_response(
            "dashboard_base.html",
            RequestContext(request, response))

def get_provinces(request):
	resource = AfgAdmbndaAdm1.objects.all().values('prov_code','prov_na_en').order_by('prov_na_en')
	response = {'data': {'provinces': [], 'districts': []}}
	for i in resource:
		response['data']['provinces'].append({'name':i['prov_na_en'],'code':i['prov_code']})

	resource = AfgAdmbndaAdm2.objects.all().values('dist_code','dist_na_en','prov_na_en').order_by('dist_na_en')		
	for i in resource:
		response['data']['districts'].append({'name':i['dist_na_en'],'code':i['dist_code'],'parent':i['prov_na_en']})	
	return HttpResponse(json.dumps(response), mimetype='application/json')

