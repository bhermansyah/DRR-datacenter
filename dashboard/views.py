from django.shortcuts import render
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext, loader
from geodb.geo_calc import getBaseline, getFloodForecast, getFloodRisk, getAvalancheRisk, getAvalancheForecast, getAccessibility, getEarthquake, getSecurity
from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2
from django.shortcuts import HttpResponse
from matrix.models import matrix
from urlparse import urlparse
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW
import json, os

# from wkhtmltopdf.views import PDFTemplateResponse
import pdfkit
from geonode.people.models import Profile


def common(request):
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

	if 'pdf' in request.GET:
		mapCode = '700'
		map_obj = _resolve_map(request, mapCode, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)
		px = get_object_or_404(Profile, id=request.GET['user'])
		# print px
		queryset = matrix(user=px,resourceid=map_obj,action='Dashboard PDF '+request.GET['page'])
		queryset.save()
	else:	
		mapCode = '700'
		map_obj = _resolve_map(request, mapCode, 'base.view_resourcebase', _PERMISSION_MSG_VIEW)
		queryset = matrix(user=request.user,resourceid=map_obj,action='Dashboard '+request.GET['page'])
		queryset.save()	

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

	response['checked'] = []
	if '_checked' in request.GET:
		response['checked'] = request.GET['_checked'].split(",")

	return response	

# Create your views here.
def dashboard_detail(request):
	# print request.GET['page']
	
	if 'pdf' in request.GET:
		options = {
		    'quiet': '',
		    'page-size': 'A4',
		    # 'margin-left': 10,
		    # 'margin-right': 10,
		    'margin-bottom':10,
		    'margin-top':25,
		    # 'viewport-size':'800x600',
		    'header-html': 'http://'+request.META.get('HTTP_HOST')+'/static/rep_header.html',
		    # 'lowquality':'-'
		    # 'disable-smart-shrinking':'-',
		    # 'print-media-type':'-',
		    # 'no-stop-slow-scripts':'-',
		    # 'enable-javascript':'-',
		    # 'javascript-delay': 30000,
		    # 'window-status': 'ready',
		}
		a = request.META.get('HTTP_HOST')+request.META.get('PATH_INFO')
		print  request.META.get('HTTP_HOST')
		# print 'http://'+str(a)+'print?'+request.META.get('QUERY_STRING')+'&user='+str(request.user.id)
		pdf = pdfkit.from_url('http://'+str(a)+'print?'+request.META.get('QUERY_STRING')+'&user='+str(request.user.id), False, options=options)
		resp = HttpResponse(pdf,content_type='application/pdf')
		resp['Content-Disposition'] = 'attachment; filename="ourcodeworld.pdf"'
		return resp
	else:
		response = common(request)
		return render_to_response(
	            "dashboard_base.html",
	            RequestContext(request, response))	

def dashboard_print(request):
	return render_to_response(
	            "dashboard_base.html",
	            RequestContext(request, common(request)))			

def get_provinces(request):
	resource = AfgAdmbndaAdm1.objects.all().values('prov_code','prov_na_en').order_by('prov_na_en')
	response = {'data': {'provinces': [], 'districts': []}}
	for i in resource:
		response['data']['provinces'].append({'name':i['prov_na_en'],'code':i['prov_code']})

	resource = AfgAdmbndaAdm2.objects.all().values('dist_code','dist_na_en','prov_na_en').order_by('dist_na_en')		
	for i in resource:
		response['data']['districts'].append({'name':i['dist_na_en'],'code':i['dist_code'],'parent':i['prov_na_en']})	
	return HttpResponse(json.dumps(response), mimetype='application/json')

