from geodb.models import AfgFldzonea100KRiskLandcoverPop, FloodRiskExposure, AfgLndcrva, LandcoverDescription, AfgAvsa, AfgAdmbndaAdm1, AfgAdmbndaAdm2, AfgPplp, earthquake_shakemap, earthquake_events, villagesummaryEQ, AfgRdsl, AfgHltfac, forecastedLastUpdate, provincesummary, AfgCaptAdm1ItsProvcImmap, AfgCaptAdm1NearestProvcImmap, AfgCaptAdm2NearestDistrictcImmap, AfgCaptAirdrmImmap, AfgCaptHltfacTier1Immap, AfgCaptHltfacTier2Immap, tempCurrentSC, AfgCaptHltfacTier3Immap, AfgCaptHltfacTierallImmap, AfgIncidentOasis, AfgCapaGsmcvr, AfgAirdrmp
import json
import time, datetime
from tastypie.resources import ModelResource, Resource
from tastypie.serializers import Serializer
from tastypie import fields
from tastypie.constants import ALL
from django.db.models import Count, Sum
from django.core.serializers.json import DjangoJSONEncoder
from tastypie.authorization import DjangoAuthorization
from urlparse import urlparse
from geonode.maps.models import Map
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW
from django.db import connection, connections
from itertools import *
# addded by boedy
from matrix.models import matrix
from tastypie.cache import SimpleCache
from pytz import timezone, all_timezones
from django.http import HttpResponse

from djgeojson.serializers import Serializer as GeoJSONSerializer

from geodb.geoapi import getRiskNumber, getAccessibilities, getEarthQuakeExecuteExternal

from graphos.sources.model import ModelDataSource
from graphos.renderers import flot, gchart
from graphos.sources.simple import SimpleDataSource
from django.test import RequestFactory
import urllib2, urllib
import pygal
from geodb.radarchart import RadarChart
from geodb.riverflood import getFloodForecastBySource

from django.utils.translation import ugettext as _

def query_to_dicts(cursor, query_string, *query_args):
    """Run a simple query and produce a generator
    that returns the results as a bunch of dictionaries
    with keys for the column values selected.
    """
    cursor.execute(query_string, query_args)
    col_names = [desc[0] for desc in cursor.description]
    while True:
        row = cursor.fetchone()
        if row is None:
            break
        row_dict = dict(izip(col_names, row))
        yield row_dict
    return

def getCommonUse(request,flag, code):
    response = {}
    response['parent_label']=_('Custom Selection')
    response['qlinks']=_('Select provinces')
    response['adm_child'] = []
    response['adm_prov'] = []
    response['adm_dist'] = []
    # response['parent_label_dash']='Custom Selection'

    # if flag == 'entireAfg':
    #     response['parent_label']='Afghanistan'
    #     response['parent_label_dash']='Afghanistan'
    # elif flag == 'currentProvince':
    #     if code<=34:
    #         lblTMP = AfgAdmbndaAdm1.objects.filter(prov_code=code)
    #         response['parent_label_dash'] = 'Afghanistan - '+lblTMP[0].prov_na_en
    #         response['parent_label'] = lblTMP[0].prov_na_en
    #     else:
    #         lblTMP = AfgAdmbndaAdm2.objects.filter(dist_code=code)
    #         response['parent_label_dash'] = 'Afghanistan - '+ lblTMP[0].prov_na_en + ' - ' +lblTMP[0].dist_na_en
    #         response['parent_label'] = lblTMP[0].dist_na_en

    main_resource = AfgAdmbndaAdm1.objects.all().values('prov_code','prov_na_en').order_by('prov_na_en')
    # clusterPoints = AfgAdmbndaAdm1.objects.all()
    response['parent_label_dash']=[]
    if flag == 'entireAfg':
        response['parent_label']=_('Afghanistan')
        response['parent_label_dash'].append({'name':_('Afghanistan'),'query':'','code':0})
        response['qlinks']=_('Select province')
        resource = main_resource
        # clusterPoints = AfgAdmbndaAdm1.objects.all()
        for i in resource:
            response['adm_child'].append({'code':i['prov_code'],'name':i['prov_na_en']})
    elif flag == 'currentProvince':
        if code<=34:
            lblTMP = AfgAdmbndaAdm1.objects.filter(prov_code=code)
            response['parent_label_dash'].append({'name':_('Afghanistan'),'query':'','code':0})
            response['parent_label_dash'].append({'name':lblTMP[0].prov_na_en,'query':'&code='+str(code),'code':code})
            response['parent_label'] = lblTMP[0].prov_na_en
            response['qlinks']=_('Select district')
            resource = AfgAdmbndaAdm2.objects.all().values('dist_code','dist_na_en').filter(prov_code=code).order_by('dist_na_en')
            # clusterPoints = AfgAdmbndaAdm2.objects.all()
            for i in resource:
                response['adm_child'].append({'code':i['dist_code'],'name':i['dist_na_en']})
            for i in main_resource:
                response['adm_prov'].append({'code':i['prov_code'],'name':i['prov_na_en']})
        else:
            lblTMP = AfgAdmbndaAdm2.objects.filter(dist_code=code)
            response['parent_label_dash'].append({'name':_('Afghanistan'),'query':'','code':0})
            response['parent_label_dash'].append({'name':lblTMP[0].prov_na_en,'query':'&code='+str(lblTMP[0].prov_code),'code':lblTMP[0].prov_code})
            response['parent_label_dash'].append({'name':lblTMP[0].dist_na_en,'query':'&code='+str(code),'code':code})
            response['parent_label'] = lblTMP[0].dist_na_en
            response['qlinks']=''
            for i in main_resource:
                response['adm_prov'].append({'code':i['prov_code'],'name':i['prov_na_en']})
            resource = AfgAdmbndaAdm2.objects.all().values('dist_code','dist_na_en').filter(prov_code=lblTMP[0].prov_code).order_by('dist_na_en')
            for i in resource:
                response['adm_dist'].append({'code':i['dist_code'],'name':i['dist_na_en']})
    else:
        response['parent_label_dash'].append({'name':_('Custom Selection'),'query':'','code':0})
        response['qlinks']=''

    # response['poi_points'] = []
    # for i in clusterPoints:
    #     response['poi_points'].append({'code':i.prov_code,'x':i.wkb_geometry.point_on_surface.x,'y':i.wkb_geometry.point_on_surface.y})
    return response

def getSecurity(request, filterLock, flag, code):
    rawFilterLock = None
    if 'flag' in request.GET:
        rawFilterLock = filterLock
        filterLock = 'ST_GeomFromText(\''+filterLock+'\',4326)'

    response = getCommonUse(request, flag, code)

    enddate = datetime.date.today()
    startdate = datetime.date.today() - datetime.timedelta(days=365)
    daterange = startdate.strftime("%Y-%m-%d")+','+enddate.strftime("%Y-%m-%d")



    if 'daterange' in request.GET:
        daterange = request.GET['daterange']



    rawCasualties = getIncidentCasualties(request, daterange, rawFilterLock, flag, code)
    for i in rawCasualties:
        response[i]=rawCasualties[i]

    # dataHLT = []
    # dataHLT.append(['', '# of',  { 'role': 'annotation' }])
    # dataHLT.append(['Death',rawCasualties['total_dead'], rawCasualties['total_dead'] ])
    # dataHLT.append(['Violent',rawCasualties['total_violent'], rawCasualties['total_violent'] ])
    # dataHLT.append(['Injured',rawCasualties['total_injured'], rawCasualties['total_injured'] ])
    # dataHLT.append(['# Incidents',rawCasualties['total_incident'], rawCasualties['total_incident'] ])
    # response['casualties_chart'] = gchart.BarChart(
    #     SimpleDataSource(data=dataHLT),
    #     html_id="pie_chart1",
    #     options={
    #         'title': 'Security Incident Overview',
    #         'width': 300,
    #         'height': 300,
    #         'legend': { 'position': 'none' },

    #         'bars': 'horizontal',
    #         'axes': {
    #             'x': {
    #               '0': { 'side': 'top', 'label': '# of Casualties and Incident'}
    #             },

    #         },
    #         'bar': { 'groupWidth': '90%' },
    #         'chartArea': {'width': '50%'},
    #         'titleX':'# of Casualties and Incident',
    # })

    response['main_type_child'] = getSAMParams(request, daterange, rawFilterLock, flag, code, 'main_type', False)
    main_type_raw_data = getSAMParams(request, daterange, rawFilterLock, flag, code, 'main_type', True)

    data_main_type = []
    # data_main_type.append(['', 'incident',{ 'role': 'annotation' }, 'dead',{ 'role': 'annotation' }, 'violent',{ 'role': 'annotation' }, 'injured',{ 'role': 'annotation' } ])
    # for type_item in main_type_raw_data:
    #     data_main_type.append([type_item['main_type'],type_item['count'],type_item['count'], type_item['dead'], type_item['dead'], type_item['violent']+type_item['affected'], type_item['violent']+type_item['affected'], type_item['injured'], type_item['injured'] ])
    # response['main_type_chart'] = gchart.BarChart(
    #     SimpleDataSource(data=data_main_type),
    #     html_id="pie_chart2",
    #     options={
    #         'title': 'Incident type overview and casualties',
    #         'width': 450,
    #         'height': 450,
    #         'isStacked':'true',
    #         'bars': 'horizontal',
    #         'axes': {
    #             'x': {
    #               '0': { 'side': 'top', 'label': '# of Casualties and Incident'}
    #             },

    #         },
    #         'annotations': {
    #             'textStyle': {
    #                 'fontSize':7
    #             }
    #         },
    #         'bar': { 'groupWidth': '90%' },
    #         'chartArea': {'width': '60%', 'height': '90%'},
    #         'titleX':'# of incident and casualties',
    # })

    data_main_type.append(['TYPE', 'incident', 'dead', 'violent', 'injured' ])
    for type_item in main_type_raw_data:
        data_main_type.append([type_item['main_type'],type_item['count'], type_item['dead'], type_item['violent']+type_item['affected'], type_item['injured'] ])
    response['main_type_chart'] = RadarChart(SimpleDataSource(data=data_main_type),
            html_id="pie_chart2",
            options={
                'title': _('Number of Incident by Incident Type'),
                'col-included' : [
                    {'col-no':1,'name':_('Incidents'),'fill':True}
                ]
            }
        ).get_image()

    response['dead_casualties_type_chart'] = RadarChart(SimpleDataSource(data=data_main_type),
            html_id="pie_chart4",
            options={
                'title': _('Number of dead casualties by Incident Type'),
                'col-included' : [
                    {'col-no':2,'name':_('Dead'),'fill':True}
                ]
            }
        ).get_image()

    response['injured_casualties_type_chart'] = RadarChart(SimpleDataSource(data=data_main_type),
            html_id="pie_chart4",
            options={
                'title': _('Number of injured casualties by Incident Type'),
                'col-included' : [
                    {'col-no':4,'name':_('Violent'),'fill':True}
                ]
            }
        ).get_image()

    response['violent_casualties_type_chart'] = RadarChart(SimpleDataSource(data=data_main_type),
            html_id="pie_chart4",
            options={
                'title': _('Number of affected person by Incident Type'),
                'col-included' : [
                    {'col-no':3,'name':_('Injured'),'fill':True}
                ]
            }
        ).get_image()

    response['main_target_child'] = getSAMParams(request, daterange, rawFilterLock, flag, code, 'main_target', False)
    main_target_raw_data = getSAMParams(request, daterange, rawFilterLock, flag, code, 'main_target', True)
    data_main_target = []
    # data_main_target.append(['', 'incident',{ 'role': 'annotation' }, 'dead',{ 'role': 'annotation' }, 'violent',{ 'role': 'annotation' }, 'injured',{ 'role': 'annotation' } ])
    # for type_item in main_target_raw_data:
    #      data_main_target.append([type_item['main_target'],type_item['count'],type_item['count'], type_item['dead'], type_item['dead'], type_item['violent']+type_item['affected'], type_item['violent']+type_item['affected'], type_item['injured'], type_item['injured'] ])

    # response['main_target_chart'] = gchart.BarChart(
    #     SimpleDataSource(data=data_main_target),
    #     html_id="pie_chart3",
    #     options={
    #         'title': 'Incident target overview and casualties',
    #         'width': 450,
    #         'height': 450,
    #         # 'legend': { 'position': 'none' },
    #         'isStacked':'true',
    #         'bars': 'horizontal',
    #         'axes': {
    #             'x': {
    #               '0': { 'side': 'top', 'label': '# of Casualties and Incident'}
    #             },

    #         },
    #         'annotations': {
    #             'textStyle': {
    #                 'fontSize':7
    #             }
    #         },
    #         'bar': { 'groupWidth': '90%' },
    #         'chartArea': {'width': '60%', 'height': '90%'},
    #         'titleX':'# of incident and casualties',
    # })
    data_main_target.append(['Target', 'incident', 'dead', 'violent', 'injured' ])
    for type_item in main_target_raw_data:
         data_main_target.append([type_item['main_target'],type_item['count'], type_item['dead'], type_item['violent']+type_item['affected'], type_item['injured'] ])
    response['main_target_chart'] = RadarChart(SimpleDataSource(data=data_main_target),
            html_id="pie_chart3",
            options={
                'title': _('Number of Incident by Incident Target'),
                'col-included' : [
                    {'col-no':1,'name':_('Incidents'),'fill':True}
                ]
            }
        ).get_image()

    response['dead_casualties_target_chart'] = RadarChart(SimpleDataSource(data=data_main_target),
            html_id="pie_chart4",
            options={
                'title': _('Number of dead casualties by Incident Target'),
                'col-included' : [
                    {'col-no':2,'name':_('Dead'),'fill':True}
                ]
            }
        ).get_image()

    response['injured_casualties_target_chart'] = RadarChart(SimpleDataSource(data=data_main_target),
            html_id="pie_chart4",
            options={
                'title': _('Number of injured casualties by Incident Target'),
                'col-included' : [
                    {'col-no':4,'name':_('Injured'),'fill':True}
                ]
            }
        ).get_image()

    response['violent_casualties_target_chart'] = RadarChart(SimpleDataSource(data=data_main_target),
            html_id="pie_chart4",
            options={
                'title': _('Number of affected person by Incident Target'),
                'col-included' : [
                    {'col-no':3,'name':_('Injured'),'fill':True}
                ]
            }
        ).get_image()


    response['incident_type'] = []
    response['incident_target'] = []

    for i in response['main_type_child']:
        response['incident_type'].append(i['main_type'])

    for i in response['main_target_child']:
        response['incident_target'].append(i['main_target'])

    if 'incident_type' in request.GET:
        response['incident_type'] = request.GET['incident_type'].split(',')
        print response['incident_type']

    if 'incident_target' in request.GET:
        response['incident_target'] = request.GET['incident_target'].split(',')
        print response['incident_target']

    data = getListIncidentCasualties(request, daterange, rawFilterLock, flag, code)
    response['lc_child']=data

    response['incident_type_group']=[]
    for i in main_type_raw_data:
        response['incident_type_group'].append({'count':i['count'],'injured':i['injured'],'violent':i['violent']+i['affected'],'dead':i['dead'],'main_type':i['main_type'],'child':getSAMIncident(request, daterange, rawFilterLock, flag, code, 'type', i['main_type'])})

    response['incident_target_group']=[]
    for i in main_target_raw_data:
        response['incident_target_group'].append({'count':i['count'],'injured':i['injured'],'violent':i['violent']+i['affected'],'dead':i['dead'],'main_target':i['main_target'],'child':getSAMIncident(request, daterange, rawFilterLock, flag, code, 'target', i['main_target'])})

    response['incident_list_100'] = getListIncidents(request, daterange, rawFilterLock, flag, code)

    return response

def getListIncidentCasualties(request, daterange, filterLock, flag, code):
    response = []
    data = getProvinceSummary(filterLock, flag, code)
    for i in data:
        data ={}
        data['code'] = i['code']
        data['na_en'] = i['na_en']
        data['Population'] = i['Population']
        data['Area'] = i['Area']

        rawCasualties = getIncidentCasualties(request, daterange, filterLock, 'currentProvince', i['code'])
        for x in rawCasualties:
            data[x]=rawCasualties[x]

        response.append(data)
    return response

def getListIncidents(request, daterange, filterLock, flag, code):
    response = {}

    resource = AfgIncidentOasis.objects.all()
    date = daterange.split(',')

    if flag=='entireAfg':
        filterLock = ''
    elif flag =='currentProvince':
        filterLock = ''
        if len(str(code)) > 2:
            resource = resource.filter(dist_code=code)
        else :
            resource = resource.filter(prov_code=code)
    else:
        filterLock = filterLock

    if filterLock!='':
        resource = resource.filter(wkb_geometry__intersects=filterLock)

    if 'incident_type' in request.GET:
        resource = resource.filter(main_type__in=request.GET['incident_type'].split(','))

    if 'incident_target' in request.GET:
        resource = resource.filter(main_target__in=request.GET['incident_target'].split(','))

    resource = resource.filter(incident_date__gt=date[0],incident_date__lt=date[1]).order_by('-incident_date')

    resource = resource.values('incident_date','description')[:100]
    return resource

def getSAMIncident(request, daterange, filterLock, flag, code, group, filter):
    response = {}
    if group == 'type':
        resource = AfgIncidentOasis.objects.all().filter(main_type=filter)
    elif group == 'target':
        resource = AfgIncidentOasis.objects.all().filter(main_target=filter)
    date = daterange.split(',')

    if flag=='entireAfg':
        filterLock = ''
    elif flag =='currentProvince':
        filterLock = ''
        if len(str(code)) > 2:
            resource = resource.filter(dist_code=code)
        else :
            resource = resource.filter(prov_code=code)
    else:
        filterLock = filterLock

    if filterLock!='':
        resource = resource.filter(wkb_geometry__intersects=filterLock)

    if 'incident_type' in request.GET:
        resource = resource.filter(main_type__in=request.GET['incident_type'].split(','))

    if 'incident_target' in request.GET:
        resource = resource.filter(main_target__in=request.GET['incident_target'].split(','))

    resource = resource.filter(incident_date__gt=date[0],incident_date__lt=date[1])
    resource = resource.values(group).annotate(count=Count('uid'), affected=Sum('affected'), injured=Sum('injured'), violent=Sum('violent'), dead=Sum('dead')).order_by(group)

    return resource

def getSAMParams(request, daterange, filterLock, flag, code, group, includeFilter):
    response = {}
    resource = AfgIncidentOasis.objects.all()
    date = daterange.split(',')

    if flag=='entireAfg':
        filterLock = ''
    elif flag =='currentProvince':
        filterLock = ''
        if len(str(code)) > 2:
            resource = resource.filter(dist_code=code)
        else :
            resource = resource.filter(prov_code=code)
    else:
        filterLock = filterLock

    if filterLock!='':
        resource = resource.filter(wkb_geometry__intersects=filterLock)

    if includeFilter and 'incident_type' in request.GET:
        resource = resource.filter(main_type__in=request.GET['incident_type'].split(','))

    if includeFilter and 'incident_target' in request.GET:
        resource = resource.filter(main_target__in=request.GET['incident_target'].split(','))

    resource = resource.filter(incident_date__gt=date[0],incident_date__lt=date[1])
    resource = resource.values(group).annotate(count=Count('uid'), affected=Sum('affected'), injured=Sum('injured'), violent=Sum('violent'), dead=Sum('dead')).order_by(group)

    return resource


def getIncidentCasualties(request, daterange, filterLock, flag, code):
    response = {}
    resource = AfgIncidentOasis.objects.all()
    date = daterange.split(',')

    if flag=='entireAfg':
        filterLock = ''
    elif flag =='currentProvince':
        filterLock = ''
        if len(str(code)) > 2:
            resource = resource.filter(dist_code=code)
        else :
            resource = resource.filter(prov_code=code)
    else:
        filterLock = filterLock

    if filterLock!='':
        resource = resource.filter(wkb_geometry__intersects=filterLock)

    resource = resource.filter(incident_date__gt=date[0],incident_date__lt=date[1])

    if 'incident_type' in request.GET:
        resource = resource.filter(main_type__in=request.GET['incident_type'].split(','))

    if 'incident_target' in request.GET:
        resource = resource.filter(main_target__in=request.GET['incident_target'].split(','))

    resource = resource.aggregate(count=Count('uid'), affected=Sum('affected'), injured=Sum('injured'), violent=Sum('violent'), dead=Sum('dead'))

    response['total_incident'] = resource['count'] if resource['count'] != None else 0
    response['total_injured'] = resource['injured'] if resource['injured'] != None else 0
    response['total_violent'] = resource['violent'] if resource['violent'] != None else 0 +resource['affected'] if resource['affected'] != None else 0
    response['total_dead'] = resource['dead'] if resource['dead'] != None else 0

    return response

def getEarthquake(request, filterLock, flag, code):

    eq_event = ''
    if 'eq_event' in request.GET:
        eq_event = request.GET['eq_event']

    response = getCommonUse(request, flag, code)
    targetBase = AfgLndcrva.objects.all()

    response['Population']=getTotalPop(filterLock, flag, code, targetBase)
    response['Area']=getTotalArea(filterLock, flag, code, targetBase)
    response['settlement']=getTotalSettlement(filterLock, flag, code, targetBase)

    url = 'http://asdc.immap.org/geoapi/geteqevents/?dateofevent__gte=2015-09-08&_dc=1473243793279'
    req = urllib2.Request(url)
    req.add_unredirected_header('User-Agent', 'Custom User-Agent')
    fh = urllib2.urlopen(req)
    data = fh.read()
    fh.close()
    jdict = json.loads(data)

    response['eq_list'] = []
    pertama = True

    response['EQ_title'] = ''
    response['eq_link'] = ''

    for x in reversed(jdict['objects']):
        if eq_event != '':
            if x['event_code'] == eq_event:
                x['selected']=True
                response['EQ_title'] = x['detail_title']
            else:
                x['selected']=False
            response['eq_link'] = '&eq_event='+eq_event
        else:
            if pertama:
                x['selected']=True
                pertama = False
                eq_event = x['event_code']
                response['EQ_title'] = x['detail_title']
                response['eq_link'] = '&eq_event='+eq_event
            else:
                x['selected']=False

        response['eq_list'].append(x)

    rawEarthquake = getEQData(filterLock, flag, code, eq_event)


    for i in rawEarthquake:
        response[i]=rawEarthquake[i]

    dataEQ = []
    dataEQ.append(['intensity','population'])
    dataEQ.append(['II-III : Weak',response['pop_shake_weak'] if 'pop_shake_weak' in response else 0])
    dataEQ.append(['IV : Light',response['pop_shake_light'] if 'pop_shake_light' in response else 0])
    dataEQ.append(['V : Moderate',response['pop_shake_moderate'] if 'pop_shake_moderate' in response else 0])
    dataEQ.append(['VI : Strong',response['pop_shake_strong'] if 'pop_shake_strong' in response else 0])
    dataEQ.append(['VII : Very-strong',response['pop_shake_verystrong'] if 'pop_shake_verystrong' in response else 0])
    dataEQ.append(['VIII : Severe',response['pop_shake_severe'] if 'pop_shake_severe' in response else 0])
    dataEQ.append(['IX : Violent',response['pop_shake_violent'] if 'pop_shake_violent' in response else 0])
    dataEQ.append(['X+ : Extreme',response['pop_shake_extreme'] if 'pop_shake_extreme' in response else 0])
    response['EQ_chart'] = gchart.PieChart(SimpleDataSource(data=dataEQ), html_id="pie_chart1", options={'title': response['EQ_title'], 'width': 450,'height': 300, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'right', 'maxLines':4}, 'slices':{0:{'color':'#c4ceff'},1:{'color':'#7cfddf'},2:{'color':'#b1ff55'},3:{'color':'#fcf109'},4:{'color':'#ffb700'},5:{'color':'#fd6500'},6:{'color':'#ff1f00'},7:{'color':'#d20003'}} })

    response['total_eq_pop'] = response['pop_shake_weak']+response['pop_shake_light']+response['pop_shake_moderate']+response['pop_shake_strong']+response['pop_shake_verystrong']+response['pop_shake_severe']+response['pop_shake_violent']+response['pop_shake_extreme']
    response['total_eq_settlements'] = response['settlement_shake_weak']+response['settlement_shake_light']+response['settlement_shake_moderate']+response['settlement_shake_strong']+response['settlement_shake_verystrong']+response['settlement_shake_severe']+response['settlement_shake_violent']+response['settlement_shake_extreme']

    data = getListEQ(filterLock, flag, code, eq_event)
    response['lc_child']=data

    return response

def getListEQ(filterLock, flag, code, eq_event):
    response = []
    data = getProvinceSummary(filterLock, flag, code)
    for i in data:
        data ={}
        data['code'] = i['code']
        data['na_en'] = i['na_en']
        data['Population'] = i['Population']
        data['Area'] = i['Area']

        rawEarthquake = getEQData(filterLock, 'currentProvince', i['code'], eq_event)
        for x in rawEarthquake:
            data[x]=rawEarthquake[x]

        response.append(data)
    return response

def getEQData(filterLock, flag, code, event_code):
    p = earthquake_shakemap.objects.all().filter(event_code=event_code)
    if p.count() == 0:
        return {
            'pop_shake_weak':0,
            'pop_shake_light':0,
            'pop_shake_moderate':0,
            'pop_shake_strong':0,
            'pop_shake_verystrong':0,
            'pop_shake_severe':0,
            'pop_shake_violent':0,
            'pop_shake_extreme':0,
            'settlement_shake_weak':0,
            'settlement_shake_light':0,
            'settlement_shake_moderate':0,
            'settlement_shake_strong':0,
            'settlement_shake_verystrong':0,
            'settlement_shake_severe':0,
            'settlement_shake_violent':0,
            'settlement_shake_extreme':0
        }

    if flag=='drawArea':
        cursor = connections['geodb'].cursor()
        cursor.execute("\
            select coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_weak \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_weak \
                end \
            )),0) as pop_shake_weak,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_light \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_light \
                end \
            )),0) as pop_shake_light,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_moderate \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_moderate \
                end \
            )),0) as pop_shake_moderate,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_strong \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_strong \
                end \
            )),0) as pop_shake_strong,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_verystrong \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_verystrong \
                end \
            )),0) as pop_shake_verystrong,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_severe \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_severe \
                end \
            )),0) as pop_shake_severe,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_violent \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_violent \
                end \
            )),0) as pop_shake_violent,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.pop_shake_extreme \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.pop_shake_extreme \
                end \
            )),0) as pop_shake_extreme,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_weak \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_weak \
                end \
            )),0) as settlement_shake_weak,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_light \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_light \
                end \
            )),0) as settlement_shake_light,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_moderate \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_moderate \
                end \
            )),0) as settlement_shake_moderate,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_strong \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_strong \
                end \
            )),0) as settlement_shake_strong,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_verystrong \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_verystrong \
                end \
            )),0) as settlement_shake_verystrong,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_severe \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_severe \
                end \
            )),0) as settlement_shake_severe,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_violent \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_violent \
                end \
            )),0) as settlement_shake_violent,     \
            coalesce(round(sum(   \
                case    \
                    when ST_CoveredBy(a.wkb_geometry,"+filterLock+") then b.settlement_shake_extreme \
                    else st_area(st_intersection(a.wkb_geometry,"+filterLock+"))/st_area(a.wkb_geometry)*b.settlement_shake_extreme \
                end \
            )),0) as settlement_shake_extreme     \
            from afg_ppla a, villagesummary_eq b   \
            where  a.vuid = b.village and b.event_code = '"+event_code+"'  \
            and ST_Intersects(a.wkb_geometry,"+filterLock+")    \
        ")
        col_names = [desc[0] for desc in cursor.description]

        row = cursor.fetchone()
        row_dict = dict(izip(col_names, row))

        cursor.close()
        counts={}
        counts[0] = row_dict

    elif flag=='entireAfg':
        counts = list(villagesummaryEQ.objects.all().extra(
            select={
                'pop_shake_weak' : 'coalesce(SUM(pop_shake_weak),0)',
                'pop_shake_light' : 'coalesce(SUM(pop_shake_light),0)',
                'pop_shake_moderate' : 'coalesce(SUM(pop_shake_moderate),0)',
                'pop_shake_strong' : 'coalesce(SUM(pop_shake_strong),0)',
                'pop_shake_verystrong' : 'coalesce(SUM(pop_shake_verystrong),0)',
                'pop_shake_severe' : 'coalesce(SUM(pop_shake_severe),0)',
                'pop_shake_violent' : 'coalesce(SUM(pop_shake_violent),0)',
                'pop_shake_extreme' : 'coalesce(SUM(pop_shake_extreme),0)',

                'settlement_shake_weak' : 'coalesce(SUM(settlement_shake_weak),0)',
                'settlement_shake_light' : 'coalesce(SUM(settlement_shake_light),0)',
                'settlement_shake_moderate' : 'coalesce(SUM(settlement_shake_moderate),0)',
                'settlement_shake_strong' : 'coalesce(SUM(settlement_shake_strong),0)',
                'settlement_shake_verystrong' : 'coalesce(SUM(settlement_shake_verystrong),0)',
                'settlement_shake_severe' : 'coalesce(SUM(settlement_shake_severe),0)',
                'settlement_shake_violent' : 'coalesce(SUM(settlement_shake_violent),0)',
                'settlement_shake_extreme' : 'coalesce(SUM(settlement_shake_extreme),0)'
            },
            where = {
                "event_code = '"+event_code+"'"
            }).values(
                'pop_shake_weak',
                'pop_shake_light',
                'pop_shake_moderate',
                'pop_shake_strong',
                'pop_shake_verystrong',
                'pop_shake_severe',
                'pop_shake_violent',
                'pop_shake_extreme',
                'settlement_shake_weak',
                'settlement_shake_light',
                'settlement_shake_moderate',
                'settlement_shake_strong',
                'settlement_shake_verystrong',
                'settlement_shake_severe',
                'settlement_shake_violent',
                'settlement_shake_extreme'
            ))
    elif flag =='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "district  = '"+str(code)+"'"
        else :
            ff0001 =  "left(cast(district as text), "+str(len(str(code)))+") = '"+str(code)+"' and length(cast(district as text))="+ str(len(str(code))+2)
        counts = list(villagesummaryEQ.objects.all().extra(
            select={
                'pop_shake_weak' : 'coalesce(SUM(pop_shake_weak),0)',
                'pop_shake_light' : 'coalesce(SUM(pop_shake_light),0)',
                'pop_shake_moderate' : 'coalesce(SUM(pop_shake_moderate),0)',
                'pop_shake_strong' : 'coalesce(SUM(pop_shake_strong),0)',
                'pop_shake_verystrong' : 'coalesce(SUM(pop_shake_verystrong),0)',
                'pop_shake_severe' : 'coalesce(SUM(pop_shake_severe),0)',
                'pop_shake_violent' : 'coalesce(SUM(pop_shake_violent),0)',
                'pop_shake_extreme' : 'coalesce(SUM(pop_shake_extreme),0)',

                'settlement_shake_weak' : 'coalesce(SUM(settlement_shake_weak),0)',
                'settlement_shake_light' : 'coalesce(SUM(settlement_shake_light),0)',
                'settlement_shake_moderate' : 'coalesce(SUM(settlement_shake_moderate),0)',
                'settlement_shake_strong' : 'coalesce(SUM(settlement_shake_strong),0)',
                'settlement_shake_verystrong' : 'coalesce(SUM(settlement_shake_verystrong),0)',
                'settlement_shake_severe' : 'coalesce(SUM(settlement_shake_severe),0)',
                'settlement_shake_violent' : 'coalesce(SUM(settlement_shake_violent),0)',
                'settlement_shake_extreme' : 'coalesce(SUM(settlement_shake_extreme),0)'
            },
            where = {
                "event_code = '"+event_code+"' and "+ff0001
            }).values(
                'pop_shake_weak',
                'pop_shake_light',
                'pop_shake_moderate',
                'pop_shake_strong',
                'pop_shake_verystrong',
                'pop_shake_severe',
                'pop_shake_violent',
                'pop_shake_extreme',
                'settlement_shake_weak',
                'settlement_shake_light',
                'settlement_shake_moderate',
                'settlement_shake_strong',
                'settlement_shake_verystrong',
                'settlement_shake_severe',
                'settlement_shake_violent',
                'settlement_shake_extreme'
            ))
    else:
        cursor = connections['geodb'].cursor()
        cursor.execute("\
            select coalesce(round(sum(b.pop_shake_weak)),0) as pop_shake_weak,     \
            coalesce(round(sum(b.pop_shake_light)),0) as pop_shake_light,     \
            coalesce(round(sum(b.pop_shake_moderate)),0) as pop_shake_moderate,     \
            coalesce(round(sum(b.pop_shake_strong)),0) as pop_shake_strong,     \
            coalesce(round(sum(b.pop_shake_verystrong)),0) as pop_shake_verystrong,     \
            coalesce(round(sum(b.pop_shake_severe)),0) as pop_shake_severe,     \
            coalesce(round(sum(b.pop_shake_violent)),0) as pop_shake_violent,     \
            coalesce(round(sum(b.pop_shake_extreme)),0) as pop_shake_extreme,     \
            coalesce(round(sum(b.settlement_shake_weak)),0) as settlement_shake_weak,     \
            coalesce(round(sum(b.settlement_shake_light)),0) as settlement_shake_light,     \
            coalesce(round(sum(b.settlement_shake_moderate)),0) as settlement_shake_moderate,     \
            coalesce(round(sum(b.settlement_shake_strong)),0) as settlement_shake_strong,     \
            coalesce(round(sum(b.settlement_shake_verystrong)),0) as settlement_shake_verystrong,     \
            coalesce(round(sum(b.settlement_shake_severe)),0) as settlement_shake_severe,     \
            coalesce(round(sum(b.settlement_shake_violent)),0) as settlement_shake_violent,     \
            coalesce(round(sum(b.settlement_shake_extreme)),0) as settlement_shake_extreme     \
            from afg_ppla a, villagesummary_eq b   \
            where  a.vuid = b.village and b.event_code = '"+event_code+"'  \
            and ST_Within(a.wkb_geometry,"+filterLock+")    \
        ")
        col_names = [desc[0] for desc in cursor.description]

        row = cursor.fetchone()
        row_dict = dict(izip(col_names, row))

        cursor.close()
        counts={}
        counts[0] = row_dict

    return counts[0]

def GetAccesibilityData(filterLock, flag, code):
    response = {}
    if flag=='entireAfg':
        q1 = AfgCaptAdm1ItsProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'),buildings=Sum('area_buildings'))
        q2 = AfgCaptAdm1NearestProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'),buildings=Sum('area_buildings'))
        q3 = AfgCaptAdm2NearestDistrictcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'),buildings=Sum('area_buildings'))
        q4 = AfgCaptAirdrmImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'))
        q5 = AfgCaptHltfacTier1Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population'),buildings=Sum('area_buildings'))
        q6 = AfgCaptHltfacTier2Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population'),buildings=Sum('area_buildings'))
        q7 = AfgCaptHltfacTier3Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population'),buildings=Sum('area_buildings'))
        q8 = AfgCaptHltfacTierallImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population'),buildings=Sum('area_buildings'))
        gsm = AfgCapaGsmcvr.objects.all().aggregate(pop=Sum('gsm_coverage_population'),area=Sum('gsm_coverage_area_sqm'),buildings=Sum('area_buildings'))

    elif flag =='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 =  "left(cast(dist_code as text), "+str(len(str(code)))+") = '"+str(code)+"' and length(cast(dist_code as text))="+ str(len(str(code))+2)
        q1 = AfgCaptAdm1ItsProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        q2 = AfgCaptAdm1NearestProvcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        q3 = AfgCaptAdm2NearestDistrictcImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        q4 = AfgCaptAirdrmImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        q5 = AfgCaptHltfacTier1Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        q6 = AfgCaptHltfacTier2Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        q7 = AfgCaptHltfacTier3Immap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        q8 = AfgCaptHltfacTierallImmap.objects.all().values('time').annotate(pop=Sum('sum_area_population')).extra(
            where = {
                ff0001
            })
        if len(str(code)) > 2:
            gsm = AfgCapaGsmcvr.objects.filter(dist_code=code).aggregate(pop=Sum('gsm_coverage_population'),area=Sum('gsm_coverage_area_sqm'))
        else :
            gsm = AfgCapaGsmcvr.objects.filter(prov_code=code).aggregate(pop=Sum('gsm_coverage_population'),area=Sum('gsm_coverage_area_sqm'))

    elif flag =='drawArea':
        tt = AfgPplp.objects.filter(wkb_geometry__intersects=filterLock).values('vuid')
        q1 = AfgCaptAdm1ItsProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q2 = AfgCaptAdm1NearestProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q3 = AfgCaptAdm2NearestDistrictcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q4 = AfgCaptAirdrmImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q5 = AfgCaptHltfacTier1Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q6 = AfgCaptHltfacTier2Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q7 = AfgCaptHltfacTier3Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q8 = AfgCaptHltfacTierallImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        gsm = AfgCapaGsmcvr.objects.filter(vuid__in=tt).aggregate(pop=Sum('gsm_coverage_population'),area=Sum('gsm_coverage_area_sqm'))
    else:
        tt = AfgPplp.objects.filter(wkb_geometry__intersects=filterLock).values('vuid')
        q1 = AfgCaptAdm1ItsProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q2 = AfgCaptAdm1NearestProvcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q3 = AfgCaptAdm2NearestDistrictcImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q4 = AfgCaptAirdrmImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q5 = AfgCaptHltfacTier1Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q6 = AfgCaptHltfacTier2Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q7 = AfgCaptHltfacTier3Immap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        q8 = AfgCaptHltfacTierallImmap.objects.filter(vuid__in=tt).values('time').annotate(pop=Sum('sum_area_population'))
        gsm = AfgCapaGsmcvr.objects.filter(vuid__in=tt).aggregate(pop=Sum('gsm_coverage_population'),area=Sum('gsm_coverage_area_sqm'))

    for i in q1:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__itsx_prov']=round(i['pop'] or 0)
    for i in q2:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__near_prov']=round(i['pop'] or 0)
    for i in q3:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__near_dist']=round(i['pop'] or 0)
    for i in q4:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__near_airp']=round(i['pop'] or 0)
    for i in q5:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__near_hlt1']=round(i['pop'] or 0)
    for i in q6:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__near_hlt2']=round(i['pop'] or 0)
    for i in q7:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__near_hlt3']=round(i['pop'] or 0)
    for i in q8:
        timelabel = i['time'].replace(' ','_')
        timelabel = timelabel.replace('<','l')
        timelabel = timelabel.replace('>','g')
        response[timelabel+'__near_hltall']=round(i['pop'] or 0)

    response['pop_on_gsm_coverage'] = round((gsm['pop'] or 0),0)
    response['area_on_gsm_coverage'] = round((gsm['area'] or 0)/1000000,0)

    return response

def getAccessibility(request, filterLock, flag, code):
    rawFilterLock = None
    if 'flag' in request.GET:
        rawFilterLock = filterLock
        filterLock = 'ST_GeomFromText(\''+filterLock+'\',4326)'

    targetBase = AfgLndcrva.objects.all()
    response = getCommonUse(request, flag, code)
    response['Population']=getTotalPop(filterLock, flag, code, targetBase)
    response['Area']=getTotalArea(filterLock, flag, code, targetBase)

    rawAccesibility = GetAccesibilityData(rawFilterLock, flag, code)

    # print rawAccesibility

    for i in rawAccesibility:
        response[i]=rawAccesibility[i]

    response['pop_coverage_percent'] = int(round((response['pop_on_gsm_coverage']/response['Population'])*100,0))
    response['area_coverage_percent'] = int(round((response['area_on_gsm_coverage']/response['Area'])*100,0))

    response['l1_h__near_airp_percent'] = int(round((response['l1_h__near_airp']/response['Population'])*100,0)) if 'l1_h__near_airp' in response else 0
    response['l2_h__near_airp_percent'] = int(round((response['l2_h__near_airp']/response['Population'])*100,0)) if 'l2_h__near_airp' in response else 0
    response['l3_h__near_airp_percent'] = int(round((response['l3_h__near_airp']/response['Population'])*100,0)) if 'l3_h__near_airp' in response else 0
    response['l4_h__near_airp_percent'] = int(round((response['l4_h__near_airp']/response['Population'])*100,0)) if 'l4_h__near_airp' in response else 0
    response['l5_h__near_airp_percent'] = int(round((response['l5_h__near_airp']/response['Population'])*100,0)) if 'l5_h__near_airp' in response else 0
    response['l6_h__near_airp_percent'] = int(round((response['l6_h__near_airp']/response['Population'])*100,0)) if 'l6_h__near_airp' in response else 0
    response['l7_h__near_airp_percent'] = int(round((response['l7_h__near_airp']/response['Population'])*100,0)) if 'l7_h__near_airp' in response else 0
    response['l8_h__near_airp_percent'] = int(round((response['l8_h__near_airp']/response['Population'])*100,0)) if 'l8_h__near_airp' in response else 0
    response['g8_h__near_airp_percent'] = int(round((response['g8_h__near_airp']/response['Population'])*100,0)) if 'g8_h__near_airp' in response else 0

    response['l1_h__near_hlt1_percent'] = int(round((response['l1_h__near_hlt1']/response['Population'])*100,0)) if 'l1_h__near_hlt1' in response else 0
    response['l2_h__near_hlt1_percent'] = int(round((response['l2_h__near_hlt1']/response['Population'])*100,0)) if 'l2_h__near_hlt1' in response else 0
    response['l3_h__near_hlt1_percent'] = int(round((response['l3_h__near_hlt1']/response['Population'])*100,0)) if 'l3_h__near_hlt1' in response else 0
    response['l4_h__near_hlt1_percent'] = int(round((response['l4_h__near_hlt1']/response['Population'])*100,0)) if 'l4_h__near_hlt1' in response else 0
    response['l5_h__near_hlt1_percent'] = int(round((response['l5_h__near_hlt1']/response['Population'])*100,0)) if 'l5_h__near_hlt1' in response else 0
    response['l6_h__near_hlt1_percent'] = int(round((response['l6_h__near_hlt1']/response['Population'])*100,0)) if 'l6_h__near_hlt1' in response else 0
    response['l7_h__near_hlt1_percent'] = int(round((response['l7_h__near_hlt1']/response['Population'])*100,0)) if 'l7_h__near_hlt1' in response else 0
    response['l8_h__near_hlt1_percent'] = int(round((response['l8_h__near_hlt1']/response['Population'])*100,0)) if 'l8_h__near_hlt1' in response else 0
    response['g8_h__near_hlt1_percent'] = int(round((response['g8_h__near_hlt1']/response['Population'])*100,0)) if 'g8_h__near_hlt1' in response else 0

    response['l1_h__near_hlt2_percent'] = int(round((response['l1_h__near_hlt2']/response['Population'])*100,0)) if 'l1_h__near_hlt2' in response else 0
    response['l2_h__near_hlt2_percent'] = int(round((response['l2_h__near_hlt2']/response['Population'])*100,0)) if 'l2_h__near_hlt2' in response else 0
    response['l3_h__near_hlt2_percent'] = int(round((response['l3_h__near_hlt2']/response['Population'])*100,0)) if 'l3_h__near_hlt2' in response else 0
    response['l4_h__near_hlt2_percent'] = int(round((response['l4_h__near_hlt2']/response['Population'])*100,0)) if 'l4_h__near_hlt2' in response else 0
    response['l5_h__near_hlt2_percent'] = int(round((response['l5_h__near_hlt2']/response['Population'])*100,0)) if 'l5_h__near_hlt2' in response else 0
    response['l6_h__near_hlt2_percent'] = int(round((response['l6_h__near_hlt2']/response['Population'])*100,0)) if 'l6_h__near_hlt2' in response else 0
    response['l7_h__near_hlt2_percent'] = int(round((response['l7_h__near_hlt2']/response['Population'])*100,0)) if 'l7_h__near_hlt2' in response else 0
    response['l8_h__near_hlt2_percent'] = int(round((response['l8_h__near_hlt2']/response['Population'])*100,0)) if 'l8_h__near_hlt2' in response else 0
    response['g8_h__near_hlt2_percent'] = int(round((response['g8_h__near_hlt2']/response['Population'])*100,0)) if 'g8_h__near_hlt2' in response else 0

    response['l1_h__near_hlt3_percent'] = int(round((response['l1_h__near_hlt3']/response['Population'])*100,0)) if 'l1_h__near_hlt3' in response else 0
    response['l2_h__near_hlt3_percent'] = int(round((response['l2_h__near_hlt3']/response['Population'])*100,0)) if 'l2_h__near_hlt3' in response else 0
    response['l3_h__near_hlt3_percent'] = int(round((response['l3_h__near_hlt3']/response['Population'])*100,0)) if 'l3_h__near_hlt3' in response else 0
    response['l4_h__near_hlt3_percent'] = int(round((response['l4_h__near_hlt3']/response['Population'])*100,0)) if 'l4_h__near_hlt3' in response else 0
    response['l5_h__near_hlt3_percent'] = int(round((response['l5_h__near_hlt3']/response['Population'])*100,0)) if 'l5_h__near_hlt3' in response else 0
    response['l6_h__near_hlt3_percent'] = int(round((response['l6_h__near_hlt3']/response['Population'])*100,0)) if 'l6_h__near_hlt3' in response else 0
    response['l7_h__near_hlt3_percent'] = int(round((response['l7_h__near_hlt3']/response['Population'])*100,0)) if 'l7_h__near_hlt3' in response else 0
    response['l8_h__near_hlt3_percent'] = int(round((response['l8_h__near_hlt3']/response['Population'])*100,0)) if 'l8_h__near_hlt3' in response else 0
    response['g8_h__near_hlt3_percent'] = int(round((response['g8_h__near_hlt3']/response['Population'])*100,0)) if 'g8_h__near_hlt3' in response else 0

    response['l1_h__near_hltall_percent'] = int(round((response['l1_h__near_hltall']/response['Population'])*100,0)) if 'l1_h__near_hltall' in response else 0
    response['l2_h__near_hltall_percent'] = int(round((response['l2_h__near_hltall']/response['Population'])*100,0)) if 'l2_h__near_hltall' in response else 0
    response['l3_h__near_hltall_percent'] = int(round((response['l3_h__near_hltall']/response['Population'])*100,0)) if 'l3_h__near_hltall' in response else 0
    response['l4_h__near_hltall_percent'] = int(round((response['l4_h__near_hltall']/response['Population'])*100,0)) if 'l4_h__near_hltall' in response else 0
    response['l5_h__near_hltall_percent'] = int(round((response['l5_h__near_hltall']/response['Population'])*100,0)) if 'l5_h__near_hltall' in response else 0
    response['l6_h__near_hltall_percent'] = int(round((response['l6_h__near_hltall']/response['Population'])*100,0)) if 'l6_h__near_hltall' in response else 0
    response['l7_h__near_hltall_percent'] = int(round((response['l7_h__near_hltall']/response['Population'])*100,0)) if 'l7_h__near_hltall' in response else 0
    response['l8_h__near_hltall_percent'] = int(round((response['l8_h__near_hltall']/response['Population'])*100,0)) if 'l8_h__near_hltall' in response else 0
    response['g8_h__near_hltall_percent'] = int(round((response['g8_h__near_hltall']/response['Population'])*100,0)) if 'g8_h__near_hltall' in response else 0

    response['l1_h__itsx_prov_percent'] = int(round((response['l1_h__itsx_prov']/response['Population'])*100,0)) if 'l1_h__itsx_prov' in response else 0
    response['l2_h__itsx_prov_percent'] = int(round((response['l2_h__itsx_prov']/response['Population'])*100,0)) if 'l2_h__itsx_prov' in response else 0
    response['l3_h__itsx_prov_percent'] = int(round((response['l3_h__itsx_prov']/response['Population'])*100,0)) if 'l3_h__itsx_prov' in response else 0
    response['l4_h__itsx_prov_percent'] = int(round((response['l4_h__itsx_prov']/response['Population'])*100,0)) if 'l4_h__itsx_prov' in response else 0
    response['l5_h__itsx_prov_percent'] = int(round((response['l5_h__itsx_prov']/response['Population'])*100,0)) if 'l5_h__itsx_prov' in response else 0
    response['l6_h__itsx_prov_percent'] = int(round((response['l6_h__itsx_prov']/response['Population'])*100,0)) if 'l6_h__itsx_prov' in response else 0
    response['l7_h__itsx_prov_percent'] = int(round((response['l7_h__itsx_prov']/response['Population'])*100,0)) if 'l7_h__itsx_prov' in response else 0
    response['l8_h__itsx_prov_percent'] = int(round((response['l8_h__itsx_prov']/response['Population'])*100,0)) if 'l8_h__itsx_prov' in response else 0
    response['g8_h__itsx_prov_percent'] = int(round((response['g8_h__itsx_prov']/response['Population'])*100,0)) if 'g8_h__itsx_prov' in response else 0

    response['l1_h__near_prov_percent'] = int(round((response['l1_h__near_prov']/response['Population'])*100,0)) if 'l1_h__near_prov' in response else 0
    response['l2_h__near_prov_percent'] = int(round((response['l2_h__near_prov']/response['Population'])*100,0)) if 'l2_h__near_prov' in response else 0
    response['l3_h__near_prov_percent'] = int(round((response['l3_h__near_prov']/response['Population'])*100,0)) if 'l3_h__near_prov' in response else 0
    response['l4_h__near_prov_percent'] = int(round((response['l4_h__near_prov']/response['Population'])*100,0)) if 'l4_h__near_prov' in response else 0
    response['l5_h__near_prov_percent'] = int(round((response['l5_h__near_prov']/response['Population'])*100,0)) if 'l5_h__near_prov' in response else 0
    response['l6_h__near_prov_percent'] = int(round((response['l6_h__near_prov']/response['Population'])*100,0)) if 'l6_h__near_prov' in response else 0
    response['l7_h__near_prov_percent'] = int(round((response['l7_h__near_prov']/response['Population'])*100,0)) if 'l7_h__near_prov' in response else 0
    response['l8_h__near_prov_percent'] = int(round((response['l8_h__near_prov']/response['Population'])*100,0)) if 'l8_h__near_prov' in response else 0
    response['g8_h__near_prov_percent'] = int(round((response['g8_h__near_prov']/response['Population'])*100,0)) if 'g8_h__near_prov' in response else 0

    response['l1_h__near_dist_percent'] = int(round((response['l1_h__near_dist']/response['Population'])*100,0)) if 'l1_h__near_dist' in response else 0
    response['l2_h__near_dist_percent'] = int(round((response['l2_h__near_dist']/response['Population'])*100,0)) if 'l2_h__near_dist' in response else 0
    response['l3_h__near_dist_percent'] = int(round((response['l3_h__near_dist']/response['Population'])*100,0)) if 'l3_h__near_dist' in response else 0
    response['l4_h__near_dist_percent'] = int(round((response['l4_h__near_dist']/response['Population'])*100,0)) if 'l4_h__near_dist' in response else 0
    response['l5_h__near_dist_percent'] = int(round((response['l5_h__near_dist']/response['Population'])*100,0)) if 'l5_h__near_dist' in response else 0
    response['l6_h__near_dist_percent'] = int(round((response['l6_h__near_dist']/response['Population'])*100,0)) if 'l6_h__near_dist' in response else 0
    response['l7_h__near_dist_percent'] = int(round((response['l7_h__near_dist']/response['Population'])*100,0)) if 'l7_h__near_dist' in response else 0
    response['l8_h__near_dist_percent'] = int(round((response['l8_h__near_dist']/response['Population'])*100,0)) if 'l8_h__near_dist' in response else 0
    response['g8_h__near_dist_percent'] = int(round((response['g8_h__near_dist']/response['Population'])*100,0)) if 'g8_h__near_dist' in response else 0

    data1 = []
    data1.append(['agg_simplified_description','area_population'])
    data1.append([_('Population with GSM coverage'),response['pop_on_gsm_coverage']])
    data1.append([_('Population without GSM coverage'),response['Population']-response['pop_on_gsm_coverage']])
    response['total_pop_coverage_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270})

    data2 = []
    data2.append(['agg_simplified_description','area_population'])
    data2.append([_('Area with GSM coverage'),response['area_on_gsm_coverage']])
    data2.append([_('Area without GSM coverage'),response['Area']-response['area_on_gsm_coverage']])
    response['total_area_coverage_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270 })

    dataNearestAirp = []
    dataNearestAirp.append(['time','population'])
    dataNearestAirp.append([_('< 1 h'),response['l1_h__near_airp'] if 'l1_h__near_airp' in response else 0])
    dataNearestAirp.append([_('< 2 h'),response['l2_h__near_airp'] if 'l2_h__near_airp' in response else 0])
    dataNearestAirp.append([_('< 3 h'),response['l3_h__near_airp'] if 'l3_h__near_airp' in response else 0])
    dataNearestAirp.append([_('< 4 h'),response['l4_h__near_airp'] if 'l4_h__near_airp' in response else 0])
    dataNearestAirp.append([_('< 5 h'),response['l5_h__near_airp'] if 'l5_h__near_airp' in response else 0])
    dataNearestAirp.append([_('< 6 h'),response['l6_h__near_airp'] if 'l6_h__near_airp' in response else 0])
    dataNearestAirp.append([_('< 7 h'),response['l7_h__near_airp'] if 'l7_h__near_airp' in response else 0])
    dataNearestAirp.append([_('< 8 h'),response['l8_h__near_airp'] if 'l8_h__near_airp' in response else 0])
    dataNearestAirp.append([_('> 8 h'),response['g8_h__near_airp'] if 'g8_h__near_airp' in response else 0])
    response['nearest_airport_chart'] = gchart.PieChart(SimpleDataSource(data=dataNearestAirp), html_id="pie_chart3", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })
    # response['nearest_airport_chart'] = gchart.PieChart(SimpleDataSource(data=dataNearestAirp), html_id="pie_chart3", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': 'none', 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })

    datatier1 = []
    datatier1.append(['time','population'])
    datatier1.append([_('< 1 h'),response['l1_h__near_hlt1'] if 'l1_h__near_hlt1' in response else 0])
    datatier1.append([_('< 2 h'),response['l2_h__near_hlt1'] if 'l2_h__near_hlt1' in response else 0])
    datatier1.append([_('< 3 h'),response['l3_h__near_hlt1'] if 'l3_h__near_hlt1' in response else 0])
    datatier1.append([_('< 4 h'),response['l4_h__near_hlt1'] if 'l4_h__near_hlt1' in response else 0])
    datatier1.append([_('< 5 h'),response['l5_h__near_hlt1'] if 'l5_h__near_hlt1' in response else 0])
    datatier1.append([_('< 6 h'),response['l6_h__near_hlt1'] if 'l6_h__near_hlt1' in response else 0])
    datatier1.append([_('< 7 h'),response['l7_h__near_hlt1'] if 'l7_h__near_hlt1' in response else 0])
    datatier1.append([_('< 8 h'),response['l8_h__near_hlt1'] if 'l8_h__near_hlt1' in response else 0])
    datatier1.append([_('> 8 h'),response['g8_h__near_hlt1'] if 'g8_h__near_hlt1' in response else 0])
    response['tier1_chart'] = gchart.PieChart(SimpleDataSource(data=datatier1), html_id="pie_chart4", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })

    datatier2 = []
    datatier2.append(['time','population'])
    datatier2.append([_('< 1 h'),response['l1_h__near_hlt2'] if 'l1_h__near_hlt2' in response else 0])
    datatier2.append([_('< 2 h'),response['l2_h__near_hlt2'] if 'l2_h__near_hlt2' in response else 0])
    datatier2.append([_('< 3 h'),response['l3_h__near_hlt2'] if 'l3_h__near_hlt2' in response else 0])
    datatier2.append([_('< 4 h'),response['l4_h__near_hlt2'] if 'l4_h__near_hlt2' in response else 0])
    datatier2.append([_('< 5 h'),response['l5_h__near_hlt2'] if 'l5_h__near_hlt2' in response else 0])
    datatier2.append([_('< 6 h'),response['l6_h__near_hlt2'] if 'l6_h__near_hlt2' in response else 0])
    datatier2.append([_('< 7 h'),response['l7_h__near_hlt2'] if 'l7_h__near_hlt2' in response else 0])
    datatier2.append([_('< 8 h'),response['l8_h__near_hlt2'] if 'l8_h__near_hlt2' in response else 0])
    datatier2.append([_('> 8 h'),response['g8_h__near_hlt2'] if 'g8_h__near_hlt2' in response else 0])
    response['tier2_chart'] = gchart.PieChart(SimpleDataSource(data=datatier2), html_id="pie_chart5", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })

    datatier3 = []
    datatier3.append(['time','population'])
    datatier3.append([_('< 1 h'),response['l1_h__near_hlt3'] if 'l1_h__near_hlt3' in response else 0])
    datatier3.append([_('< 2 h'),response['l2_h__near_hlt3'] if 'l2_h__near_hlt3' in response else 0])
    datatier3.append([_('< 3 h'),response['l3_h__near_hlt3'] if 'l3_h__near_hlt3' in response else 0])
    datatier3.append([_('< 4 h'),response['l4_h__near_hlt3'] if 'l4_h__near_hlt3' in response else 0])
    datatier3.append([_('< 5 h'),response['l5_h__near_hlt3'] if 'l5_h__near_hlt3' in response else 0])
    datatier3.append([_('< 6 h'),response['l6_h__near_hlt3'] if 'l6_h__near_hlt3' in response else 0])
    datatier3.append([_('< 7 h'),response['l7_h__near_hlt3'] if 'l7_h__near_hlt3' in response else 0])
    datatier3.append([_('< 8 h'),response['l8_h__near_hlt3'] if 'l8_h__near_hlt3' in response else 0])
    datatier3.append([_('> 8 h'),response['g8_h__near_hlt3'] if 'g8_h__near_hlt3' in response else 0])
    response['tier3_chart'] = gchart.PieChart(SimpleDataSource(data=datatier3), html_id="pie_chart6", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })

    datatierall = []
    datatierall.append(['time','population'])
    datatierall.append([_('< 1 h'),response['l1_h__near_hltall'] if 'l1_h__near_hltall' in response else 0])
    datatierall.append([_('< 2 h'),response['l2_h__near_hltall'] if 'l2_h__near_hltall' in response else 0])
    datatierall.append([_('< 3 h'),response['l3_h__near_hltall'] if 'l3_h__near_hltall' in response else 0])
    datatierall.append([_('< 4 h'),response['l4_h__near_hltall'] if 'l4_h__near_hltall' in response else 0])
    datatierall.append([_('< 5 h'),response['l5_h__near_hltall'] if 'l5_h__near_hltall' in response else 0])
    datatierall.append([_('< 6 h'),response['l6_h__near_hltall'] if 'l6_h__near_hltall' in response else 0])
    datatierall.append([_('< 7 h'),response['l7_h__near_hltall'] if 'l7_h__near_hltall' in response else 0])
    datatierall.append([_('< 8 h'),response['l8_h__near_hltall'] if 'l8_h__near_hltall' in response else 0])
    datatierall.append([_('> 8 h'),response['g8_h__near_hltall'] if 'g8_h__near_hltall' in response else 0])
    response['tierall_chart'] = gchart.PieChart(SimpleDataSource(data=datatierall), html_id="pie_chart7", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })

    datatitsx_prov = []
    datatitsx_prov.append(['time','population'])
    datatitsx_prov.append([_('< 1 h'),response['l1_h__itsx_prov'] if 'l1_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('< 2 h'),response['l2_h__itsx_prov'] if 'l2_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('< 3 h'),response['l3_h__itsx_prov'] if 'l3_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('< 4 h'),response['l4_h__itsx_prov'] if 'l4_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('< 5 h'),response['l5_h__itsx_prov'] if 'l5_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('< 6 h'),response['l6_h__itsx_prov'] if 'l6_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('< 7 h'),response['l7_h__itsx_prov'] if 'l7_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('< 8 h'),response['l8_h__itsx_prov'] if 'l8_h__itsx_prov' in response else 0])
    datatitsx_prov.append([_('> 8 h'),response['g8_h__itsx_prov'] if 'g8_h__itsx_prov' in response else 0])
    response['itsx_prov_chart'] = gchart.PieChart(SimpleDataSource(data=datatitsx_prov), html_id="pie_chart8", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })

    datatnear_prov = []
    datatnear_prov.append(['time','population'])
    datatnear_prov.append([_('< 1 h'),response['l1_h__near_prov'] if 'l1_h__near_prov' in response else 0])
    datatnear_prov.append([_('< 2 h'),response['l2_h__near_prov'] if 'l2_h__near_prov' in response else 0])
    datatnear_prov.append([_('< 3 h'),response['l3_h__near_prov'] if 'l3_h__near_prov' in response else 0])
    datatnear_prov.append([_('< 4 h'),response['l4_h__near_prov'] if 'l4_h__near_prov' in response else 0])
    datatnear_prov.append([_('< 5 h'),response['l5_h__near_prov'] if 'l5_h__near_prov' in response else 0])
    datatnear_prov.append([_('< 6 h'),response['l6_h__near_prov'] if 'l6_h__near_prov' in response else 0])
    datatnear_prov.append([_('< 7 h'),response['l7_h__near_prov'] if 'l7_h__near_prov' in response else 0])
    datatnear_prov.append([_('< 8 h'),response['l8_h__near_prov'] if 'l8_h__near_prov' in response else 0])
    datatnear_prov.append([_('> 8 h'),response['g8_h__near_prov'] if 'g8_h__near_prov' in response else 0])
    response['near_prov_chart'] = gchart.PieChart(SimpleDataSource(data=datatnear_prov), html_id="pie_chart9", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })

    datatnear_dist = []
    datatnear_dist.append(['time','population'])
    datatnear_dist.append([_('< 1 h'),response['l1_h__near_dist'] if 'l1_h__near_dist' in response else 0])
    datatnear_dist.append([_('< 2 h'),response['l2_h__near_dist'] if 'l2_h__near_dist' in response else 0])
    datatnear_dist.append([_('< 3 h'),response['l3_h__near_dist'] if 'l3_h__near_dist' in response else 0])
    datatnear_dist.append([_('< 4 h'),response['l4_h__near_dist'] if 'l4_h__near_dist' in response else 0])
    datatnear_dist.append([_('< 5 h'),response['l5_h__near_dist'] if 'l5_h__near_dist' in response else 0])
    datatnear_dist.append([_('< 6 h'),response['l6_h__near_dist'] if 'l6_h__near_dist' in response else 0])
    datatnear_dist.append([_('< 7 h'),response['l7_h__near_dist'] if 'l7_h__near_dist' in response else 0])
    datatnear_dist.append([_('< 8 h'),response['l8_h__near_dist'] if 'l8_h__near_dist' in response else 0])
    datatnear_dist.append([_('> 8 h'),response['g8_h__near_dist'] if 'g8_h__near_dist' in response else 0])
    response['near_dist_chart'] = gchart.PieChart(SimpleDataSource(data=datatnear_dist), html_id="pie_chart10", options={'title': "", 'width': 290,'height': 290, 'pieSliceTextStyle': {'color': 'black'}, 'pieSliceText': 'percentage','legend': {'position':'top', 'maxLines':4}, 'slices':{0:{'color':'#e3f8ff'},1:{'color':'#defdf0'},2:{'color':'#caf6e4'},3:{'color':'#fcfdde'},4:{'color':'#fef7dc'},5:{'color':'#fce6be'},6:{'color':'#ffd6c5'},7:{'color':'#fdbbac'},8:{'color':'#ffa19a'}} })


    data = getListAccesibility(filterLock, flag, code)
    response['lc_child']=data
    return response

def getListAccesibility(filterLock, flag, code):
    response = []
    data = getProvinceSummary(filterLock, flag, code)
    for i in data:
        data ={}
        data['code'] = i['code']
        data['na_en'] = i['na_en']
        data['Population'] = i['Population']
        data['Area'] = i['Area']

        rawAccesibility = GetAccesibilityData(filterLock, 'currentProvince', i['code'])
        for x in rawAccesibility:
            data[x]=rawAccesibility[x]

        data['pop_coverage_percent'] = int(round((data['pop_on_gsm_coverage']/data['Population'])*100,0))
        data['area_coverage_percent'] = int(round((data['area_on_gsm_coverage']/data['Area'])*100,0))

        print 'l1_h__near_airp' in data

        data['l1_h__near_airp_percent'] = int(round((data['l1_h__near_airp']/data['Population'])*100,0)) if 'l1_h__near_airp' in data else 0
        data['l2_h__near_airp_percent'] = int(round((data['l2_h__near_airp']/data['Population'])*100,0)) if 'l2_h__near_airp' in data else 0
        data['l3_h__near_airp_percent'] = int(round((data['l3_h__near_airp']/data['Population'])*100,0)) if 'l3_h__near_airp' in data else 0
        data['l4_h__near_airp_percent'] = int(round((data['l4_h__near_airp']/data['Population'])*100,0)) if 'l4_h__near_airp' in data else 0
        data['l5_h__near_airp_percent'] = int(round((data['l5_h__near_airp']/data['Population'])*100,0)) if 'l5_h__near_airp' in data else 0
        data['l6_h__near_airp_percent'] = int(round((data['l6_h__near_airp']/data['Population'])*100,0)) if 'l6_h__near_airp' in data else 0
        data['l7_h__near_airp_percent'] = int(round((data['l7_h__near_airp']/data['Population'])*100,0)) if 'l7_h__near_airp' in data else 0
        data['l8_h__near_airp_percent'] = int(round((data['l8_h__near_airp']/data['Population'])*100,0)) if 'l8_h__near_airp' in data else 0
        data['g8_h__near_airp_percent'] = int(round((data['g8_h__near_airp']/data['Population'])*100,0)) if 'g8_h__near_airp' in data else 0

        data['l1_h__near_hlt1_percent'] = int(round((data['l1_h__near_hlt1']/data['Population'])*100,0)) if 'l1_h__near_hlt1' in data else 0
        data['l2_h__near_hlt1_percent'] = int(round((data['l2_h__near_hlt1']/data['Population'])*100,0)) if 'l2_h__near_hlt1' in data else 0
        data['l3_h__near_hlt1_percent'] = int(round((data['l3_h__near_hlt1']/data['Population'])*100,0)) if 'l3_h__near_hlt1' in data else 0
        data['l4_h__near_hlt1_percent'] = int(round((data['l4_h__near_hlt1']/data['Population'])*100,0)) if 'l4_h__near_hlt1' in data else 0
        data['l5_h__near_hlt1_percent'] = int(round((data['l5_h__near_hlt1']/data['Population'])*100,0)) if 'l5_h__near_hlt1' in data else 0
        data['l6_h__near_hlt1_percent'] = int(round((data['l6_h__near_hlt1']/data['Population'])*100,0)) if 'l6_h__near_hlt1' in data else 0
        data['l7_h__near_hlt1_percent'] = int(round((data['l7_h__near_hlt1']/data['Population'])*100,0)) if 'l7_h__near_hlt1' in data else 0
        data['l8_h__near_hlt1_percent'] = int(round((data['l8_h__near_hlt1']/data['Population'])*100,0)) if 'l8_h__near_hlt1' in data else 0
        data['g8_h__near_hlt1_percent'] = int(round((data['g8_h__near_hlt1']/data['Population'])*100,0)) if 'g8_h__near_hlt1' in data else 0

        data['l1_h__near_hlt2_percent'] = int(round((data['l1_h__near_hlt2']/data['Population'])*100,0)) if 'l1_h__near_hlt2' in data else 0
        data['l2_h__near_hlt2_percent'] = int(round((data['l2_h__near_hlt2']/data['Population'])*100,0)) if 'l2_h__near_hlt2' in data else 0
        data['l3_h__near_hlt2_percent'] = int(round((data['l3_h__near_hlt2']/data['Population'])*100,0)) if 'l3_h__near_hlt2' in data else 0
        data['l4_h__near_hlt2_percent'] = int(round((data['l4_h__near_hlt2']/data['Population'])*100,0)) if 'l4_h__near_hlt2' in data else 0
        data['l5_h__near_hlt2_percent'] = int(round((data['l5_h__near_hlt2']/data['Population'])*100,0)) if 'l5_h__near_hlt2' in data else 0
        data['l6_h__near_hlt2_percent'] = int(round((data['l6_h__near_hlt2']/data['Population'])*100,0)) if 'l6_h__near_hlt2' in data else 0
        data['l7_h__near_hlt2_percent'] = int(round((data['l7_h__near_hlt2']/data['Population'])*100,0)) if 'l7_h__near_hlt2' in data else 0
        data['l8_h__near_hlt2_percent'] = int(round((data['l8_h__near_hlt2']/data['Population'])*100,0)) if 'l8_h__near_hlt2' in data else 0
        data['g8_h__near_hlt2_percent'] = int(round((data['g8_h__near_hlt2']/data['Population'])*100,0)) if 'g8_h__near_hlt2' in data else 0

        data['l1_h__near_hlt3_percent'] = int(round((data['l1_h__near_hlt3']/data['Population'])*100,0)) if 'l1_h__near_hlt3' in data else 0
        data['l2_h__near_hlt3_percent'] = int(round((data['l2_h__near_hlt3']/data['Population'])*100,0)) if 'l2_h__near_hlt3' in data else 0
        data['l3_h__near_hlt3_percent'] = int(round((data['l3_h__near_hlt3']/data['Population'])*100,0)) if 'l3_h__near_hlt3' in data else 0
        data['l4_h__near_hlt3_percent'] = int(round((data['l4_h__near_hlt3']/data['Population'])*100,0)) if 'l4_h__near_hlt3' in data else 0
        data['l5_h__near_hlt3_percent'] = int(round((data['l5_h__near_hlt3']/data['Population'])*100,0)) if 'l5_h__near_hlt3' in data else 0
        data['l6_h__near_hlt3_percent'] = int(round((data['l6_h__near_hlt3']/data['Population'])*100,0)) if 'l6_h__near_hlt3' in data else 0
        data['l7_h__near_hlt3_percent'] = int(round((data['l7_h__near_hlt3']/data['Population'])*100,0)) if 'l7_h__near_hlt3' in data else 0
        data['l8_h__near_hlt3_percent'] = int(round((data['l8_h__near_hlt3']/data['Population'])*100,0)) if 'l8_h__near_hlt3' in data else 0
        data['g8_h__near_hlt3_percent'] = int(round((data['g8_h__near_hlt3']/data['Population'])*100,0)) if 'g8_h__near_hlt3' in data else 0

        data['l1_h__near_hltall_percent'] = int(round((data['l1_h__near_hltall']/data['Population'])*100,0)) if 'l1_h__near_hltall' in data else 0
        data['l2_h__near_hltall_percent'] = int(round((data['l2_h__near_hltall']/data['Population'])*100,0)) if 'l2_h__near_hltall' in data else 0
        data['l3_h__near_hltall_percent'] = int(round((data['l3_h__near_hltall']/data['Population'])*100,0)) if 'l3_h__near_hltall' in data else 0
        data['l4_h__near_hltall_percent'] = int(round((data['l4_h__near_hltall']/data['Population'])*100,0)) if 'l4_h__near_hltall' in data else 0
        data['l5_h__near_hltall_percent'] = int(round((data['l5_h__near_hltall']/data['Population'])*100,0)) if 'l5_h__near_hltall' in data else 0
        data['l6_h__near_hltall_percent'] = int(round((data['l6_h__near_hltall']/data['Population'])*100,0)) if 'l6_h__near_hltall' in data else 0
        data['l7_h__near_hltall_percent'] = int(round((data['l7_h__near_hltall']/data['Population'])*100,0)) if 'l7_h__near_hltall' in data else 0
        data['l8_h__near_hltall_percent'] = int(round((data['l8_h__near_hltall']/data['Population'])*100,0)) if 'l8_h__near_hltall' in data else 0
        data['g8_h__near_hltall_percent'] = int(round((data['g8_h__near_hltall']/data['Population'])*100,0)) if 'g8_h__near_hltall' in data else 0

        data['l1_h__itsx_prov_percent'] = int(round((data['l1_h__itsx_prov']/data['Population'])*100,0)) if 'l1_h__itsx_prov' in data else 0
        data['l2_h__itsx_prov_percent'] = int(round((data['l2_h__itsx_prov']/data['Population'])*100,0)) if 'l2_h__itsx_prov' in data else 0
        data['l3_h__itsx_prov_percent'] = int(round((data['l3_h__itsx_prov']/data['Population'])*100,0)) if 'l3_h__itsx_prov' in data else 0
        data['l4_h__itsx_prov_percent'] = int(round((data['l4_h__itsx_prov']/data['Population'])*100,0)) if 'l4_h__itsx_prov' in data else 0
        data['l5_h__itsx_prov_percent'] = int(round((data['l5_h__itsx_prov']/data['Population'])*100,0)) if 'l5_h__itsx_prov' in data else 0
        data['l6_h__itsx_prov_percent'] = int(round((data['l6_h__itsx_prov']/data['Population'])*100,0)) if 'l6_h__itsx_prov' in data else 0
        data['l7_h__itsx_prov_percent'] = int(round((data['l7_h__itsx_prov']/data['Population'])*100,0)) if 'l7_h__itsx_prov' in data else 0
        data['l8_h__itsx_prov_percent'] = int(round((data['l8_h__itsx_prov']/data['Population'])*100,0)) if 'l8_h__itsx_prov' in data else 0
        data['g8_h__itsx_prov_percent'] = int(round((data['g8_h__itsx_prov']/data['Population'])*100,0)) if 'g8_h__itsx_prov' in data else 0

        data['l1_h__near_prov_percent'] = int(round((data['l1_h__near_prov']/data['Population'])*100,0)) if 'l1_h__near_prov' in data else 0
        data['l2_h__near_prov_percent'] = int(round((data['l2_h__near_prov']/data['Population'])*100,0)) if 'l2_h__near_prov' in data else 0
        data['l3_h__near_prov_percent'] = int(round((data['l3_h__near_prov']/data['Population'])*100,0)) if 'l3_h__near_prov' in data else 0
        data['l4_h__near_prov_percent'] = int(round((data['l4_h__near_prov']/data['Population'])*100,0)) if 'l4_h__near_prov' in data else 0
        data['l5_h__near_prov_percent'] = int(round((data['l5_h__near_prov']/data['Population'])*100,0)) if 'l5_h__near_prov' in data else 0
        data['l6_h__near_prov_percent'] = int(round((data['l6_h__near_prov']/data['Population'])*100,0)) if 'l6_h__near_prov' in data else 0
        data['l7_h__near_prov_percent'] = int(round((data['l7_h__near_prov']/data['Population'])*100,0)) if 'l7_h__near_prov' in data else 0
        data['l8_h__near_prov_percent'] = int(round((data['l8_h__near_prov']/data['Population'])*100,0)) if 'l8_h__near_prov' in data else 0
        data['g8_h__near_prov_percent'] = int(round((data['g8_h__near_prov']/data['Population'])*100,0)) if 'g8_h__near_prov' in data else 0

        data['l1_h__near_dist_percent'] = int(round((data['l1_h__near_dist']/data['Population'])*100,0)) if 'l1_h__near_dist' in data else 0
        data['l2_h__near_dist_percent'] = int(round((data['l2_h__near_dist']/data['Population'])*100,0)) if 'l2_h__near_dist' in data else 0
        data['l3_h__near_dist_percent'] = int(round((data['l3_h__near_dist']/data['Population'])*100,0)) if 'l3_h__near_dist' in data else 0
        data['l4_h__near_dist_percent'] = int(round((data['l4_h__near_dist']/data['Population'])*100,0)) if 'l4_h__near_dist' in data else 0
        data['l5_h__near_dist_percent'] = int(round((data['l5_h__near_dist']/data['Population'])*100,0)) if 'l5_h__near_dist' in data else 0
        data['l6_h__near_dist_percent'] = int(round((data['l6_h__near_dist']/data['Population'])*100,0)) if 'l6_h__near_dist' in data else 0
        data['l7_h__near_dist_percent'] = int(round((data['l7_h__near_dist']/data['Population'])*100,0)) if 'l7_h__near_dist' in data else 0
        data['l8_h__near_dist_percent'] = int(round((data['l8_h__near_dist']/data['Population'])*100,0)) if 'l8_h__near_dist' in data else 0
        data['g8_h__near_dist_percent'] = int(round((data['g8_h__near_dist']/data['Population'])*100,0)) if 'g8_h__near_dist' in data else 0

        response.append(data)
    return response

def getFloodForecast(request, filterLock, flag, code):
    response = getCommonUse(request, flag, code)

    includeDetailState = True
    if 'date' in request.GET:
        curdate = datetime.datetime(int(request.GET['date'].split('-')[0]), int(request.GET['date'].split('-')[1]), int(request.GET['date'].split('-')[2]), 00, 00)
        includeDetailState = False
    else:
        curdate = datetime.datetime.utcnow()

    YEAR = curdate.strftime("%Y")
    MONTH = curdate.strftime("%m")
    DAY = curdate.strftime("%d")
    reverse_date = curdate - datetime.timedelta(days=1)

    targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
    targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description=_('Water body and Marshland'))

    flood_parent = getFloodForecastMatrix(filterLock, flag, code)
    for i in flood_parent:
        response[i]=flood_parent[i]

    spt_filter = 'NULL'
    if 'filter' in request.GET:
        spt_filter = request.GET['filter']

    gfms_glofas_parent = getFloodForecastBySource('GFMS + GLOFAS', targetRisk, spt_filter, flag, code, YEAR, MONTH, DAY)
    for i in gfms_glofas_parent:
        response['gfms_glofas_'+i]=gfms_glofas_parent[i]

    glofas_parent = getFloodForecastBySource('GLOFAS only', targetRisk, spt_filter, flag, code, YEAR, MONTH, DAY)
    for i in glofas_parent:
        response['glofas_'+i]=glofas_parent[i]


    if includeDetailState:
        data = getProvinceSummary(filterLock, flag, code)
        response['lc_child']=data

        data = getProvinceSummary_glofas(filterLock, flag, code, reverse_date.strftime("%Y"), reverse_date.strftime("%m"), reverse_date.strftime("%d"), False)
        response['glofas_child']=data

        data = getProvinceSummary_glofas(filterLock, flag, code, YEAR, MONTH, int(DAY), True)
        response['glofas_gfms_child']=data

    return response

def getAvalancheForecast(request, filterLock, flag, code):
    targetBase = AfgLndcrva.objects.all()
    response = getCommonUse(request, flag, code)
    response['Population']=getTotalPop(filterLock, flag, code, targetBase)
    rawAvalancheRisk = getRawAvalancheRisk(filterLock, flag, code)
    for i in rawAvalancheRisk:
        response[i]=rawAvalancheRisk[i]

    rawAvalancheForecast = getRawAvalancheForecast(request, filterLock, flag, code)

    for i in rawAvalancheForecast:
        response[i]=rawAvalancheForecast[i]

    response['total_pop_forecast_percent'] = int(round((response['total_ava_forecast_pop']/response['Population'])*100,0))
    response['high_pop_forecast_percent'] = int(round((response['ava_forecast_high_pop']/response['Population'])*100,0))
    response['med_pop_forecast_percent'] = int(round((response['ava_forecast_med_pop']/response['Population'])*100,0))
    response['low_pop_forecast_percent'] = int(round((response['ava_forecast_low_pop']/response['Population'])*100,0))

    data1 = []
    data1.append(['agg_simplified_description','area_population'])
    data1.append(['',response['total_ava_forecast_pop']])
    data1.append(['',response['Population']-response['total_ava_forecast_pop']])
    response['total_pop_forecast_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data2 = []
    data2.append(['agg_simplified_description','area_population'])
    data2.append(['',response['ava_forecast_high_pop']])
    data2.append(['',response['Population']-response['ava_forecast_high_pop']])
    response['high_pop_forecast_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data3 = []
    data3.append(['agg_simplified_description','area_population'])
    data3.append(['',response['ava_forecast_med_pop']])
    data3.append(['',response['Population']-response['ava_forecast_med_pop']])
    response['med_pop_forecast_chart'] = gchart.PieChart(SimpleDataSource(data=data3), html_id="pie_chart3", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data4 = []
    data4.append(['agg_simplified_description','area_population'])
    data4.append(['',response['ava_forecast_low_pop']])
    data4.append(['',response['Population']-response['ava_forecast_low_pop']])
    response['low_pop_forecast_chart'] = gchart.PieChart(SimpleDataSource(data=data4), html_id="pie_chart4", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    if 'date' not in request.GET:
        data = getProvinceSummary(filterLock, flag, code)

        for i in data:
            i['total_pop_forecast_percent'] = int(round(i['total_ava_forecast_pop']/i['Population']*100,0))
            i['high_pop_forecast_percent'] = int(round(i['ava_forecast_high_pop']/i['Population']*100,0))
            i['med_pop_forecast_percent'] = int(round(i['ava_forecast_med_pop']/i['Population']*100,0))
            i['low_pop_forecast_percent'] = int(round(i['ava_forecast_low_pop']/i['Population']*100,0))

        response['lc_child']=data

    return response

def getRawAvalancheForecast(request, filterLock, flag, code):

    includeDetailState = True
    if 'date' in request.GET:
        curdate = datetime.datetime(int(request.GET['date'].split('-')[0]), int(request.GET['date'].split('-')[1]), int(request.GET['date'].split('-')[2]), 00, 00)
        includeDetailState = False
    else:
        curdate = datetime.datetime.utcnow()

    YEAR = curdate.strftime("%Y")
    MONTH = curdate.strftime("%m")
    DAY = curdate.strftime("%d")

    response = {}

    # Avalanche Forecasted
    if flag=='entireAfg':
        cursor = connections['geodb'].cursor()
        cursor.execute("select forcastedvalue.riskstate, \
            sum(afg_avsa.avalanche_pop) \
            FROM afg_avsa \
            INNER JOIN current_sc_basins ON (ST_WITHIN(ST_Centroid(afg_avsa.wkb_geometry), current_sc_basins.wkb_geometry)) \
            INNER JOIN afg_sheda_lvl4 ON ( afg_avsa.basinmember_id = afg_sheda_lvl4.ogc_fid ) \
            INNER JOIN forcastedvalue ON ( afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id ) \
            WHERE (NOT (afg_avsa.basinmember_id IN (SELECT U1.ogc_fid FROM afg_sheda_lvl4 U1 LEFT OUTER JOIN forcastedvalue U2 ON ( U1.ogc_fid = U2.basin_id ) WHERE U2.riskstate IS NULL)) \
            AND forcastedvalue.datadate = '%s-%s-%s' \
            AND forcastedvalue.forecasttype = 'snowwater' ) \
            GROUP BY forcastedvalue.riskstate" %(YEAR,MONTH,DAY))
        row = cursor.fetchall()
        cursor.close()
    elif flag=='currentProvince':
        cursor = connections['geodb'].cursor()
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 =  "prov_code  = '"+str(code)+"'"
        cursor.execute("select forcastedvalue.riskstate, \
            sum(afg_avsa.avalanche_pop) \
            FROM afg_avsa \
            INNER JOIN current_sc_basins ON (ST_WITHIN(ST_Centroid(afg_avsa.wkb_geometry), current_sc_basins.wkb_geometry)) \
            INNER JOIN afg_sheda_lvl4 ON ( afg_avsa.basinmember_id = afg_sheda_lvl4.ogc_fid ) \
            INNER JOIN forcastedvalue ON ( afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id ) \
            WHERE (NOT (afg_avsa.basinmember_id IN (SELECT U1.ogc_fid FROM afg_sheda_lvl4 U1 LEFT OUTER JOIN forcastedvalue U2 ON ( U1.ogc_fid = U2.basin_id ) WHERE U2.riskstate IS NULL)) \
            AND forcastedvalue.datadate = '%s-%s-%s' \
            AND forcastedvalue.forecasttype = 'snowwater' ) \
            and afg_avsa.%s \
            GROUP BY forcastedvalue.riskstate" %(YEAR,MONTH,DAY,ff0001))
        row = cursor.fetchall()
        cursor.close()
    elif flag=='drawArea':
        cursor = connections['geodb'].cursor()
        cursor.execute("select forcastedvalue.riskstate, \
            sum(case \
                when ST_CoveredBy(afg_avsa.wkb_geometry , %s) then afg_avsa.avalanche_pop \
                else st_area(st_intersection(afg_avsa.wkb_geometry, %s)) / st_area(afg_avsa.wkb_geometry)* avalanche_pop end \
            ) \
            FROM afg_avsa \
            INNER JOIN current_sc_basins ON (ST_WITHIN(ST_Centroid(afg_avsa.wkb_geometry), current_sc_basins.wkb_geometry)) \
            INNER JOIN afg_sheda_lvl4 ON ( afg_avsa.basinmember_id = afg_sheda_lvl4.ogc_fid ) \
            INNER JOIN forcastedvalue ON ( afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id ) \
            WHERE (NOT (afg_avsa.basinmember_id IN (SELECT U1.ogc_fid FROM afg_sheda_lvl4 U1 LEFT OUTER JOIN forcastedvalue U2 ON ( U1.ogc_fid = U2.basin_id ) WHERE U2.riskstate IS NULL)) \
            AND forcastedvalue.datadate = '%s-%s-%s' \
            AND forcastedvalue.forecasttype = 'snowwater' ) \
            GROUP BY forcastedvalue.riskstate" %(filterLock,filterLock,YEAR,MONTH,DAY))
        row = cursor.fetchall()
        cursor.close()
    else:
        cursor = connections['geodb'].cursor()
        cursor.execute("select forcastedvalue.riskstate, \
            sum(afg_avsa.avalanche_pop) \
            FROM afg_avsa \
            INNER JOIN current_sc_basins ON (ST_WITHIN(ST_Centroid(afg_avsa.wkb_geometry), current_sc_basins.wkb_geometry)) \
            INNER JOIN afg_sheda_lvl4 ON ( afg_avsa.basinmember_id = afg_sheda_lvl4.ogc_fid ) \
            INNER JOIN forcastedvalue ON ( afg_sheda_lvl4.ogc_fid = forcastedvalue.basin_id ) \
            WHERE (NOT (afg_avsa.basinmember_id IN (SELECT U1.ogc_fid FROM afg_sheda_lvl4 U1 LEFT OUTER JOIN forcastedvalue U2 ON ( U1.ogc_fid = U2.basin_id ) WHERE U2.riskstate IS NULL)) \
            AND forcastedvalue.datadate = '%s-%s-%s' \
            AND forcastedvalue.forecasttype = 'snowwater' ) \
            AND ST_Within(afg_avsa.wkb_geometry, %s) \
            GROUP BY forcastedvalue.riskstate" %(YEAR,MONTH,DAY,filterLock))
        row = cursor.fetchall()
        cursor.close()

    response['ava_forecast_low_pop']=round(dict(row).get(1, 0),0)
    response['ava_forecast_med_pop']=round(dict(row).get(2, 0),0)
    response['ava_forecast_high_pop']=round(dict(row).get(3, 0),0)
    response['total_ava_forecast_pop']=response['ava_forecast_low_pop'] + response['ava_forecast_med_pop'] + response['ava_forecast_high_pop']

    return response

def getAvalancheRisk(request, filterLock, flag, code):
    targetBase = AfgLndcrva.objects.all()
    response = getCommonUse(request, flag, code)
    response['Population']=getTotalPop(filterLock, flag, code, targetBase)
    response['Area']=getTotalArea(filterLock, flag, code, targetBase)
    response['settlement']=getTotalSettlement(filterLock, flag, code, targetBase)

    rawAvalancheRisk = getRawAvalancheRisk(filterLock, flag, code)
    for i in rawAvalancheRisk:
        response[i]=rawAvalancheRisk[i]

    response['total_pop_atrisk_percent'] = int(round((response['total_ava_population']/response['Population'])*100,0))
    response['total_area_atrisk_percent'] = int(round((response['total_ava_area']/response['Area'])*100,0))

    response['total_pop_high_atrisk_percent'] = int(round((response['high_ava_population']/response['Population'])*100,0))
    response['total_area_high_atrisk_percent'] = int(round((response['high_ava_area']/response['Area'])*100,0))

    response['total_pop_med_atrisk_percent'] = int(round((response['med_ava_population']/response['Population'])*100,0))
    response['total_area_med_atrisk_percent'] = int(round((response['med_ava_area']/response['Area'])*100,0))

    data1 = []
    data1.append(['agg_simplified_description','area_population'])
    data1.append(['',response['total_ava_population']])
    data1.append(['',response['Population']-response['total_ava_population']])
    response['total_pop_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data2 = []
    data2.append(['agg_simplified_description','area_population'])
    data2.append(['',response['total_ava_area']])
    data2.append(['',response['Area']-response['total_ava_area']])
    response['total_area_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data3 = []
    data3.append(['agg_simplified_description','area_population'])
    data3.append(['',response['high_ava_population']])
    data3.append(['',response['Population']-response['high_ava_population']])
    response['high_pop_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data3), html_id="pie_chart3", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data4 = []
    data4.append(['agg_simplified_description','area_population'])
    data4.append(['',response['med_ava_population']])
    data4.append(['',response['Population']-response['med_ava_population']])
    response['med_pop_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data4), html_id="pie_chart4", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data = getProvinceSummary(filterLock, flag, code)

    for i in data:
        i['total_pop_atrisk_percent'] = int(round(i['total_ava_population']/i['Population']*100,0))
        i['total_area_atrisk_percent'] = int(round(i['total_ava_area']/i['Area']*100,0))
        i['total_pop_high_atrisk_percent'] = int(round(i['high_ava_population']/i['Population']*100,0))
        i['total_area_high_atrisk_percent'] = int(round(i['high_ava_area']/i['Area']*100,0))
        i['total_pop_med_atrisk_percent'] = int(round(i['med_ava_population']/i['Population']*100,0))
        i['total_area_med_atrisk_percent'] = int(round(i['med_ava_area']/i['Area']*100,0))

    response['lc_child']=data

    return response

def getFloodRisk(request, filterLock, flag, code):
    targetBase = AfgLndcrva.objects.all()
    response = getCommonUse(request, flag, code)
    response['Population']=getTotalPop(filterLock, flag, code, targetBase)
    response['Area']=getTotalArea(filterLock, flag, code, targetBase)
    response['settlement']=getTotalSettlement(filterLock, flag, code, targetBase)

    rawBaseline = getRawBaseLine(filterLock, flag, code)
    rawFloodRisk = getRawFloodRisk(filterLock, flag, code)

    for i in rawBaseline:
        response[i]=rawBaseline[i]

    for i in rawFloodRisk:
        response[i]=rawFloodRisk[i]

    if response['Population']==0:
        response['Population'] = 0.000001
    if response['built_up_pop']==0:
        response['built_up_pop'] = 0.000001
    if response['built_up_area']==0:
        response['built_up_area'] = 0.000001
    if response['cultivated_pop']==0:
        response['cultivated_pop'] = 0.000001
    if response['cultivated_area']==0:
        response['cultivated_area'] = 0.000001
    if response['barren_pop']==0:
        response['barren_pop'] = 0.000001
    if response['barren_area']==0:
        response['barren_area'] = 0.000001

    response['settlement_at_floodrisk'] = getSettlementAtFloodRisk(filterLock, flag, code)
    response['settlement_at_floodrisk_percent'] = int(round((response['settlement_at_floodrisk']/response['settlement'])*100,0))

    response['total_pop_atrisk_percent'] = int(round((response['total_risk_population']/response['Population'])*100,0))
    response['total_area_atrisk_percent'] = int(round((response['total_risk_area']/response['Area'])*100,0))

    response['total_pop_high_atrisk_percent'] = int(round((response['high_risk_population']/response['Population'])*100,0))
    response['total_pop_med_atrisk_percent'] = int(round((response['med_risk_population']/response['Population'])*100,0))
    response['total_pop_low_atrisk_percent'] = int(round((response['low_risk_population']/response['Population'])*100,0))

    response['built_up_pop_risk_percent'] = int(round((response['built_up_pop_risk']/response['built_up_pop'])*100,0))
    response['built_up_area_risk_percent'] = int(round((response['built_up_area_risk']/response['built_up_area'])*100,0))

    response['cultivated_pop_risk_percent'] = int(round((response['cultivated_pop_risk']/response['cultivated_pop'])*100,0))
    response['cultivated_area_risk_percent'] = int(round((response['cultivated_area_risk']/response['cultivated_area'])*100,0))

    response['barren_pop_risk_percent'] = int(round((response['barren_pop_risk']/response['barren_pop'])*100,0))
    response['barren_area_risk_percent'] = int(round((response['barren_area_risk']/response['barren_area'])*100,0))

    data1 = []
    data1.append(['agg_simplified_description','area_population'])
    data1.append(['',response['total_risk_population']])
    data1.append(['',response['Population']-response['total_risk_population']])
    response['total_pop_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data2 = []
    data2.append(['agg_simplified_description','area_population'])
    data2.append(['',response['high_risk_population']])
    data2.append(['',response['Population']-response['high_risk_population']])
    response['high_pop_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data3 = []
    data3.append(['agg_simplified_description','area_population'])
    data3.append(['',response['med_risk_population']])
    data3.append(['',response['Population']-response['med_risk_population']])
    response['med_pop_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data3), html_id="pie_chart3", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data4 = []
    data4.append(['agg_simplified_description','area_population'])
    data4.append(['',response['low_risk_population']])
    data4.append(['',response['Population']-response['low_risk_population']])
    response['low_pop_atrisk_chart'] = gchart.PieChart(SimpleDataSource(data=data4), html_id="pie_chart4", options={'title':'', 'width': 135,'height': 135, 'pieSliceText': 'number', 'pieSliceTextStyle': 'black','legend': 'none', 'pieHole': 0.75, 'slices':{0:{'color':'red'},1:{'color':'grey'}}, 'pieStartAngle': 270, 'tooltip': { 'trigger': 'none' }, })

    data = getProvinceSummary(filterLock, flag, code)

    for i in data:
        if i['Population']==0:
            i['Population'] = 0.000001
        if i['built_up_pop']==0:
            i['built_up_pop'] = 0.000001
        if i['built_up_area']==0:
            i['built_up_area'] = 0.000001
        if i['cultivated_pop']==0:
            i['cultivated_pop'] = 0.000001
        if i['cultivated_area']==0:
            i['cultivated_area'] = 0.000001
        if i['barren_pop']==0:
            i['barren_pop'] = 0.000001
        if i['barren_area']==0:
            i['barren_area'] = 0.000001

        i['settlement_at_floodrisk_percent'] = int(round(i['settlements_at_risk']/i['settlements']*100,0))
        i['total_pop_atrisk_percent'] = int(round(i['total_risk_population']/i['Population']*100,0))
        i['total_area_atrisk_percent'] = int(round(i['total_risk_area']/i['Area']*100,0))
        i['built_up_pop_risk_percent'] = int(round(i['built_up_pop_risk']/i['built_up_pop']*100,0))
        i['built_up_area_risk_percent'] = int(round(i['built_up_area_risk']/i['built_up_area']*100,0))
        i['cultivated_pop_risk_percent'] = int(round(i['cultivated_pop_risk']/i['cultivated_pop']*100,0))
        i['cultivated_area_risk_percent'] = int(round(i['cultivated_area_risk']/i['cultivated_area']*100,0))
        i['barren_pop_risk_percent'] = int(round(i['barren_pop_risk']/i['barren_pop']*100,0))
        i['barren_area_risk_percent'] = int(round(i['barren_area_risk']/i['barren_area']*100,0))

    response['lc_child']=data

    return response

def getSettlementAtFloodRisk(filterLock, flag, code):
    response = {}
    targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
    targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and Marshland')

    # Number settlement at risk of flood
    if flag=='drawArea':
        countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Build Up').extra(
            select={
                'numbersettlementsatrisk': 'count(distinct vuid)'},
            where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*fldarea_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')
    elif flag=='entireAfg':
        countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Build Up').extra(
            select={
                'numbersettlementsatrisk': 'count(distinct vuid)'}).values('numbersettlementsatrisk')
    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 =  "prov_code  = '"+str(code)+"'"
        countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Build Up').extra(
            select={
                'numbersettlementsatrisk': 'count(distinct vuid)'},
            where = {ff0001}).values('numbersettlementsatrisk')
    elif flag=='currentBasin':
        countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Build Up').extra(
            select={
                'numbersettlementsatrisk': 'count(distinct vuid)'},
            where = {"vuid = '"+str(code)+"'"}).values('numbersettlementsatrisk')
    else:
        countsBase = targetRisk.exclude(mitigated_pop__gt=0).filter(agg_simplified_description='Build Up').extra(
            select={
                'numbersettlementsatrisk': 'count(distinct vuid)'},
            where = {'ST_Within(wkb_geometry, '+filterLock+')'}).values('numbersettlementsatrisk')

    return round(countsBase[0]['numbersettlementsatrisk'],0)

def getRawAvalancheRisk(filterLock, flag, code):
    response = {}
    targetAvalanche = AfgAvsa.objects.all()
    counts =  getRiskNumber(targetAvalanche, filterLock, 'avalanche_cat', 'avalanche_pop', 'sum_area_sqm', 'area_buildings', flag, code, None)
    # pop at risk level
    temp = dict([(c['avalanche_cat'], c['count']) for c in counts])
    response['high_ava_population']=round(temp.get('High', 0) or 0,0)
    response['med_ava_population']=round(temp.get('Moderate', 0) or 0, 0)
    response['low_ava_population']=0
    response['total_ava_population']=response['high_ava_population']+response['med_ava_population']+response['low_ava_population']

    # area at risk level
    temp = dict([(c['avalanche_cat'], c['areaatrisk']) for c in counts])
    response['high_ava_area']=round((temp.get('High', 0) or 0)/1000000,1)
    response['med_ava_area']=round((temp.get('Moderate', 0) or 0)/1000000,1)
    response['low_ava_area']=0
    response['total_ava_area']=round(response['high_ava_area']+response['med_ava_area']+response['low_ava_area'],2)

    return response

def getRawFloodRisk(filterLock, flag, code):
    response = {}
    targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
    targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and Marshland')

    # Flood Risk
    counts =  getRiskNumber(targetRisk.exclude(mitigated_pop__gt=0), filterLock, 'deeperthan', 'fldarea_population', 'fldarea_sqm', 'area_buildings', flag, code, None)

    # pop at risk level
    temp = dict([(c['deeperthan'], c['count']) for c in counts])
    response['high_risk_population']=round(temp.get('271 cm', 0) or 0,0)
    response['med_risk_population']=round(temp.get('121 cm', 0) or 0, 0)
    response['low_risk_population']=round(temp.get('029 cm', 0) or 0,0)
    response['total_risk_population']=response['high_risk_population']+response['med_risk_population']+response['low_risk_population']

    # building at risk level
    temp = dict([(c['deeperthan'], c['houseatrisk']) for c in counts])
    response['high_risk_buildings']=round(temp.get('271 cm', 0) or 0,0)
    response['med_risk_buildings']=round(temp.get('121 cm', 0) or 0, 0)
    response['low_risk_buildings']=round(temp.get('029 cm', 0) or 0,0)
    response['total_risk_buildings']=response['high_risk_buildings']+response['med_risk_buildings']+response['low_risk_buildings']


    # area at risk level
    temp = dict([(c['deeperthan'], c['areaatrisk']) for c in counts])
    response['high_risk_area']=round((temp.get('271 cm', 0) or 0)/1000000,1)
    response['med_risk_area']=round((temp.get('121 cm', 0) or 0)/1000000,1)
    response['low_risk_area']=round((temp.get('029 cm', 0) or 0)/1000000,1)
    response['total_risk_area']=round(response['high_risk_area']+response['med_risk_area']+response['low_risk_area'],2)

    counts =  getRiskNumber(targetRiskIncludeWater.exclude(mitigated_pop__gt=0), filterLock, 'agg_simplified_description', 'fldarea_population', 'fldarea_sqm', 'area_buildings', flag, code, None)

    # landcover/pop/atrisk
    temp = dict([(c['agg_simplified_description'], c['count']) for c in counts])
    response['built_up_pop_risk'] = round(temp.get('Build Up', 0) or 0,0)
    response['cultivated_pop_risk'] = round(temp.get('Fruit Trees', 0) or 0,0)+round(temp.get('Irrigated Agricultural Land', 0) or 0,0)+round(temp.get('Rainfed', 0) or 0,0)+round(temp.get('Vineyards', 0) or 0,0)
    response['barren_pop_risk'] = round(temp.get('Barren land', 0) or 0,0)+round(temp.get('Snow', 0) or 0,0) +round(temp.get('Rangeland', 0) or 0,0)+round(temp.get('Sand Covered Areas', 0) or 0,0)+round(temp.get('Forest & Shrub', 0) or 0,0)+round(temp.get('Sand Dunes', 0) or 0,0)

    temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
    response['built_up_area_risk'] = round((temp.get('Build Up', 0) or 0)/1000000,1)
    response['cultivated_area_risk'] = round((temp.get('Fruit Trees', 0) or 0)/1000000,1)+round((temp.get('Irrigated Agricultural Land', 0) or 0)/1000000,1)+round((temp.get('Rainfed', 0) or 0)/1000000,1)+round((temp.get('Vineyards', 0) or 0)/1000000,1)
    response['barren_area_risk'] = round((temp.get('Barren land', 0) or 0)/1000000,1)+round((temp.get('Snow', 0) or 0)/1000000,1)+round((temp.get('Rangeland', 0) or 0)/1000000,1)+round((temp.get('Sand Covered Areas', 0) or 0)/1000000,1)+round((temp.get('Forest & Shrub', 0) or 0)/1000000,1)+round((temp.get('Sand Dunes', 0) or 0)/1000000,1)

    return response

def getRawBaseLine(filterLock, flag, code):
    targetBase = AfgLndcrva.objects.all()
    response = {}
    parent_data = getRiskNumber(targetBase, filterLock, 'agg_simplified_description', 'area_population', 'area_sqm', 'area_buildings', flag, code, None)
    
    temp = dict([(c['agg_simplified_description'], c['count']) for c in parent_data])
    response['built_up_pop'] = round(temp.get('Build Up', 0),0)
    response['cultivated_pop'] = round(temp.get('Fruit Trees', 0),0)+round(temp.get('Irrigated Agricultural Land', 0),0)+round(temp.get('Rainfed', 0),0)+round(temp.get('Vineyards', 0),0)
    response['barren_pop'] = round(temp.get('Water body and Marshland', 0),0)+round(temp.get('Barren land', 0),0)+round(temp.get('Snow', 0),0)+round(temp.get('Rangeland', 0),0)+round(temp.get('Sand Covered Areas', 0),0)+round(temp.get('Forest & Shrub', 0),0)+round(temp.get('Sand Dunes', 0),0)

    temp = dict([(c['agg_simplified_description'], c['houseatrisk']) for c in parent_data])
    response['built_up_buildings'] = temp.get('Build Up', 0) or 0
    response['cultivated_buildings'] = temp.get('Fruit Trees', 0) or 0+temp.get('Irrigated Agricultural Land', 0) or 0+temp.get('Rainfed', 0) or 0+temp.get('Vineyards', 0) or 0
    response['barren_buildings'] = temp.get('Water body and Marshland', 0) or 0+temp.get('Barren land', 0) or 0+temp.get('Snow', 0) or 0+temp.get('Rangeland', 0) or 0+temp.get('Sand Covered Areas', 0) or 0+temp.get('Forest & Shrub', 0) or 0+temp.get('Sand Dunes', 0) or 0

    temp = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in parent_data])
    response['built_up_area'] = round(temp.get('Build Up', 0)/1000000,1)
    response['cultivated_area'] = round(temp.get('Fruit Trees', 0)/1000000,1)+round(temp.get('Irrigated Agricultural Land', 0)/1000000,1)+round(temp.get('Rainfed', 0)/1000000,1)+round(temp.get('Vineyards', 0)/1000000,1)
    response['barren_area'] = round(temp.get('Water body and Marshland', 0)/1000000,1)+round(temp.get('Barren land', 0)/1000000,1)+round(temp.get('Snow', 0)/1000000,1)+round(temp.get('Rangeland', 0)/1000000,1)+round(temp.get('Sand Covered Areas', 0)/1000000,1)+round(temp.get('Forest & Shrub', 0)/1000000,1)+round(temp.get('Sand Dunes', 0)/1000000,1)

    return response

def getBaseline(request, filterLock, flag, code):
    response = getCommonUse(request, flag, code)
    targetBase = AfgLndcrva.objects.all()

    response['Population']=getTotalPop(filterLock, flag, code, targetBase)
    response['Area']=getTotalArea(filterLock, flag, code, targetBase)
    response['Buildings']=getTotalBuildings(filterLock, flag, code, targetBase)
    response['settlement']=getTotalSettlement(filterLock, flag, code, targetBase)
    response['hltfac']=getTotalHealthFacilities(filterLock, flag, code, AfgHltfac)
    response['roadnetwork']=getTotalRoadNetwork(filterLock, flag, code, AfgRdsl)
    if response['roadnetwork']==0:
        response['roadnetwork'] = 0.00000000001

    rawBaseline = getRawBaseLine(filterLock, flag, code)
    for i in rawBaseline:
        response[i]=rawBaseline[i]

    hltParentData = getParentHltFacRecap(filterLock, flag, code)
    tempHLTBase = dict([(c['facility_types_description'], c['numberhospital']) for c in hltParentData])
    response['hlt_h1'] = round(tempHLTBase.get("Regional / National Hospital (H1)", 0))
    response['hlt_h2'] = round(tempHLTBase.get("Provincial Hospital (H2)", 0))
    response['hlt_h3'] = round(tempHLTBase.get("District Hospital (H3)", 0))
    response['hlt_chc'] = round(tempHLTBase.get("Comprehensive Health Center (CHC)", 0))
    response['hlt_bhc'] = round(tempHLTBase.get("Basic Health Center (BHC)", 0))
    response['hlt_shc'] = round(tempHLTBase.get("Sub Health Center (SHC)", 0))
    response['hlt_others'] = round(tempHLTBase.get("Rehabilitation Center (RH)", 0))+round(tempHLTBase.get("Special Hospital (SH)", 0))+round(tempHLTBase.get("Maternity Home (MH)", 0))+round(tempHLTBase.get("Drug Addicted Treatment Center", 0))+round(tempHLTBase.get("Private Clinic", 0))+round(tempHLTBase.get("Other", 0))+round(tempHLTBase.get("Malaria Center (MC)", 0))+round(tempHLTBase.get("Mobile Health Team (MHT)", 0))

    roadParentData = getParentRoadNetworkRecap(filterLock, flag, code)
    tempRoadBase = dict([(c['type_update'], c['road_length']) for c in roadParentData])
    response['road_primary'] = round(tempRoadBase.get("primary", 0))
    response['road_secondary'] = round(tempRoadBase.get("secondary", 0))
    response['road_track'] = round(tempRoadBase.get("track", 0))
    response['road_tertiary'] = round(tempRoadBase.get("tertiary", 0))
    response['road_path'] = round(tempRoadBase.get("path", 0))
    response['road_highway'] = round(tempRoadBase.get("highway", 0))
    response['road_residential'] = round(tempRoadBase.get("residential", 0))
    response['road_river_crossing'] = round(tempRoadBase.get("river crossing", 0))
    response['road_bridge'] = round(tempRoadBase.get("bridge", 0))

    data = getProvinceSummary(filterLock, flag, code)
    response['lc_child']=data

    data = getProvinceAdditionalSummary(filterLock, flag, code)
    response['additional_child']=data

    dataLC = []
    dataLC.append([_('landcover type'),_('population'), { 'role': 'annotation' },_('buildings'), { 'role': 'annotation' },_('area (km2)'), { 'role': 'annotation' }])
    dataLC.append([_('Built-up'),round(response['built_up_pop']/response['Population']*100,0), response['built_up_pop'],round(response['built_up_buildings']/response['Buildings']*100,0), response['built_up_buildings'], round(response['built_up_area']/response['Area']*100,0), response['built_up_area'] ])
    dataLC.append([_('Cultivated'),round(response['cultivated_pop']/response['Population']*100,0), response['cultivated_pop'],round(response['cultivated_buildings']/response['Buildings']*100,0), response['cultivated_buildings'], round(response['cultivated_area']/response['Area']*100,0), response['cultivated_area'] ])
    dataLC.append([_('Barren/Rangeland'),round(response['barren_pop']/response['Population']*100,0), response['barren_pop'],round(response['barren_buildings']/response['Buildings']*100,0), response['barren_buildings'], round(response['barren_area']/response['Area']*100,0), response['barren_area'] ])
    response['landcover_chart'] = gchart.BarChart(
        SimpleDataSource(data=dataLC),
        html_id="pie_chart1",
        options={
            'title': _('Landcover Population and area overview'),
            # 'subtitle': 'figure as percent from total population and area',
            'width': 450,
            'height': 300,
            # 'legend': { 'position': 'none' },
            # 'chart': { 'title': 'Landcover Population and area overview', 'subtitle': 'figure as percent from total population and area' },
            'bars': 'horizontal',
            'axes': {
                'x': {
                  '0': { 'side': 'top', 'label': _('Percentage')}
                },

            },
            'bar': { 'groupWidth': '90%' },
            'chartArea': {'width': '50%'},
            'titleX':_('percentages from total population, buildings & area'),
    })
    if response['hltfac']==0:
        response['hltfac'] = 0.000001

    dataHLT = []
    dataHLT.append([_('health facility type'),_('percent of health facility'), { 'role': 'annotation' }])
    dataHLT.append([_('H1'),round(response['hlt_h1']/response['hltfac']*100,0), response['hlt_h1'] ])
    dataHLT.append([_('H2'),round(response['hlt_h2']/response['hltfac']*100,0), response['hlt_h2'] ])
    dataHLT.append([_('H3'),round(response['hlt_h3']/response['hltfac']*100,0), response['hlt_h3'] ])
    dataHLT.append([_('CHC'),round(response['hlt_chc']/response['hltfac']*100,0), response['hlt_chc'] ])
    dataHLT.append([_('BHC'),round(response['hlt_bhc']/response['hltfac']*100,0), response['hlt_bhc'] ])
    dataHLT.append([_('SHC'),round(response['hlt_shc']/response['hltfac']*100,0), response['hlt_shc'] ])
    dataHLT.append([_('Others'),round(response['hlt_others']/response['hltfac']*100,0), response['hlt_others'] ])
    response['hlt_chart'] = gchart.BarChart(
        SimpleDataSource(data=dataHLT),
        html_id="pie_chart2",
        options={
            'title': _('Health facilities overview'),
            # 'subtitle': 'figure as percent from total population and area',
            'width': 450,
            'height': 300,
            'legend': { 'position': 'none' },
            # 'chart': { 'title': 'Landcover Population and area overview', 'subtitle': 'figure as percent from total population and area' },
            'bars': 'horizontal',
            'axes': {
                'x': {
                  '0': { 'side': 'top', 'label': _('Percentage')}
                },

            },
            'bar': { 'groupWidth': '90%' },
            'chartArea': {'width': '50%'},
            'titleX':_('percentages from total health facilities'),
    })

    dataRDN = []
    dataRDN.append([_('road network type'),_('percent of road network'), { 'role': 'annotation' }])
    dataRDN.append([_('Highway'),round(response['road_highway']/response['roadnetwork']*100,0), response['road_highway'] ])
    dataRDN.append([_('Primary'),round(response['road_primary']/response['roadnetwork']*100,0), response['road_primary'] ])
    dataRDN.append([_('Secondary'),round(response['road_secondary']/response['roadnetwork']*100,0), response['road_secondary'] ])
    dataRDN.append([_('Tertiary'),round(response['road_tertiary']/response['roadnetwork']*100,0), response['road_tertiary'] ])
    dataRDN.append([_('Residential'),round(response['road_residential']/response['roadnetwork']*100,0), response['road_residential'] ])
    dataRDN.append([_('Track'),round(response['road_track']/response['roadnetwork']*100,0), response['road_track'] ])
    dataRDN.append([_('Path'),round(response['road_path']/response['roadnetwork']*100,0), response['road_path'] ])
    dataRDN.append([_('River crossing'),round(response['road_river_crossing']/response['roadnetwork']*100,0), response['road_river_crossing'] ])
    dataRDN.append([_('Bridge'),round(response['road_bridge']/response['roadnetwork']*100,0), response['road_bridge'] ])
    response['rdn_chart'] = gchart.BarChart(
        SimpleDataSource(data=dataRDN),
        options={
            'title': _('Road network overview'),
            # 'subtitle': 'figure as percent from total population and area',
            'width': 450,
            'height': 300,
            'legend': { 'position': 'none' },
            # 'chart': { 'title': 'Landcover Population and area overview', 'subtitle': 'figure as percent from total population and area' },
            'bars': 'horizontal',
            'axes': {
                'x': {
                  '0': { 'side': 'top', 'label': _('Percentage')}
                },

            },
            'bar': { 'groupWidth': '90%' },
            'chartArea': {'width': '50%'},
            'titleX':_('percentages from total length of road network'),
    })

    # print response['poi_points']
    # print response['additional_child']
    # for i in response['additional_child']:
    #     test = [item for item in response['poi_points'] if item['code'] == i['code']][0]
    #     i['x'] = test['x']
    #     i['y'] = test['y']

    # response['additional_child'] = json.dumps(response['additional_child'])
    # print response['additional_child']
    return response

def getParentRoadNetworkRecap(filterLock, flag, code):
    if flag=='drawArea':
        countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
        select={
            'road_length' : 'SUM(  \
                    case \
                        when ST_CoveredBy(wkb_geometry'+','+filterLock+') then road_length \
                        else ST_Length(st_intersection(wkb_geometry::geography'+','+filterLock+')) / road_length end \
                )/1000'
        },
        where = {
            'ST_Intersects(wkb_geometry'+', '+filterLock+')'
        }).values('type_update','road_length')

    elif flag=='entireAfg':
        countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
                select={
                    'road_length' : 'SUM(road_length)/1000'
                }).values('type_update', 'road_length')

    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            if len(str(code))==1:
                ff0001 =  "left(cast(dist_code as text),1)  = '"+str(code)+"' and length(cast(dist_code as text))=3"
            else:
                ff0001 =  "left(cast(dist_code as text),2)  = '"+str(code)+"' and length(cast(dist_code as text))=4"

        countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
            select={
                 'road_length' : 'SUM(road_length)/1000'
            },
            where = {
                ff0001
             }).values('type_update','road_length')

    elif flag=='currentBasin':
        print 'currentBasin'
    else:
        countsRoadBase = AfgRdsl.objects.all().values('type_update').annotate(counter=Count('ogc_fid')).extra(
            select={
                'road_length' : 'SUM(road_length)/1000'
            },
            where = {
                'ST_Within(wkb_geometry'+', '+filterLock+')'
            }).values('type_update','road_length')
    return countsRoadBase

def getParentHltFacRecap(filterLock, flag, code):
    targetBase = AfgHltfac.objects.all().filter(activestatus='Y')
    if flag=='drawArea':
        countsHLTBase = targetBase.values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
                select={
                    'numberhospital' : 'count(*)'
                },
                where = {
                    'ST_Intersects(wkb_geometry'+', '+filterLock+')'
                }).values('facility_types_description','numberhospital')

    elif flag=='entireAfg':
        countsHLTBase = targetBase.values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
                select={
                    'numberhospital' : 'count(*)'
                }).values('facility_types_description','numberhospital')

    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 = "prov_code  = '"+str(code)+"'"

        countsHLTBase = targetBase.values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
            select={
                    'numberhospital' : 'count(*)'
            },where = {
                ff0001
            }).values('facility_types_description','numberhospital')
    elif flag=='currentBasin':
        print 'currentBasin'
    else:
        countsHLTBase = targetBase.values('facility_types_description').annotate(counter=Count('ogc_fid')).extra(
            select={
                    'numberhospital' : 'count(*)'
            },where = {
                'ST_Within(wkb_geometry'+', '+filterLock+')'
            }).values('facility_types_description','numberhospital')
    return countsHLTBase

def getTotalBuildings(filterLock, flag, code, targetBase):
    # All population number
    if flag=='drawArea':
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,'+filterLock+') then area_buildings \
                            else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_buildings end \
                    )'
            },
            where = {
                'ST_Intersects(wkb_geometry, '+filterLock+')'
            }).values('countbase')
    elif flag=='entireAfg':
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_buildings)'
            }).values('countbase')
    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 =  "prov_code  = '"+str(code)+"'"
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_buildings)'
            },
            where = {
                ff0001
            }).values('countbase')
    elif flag=='currentBasin':
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_buildings)'
            },
            where = {"vuid = '"+str(code)+"'"}).values('countbase')
    else:
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_buildings)'
            },
            where = {
                'ST_Within(wkb_geometry, '+filterLock+')'
            }).values('countbase')

    return round(countsBase[0]['countbase'],0)

def getTotalPop(filterLock, flag, code, targetBase):
    # All population number
    if flag=='drawArea':
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,'+filterLock+') then area_population \
                            else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_population end \
                    )'
            },
            where = {
                'ST_Intersects(wkb_geometry, '+filterLock+')'
            }).values('countbase')
    elif flag=='entireAfg':
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_population)'
            }).values('countbase')
    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 =  "prov_code  = '"+str(code)+"'"
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_population)'
            },
            where = {
                ff0001
            }).values('countbase')
    elif flag=='currentBasin':
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_population)'
            },
            where = {"vuid = '"+str(code)+"'"}).values('countbase')
    else:
        countsBase = targetBase.extra(
            select={
                'countbase' : 'SUM(area_population)'
            },
            where = {
                'ST_Within(wkb_geometry, '+filterLock+')'
            }).values('countbase')

    return round(countsBase[0]['countbase'],0)

def getTotalArea(filterLock, flag, code, targetBase):
    if flag=='drawArea':
        countsBase = targetBase.extra(
            select={
                'areabase' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,'+filterLock+') then area_sqm \
                            else st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_sqm end \
                    )'
            },
            where = {
                'ST_Intersects(wkb_geometry, '+filterLock+')'
            }).values('areabase')
    elif flag=='entireAfg':
        countsBase = targetBase.extra(
            select={
                'areabase' : 'SUM(area_sqm)'
            }).values('areabase')
    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 =  "prov_code  = '"+str(code)+"'"
        countsBase = targetBase.extra(
            select={
                'areabase' : 'SUM(area_sqm)'
            },
            where = {
                ff0001
            }).values('areabase')
    elif flag=='currentBasin':
        countsBase = targetBase.extra(
            select={
                'areabase' : 'SUM(area_sqm)'
            },
            where = {"vuid = '"+str(code)+"'"}).values('areabase')

    else:
        countsBase = targetBase.extra(
            select={
                'areabase' : 'SUM(area_sqm)'
            },
            where = {
                'ST_Within(wkb_geometry, '+filterLock+')'
            }).values('areabase')

    return round(countsBase[0]['areabase']/1000000,0)

def getTotalSettlement(filterLock, flag, code, targetBase):
    if flag=='drawArea':
        countsBase = targetBase.exclude(agg_simplified_description='Water body and Marshland').extra(
            select={
                'numbersettlements': 'count(distinct vuid)'},
            where = {'st_area(st_intersection(wkb_geometry,'+filterLock+')) / st_area(wkb_geometry)*area_sqm > 1 and ST_Intersects(wkb_geometry, '+filterLock+')'}).values('numbersettlements')
    elif flag=='entireAfg':
        countsBase = targetBase.exclude(agg_simplified_description='Water body and Marshland').extra(
            select={
                'numbersettlements': 'count(distinct vuid)'}).values('numbersettlements')
    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 =  "prov_code  = '"+str(code)+"'"
        countsBase = targetBase.exclude(agg_simplified_description='Water body and Marshland').extra(
            select={
                'numbersettlements': 'count(distinct vuid)'},
            where = {ff0001}).values('numbersettlements')
    elif flag=='currentBasin':
        countsBase = targetBase.exclude(agg_simplified_description='Water body and Marshland').extra(
            select={
                'numbersettlements': 'count(distinct vuid)'},
            where = {"vuid = '"+str(code)+"'"}).values('numbersettlements')
    else:
        countsBase = targetBase.exclude(agg_simplified_description='Water body and Marshland').extra(
            select={
                'numbersettlements': 'count(distinct vuid)'},
            where = {'ST_Within(wkb_geometry, '+filterLock+')'}).values('numbersettlements')

    return round(countsBase[0]['numbersettlements'],0)

def getTotalHealthFacilities(filterLock, flag, code, targetBase):
    # targetBase = targetBase.objects.all().filter(activestatus='Y').values('facility_types_description')
    targetBase = targetBase.objects.all().filter(activestatus='Y')
    if flag=='drawArea':
        countsHLTBase = targetBase.extra(
                select={
                    'numberhospital' : 'count(*)'
                },
                where = {
                    'ST_Intersects(wkb_geometry'+', '+filterLock+')'
                }).values('numberhospital')

    elif flag=='entireAfg':
        countsHLTBase = targetBase.extra(
                select={
                    'numberhospital' : 'count(*)'
                }).values('numberhospital')

    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            ff0001 = "prov_code  = '"+str(code)+"'"

        countsHLTBase = targetBase.extra(
            select={
                    'numberhospital' : 'count(*)'
            },where = {
                ff0001
            }).values('numberhospital')
    elif flag=='currentBasin':
        print 'currentBasin'
    else:
        countsHLTBase = targetBase.extra(
            select={
                    'numberhospital' : 'count(*)'
            },where = {
                'ST_Within(wkb_geometry'+', '+filterLock+')'
            }).values('numberhospital')
    return round(countsHLTBase[0]['numberhospital'],0)

def getTotalRoadNetwork(filterLock, flag, code, targetBase):
    # targetBase = targetBase.objects.all().filter(activestatus='Y').values('facility_types_description')
    if flag=='drawArea':
        countsRoadBase = targetBase.objects.all().extra(
        select={
            'road_length' : 'SUM(  \
                    case \
                        when ST_CoveredBy(wkb_geometry'+','+filterLock+') then road_length \
                        else ST_Length(st_intersection(wkb_geometry::geography'+','+filterLock+')) / road_length end \
                )/1000'
        },
        where = {
            'ST_Intersects(wkb_geometry'+', '+filterLock+')'
        }).values('road_length')

    elif flag=='entireAfg':
        countsRoadBase = targetBase.objects.all().extra(
                select={
                    'road_length' : 'SUM(road_length)/1000'
                }).values('road_length')

    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            if len(str(code))==1:
                ff0001 =  "left(cast(dist_code as text),1)  = '"+str(code)+"'  and length(cast(dist_code as text))=3"
            else:
                ff0001 =  "left(cast(dist_code as text),2)  = '"+str(code)+"'  and length(cast(dist_code as text))=4"

        countsRoadBase = targetBase.objects.all().extra(
            select={
                 'road_length' : 'SUM(road_length)/1000'
            },
            where = {
                ff0001
             }).values('road_length')

    elif flag=='currentBasin':
        print 'currentBasin'
    else:
        countsRoadBase = targetBase.objects.all().extra(
            select={
                'road_length' : 'SUM(road_length)/1000'
            },
            where = {
                'ST_Within(wkb_geometry'+', '+filterLock+')'
            }).values('road_length')
    return round(float(countsRoadBase[0]['road_length'] or 0),0)

def getProvinceSummary(filterLock, flag, code):
    cursor = connections['geodb'].cursor()

    print flag, code

    if flag == 'entireAfg':
        sql = "select b.prov_code as code, b.prov_na_en as na_en, a.*, \
            a.fruit_trees_pop+a.irrigated_agricultural_land_pop+a.rainfed_agricultural_land_pop+a.vineyards_pop as cultivated_pop,  \
            a.fruit_trees_area+a.irrigated_agricultural_land_area+a.rainfed_agricultural_land_area+a.vineyards_area as cultivated_area,  \
            a.water_body_pop+a.barren_land_pop+a.permanent_snow_pop+a.rangeland_pop+a.sandcover_pop+a.forest_pop+a.sand_dunes_pop as barren_pop,  \
            a.water_body_area+a.barren_land_area+a.permanent_snow_area+a.rangeland_area+a.sandcover_area+a.forest_area+a.sand_dunes_area as barren_area,  \
             \
            a.fruit_trees_pop_risk+a.irrigated_agricultural_land_pop_risk+a.rainfed_agricultural_land_pop_risk+a.vineyards_pop_risk as cultivated_pop_risk, \
            a.fruit_trees_area_risk+a.irrigated_agricultural_land_area_risk+a.rainfed_agricultural_land_area_risk+a.vineyards_area_risk as cultivated_area_risk, \
            a.barren_land_pop_risk+a.permanent_snow_pop_risk+a.rangeland_pop_risk+a.sandcover_pop_risk+a.forest_pop_risk+a.sand_dunes_pop_risk as barren_pop_risk, \
            a.barren_land_area_risk+a.permanent_snow_area_risk+a.rangeland_area_risk+a.sandcover_area_risk+a.forest_area_risk+a.sand_dunes_area_risk as barren_area_risk \
            from provincesummary a \
            inner join afg_admbnda_adm1 b on cast(a.province as integer)=b.prov_code \
            order by a.\"Population\" desc"
    elif flag == 'currentProvince':
        sql = "select b.dist_code as code, b.dist_na_en as na_en, a.*, \
            a.fruit_trees_pop+a.irrigated_agricultural_land_pop+a.rainfed_agricultural_land_pop+a.vineyards_pop as cultivated_pop,  \
            a.fruit_trees_area+a.irrigated_agricultural_land_area+a.rainfed_agricultural_land_area+a.vineyards_area as cultivated_area,  \
            a.water_body_pop+a.barren_land_pop+a.permanent_snow_pop+a.rangeland_pop+a.sandcover_pop+a.forest_pop+a.sand_dunes_pop as barren_pop,  \
            a.water_body_area+a.barren_land_area+a.permanent_snow_area+a.rangeland_area+a.sandcover_area+a.forest_area+a.sand_dunes_area as barren_area,  \
             \
            a.fruit_trees_pop_risk+a.irrigated_agricultural_land_pop_risk+a.rainfed_agricultural_land_pop_risk+a.vineyards_pop_risk as cultivated_pop_risk, \
            a.fruit_trees_area_risk+a.irrigated_agricultural_land_area_risk+a.rainfed_agricultural_land_area_risk+a.vineyards_area_risk as cultivated_area_risk, \
            a.barren_land_pop_risk+a.permanent_snow_pop_risk+a.rangeland_pop_risk+a.sandcover_pop_risk+a.forest_pop_risk+a.sand_dunes_pop_risk as barren_pop_risk, \
            a.barren_land_area_risk+a.permanent_snow_area_risk+a.rangeland_area_risk+a.sandcover_area_risk+a.forest_area_risk+a.sand_dunes_area_risk as barren_area_risk \
            from districtsummary a \
            inner join afg_admbnda_adm2 b on cast(a.district as integer)=b.dist_code \
            where b.prov_code="+str(code)+" \
            order by a.\"Population\" desc"
    else:
        return []

    row = query_to_dicts(cursor, sql)

    response = []

    for i in row:
        response.append(i)

    cursor.close()

    return response

def getProvinceAdditionalSummary(filterLock, flag, code):
    cursor = connections['geodb'].cursor()

    if flag == 'entireAfg':
        sql = "select b.prov_code as code, b.prov_na_en as na_en, a.*, \
        a.hlt_special_hospital+a.hlt_rehabilitation_center+a.hlt_maternity_home+a.hlt_drug_addicted_treatment_center+a.hlt_private_clinic+a.hlt_malaria_center+a.hlt_mobile_health_team+a.hlt_other as hlt_others, \
        a.hlt_special_hospital+a.hlt_rehabilitation_center+a.hlt_maternity_home+a.hlt_drug_addicted_treatment_center+a.hlt_private_clinic+a.hlt_malaria_center+a.hlt_mobile_health_team+a.hlt_other+a.hlt_h1+a.hlt_h2+a.hlt_h3+a.hlt_chc+a.hlt_bhc+a.hlt_shc as hlt_total, \
        a.road_highway+a.road_primary+a.road_secondary+a.road_tertiary+a.road_residential+a.road_track+a.road_path+a.road_river_crossing+a.road_bridge as road_total \
        from province_add_summary a \
        inner join afg_admbnda_adm1 b on cast(a.prov_code as integer)=b.prov_code"
    elif flag == 'currentProvince':
        sql = "select b.dist_code as code, b.dist_na_en as na_en, a.*, \
        a.hlt_special_hospital+a.hlt_rehabilitation_center+a.hlt_maternity_home+a.hlt_drug_addicted_treatment_center+a.hlt_private_clinic+a.hlt_malaria_center+a.hlt_mobile_health_team+a.hlt_other as hlt_others, \
        a.hlt_special_hospital+a.hlt_rehabilitation_center+a.hlt_maternity_home+a.hlt_drug_addicted_treatment_center+a.hlt_private_clinic+a.hlt_malaria_center+a.hlt_mobile_health_team+a.hlt_other+a.hlt_h1+a.hlt_h2+a.hlt_h3+a.hlt_chc+a.hlt_bhc+a.hlt_shc as hlt_total, \
        a.road_highway+a.road_primary+a.road_secondary+a.road_tertiary+a.road_residential+a.road_track+a.road_path+a.road_river_crossing+a.road_bridge as road_total \
        from district_add_summary a \
        inner join afg_admbnda_adm2 b on cast(a.dist_code as integer)=b.dist_code \
        where b.prov_code="+str(code)
    else:
        return []

    row = query_to_dicts(cursor, sql)

    response = []

    for i in row:
        response.append(i)

    cursor.close()

    return response

def getFloodForecastMatrix(filterLock, flag, code):
    response = {}

    YEAR = datetime.datetime.utcnow().strftime("%Y")
    MONTH = datetime.datetime.utcnow().strftime("%m")
    DAY = datetime.datetime.utcnow().strftime("%d")

    targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all()
    targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description=_('Water body and Marshland'))

    counts =  getRiskNumber(targetRisk.exclude(mitigated_pop=0), filterLock, 'deeperthan', 'mitigated_pop', 'fldarea_sqm', 'area_buildings', flag, code, None)
    temp = dict([(c['deeperthan'], c['count']) for c in counts])
    response['high_risk_mitigated_population']=round(temp.get('271 cm', 0) or 0,0)
    response['med_risk_mitigated_population']=round(temp.get('121 cm', 0) or 0, 0)
    response['low_risk_mitigated_population']=round(temp.get('029 cm', 0) or 0,0)
    response['total_risk_mitigated_population']=response['high_risk_mitigated_population']+response['med_risk_mitigated_population']+response['low_risk_mitigated_population']

    # River Flood Forecasted
    counts =  getRiskNumber(targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', 'area_buildings', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')
    temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])
    response['riverflood_forecast_verylow_pop']=round(temp.get(1, 0),0)
    response['riverflood_forecast_low_pop']=round(temp.get(2, 0),0)
    response['riverflood_forecast_med_pop']=round(temp.get(3, 0),0)
    response['riverflood_forecast_high_pop']=round(temp.get(4, 0),0)
    response['riverflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0)
    response['riverflood_forecast_extreme_pop']=round(temp.get(6, 0),0)
    response['total_riverflood_forecast_pop']=response['riverflood_forecast_verylow_pop'] + response['riverflood_forecast_low_pop'] + response['riverflood_forecast_med_pop'] + response['riverflood_forecast_high_pop'] + response['riverflood_forecast_veryhigh_pop'] + response['riverflood_forecast_extreme_pop']

    temp = dict([(c['basinmember__basins__riskstate'], c['areaatrisk']) for c in counts])
    response['riverflood_forecast_verylow_area']=round(temp.get(1, 0)/1000000,0)
    response['riverflood_forecast_low_area']=round(temp.get(2, 0)/1000000,0)
    response['riverflood_forecast_med_area']=round(temp.get(3, 0)/1000000,0)
    response['riverflood_forecast_high_area']=round(temp.get(4, 0)/1000000,0)
    response['riverflood_forecast_veryhigh_area']=round(temp.get(5, 0)/1000000,0)
    response['riverflood_forecast_extreme_area']=round(temp.get(6, 0)/1000000,0)
    response['total_riverflood_forecast_area']=response['riverflood_forecast_verylow_area'] + response['riverflood_forecast_low_area'] + response['riverflood_forecast_med_area'] + response['riverflood_forecast_high_area'] + response['riverflood_forecast_veryhigh_area'] + response['riverflood_forecast_extreme_area']


    # flood risk and riverflood forecast matrix
    px = targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY))

    if flag=='entireAfg':
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')
    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            if len(str(code))==1:
                ff0001 =  "left(cast(dist_code as text),1)  = '"+str(code)+"'"
            else:
                ff0001 =  "left(cast(dist_code as text),2)  = '"+str(code)+"'"
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
            },where={
                ff0001
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')
    elif flag=='drawArea':
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(  \
                        case \
                            when ST_CoveredBy(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry ,'+filterLock+') then fldarea_population \
                            else st_area(st_intersection(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry,'+filterLock+')) / st_area(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry)* fldarea_population end \
                    )'
            },
            where = {
                'ST_Intersects(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry, '+filterLock+')'
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')
    else:
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
            },
            where = {
                'ST_Within(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry, '+filterLock+')'
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 1 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['riverflood_forecast_verylow_risk_low_pop']=round(temp.get('029 cm', 0) or 0,0)
    response['riverflood_forecast_verylow_risk_med_pop']=round(temp.get('121 cm', 0) or 0, 0)
    response['riverflood_forecast_verylow_risk_high_pop']=round(temp.get('271 cm', 0) or 0,0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 2 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['riverflood_forecast_low_risk_low_pop']=round(temp.get('029 cm', 0) or 0,0)
    response['riverflood_forecast_low_risk_med_pop']=round(temp.get('121 cm', 0) or 0, 0)
    response['riverflood_forecast_low_risk_high_pop']=round(temp.get('271 cm', 0) or 0,0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 3 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['riverflood_forecast_med_risk_low_pop']=round(temp.get('029 cm', 0) or 0,0)
    response['riverflood_forecast_med_risk_med_pop']=round(temp.get('121 cm', 0) or 0, 0)
    response['riverflood_forecast_med_risk_high_pop']=round(temp.get('271 cm', 0) or 0,0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 4 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['riverflood_forecast_high_risk_low_pop']=round(temp.get('029 cm', 0) or 0,0)
    response['riverflood_forecast_high_risk_med_pop']=round(temp.get('121 cm', 0) or 0, 0)
    response['riverflood_forecast_high_risk_high_pop']=round(temp.get('271 cm', 0) or 0,0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 5 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['riverflood_forecast_veryhigh_risk_low_pop']=round(temp.get('029 cm', 0) or 0,0)
    response['riverflood_forecast_veryhigh_risk_med_pop']=round(temp.get('121 cm', 0) or 0, 0)
    response['riverflood_forecast_veryhigh_risk_high_pop']=round(temp.get('271 cm', 0) or 0,0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 6 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['riverflood_forecast_extreme_risk_low_pop']=round(temp.get('029 cm', 0) or 0,0)
    response['riverflood_forecast_extreme_risk_med_pop']=round(temp.get('121 cm', 0) or 0, 0)
    response['riverflood_forecast_extreme_risk_high_pop']=round(temp.get('271 cm', 0) or 0,0)


    # Flash Flood Forecasted
    # AfgFldzonea100KRiskLandcoverPop.objects.all().select_related("basinmembers").values_list("agg_simplified_description","basinmember__basins__riskstate")
    counts =  getRiskNumber(targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', 'area_buildings', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')
    temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])

    response['flashflood_forecast_verylow_pop']=round(temp.get(1, 0),0)
    response['flashflood_forecast_low_pop']=round(temp.get(2, 0),0)
    response['flashflood_forecast_med_pop']=round(temp.get(3, 0),0)
    response['flashflood_forecast_high_pop']=round(temp.get(4, 0),0)
    response['flashflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0)
    response['flashflood_forecast_extreme_pop']=round(temp.get(6, 0),0)
    response['total_flashflood_forecast_pop']=response['flashflood_forecast_verylow_pop'] + response['flashflood_forecast_low_pop'] + response['flashflood_forecast_med_pop'] + response['flashflood_forecast_high_pop'] + response['flashflood_forecast_veryhigh_pop'] + response['flashflood_forecast_extreme_pop']

    temp = dict([(c['basinmember__basins__riskstate'], c['areaatrisk']) for c in counts])
    response['flashflood_forecast_verylow_area']=round(temp.get(1, 0)/1000000,0)
    response['flashflood_forecast_low_area']=round(temp.get(2, 0)/1000000,0)
    response['flashflood_forecast_med_area']=round(temp.get(3, 0)/1000000,0)
    response['flashflood_forecast_high_area']=round(temp.get(4, 0)/1000000,0)
    response['flashflood_forecast_veryhigh_area']=round(temp.get(5, 0)/1000000,0)
    response['flashflood_forecast_extreme_area']=round(temp.get(6, 0)/1000000,0)
    response['total_flashflood_forecast_area']=response['flashflood_forecast_verylow_area'] + response['flashflood_forecast_low_area'] + response['flashflood_forecast_med_area'] + response['flashflood_forecast_high_area'] + response['flashflood_forecast_veryhigh_area'] + response['flashflood_forecast_extreme_area']

    response['total_flood_forecast_pop'] = response['total_riverflood_forecast_pop'] + response['total_flashflood_forecast_pop']
    response['total_flood_forecast_area'] = response['total_riverflood_forecast_area'] + response['total_flashflood_forecast_area']

    # flood risk and flashflood forecast matrix
    px = targetRisk.exclude(mitigated_pop__gt=0).select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY))
    # px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
    #     select={
    #         'pop' : 'SUM(fldarea_population)'
    #     }).values('basinmember__basins__riskstate','deeperthan', 'pop')
    if flag=='entireAfg':
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')
    elif flag=='currentProvince':
        if len(str(code)) > 2:
            ff0001 =  "dist_code  = '"+str(code)+"'"
        else :
            if len(str(code))==1:
                ff0001 =  "left(cast(dist_code as text),1)  = '"+str(code)+"'"
            else:
                ff0001 =  "left(cast(dist_code as text),2)  = '"+str(code)+"'"
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
            },where={
                ff0001
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')
    elif flag=='drawArea':
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(  \
                        case \
                            when ST_CoveredBy(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry ,'+filterLock+') then fldarea_population \
                            else st_area(st_intersection(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry,'+filterLock+')) / st_area(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry)* fldarea_population end \
                    )'
            },
            where = {
                'ST_Intersects(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry, '+filterLock+')'
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')
    else:
        px = px.values('basinmember__basins__riskstate','deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                'pop' : 'SUM(fldarea_population)'
            },
            where = {
                'ST_Within(afg_fldzonea_100k_risk_landcover_pop.wkb_geometry, '+filterLock+')'
            }).values('basinmember__basins__riskstate','deeperthan', 'pop')

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 1 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['flashflood_forecast_verylow_risk_low_pop']=round(temp.get('029 cm', 0),0)
    response['flashflood_forecast_verylow_risk_med_pop']=round(temp.get('121 cm', 0), 0)
    response['flashflood_forecast_verylow_risk_high_pop']=round(temp.get('271 cm', 0),0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 2 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['flashflood_forecast_low_risk_low_pop']=round(temp.get('029 cm', 0),0)
    response['flashflood_forecast_low_risk_med_pop']=round(temp.get('121 cm', 0), 0)
    response['flashflood_forecast_low_risk_high_pop']=round(temp.get('271 cm', 0),0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 3 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['flashflood_forecast_med_risk_low_pop']=round(temp.get('029 cm', 0),0)
    response['flashflood_forecast_med_risk_med_pop']=round(temp.get('121 cm', 0), 0)
    response['flashflood_forecast_med_risk_high_pop']=round(temp.get('271 cm', 0),0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 4 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['flashflood_forecast_high_risk_low_pop']=round(temp.get('029 cm', 0),0)
    response['flashflood_forecast_high_risk_med_pop']=round(temp.get('121 cm', 0), 0)
    response['flashflood_forecast_high_risk_high_pop']=round(temp.get('271 cm', 0),0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 5 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['flashflood_forecast_veryhigh_risk_low_pop']=round(temp.get('029 cm', 0),0)
    response['flashflood_forecast_veryhigh_risk_med_pop']=round(temp.get('121 cm', 0), 0)
    response['flashflood_forecast_veryhigh_risk_high_pop']=round(temp.get('271 cm', 0),0)

    temp = [ num for num in px if num['basinmember__basins__riskstate'] == 6 ]
    temp = dict([(c['deeperthan'], c['pop']) for c in temp])
    response['flashflood_forecast_extreme_risk_low_pop']=round(temp.get('029 cm', 0),0)
    response['flashflood_forecast_extreme_risk_med_pop']=round(temp.get('121 cm', 0), 0)
    response['flashflood_forecast_extreme_risk_high_pop']=round(temp.get('271 cm', 0),0)

    return response

def getProvinceSummary_glofas(filterLock, flag, code, YEAR, MONTH, DAY, merge):
    cursor = connections['geodb'].cursor()
    table = 'get_glofas_detail'
    if merge:
        table = 'get_merge_glofas_gfms_detail'

    if flag == 'entireAfg':
        sql = "select b.prov_code as code, b.prov_na_en as na_en, \
                a.flashflood_forecast_extreme_pop, \
                a.flashflood_forecast_veryhigh_pop, \
                a.flashflood_forecast_high_pop, \
                a.flashflood_forecast_med_pop, \
                a.flashflood_forecast_low_pop, \
                a.flashflood_forecast_verylow_pop, \
                a.riverflood_forecast_extreme_pop, \
                a.riverflood_forecast_veryhigh_pop, \
                a.riverflood_forecast_high_pop, \
                a.riverflood_forecast_med_pop, \
                a.riverflood_forecast_low_pop, \
                a.riverflood_forecast_verylow_pop, \
                c.extreme, \
                c.veryhigh, \
                c.high, \
                c.moderate, \
                c.low, \
                c.verylow \
                from afg_admbnda_adm1 b \
                inner join provincesummary a  on cast(a.province as integer)=b.prov_code \
                inner join (\
                select \
                prov_code,\
                sum(extreme) as extreme,\
                sum(veryhigh) as veryhigh,\
                sum(high) as high, \
                sum(moderate) as moderate, \
                sum(low) as low, \
                sum(verylow) as verylow \
                from %s('%s-%s-%s') \
                group by prov_code \
                ) c on b.prov_code = c.prov_code \
                order by a.\"Population\" desc" %(table,YEAR,MONTH,DAY)
    elif flag == 'currentProvince':
        sql = "select b.dist_code as code, b.dist_na_en as na_en, \
                a.flashflood_forecast_extreme_pop, \
                a.flashflood_forecast_veryhigh_pop, \
                a.flashflood_forecast_high_pop, \
                a.flashflood_forecast_med_pop, \
                a.flashflood_forecast_low_pop, \
                a.flashflood_forecast_verylow_pop, \
                a.riverflood_forecast_extreme_pop, \
                a.riverflood_forecast_veryhigh_pop, \
                a.riverflood_forecast_high_pop, \
                a.riverflood_forecast_med_pop, \
                a.riverflood_forecast_low_pop, \
                a.riverflood_forecast_verylow_pop, \
                c.extreme, \
                c.veryhigh, \
                c.high, \
                c.moderate, \
                c.low, \
                c.verylow \
                from afg_admbnda_adm2 b \
                inner join districtsummary a  on cast(a.district as integer)=b.dist_code \
                inner join (\
                select \
                dist_code,\
                sum(extreme) as extreme,\
                sum(veryhigh) as veryhigh,\
                sum(high) as high, \
                sum(moderate) as moderate, \
                sum(low) as low, \
                sum(verylow) as verylow \
                from %s('%s-%s-%s') \
                group by dist_code \
                ) c on b.dist_code = c.dist_code \
                where b.prov_code=%s \
                order by a.\"Population\" desc" %(table,YEAR,MONTH,DAY,code)

    else:
        return []

    row = query_to_dicts(cursor, sql)

    response = []

    for i in row:
        response.append(i)

    cursor.close()

    return response
