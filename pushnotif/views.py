from django.conf import settings
import os, sys
from_cli = not hasattr(settings, 'PROJECT_ROOT')
if from_cli:
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "geonode.settings")
    # folderbase = './'
# else:
    # folderbase = './pushnotif/'

folderbase = os.path.dirname(os.path.realpath(__file__))+'/'
# log.debug(' '.join(map(str, ['folderbase:', folderbase])))

from django import forms
from django.contrib.auth import authenticate, login, get_user_model
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.utils import simplejson as json
from django.db.models import Q
from django.template.response import TemplateResponse

from geonode.groups.models import GroupProfile
from django.shortcuts import render

from matrix.models import matrix
from geonode.base.models import ResourceBase
from django.contrib.auth import get_user_model
from django.core import serializers
import time

from django.contrib.auth.decorators import user_passes_test
from geodb.geo_calc import getBaseline, getFloodForecast, getFloodRisk, getAvalancheRisk, getAvalancheForecast, getAccessibility, getEarthquake, getSecurity
from django.core.mail import send_mail

from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
import urllib, urllib2
import base64
from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2, EventdataHistory
from django.contrib.gis.db.models import Extent
import requests
from string import Template
from time import gmtime, strftime
from django.contrib.gis.gdal import SpatialReference, CoordTransform
from django.contrib.gis.geos import Point
from pprint import pprint
import time
import datetime
from pushnotif import privatedata
from django.utils.translation import activate, deactivate, get_language
import copy
import io
import locale
import urlparse
from dateutil.parser import parse
import re
from django.db import connection, connections
from django.http import HttpRequest
import csv
from contextlib import closing
import logging
import logging.config
from logging.handlers import RotatingFileHandler
from django.contrib.auth import get_user_model
from django.core import mail
from django.core.mail import EmailMessage
from email.mime.image import MIMEImage
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import mailinglogger
import socket
from django.utils.html import strip_tags
from django.utils.translation import ugettext, gettext as _, ugettext_noop
import string
import pushnotif.pushnotif_config as cfg

# custom string formatter, mainly to capitalize word
class MyFormatter(string.Formatter):
    def format_field(self, value, format_spec):
        value = value.encode('utf-8') if type(value) is unicode else value
        if format_spec.startswith('title'):
            return value.title()
        else:
            return super(MyFormatter, self).format_field(value, format_spec)

class CustomEncoder(json.JSONEncoder):
    def default(self, obj):
        if obj.__class__.__name__  == "GeoValuesQuerySet":
            return list(obj)
        elif obj.__class__.__name__  == "date":
            return obj.strftime("%Y-%m-%d")
        elif obj.__class__.__name__  == "datetime":
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        else:
            print 'not converted to json:', obj.__class__.__name__
            # return {} # convert un-json-able object to empty object
            return 'not converted to json:', obj.__class__.__name__ # convert un-json-able object to empty object


# global var
email_from = 'admin.geonode@immap.org'
emails_admin = privatedata.emails_admin
langs = ['en', 'prs']
langs_names = ['english', 'dari']
default_lang = langs[0]
langs_dict = [{'code':langs[idx], 'name':langs_names[idx]} for idx, lang in enumerate(langs)]
imgratio = {'x': 4.0, 'y': 3.0}
latscaleratio = 1.5e-6
scales = [1000, 1500, 2500, 5000, 7500, 10000, 15000, 25000, 30000, 40000, 50000, 75000, 100000, 150000, 200000, 250000, 350000, 500000, 750000, 1000000, 1250000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000, 11000000, 12000000, 13000000, 14000000, 15000000, 16000000]
script_start_time = strftime("%Y%m%d%H%M%S", gmtime())
foldertmp = folderbase+'tmp/'
uploadedlogo_baseurl = '/uploaded/logos/'
urltmp = settings.SITEURL+'/pushnotif/tmp/'
new_notif_min_days = 0 # minimum number of days new notif of the same type and area can be re-sent
eq_notif_max_days = 70 # max number of days ago earthquake event included for notification
emaillist_json_max_byte = 1*1024*1024 # in bytes, emaillist.json max file size before archived
eventtypedata = []
key_separator = '__'
sub_key_separator = '_'
subsid_prefix = 'subscription'
debuglist = ['timer', 'get_pdf', 'triggered', 'checkpoint', 'cacheid', 'emailapproval', 'date_limit']
session_localhost = {}
session_asdc = {}
emaillist = {}
provinces = {}
provinces_keys = ['prov_name', 'bbox', 'bbox4point']
emaillistsplit = []
area_ref = []
area_ref_named = []
area_ref_dict = {}
area_ref_keys = ['area_scope', 'area_code', 'area_name']
subscriptions = []
subscriptions_ids = []
subscriptions_ids_user = []
subscriptions_keys = ['username', 'fullname', 'organization', 'email', 'area_scope', 'area_code', 'area_name', 'lang_code', 'eventtypeid', 'orglogo']
usersettings = {}
usersettings_keys = ['username', 'property', 'value']
scope_flags = {'national': 'entireAfg', 'province': 'currentProvince'}
cache = {}
national_area_ref = {
    'area_name': 'Afghanistan',
    'bbox': '60.4720890240001,29.3771715570001,74.889451148,38.4907374680001',
    'bbox4point': '60.4720890240001,29.3771715570001 74.889451148,29.3771715570001 74.889451148,38.4907374680001 60.4720890240001,38.4907374680001 60.4720890240001,29.3771715570001'
    }
csv.register_dialect('sqlquote', quotechar="'", quoting=csv.QUOTE_NONNUMERIC)
title_tpl = ugettext_noop('{eventtype} in {area_name} {area_scope:title}')
title_add_tpl = '{detail_title}'
subject_tpl = ugettext_noop('ASDC Notification: {eventtype} in {area_name} {area_scope:title}')
area_name_scope_tpl = ugettext_noop('{area_name} {area_scope:title}')
email_head_text_tpl = ugettext_noop('{eventtype} Notification')
eventtypedata_transfer_keys = ['eventtypeid', 'eventtype', 'dashboardpage', 'maplayers', 'createjsondata', 'createjsonfile', 'url_getmap_tpl', 'mappdf', 'short_dashboard_table_tpl', 'text_body_event_tpl', 'text_body_tpl', 'subject_tpl', 'view_interactive_map_url']
subscriptions_transfer_keys = ['area_code', 'area_scope']
img_folder = folderbase+'../geonode/static/v2/images/40px/'
cid_attachment_imgs = ['usaid.png', 'immap.png', 'andma.png', 'icon_facebook.png', 'icon_linkedin.png', 'icon_notif.png', 'icon_twitter.png', 'icon_youtube.png']

# set logging
logging.config.fileConfig(folderbase+'logging.conf')
# print 'after logging.config.fileConfig'
log = logging.getLogger('pushnotif')
# print 'after log = logging.getLogger'
log.debug('pushnotif start logging')
for h in log.handlers:
    if (isinstance(h, logging.handlers.RotatingFileHandler)):
        h.close()
        h.baseFilename = folderbase+os.path.basename(h.baseFilename)
    elif (isinstance(h, mailinglogger.SummarisingLogger)):
        secureports = [465, 587]

        # fill in sensitive data from git-ignored module
        h.mailer.mailhost = settings.EMAIL_HOST
        h.mailer.mailport = settings.EMAIL_PORT
        h.mailer.secure = h.mailer.mailport in secureports
        h.mailer.username = settings.EMAIL_HOST_USER
        h.mailer.password = settings.EMAIL_HOST_PASSWORD
        h.mailer.toaddrs = privatedata.emails_dev

        # set here to avoid 'InterpolationMissingOptionError: Bad value substitution:' 
        # when using template variable on config file
        # h.mailer.subject = 'Summary of Error Log Messages - ASDC Push Notification (%(levelname)r)'

        h.mailer.template = 'ASDC user: %s\nmachine user: %s\nhost: %s\ntimestamp: %s\n\n' % (
            privatedata.login_data.get('username'), 
            os.environ.get('USER'), 
            socket.gethostname(),
            strftime("%Y-%m-%d %H:%M:%S", gmtime())
        )
        h.mailer.template += '%s' # for email main body


# log error traceback messages
def exception_hook(exc_type, exc_value, exc_traceback):
    log.error(
        "Uncaught exception",
        exc_info=(exc_type, exc_value, exc_traceback)
    )

sys.excepthook = exception_hook

def listtostr(lst):
    return ' '.join(map(str, lst))

# def init_log():
#     log_formatter = logging.Formatter('%(asctime)s %(levelname)s %(funcName)s(%(lineno)d) %(message)s')
#
#     logFile = 'log.txt'
#
#     my_handler = RotatingFileHandler(logFile, mode='a', maxBytes=10*1024*1024, backupCount=2, encoding=None, delay=0)
#     my_handler.setFormatter(log_formatter)
#     my_handler.setLevel(logging.DEBUG)
#
#     app_log = logging.getlog('root')
#     app_log.setLevel(logging.DEBUG)
#
#     app_log.addHandler(my_handler)
#
#     return app_log

# log = init_log()

# # simulate query result
# notifGroups = [
#     # columns: notif_key, notif_group, rank_value, rank_name
#     ['flashflood_forecast_low_pop', 'Flash Flood', 0, 'Low']
# ]

# # simulate query result
# notifEntries = [
#     # columns: area_scope, area_code, notif_key, user
#     # area_scope = [nation|province|district]
#     # assume filtered by one user
#     ['province', 18, 'floodforecast', 'dodiws'],
#     ['province', 32, 'floodforecast', 'dodiws'],
#     ['province', 27, 'floodforecast', 'dodiws']
# ]

# # simulate query result
# area_ref = [
#     # columns: area_scope, area_code
#     # area_scope = [nation|province|district]
#     # assume filtered by one user
#     # ['province', 18],
#     # ['province', 32],
#     # ['province', 27]
# ]

def init_usersettings(request=None):
    global usersettings
    with open(folderbase+'usersettings.csv', 'r') as f:
        for line in f:
            username, prop, value = [i.strip("'") for i in line.strip().split(',')]
            usersettings[username] = {prop: value}
    
def init_subscriptions(request=None):
    import psycopg2
    global subscriptions, subscriptions_id, subscriptions_ids_user
    subscriptions = []
    subscriptions_ids = []
    subscriptions_ids_user = []

    # with connections['geonode_data'].cursor() as cursor:
    db = settings.DATABASES['default']
    with psycopg2.connect(host=db['HOST'], user=db['USER'], password=db['PASSWORD'], dbname='geonode_data') as conn:
        cursor = conn.cursor()
        sql = "CREATE TEMPORARY TABLE subscriptions(\
        user_name character varying(255),\
        event_type character varying(255),\
        area_scope character varying(255),\
        area_code integer,\
        language character varying(255));"
        # log.debug(' '.join(map(str, ['sql\n', sql])))
        cursor.execute(sql)
        with open(folderbase+'subscriptions.csv', 'r') as f:
            # for value in csv.reader(f, dialect='sqlquote'):
            # for line in f:
            lines = []
            for line in f:
                username = line.strip().split(',')[0].strip("'")
                language = usersettings.get(username, {}).get('language', default_lang)
                lines.append("({line},'{language}')".format(**{'line':line.strip(), 'language':language}))
            values = ','.join(lines)
            if values:
                # log.debug(' '.join(map(str, ['values\n', values])))
                sql = "INSERT INTO subscriptions(user_name, event_type, area_scope, area_code, language) VALUES {values};".format(**{'values':values})
                # log.debug(' '.join(map(str, ['sql\n', sql])))
                sql += "SELECT s.user_name, p.first_name || ' ' || p.last_name, p.organization, p.email, s.area_scope, s.area_code, 'placeholder__area_name', s.language, s.event_type, a.logo \
                FROM subscriptions s JOIN people_profile p ON s.user_name = p.username\
                LEFT JOIN avatar_orglogo a ON p.organization = a.orgname;"
                cursor.execute(sql)
                for row in cursor.fetchall():
                    if 'subscriptions' in debuglist: log.debug(' '.join(map(str, [row])))
                    subs_id = subsid_prefix+key_separator+row[0]+key_separator+row[8]+key_separator+row[4]+sub_key_separator+str(row[5])
                    subscriptions_ids.append(subs_id)
                    if request and hasattr(request, 'user') and request.user.username == row[0]:
                        subscriptions_ids_user.append(subs_id)

                    # get area_name from area_ref
                    row_mutable = list(row)
                    row_mutable[6] = (item for item in area_ref if ((item[0] == row[4]) and (item[1] == row[5]))).next()[2]

                    subscriptions.append(row_mutable)
                if 'subscriptions' in debuglist: log.debug('subscriptions\n'+str(subscriptions))
                if 'subscriptions' in debuglist: log.debug('subscriptions_ids\n'+str(subscriptions_ids))
                if 'subscriptions' in debuglist: log.debug('subscriptions_ids_user\n'+str(subscriptions_ids_user))

def init_globaldata(request=None):
    global eventtypedata, subscriptions

    # simulate query result
    subscriptions = [
    # columns: username, fullname, organization, email, area_scope, area_code, lang_code
    # ['dodiws', 'Dodi Setiawan', 'iMMAP', 'dodiws@gmail.com', 'province', 33, 'Kandahar', 'en', 'earthquake_shakemap'],
    # ['dodiws', 'Dodi Setiawan', 'iMMAP', 'dodiws@gmail.com', 'province', 33, 'Kandahar', 'prs', 'flash_flood_prediction'],
    # ['dodiws', 'Dodi Setiawan', 'iMMAP', 'dodiws@gmail.com', 'national', 0, 'Afghanistan', 'en', 'earthquake_epicenter'],
    # ['dsetiawan', 'D. Setiawan', 'iMMAP', 'dsetiawan@immap.org', 'province', 33, 'Kandahar', 'prs', 'earthquake_shakemap'],
    # ['dodiws', 'Dodi Setiawan', 'iMMAP', 'dodiws@gmail.com', 'province', 30],
    ]
    init_usersettings(request)
    init_subscriptions(request)

    # event type specific data
    eventtypedata = {
        # 'flash_flood_prediction':
        # {
        #     'eventtypeid': 'flash_flood_prediction',
        #     'eventtype': ugettext_noop('Flash Flood Prediction'),
        #     'dashboardpage': 'floodforecast',
        #     'maplayers': 'geonode:flash_flood_prediction,afg_admbnda_adm1',
        #     # 'createjsondata': r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"64.64791562475617,31.785625036334896%2067.30992857442693,31.785625036334896%2067.30992857442693,33.82314149783689%2064.64791562475617,33.82314149783689%2064.64791562475617,31.785625036334896","showRiskTable":false,"mapID":"700"}',
        #     'createjsonfile': 'create_flashflood.json',
        #     'url_getmap_tpl': 'http://asdc.immap.org/getOverviewMaps/getWMS?service=WMS&version=1.1.0&request=GetMap&layers={layers}&styles=,snapshot_admin1&VIEWPARAMS=year:{year};month:{month};day:{day};&bbox={bbox}&width={width}&height={height}&srs=EPSG:4326&format=image%2Fpng&_rdm=202',
        #     'view_interactive_map_url': settings.SITEURL+'/maps/700/view',
        #     'mappdf': {
        #         'title_tpl': title_tpl,
        #     },
        #     'subject_tpl': subject_tpl,
        #     'short_dashboard_table_tpl': 'table_flashfloodforecast.html',
        #     'text_body_tpl': 'email_text_body.html',
        #     'text_body_event_tpl': 'email_text_body_flood.html',
        #     'triggerkeys': [
        #         'flashflood_forecast_low_pop',
        #         'flashflood_forecast_med_pop',
        #         'flashflood_forecast_high_pop',
        #         'flashflood_forecast_veryhigh_pop',
        #         'flashflood_forecast_extreme_pop'
        #     ]},
        # 'river_flood_prediction':
        # {
        #     'eventtypeid': 'river_flood_prediction',
        #     'eventtype': ugettext_noop('River Flood Prediction'),
        #     'dashboardpage': 'floodforecast',
        #     'maplayers': 'geonode:glofas_gfms_merge,afg_admbnda_adm1',
        #     # 'createjsondata': r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"64.64791562475617,31.785625036334896%2067.30992857442693,31.785625036334896%2067.30992857442693,33.82314149783689%2064.64791562475617,33.82314149783689%2064.64791562475617,31.785625036334896","showRiskTable":false,"mapID":"700"}',
        #     'createjsonfile': 'create_riverflood.json',
        #     'url_getmap_tpl': 'http://asdc.immap.org/getOverviewMaps/getWMS?service=WMS&version=1.1.0&request=GetMap&layers={layers}&styles=,snapshot_admin1&VIEWPARAMS=year:{year};month:{month};day:{day};&bbox={bbox}&width={width}&height={height}&srs=EPSG:4326&format=image%2Fpng&_rdm=202',
        #     'view_interactive_map_url': settings.SITEURL+'/maps/700/view',
        #     'mappdf': {
        #         'title_tpl': title_tpl,
        #     },
        #     'subject_tpl': subject_tpl,
        #     'short_dashboard_table_tpl': 'table_riverfloodforecast.html',
        #     'text_body_tpl': 'email_text_body.html',
        #     'text_body_event_tpl': 'email_text_body_flood.html',
        #     'triggerkeys': [
        #         'riverflood_forecast_low_pop',
        #         'riverflood_forecast_med_pop',
        #         'riverflood_forecast_high_pop',
        #         'riverflood_forecast_veryhigh_pop',
        #         'riverflood_forecast_extreme_pop'
        #     ]},
        'avalanche_prediction':
        {
            'eventtypeid': 'avalanche_prediction',
            'eventtype': ugettext_noop('Avalanche Prediction'),
            'dashboardpage': 'avalcheforecast',
            'maplayers': 'geonode:current_avalanche_forecast_villages,afg_admbnda_adm1',
            # 'createjsondata': r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_Avalanche prediction / current risk_A4 portrait_map_2017-9-29\"","mapTitle":"Avalanche prediction / current risk","comment":"Shows the number of people potentially affected by avalanches based on the current snow cover and snow water equivalent (at small basin scale)","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_avalanche_forecast_villages"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_avsa"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7713827.67075,4328013.9672],"scale":25000,"bbox":[7711358.2213667,4325765.0043687,7716297.1201333,4330262.9300313],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Avalanche areas (potential)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_avsa&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Avalanche risk forecast settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_avalanche_forecast_villages&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]}],"selectedBox":"69.27230952538713,36.1825200849458%2069.31667640788086,36.1825200849458%2069.31667640788086,36.215126252405994%2069.27230952538713,36.215126252405994%2069.27230952538713,36.1825200849458","showRiskTable":false,"mapID":"707"}',
            'createjsonfile': 'create_avalanche.json',
            'url_getmap_tpl': 'http://asdc.immap.org/getOverviewMaps/getWMS?service=WMS&version=1.1.0&request=GetMap&layers={layers}&styles=,snapshot_admin1&VIEWPARAMS=year:{year};month:{month};day:{day};&bbox={bbox}&width={width}&height={height}&srs=EPSG:4326&format=image%2Fpng&_rdm=202',
            'view_interactive_map_url': settings.SITEURL+'/maps/707/view',
            'mappdf': {
                'title_tpl': title_tpl,
            },
            'subject_tpl': subject_tpl,
            'short_dashboard_table_tpl': 'table_avalancheforecast.html',
            'text_body_tpl': 'email_text_body.html',
            'text_body_event_tpl': 'email_text_body_avalanche.html',
            'triggerkeys': [
                # 'total_ava_forecast_pop',
                'ava_forecast_low_pop',
                'ava_forecast_med_pop',
                'ava_forecast_high_pop'
                # 'ava_forecast_low_buildings',
                # 'ava_forecast_med_buildings',
                # 'ava_forecast_high_buildings',
            ]},
        'earthquake_shakemap':
        {
            'eventtypeid': 'earthquake_shakemap',
            'eventtype': ugettext_noop('Earthquake Shakemap'),
            'dashboardpage': 'earthquake',
            'maplayers': 'geonode:earthquake_events,geonode:earthquake_shakemap,afg_admbnda_adm1',
            # 'createjsondata': '{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\\"iMMAP_AFG_Earthquake_A4 portrait_map_2017-9-29\\"","mapTitle":"Earthquake","comment":"Shows the epicentre of the latest earthquakes as well as the shakemap. Shakemaps and the affected population can be loaded by using the latest tab in the statistics menu.\\n\\nAdditionally it shows the tectonic regions of Afghanistan derived from the USGS \\"Seismotectonic Map of Afghanistan, with Annotated Bibliography\\" (2005) by By Russell L. Wheeler, Charles G. Bufe, Margo L. Johnson, and Richard L. Dart. \\n\\nSeismic intensity and description of potential damage (USGS, 2007). Peak Horizontal Acceleration with 2 Percent Probability of Exceedance in 50 years\\n\\nA 2 percent probability of exceedance in 50 years corresponds to a ground-motion return time of approximately 2500 years, or approximately a 10% probability of of exceedance in 250 years. . The seismic intensity data and classes originate from the USGS Earthquake Hazard Map for Afghanistan (2007), by By Oliver S. Boyd, Charles S. Mueller, and Kenneth S. Rukstales","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":25253.763106179995,"maxScaleDenominator":631344077654500,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_rdsl"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_shakemap"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code=\'$event_code\'","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code in (\'$event_code\')","TILED":true}}],"pages":[{"center":[8147575.7178394,4429009.4558803],"scale":1500000,"bbox":[8147081.8279627,4428559.663314,8148069.6077161,4429459.2484466],"rotation":0}],"legends":[{"name":"Earthquakes with Shakemap ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquake shakemap","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_shakemap&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Road network","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?EXCEPTIONS=application%2Fvnd.ogc.se_xml&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&TILED=true&LAYER=geonode%3Aafg_rdsl&STYLE=afg_rdsl_legend_osm&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000&width=12&height=12"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"73.18648128050067,36.92429450170914%2073.19535465700014,36.92429450170914%2073.19535465700014,36.930754510341295%2073.18648128050067,36.930754510341295%2073.18648128050067,36.92429450170914","showRiskTable":false,"mapID":"706"}',
            'createjsonfile': 'create_earthquake.json',
            'url_getmap_tpl': 'http://asdc.immap.org/getOverviewMaps/getWMS?service=WMS&version=1.1.0&request=GetMap&layers={layers}&styles=&CQL_FILTER=event_code%3D%27{eqcode}%27;event_code%3D%27{eqcode}%27;INCLUDE&bbox={bbox}&width={width}&height={height}&srs=EPSG:4326&format=image%2Fpng',
            'view_interactive_map_url': settings.SITEURL+'/maps/706/view',
            'mappdf': {
                'title_tpl': title_tpl,
                'title_add_tpl': title_add_tpl,
            },
            'subject_tpl': subject_tpl,
            'short_dashboard_table_tpl': 'table_earthquake.html',
            'text_body_tpl': 'email_text_body.html',
            'text_body_event_tpl': 'email_text_body_earthquake_shakemap.html',
            'triggerkeys': [
                'pop_shake_extreme',
                'pop_shake_light',
                'pop_shake_moderate',
                'pop_shake_severe',
                'pop_shake_strong',
                'pop_shake_verystrong',
                'pop_shake_violent',
                'pop_shake_weak',
                'sett_shake_extreme',
                'sett_shake_light',
                'sett_shake_moderate',
                'sett_shake_severe',
                'sett_shake_strong',
                'sett_shake_verystrong',
                'sett_shake_violent',
                'sett_shake_weak',
            ]},
        'earthquake_epicenter':
        {
            'eventtypeid': 'earthquake_epicenter',
            'eventtype': ugettext_noop('Earthquake Epicenter'),
            'dashboardpage': 'earthquake',
            'maplayers': 'geonode:earthquake_events,geonode:earthquake_shakemap,afg_admbnda_adm1',
            # 'createjsondata': '{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\\"iMMAP_AFG_Earthquake_A4 portrait_map_2017-9-29\\"","mapTitle":"Earthquake","comment":"Shows the epicentre of the latest earthquakes as well as the shakemap. Shakemaps and the affected population can be loaded by using the latest tab in the statistics menu.\\n\\nAdditionally it shows the tectonic regions of Afghanistan derived from the USGS \\"Seismotectonic Map of Afghanistan, with Annotated Bibliography\\" (2005) by By Russell L. Wheeler, Charles G. Bufe, Margo L. Johnson, and Richard L. Dart. \\n\\nSeismic intensity and description of potential damage (USGS, 2007). Peak Horizontal Acceleration with 2 Percent Probability of Exceedance in 50 years\\n\\nA 2 percent probability of exceedance in 50 years corresponds to a ground-motion return time of approximately 2500 years, or approximately a 10% probability of of exceedance in 250 years. . The seismic intensity data and classes originate from the USGS Earthquake Hazard Map for Afghanistan (2007), by By Oliver S. Boyd, Charles S. Mueller, and Kenneth S. Rukstales","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":25253.763106179995,"maxScaleDenominator":631344077654500,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_rdsl"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_shakemap"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code=\'$event_code\'","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code in (\'$event_code\')","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events_past_week"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[8147575.7178394,4429009.4558803],"scale":1500000,"bbox":[8147081.8279627,4428559.663314,8148069.6077161,4429459.2484466],"rotation":0}],"legends":[{"name":"Earthquakes in the past week","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events_past_week&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquakes with Shakemap ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquake shakemap","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_shakemap&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Road network","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?EXCEPTIONS=application%2Fvnd.ogc.se_xml&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&TILED=true&LAYER=geonode%3Aafg_rdsl&STYLE=afg_rdsl_legend_osm&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000&width=12&height=12"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"73.18648128050067,36.92429450170914%2073.19535465700014,36.92429450170914%2073.19535465700014,36.930754510341295%2073.18648128050067,36.930754510341295%2073.18648128050067,36.92429450170914","showRiskTable":false,"mapID":"706"}',
            'createjsonfile': 'create_earthquake.json',
            'url_getmap_tpl': 'http://asdc.immap.org/getOverviewMaps/getWMS?service=WMS&version=1.1.0&request=GetMap&layers={layers}&styles=&CQL_FILTER=event_code%3D%27{eqcode}%27;event_code%3D%27{eqcode}%27;INCLUDE&bbox={bbox}&width={width}&height={height}&srs=EPSG:4326&format=image%2Fpng',
            'view_interactive_map_url': settings.SITEURL+'/maps/706/view',
            'mappdf': {
                'title_tpl': title_tpl,
                'title_add_tpl': title_add_tpl,
            },
            'subject_tpl': subject_tpl,
            'text_body_tpl': 'email_text_body.html',
            'text_body_event_tpl': 'email_text_body_earthquake_epicenter.html',
            'triggerkeys': [
                'pop_shake_extreme',
                'pop_shake_light',
                'pop_shake_moderate',
                'pop_shake_severe',
                'pop_shake_strong',
                'pop_shake_verystrong',
                'pop_shake_violent',
                'pop_shake_weak',
                'sett_shake_extreme',
                'sett_shake_light',
                'sett_shake_moderate',
                'sett_shake_severe',
                'sett_shake_strong',
                'sett_shake_verystrong',
                'sett_shake_violent',
                'sett_shake_weak',
            ]}
    }

def split_emailid(emailid):
    key_parts = emailid.split(key_separator)
    strtime, eventtypeid, area = key_parts[:3]
    earthquakeid = None
    if ((len(key_parts) > 3) and (key_parts[3].split(sub_key_separator)[0] == 'earthquakeid')):
        earthquakeid = key_parts[3].split(sub_key_separator)[1]
    return strtime, eventtypeid, area, earthquakeid

def init_emaillistsplit():
    with open(folderbase+'emaillist.json', 'r') as f:
        c = f.read().strip() or '{}'
        emaillist = json.loads(c)
        for emailid in emaillist.keys():
            strtime, eventtypeid, area, earthquakeid = split_emailid(emailid)
            i = {
            'dtime': datetime.datetime.strptime(strtime, "%Y%m%d%H%M%S"),
            'eventtypeid': eventtypeid,
            'area': area,
            'earthquakeid': earthquakeid
            }
            # if i['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
            #     i['earthquakeid'] = emaillist[key].get('earthquakeid')
            emaillistsplit.append(i)

def in_emaillist(emailid):
    """
    return True if:
    - emailid not in emaillist or
    - new_notif_min_days had passed since the last similar email
    """

    strtime, eventtypeid, area, earthquakeid = split_emailid(emailid)
    email_dtime = datetime.datetime.strptime(strtime, "%Y%m%d%H%M%S")

    for i in emaillistsplit:
        # for 'earthquake_shakemap', 'earthquake_epicenter' event check whether earthquakeid already exist in emaillist, regardless new_notif_min_days
        if i['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
            if (eventtypeid == i['eventtypeid']) and (area == i['area']) and (i.get('earthquakeid') == earthquakeid):
                return True, 'earthquakeid already exist in emaillist'
        # for other event check whether eventtypeid and area is the same
        elif (eventtypeid == i['eventtypeid']) and (area == i['area']):
            # if difference between event date and previous similar notif less then new_notif_min_days, considered as same event in emaillist
            if ((i['dtime'] + datetime.timedelta(days=new_notif_min_days)) > email_dtime):
                return True, 'previous similar notif less then %s (new_notif_min_days) days ago' % (new_notif_min_days)
    return False, None

def sendlimitcheck(emailid):
    """
    return True if emailid not in emaillist or new_notif_min_days had passed since the last similar email
    """

    strtime, eventtypeid, area, earthquakeid = split_emailid(emailid)
    email_dtime = datetime.datetime.strptime(strtime, "%Y%m%d%H%M%S")

    for i in emaillistsplit:
        # for 'earthquake_shakemap', 'earthquake_epicenter' event check whether earthquakeid already exist in emaillist, regardless new_notif_min_days
        if i['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
            if (eventtypeid == i['eventtypeid']) and (area == i['area']) and (i.get('earthquakeid') == earthquakeid):
                return False
        # for other event, check whether new_notif_min_days had passed since the last similar email
        elif (eventtypeid == i['eventtypeid']) and (area == i['area']):
            if ((i['dtime'] + datetime.timedelta(days=new_notif_min_days)) > email_dtime):
                return False
    return True

def init_provinces():
    global provinces

    if 'timer' in debuglist: start_time = time.time()
    if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start AfgAdmbndaAdm1 at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
    # a = {}
    a = AfgAdmbndaAdm1.objects.values('prov_code', 'prov_na_en').annotate(bbox=Extent('wkb_geometry')).order_by('prov_code', 'prov_na_en')
    if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end AfgAdmbndaAdm1, %s seconds" % (time.time() - start_time))])))
    # provinces = {r['prov_code']: [r['prov_na_en'], ','.join(map(str, r['bbox'])) ] for r in a}
    for r in a:

        # adjust bbox xy ratio to imgratio
        new_bbox = list(r['bbox'])
        width = new_bbox[2] - new_bbox[0]
        height = new_bbox[3] - new_bbox[1]
        if (imgratio['x']/imgratio['y'])*height > width:
            newwidth = (imgratio['x']/imgratio['y'])*height
            deltax = newwidth - width
            new_bbox[0] = new_bbox[0] - (deltax/2)
            new_bbox[2] = new_bbox[2] + (deltax/2)
        else:
            newheight = (imgratio['y']/imgratio['x'])*width
            deltay = newheight - height
            new_bbox[1] = new_bbox[1] - (deltay/2)
            new_bbox[3] = new_bbox[3] + (deltay/2)

        new_bbox_4point = [
        str(new_bbox[0])+','+str(new_bbox[1]),
        str(new_bbox[2])+','+str(new_bbox[1]),
        str(new_bbox[2])+','+str(new_bbox[3]),
        str(new_bbox[0])+','+str(new_bbox[3]),
        str(new_bbox[0])+','+str(new_bbox[1]),
        ]

        provinces[r['prov_code']] = {'area_name': r['prov_na_en'], 'bbox': ','.join(map(str, new_bbox)), 'bbox4point':' '.join(map(str, new_bbox_4point))}
    # log.debug(' '.join(map(str, [provinces])))

def init_area_ref():
    global area_ref, area_ref_named, area_ref_dict
    area_ref = []

    # append the only area at national level
    area_ref.append(['national', 0, 'Afghanistan'])

    # with open(folderbase+'provinces.json', 'r') as f:
    #     provincelist = json.load(f)

    # limit to 1 to speed up test, remove for production
    # provincelist = provincelist[32:33]

    # append area at province level
    for p in provinces:
        # log.debug(' '.join(map(str, ['prov code', p])))
        area_ref.append(['province', p, provinces[p]['area_name']])

    area_ref_named = [dict(zip(area_ref_keys, ar)) for ar in area_ref]
    area_ref_dict = {ar[0]+sub_key_separator+str(ar[1]):ar[2] for ar in area_ref}

def get_login_session(url = settings.SITEURL+'/account/login/'):
    if 'timer' in debuglist: start_time = time.time()
    if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start get_login_session at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
    session = requests.session()
    session.get(url)
    login_data = {
        'csrfmiddlewaretoken': session.cookies.get('csrftoken'),
        # 'username': settings.DATABASES['default']['USER'],
        # 'password': settings.DATABASES['default']['PASSWORD'],
        'username': privatedata.login_data['username'],
        'password': privatedata.login_data['password'],
        }
    r = session.post(url, data=login_data)
    # if not session.cookies.get('sessionid'):
    #     log.warning(' '.join(map(str, ['Warning: no sessionid after login attempt, login probably failed.'])))
    if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end get_login_session, %s seconds" % (time.time() - start_time))])))
    return session

# test whether redirected to login page when accessing login-required resource
def is_login(session, url = settings.SITEURL+'/layers/'):
    response = session.get(url)
    return ('/account/login/' not in response.url)

def showtemplate(request):
    template = request.GET.get('template', None)

    plaintext = get_template('email.txt')
    email_main = get_template(template)
    subject, from_email, to = 'Simple Get Template', privatedata, 'dodiws@gmail.com'
    emaildata = {}
    d = Context(emaildata)
    text_content = plaintext.render(d)
    html_content = email_main.render(d)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")
    msg.send()
    return render(request, template)

# # @user_passes_test(lambda u: u.is_superuser, login_url='/')
# def triggercheck_old(request):
#     init_provinces()
#     forecast = getFloodForecast(request, filterLock=None, flag='entireAfg', code=None)
#
#     emaildata = {}
#     emaildata['forecast'] = []
#     for i in notifEntries:
#         log.debug(' '.join(map(str, ['notifEntries i', i])))
#         for eventype, keys in triggerkeys.items():
#             for key in keys:
#                 if (forecast.get(key, 0) >= 0):
#                     data = getmapimage(i)
#                     data['type'] = eventype
#                     data['prob_low'] = forecast.get(keys[0], 0)
#                     data['prob_med'] = forecast.get(keys[1], 0)
#                     data['prob_high'] = forecast.get(keys[2], 0)
#                     data['prob_veryhigh'] = forecast.get(keys[3], 0)
#                     data['prob_extreme'] = forecast.get(keys[4], 0)
#                     emaildata['forecast'].append(data)
#                     break
#         # if i[2] == 'floodforecast':
#         #     if ((forecast['flashflood_forecast_low_pop'] >= 0) or
#         #     (forecast['flashflood_forecast_med_pop'] >= 0) or
#         #     (forecast['flashflood_forecast_high_pop'] >= 0) or
#         #     (forecast['flashflood_forecast_veryhigh_pop'] >= 0) or
#         #     (forecast['flashflood_forecast_extreme_pop'] >= 0)
#         #     ):
#         #         data = getmapimage(i)
#         #         data['prob_value'] = forecast[i[2]]
#         #         emaildata['forecast'].append(data)
#         if ((forecast['flashflood_forecast_low_pop'] >= 0) or
#         (forecast['flashflood_forecast_med_pop'] >= 0) or
#         (forecast['flashflood_forecast_high_pop'] >= 0) or
#         (forecast['flashflood_forecast_veryhigh_pop'] >= 0) or
#         (forecast['flashflood_forecast_extreme_pop'] >= 0)
#         ):
#             pass
#
#     response=sendnotif(emaildata)
#
#     # return HttpResponse(json.dumps(forecast), content_type="application/json")
#     return HttpResponse(response, content_type="text/html")

def init_data(request):
    global session_localhost, session_asdc, emaillist

    init_emaillistsplit()
    init_provinces()
    init_area_ref()
    init_globaldata(request)

# @user_passes_test(lambda u: u.is_superuser, login_url='/')
def triggercheck(request):

    global session_localhost, session_asdc, emaillist

    # def get_latest_eq(forecast, bbox):
    #     for l in forecast['eq_list']:
    #         # if (l['event_code'] == "20005gsg"):
    #         if l['selected']:
    #             result = {}
    #             result['eq_selected'] = l
    #             result['eq_selected']['epicenter_area_name'] = result['eq_selected']['title'].split('-')[1].strip()
    #             result['eq_selected']['dateofevent_date'] = parse(result['eq_selected']['dateofevent']).strftime('%d-%b-%Y')
    #             result['eq_selected']['dateofevent_time'] = parse(result['eq_selected']['dateofevent']).strftime('%H:%M')
    #             if s['eventtypeid'] == 'earthquake_epicenter':
    #                 # move bbox center to earthquake epicenter
    #                 if 'bbox' in debuglist: log.debug(' '.join(map(str, ['bbox', bbox])))
    #                 x1, y1, x2, y2 = bbox.split(',')
    #                 width = float(x2) - float(x1)
    #                 height = float(y2) - float(y1)
    #                 m = re.search('POINT \((\d+\.\d+) (\d+\.\d+)\)', result['eq_selected']['wkb_geometry'])
    #                 centerx = float(m.group(1))
    #                 centery = float(m.group(2))
    #                 new_bbox = [centerx - width/2, centery - height/2, centerx + width/2, centery + height/2]
    #                 result['bbox'] = ','.join(map(str, new_bbox))
    #                 result['bbox4point'] = ' '.join(map(str, [
    #                 str(new_bbox[0])+','+str(new_bbox[1]),
    #                 str(new_bbox[2])+','+str(new_bbox[1]),
    #                 str(new_bbox[2])+','+str(new_bbox[3]),
    #                 str(new_bbox[0])+','+str(new_bbox[3]),
    #                 str(new_bbox[0])+','+str(new_bbox[1]),
    #                 ]))
    #                 if 'bbox' in debuglist: log.debug(' '.join(map(str, ['new bbox', bbox])))
    #                 if 'bbox' in debuglist: log.debug(' '.join(map(str, ['new bbox4point', result['bbox4point']])))
    #                 return result
    #                 break
    #     return

    def move_bbox(bbox, center_point):

        # get bbox width and height
        if 'bbox' in debuglist: log.debug(' '.join(map(str, ['bbox', bbox])))
        x1, y1, x2, y2 = bbox.split(',')
        width = float(x2) - float(x1)
        height = float(y2) - float(y1)

        # move bbox center to earthquake epicenter
        m = re.search('POINT \((\d+\.\d+) (\d+\.\d+)\)', center_point)
        centerx = float(m.group(1))
        centery = float(m.group(2))
        new_bbox = [centerx - width/2, centery - height/2, centerx + width/2, centery + height/2]
        new_bbox_str = ','.join(map(str, new_bbox))
        new_bbox4point_str = ' '.join(map(str, [
        str(new_bbox[0])+','+str(new_bbox[1]),
        str(new_bbox[2])+','+str(new_bbox[1]),
        str(new_bbox[2])+','+str(new_bbox[3]),
        str(new_bbox[0])+','+str(new_bbox[3]),
        str(new_bbox[0])+','+str(new_bbox[1]),
        ]))
        if 'bbox' in debuglist: log.debug(' '.join(map(str, ['new bbox', new_bbox_str])))
        if 'bbox' in debuglist: log.debug(' '.join(map(str, ['new bbox4point', new_bbox4point_str])))

        return new_bbox_str, new_bbox4point_str

    def get_earthquakes_list(date_limit, bbox):
        url = 'http://asdc.immap.org/geoapi/geteqevents/?dateofevent__gte=%s&_dc=1473243793279' % (date_limit)
        # url = 'http://asdc.immap.org/geoapi/geteqevents/?dateofevent=2016-04-10&_dc=1473243793279'
        if 'get_earthquakes_list' in debuglist: log.debug(' '.join(map(str, [url])))
        # req = urllib2.Request(url)
        # req.add_unredirected_header('User-Agent', 'Custom User-Agent')
        if 'timer' in debuglist: start_time = time.time()
        if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start geteqevents at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
        with closing(urllib2.urlopen(urllib2.Request(url))) as fh:
            if 'timer' in debuglist: log.debug(' '.join([("timer end geteqevents, %s seconds" % (time.time() - start_time))]))
            datastr = fh.read()
            if 'get_earthquakes_list' in debuglist: log.debug(' '.join(['datastr', datastr]))
            # fh.close()
            data = json.loads(datastr)['objects']
            if 'get_earthquakes_list' in debuglist: log.debug(' '.join(map(str, ['data', data])))

            for d in data:
                if 'get_earthquakes_list' in debuglist: pprint(d)
                d['epicenter_area_name'] = d['title'].split('-')[1].strip()
                d['dateofevent_date'] = parse(d['dateofevent']).strftime('%d-%b-%Y')
                d['dateofevent_time'] = parse(d['dateofevent']).strftime('%H:%M')
            return data

    def can_skip_loop(emailid, eventtypes):
        if s['eventtypeid'] in eventtypes:

            # if already checked add user to recipients and skip loop
            if (emailid in emaillistadd):
                emaillistadd[emailid]['emaildata'][s['lang_code']]['recipients'].append(s['email'])
                return True, 'emailid in emaillistadd'

            # if already checked and not triggered
            if (cache.get('triggercheck_result:'+emailid) == False):
                return True, 'cached triggered value is false'

            # if notification exist in emaillist then skip loop
            exist, reason = in_emaillist(emailid)
            if (exist):
                return exist, reason
        return False, None

    # code = request.GET.get('code', None)
    # if code:
    #     code = int(code)
    #     flag = 'currentProvince'
    # else:
    #     flag = 'entireAfg'
    # forecast = getFloodForecast(request, filterLock=None, flag=flag, code=code)
    init_data(request)
    if not subscriptions:
        log.warning('No subscribers found or not valid usernames.')
        return
    # global var, get cookies
    # at this point session_localhost is the same as session_asdc and will be deprecated
    session_localhost = get_login_session()
    session_asdc = get_login_session()
    if (not is_login(session_asdc)):
        log.warning('Not logged in. Failed when accessing login-required resource.')
    # log.error('Test ERROR for mailhandler logger.')
    # raise Exception('Trigger Error manually. Test ERROR for mailhandler logger.')

    # floodforecast_tpl = get_template('pages/floodforecast.html')
    # floodforecast_dashboard_tpl = get_template('email_dashboard_base.html')
    # floodforecast_table_tpl = get_template('floodforecast_table.html')
    # avalancheforecast_table_tpl = get_template('avalancheforecast_table.html')
    # earthquake_table_tpl = get_template('earthquake_table.html')
    # css_embed_tpl = get_template('bare.css')
    # renderdata = {}
    # renderdata['css_embed'] = css_embed_tpl.render(Context({}))
    # renderdata['body_content'] = floodforecast_tpl.render(Context(forecast))

    '''
    # Earthquake epicenter check
    queryset = earthquake_events.objects.order_by('-dateofevent')[0]
    eq_code = queryset.get('event_code')
    emailid = script_start_time+key_separator+emaildata['eventtypeid']+'-Afghanistan'

    if sendlimitcheck(None, earthquakeid=eq_code):
        for r in subscriptions:
            r = dict(zip(subscriptions_keys, r))
            if (r['eventtypeid'] == 'earthquake_epicenter'):
                if emailid not in emaillistadd:
                    # run only once for every new emailid

                    emaillistadd[emailid] = {}
                    emaillistadd[emailid]['emaildata']  = {}
                    if i['eventtypeid'] == 'earthquake_shakemap':
                        emaillistadd[emailid]['earthquakeid'] = eq_code

                    # for every language render email html and text, and pdf attachment, save as temp file
                    for lang in langs:
                        activate(lang)
                        emaildata['emailid'] = emailid
                        emaildata['lang'] = lang
                        emaildata['fullname'] = 'ASDC User'

                        tbldata = getmapimage(emaildata)
                        emaildata.update(tbldata)
                        tbldata.update(forecast[i['eventtypeid']])
                        tbldata['type'] = emaildata['eventtype']
                        emaildata['short_dashboard_table'] = get_template(i['short_dashboard_table_tpl']).render(Context(tbldata))
                        emaildata['email_body_text_event_specific'] = get_template(i['text_body_event_tpl']).render(Context(emaildata))
                        emaildata['text_body'] = get_template(i['text_body_tpl']).render(Context(emaildata))

                        emaildata.update(save_temp_files(emaildata))
                        emaillistadd[emailid]['emaildata'][lang] = copy.deepcopy(emaildata)

                emaillistadd[emailid]['emaildata'][r['lang_code']]['recipients'].append(r['email'])
    '''

    # additional entries for emaillist
    emaillistadd = {}

    for s in subscriptions:

        # build emailid
        s = dict(zip(subscriptions_keys, s))
        key_parts = [script_start_time, s['eventtypeid'], sub_key_separator.join([s['area_scope'], s['area_name']])]
        emailid = emailid_base = key_separator.join(key_parts).lower().strip().replace(" ", "_")
        log.debug(s)

        if s['area_scope'] == 'national':
            area_reference = national_area_ref
        elif s['area_scope'] == 'province':
            area_reference = provinces[s['area_code']]

        loop_desc = '%s in %s %s code:%s user %s'% (s['eventtypeid'], s['area_scope'], area_reference['area_name'], s['area_code'], s['username'])
        log.info('Start Triggercheck Loop for %s' % (loop_desc))

        skip, reason = can_skip_loop(emailid, ['river_flood_prediction', 'flash_flood_prediction', 'avalanche_prediction'])
        if (skip):
            log.info('skip checking trigger, reason: %s'% (reason))
            continue

        emaildata = {}
        # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        emaildata['email_from'] = email_from
        emaildata['email_admin'] = emails_admin
        emaildata['template_vars'] = {}
        emaildata['template_vars']['fullname'] = '{{ fullname }}'
        emaildata['url_settings_modify'] = settings.SITEURL+'/pushnotif/settings/'

        # s = dict(zip(subscriptions_keys, s))
        if 'triggercheck' in debuglist: log.debug(' '.join(map(str, [s])))
        if s['area_scope'] == 'national':
            area_reference = national_area_ref
        elif s['area_scope'] == 'province':
            area_reference = provinces[s['area_code']]

        # get forecast data for trigger-checking and template data
        forecast = {}
        filterLock = None
        area_code = None if s['area_scope'] == 'national' else s['area_code']
        # emailid = script_start_time+key_separator+s['eventtypeid']+key_separator+(s['area_scope']+sub_key_separator+s['area_name']).lower().strip().replace(" ", "_")
        # key_parts = [script_start_time, s['eventtypeid'], sub_key_separator.join([s['area_scope'], s['area_name']])]
        # emailid = emailid_base = key_separator.join(key_parts).lower().strip().replace(" ", "_")
        cacheid = 'queryset:'+emailid
        if 'subscriber' in debuglist: log.debug(' '.join(map(str, ['subscriber:', s])))
        if s['eventtypeid'] in ['river_flood_prediction', 'flash_flood_prediction']:
            if 'timer' in debuglist: start_time = time.time()
            if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start getFloodForecast at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
            # emaildata['forecast'] = cache.setdefault(cacheid, getFloodForecast(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=s['area_code']))
            try:
                emaildata['forecast'] = cache[cacheid] = cache.get(cacheid) or getFloodForecast(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=area_code)
            except Exception as e:
                log.error('Error in getFloodForecast:'+str(e))
                continue
            if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end getFloodForecast, %s seconds" % (time.time() - start_time))])))
            emaildata['forecasts'] = [emaildata['forecast']]
            emaildata['api'] = 'getFloodForecast'
        elif s['eventtypeid'] == 'avalanche_prediction':
            if 'timer' in debuglist: start_time = time.time()
            if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start getAvalancheForecast at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
            # emaildata['forecast'] = cache.setdefault(cacheid, getAvalancheForecast(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=s['area_code']))
            try:
                emaildata['forecast'] = cache[cacheid] = cache.get(cacheid) or getAvalancheForecast(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=area_code)
            except Exception as e:
                log.error('Error in getAvalancheForecast:'+str(e))
                continue
            if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end getAvalancheForecast, %s seconds" % (time.time() - start_time))])))
            emaildata['forecasts'] = [emaildata['forecast']]
            emaildata['api'] = 'getAvalancheForecast'
        elif s['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
            if 'timer' in debuglist: start_time = time.time()
            if 'timer' in debuglist: log.debug(listtostr(['timer start get_earthquakes_list at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')]))
            # emaildata['forecast'] = cache.setdefault(cacheid, getAvalancheForecast(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=s['area_code']))
            # try:
            #     emaildata['forecast'] = cache[cacheid] = cache.get(cacheid) or getEarthquake(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=s['area_code'])
            # except Exception as e:
            #     log.error(' '.join(map(str, ['Error in getEarthquake:'+e])))
            #     continue
            date_limit = (datetime.datetime.now() - datetime.timedelta(days=eq_notif_max_days)).strftime('%Y-%m-%d')
            if 'date_limit' in debuglist: log.debug(' '.join(map(str, ['date_limit', date_limit])))
            cacheid = 'get_earthquakes_list:'+date_limit
            try:
                # log.debug('cacheid in cache: '+str(cacheid in cache))
                # emaildata['forecasts'] = emaildata['earthquakes'] = cache[cacheid] = cache[cacheid] if (cacheid in cache) else get_earthquakes_list(date_limit, area_reference['bbox'])
                emaildata['forecasts'] = emaildata['earthquakes'] = cache.setdefault(cacheid, (cacheid in cache) or get_earthquakes_list(date_limit, area_reference['bbox']))
                # emaildata['forecasts'] = emaildata['earthquakes'] = cache.setdefault(cacheid, cache.get(cacheid) or get_earthquakes_list(date_limit, area_reference['bbox']))
            except Exception as e:
                log.error('Error in get_earthquakes_list:'+str(e))
                continue
            if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end get_earthquakes_list, %s seconds" % (time.time() - start_time))])))
            if (not emaildata['earthquakes']):
                log.info("no earthquake data in the last %s (eq_notif_max_days) days" % (eq_notif_max_days))
            else:
                eqcodes = [e.get('event_code') for e in emaildata['earthquakes']]
                log.debug('earthquakes count in the last %s (eq_notif_max_days) days: %s (%s)' % (eq_notif_max_days, len(emaildata['earthquakes']), ', '.join(eqcodes)))
            emaildata['api'] = 'get_earthquakes_list'
            # log.debug(' '.join(map(str, emaildata['earthquakes'][0].keys())))
            # for idx, item in enumerate(emaildata['earthquakes']):
            #     if 'timer' in debuglist: start_time = time.time()
            #     if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start getEarthquake at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
            #     eq_event = item['event_code']
            #     cacheid = 'getEarthquake:%s:%s' % (eq_event, area_code)
            #     try:
            #         cache[cacheid] = cache.get(cacheid) or getEarthquake(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=area_code, eq_event=eq_event)
            #     except Exception as e:
            #         log.error(' '.join(map(str, ['Error in %s : %s'% (cacheid, e)])))
            #         continue
            #     else:
            #         emaildata['earthquakes'][idx].update(cache[cacheid])
            #         item = emaildata['earthquakes'][idx]
            #     if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end getEarthquake, %s seconds" % (time.time() - start_time))])))

            # emaildata['forecasts'] = [emaildata['forecast']]
            # emaildata['eq_selected'] = get_latest_eq(emaildata['forecast'], emaildata)
            # emaildata['bbox'] = provinces[s['area_code']]['bbox']
            # emaildata.update(get_latest_eq(emaildata['forecast'], provinces[s['area_code']]['bbox']))
            # if (s['eventtypeid'] == 'earthquake_epicenter') and (s['area_scope'] == 'province'):
            #     log.error(' '.join(map(str, ['trigger check for %s in %s %s'% ('earthquake_epicenter', s['area_scope'], provinces[s['area_code']]['area_name'])])))
            #     log.debug(' '.join(map(str, [emaildata.keys()])))
            #     a = AfgAdmbndaAdm1.objects.filter(wkb_geometry__contains=emaildata['eq_selected']['wkb_geometry'])
            #     log.debug(' '.join(map(str, ['len(a)', len(a)])))
            #     cacheid = 'queryset:'+str(a.query)
            #     emaildata['eq_selected']['is_in_area'] = cache[cacheid] = cache.get(cacheid) or (len(a) > 0)
            #     log.debug(' '.join(map(str, ['is_in_area:', emaildata['eq_selected']['is_in_area']])))
            #     break
        # elif s['eventtypeid'] == 'earthquake_epicenter':
        #     pass
        else:
            log.warning('undefined eventtypeid: '+s['eventtypeid'])
            continue
        # emaildata['forecast'] = forecast

        for f in emaildata['forecasts']:
            emaildata['forecast'] = f
            earthquakeid = None
            if s['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
                earthquakeid = f.get('event_code')
                emailid = key_separator.join([emailid_base, sub_key_separator.join(['earthquakeid', earthquakeid])])
                emaildata['eq_selected'] = f
                # log.debug(' '.join(map(str, emaildata['eq_selected'].keys())))

                skip, reason = can_skip_loop(emailid, ['earthquake_shakemap', 'earthquake_epicenter'])
                if skip:
                    log.info('skip checking trigger %s, reason: %s' % (('eqcode:%s' % earthquakeid) if earthquakeid else '', reason))
                    continue

            loop_desc = '%s%s in %s %s code:%s user %s'% (s['eventtypeid'], (' code:%s' % earthquakeid) if earthquakeid else '', s['area_scope'], area_reference['area_name'], s['area_code'], s['username'])
            # log.info(' '.join(map(str, ['checking trigger %s%s in %s %s code:%s user %s'% (s['eventtypeid'], (' code:%s' % earthquakeid) if earthquakeid else '', s['area_scope'], area_reference['area_name'], s['area_code'], s['username'])])))

            # trigger-checking
            etd = eventtypedata[s['eventtypeid']]
            triggered = False
            if s['eventtypeid'] in ['earthquake_epicenter']:
                if (s['area_scope'] == 'province'):
                    # if 'triggered' in debuglist: log.debug(' '.join(map(str, ['checking trigger %s code %s in %s %s'% ('earthquake_epicenter', emaildata.get('eq_selected', {}).get('event_code'), s['area_scope'], provinces[s['area_code']]['area_name'])])))
                    # break
                    a = AfgAdmbndaAdm1.objects.filter(wkb_geometry__contains=emaildata['eq_selected']['wkb_geometry'])
                    # if 'triggered' in debuglist: log.debug(' '.join(map(str, ['len(a)', len(a)])))
                    cacheid = 'queryset:'+str(a.query)
                    triggered = emaildata['eq_selected']['is_in_area'] = cache[cacheid] = cache.get(cacheid) or (len(a) > 0)
                    # triggered = True
                elif (s['area_scope'] == 'national'):
                    # for earthquake_epicenter national_afghanistan, trigger check is always true, combined in sendlimitcheck() function
                    triggered = True
            elif (s['eventtypeid'] in ['earthquake_shakemap']):
                if (s['area_scope'] == 'province'):
                    # return true when area boundary intersect with shakemap boundary
                    # r = AfgAdmbndaAdm1.objects.filter(prov_code=s['area_code']).extra(select={'intersect': 'ST_Intersects(afg_admbnda_adm1.wkb_geometry, (select b.wkb_geometry from earthquake_shakemap as b where b.event_code = \'%s\' order by id desc limit 1))' % (earthquakeid)}).values('intersect')
                    q = AfgAdmbndaAdm1.objects.filter(prov_code=s['area_code']).extra(select={'intersect': 'ST_Intersects(afg_admbnda_adm1.wkb_geometry, (select ST_Union(b.wkb_geometry) from earthquake_shakemap as b where b.event_code = \'%s\' group by b.event_code))' % (earthquakeid)}).values('intersect')
                    cacheid = 'query:'+str(q.query)
                    cache[cacheid] = cache.get(cacheid) or q
                    if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ['query for area boundary intersect with shakemap boundary', str(q.query)])))
                    triggered = q[0]['intersect']
                elif (s['area_scope'] == 'national'):
                    triggered = True
            elif (s['eventtypeid'] in ['avalanche_prediction']):
                score = 0
                for key in etd['triggerkeys']:
                    score += emaildata['forecast'].get(key, 0) * cfg.multiplier[s['eventtypeid']][key]
                triggered = (score >= cfg.threshold[s['eventtypeid']])
            else:
                # triggered = any(emaildata['forecast'].get(key)>= 0 for key in etd['triggerkeys'])
                # log.debug(['etd[\'triggerkeys\']', etd['triggerkeys']])
                # log.debug([emaildata['forecast'].keys()])
                triggered = any(emaildata['forecast'].get(key)> 0 for key in etd['triggerkeys'])

            log.info('triggered:%s for %s' % (triggered, loop_desc))

            cache['triggercheck_result:'+emailid] = triggered

            if triggered:
                # for key in ['eventtypeid', 'eventtype', 'dashboardpage', 'maplayers', 'createjsondata', 'url_getmap_tpl']:
                #     emaildata[key] = eventtypedata[i['eventtypeid']][key]
                emaildata.update({key:etd[key] for key in etd if key in eventtypedata_transfer_keys})
                emaildata.update({key:s[key] for key in s if key in subscriptions_transfer_keys})
                emaildata['area_name'] = area_reference['area_name']
                emaildata['bbox'] = area_reference['bbox']
                emaildata['bbox4point'] = area_reference['bbox4point']
                # emaildata['area_code'] = s['area_code']
                # emaildata['area_scope'] = s['area_scope']
                emaildata['email_head_text'] = email_head_text_tpl.format(**emaildata)
                emaildata['orglogo'] = s['orglogo'].split('/')[-1]
                emaildata['url_settings_unsubs_area'] = settings.SITEURL+'/account/login/?next='+urllib.quote('/pushnotif/settings/?unsub-area={area_scope}-{area_code}-{area_name}'.format(**s))
                emaildata['url_settings_unsubs_event'] = settings.SITEURL+'/account/login/?next='+urllib.quote('/pushnotif/settings/?unsub-event={eventtypeid}'.format(**s))
                emaildata['url_settings_unsubs_all'] = settings.SITEURL+'/account/login/?next='+urllib.quote('/pushnotif/settings/?unsub-all=true')
                emaildata['recipients'] = []

                if s['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
                    # emailid = key_separator.join([emailid_base, sub_key_separator.join(['earthquakeid', earthquakeid])])
                    if 'timer' in debuglist: start_time = time.time()
                    if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start getEarthquake at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
                    # eq_event = emaildata['eq_selected']['event_code']
                    cacheid = 'getEarthquake:%s:%s' % (earthquakeid, s['area_code'])
                    log.debug(' '.join(map(str, emaildata['eq_selected'].keys())))
                    try:
                        eqdata = cache[cacheid] = cache.get(cacheid) or getEarthquake(request, filterLock=filterLock, flag=scope_flags[s['area_scope']], code=s['area_code'], eq_event=earthquakeid)
                    except Exception as e:
                        log.error('Error in %s : %s'% (cacheid, str(e)))
                        continue
                    else:
                        emaildata['eq_selected'].update(eqdata)
                        # item = emaildata['earthquakes'][idx]
                        if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end getEarthquake, %s seconds" % (time.time() - start_time))])))
                        if s['eventtypeid'] in ['earthquake_epicenter']:
                            log.debug(' '.join(map(str, emaildata['eq_selected'].keys())))
                            # emaildata['bbox'] = emaildata['eq_selected']['bbox']
                            # emaildata['bbox4point'] = emaildata['eq_selected']['bbox4point']
                            emaildata['bbox'], emaildata['bbox4point'] = move_bbox(emaildata['bbox'], emaildata['eq_selected']['wkb_geometry'])
                # if s['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
                #     emaildata['eq_selected'] = get_latest_eq(emaildata['forecast'])
                # if (earthquakeid):
                #     emailid = key_separator.join([emailid_base, sub_key_separator.join(['earthquakeid', earthquakeid])])
                # log.info(' '.join(map(str, ['{eventtypeid} in {area_scope} {area_code} {area_name}'.format(**emaildata)])))

                # sendlimitcheck is redundant with can_skip_loop() function
                if sendlimitcheck(emailid):

                    if (emailid not in emaillistadd) or (s['lang_code'] not in emaillistadd[emailid]):
                        # run once for every new emailid or new lang in existing emailid
                        # render email html and text, and pdf attachment; save as temp file

                        # activate language localization
                        prev_lang = get_language()
                        activate(s['lang_code'])

                        emaildata['emailid'] = emailid
                        emaildata['lang'] = s['lang_code']
                        emaildata['fullname'] = 'ASDC User'
                        emaildata['subject'] = MyFormatter().format(_(emaildata['subject_tpl']), **emaildata)
                        # a = _(area_name_scope_tpl)
                        emaildata['area_name_scope'] = MyFormatter().format(_(area_name_scope_tpl), **emaildata)
                        emaildata['current_date'] = strftime("%Y-%m-%d", gmtime())
                        emaildata['view_url'] = settings.SITEURL+'/account/login/?next='+urllib.quote('/dashboard/?page={0}{1}{2}'.format(
                            emaildata['dashboardpage'],
                            ('&code=%s'%(emaildata['area_code'])) if emaildata['area_code'] else '',
                            ('&eq_event=%s'%(emaildata['forecast']['event_code'])) if 'event_code' in emaildata['forecast'] else ''
                            ))

                        emaildata['url_email_webver_all_lang'] = {}
                        for lang in langs:
                            emaildata['url_email_webver_all_lang'][lang] = urltmp+emailid+key_separator+lang+key_separator+'email_html_dataurl.html'
                        emaildata['url_email_webver'] = emaildata['url_email_webver_all_lang'][emaildata['lang']]

                        # tbldata = getmapimage(emaildata)
                        emaildata.update(getmapimage(emaildata))
                        # tbldata.update(forecast)
                        # tbldata['type'] = emaildata['eventtype']
                        # (emaildata[e] = etd[e] for e in etd if e in ['short_dashboard_table_tpl', 'text_body_event_tpl', 'text_body_tpl'])

                        emaildata.update(save_temp_files(emaildata))

                        # create email temp files of other language
                        # to enable view email in other language option
                        save_email_temp_files_other_language(emaildata)

                        # record event data to EventdataHistory
                        record = EventdataHistory(
                            timestamp = datetime.datetime.now(),
                            api = emaildata['api'],
                            eventdata = json.dumps(emaildata['forecast'], cls = CustomEncoder)
                        )
                        record.save()

                        if (emailid not in emaillistadd):
                            emaillistadd[emailid] = {}
                            emaillistadd[emailid]['emaildata']  = {}
                            if s['eventtypeid'] in ['earthquake_shakemap', 'earthquake_epicenter']:
                                emaillistadd[emailid]['earthquakeid'] = earthquakeid
                        emaillistadd[emailid]['emaildata'][s['lang_code']] = copy.deepcopy(emaildata)

                        # restore active language 
                        activate(prev_lang)

                        log.info('created email template data and attachment files' % ())

                    emaillistadd[emailid]['emaildata'][s['lang_code']]['recipients'].append(s['email'])
                else:
                    # line below is redundant with can_skip_loop() function
                    log.info(' '.join(map(str, ['{0} check in {1} is triggered but last similar notification is less than minimum ({2}) days or earthquake_code {3} already exist '.format(emaildata['eventtype'], emaildata['area_name'], new_notif_min_days, earthquakeid)])))

                log.debug(' '.join(map(str, ['emaillistadd.keys()', emaillistadd.keys()])))
    '''
    for ca in area_ref:
        ca = dict(zip(area_ref_keys, ca))
        forecast = {}
        scope_flag = scope_flags[ca['area_scope']]
        area_code = ca['area_code']
        filterLock = None
        log.debug(' '.join(map(str, ['area_ref ca', ca])))
        if 'timer' in debuglist: start_time = time.time()
        if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start getFloodForecast at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
        forecast['floodforecast'] = getFloodForecast(request, filterLock=filterLock, flag=scope_flag, code=area_code)
        if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end getFloodForecast, %s seconds" % (time.time() - start_time))])))
        if 'timer' in debuglist: start_time = time.time()
        if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start getAvalancheForecast at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
        forecast['avalancheforecast'] = getAvalancheForecast(request, filterLock=filterLock, flag=scope_flag, code=area_code)
        if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end getAvalancheForecast, %s seconds" % (time.time() - start_time))])))
        if 'timer' in debuglist: start_time = time.time()
        if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start getEarthquake at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
        forecast['earthquake_shakemap'] = getEarthquake(request, filterLock=filterLock, flag=scope_flag, code=area_code)
        if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end getEarthquake, %s seconds" % (time.time() - start_time))])))

        for i in eventtypedata:
            triggered = any(forecast[i['eventtypeid']][key] >= 0 for key in i['triggerkeys'])
            if triggered:
                for key in ['eventtypeid', 'eventtype', 'dashboardpage', 'maplayers', 'createjsondata', 'url_getmap_tpl']:
                    emaildata[key] = i[key]
                emaildata['area_name'] = provinces[ca['area_code']]['prov_name']
                emaildata['bbox'] = provinces[ca['area_code']]['bbox']
                emaildata['bbox4point'] = provinces[ca['area_code']]['bbox4point']
                emaildata['area_code'] = ca['area_code']
                emaildata['area_scope'] = ca['area_scope']
                emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
                emaildata['recipients'] = []
                if i['eventtypeid'] == 'earthquake_shakemap':
                    for l in forecast[i['eventtypeid']]['eq_list']:
                        if l['selected']:
                            emaildata['eq_selected'] = l
                            emaildata['eq_selected']['epicenter_area_name'] = emaildata['eq_selected']['title'].split(key_separator)[1].strip()
                            emaildata['eq_selected']['dateofevent_date'] = parse(emaildata['eq_selected']['dateofevent']).strftime('%d-%b-%Y')
                            emaildata['eq_selected']['dateofevent_time'] = parse(emaildata['eq_selected']['dateofevent']).strftime('%H:%M')
                            break

                emailid = script_start_time+key_separator+emaildata['eventtypeid']+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")

                if sendlimitcheck(emailid, emaildata.get('eq_selected', {}).get('event_code')):
                    for r in subscriptions:
                        r = dict(zip(subscriptions_keys, r))
                        match_area = (ca['area_scope'] == r['area_scope']) and (ca['area_code'] == r['area_code'])
                        match_eventtype = r['eventtypeid'] == i['eventtypeid']
                        if match_area and match_eventtype:

                            if emailid not in emaillistadd:
                                # run only once for every new emailid

                                emaillistadd[emailid] = {}
                                emaillistadd[emailid]['emaildata']  = {}
                                if i['eventtypeid'] == 'earthquake_shakemap':
                                    emaillistadd[emailid]['earthquakeid'] = emaildata.get('eq_selected', {}).get('event_code')

                                # for every language render email html and text, and pdf attachment, save as temp file
                                for lang in langs:
                                    activate(lang)
                                    emaildata['emailid'] = emailid
                                    emaildata['lang'] = lang
                                    emaildata['fullname'] = 'ASDC User'

                                    tbldata = getmapimage(emaildata)
                                    emaildata.update(tbldata)
                                    tbldata.update(forecast[i['eventtypeid']])
                                    tbldata['type'] = emaildata['eventtype']
                                    emaildata['short_dashboard_table'] = get_template(i['short_dashboard_table_tpl']).render(Context(tbldata))
                                    emaildata['email_body_text_event_specific'] = get_template(i['text_body_event_tpl']).render(Context(emaildata))
                                    emaildata['text_body'] = get_template(i['text_body_tpl']).render(Context(emaildata))

                                    emaildata.update(save_temp_files(emaildata))
                                    emaillistadd[emailid]['emaildata'][lang] = copy.deepcopy(emaildata)

                            emaillistadd[emailid]['emaildata'][r['lang_code']]['recipients'].append(r['email'])
                else:
                    log.debug(' '.join(map(str, ['{0} in {1} check is triggered but last similar notif is less than minimum ({2}) days or earthquake_code {3} already exist '.format(emaildata['eventtype'], emaildata['area_name'], new_notif_min_days, emaildata.get('eq_selected', {}).get('event_code'))])))
    '''

        # # flashflood_forecast check
        # if ((forecast['flashflood_forecast_low_pop'] >= 0) or
        # (forecast['flashflood_forecast_med_pop'] >= 0) or
        # (forecast['flashflood_forecast_high_pop'] >= 0) or
        # (forecast['flashflood_forecast_veryhigh_pop'] >= 0) or
        # (forecast['flashflood_forecast_extreme_pop'] >= 0)
        # ):
        #
        #     emaildata['eventtype'] = 'Flash Flood Prediction'
        #     emaildata['area_name'] = provinces[ca[1]][0]
        #     emaildata['bbox'] = provinces[ca[1]][1]
        #     emaildata['bbox4point'] = provinces[ca[1]][2]
        #     emaildata['area_code'] = ca[1]
        #     emaildata['area_scope'] = ca[0]
        #     emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
        #     emaildata['dashboardpage'] = 'floodforecast'
        #     emaildata['maplayers'] = 'geonode:glofas_gfms_merge,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"64.64791562475617,31.785625036334896%2067.30992857442693,31.785625036334896%2067.30992857442693,33.82314149783689%2064.64791562475617,33.82314149783689%2064.64791562475617,31.785625036334896","showRiskTable":false,"mapID":"700"}'
        #     emaildata['recipients'] = []
        #     emailid = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
        #
        #     if sendlimitcheck(emailid):
        #         for r in recipients:
        #             if (ca[0] == r[4]) and (ca[1] == r[5]):
        #                 # same area_scope and same area_code
        #
        #                 if emailid not in emaillistadd:
        #                     # run only once for every new emailid
        #
        #                     emaillistadd[emailid] = {}
        #
        #                     # for every language render email html and text, and pdf attachment, save as temp file
        #                     for lang in langs:
        #                         activate(lang)
        #                         emaildata['emailid'] = emailid
        #                         emaildata['lang'] = lang
        #                         # emaildata['email_to'].append(r[3])
        #                         # emaildata['fullname'] = r[1]
        #                         # emaildata['fullname'] = emaildata['template_vars']['fullname']
        #                         emaildata['fullname'] = 'ASDC User'
        #
        #                         tbldata = getmapimage(emaildata)
        #                         emaildata.update(tbldata)
        #                         tbldata['type'] = emaildata['eventtype']
        #                         tbldata['prob_low'] = forecast.get('flashflood_forecast_low_pop', 0)
        #                         tbldata['prob_med'] = forecast.get('flashflood_forecast_med_pop', 0)
        #                         tbldata['prob_high'] = forecast.get('flashflood_forecast_high_pop', 0)
        #                         tbldata['prob_veryhigh'] = forecast.get('flashflood_forecast_veryhigh_pop', 0)
        #                         tbldata['prob_extreme'] = forecast.get('flashflood_forecast_extreme_pop', 0)
        #                         emaildata['short_dashboard_table'] = short_dashboard_table_tpl.render(Context(tbldata))
        #                         emaildata['email_body_text_event_specific'] = text_body_event_tpl.render(Context(emaildata))
        #                         emaildata['text_body'] = text_body_tpl.render(Context(emaildata))
        #                         # emaildata['map_image_base64'] = data['map_image_base64']
        #                         # log.debug(' '.join(map(str, [data['short_dashboard_table']])))
        #                         # forecastdata = getFloodForecast(request, filterLock=None, flag='currentProvince', code=ca[1])
        #                         # floodforecast_dashboard_data = {}
        #                         # floodforecast_dashboard_data['css_embed'] = css_embed_tpl.render(Context({}))
        #                         # floodforecast_dashboard_data['body_content'] = floodforecast_tpl.render(Context(forecast))
        #                         # data['dashboard_page_base64'] = floodforecast_tpl.render(Context(forecast))
        #                         # floodforecast_dashboard_html = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data))
        #                         # data['dashboard_page_base64'] = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data)).encode('utf-8').encode('base64')
        #                         # emaildata['forecast'] = []
        #                         # emaildata['forecast'].append(data)
        #                         # emaildata['forecast'] = data
        #
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before save_temp_files()", emaillistadd[emailid].keys()])))
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after save_temp_files()", emaillistadd[emailid].keys()])))
        #
        #                         # emaillistadd[emailid]['recipients'] = []
        #                         emaildata.update(save_temp_files(emaildata))
        #                         emaillistadd[emailid][lang] = {}
        #                         emaillistadd[emailid][lang]['emaildata'] = copy.deepcopy(emaildata)
        #
        #                         # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        #
        #                         # response=sendnotif_dashboard_custom(emaildata=emaildata)
        #
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #                 emaillistadd[emailid][r[6]]['emaildata']['recipients'].append(r[3]) # r[6] == lang
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #     else:
        #         log.debug(' '.join(map(str, ['{0} check is triggered but last similar notif is less than minimum ({1}) days'.format(emaildata['eventtype'], new_notif_min_days)])))
        #
        # # riverflood_forecast
        # if ((forecast['riverflood_forecast_low_pop'] >= 0) or
        # (forecast['riverflood_forecast_med_pop'] >= 0) or
        # (forecast['riverflood_forecast_high_pop'] >= 0) or
        # (forecast['riverflood_forecast_veryhigh_pop'] >= 0) or
        # (forecast['riverflood_forecast_extreme_pop'] >= 0)
        # ):
        #
        #     emaildata['eventtype'] = 'River Flood Prediction'
        #     emaildata['area_name'] = provinces[ca[1]][0]
        #     emaildata['bbox'] = provinces[ca[1]][1]
        #     emaildata['bbox4point'] = provinces[ca[1]][2]
        #     emaildata['area_code'] = ca[1]
        #     emaildata['area_scope'] = ca[0]
        #     emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
        #     emaildata['dashboardpage'] = 'floodforecast'
        #     emaildata['maplayers'] = 'geonode:glofas_gfms_merge,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"64.64791562475617,31.785625036334896%2067.30992857442693,31.785625036334896%2067.30992857442693,33.82314149783689%2064.64791562475617,33.82314149783689%2064.64791562475617,31.785625036334896","showRiskTable":false,"mapID":"700"}'
        #     emaildata['recipients'] = []
        #     emailid = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
        #
        #     if sendlimitcheck(emailid):
        #         for r in recipients:
        #             if (ca[0] == r[4]) and (ca[1] == r[5]):
        #                 # same area_scope and same area_code
        #
        #                 if emailid not in emaillistadd:
        #                     # run only once for every new emailid
        #                     # for every language render email html and text, and pdf attachment, save as temp file
        #
        #                     emaillistadd[emailid] = {}
        #
        #                     for lang in langs:
        #                         activate(lang)
        #                         emaildata['emailid'] = emailid
        #                         emaildata['lang'] = lang
        #                         # emaildata['email_to'].append(r[3])
        #                         # emaildata['fullname'] = r[1]
        #                         # emaildata['fullname'] = emaildata['template_vars']['fullname']
        #                         emaildata['fullname'] = 'ASDC User'
        #
        #                         tbldata = getmapimage(emaildata)
        #                         emaildata.update(tbldata)
        #                         tbldata['type'] = emaildata['eventtype']
        #                         tbldata['prob_low'] = forecast.get('riverflood_forecast_low_pop', 0)
        #                         tbldata['prob_med'] = forecast.get('riverflood_forecast_med_pop', 0)
        #                         tbldata['prob_high'] = forecast.get('riverflood_forecast_high_pop', 0)
        #                         tbldata['prob_veryhigh'] = forecast.get('riverflood_forecast_veryhigh_pop', 0)
        #                         tbldata['prob_extreme'] = forecast.get('riverflood_forecast_extreme_pop', 0)
        #                         emaildata['short_dashboard_table'] = floodforecast_table_tpl.render(Context(tbldata))
        #                         # emaildata['map_image_base64'] = data['map_image_base64']
        #                         # log.debug(' '.join(map(str, [data['short_dashboard_table']])))
        #                         # forecastdata = getFloodForecast(request, filterLock=None, flag='currentProvince', code=ca[1])
        #                         # floodforecast_dashboard_data = {}
        #                         # floodforecast_dashboard_data['css_embed'] = css_embed_tpl.render(Context({}))
        #                         # floodforecast_dashboard_data['body_content'] = floodforecast_tpl.render(Context(forecast))
        #                         # data['dashboard_page_base64'] = floodforecast_tpl.render(Context(forecast))
        #                         # floodforecast_dashboard_html = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data))
        #                         # data['dashboard_page_base64'] = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data)).encode('utf-8').encode('base64')
        #                         # emaildata['forecast'] = []
        #                         # emaildata['forecast'].append(data)
        #                         # emaildata['forecast'] = data
        #
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before save_temp_files()", emaillistadd[emailid].keys()])))
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after save_temp_files()", emaillistadd[emailid].keys()])))
        #
        #                         # emaillistadd[emailid]['recipients'] = []
        #                         emaildata.update(save_temp_files(emaildata))
        #                         emaillistadd[emailid][lang] = {}
        #                         emaillistadd[emailid][lang]['emaildata'] = copy.deepcopy(emaildata)
        #
        #                         # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        #
        #                         # response=sendnotif_dashboard_custom(emaildata=emaildata)
        #
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #                 emaillistadd[emailid][r[6]]['emaildata']['recipients'].append(r[3]) # r[6] == lang
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #     else:
        #         log.debug(' '.join(map(str, ['{0} check is triggered but last similar notif is less than minimum ({1}) days'.format(emaildata['eventtype'], new_notif_min_days)])))
        #
        # # ava_forecast
        # if ((AvalancheForecast['ava_forecast_low_pop'] >= 0) or
        # (AvalancheForecast['ava_forecast_med_pop'] >= 0) or
        # (AvalancheForecast['ava_forecast_high_pop'] >= 0) or
        # (AvalancheForecast['ava_forecast_low_buildings'] >= 0) or
        # (AvalancheForecast['ava_forecast_med_buildings'] >= 0) or
        # (AvalancheForecast['ava_forecast_high_buildings'] >= 0)
        # ):
        #
        #     emaildata['eventtype'] = 'Avalanche Prediction'
        #     emaildata['area_name'] = provinces[ca[1]][0]
        #     emaildata['bbox'] = provinces[ca[1]][1]
        #     emaildata['bbox4point'] = provinces[ca[1]][2]
        #     emaildata['area_code'] = ca[1]
        #     emaildata['area_scope'] = ca[0]
        #     emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
        #     emaildata['dashboardpage'] = 'avalcheforecast'
        #     emaildata['maplayers'] = 'geonode:current_avalanche_forecast_villages,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_Avalanche prediction / current risk_A4 portrait_map_2017-9-29\"","mapTitle":"Avalanche prediction / current risk","comment":"Shows the number of people potentially affected by avalanches based on the current snow cover and snow water equivalent (at small basin scale)","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_avalanche_forecast_villages"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_avsa"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7713827.67075,4328013.9672],"scale":25000,"bbox":[7711358.2213667,4325765.0043687,7716297.1201333,4330262.9300313],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Avalanche areas (potential)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_avsa&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Avalanche risk forecast settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_avalanche_forecast_villages&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]}],"selectedBox":"69.27230952538713,36.1825200849458%2069.31667640788086,36.1825200849458%2069.31667640788086,36.215126252405994%2069.27230952538713,36.215126252405994%2069.27230952538713,36.1825200849458","showRiskTable":false,"mapID":"707"}'
        #     emaildata['recipients'] = []
        #     emailid = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
        #
        #     if sendlimitcheck(emailid):
        #         for r in recipients:
        #             if (ca[0] == r[4]) and (ca[1] == r[5]):
        #                 # same area_scope and same area_code
        #
        #                 if emailid not in emaillistadd:
        #                     # run only once for every new emailid
        #                     # for every language render email html and text, and pdf attachment, save as temp file
        #
        #                     emaillistadd[emailid] = {}
        #
        #                     for lang in langs:
        #                         activate(lang)
        #                         emaildata['emailid'] = emailid
        #                         emaildata['lang'] = lang
        #                         # emaildata['email_to'].append(r[3])
        #                         # emaildata['fullname'] = r[1]
        #                         # emaildata['fullname'] = emaildata['template_vars']['fullname']
        #                         emaildata['fullname'] = 'ASDC User'
        #
        #                         tbldata = getmapimage(emaildata)
        #                         emaildata.update(tbldata)
        #                         tbldata['type'] = emaildata['eventtype']
        #                         tbldata['prob_pop_low'] = AvalancheForecast.get('ava_forecast_low_pop', 0)
        #                         tbldata['prob_pop_med'] = AvalancheForecast.get('ava_forecast_med_pop', 0)
        #                         tbldata['prob_pop_high'] = AvalancheForecast.get('ava_forecast_high_pop', 0)
        #                         tbldata['prob_buildings_low'] = AvalancheForecast.get('ava_forecast_low_buildings', 0)
        #                         tbldata['prob_buildings_med'] = AvalancheForecast.get('ava_forecast_med_buildings', 0)
        #                         tbldata['prob_buildings_high'] = AvalancheForecast.get('ava_forecast_high_buildings', 0)
        #                         emaildata['short_dashboard_table'] = avalancheforecast_table_tpl.render(Context(tbldata))
        #                         # emaildata['map_image_base64'] = data['map_image_base64']
        #                         # log.debug(' '.join(map(str, [data['short_dashboard_table']])))
        #                         # forecastdata = getFloodForecast(request, filterLock=None, flag='currentProvince', code=ca[1])
        #                         # floodforecast_dashboard_data = {}
        #                         # floodforecast_dashboard_data['css_embed'] = css_embed_tpl.render(Context({}))
        #                         # floodforecast_dashboard_data['body_content'] = floodforecast_tpl.render(Context(forecast))
        #                         # data['dashboard_page_base64'] = floodforecast_tpl.render(Context(forecast))
        #                         # floodforecast_dashboard_html = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data))
        #                         # data['dashboard_page_base64'] = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data)).encode('utf-8').encode('base64')
        #                         # emaildata['forecast'] = []
        #                         # emaildata['forecast'].append(data)
        #                         # emaildata['forecast'] = data
        #
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before save_temp_files()", emaillistadd[emailid].keys()])))
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after save_temp_files()", emaillistadd[emailid].keys()])))
        #
        #                         # emaillistadd[emailid]['recipients'] = []
        #                         emaildata.update(save_temp_files(emaildata))
        #                         emaillistadd[emailid][lang] = {}
        #                         emaillistadd[emailid][lang]['emaildata'] = copy.deepcopy(emaildata)
        #
        #                         # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        #
        #                         # response=sendnotif_dashboard_custom(emaildata=emaildata)
        #
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #                 emaillistadd[emailid][r[6]]['emaildata']['recipients'].append(r[3]) # r[6] == lang
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #     else:
        #         log.debug(' '.join(map(str, ['{0} check is triggered but last similar notif is less than minimum ({1}) days'.format(emaildata['eventtype'], new_notif_min_days)])))
        #
        # # earthquake_shakemap
        # if ((earthquakedata['pop_shake_extreme'] >= 0) or
        # (earthquakedata['pop_shake_light'] >= 0) or
        # (earthquakedata['pop_shake_moderate'] >= 0) or
        # (earthquakedata['pop_shake_severe'] >= 0) or
        # (earthquakedata['pop_shake_strong'] >= 0) or
        # (earthquakedata['pop_shake_verystrong'] >= 0) or
        # (earthquakedata['pop_shake_violent'] >= 0) or
        # (earthquakedata['pop_shake_weak'] >= 0) or
        # (earthquakedata['settlement_shake_extreme'] >= 0) or
        # (earthquakedata['settlement_shake_light'] >= 0) or
        # (earthquakedata['settlement_shake_moderate'] >= 0) or
        # (earthquakedata['settlement_shake_severe'] >= 0) or
        # (earthquakedata['settlement_shake_strong'] >= 0) or
        # (earthquakedata['settlement_shake_verystrong'] >= 0) or
        # (earthquakedata['settlement_shake_violent'] >= 0) or
        # (earthquakedata['settlement_shake_weak'] >= 0)
        # ):
        #
        #     emaildata['eventtype'] = 'Earthquake Prediction'
        #     emaildata['area_name'] = provinces[ca[1]][0]
        #     emaildata['bbox'] = provinces[ca[1]][1]
        #     emaildata['bbox4point'] = provinces[ca[1]][2]
        #     emaildata['area_code'] = ca[1]
        #     emaildata['area_scope'] = ca[0]
        #     emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
        #     emaildata['dashboardpage'] = 'earthquake'
        #     emaildata['maplayers'] = 'geonode:earthquake_shakemap,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = '{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\\"iMMAP_AFG_Earthquake_A4 portrait_map_2017-9-29\\"","mapTitle":"Earthquake","comment":"Shows the epicentre of the latest earthquakes as well as the shakemap. Shakemaps and the affected population can be loaded by using the latest tab in the statistics menu.\\n\\nAdditionally it shows the tectonic regions of Afghanistan derived from the USGS \\"Seismotectonic Map of Afghanistan, with Annotated Bibliography\\" (2005) by By Russell L. Wheeler, Charles G. Bufe, Margo L. Johnson, and Richard L. Dart. \\n\\nSeismic intensity and description of potential damage (USGS, 2007). Peak Horizontal Acceleration with 2 Percent Probability of Exceedance in 50 years\\n\\nA 2 percent probability of exceedance in 50 years corresponds to a ground-motion return time of approximately 2500 years, or approximately a 10% probability of of exceedance in 250 years. . The seismic intensity data and classes originate from the USGS Earthquake Hazard Map for Afghanistan (2007), by By Oliver S. Boyd, Charles S. Mueller, and Kenneth S. Rukstales","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":25253.763106179995,"maxScaleDenominator":631344077654500,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_rdsl"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_shakemap"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code=\'10008rah\'","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code in (\'10003qv5\',\'100042n2\',\'10003re5\',\'10003yzt\',\'100040ct\',\'100044k6\',\'100044km\',\'100044lp\',\'100049i1\',\'10004dtm\',\'10004rhs\',\'20005gsg\',\'10005h1j\',\'200066x9\',\'200067p3\')","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events_past_week"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[8147575.7178394,4429009.4558803],"scale":1500000,"bbox":[8147081.8279627,4428559.663314,8148069.6077161,4429459.2484466],"rotation":0}],"legends":[{"name":"Earthquakes in the past week","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events_past_week&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquakes with Shakemap ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquake shakemap","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_shakemap&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Road network","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?EXCEPTIONS=application%2Fvnd.ogc.se_xml&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&TILED=true&LAYER=geonode%3Aafg_rdsl&STYLE=afg_rdsl_legend_osm&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000&width=12&height=12"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"73.18648128050067,36.92429450170914%2073.19535465700014,36.92429450170914%2073.19535465700014,36.930754510341295%2073.18648128050067,36.930754510341295%2073.18648128050067,36.92429450170914","showRiskTable":false,"mapID":"706"}'
        #     emaildata['recipients'] = []
        #     emailid = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
        #
        #     if sendlimitcheck(emailid):
        #         for r in recipients:
        #             if (ca[0] == r[4]) and (ca[1] == r[5]):
        #                 # same area_scope and same area_code
        #
        #                 if emailid not in emaillistadd:
        #                     # run only once for every new emailid
        #                     # for every language render email html and text, and pdf attachment, save as temp file
        #
        #                     emaillistadd[emailid] = {}
        #
        #                     for lang in langs:
        #                         activate(lang)
        #                         emaildata['emailid'] = emailid
        #                         emaildata['lang'] = lang
        #                         # emaildata['email_to'].append(r[3])
        #                         # emaildata['fullname'] = r[1]
        #                         # emaildata['fullname'] = emaildata['template_vars']['fullname']
        #                         emaildata['fullname'] = 'ASDC User'
        #
        #                         tbldata = getmapimage(emaildata)
        #                         emaildata.update(tbldata)
        #                         tbldata['type'] = emaildata['eventtype']
        #                         tbldata['prob_pop_extreme'] = earthquakedata.get('pop_shake_extreme', 0)
        #                         tbldata['prob_pop_light'] = earthquakedata.get('pop_shake_light', 0)
        #                         tbldata['prob_pop_moderate'] = earthquakedata.get('pop_shake_moderate', 0)
        #                         tbldata['prob_pop_severe'] = earthquakedata.get('pop_shake_severe', 0)
        #                         tbldata['prob_pop_strong'] = earthquakedata.get('pop_shake_strong', 0)
        #                         tbldata['prob_pop_verystrong'] = earthquakedata.get('pop_shake_verystrong', 0)
        #                         tbldata['prob_pop_violent'] = earthquakedata.get('pop_shake_violent', 0)
        #                         tbldata['prob_pop_weak'] = earthquakedata.get('pop_shake_weak', 0)
        #                         tbldata['prob_sett_extreme'] = earthquakedata.get('sett_shake_extreme', 0)
        #                         tbldata['prob_sett_light'] = earthquakedata.get('sett_shake_light', 0)
        #                         tbldata['prob_sett_moderate'] = earthquakedata.get('sett_shake_moderate', 0)
        #                         tbldata['prob_sett_severe'] = earthquakedata.get('sett_shake_severe', 0)
        #                         tbldata['prob_sett_strong'] = earthquakedata.get('sett_shake_strong', 0)
        #                         tbldata['prob_sett_verystrong'] = earthquakedata.get('sett_shake_verystrong', 0)
        #                         tbldata['prob_sett_violent'] = earthquakedata.get('sett_shake_violent', 0)
        #                         tbldata['prob_sett_weak'] = earthquakedata.get('sett_shake_weak', 0)
        #                         emaildata['short_dashboard_table'] = earthquake_table_tpl.render(Context(tbldata))
        #                         # emaildata['map_image_base64'] = data['map_image_base64']
        #                         # log.debug(' '.join(map(str, [data['short_dashboard_table']])))
        #                         # forecastdata = getFloodForecast(request, filterLock=None, flag='currentProvince', code=ca[1])
        #                         # floodforecast_dashboard_data = {}
        #                         # floodforecast_dashboard_data['css_embed'] = css_embed_tpl.render(Context({}))
        #                         # floodforecast_dashboard_data['body_content'] = floodforecast_tpl.render(Context(forecast))
        #                         # data['dashboard_page_base64'] = floodforecast_tpl.render(Context(forecast))
        #                         # floodforecast_dashboard_html = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data))
        #                         # data['dashboard_page_base64'] = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data)).encode('utf-8').encode('base64')
        #                         # emaildata['forecast'] = []
        #                         # emaildata['forecast'].append(data)
        #                         # emaildata['forecast'] = data
        #
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before save_temp_files()", emaillistadd[emailid].keys()])))
        #                         # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after save_temp_files()", emaillistadd[emailid].keys()])))
        #
        #                         # emaillistadd[emailid]['recipients'] = []
        #                         emaildata.update(save_temp_files(emaildata))
        #                         emaillistadd[emailid][lang] = {}
        #                         emaillistadd[emailid][lang]['emaildata'] = copy.deepcopy(emaildata)
        #
        #                         # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        #
        #                         # response=sendnotif_dashboard_custom(emaildata=emaildata)
        #
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() before recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #                 emaillistadd[emailid][r[6]]['emaildata']['recipients'].append(r[3]) # r[6] == lang
        #                 # log.debug(' '.join(map(str, ["emaillistadd[emailid].keys() after recipients.append()", emaillistadd[emailid][lang]['emaildata']['recipients']])))
        #     else:
        #         log.debug(' '.join(map(str, ['{0} check is triggered but last similar notif is less than minimum ({1}) days'.format(emaildata['eventtype'], new_notif_min_days)])))

        # # riverflood_forecast check
        # if ((forecast['riverflood_forecast_low_pop'] >= 0) or
        # (forecast['riverflood_forecast_med_pop'] >= 0) or
        # (forecast['riverflood_forecast_high_pop'] >= 0) or
        # (forecast['riverflood_forecast_veryhigh_pop'] >= 0) or
        # (forecast['riverflood_forecast_extreme_pop'] >= 0)
        # ):
        #
        #     emaildata['eventtype'] = 'River Flood Prediction'
        #     emaildata['area_name'] = provinces[ca[1]][0]
        #     emaildata['bbox'] = provinces[ca[1]][1]
        #     emaildata['bbox4point'] = provinces[ca[1]][2]
        #     emaildata['area_code'] = ca[1]
        #     emaildata['area_scope'] = ca[0]
        #     emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
        #     emaildata['dashboardpage'] = 'floodforecast'
        #     emaildata['maplayers'] = 'geonode:glofas_gfms_merge,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"64.64791562475617,31.785625036334896%2067.30992857442693,31.785625036334896%2067.30992857442693,33.82314149783689%2064.64791562475617,33.82314149783689%2064.64791562475617,31.785625036334896","showRiskTable":false,"mapID":"700"}'
        #
        #     for r in recipients:
        #         if (ca[0] == r[4]) and (ca[1] == r[5]):
        #             # same area_scope and area_code
        #
        #             emaildata['email_to'] = r[3]
        #             emaildata['emailid'] = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
        #             emaildata['fullname'] = emaildata['template']['fullname']
        #
        #             data = getmapimage(emaildata)
        #             data['type'] = emaildata['eventtype']
        #             data['prob_low'] = forecast.get('riverflood_forecast_low_pop', 0)
        #             data['prob_med'] = forecast.get('riverflood_forecast_med_pop', 0)
        #             data['prob_high'] = forecast.get('riverflood_forecast_high_pop', 0)
        #             data['prob_veryhigh'] = forecast.get('riverflood_forecast_veryhigh_pop', 0)
        #             data['prob_extreme'] = forecast.get('riverflood_forecast_extreme_pop', 0)
        #             data['short_dashboard_table'] = floodforecast_table_tpl.render(Context(data))
        #             # log.debug(' '.join(map(str, [data['short_dashboard_table']])))
        #             # forecastdata = getFloodForecast(request, filterLock=None, flag='currentProvince', code=ca[1])
        #             floodforecast_dashboard_data = {}
        #             floodforecast_dashboard_data['css_embed'] = css_embed_tpl.render(Context({}))
        #             floodforecast_dashboard_data['body_content'] = floodforecast_tpl.render(Context(forecast))
        #             # data['dashboard_page_base64'] = floodforecast_tpl.render(Context(forecast))
        #             floodforecast_dashboard_html = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data))
        #             data['dashboard_page_base64'] = floodforecast_dashboard_tpl.render(Context(floodforecast_dashboard_data)).encode('utf-8').encode('base64')
        #             emaildata['forecast'] = []
        #             emaildata['forecast'].append(data)
        #
        #             # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        #
        #             response=sendnotif_dashboard_custom(emaildata=emaildata)

        # # ava_forecast
        # if ((AvalancheForecast['ava_forecast_low_pop'] >= 0) or
        # (AvalancheForecast['ava_forecast_med_pop'] >= 0) or
        # (AvalancheForecast['ava_forecast_high_pop'] >= 0) or
        # (AvalancheForecast['ava_forecast_low_buildings'] >= 0) or
        # (AvalancheForecast['ava_forecast_med_buildings'] >= 0) or
        # (AvalancheForecast['ava_forecast_high_buildings'] >= 0)
        # ):
        #
        #     emaildata['eventtype'] = 'Avalanche Prediction'
        #     emaildata['area_name'] = provinces[ca[1]][0]
        #     emaildata['bbox'] = provinces[ca[1]][1]
        #     emaildata['bbox4point'] = provinces[ca[1]][2]
        #     emaildata['area_code'] = ca[1]
        #     emaildata['area_scope'] = ca[0]
        #     emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
        #     emaildata['dashboardpage'] = 'avalcheforecast'
        #     emaildata['maplayers'] = 'geonode:current_avalanche_forecast_villages,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_Avalanche prediction / current risk_A4 portrait_map_2017-9-29\"","mapTitle":"Avalanche prediction / current risk","comment":"Shows the number of people potentially affected by avalanches based on the current snow cover and snow water equivalent (at small basin scale)","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_avalanche_forecast_villages"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_avsa"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7713827.67075,4328013.9672],"scale":25000,"bbox":[7711358.2213667,4325765.0043687,7716297.1201333,4330262.9300313],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Avalanche areas (potential)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_avsa&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]},{"name":"Avalanche risk forecast settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_avalanche_forecast_villages&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=25000"]}]}],"selectedBox":"69.27230952538713,36.1825200849458%2069.31667640788086,36.1825200849458%2069.31667640788086,36.215126252405994%2069.27230952538713,36.215126252405994%2069.27230952538713,36.1825200849458","showRiskTable":false,"mapID":"707"}'
        #
        #     for r in recipients:
        #         if (ca[0] == r[4]) and (ca[1] == r[5]):
        #             # same area_scope and area_code
        #
        #             emaildata['email_to'] = r[3]
        #             emaildata['emailid'] = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
        #             emaildata['fullname'] = emaildata['template']['fullname']
        #
        #             data = getmapimage(emaildata)
        #             data['type'] = emaildata['eventtype']
        #             data['prob_pop_low'] = AvalancheForecast.get('ava_forecast_low_pop', 0)
        #             data['prob_pop_med'] = AvalancheForecast.get('ava_forecast_med_pop', 0)
        #             data['prob_pop_high'] = AvalancheForecast.get('ava_forecast_high_pop', 0)
        #             data['prob_buildings_low'] = AvalancheForecast.get('ava_forecast_low_buildings', 0)
        #             data['prob_buildings_med'] = AvalancheForecast.get('ava_forecast_med_buildings', 0)
        #             data['prob_buildings_high'] = AvalancheForecast.get('ava_forecast_high_buildings', 0)
        #             data['short_dashboard_table'] = avalancheforecast_table_tpl.render(Context(data))
        #             # log.debug(' '.join(map(str, [data['short_dashboard_table']])))
        #             # forecastdata = getAvalancheForecast(request, filterLock=None, flag='currentProvince', code=ca[1])
        #             AvalancheForecast_dashboard_data = {}
        #             AvalancheForecast_dashboard_data['css_embed'] = css_embed_tpl.render(Context({}))
        #             AvalancheForecast_dashboard_data['body_content'] = floodforecast_tpl.render(Context(AvalancheForecast))
        #             # data['dashboard_page_base64'] = floodforecast_tpl.render(Context(AvalancheForecast))
        #             # AvalancheForecast_dashboard_html = AvalancheForecast_dashboard_tpl.render(Context(AvalancheForecast_dashboard_data))
        #             # data['dashboard_page_base64'] = AvalancheForecast_dashboard_tpl.render(Context(floodforecast_dashboard_data)).encode('utf-8').encode('base64')
        #             emaildata['forecast'] = []
        #             emaildata['forecast'].append(data)
        #
        #             # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        #
        #             response=sendnotif_dashboard_custom(emaildata=emaildata)

        # earthquake_shakemap
        # if ((earthquakedata['pop_shake_extreme'] >= 0) or
        # (earthquakedata['pop_shake_light'] >= 0) or
        # (earthquakedata['pop_shake_moderate'] >= 0) or
        # (earthquakedata['pop_shake_severe'] >= 0) or
        # (earthquakedata['pop_shake_strong'] >= 0) or
        # (earthquakedata['pop_shake_verystrong'] >= 0) or
        # (earthquakedata['pop_shake_violent'] >= 0) or
        # (earthquakedata['pop_shake_weak'] >= 0) or
        # (earthquakedata['settlement_shake_extreme'] >= 0) or
        # (earthquakedata['settlement_shake_light'] >= 0) or
        # (earthquakedata['settlement_shake_moderate'] >= 0) or
        # (earthquakedata['settlement_shake_severe'] >= 0) or
        # (earthquakedata['settlement_shake_strong'] >= 0) or
        # (earthquakedata['settlement_shake_verystrong'] >= 0) or
        # (earthquakedata['settlement_shake_violent'] >= 0) or
        # (earthquakedata['settlement_shake_weak'] >= 0)
        # ):
        #
        #     emaildata['dashboardpage'] = 'earthquake'
        #     emaildata['maplayers'] = 'geonode:earthquake_shakemap,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = '{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\\"iMMAP_AFG_Earthquake_A4 portrait_map_2017-9-29\\"","mapTitle":"Earthquake","comment":"Shows the epicentre of the latest earthquakes as well as the shakemap. Shakemaps and the affected population can be loaded by using the latest tab in the statistics menu.\\n\\nAdditionally it shows the tectonic regions of Afghanistan derived from the USGS \\"Seismotectonic Map of Afghanistan, with Annotated Bibliography\\" (2005) by By Russell L. Wheeler, Charles G. Bufe, Margo L. Johnson, and Richard L. Dart. \\n\\nSeismic intensity and description of potential damage (USGS, 2007). Peak Horizontal Acceleration with 2 Percent Probability of Exceedance in 50 years\\n\\nA 2 percent probability of exceedance in 50 years corresponds to a ground-motion return time of approximately 2500 years, or approximately a 10% probability of of exceedance in 250 years. . The seismic intensity data and classes originate from the USGS Earthquake Hazard Map for Afghanistan (2007), by By Oliver S. Boyd, Charles S. Mueller, and Kenneth S. Rukstales","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":25253.763106179995,"maxScaleDenominator":631344077654500,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_rdsl"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_shakemap"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code=\'10008rah\'","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code in (\'10003qv5\',\'100042n2\',\'10003re5\',\'10003yzt\',\'100040ct\',\'100044k6\',\'100044km\',\'100044lp\',\'100049i1\',\'10004dtm\',\'10004rhs\',\'20005gsg\',\'10005h1j\',\'200066x9\',\'200067p3\')","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events_past_week"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[8147575.7178394,4429009.4558803],"scale":1500000,"bbox":[8147081.8279627,4428559.663314,8148069.6077161,4429459.2484466],"rotation":0}],"legends":[{"name":"Earthquakes in the past week","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events_past_week&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquakes with Shakemap ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquake shakemap","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_shakemap&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Road network","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?EXCEPTIONS=application%2Fvnd.ogc.se_xml&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&TILED=true&LAYER=geonode%3Aafg_rdsl&STYLE=afg_rdsl_legend_osm&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000&width=12&height=12"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"73.18648128050067,36.92429450170914%2073.19535465700014,36.92429450170914%2073.19535465700014,36.930754510341295%2073.18648128050067,36.930754510341295%2073.18648128050067,36.92429450170914","showRiskTable":false,"mapID":"706"}'
        #     emaildata['eventtype'] = 'Earthquake'
        #     emaildata['area_name'] = provinces[ca[1]][0]
        #     emaildata['bbox'] = provinces[ca[1]][1]
        #     emaildata['bbox4point'] = provinces[ca[1]][2]
        #     emaildata['area_code'] = ca[1]
        #     emaildata['area_scope'] = ca[0]
        #     emaildata['subject'] = 'ASDC Notification: {0} in {1} {2}'.format(emaildata['eventtype'], emaildata['area_name'], emaildata['area_scope'])
        #     emaildata['dashboardpage'] = 'earthquake'
        #     emaildata['maplayers'] = 'geonode:earthquake_shakemap,afg_admbnda_adm1'
        #     emaildata['createjsondata'] = '{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\\"iMMAP_AFG_Earthquake_A4 portrait_map_2017-9-29\\"","mapTitle":"Earthquake","comment":"Shows the epicentre of the latest earthquakes as well as the shakemap. Shakemaps and the affected population can be loaded by using the latest tab in the statistics menu.\\n\\nAdditionally it shows the tectonic regions of Afghanistan derived from the USGS \\"Seismotectonic Map of Afghanistan, with Annotated Bibliography\\" (2005) by By Russell L. Wheeler, Charles G. Bufe, Margo L. Johnson, and Richard L. Dart. \\n\\nSeismic intensity and description of potential damage (USGS, 2007). Peak Horizontal Acceleration with 2 Percent Probability of Exceedance in 50 years\\n\\nA 2 percent probability of exceedance in 50 years corresponds to a ground-motion return time of approximately 2500 years, or approximately a 10% probability of of exceedance in 250 years. . The seismic intensity data and classes originate from the USGS Earthquake Hazard Map for Afghanistan (2007), by By Oliver S. Boyd, Charles S. Mueller, and Kenneth S. Rukstales","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":25253.763106179995,"maxScaleDenominator":631344077654500,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_rdsl"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_shakemap"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code=\'10008rah\'","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"CQL_FILTER":"event_code in (\'10003qv5\',\'100042n2\',\'10003re5\',\'10003yzt\',\'100040ct\',\'100044k6\',\'100044km\',\'100044lp\',\'100049i1\',\'10004dtm\',\'10004rhs\',\'20005gsg\',\'10005h1j\',\'200066x9\',\'200067p3\')","TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:earthquake_events_past_week"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[8147575.7178394,4429009.4558803],"scale":1500000,"bbox":[8147081.8279627,4428559.663314,8148069.6077161,4429459.2484466],"rotation":0}],"legends":[{"name":"Earthquakes in the past week","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events_past_week&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquakes with Shakemap ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_events&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Earthquake shakemap","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aearthquake_shakemap&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Road network","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?EXCEPTIONS=application%2Fvnd.ogc.se_xml&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&TILED=true&LAYER=geonode%3Aafg_rdsl&STYLE=afg_rdsl_legend_osm&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000&width=12&height=12"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=5000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"73.18648128050067,36.92429450170914%2073.19535465700014,36.92429450170914%2073.19535465700014,36.930754510341295%2073.18648128050067,36.930754510341295%2073.18648128050067,36.92429450170914","showRiskTable":false,"mapID":"706"}'
        #
        #     for r in recipients:
        #         if (ca[0] == r[4]) and (ca[1] == r[5]):
        #             # same area_scope and area_code
        #
        #             emaildata['email_to'] = r[3]
        #             emaildata['emailid'] = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
        #             emaildata['fullname'] = emaildata['template']['fullname']
        #
        #             data = getmapimage(emaildata)
        #             data['type'] = emaildata['eventtype']
        #             data['prob_pop_extreme'] = earthquakedata.get('pop_shake_extreme', 0)
        #             data['prob_pop_light'] = earthquakedata.get('pop_shake_light', 0)
        #             data['prob_pop_moderate'] = earthquakedata.get('pop_shake_moderate', 0)
        #             data['prob_pop_severe'] = earthquakedata.get('pop_shake_severe', 0)
        #             data['prob_pop_strong'] = earthquakedata.get('pop_shake_strong', 0)
        #             data['prob_pop_verystrong'] = earthquakedata.get('pop_shake_verystrong', 0)
        #             data['prob_pop_violent'] = earthquakedata.get('pop_shake_violent', 0)
        #             data['prob_pop_weak'] = earthquakedata.get('pop_shake_weak', 0)
        #             data['prob_sett_extreme'] = earthquakedata.get('sett_shake_extreme', 0)
        #             data['prob_sett_light'] = earthquakedata.get('sett_shake_light', 0)
        #             data['prob_sett_moderate'] = earthquakedata.get('sett_shake_moderate', 0)
        #             data['prob_sett_severe'] = earthquakedata.get('sett_shake_severe', 0)
        #             data['prob_sett_strong'] = earthquakedata.get('sett_shake_strong', 0)
        #             data['prob_sett_verystrong'] = earthquakedata.get('sett_shake_verystrong', 0)
        #             data['prob_sett_violent'] = earthquakedata.get('sett_shake_violent', 0)
        #             data['prob_sett_weak'] = earthquakedata.get('sett_shake_weak', 0)
        #             data['short_dashboard_table'] = earthquake_table_tpl.render(Context(data))
        #             # log.debug(' '.join(map(str, [data['short_dashboard_table']])))
        #             # forecastdata = getEarthquake(request, filterLock=None, flag='currentProvince', code=ca[1])
        #             earthquake_dashboard_data = {}
        #             earthquake_dashboard_data['css_embed'] = css_embed_tpl.render(Context({}))
        #             earthquake_dashboard_data['body_content'] = floodforecast_tpl.render(Context(earthquakedata))
        #             # data['dashboard_page_base64'] = floodforecast_tpl.render(Context(earthquakedata))
        #             # earthquake_dashboard_html = earthquake_dashboard_tpl.render(Context(earthquake_dashboard_data))
        #             # data['dashboard_page_base64'] = earthquake_dashboard_tpl.render(Context(floodforecast_dashboard_data)).encode('utf-8').encode('base64')
        #             emaildata['forecast'] = []
        #             emaildata['forecast'].append(data)
        #
        #             # emaildata['css_embed'] = css_embed_tpl.render(Context({}))
        #
        #             response=sendnotif_dashboard_custom(emaildata=emaildata)

    # response=sendnotif(emaildata)

    # email_forecast_item = get_template('email_forecast_item.html')

    # emaildata['askapproval'] = False

    # emaildata['forecast_html'] = ''
    # for i in emaildata['forecast']:
    #     emaildata['forecast_html'] += email_forecast_item.render(Context(i))

    # text_content = plaintext.render(d)

    # send approval emails to admin
    messages = []
    response = None
    email_tpl = get_template('email_simple_hybrid.html')
    if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ['emaillistadd.keys()', emaillistadd.keys()])))
    for emailid in emaillistadd:
        if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ['emailid', emailid])))
        if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ['emaillistadd[emailid][\'emaildata\'].keys()', emaillistadd[emailid]['emaildata'].keys()])))

        # admin specific template data
        first_lang = emaillistadd[emailid]['emaildata'].keys()[0]
        tpldata = copy.deepcopy(emaillistadd[emailid]['emaildata'][first_lang])
        if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ['first_lang', first_lang])))
        # if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ['emaillistadd[emailid][\'emaildata\'][\'first_lang\'].keys()', emaillistadd[emailid]['emaildata'][first_lang].keys()])))
        tpldata['askapproval'] = True
        tpldata['imgsrc_contentid'] = True
        tpldata['url_approve_true'] = settings.SITEURL+'/pushnotif/adminapproval/'+emailid+'/approve/'
        tpldata['url_approve_false'] = settings.SITEURL+'/pushnotif/adminapproval/'+emailid+'/cancel/'
        tpldata['approval_title'] = 'APPROVAL REQUIRED: '+tpldata['subject']
        tpldata['fullname'] = 'ASDC User'
        tpldata['recipients_count'] = 0
        tpldata['recipients_all_lang'] = {}
        for lang in emaillistadd[emailid]['emaildata']:
            tpldata['recipients_all_lang'][lang] = {}
            tpldata['recipients_all_lang'][lang]['recipients'] = emaillistadd[emailid]['emaildata'][lang]['recipients']
            tpldata['recipients_count'] += len(emaillistadd[emailid]['emaildata'][lang]['recipients'])

        # render template in default language
        prev_lang = get_language()
        activate(default_lang)
        etd = eventtypedata[tpldata['eventtypeid']]
        if etd.get('short_dashboard_table_tpl'):
            tpldata['short_dashboard_table'] = get_template(etd.get('short_dashboard_table_tpl')).render(Context(tpldata))
        # tpldata['short_dashboard_table'] = get_template(etd['short_dashboard_table_tpl']).render(Context(tpldata))
        tpldata['email_body_text_event_specific'] = get_template(etd['text_body_event_tpl']).render(Context(tpldata))
        tpldata['text_body'] = get_template(etd['text_body_tpl']).render(Context(tpldata))
        response = email_tpl.render(Context(tpldata))
        approvaldata = copy.deepcopy(tpldata)
        approvaldata['email_approval'] = response
        sendnotif_adminapproval(emaillistadd[emailid], approvaldata)
        activate(prev_lang)
        # messages.append(sendnotif_adminapproval(emaillistadd[emailid], approvaldata, return_message=True))
        if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ['emailid', emailid])))
        # if 'emailapproval' in debuglist: log.debug(' '.join(map(str, ["tpldata['recipients']", tpldata['recipients_all_lang']])))

    # if 'timer' in debuglist: start_time = time.time()
    # if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start send_messages at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
    # mail.get_connection().send_messages(messages)   # Use default email connection
    # if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end send_messages, %s seconds" % (time.time() - start_time))])))

    # fileemaillist = open(folderbase+'emaillist.json', 'r+')
    # emaillist = json.load(fileemaillist)

    # if emaillist.json larger then max size, archive then start from empty
    if (os.stat(folderbase+'emaillist.json').st_size > emaillist_json_max_byte):
        os.rename(folderbase+'emaillist.json', folderbase+'emaillist_olderthan_{0}.json' % (strftime("%Y%m%d%H%M%S", gmtime())))
        with open(folderbase+'emaillist.json', 'w') as f:
            json.dump({}, f)

    # add new data to emaillist file
    with open(folderbase+'emaillist.json', 'r+') as fileemaillist:
        c = fileemaillist.read().strip() or '{}'
        emaillist = json.loads(c)
        # pprint.pprint(emaillist)
        for eid in emaillistadd:
            emaillist[eid] = {}
            if emaillistadd[eid].get('earthquakeid'):
                emaillist[eid]['earthquakeid'] = emaillistadd[eid]['earthquakeid']
            for lang in emaillistadd[eid]['emaildata']:
                emaillist[eid]['emaildata'] = {}
                emaillist[eid]['emaildata'][lang] = {}
                emaillist[eid]['emaildata'][lang]['files'] = {i:v['fullname'] for i, v in emaillistadd[eid]['emaildata'][lang]['files_dict'].iteritems()}
                # emaillist[e]['recipients'] = emaillistadd[e]['emaildata']['recipients']
                emaillist[eid]['emaildata'][lang]['subject'] = emaillistadd[eid]['emaildata'][lang]['subject']
                emaillist[eid]['emaildata'][lang]['email_from'] = emaillistadd[eid]['emaildata'][lang]['email_from']
                emaillist[eid]['emaildata'][lang]['recipients'] = emaillistadd[eid]['emaildata'][lang]['recipients']
                if emaillistadd[eid]['emaildata'][lang]['errors']:
                    emaillist[eid]['emaildata'][lang]['errors'] = emaillistadd[eid]['emaildata'][lang]['errors']
        fileemaillist.seek(0)
        json.dump(emaillist, fileemaillist)
        fileemaillist.truncate()
        # pprint.pprint(emaillist)
        # fileemaillist.close()

    log.info(' '.join(map(str, ['New notification added:', len(emaillistadd)])))
    for idx, eid in enumerate(emaillistadd):
        log.info(' '.join(map(str, [idx+1, eid])))

    # return HttpResponse(json.dumps(forecast), content_type="application/json")
    return HttpResponse(response, content_type="text/html")

def adminapproval(request, emailid, action):
    # approve = json.loads(request.GET.get('approve', 'false'))
    # cancel = json.loads(request.GET.get('cancel', 'false'))
    # print 'request.is_ajax()', request.is_ajax()
    sendstatuses = {'approve':'sending', 'cancel':'cancelling'}
    approve = (action == 'approve')
    cancel = (action == 'cancel')

    with open(folderbase+'emaillist.json', 'r+') as fileemaillist:
        emaillist = json.load(fileemaillist)

        # check notif is available and not sent or canceled or in process
        notifstatus = {key: val for key, val in emaillist[emailid].iteritems() if key in ['sent_on', 'canceled_on', 'sendstatus']}
        if notifstatus:
            response = dict(notifstatus, **{'success':True})
            if (request.is_ajax()) or ('application/json' in request.META.get('HTTP_ACCEPT')):
                return HttpResponse(json.dumps(response), content_type="application/json")
            else:
                return HttpResponseRedirect('/pushnotif/report/notifications/popapproval/'+emailid)

        #  set sendstatus text before potentially long process
        sendstatus = sendstatuses.get(action, '')
        emaillist.get(emailid, {})['sendstatus'] = sendstatus
        emaillist.get(emailid, {})['sendstatus_on'] = strftime("%Y-%m-%d %H-%M-%S", gmtime())
        fileemaillist.seek(0)
        json.dump(emaillist, fileemaillist)
        fileemaillist.truncate()

    log.debug(' '.join(map(str, ['approve', approve])))
    if approve:

        response = sendnotif_user(emaillistitem=emaillist[emailid])
        if response:

            with open(folderbase+'emaillist.json', 'r+') as fileemaillist:
                action_time = strftime("%Y-%m-%d %H-%M-%S", gmtime())
                # fileemaillist = open(folderbase+'emaillist.json', 'r+')
                # fileemail = open(foldertmp+saved_fnames[0], 'r')
                # emaillist = json.load(fileemaillist)

                if 'sendstatus' in emaillist[emailid]:
                    del emaillist[emailid]['sendstatus']
                if 'sendstatus_on' in emaillist[emailid]:
                    del emaillist[emailid]['sendstatus_on']
                emaillist[emailid]['sent_on'] = action_time
                emaillist[emailid]['admin_action_by'] = request.user.username
                fileemaillist.seek(0)
                json.dump(emaillist, fileemaillist)
                fileemaillist.truncate()
                # fileemail.write(html_content)
                # fileemaillist.close()

                # pprint(request.META)
                response = dict(response, **{'success':True, 'sent_on': action_time})
                if (request.is_ajax()) or ('application/json' in request.META.get('HTTP_ACCEPT')):
                    return HttpResponse(json.dumps(response), content_type="application/json")
                else:
                    return HttpResponseRedirect('/pushnotif/report/notifications/popapproval/'+emailid)

        # return HttpResponse(response, content_type="text/html")
    elif cancel:
        with open(folderbase+'emaillist.json', 'r+') as fileemaillist:
            emaillist = json.load(fileemaillist)
            # response = sendnotif_user(emaillistitem=emaillist[emailid])
            action_time = strftime("%Y-%m-%d %H-%M-%S", gmtime())

            if 'sendstatus' in emaillist[emailid]:
                del emaillist[emailid]['sendstatus']
            if 'sendstatus_on' in emaillist[emailid]:
                del emaillist[emailid]['sendstatus_on']
            emaillist[emailid]['canceled_on'] = action_time
            emaillist[emailid]['admin_action_by'] = request.user.username
            fileemaillist.seek(0)
            json.dump(emaillist, fileemaillist)
            fileemaillist.truncate()

            response = {'success':True, 'canceled_on': action_time}
            if (request.is_ajax()) or ('application/json' in request.META.get('HTTP_ACCEPT')):
                return HttpResponse(json.dumps(response), content_type="application/json")
            else:
                return HttpResponseRedirect('/pushnotif/report/notifications/popapproval/'+emailid)

    return HttpResponse(json.dumps({'success':False}), content_type="application/json")

def sendstatus(request, emailid):
    response = {}
    with open(folderbase+'emaillist.json', 'r+') as fileemaillist:
        emaillist = json.load(fileemaillist)
        response = {
            'sendstatus': emaillist.get(emailid, {}).get('sendstatus'),
            'sent_on': emaillist.get(emailid, {}).get('sent_on'),
            'canceled_on': emaillist.get(emailid, {}).get('canceled_on'),
        }
    return HttpResponse(json.dumps(response), content_type="application/json")

def getdashboardpage(request):
    code = request.GET.get('code', None)
    if code:
        code = int(code)
        flag = 'currentProvince'
    else:
        flag = 'entireAfg'
    forecast = getFloodForecast(request, filterLock=None, flag=flag, code=code)

    floodforecast_tpl = get_template('pages/floodforecast.html')
    # css_embed_tpl = get_template('bare.css')
    renderdata = {}
    # renderdata['css_embed'] = css_embed_tpl.render(Context({}))
    renderdata['body_content'] = floodforecast_tpl.render(Context(forecast))

    sendnotif_dashboard(renderdata)

    return render(request, 'email_dashboard_base.html', renderdata)

def sendnotif_dashboard(emaildata={}):

    def get_login_session(url = settings.SITEURL+'/account/login/'):
        session = requests.session()
        session.get(url)
        login_data = {
            'csrfmiddlewaretoken': session.cookies.get('csrftoken'),
            # 'username': settings.DATABASES['default']['USER'],
            # 'password': settings.DATABASES['default']['PASSWORD'],
            'username': privatedata.login_data['username'],
            'password': privatedata.login_data['password'],
            }
        r = session.post(url, data=login_data)
        return session

    plaintext = get_template('email.txt')
    email_main = get_template('email_dashboard_base.html')
    subject, from_email, to = emaildata['subject'], privatedata, emaildata['email_address']
    d = Context(emaildata)
    text_content = plaintext.render(d)
    html_content = email_main.render(d)
    msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    msg.attach_alternative(html_content, "text/html")

    # get login cookies
    session = session_localhost
    session2 = session_asdc

    # get dashboard pdf
    data_pdf2_str = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"64.64791562475617,31.785625036334896%2067.30992857442693,31.785625036334896%2067.30992857442693,33.82314149783689%2064.64791562475617,33.82314149783689%2064.64791562475617,31.785625036334896","showRiskTable":false,"mapID":"700"}'
    data_pdf2 = json.loads(data_pdf2_str)
    pdf = session.get(settings.SITEURL+'/dashboard/?page=floodforecast&code=12&pdf=true&_checked=')

    # post command to geoserver to create map pdf
    pdf2_url = session2.post('http://asdc.immap.org/geoserver/pdf/create.json', data=data_pdf2_str)

    # command server to combine map and dashboard pdfs
    multiple_url_tpl = Template('{"urls":[null,$dashboard_baseline_pdf_url,null,$dashboard_floodforecast_pdf_url],"fileName":"$filename","mapTitle":"$mapTitle","mapUrl":"$mapUrl"}')
    pdf2_urls = json.loads(pdf2_url.content)
    multiple_url = multiple_url_tpl.substitute(
        mapUrl=pdf2_urls['getURL'],
        mapTitle = urllib.quote('River and flash flood prediction'),
        filename = urllib.quote('iMMAP_AFG_River and flash flood forecast_A4 portrait_map_and_statistics_2017-9-11'),
        dashboard_floodforecast_pdf_url='"?page=floodforecast&pdf=true&date=2017-09-06&_checked=GFMS%20%2B%20GLOFAS"',
        dashboard_baseline_pdf_url='"?page=baseline&pdf=true&date=2017-09-06&_checked=GFMS%20%2B%20GLOFAS"'
        )
    response = session2.post('http://asdc.immap.org/dashboard/multiple', data=multiple_url)

    # get combined pdf
    combined_pdf_name = json.loads(response.content)['filename']
    tpl = Template('http://asdc.immap.org/dashboard/downloadPDFFile?filename=$filename&filenameoutput=$filenameoutput')
    url = tpl.substitute(
        filename = combined_pdf_name,
        filenameoutput = 'iMMAP_AFG_River%20and%20flash%20flood%20forecast_A4%20portrait_map_and_statistics_2017-9-13'
        )
    response = session2.get(url)

    msg.attach('Floodforecast.pdf', pdf.content, 'application/pdf')
    msg.attach('Floodforecast_dashboard.pdf', response.content, 'application/pdf')
    msg.send()

    return html_content

def get_pdf(emaildata={}):

    # plaintext = get_template('email.txt')
    # email_main = get_template('email_dashboard_base.html')
    # subject, from_email, to = emaildata['subject'], privatedata, emaildata['email_address']
    # d = Context(emaildata)
    # text_content = plaintext.render(d)
    # html_content = email_main.render(d)
    # msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
    # msg.attach_alternative(html_content, "text/html")

    global cache
    result = {}
    result['errors'] = []
    # get login cookies
    session = session_localhost
    session2 = session_asdc
    # if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['session.get', session.GET])))
    # if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['session.post', session.POST])))
    if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['session.cookies.get(\'sessionid\')', session.cookies.get('sessionid')])))
    if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['session2.cookies.get(\'sessionid\')', session2.cookies.get('sessionid')])))
    # if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['session2.post', session2.POST])))

    # get dashboard pdf
    area_code_param = ('&code=%s'%(emaildata['area_code'])) if emaildata['area_code'] else ''
    eqcode_param = ('&eq_event=%s'%(emaildata['forecast']['event_code'])) if 'event_code' in emaildata['forecast'] else ''
    url = settings.SITEURL+'/dashboard/?page={0}{1}&pdf=true&_checked=&lang={2}{3}&hideuserinfo'.format(emaildata['dashboardpage'], area_code_param, emaildata['lang'], eqcode_param)
    if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['dashboard pdf url:', (url)])))
    cacheid = 'get:'+url
    if 'cacheid' in debuglist: log.debug(' '.join(map(str, ['cacheid:', cacheid])))
    try:
        pdf = cache[cacheid] = cache.get(cacheid) or session.get(url)
    except Exception as e:
        result['errors'].append('dashboard pdf:'+str(e))
    else:
        if pdf.status_code != 200:
            log.error(' '.join(map(str, ['request server to make dashboard pdf failed on event {eventtype} area {area_scope} {area_name} area code {area_code}'.format(**emaildata)])))
            if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['reason', pdf.reason])))
            if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['response content', pdf.content])))
            result['errors'].append('dashboard pdf')
        else:
            result['dashboard'] = pdf.content

    # post command to geoserver to create map pdf
    # data_pdf2_str = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"64.64791562475617,31.785625036334896%2067.30992857442693,31.785625036334896%2067.30992857442693,33.82314149783689%2064.64791562475617,33.82314149783689%2064.64791562475617,31.785625036334896","showRiskTable":false,"mapID":"700"}'
    # data_pdf2_str = emaildata['createjsondata']
    # data_pdf2_str = r'{"units":"m","srs":"EPSG:900913","layout":"A4 portrait","dpi":90,"outputFilename":"\"iMMAP_AFG_River and flash flood forecast_A4 portrait_map_2017-9-11\"","mapTitle":"River and flash flood prediction","comment":"Gives forecast on river floods and flash floods. River flood predictions are valid for 4 days and updated every 6 hours, whereas the flash floods are valid for 6 hours and updated hourly. \nThe map and statistics are is updated every 6 hours.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_fldzonea_100k_risk_landcover_pop"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:current_flood_forecasted_villages_basin"],"format":"image/png8","styles":["current_flood_forecasted_villages_basin"],"customParams":{"TRANSPARENT":true,"TILED":false}},{"minScaleDenominator":1066.3626590468689,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:glofas_gfms_merge"],"format":"image/png","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":false,"VIEWPARAMS":"year:2017;month:09;day:06;"}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}}],"pages":[{"center":[7344740.0101932,3870141.1300305],"scale":1500000,"bbox":[7196573.0471926,3735203.360155,7492906.9731938,4005078.899906],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Classes of ","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aglofas_gfms_merge&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Population affected by  settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Acurrent_flood_forecasted_villages_basin&style=current_flood_forecasted_villages_basin&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Flood risk zones (100 year interval)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_fldzonea_100k_risk_landcover_pop&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=1500000"]}]}],"selectedBox":"66.0773619378,35.674148966%2068.3770324992,35.674148966%2068.3770324992,37.398901887%2066.0773619378,37.398901887","showRiskTable":false,"mapID":"700"}'
    # log.debug(' '.join(map(str, emaildata.keys())))
    # log.debug(emaildata.keys())
    with open(folderbase+emaildata['createjsonfile'], 'r') as f:
        data_pdf2 = json.loads(f.read())
    # data_pdf2 = json.loads(Template(emaildata['createjsondata']).substitute(**emaildata.get('eq_selected', {})))
    # tpl_data = {
    #     'event_code': emaildata.get('eq_selected', {}).get('event_code', {}),
    #     'userlogo_url': uploadedlogo_baseurl+emaildata['orglogo']
    # }
    # data_pdf2 = json.loads(Template(createjson_str).substitute(**tpl_data))
    # data_pdf2 = json.loads(Template(createjson_str).substitute(**tpl_data))
    # transform projection from srid 4326 to 3857
    bboxlist = map(float, emaildata['bbox'].split(","))
    p = Point(bboxlist[0], bboxlist[1], srid=4326)
    p.transform(3857)
    p2 = Point(bboxlist[2], bboxlist[3], srid=4326)
    p2.transform(3857)
    # data_pdf2['pages'][0]['bbox'] = emaildata['bbox'].split(",")
    data_pdf2['pages'][0]['bbox'] = [p.x, p.y, p2.x, p2.y]
    data_pdf2['pages'][0]['center'] = [(p.x+p2.x)/2, (p.y+p2.y)/2]
    data_pdf2['pages'][0]['scale'] = float('%.2g' % ((bboxlist[2]-bboxlist[0])/latscaleratio)) # 2 sig fig
    for s in scales:
        if s > data_pdf2['pages'][0]['scale']:
            data_pdf2['pages'][0]['scale'] = s
            break
    # log.debug(' '.join(map(str, ['map scale is', data_pdf2['pages'][0]['scale']])))
    # data_pdf2['pages'][0]['scale'] = 8000000
    # data_pdf2['pages'][0]['center'] = [data_pdf2['pages'][0]['bbox'][2]-data_pdf2['pages'][0]['bbox'][0], data_pdf2['pages'][0]['bbox'][1]-data_pdf2['pages'][0]['bbox'][1]]
    # log.debug(' '.join(map(str, ['center', [data_pdf2['pages'][0]['bbox'][2]-data_pdf2['pages'][0]['bbox'][0], data_pdf2['pages'][0]['bbox'][1]-data_pdf2['pages'][0]['bbox'][1]]])))
    if 'userlogo_url' in data_pdf2:
        data_pdf2['userlogo_url'] = uploadedlogo_baseurl+emaildata['orglogo']
    data_pdf2['selectedBox'] = urllib.quote(emaildata['bbox4point'], ',')
    data_pdf2['mapTitle'] = MyFormatter().format(_(emaildata['mappdf']['title_tpl']), **{
        'eventtype': _(emaildata.get('eventtype')),
        'area_scope': _(emaildata.get('area_scope')),
        'area_name': _(emaildata.get('area_name'))
    })
    event_code = emaildata.get('eq_selected', {}).get('event_code', {})
    for l in data_pdf2['layers']:
        if 'geonode:flash_flood_prediction' in l['layers']:
            year, month, day = emaildata['current_date'].split('-')
            l['customParams']['VIEWPARAMS'] = 'year:{0};month:{1};day:{2};'.format(year, month, day)
        if 'geonode:earthquake_shakemap' in l['layers']:
            l['customParams']['CQL_FILTER'] = "event_code='{0}'".format(event_code)
        if 'geonode:earthquake_events' in l['layers']:
            l['customParams']['CQL_FILTER'] = "event_code in ('{0}')".format(event_code)
    if emaildata.get('mappdf', {}).get('title_add_tpl'):
        data_pdf2['mapTitle'] += ' '+emaildata['mappdf']['title_add_tpl'].format(**emaildata['eq_selected'])
    # log.debug(' '.join(map(str, [json.dumps(data_pdf2)])))
    # pprint.pprint(data_pdf2)
    # pdf2_url = session2.post('http://asdc.immap.org/geoserver/pdf/create.json', data=data_pdf2_str)
    url = 'http://asdc.immap.org/geoserver/pdf/create.json'
    cacheid = 'get:'+url+':'+emaildata['emailid']

    # for debugging 
    with open(foldertmp+emaildata['emailid']+'__create.json', 'w') as f:
        f.write(json.dumps(data_pdf2))

    if 'cacheid' in debuglist: log.debug(' '.join(map(str, ['cacheid:', cacheid])))
    try:
        pdf2_url = cache[cacheid] = cache.get(cacheid) or session2.post(url, data=json.dumps(data_pdf2))
    except Exception as e:
        result['errors'].append('get map pdf url:'+str(e))
    else:
        if pdf2_url.status_code != 200:
            log.error(' '.join(map(str, ['get url of map pdf failed on event {eventtype} area {area_scope} {area_name} area code {area_code}'.format(**emaildata)])))
            if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['reason', pdf2_url.reason])))
            if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['response content', pdf2_url.content])))
            result['errors'].append('get map pdf url')
        else:
            # pdf2_url_content = pdf2_url.content

            # command server to combine map and dashboard pdfs
            multiple_url_tpl = Template('{"urls":[null,$dashboard_baseline_pdf_url,null,$dashboard_floodforecast_pdf_url],"fileName":"$filename","mapTitle":"$mapTitle","mapUrl":"$mapUrl"}')
            if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['pdf2_url', pdf2_url])))
            if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['pdf2_url.content', pdf2_url.content])))
            pdf2_urls = json.loads(pdf2_url.content)
            multiple_url = multiple_url_tpl.substitute(
                mapUrl=pdf2_urls['getURL'],
                mapTitle = urllib.quote('placeholder_text_for_mapTitle'),
                filename = urllib.quote('placeholder_text_for_filename'),
                # dashboard_floodforecast_pdf_url='"?page=floodforecast&pdf=true&date=2017-09-06&_checked=GFMS%20%2B%20GLOFAS"',
                dashboard_floodforecast_pdf_url='null',
                # dashboard_baseline_pdf_url='"?page=baseline&pdf=true&date=2017-09-06&_checked=GFMS%20%2B%20GLOFAS"'
                dashboard_baseline_pdf_url='null'
                )
            url = 'http://asdc.immap.org/dashboard/multiple'
            cacheid = 'get:'+url+':'+emaildata['emailid']
            if 'cacheid' in debuglist: log.debug(' '.join(map(str, ['cacheid:', cacheid])))
            try:
                response = cache[cacheid] = cache.get(cacheid) or session2.post(url, data=multiple_url)
            except Exception as e:
                result['errors'].append('map pdf multiple:'+str(e))
            else:
                if response.status_code != 200:
                    log.error(' '.join(map(str, ['request server to make multiple dashboard pdf failed on event {eventtype} area {area_scope} {area_name} area code {area_code}'.format(**emaildata)])))
                    if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['reason', response.reason])))
                    if 'get_pdf' in debuglist: log.debug(' '.join(map(str, ['response content', response.content])))
                    result['errors'].append('map pdf multiple')
                else:

                    # get combined pdf
                    combined_pdf_name = json.loads(response.content)['filename']
                    tpl = Template('http://asdc.immap.org/dashboard/downloadPDFFile?filename=$filename&filenameoutput=$filenameoutput')
                    url = tpl.substitute(
                        filename = combined_pdf_name,
                        filenameoutput = 'placeholder_text_for_filenameoutput'
                        )
                    cacheid = 'get:'+url+':'+emaildata['emailid']
                    if 'cacheid' in debuglist: log.debug(' '.join(map(str, ['cacheid:', cacheid])))
                    try:
                        response = cache[cacheid] = cache.get(cacheid) or session2.get(url)
                    except Exception as e:
                        result['errors'].append('download combined map pdf:'+str(e))
                    else:
                        if pdf2_url.status_code == 200:
                            result['map'] = response.content;
                        else:
                            result['errors'].append('download combined map pdf')

    # msg.attach('Floodforecast.pdf', pdf.content, 'application/pdf')
    # msg.attach('Floodforecast_dashboard.pdf', response.content, 'application/pdf')
    # msg.send()

    # return (pdf.content, response.content)
    return result

# def sendnotif(emaildata={}):
#     # send_mail(
#     #     'Forecast Notification',
#     #     'Dear User, \n\nWe like to inform you that on the netxt 6 days, there is low probability of river flood in Afghanistan.\n\nASDC',
#     #     'admin@example.com',
#     #     ['dodiws@gmail.com'],
#     #     fail_silently=False,
#     # )
#     plaintext = get_template('email.txt')
#     email_main = get_template('email_main.html')
#     email_forecast_item = get_template('email_forecast_item.html')
#     email_forecast_item_tnail = get_template('email_forecast_item_tnail.html')
#     email_forecast_item_tnail_right = get_template('email_forecast_item_tnail_right.html')
#     email_container_2col = get_template('email_container_2col.html')
#     email_forecast_item_2col = get_template('email_forecast_item_2col.html')
#     email_forecast_item_3col = get_template('email_forecast_item_3col.html')
#
#     emaildata['forecast_html'] = ''
#     emaildata['forecast_items_tnail'] = ''
#     emaildata['forecast_items_tnail_right'] = ''
#     emaildata['content_2col'] = ''
#     emaildata['forecast_items_3col'] = ''
#     _2col_pair = ''
#     _3col_pair = ''
#     n = 0
#     for i in emaildata['forecast']:
#         n += 1
#         if 'sendnotif' in debuglist: log.debug(' '.join(map(str, ["i['area_name']", i['area_name']])))
#         emaildata['forecast_html'] += email_forecast_item.render(Context(i))
#         emaildata['forecast_items_tnail'] += email_forecast_item_tnail.render(Context(i))
#         emaildata['forecast_items_tnail_right'] += email_forecast_item_tnail_right.render(Context(i))
#         _2col_pair += email_forecast_item_2col.render(Context(i))
#         _3col_pair += email_forecast_item_3col.render(Context(i))
#         if n % 2 == 0:
#             emaildata['content_2col'] += '<tr>'+_2col_pair+'</tr>'
#             _2col_pair = ''
#         if n % 3 == 0:
#             emaildata['forecast_items_3col'] += '<tr>'+_3col_pair+'</tr>'
#             _3col_pair = ''
#
#     if (n % 2 != 0) and (emaildata['content_2col'] != ''):
#         empty_td = '<td class="stack-column-center"></td>'
#         emaildata['content_2col'] += '<tr>'+_2col_pair+empty_td+'</tr>'
#     if (n % 3 != 0) and (emaildata['forecast_items_3col'] != ''):
#         empty_tds = empty_td = '<td width="33.33%" class="stack-column-center"></td>'
#         if (n % 3 != 2):
#             empty_tds += empty_td
#         emaildata['forecast_items_3col'] += '<tr>'+_3col_pair+empty_tds+'</tr>'
#
#     subject, from_email, to = 'ASDC Forecast Notification', privatedata, 'dodiws@gmail.com'
#     d = Context(emaildata)
#     text_content = plaintext.render(d)
#     html_content = email_main.render(d)
#     msg = EmailMultiAlternatives(subject, text_content, from_email, [to])
#     msg.attach_alternative(html_content, "text/html")
#     msg.send()
#
#     return html_content

def sendnotif_adminapproval_orig(emaillistitem, approvaldata):
    # emaildata = emaillistitem['emaildata']
    # subject, from_email, to = approvaldata['approval_title'], approvaldata['email_from'], approvaldata['email_admin']
    # log.debug(' '.join(map(str, ['subject, from_email, to', subject, from_email, to])))
    # d = Context(emaildata)
    msg = EmailMultiAlternatives(subject=approvaldata['approval_title'], body=approvaldata['email_approval'], from_email=approvaldata['email_from'], to=approvaldata['email_admin'])
    msg.attach_alternative(approvaldata['email_approval'], "text/html")
    for lang in emaillistitem['emaildata']:
        # emaildata = emaillistitem['emaildata'][lang]
        # files_name = emaildata['files']
        # files_content = emaildata['files_content']
        # text_content = emaildata['filedata']['plaintext']
        # html_content = email_main.render(d)
        # if 'timer' in debuglist: start_time = time.time()
        # if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start get_pdf at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
        # pdfs = get_pdf(emaildata)
        # if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end get_pdf, %s seconds" % (time.time() - start_time))])))
        # msg.attach(files_name[1], files_content[1], 'text/html')
        # msg.attach(files_name[2], files_content[2], 'application/pdf')
        # msg.attach(files_name[3], files_content[3], 'application/pdf')
        for key, item in emaillistitem['emaildata'][lang]['files_dict'].iteritems():
            msg.attach(item['name'], item['content'], item['type'])
    if 'timer' in debuglist: start_time = time.time()
    if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start msg.send() at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
    msg.send()
    if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end msg.send(), %s seconds" % (time.time() - start_time))])))

    return

def sendnotif_adminapproval(emaillistitem, approvaldata, return_message = False):
    # Load the image you want to send as bytes
    imgs = {}
    for fname in cid_attachment_imgs:
        imgs[fname] = open(img_folder+fname, 'rb').read()

    first_lang = emaillistitem['emaildata'].keys()[0]
    imgs['map_wforecast.png'] = emaillistitem['emaildata'][first_lang]['map_image_bindata']['600x392']

    # Create a "related" message container that will hold the HTML
    # message and the image. These are "related" (not "alternative")
    # because they are different, unique parts of the HTML message,
    # not alternative (html vs. plain text) views of the same content.
    html_part = MIMEMultipart(_subtype='related')

    # Create the body with HTML. Note that the image, since it is inline, is
    # referenced with the URL cid:myimage... you should take care to make
    # "myimage" unique
    # with open(foldertmp+'email_approval.debug.html', 'w') as f:
    #     f.write(approvaldata['email_approval'].encode('utf-8'))
    body = MIMEText(approvaldata['email_approval'].encode('utf-8'), _subtype='html')
    html_part.attach(body)

    # Now create the MIME container for the image
    for fname, img_data in imgs.iteritems():
        img = MIMEImage(img_data, 'png')
        img.add_header('Content-Id', '<%s>' % fname)  # angle brackets are important
        img.add_header("Content-Disposition", "inline", filename=fname) # David Hess recommended this edit
        html_part.attach(img)

    # Configure and send an EmailMessage
    # Note we are passing None for the body (the 2nd parameter). You could pass plain text
    # to create an alternative part for this message
    msg = EmailMessage(subject=approvaldata['approval_title'], body=None, from_email=approvaldata['email_from'], to=approvaldata['email_admin'])

    # attachments
    for lang in emaillistitem['emaildata']:
        allowed = ['email_html_dataurl.html', 'dashboard.pdf', 'map.pdf']
        files = [f for i, f in emaillistitem['emaildata'][lang]['files_dict'].iteritems() if f['name'] in allowed]
        for f in files:
            msg.attach('%s_%s'%(lang, f['name']), f['content'], f['type'])

    msg.attach(html_part) # Attach the raw MIMEBase descendant. This is a public method on EmailMessage

    if return_message:
        return msg

    if 'timer' in debuglist: start_time = time.time()
    if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start send() at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
    msg.send()
    if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end send(), %s seconds" % (time.time() - start_time))])))

    return

def sendnotif_user_orig(emaillistitem={}):
    for lang in emaillistitem['emaildata']:
        emaildata = emaillistitem['emaildata'][lang]
        # subject, from_email, bcc = emaildata['subject'], emaildata['email_from'], emaildata['recipients']
        # log.debug(' '.join(map(str, ['subject, from_email, bcc', subject, from_email, bcc])))
        # d = Context(emaildata)
        files_name = emaildata['files']
        # files_content = emaillistitem['files_content']
        files = {}
        ext_to_mime = {'.txt':'text/text', '.html':'text/html', '.pdf':'application/pdf'}
        for fname in files_name:
            with open(foldertmp+fname, 'r') as f:
                name_short = fname.split(key_separator)[-1]
                files[name_short] = {'name':fname, 'content':f.read(), 'type': ext_to_mime[os.path.splitext(fname)[1]]}
        # files_content['email_html'] = open(foldertmp+files_name[0], 'r').read()
        # files_content['email_text'] = open(foldertmp+files_name[1], 'r').read()
        # files_content['pdf1'] = open(foldertmp+files_name[2], 'r').read()
        # files_content['pdf2'] = open(foldertmp+files_name[3], 'r').read()
        # text_content = emaildata['filedata']['plaintext']
        # html_content = email_main.render(d)
        # files = emaillistitem['emaildata'][lang]['files_dict']
        msg = EmailMultiAlternatives(subject=emaildata['subject'], body=files.get('email_text.txt',{}).get('content', ''), from_email=emaildata['email_from'], bcc=emaildata['recipients'])
        # f = files.get('email_html.html',{})
        # if (f): msg.attach_alternative(f.get('name', ''), f.get('content', ''))
        for i in [n for n in files if n in ['email_html_cid.html']][0:1]:
            msg.attach_alternative(files[i]['content'], files[i]['type'])
        # if 'timer' in debuglist: start_time = time.time()
        # if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start get_pdf at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
        # pdfs = get_pdf(emaildata)
        # if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end get_pdf, %s seconds" % (time.time() - start_time))])))
        # for n in [i for i in files if i.split(key_separator)[-1] in ['dashboard.pdf', 'map.pdf']]:
        for i in [n for n in files if n in ['dashboard.pdf', 'map.pdf']]:
            msg.attach(files[i]['name'], files[i]['content'], files[i]['type'])
        if 'timer' in debuglist: start_time = time.time()
        if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start msg.send() at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
        msg.send()
        if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end msg.send(), %s seconds" % (time.time() - start_time))])))
        # for f in files_content:
        #     files_content[f].close()

    return {'recipients':emaildata['recipients']}
    # return HttpResponse(files_content['email_html'], content_type="text/html")
    # return HttpResponse(json.dumps(emaildata['recipients']), content_type="application/json")
    # return

def sendnotif_user(emaillistitem={}, return_message = False):

    recipients =[]
    msgs = []

    # prepare images for content id as bytes
    imgs = {}
    for fname in cid_attachment_imgs:
        imgs[fname] = open(img_folder+fname, 'rb').read()

    # first_lang = emaillistitem['emaildata'].keys()[0]
    # imgs['map_wforecast.png'] = emaillistitem['emaildata'][first_lang]['map_image_bindata']['600x392']
    # with open(foldertmp+fname, 'r') as f:
    #     imgs['map_wforecast.png'] = f.read()

    for lang in emaillistitem['emaildata']:
        emaildata = emaillistitem['emaildata'][lang]

        # main mail object
        msg = EmailMessage(
            subject=emaildata['subject'],
            # body=body_plaintext,
            from_email=emaildata['email_from'],
            bcc=emaildata['recipients'])

        # attachment container for main body and content id images
        html_part = MIMEMultipart(_subtype='related')

        # main body and pdf attachments
        ext_to_mime = {'.txt':'text/text', '.html':'text/html', '.pdf':'application/pdf'}
        # files = {}
        filenames = emaildata['files']
        for name_short, fname in filenames.iteritems():
            # name_short = fname.split(key_separator)[-1]
            if name_short in ['map_wforecast.png', 'email_text.txt', 'email_html_cid.html', 'dashboard.pdf', 'map.pdf']:
                with open(foldertmp+fname, 'r') as f:
                    if name_short in ['email_html_cid.html']:
                        # main body
                        body = MIMEText(f.read(), _subtype='html')
                        html_part.attach(body)
                    elif name_short in ['email_text.txt']:
                        msg.body = f.read()
                    elif name_short in ['map_wforecast.png']:
                        imgs['map_wforecast.png'] = f.read()
                    else:
                        # attachments
                        # files[name_short] = {'name':fname, 'content':f.read(), 'type': ext_to_mime[os.path.splitext(fname)[1]]}
                        msg.attach(fname, f.read(), ext_to_mime[os.path.splitext(fname)[1]])

        # Now create the MIME container for the image
        for fname, img_data in imgs.iteritems():
            img = MIMEImage(img_data, 'png')
            img.add_header('Content-Id', '<%s>' % fname)  # angle brackets are important
            img.add_header("Content-Disposition", "inline", filename=fname) # David Hess recommended this edit
            html_part.attach(img)

        msg.attach(html_part) # Attach the raw MIMEBase descendant. This is a public method on EmailMessage

        if return_message:
            msgs.append(msg)
        else:
            if 'timer' in debuglist: start_time = time.time()
            if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start msg.send() at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
            msg.send()
            if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end msg.send(), %s seconds" % (time.time() - start_time))])))

            recipients.append({lang:emaildata['recipients']})

    if return_message:
        return msgs

    return {'recipients': recipients}

def make_mail_message_content(emaildata):
    ctx = Context(emaildata)

    # render subtemplates
    if emaildata.get('short_dashboard_table_tpl'):
        emaildata['short_dashboard_table'] = get_template(emaildata.get('short_dashboard_table_tpl')).render(ctx)
    emaildata['email_body_text_event_specific'] = get_template(emaildata['text_body_event_tpl']).render(ctx)
    emaildata['text_body'] = get_template(emaildata['text_body_tpl']).render(ctx)

    # main html template
    email_main = get_template('email_simple_hybrid.html')
    # plaintext = get_template('email.txt')
    # email_main_cid = get_template('email_simple_hybrid_inlineimg.html')
    # email_forecast_item = get_template('email_forecast_item.html')

    # emaildata['askapproval'] = False

    # emaildata['forecast_html'] = ''
    # for i in emaildata['forecast']:
    #     emaildata['forecast_html'] += email_forecast_item.render(Context(i))
    
    # redo context, to account for new data 
    ctx_cid = Context(dict(emaildata, **{'imgsrc_contentid': True}))
    ctx_dataurl = Context(dict(emaildata, **{'imgsrc_dataimage': True}))

    # text_content = plaintext.render(d)
    text_content = strip_tags(emaildata['text_body'])
    html_content_cid = email_main.render(ctx_cid)
    html_content_dataurl = email_main.render(ctx_dataurl)
    
    return text_content, html_content_cid, html_content_dataurl

def save_email_temp_files_other_language(emaildata):
    '''
    create email temp files of other language
    to enable view email in other language option
    '''

    prev_lang = get_language()

    for lang in langs:
        if lang != emaildata['lang']:
            activate(lang)

            text_content, html_content_cid, html_content_dataurl = make_mail_message_content(emaildata)

            fnames = ['email_html_dataurl.html']
            fcontents = [html_content_dataurl]
            ftypes = ['text/html']
            fname_prefix = emaildata['emailid']+key_separator+lang+key_separator

            write_files(fnames, fcontents, ftypes, fname_prefix, foldertmp)

    activate(prev_lang)
    return

def save_temp_files(emaildata):
    # global emaillist
    # emaildata = emaillistadd[emailid]['emaildata']
    # emailid = emaildata['emailid']
    # lang = emaildata['lang']

    text_content, html_content_cid, html_content_dataurl = make_mail_message_content(emaildata)

    mapimg_content = emaildata['map_image_bindata']['600x392']

    if 'timer' in debuglist: start_time = time.time()
    if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start get_pdf at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
    pdfs = get_pdf(emaildata)
    if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end get_pdf, %s seconds" % (time.time() - start_time))])))

    if 'timer' in debuglist: start_time = time.time()
    if 'timer' in debuglist: log.debug(' '.join(map(str, ['timer start save temp file at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')])))
    # save to file, waiting approval before send
    # emailid = script_start_time+key_separator+emaildata['eventtype'].lower().strip().replace(" ", "_")+key_separator+(emaildata['area_scope']+sub_key_separator+emaildata['area_name']).lower().strip().replace(" ", "_")
    # emailid = emaildata['emailid']
    # saved_fnames = []
    # for val in ['email_text.txt', 'email_html.html', 'dashboard.pdf', 'map.pdf']:
    #     saved_fnames.append(emaildata['emailid']+key_separator+emaildata['lang']+key_separator+val)
    # saved_fnames.append(emailid+'-email_text.txt')
    # saved_fnames.append(emailid+'-email_html.html')
    # saved_fnames.append(emailid+'-dashboard.pdf')
    # saved_fnames.append(emailid+'-map_dashboard.pdf')
    fnames = ['map_wforecast.png', 'email_text.txt', 'email_html_cid.html', 'email_html_dataurl.html', 'dashboard.pdf', 'map.pdf']
    fcontents = [mapimg_content, text_content, html_content_cid, html_content_dataurl, pdfs.get('dashboard'), pdfs.get('map')]
    ftypes = ['image/png', 'text/text', 'text/html', 'text/html', 'application/pdf', 'application/pdf']
    fname_prefix = emaildata['emailid']+key_separator+emaildata['lang']+key_separator

    # fileemail_text = open(foldertmp+saved_fnames[0], 'w')
    # fileemail_html = open(foldertmp+saved_fnames[1], 'w')
    # filepdf1 = open(foldertmp+saved_fnames[2], 'w')
    # filepdf2 = open(foldertmp+saved_fnames[3], 'w')
    # emaillist = json.load(fileemaillist)
    # emaillistadd[emailid] = {}
    emaildataadd = {}

    emaildataadd['files'], emaildataadd['files_content'], emaildataadd['files_dict'] = write_files(fnames, fcontents, ftypes, fname_prefix, foldertmp)

    emaildataadd['errors'] = pdfs.get('errors', [])
    # emaildataadd['files'] = saved_fnames
    # emaildataadd['files_dict'] = saved_fdicts
    # emaildataadd['files_content'] = saved_fcontents
    # emaillistadd[emailid]['recipients'] = []
    # emaillistadd[emailid]['recipients'].append(emaildata['email_to'])
    # fileemaillist.seek(0)
    # json.dump(emaillist, fileemaillist)
    # fileemaillist.truncate()
    # fileemail_text.write(text_content)
    # fileemail_html.write(html_content)
    # filepdf1.write(pdfs[0])
    # filepdf2.write(pdfs[1])
    # fileemaillist.close()
    # fileemail_text.close()
    # fileemail_html.close()
    # filepdf1.close()
    # filepdf2.close()
    if 'timer' in debuglist: log.debug(' '.join(map(str, [("timer end save temp file, %s seconds" % (time.time() - start_time))])))

    return emaildataadd

def write_files(fnames, fcontents, ftypes, fname_prefix, location):
    saved_fnames = []
    saved_fcontents = []
    saved_fdicts = {}
    for idx, val in enumerate(fcontents):
        if val:
            fullname = fname_prefix+fnames[idx]
            with open(location+fullname, 'w') as f:

                if isinstance(val, unicode):
                    val = val.encode('utf-8')
                f.write(val)

                saved_fnames.append(fullname)
                saved_fcontents.append(val)
                saved_fdicts[fnames[idx]] = {'name':fnames[idx], 'fullname':fullname, 'content':fcontents[idx], 'type':ftypes[idx]}
    # # fileemaillist = open(folderbase+'emaillist.txt', 'r+')
    # # log.debug(' '.join(map(str, ['locale.getdefaultlocale', locale.getdefaultlocale()])))
    # # log.debug(' '.join(map(str, ['get_language()', get_language()])))
    # for idx, val in enumerate(saved_fcontents):
    #     # log.debug(' '.join(map(str, ['idx', idx])))
    #     # if len(val) > 67943:
    #     #     log.debug(' '.join(map(str, ['val[67941:67943]', val[67941:67943]])))
    #     # log.debug(' '.join(map(str, ['unicode(val[28:29])', unicode(val[28:29])])))
    #     # log.debug(' '.join(map(str, ["unicode(val[28:29]).encode('utf-8')", unicode(val[28:29]).encode('utf-8')])))
    #     # with io.open(foldertmp+saved_fnames[idx], 'w', encoding="utf-8") as f:
    #     with open(location+saved_fnames[idx], 'w') as f:
    #         # f.write(unicode(val, 'utf-8'))
    #         # f.write(unicode(val).encode('utf-8'))
    #         # log.debug(' '.join(map(str, [saved_fnames[idx]])))
    #         # log.debug(' '.join(map(str, ['type(val)', type(val)])))
    #         # log.debug(' '.join(map(str, ['isinstance(val, unicode)', isinstance(val, unicode)])))
    #         # log.debug(' '.join(map(str, ['isinstance(val, str)', isinstance(val, str)])))
    #         # always output in byte string, use unicode only for internal process
    #         if isinstance(val, unicode):
    #             val = val.encode('utf-8')
    #         f.write(val)

    return saved_fnames, saved_fcontents, saved_fdicts

def getmapimage(emaildata):
    data = {}

    # if emaildata['area_scope'] == 'province':
        # bbox = provinces[emaildata['area_code']]['bbox']
        # view_url = '{0}/dashboard/?page={1}&code={2}'.format(settings.SITEURL, emaildata['dashboardpage'], emaildata['area_code'])
    # else:
        # entire Afghanistan
        # bbox = '60.4720890240001,29.3771715570001,74.889451148,38.4907374680001'
    # view_url = '{0}/dashboard/?page={1}&code={2}'.format(settings.SITEURL, emaildata['dashboardpage'], emaildata['area_code'])
    bbox = emaildata['bbox']

    # url_getmap = 'http://asdc.immap.org/getOverviewMaps/getWMS?service=WMS&version=1.1.0&request=GetMap&layers=geonode:glofas_gfms_merge,afg_admbnda_adm1&styles=,snapshot_admin1&VIEWPARAMS=year:2017;month:8;day:30;&bbox=60.4720890240001,29.3771715570001,74.889451148,38.4907374680001&width=768&height=485&srs=EPSG:4326&format=image%2Fpng&_rdm=202'
    url_getmap_tpl = emaildata['url_getmap_tpl']
    tpl_data = {'year': time.strftime("%Y"), 'month': time.strftime("%m"), 'day': time.strftime("%d"), 'bbox': bbox, 'width': '600', 'height': '392', 'layers': urllib.quote(emaildata['maplayers']), 'eqcode': emaildata.get('eq_selected', {}).get('event_code')}
    url_getmap = {}
    url_getmap['600x392'] = url_getmap_tpl.format(**dict(tpl_data, **{'width': '600', 'height': '392'}))
    url_getmap['270x270'] = url_getmap_tpl.format(**dict(tpl_data, **{'width': '270', 'height': '176'}))
    url_getmap['170'] = url_getmap_tpl.format(**dict(tpl_data, **{'width': '170', 'height': '111'}))
    bindata = {}
    base64data = {}
    for key, url in url_getmap.iteritems():
        if 'getmapimage' in debuglist: log.debug(' '.join(map(str, [url])))
        cacheid = 'url:'+url
        log.debug(' '.join(map(str, ['map image url:', url])))
        # if cacheid not in cache:
        #     response = urllib2.urlopen(url)
        #     imagedata = response.read()
        #     base64data[key] = cache.setdefault(cacheid, base64.b64encode(imagedata))
        # else:
        #     base64data[key] = cache[cacheid]
        # base64data[key] = cache[cacheid] = base64.b64encode(urllib2.urlopen(url).read()) if cacheid not in cache else cache[cacheid]
        bindata[key] = cache[cacheid] = cache.get(cacheid) or urllib2.urlopen(url).read()
        base64data[key] = base64.b64encode(bindata[key])

    # for group in notifGroups:
    #     log.debug(' '.join(map(str, ['group', group])))
    #     if notifEntry[2] == group[0]:
    #         currentGroup = group
    #         data['type'] = currentGroup[1]
    #         data['prob_level'] = currentGroup[3]
    #         break

    # propose to remove
    data['area_name'] = emaildata['area_name'] 
    data['area_scope'] = emaildata['area_scope']

    data['map_image_bindata'] = bindata
    data['map_image_base64'] = base64data

    return data

def pushnotif_settings(request):
    def make_areaevent_ref():
        subscriptions_named = [dict(zip(subscriptions_keys, s)) for s in subscriptions]
        areaevent_ref = []
        for arn in area_ref_named:
            eventtypedata_subsid = []
            for key, etd in eventtypedata.items():
                subs_id = subsid_prefix+key_separator+request.user.username+key_separator+etd['eventtypeid']+key_separator+arn['area_scope']+sub_key_separator+str(arn['area_code'])
                etd_subsid = {x: etd[x] for x in etd if x in ['eventtypeid', 'eventtype']}
                selected = any(((s['username'] == request.user.username) and (s['eventtypeid'] == etd['eventtypeid']) and (s['area_scope'] == arn['area_scope']) and (s['area_code'] == arn['area_code'])) for s in subscriptions_named)
                etd_subsid.update({'subs_id': subs_id, 'selected':selected})
                eventtypedata_subsid.append(etd_subsid)
            areaevent_ref.append(dict(arn, **{'eventtypedata':eventtypedata_subsid}))
        return areaevent_ref

    def make_eventtypedata_wsubsid():
        eventtypedata_wsubsid = []
        for key, etd in eventtypedata.items():
            etd_wsubsid = {x: etd[x] for x in etd if x in ['eventtypeid', 'eventtype']}
            subs_id = subsid_prefix+key_separator+request.user.username+key_separator+etd['eventtypeid']+key_separator+'all_area'
            etd_wsubsid.update({'subs_id': subs_id})
            eventtypedata_wsubsid.append(etd_wsubsid)
        return eventtypedata_wsubsid

    def get_user_setting(request, property):
        with open(folderbase+'usersettings.csv', 'r+') as f:
            settings = csv.reader(f, dialect='sqlquote')

            # make setting list for current user only
            settings_current_user = [value for value in settings if (value[0] == request.user.username) and (value[1] == property)]

            if (settings_current_user):
                usersetting = dict(zip(usersettings_keys, settings_current_user[0]))
                return usersetting

            return

    global session_localhost, session_asdc, emaillist

    init_data(request)
    model_values = {item: True for item in subscriptions_ids_user}
    if 'pushnotif_settings' in debuglist: log.debug(' '.join(map(str, ['model_values'])))
    if 'pushnotif_settings' in debuglist: pprint(model_values)
    usersettings_language = get_user_setting(request, 'language')
    if (usersettings_language):
        model_values['notif_language'] = usersettings_language['value']

    response = {}
    response['area_ref'] = [dict(zip(area_ref_keys, ar)) for ar in area_ref]
    response['areaevent_ref'] = make_areaevent_ref()
    response['eventtypedata'] = eventtypedata
    response['eventtypedata_wsubsid'] = make_eventtypedata_wsubsid()
    if 'pushnotif_settings' in debuglist: log.debug(' '.join(map(str, ['response[\'eventtypedata_wsubsid\']'])))
    if 'pushnotif_settings' in debuglist: pprint(response['eventtypedata_wsubsid'])
    response['subscriptions'] = subscriptions
    response['subscriptions_ids'] = subscriptions_ids
    response['model_values'] = json.dumps(model_values)
    response['languages'] = langs_dict
    response['key_separator'] = key_separator
    response['sub_key_separator'] = sub_key_separator
    response['subsid_prefix'] = subsid_prefix
    response['event_col_width'] = 100/(len(eventtypedata.keys())+1)
    response['eventtypenames'] = json.dumps({key:item['eventtype'] for key, item in eventtypedata.iteritems()})

    return render(request, 'pushnotif_settings.html', response)


def pushnotif_savesettings(request):
    save_subscriptions_success = save_usersettings_success = False
    with open(folderbase+'subscriptions.csv', 'r+') as f:
        subs = csv.reader(f, dialect='sqlquote')

        # make subscription list excluding current user
        subs_excl_current_user = [value for value in subs if value[0] != request.user.username]

        # make subscription list for current user only from POST input
        subs_current_user = []
        gen_subs = (x for x in request.POST if request.POST.get(x) == 'true' and x.split(key_separator,1)[0] == subsid_prefix)
        for keystr in gen_subs:
            keys = keystr.split(key_separator)
            area = keys[3].split(sub_key_separator)
            subs_current_user.append([keys[1], keys[2], area[0], int(area[1])])

        # combine list, write to file
        subs_new = subs_excl_current_user + subs_current_user
        f.seek(0)
        csv.writer(f, dialect='sqlquote').writerows(subs_new)
        f.truncate()
        save_subscriptions_success = True

    with open(folderbase+'usersettings.csv', 'r+') as f:
        settings = csv.reader(f, dialect='sqlquote')

        # make setting list excluding current user
        settings_excl_current_user = [value for value in settings if value[0] != request.user.username]

        # make setting list for current user only from POST input
        settings_current_user = [[request.user.username, 'language', request.POST.get('notif_language', '')]]

        # combine list, write to file
        settings_new = settings_excl_current_user + settings_current_user
        f.seek(0)
        csv.writer(f, dialect='sqlquote').writerows(settings_new)
        f.truncate()
        save_usersettings_success = True
    response = {}
    response['success'] = save_subscriptions_success and save_usersettings_success
    response['input'] = request.POST
    response['new_subscription'] = subs_current_user
    response['new_setting'] = settings_current_user
    return HttpResponse(json.dumps(response), mimetype="application/json")

def pushnotif_report(request):
    init_data(request)
    response = {}
    response['key_separator'] = key_separator
    response['sub_key_separator'] = sub_key_separator
    response['eventtypenames'] = json.dumps({key:item['eventtype'] for key, item in eventtypedata.iteritems()})
    response['emaillist_json_url'] = '/pushnotif/emaillist.json'
    response['emaillist_json_max_megabyte'] = emaillist_json_max_byte/(1024*1024)

    return render(request, 'pushnotif_report_notifications.html', response)

def pushnotif_report_subscriptions(request):
    init_data(request)
    response = {}
    response['area_ref_dict'] = json.dumps(area_ref_dict)
    response['key_separator'] = key_separator
    response['sub_key_separator'] = sub_key_separator
    response['eventtypenames'] = json.dumps({key:item['eventtype'] for key, item in eventtypedata.iteritems()})
    response['subs_csv_url'] = '/pushnotif/subscriptions.csv'
    with open(folderbase+'subscriptions.csv', 'r') as f:
        subs = csv.reader(f, dialect='sqlquote')
        response['subscriptions_list'] = json.dumps(list(subs))

    return render(request, 'pushnotif_report_subscriptions.html', response)

def loadjson(request, json_file):
    # open, generate, fetch the json file
    # for e.g.:
    with open(folderbase+json_file+'.json', 'r') as f:
        json_content = f.read()
        return HttpResponse(
            json_content,
            content_type='application/json',
            status=200
    )

def loadcsv(request, csv_file):
    # open, generate, fetch the csv file
    # for e.g.:
    with open(folderbase+csv_file+'.csv', 'r') as f:
        csv_content = f.read()
        return HttpResponse(
            csv_content,
            content_type='text/csv',
            status=200
    )

def reset_subscriptions(only_newuser = False):
    '''
    reset subscriptions.csv for all or new user (depends on only_newuser flag)
    using subscriptions_base.csv as base
    '''

    # get distinct subscriptions users
    subs_users = []
    with open(folderbase+'subscriptions.csv', 'r+') as f:
        for r in csv.reader(f, dialect='sqlquote'):
            if r[0] not in subs_users:
                subs_users.append(r[0])

    '''
    definition of new user:
    find the max id of user with subscriptions, all users after that id is considered new user
    '''
    if only_newuser:
        # get latest id of user with subs
        latest_user_wsubs = get_user_model().objects.all().filter(username__in=subs_users).order_by('-pk')[:1]
        latest_userid_wsubs = latest_user_wsubs[0].id

    with open(folderbase+'subscriptions_base.csv', 'r+') as f:
        subs_base = list(csv.reader(f, dialect='sqlquote'))

    # print 'type(subs_base)', type(subs_base)
    new_subs = []
    users = get_user_model().objects.all()
    if only_newuser:
        users = users.filter(id__gt=latest_userid_wsubs)
    for u in users:
        for sb in subs_base:
            new_subs.append([u.username] + sb)
    log.info('new user: '+str(len(users)))

    with open(folderbase+'subscriptions.csv', 'w+') as f:
        csv.writer(f, dialect='sqlquote').writerows(new_subs)

    return

if from_cli and len(sys.argv) > 1:

    # only allowed parameters
    # if sys.argv[1] in ['triggercheck']:

    if sys.argv[1] == 'triggercheck':
        triggercheck(HttpRequest())
    elif sys.argv[1] in ['resetsubs', 'reset_subscriptions']:
        reset_subscriptions()
    elif sys.argv[1] in ['setsubsnewuser']:
        reset_subscriptions(only_newuser = True)
    # elif sys.argv[1] == 'log_test':
    #     log_test()
    elif sys.argv[1] == 'init_subscriptions':
        init_data(HttpRequest())

        # call function dynamically, sys.argv[1] = function name
        # globals()[sys.argv[1]]()

def hello(request):
    return HttpResponse(
        json.dumps({'success': True}),
        mimetype="application/json"
    )
    
