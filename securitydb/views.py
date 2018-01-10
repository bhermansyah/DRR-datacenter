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

def get_settlements2(request, chosen_dist_code, toResponse=True):
    # settlement = AfgPplp.objects.all().filter(dist_code=chosen_dist_code, vuid__isnull=False).order_by('name_en')
    settlement = AfgPplp.objects.all().filter(dist_code=chosen_dist_code).order_by('name_en')
    settlement_list = [[sett.ogc_fid, sett.vuid, sett.name_en, sett.lon_x, sett.lat_y] for sett in settlement]
    if (toResponse):
        return HttpResponse(simplejson.dumps(settlement_list), mimetype="application/json")
    else:
        return settlement_list

def toggle_approve(request, record_id):
    data = {}
    sec_record = SecureFeature.objects.get(id=record_id)
    for key, choice in enumerate(recstatus_choices_toggleable):
        if str(sec_record.recstatus) == str(choice[0]):
            if key == len(recstatus_choices_toggleable)-1: # is last key
                new_key = 0 # first key
            else:
                new_key = key+1
            data['success'] = True
            data['key'] = sec_record.recstatus = recstatus_choices_toggleable[new_key][0]
            data['rec_status_text'] = recstatus_choices_toggleable[new_key][1];
            sec_record.userud = request.user.id
            sec_record.updatedatetime = datetime.datetime.today()
            sec_record.save()
            break
    return HttpResponse(simplejson.dumps(data), mimetype="application/json")

def permanentremove(request, record_id):
    response = {}
    # print 'record_id', record_id
    result = SecureFeature.objects.filter(id=record_id).delete()
    try:
        r = SecureFeature.objects.get(id=record_id)
    except SecureFeature.DoesNotExist:
        response['success'] = True
    # print 'result', result
    return HttpResponse(simplejson.dumps(response), mimetype="application/json")

def geoadm_from_lonlat(request):
    pnt_wkt = 'POINT('+request.GET['lon']+' '+request.GET['lat']+')'
    settlement = AfgPpla.objects.all().filter(wkb_geometry__contains=pnt_wkt).order_by('name_en')
    area_dict = {}
    if settlement.count() > 0:
        area_dict['vuid'] = settlement[0].vuid
        area_dict['name_en'] = settlement[0].name_en
        area_dict['prov_code'] = settlement[0].prov_code
        area_dict['prov_na_en'] = settlement[0].prov_na_en
        area_dict['dist_code'] = settlement[0].dist_code
        area_dict['dist_na_en'] = settlement[0].dist_na_en
        area_dict['dist_list'] = get_districts(None, settlement[0].prov_code, toResponse=False)
        area_dict['sett_list'] = get_settlements2(None, settlement[0].dist_code, toResponse=False)
    else:
        # fallback to district area
        print 'locate point adm area: fallback to district area'
        district = AfgAdmbndaAdm2.objects.filter(wkb_geometry__contains=pnt_wkt).order_by('dist_na_en')
        if district.count() > 0:
            area_dict['prov_code'] = district[0].prov_code
            area_dict['prov_na_en'] = district[0].prov_na_en
            area_dict['dist_code'] = district[0].dist_code
            area_dict['dist_na_en'] = district[0].dist_na_en
            area_dict['dist_list'] = get_districts(None, district[0].prov_code, toResponse=False)
            area_dict['sett_list'] = get_settlements2(None, district[0].dist_code, toResponse=False)
        else:
            # fallback to province area
            print 'locate point adm area: fallback to province area'
            province = AfgAdmbndaAdm1.objects.filter(wkb_geometry__contains=pnt_wkt).order_by('prov_na_en')
            if province.count() > 0:
                area_dict['prov_code'] = province[0].prov_code
                area_dict['prov_na_en'] = province[0].prov_na_en
                area_dict['dist_list'] = get_districts(None, province[0].prov_code, toResponse=False)
            else:
                print 'locate point adm area: Not found in Afghanistan area!'
                area_dict['message'] = 'Not found in Afghanistan area!'

    return HttpResponse(simplejson.dumps(area_dict), mimetype="application/json")

def scresysls(request):
	# instance = SecureFeature()
	recstatus_text = request.GET.get("recstatus", False)
	recstatus = recstatus_default = str(len(recstatus_choices_all)-1) # default choice
	for choice in recstatus_choices:
		if recstatus_text == choice[1]:
			recstatus = choice[0]
			break
	criteria = request.POST.get("criteria","")

	has_delete = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())

    # SearchFiltersForm is not used anymore, replaced with
    # hard coded 'record status' links in searchform.html
	form = {}
	if has_delete:
		initial = {'criteria': criteria, 'recstatus': recstatus}
		form = SearchFiltersForm(initial=initial)

	# date_range
    # print 'request.GET.get("daterange", False)', request.GET.get("daterange", False)
	date_range = request.GET.get("daterange", False)
	if (date_range):
		date_range_list = date_range.split(',')
		date_start = date_range_list[0]
		date_end = date_range_list[1]

	# queryset
	search_result_list = SecureFeature.objects.select_related('scre_eventid', 'scre_incidenttarget').order_by('-scre_incidentdate')
	if has_delete:
		if recstatus != recstatus_default:
			search_result_list = search_result_list.filter(Q(recstatus=recstatus))
	else:
		search_result_list = search_result_list.filter(Q(recstatus__in=[1, 2]))
	if criteria:
		search_result_list = search_result_list.filter(Q(scre_notes__icontains=criteria) | Q(scre_placename__icontains=criteria))
	if date_range:
		search_result_list = search_result_list.filter(Q(scre_incidentdate__range=(date_start, date_end)))

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

	# insert recstatus text and settlement name for each record
	# settlements = AfgPpla.objects.filter(Q(vuid__in=[r.scre_settvuid for r in paged_search_result_list]))
	for result in paged_search_result_list:
		result.recstatus_text = recstatus_choices_dict[str(result.recstatus)]
		# result.sett_name = (s for s in settlements if s.vuid == result.scre_settvuid).next().name_en
		adm_names = result.scre_placename.split(',')
		result.prov_name = adm_names[0].strip() if len(adm_names) > 0 else None
		result.dist_name = adm_names[1].strip() if len(adm_names) > 1 else None
		result.sett_name = adm_names[2].strip() if len(adm_names) > 2 else None

	render_data = {
		'form': form,
		'search_result_list': paged_search_result_list,
		'criteria': criteria,
		'has_delete': has_delete,
		'recstatus_choices': recstatus_choices_all,
		'rsc': {recstatus: 'badge'},
	}
	return render(request, 'searchform.html', render_data)

def scresysed(request, criteria_id=None):
    initial = {}
    editmode = True if (criteria_id) else False
    if editmode:
    	instance = SecureFeature.objects.get(id=criteria_id)

    	# vuid to ogc_fid, scre_settvuid is saved as vuid but displayed as ogc_fid
    	sett = AfgPplp.objects.get(vuid=instance.scre_settvuid)
    	instance.scre_settvuid = sett.ogc_fid
    else: # new entry mode
    	instance = SecureFeature()
    	initial['scre_username'] = request.user.username
    	# initial['recstatus'] = 1 # default

    # current user is entry creator flag
    iscreator = False if editmode and request.user.username != instance.scre_username else True

    # has_delete_right flag
    has_delete_right = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())

    # disable fields flag
    readonly = True if not has_delete_right and editmode and not iscreator else False

    if request.POST:

        # pass values for form validation
        initial['scre_provid'] = request.POST['scre_provid']
        initial['scre_distid'] = request.POST['scre_distid']

        form = SecureFeatureForm(request.POST, instance=instance, initial=initial)

        # exclude username input field to prevent altering
        del form.fields['scre_username']

        # exclude recstatus field if common user
        if not has_delete_right:
            del form.fields['recstatus']

        if form.is_valid():

        	# ogc_fid to vuid, do this after form validation to avoid error
        	settp = AfgPplp.objects.get(ogc_fid=request.POST['scre_settvuid'])
        	if (settp.vuid):
        		vuid = settp.vuid
        	else:
        		pnt_wkt = 'POINT('+str(settp.lon_x)+' '+str(settp.lat_y)+')'
        		setta = AfgPpla.objects.get(wkb_geometry__contains=pnt_wkt)
        		vuid = setta.vuid

        	frm_incdtstr=request.POST.get('scre_incidentdatestr', '')
        	frm_inctmstr=request.POST.get('scre_incidenttimestr', '')
        	frm_lat = request.POST.get('scre_latitude', '0')
        	frm_lon = request.POST.get('scre_longitude', '0')

        	obj = form.save(commit=False) # use this to assign values to excluded fields
        	obj.scre_incidentdate = frm_incdtstr + " " + frm_inctmstr
        	obj.mpoint = fromstr('Point(' + frm_lon + ' ' + frm_lat + ')') if frm_lon and frm_lat else None
        	obj.scre_settvuid = vuid
        	if obj.id: # edit existing
        		obj.userud = request.user.id
        		obj.updatedatetime = datetime.datetime.today()
        		if not has_delete_right: # for regular user edit will set recstatus to 1
        		    obj.recstatus = 1
        	else: # is new entry
        		obj.scre_username = request.user.username
        		obj.userid = request.user.id
        		obj.entrydatetime = datetime.datetime.today()
        	if obj.recstatus is None:
        		obj.recstatus = 1

        	form.save()

        	return HttpResponseRedirect('/securitydb/list/')
        else:
        	print '\n', 'form not valid'
        	formerrors =  dict(form.errors.items())
        	for key in formerrors:
        		print '%s: %s' % (key, formerrors[key].as_text())
    else:
        form = SecureFeatureForm(instance=instance, initial=initial)

    #  exclude recstatus field if not has_delete_right
    if not has_delete_right: # is common user
        if 'recstatus' in form.fields:
            del form.fields['recstatus']

    # disable input fields if readonly
    if (readonly):
        for key, field in form.fields.iteritems():
            field.widget.attrs['disabled'] = 'disabled'

    return render(
        request,
        'editform.html',
        {'form': form, 'readonly': readonly}
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
