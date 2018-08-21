from django.shortcuts import render, redirect
from django.shortcuts import render_to_response, get_object_or_404
from django.template import RequestContext, loader
from geodb.geo_calc import getBaseline, getFloodForecast, getFloodRisk, getAvalancheRisk, getAvalancheForecast, getAccessibility, getEarthquake, getSecurity, getLandslideRisk, getQuickOverview, getDroughtRisk
from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2
from django.shortcuts import HttpResponse
from matrix.models import matrix, MatrixCertificate
from dashboard.models import classmarker
from urlparse import urlparse
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW
import json, os

# from wkhtmltopdf.views import PDFTemplateResponse
import pdfkit
from geonode.people.models import Profile
from django.views.decorators.csrf import csrf_exempt

from datetime import datetime, date
from django.utils.formats import dateformat

from django.conf import settings

import pdfcrowd
from PyPDF2 import PdfFileMerger, PdfFileReader
from StringIO import StringIO
import urllib2, urllib
from urlparse import parse_qs, urlsplit, urlunsplit
import re
from requests.utils import quote
from django.utils import translation

import time
import md5
import calendar

from avatar.templatetags.avatar_tags import avatar_print_url
from geodb.geoapi import getClosestDroughtWOY

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
	elif request.GET['page'] == 'landslide':
		response = getLandslideRisk(request, filterLock, flag, code)
	elif request.GET['page'] == 'drought':
		dateIn_str = request.GET['date'] if ('date' in request.GET) else str(date.today())
		dateIn = dateIn_str.split('-')
		woy = dateIn[0] + '%03d' % date(int(dateIn[0]), int(dateIn[1]), int(dateIn[2])).isocalendar()[1]
		closest_woy = getClosestDroughtWOY(woy)
		response = getDroughtRisk(request, filterLock, flag, code, closest_woy)
	elif request.GET['page'] == 'main':
		response = getQuickOverview(request, filterLock, flag, code)

	if 'code' in request.GET:
		response['add_link'] = '&code='+str(code)

	response['checked'] = []
	if '_checked' in request.GET:
		response['checked'] = request.GET['_checked'].split(",")

	class CustomEncoder(json.JSONEncoder):
	    def default(self, obj):
	        if obj.__class__.__name__  == "GeoValuesQuerySet":
	            return list(obj)
	        elif obj.__class__.__name__  == "date":
	            return obj.strftime("%Y-%m-%d")
	        elif obj.__class__.__name__  == "datetime":
	            return obj.strftime("%Y-%m-%d %H:%M:%S")
	        elif obj.__class__.__name__  == "Decimal":
	            return float(obj)
	        else:
	            print 'not converted to json:', obj.__class__.__name__
	            # return {} # convert un-json-able object to empty object
	            return 'not converted to json: %s' % (obj.__class__.__name__) # convert un-json-able object to empty object

	response['jsondata'] = json.dumps(response, cls = CustomEncoder)

	return response

# Create your views here.
def dashboard_detail(request):
	v2_folder = ''
	user_logo = avatar_print_url(request.user,200)

	headerparam_dict = {p: request.GET.get(p, '') for p in ['hideuserinfo','lang'] if p in request.GET}
	headerparam = urllib.urlencode(headerparam_dict)

	bodyparam_dict = {}
	if not request.GET.get('lang'):
		bodyparam_dict['lang'] = str(translation.get_language())
	bodyparam = urllib.urlencode(bodyparam_dict)

	def set_query_parameter(url, param_name, param_value):
	    """Given a URL, set or replace a query parameter and return the
	    modified URL.

	    >>> set_query_parameter('http://example.com?foo=bar&biz=baz', 'foo', 'stuff')
	    'http://example.com?foo=stuff&biz=baz'

	    """
	    scheme, netloc, path, query_string, fragment = urlsplit(url)
	    query_params = parse_qs(query_string)

	    query_params[param_name] = [param_value]
	    new_query_string = urllib.urlencode(query_params, doseq=True)

	    return urlunsplit((scheme, netloc, path, new_query_string, fragment))

	# add '?page=baseline' to url if none exist
	if not request.GET.get('page'):
	    currenturl = request.build_absolute_uri()
	    return redirect(set_query_parameter(currenturl, 'page', 'baseline'))

	if 'pdf' in request.GET:
		try:
			domainpath = 'asdc.immap.org'+request.META.get('PATH_INFO')
			date_string = dateformat.format(date.today(), "Y-m-d")

			# create an API client instance
			client = pdfcrowd.Client(getattr(settings, 'PDFCROWD_UNAME'), getattr(settings, 'PDFCROWD_UPASS'))
			client.setPageWidth('8.3in')
			client.setPageHeight('11.7in')
			# client.setPageMargins('1in', '1in', '1in', '1in')
			client.setVerticalMargin("0.75in")
			client.setHorizontalMargin("0.25in")
			client.setHeaderUrl('http://asdc.immap.org/static/'+v2_folder+'rep_header_vector.html?onpdf='+user_logo['onpdf']+'&userlogo='+user_logo['logo_url']+'&name='+request.user.first_name+' '+request.user.last_name+'&cust_title=&organization='+request.user.organization+'&isodate='+date_string+'&'+headerparam)
			# convert a web page and store the generated PDF to a variable
			pdf = client.convertURI('http://'+str(domainpath)+'print?'+request.META.get('QUERY_STRING')+'&user='+str(request.user.id)+'&'+bodyparam)
			 # set HTTP response headers
			response = HttpResponse(mimetype="application/pdf")
			response["Cache-Control"] = "no-cache"
			response["Accept-Ranges"] = "none"
			response["Content-Disposition"] = 'attachment; filename="'+request.GET['page']+'_'+date_string+'.pdf"'

			# send the generated PDF
			response.write(pdf)


		except pdfcrowd.Error, why:
			options = {
			    'quiet': '',
			    'page-size': 'A4',
			    # 'margin-left': 10,
			    # 'margin-right': 10,
			    'margin-bottom':10,
			    'margin-top':25,
			    # 'viewport-size':'800x600',
			    'header-html': 'http://'+request.META.get('HTTP_HOST')+'/static/'+v2_folder+'rep_header.html?onpdf='+user_logo['onpdf']+'&userlogo='+user_logo['logo_url']+'&name='+request.user.first_name+' '+request.user.last_name+'&cust_title=&organization='+request.user.organization+'&'+headerparam,
			    # 'header-html': 'http://'+request.META.get('HTTP_HOST')+'/static/rep_header(v2).html?name='+request.user.first_name+'-'+request.user.last_name+'&cust_title=&organization='+request.user.organization,
			    # 'lowquality':'-'
			    # 'disable-smart-shrinking':'-',
			    # 'print-media-type':'-',
			    # 'no-stop-slow-scripts':'-',
			    # 'enable-javascript':'-',
			    # 'javascript-delay': 30000,
			    # 'window-status': 'ready',
			}
			if re.match('^/v2', request.path):
			    options['viewport-size'] = '1240x800'
			domainpath = request.META.get('HTTP_HOST')+request.META.get('PATH_INFO')
			url = 'http://'+str(domainpath)+'print?'+request.META.get('QUERY_STRING')+'&user='+str(request.user.id)+'&'+bodyparam
			pdf = pdfkit.from_url(url, False, options=options)
			date_string = dateformat.format(date.today(), "Y-m-d")
			response = HttpResponse(pdf,content_type='application/pdf')
			response['Content-Disposition'] = 'attachment; filename="'+request.GET['page']+'_'+date_string+'.pdf"'

		return response
	else:
		response = common(request)
		template = 'dashboard_base.html'
		if request.resolver_match.namespace == 'v2':
			template = 'v2/dashboard_base.html'
		return render_to_response(
			template,
			RequestContext(request, response))

def dashboard_print(request):
	template = 'dashboard_base.html'
	if request.resolver_match.namespace == 'v2':
		template = 'v2/dashboard_base.html'
	if request.GET.get('lang'):
		translation.activate(request.GET.get('lang'))
	return render_to_response(
		template,
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
	user_logo = avatar_print_url(request.user,200)
	urls = []
	# data = request.POST
	data = json.loads(request.body)
	domainpath = request.META.get('HTTP_HOST')
	domainpath += '/v2' if re.match('^/v2', request.path) else ''
	v2_folder = ''

	headerparam_dict = {p: request.GET.get(p, '') for p in ['hideuserinfo','lang'] if p in request.GET}
	headerparam = urllib.urlencode(headerparam_dict)

	bodyparam_dict = {}
	bodyparam_dict['lang'] = request.GET.get('lang') or str(translation.get_language())
	bodyparam = urllib.urlencode(bodyparam_dict)

	try:
		print request.META.get('HTTP_HOST'), request.META.get('PATH_INFO')
		date_string = dateformat.format(datetime.now(), "Y-m-d")

		# create an API client instance
		client = pdfcrowd.Client(getattr(settings, 'PDFCROWD_UNAME'), getattr(settings, 'PDFCROWD_UPASS'))
		client.setPageWidth('8.3in')
		client.setPageHeight('11.7in')
		# client.setPageMargins('1in', '1in', '1in', '1in')
		client.setVerticalMargin("0.75in")
		client.setHorizontalMargin("0.25in")
		client.setHeaderUrl('http://'+request.META.get('HTTP_HOST')+'/static/'+v2_folder+'rep_header_vector.html?onpdf='+user_logo['onpdf']+'&userlogo='+user_logo['logo_url']+'&name='+request.user.first_name+' '+request.user.last_name+'&cust_title='+quote(data['mapTitle'].encode('utf-8'))+'&organization='+request.user.organization+'&isodate='+date_string+'&'+headerparam)
		# convert a web page and store the generated PDF to a variable

		# get map pdf
		req = urllib2.Request(data['mapUrl'])
		req.add_unredirected_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36')
		fh = urllib2.urlopen(req)
		f = fh.read()

		merger = PdfFileMerger()

		merger.append(StringIO(f))

		for i in data['urls']:
			if i is not None and i != '':
				# urls.append(str('http://'+domainpath+'/dashboard/print'+i+'&user='+str(request.user.id)))
				pdf = client.convertURI(str('http://'+domainpath+'/dashboard/print'+i+'&user='+str(request.user.id)+'&'+bodyparam))
				merger.append(StringIO(pdf))

		 # set HTTP response headers
		# response = HttpResponse(mimetype="application/pdf")
		# response["Cache-Control"] = "no-cache"
		# response["Accept-Ranges"] = "none"
		# response["Content-Disposition"] = 'attachment; filename="'+data['fileName']+'.pdf"'

		# send the generated PDF
		# merger.write(response)
		# return response
		merger.write(getattr(settings, 'PRINT_CACHE_PATH')+data['mapUrl'].split('/')[-1])
		return HttpResponse(json.dumps({'filename':data['mapUrl'].split('/')[-1]}), mimetype='application/json')

	except pdfcrowd.Error, why:
		options = {
		    'quiet': '',
		    'page-size': 'A4',
		    # 'margin-left': 10,
		    # 'margin-right': 10,
		    'margin-bottom':10,
		    'margin-top':25,
		    # 'viewport-size':'800x600',
		    'header-html': 'http://'+request.META.get('HTTP_HOST')+'/static/'+v2_folder+'rep_header.html?onpdf='+user_logo['onpdf']+'&userlogo='+user_logo['logo_url']+'&name='+request.user.first_name+' '+request.user.last_name+'&cust_title='+quote(data['mapTitle'].encode('utf-8'))+'&organization='+request.user.organization+'&'+headerparam,
			# 'lowquality':'-',
		    # 'disable-smart-shrinking':'-',
		    # 'print-media-type':'-',
		    # 'no-stop-slow-scripts':'-',
		    # 'enable-javascript':'-',
		    'javascript-delay': 25000,
		    # 'window-status': 'ready',
		    'encoding': "UTF-8",
		}

		# f = urllib.request.urlopen(data['mapUrl']).read()
		req = urllib2.Request(data['mapUrl'])
		req.add_unredirected_header('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.107 Safari/537.36')
		fh = urllib2.urlopen(req)
		f = fh.read()

		merger = PdfFileMerger()
		merger.append(StringIO(f))

		for i in data['urls']:
			if i is not None and i != '':
				urls.append(str('http://'+domainpath+'/dashboard/print'+i+'&user='+str(request.user.id)+'&'+bodyparam))

		pdf = pdfkit.from_url(urls, False, options=options)
		merger.append(StringIO(pdf))


		# resp = HttpResponse(pdf,content_type='application/pdf')
		# resp = HttpResponse(mimetype="application/pdf")
		# resp["Cache-Control"] = "no-cache"
		# resp["Accept-Ranges"] = "none"
		# resp['Content-Disposition'] = 'attachment; filename="'+data['fileName']+'.pdf"'

		merger.write(getattr(settings, 'PRINT_CACHE_PATH')+data['mapUrl'].split('/')[-1])
		return HttpResponse(json.dumps({'filename':data['mapUrl'].split('/')[-1]}), mimetype='application/json')

def downloadPDFFile(request):
	with open(getattr(settings, 'PRINT_CACHE_PATH')+request.GET['filename'], 'r') as pdf:
		response = HttpResponse(pdf.read(),content_type='application/pdf')
		response['Content-Disposition'] = 'attachment; filename="'+quote(request.GET['filenameoutput'].encode('utf-8'))+'.pdf"'
        return response

def classmarkerRedirect(request):
	return redirect('https://www.classmarker.com/online-test/start/?quiz=mft579f02fe604fb&cm_user_id='+request.user.username+'&cm_fn='+request.user.first_name+'&cm_ln='+request.user.last_name+'&cm_e='+request.user.email)

def classmarkerUnivesityRedirect(request):
	return redirect('https://www.classmarker.com/online-test/start/?quiz=n3b5b768714a11cd&cm_user_id='+request.user.username+'&cm_fn='+request.user.first_name+'&cm_ln='+request.user.last_name+'&cm_e='+request.user.email)

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

def classmarkerGet():
	api_name = 'getUsersData'
	api_key = 'QPCkKLbJ5XemMe8Kei6oLD0ZE0w1JfOa'
	api_secret = '1WpKiVZKTD4gnAwwNzk0dO9MT1nDFcjF87Vmzv4S'
	# d = datetime.utcnow()
	# ts = calendar.timegm(d.utctimetuple())
	ts = int(time.time())
	from_ts = int(time.mktime((2017, 11, 15, 0, 0, 0, 0, 0, 0)))
	signature = md5.new(api_key + api_secret + str(ts));
	# url = 'https://api.classmarker.com/v1/groups/315743/tests/673903/recent_results.json?api_key=%s&signature=%s&timestamp=%s&finishedAfterTimestamp=%s' %(api_key,signature.hexdigest(),str(ts),str(from_ts))
	url = 'https://api.classmarker.com/v1/links/recent_results.json?api_key=%s&signature=%s&timestamp=%s' %(api_key,signature.hexdigest(),str(ts))
	# print url
	data = urllib.urlopen(url)
	for i in data:
		result = json.loads(i)
		# print result['results']
		for x in result['results']:
			available_certified_users = MatrixCertificate.objects.filter(pk=x['result']['email'])
			if available_certified_users.count()>0:
				if x['result']['percentage']>available_certified_users[0].percentage:
					available_certified_users[0].first = x['result']['first']
					available_certified_users[0].last = x['result']['last']
					available_certified_users[0].percentage = x['result']['percentage']
					available_certified_users[0].points_score = x['result']['points_score']
					available_certified_users[0].points_available = x['result']['points_available']
					available_certified_users[0].time_started = x['result']['time_started']
					available_certified_users[0].time_finished = x['result']['time_finished']
					available_certified_users[0].cm_user_id = x['result']['cm_user_id']
					available_certified_users[0].save()
					# print available_certified_users
			else:
				p = MatrixCertificate(pk=x['result']['email'])	
				p.first = x['result']['first']
				p.last = x['result']['last']
				p.percentage = x['result']['percentage']
				p.points_score = x['result']['points_scored']
				p.points_available = x['result']['points_available']
				p.time_started = x['result']['time_started']
				p.time_finished = x['result']['time_finished']
				p.cm_user_id = x['result']['cm_user_id']
				p.save()	
				# print p


