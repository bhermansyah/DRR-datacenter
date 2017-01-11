from django.shortcuts import render, redirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext, loader
from geodb.geo_calc import getBaseline, getFloodForecast, getFloodRisk, getAvalancheRisk, getAvalancheForecast, getAccessibility, getEarthquake, getSecurity
from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2
from django.shortcuts import HttpResponse
from matrix.models import matrix
from dashboard.models import classmarker
from urlparse import urlparse
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW
import json, os

# from wkhtmltopdf.views import PDFTemplateResponse
import pdfkit
from geonode.people.models import Profile
from django.views.decorators.csrf import csrf_exempt

def common(request):
	response = {}
	code = None
	flag = 'entireAfg'
	filterLock = None
	rawFilterLock = None

	if 'page' not in request.GET:
		mutable = request.GET._mutable
		request.GET._mutable = True
		request.GET['page'] = 'baseline'
		request.GET._mutable = mutable

	if 'code' in request.GET:
		code = int(request.GET['code'])
		flag = 'currentProvince'

	if 'flag' in request.GET:
		filterLock = request.GET['filter']
		rawFilterLock = filterLock
		filterLock = 'ST_GeomFromText(\''+filterLock+'\',4326)'
		flag = request.GET['flag']	

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
		response = getBaseline(request, filterLock, flag, code)
	elif request.GET['page'] == 'floodforecast':
		response = getFloodForecast(request, filterLock, flag, code)
	elif request.GET['page'] == 'floodrisk':
		response = getFloodRisk(request, filterLock, flag, code)	
	elif request.GET['page'] == 'avalancherisk':
		response = getAvalancheRisk(request, filterLock, flag, code)
	elif request.GET['page'] == 'avalcheforecast':
		response = getAvalancheForecast(request, filterLock, flag, code)	
	elif request.GET['page'] == 'accessibility':
		response = getAccessibility(request, rawFilterLock, flag, code)	
	elif request.GET['page'] == 'earthquake':
		response = getEarthquake(request, filterLock, flag, code)	
	elif request.GET['page'] == 'security':
		response = getSecurity(request, rawFilterLock, flag, code)			

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

@csrf_exempt
def dashboard_multiple(request):
	options = {
	    'quiet': '',
	    'page-size': 'A4',
	    # 'margin-left': 10,
	    # 'margin-right': 10,
	    'margin-bottom':10,
	    'margin-top':25,
	    # 'viewport-size':'800x600',
	    # 'header-html': 'http://'+request.META.get('HTTP_HOST')+'/static/rep_header.html',
	    # 'lowquality':'-',
	    # 'disable-smart-shrinking':'-',
	    # 'print-media-type':'-',
	    # 'no-stop-slow-scripts':'-',
	    # 'enable-javascript':'-',
	    'javascript-delay': 10000,
	    # 'window-status': 'ready',
	    'encoding': "UTF-8",
	}

	urls = []
	data = request.POST
	a = request.META.get('HTTP_HOST') #+request.META.get('PATH_INFO')

	# print data['urls']
	for i in data['urls'].split(','):
		if i is not None and i != '':
			urls.append(str('http://'+a+'/dashboard/print'+i+'&user='+str(request.user.id)))
	
	# print urls

	# pdf = pdfkit.from_url('http://'+str(a)+'print?'+request.META.get('QUERY_STRING')+'&user='+str(request.user.id), False, options=options)
	pdf = pdfkit.from_url(urls, False, options=options)
	resp = HttpResponse(pdf,content_type='application/pdf')
	resp['Content-Disposition'] = 'attachment; filename="'+data['fileName']+'.pdf"'
	return resp
	# return HttpResponse({}, mimetype='application/json')

def classmarkerRedirect(request):
	return redirect('https://www.classmarker.com/online-test/start/?quiz=mft579f02fe604fb&cm_user_id='+request.user.username+'&cm_fn='+request.user.first_name+'&cm_ln='+request.user.last_name+'&cm_e='+request.user.email)

def classmarkerInsert(request):
	# classmarker
	# print request.GET
	# data = get_object_or_404(classmarker, cm_user_id=request.GET['cm_user_id'])
	data = classmarker.objects.filter(cm_user_id=request.GET['cm_user_id'])
	cm_ts = request.GET['cm_ts']
	cm_tsa = request.GET['cm_tsa']
	cm_tp = request.GET['cm_tp']

	if data.count()>0:
		if data[0].cm_ts > float(cm_ts):
			cm_ts = data[0].cm_ts
		if data[0].cm_tsa > float(cm_tsa):
			cm_tsa = data[0].cm_tsa	  
		if data[0].cm_tp > float(cm_tp):
			cm_tp = data[0].cm_tp

		p = classmarker(pk=data[0].pk,cm_ts=cm_ts,cm_tsa=cm_tsa,cm_tp=cm_tp,cm_td=request.GET['cm_td'],cm_fn=request.GET['cm_fn'],cm_ln=request.GET['cm_ln'],cm_e=request.GET['cm_e'],cm_user_id=request.GET['cm_user_id'])
	else:
		p = classmarker(cm_ts=cm_ts,cm_tsa=cm_tsa,cm_tp=cm_tp,cm_td=request.GET['cm_td'],cm_fn=request.GET['cm_fn'],cm_ln=request.GET['cm_ln'],cm_e=request.GET['cm_e'],cm_user_id=request.GET['cm_user_id'])	

	p.save()
	return HttpResponse({}, mimetype='application/json')
