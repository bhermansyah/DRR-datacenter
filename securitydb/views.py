from django.shortcuts import render, RequestContext, redirect, render_to_response
from django.contrib.gis.geos import fromstr, fromfile
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Q
import datetime
#from django.template import loader

from securitydb.models import *
from securitydb.forms import SecureFeatureForm
from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2

import models
import json as simplejson

# Create your views here.
def get_districts(request, prov_id):
    province = AfgAdmbndaAdm1.objects.get(ogc_fid=prov_id)
    district = AfgAdmbndaAdm2.objects.filter(prov_code=province.prov_code).order_by('dist_na_en')
    district_dict = {}
    for dist in district:
        district_dict[dist.ogc_fid] = dist.dist_na_en
    return HttpResponse(simplejson.dumps(district_dict), mimetype="application/json")
	
def scresysls(request):
	criteria = request.POST.get("criteria","")
	#print "criteria " + criteria
	if request.method == 'POST':
		search_result_list = SecureFeature.objects.filter(Q(scre_notes__icontains=criteria) | Q(scre_placename__icontains=criteria)).order_by('scre_incidentdate')
	else:
		search_result_list = SecureFeature.objects.order_by('scre_incidentdate')[:5]
	return render(request, 'searchform.html', {'search_result_list': search_result_list,})

def scresysed(request, criteria_id=None):
	if criteria_id:
		instance = SecureFeature.objects.get(id=criteria_id)
	else:
		instance = SecureFeature()

	if request.POST:
		mutable = request.POST._mutable
		request.POST._mutable = True
		request.POST['scre_username'] = request.user.username
		request.POST._mutable = mutable
		form = SecureFeatureForm(data=request.POST, instance=instance, initial={'scre_distid': request.POST['scre_distid'], 'scre_username':request.user.username })
		if form.is_valid():

			frm_incdtstr=request.POST.get('scre_incidentdatestr', '')
			frm_inctmstr=request.POST.get('scre_incidenttimestr', '')
			frm_lat = request.POST.get('scre_latitude', '0')
			frm_lon = request.POST.get('scre_longitude', '0')

			obj = form.save(commit=False)
			obj.scre_incidentdate = frm_incdtstr + " " + frm_inctmstr
			obj.mpoint = fromstr('Point(' + frm_lon + ' ' + frm_lat + ')')
			if not obj.id:
				obj.userud = 1
				obj.updatedatetime = datetime.datetime.today()
			else:
				obj.userid = 1
				obj.entrydatetime = datetime.datetime.today()
			obj.recstatus = 1
			
			form.mpoint = fromstr('Point(' + frm_lon + ' ' + frm_lat + ')')

			form.save()
			return HttpResponseRedirect('/securitydb/list/')
			
	else:
		form = SecureFeatureForm(instance=instance)

	return render_to_response('editform.html', {
		'form': form,
	}, context_instance=RequestContext(request))

	
# this is your page
def scresysinpoint(request):
	if request.method == 'POST':
		form = DataForm(request.POST)

		if form.is_valid():
			return HttpResponseRedirect('/asdcscre/')
	else:
		wkt_val = 'Point(90 25)'
		pnt = fromstr(wkt_val)

		form = DataForm()
		form.fields["id"].initial = "1"
		form.fields["scre_latitude"].initial = pnt.y
		form.fields["scre_longitude"].initial = pnt.x
	return render(request, 'dataform.html', {'form': form})



