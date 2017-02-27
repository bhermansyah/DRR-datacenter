from django.shortcuts import render, RequestContext, redirect, render_to_response
from django.contrib.gis.geos import fromstr, fromfile
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.decorators import login_required
from django.db.models import Q
import datetime
#from django.template import loader

from securitydb.models import *
from securitydb.forms import SecureFeatureForm, SearchFiltersForm
from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2, AfgPplp, AfgPpla

import models
import json as simplejson

from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.shortcuts import render

from django import forms
from securitydb.includes import *

# Create your views here.
def get_districts(request, chosen_prov_code, toResponse=True):
    district = AfgAdmbndaAdm2.objects.filter(prov_code=chosen_prov_code).order_by('dist_na_en')
    district_list = []
    for dist in district:
        district_list.append((dist.dist_code, dist.dist_na_en))
    if (toResponse):
        return HttpResponse(simplejson.dumps(district_list), mimetype="application/json")
    else:
        return district_list

def get_settlements(request, chosen_dist_code, toResponse=True):
    settlement = AfgPpla.objects.all().filter(dist_code=chosen_dist_code).order_by('name_en')
    settlement_list = []
    for sett in settlement:
        settlement_list.append((sett.vuid, sett.name_en))
    if (toResponse):
        return HttpResponse(simplejson.dumps(settlement_list), mimetype="application/json")
    else:
        return settlement_list

def geoadm_from_lonlat(request):
    pnt_wkt = 'POINT('+request.GET['lon']+' '+request.GET['lat']+')'
    settlement = AfgPpla.objects.all().filter(wkb_geometry__contains=pnt_wkt).order_by('name_en')
    if settlement.count() > 0:
        settlement_dict = {}
        settlement_dict['vuid'] = settlement[0].vuid
        settlement_dict['name_en'] = settlement[0].name_en
        settlement_dict['prov_code'] = settlement[0].prov_code
        settlement_dict['prov_na_en'] = settlement[0].prov_na_en
        settlement_dict['dist_code'] = settlement[0].dist_code
        settlement_dict['dist_na_en'] = settlement[0].dist_na_en
        settlement_dict['dist_list'] = get_districts(None, settlement[0].prov_code, toResponse=False)
        settlement_dict['sett_list'] = get_settlements(None, settlement[0].dist_code, toResponse=False)
        return HttpResponse(simplejson.dumps(settlement_dict), mimetype="application/json")
    else:
        return false

def scresysls(request):
	# instance = SecureFeature()
	recstatus_text = request.GET.get("recstatus", False)
	recstatus = False
	for choice in recstatus_choices:
		if recstatus_text == choice[1]:
			recstatus = choice[0]
			break
	if recstatus == False:
		recstatus_text = 'all'
	criteria = request.POST.get("criteria","")

	has_delete = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())

    # SearchFiltersForm is not used anymore, replaced with
    # hard coded 'record status' links in searchform.html
	form = {}
	if has_delete:
		initial = {'criteria': criteria, 'recstatus': recstatus}
		form = SearchFiltersForm(initial=initial)

	# queryset
	search_result_list = SecureFeature.objects.order_by('scre_incidentdate')
	if has_delete:
		if recstatus != False:
			search_result_list = search_result_list.filter(Q(recstatus=recstatus))
	else:
		search_result_list = search_result_list.filter(Q(recstatus__in=[1, 2]))
	if criteria:
		search_result_list = search_result_list.filter(Q(scre_notes__icontains=criteria) | Q(scre_placename__icontains=criteria))

	# pagination
	per_page = 25 # Show 25 items per page
	paginator = Paginator(search_result_list, per_page)
	page = request.GET.get('page')
	try:
		paged_search_result_list = paginator.page(page)
	except PageNotAnInteger:
		# If page is not an integer, deliver first page.
		paged_search_result_list = paginator.page(1)
	except EmptyPage:
		# If page is out of range (e.g. 9999), deliver last page of results.
		paged_search_result_list = paginator.page(paginator.num_pages)

	render_data = {'form': form, 'search_result_list': paged_search_result_list, 'criteria': criteria, 'has_delete': has_delete, 'recstatus_choices': recstatus_choices}
	if recstatus_text:
		render_data['recstatus_text'] = recstatus_text;
		render_data['rsc'] = {};
		render_data['rsc'][recstatus_text] = 'badge';
	return render(request, 'searchform.html', render_data)

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
        # initial={
        #     'scre_provid': request.POST.get('scre_provid'),
        #     'scre_distid': request.POST.get('scre_distid'),
        #     'scre_settvuid': request.POST.get('scre_settvuid'), 'scre_username':request.user.username,
        #     'user':request.user
        #     }
        data=request.POST
        initial=data.dict()
        form = SecureFeatureForm(data=data, instance=instance, initial=initial)
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
        	if obj.recstatus is None:
        		obj.recstatus = 1

        	form.mpoint = fromstr('Point(' + frm_lon + ' ' + frm_lat + ')')

        	form.save()
        	return HttpResponseRedirect('/securitydb/list/')

    else:
        initial = {}
        # initial['user'] = request.user
        initial['scre_username'] = request.user.username
        form = SecureFeatureForm(instance=instance, initial=initial)

    has_delete_right = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())
    if not has_delete_right:
    	form.fields['recstatus'].widget = forms.HiddenInput()

    # render_to_response is likely to be deprecated in the future
    # return render_to_response(
    #     'editform.html',
    #     {'form': form,},
    #     context_instance=RequestContext(request)
    # )
    return render(
        request,
        'editform.html',
        {'form': form,}
    )


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
