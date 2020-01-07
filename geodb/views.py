from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
import csv, os
from geodb.models import AfgFldzonea100KRiskLandcoverPop, AfgLndcrva, AfgAdmbndaAdm1, AfgAdmbndaAdm2, AfgFldzonea100KRiskMitigatedAreas, AfgAvsa, Forcastedvalue, AfgShedaLvl4, districtsummary, provincesummary, basinsummary, AfgPpla, tempCurrentSC, earthquake_events, earthquake_shakemap, villagesummaryEQ, AfgPplp, AfgSnowaAverageExtent, AfgCaptPpl, AfgAirdrmp, AfgHltfac, forecastedLastUpdate, AfgCaptGmscvr, AfgEqtUnkPplEqHzd, Glofasintegrated, AfgBasinLvl4GlofasPoint, AfgPpltDemographics, AfgLspAffpplp, AfgMettClim1KmChelsaBioclim, AfgMettClim1KmWorldclimBioclim2050Rpc26, AfgMettClim1KmWorldclimBioclim2050Rpc45, AfgMettClim1KmWorldclimBioclim2050Rpc85, AfgMettClim1KmWorldclimBioclim2070Rpc26, AfgMettClim1KmWorldclimBioclim2070Rpc45, AfgMettClim1KmWorldclimBioclim2070Rpc85, AfgMettClimperc1KmChelsaPrec, AfgMettClimtemp1KmChelsaTempavg, AfgMettClimtemp1KmChelsaTempmax, AfgMettClimtemp1KmChelsaTempmin
import requests
from django.core.files.base import ContentFile
import urllib2, base64
import urllib
from PIL import Image
from StringIO import StringIO
from django.db.models import Count, Sum, F
import time, sys
import subprocess
from django.template import RequestContext

from urlparse import urlparse
from geonode.maps.models import Map
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW

from geodb.geoapi import getRiskExecuteExternal, getEarthQuakeExecuteExternal

# addded by boedy
from matrix.models import matrix
import datetime, re
from django.conf import settings
from ftplib import FTP

import gzip
import glob
from django.contrib.gis.gdal import DataSource
from django.db import connection, connections
from django.contrib.gis.geos import fromstr
from django.contrib.gis.utils import LayerMapping

from geodb.usgs_comcat import getContents,getUTCTimeStamp
from django.contrib.gis.geos import Point

from zipfile import ZipFile
from urllib import urlretrieve
from tempfile import mktemp

from graphos.sources.model import ModelDataSource
from graphos.renderers import flot, gchart
from graphos.sources.simple import SimpleDataSource
from math import degrees, atan2

from django.utils.translation import ugettext as _

from netCDF4 import Dataset, num2date
import numpy as np

# import matplotlib.mlab as mlab
# import matplotlib.pyplot as plt, mpld3
# import matplotlib.ticker as ticker
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
from matplotlib.figure import Figure
import json

GS_TMP_DIR = getattr(settings, 'GS_TMP_DIR', '/tmp')

initial_data_path = "/home/ubuntu/DRR-datacenter/geodb/initialdata/" # Production
gdal_path = '/usr/bin/' # production

# initial_data_path = "/Users/immap/DRR-datacenter/geodb/initialdata/" # in developement
# gdal_path = '/usr/local/bin/' # development


def getLatestEarthQuake():
    startdate = datetime.datetime.utcnow()
    startdate = startdate - datetime.timedelta(days=30)
    contents = getContents('origin',['stationlist.txt'],bounds=[60,77,29,45], magrange=[4,9], starttime=startdate, listURL=True, getAll=True)

    for content in contents:
        point = Point(x=content['geometry']['coordinates'][0], y=content['geometry']['coordinates'][1],srid=4326)
        dateofevent = getUTCTimeStamp(content['properties']['time'])
        recordExists = earthquake_events.objects.all().filter(event_code=content['properties']['code'])
        if recordExists.count() > 0:
            c = earthquake_events(pk=recordExists[0].pk,event_code=content['properties']['code'])
            c.wkb_geometry = point
            c.title = content['properties']['title']
            c.dateofevent = dateofevent
            c.magnitude = content['properties']['mag']
            c.shakemaptimestamp = recordExists[0].shakemaptimestamp
            c.depth = content['geometry']['coordinates'][2]
            c.save()
            print 'earthqueke id ' + content['properties']['code'] + ' modified'
        else:
            c = earthquake_events(event_code=content['properties']['code'])
            c.wkb_geometry = point
            c.title = content['properties']['title']
            c.dateofevent = dateofevent
            c.magnitude = content['properties']['mag']
            c.depth = content['geometry']['coordinates'][2]
            c.save()
            print 'earthqueke id ' + content['properties']['code'] + ' added'

def getLatestShakemap(includeShakeMap=False):
    startdate = datetime.datetime.utcnow()
    startdate = startdate - datetime.timedelta(days=30)
    contents = getContents('shakemap',['shape.zip'],bounds=[60,77,29,45], magrange=[4,9], starttime=startdate, listURL=True, getAll=True)

    for content in contents:
        point = Point(x=content['geometry']['coordinates'][0], y=content['geometry']['coordinates'][1],srid=4326)
        dateofevent = getUTCTimeStamp(content['properties']['time'])
        shakemaptimestamp = content['shakemap_url'].split('/')[-3]
        recordExists = earthquake_events.objects.all().filter(event_code=content['properties']['code'])
        if recordExists.count() > 0:
            oldTimeStamp = recordExists[0].shakemaptimestamp
            c = earthquake_events(pk=recordExists[0].pk,event_code=content['properties']['code'])
            c.wkb_geometry = point
            c.title = content['properties']['title']
            c.dateofevent = dateofevent
            c.magnitude = content['properties']['mag']
            c.depth = content['geometry']['coordinates'][2]
            c.shakemaptimestamp = shakemaptimestamp
            c.save()

            filename = mktemp('.zip')


            name, hdrs = urllib.urlretrieve(content['shakemap_url'], filename)
            thefile=ZipFile(filename)
            for name in thefile.namelist():
                if name.split('.')[0]=='mi':
                    outfile = open(os.path.join(GS_TMP_DIR,name), 'wb')
                    outfile.write(thefile.read(name))
                    outfile.close()
            thefile.close()

            # print str(oldTimeStamp) + ' - '+ str(shakemaptimestamp)

            if oldTimeStamp is None:
                oldTimeStamp = 0

            if includeShakeMap and long(oldTimeStamp) < long(shakemaptimestamp):
                mapping = {
                    'wkb_geometry' : 'POLYGON',
                    'grid_value':  'GRID_CODE',
                }

                # subprocess.call('%s -f "ESRI Shapefile" %s %s -overwrite -dialect sqlite -sql "select ST_union(ST_MakeValid(Geometry)),GRID_CODE from mi GROUP BY GRID_CODE"' %(os.path.join(gdal_path,'ogr2ogr'), os.path.join(GS_TMP_DIR,'mi_dissolved.shp'), os.path.join(GS_TMP_DIR,'mi.shp')),shell=True)
                subprocess.call('%s -f "ESRI Shapefile" %s %s -overwrite -dialect sqlite -sql "select ST_union(Geometry),round(PARAMVALUE,0) AS GRID_CODE from mi GROUP BY round(PARAMVALUE,0)"' %(os.path.join(gdal_path,'ogr2ogr'), os.path.join(GS_TMP_DIR,'mi_dissolved.shp'), os.path.join(GS_TMP_DIR,'mi.shp')),shell=True)
                earthquake_shakemap.objects.filter(event_code=content['properties']['code']).delete()
                lm = LayerMapping(earthquake_shakemap, os.path.join(GS_TMP_DIR,'mi_dissolved.shp'), mapping)
                lm.save(verbose=True)
                earthquake_shakemap.objects.filter(event_code='').update(event_code=content['properties']['code'],shakemaptimestamp=shakemaptimestamp)

                updateEarthQuakeSummaryTable(event_code=content['properties']['code'])
            print 'earthqueke id ' + content['properties']['code'] + ' modified'
        else:
            c = earthquake_events(event_code=content['properties']['code'])
            c.wkb_geometry = point
            c.title = content['properties']['title']
            c.dateofevent = dateofevent
            c.magnitude = content['properties']['mag']
            c.depth = content['geometry']['coordinates'][2]
            c.shakemaptimestamp = shakemaptimestamp
            c.save()

            filename = mktemp('.zip')

            name, hdrs = urllib.urlretrieve(content['shakemap_url'], filename)
            thefile=ZipFile(filename)
            for name in thefile.namelist():
                if name.split('.')[0]=='mi':
                    outfile = open(os.path.join(GS_TMP_DIR,name), 'wb')
                    outfile.write(thefile.read(name))
                    outfile.close()
            thefile.close()

            if includeShakeMap:
                mapping = {
                    'wkb_geometry' : 'POLYGON',
                    'grid_value':  'GRID_CODE',
                }
                # subprocess.call('%s -f "ESRI Shapefile" %s %s -overwrite -dialect sqlite -sql "select ST_union(ST_MakeValid(Geometry)),GRID_CODE from mi GROUP BY GRID_CODE"' %(os.path.join(gdal_path,'ogr2ogr'), os.path.join(GS_TMP_DIR,'mi_dissolved.shp'), os.path.join(GS_TMP_DIR,'mi.shp')),shell=True)
                subprocess.call('%s -f "ESRI Shapefile" %s %s -overwrite -dialect sqlite -sql "select ST_union(Geometry),GRID_CODE from mi GROUP BY GRID_CODE"' %(os.path.join(gdal_path,'ogr2ogr'), os.path.join(GS_TMP_DIR,'mi_dissolved.shp'), os.path.join(GS_TMP_DIR,'mi.shp')),shell=True)
                earthquake_shakemap.objects.filter(event_code=content['properties']['code']).delete()
                lm = LayerMapping(earthquake_shakemap, os.path.join(GS_TMP_DIR,'mi_dissolved.shp'), mapping)
                lm.save(verbose=True)
                earthquake_shakemap.objects.filter(event_code='').update(event_code=content['properties']['code'],shakemaptimestamp=shakemaptimestamp)

                updateEarthQuakeSummaryTable(event_code=content['properties']['code'])
            print 'earthqueke id ' + content['properties']['code'] + ' added'

    cleantmpfile('mi');

def getSnowCover():
    today  = datetime.datetime.now()
    year = today.strftime("%Y")

    base_url = 'sidads.colorado.edu'
    filelist=[]

    ftp = FTP(base_url)
    ftp.login()
    ftp.cwd("pub/DATASETS/NOAA/G02156/GIS/1km/"+ "{year}/".format(year=year))

    ftp.retrlines('LIST',filelist.append)

    ftp.retrbinary("RETR " + filelist[-1].split()[8], open(os.path.join(GS_TMP_DIR,filelist[-1].split()[8]),"wb").write)


    decompressedFile = gzip.GzipFile(os.path.join(GS_TMP_DIR,filelist[-1].split()[8]), 'rb')
    s=decompressedFile.read()
    decompressedFile.close()
    outF = file(os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-3]), 'wb')
    outF.write(s)
    outF.close()

    ftp.quit()

    subprocess.call('%s -te 2438000 4432000 4429000 6301000 %s %s' %(os.path.join(gdal_path,'gdalwarp'), os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-3]), os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_cropped.tif'),shell=True)
    subprocess.call('%s -t_srs EPSG:4326 %s %s' %(os.path.join(gdal_path,'gdalwarp'), os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_cropped.tif', os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_reproj.tif'),shell=True)

    subprocess.call('%s -cutline %s -crop_to_cutline %s %s' %(os.path.join(gdal_path,'gdalwarp'), os.path.join(initial_data_path,'afg_admbnda_int.shp'), os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_reproj.tif', os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_cropped_afg.tif'),shell=True)

    subprocess.call('%s %s -f "ESRI Shapefile" %s' %(os.path.join(gdal_path,'gdal_polygonize.py'), os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_cropped_afg.tif', os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_poly_temp.shp'),shell=True)
    subprocess.call('%s %s %s -where "DN=4"' %(os.path.join(gdal_path,'ogr2ogr'), os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_poly.shp', os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_poly_temp.shp'),shell=True)
    mapping = {
        'wkb_geometry' : 'POLYGON',
    } # The mapping is a dictionary

    # update snow cover in geodb
    tempCurrentSC.objects.all().delete()
    lm = LayerMapping(tempCurrentSC, os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_poly.shp', mapping)
    lm.save(verbose=True)

    # create intersects layer of basin with SC
    cursor = connections['geodb'].cursor()
    cursor.execute("delete from current_sc_basins")
    cursor.execute("insert into current_sc_basins(basin,wkb_geometry) select a.value, ST_Multi(ST_Intersection(a.wkb_geometry, b.wkb_geometry)) as wkb_geometry from afg_sheda_lvl4 as a, temp_current_sc as b where st_intersects(a.wkb_geometry, b.wkb_geometry)")

    cursor.close()
    # clean temporary files
    cleantmpfile('ims')
    print 'snowCover done'


def cleantmpfile(filepattern):

    tmpfilelist = glob.glob("{}*.*".format(
        os.path.join(GS_TMP_DIR, filepattern)))
    for f in tmpfilelist:
        os.remove(f)

def getForecastedDisaster():
    username = 'wmo'
    password = 'SAsia:14-ffg'
    auth_encoded = base64.encodestring('%s:%s' % (username, password))[:-1]

    currentdate = datetime.datetime.utcnow()

    try:
        year = currentdate.strftime("%Y")
        month = currentdate.strftime("%m")
        day = currentdate.strftime("%d")
        hh = currentdate.strftime("%H")
        req = urllib2.Request('https://sasiaffg.hrcwater.org/CONSOLE/EXPORTS/AFGHANISTAN/'+year+'/'+month+'/'+day+'/COMPOSITE_CSV/')
        req.add_header('Authorization', 'Basic %s' % auth_encoded)
        response = urllib2.urlopen(req)

    except urllib2.HTTPError, err:
        currentdate = currentdate - datetime.timedelta(days=1)
        year = currentdate.strftime("%Y")
        month = currentdate.strftime("%m")
        day = currentdate.strftime("%d")
        hh = currentdate.strftime("%H")

        req = urllib2.Request('https://sasiaffg.hrcwater.org/CONSOLE/EXPORTS/AFGHANISTAN/'+year+'/'+month+'/'+day+'/COMPOSITE_CSV/')
        req.add_header('Authorization', 'Basic %s' % auth_encoded)
        response = urllib2.urlopen(req)
        # print response

    string = response.read().decode('utf-8')
    pattern = '<a href="*?.*?00_ffgs_prod_composite_table_01hr_afghanistan.csv">(.*?)</a>'
    for filename in re.findall(pattern, string):
        selectedFile = filename


    url = 'https://sasiaffg.hrcwater.org/CONSOLE/EXPORTS/AFGHANISTAN/'+year+'/'+month+'/'+day+'/COMPOSITE_CSV/'+selectedFile
    print url

    req = urllib2.Request(url)
    req.add_header('Authorization', 'Basic %s' % auth_encoded)
    response = urllib2.urlopen(req)

    csv_f = csv.reader(response)
    Forcastedvalue.objects.all()
    pertama=True

    # put the date back to the current date for storing data
    # it will stored the latest data from yesterday in case no result it on today
    currentdate = datetime.datetime.utcnow()
    year = currentdate.strftime("%Y")
    month = currentdate.strftime("%m")
    day = currentdate.strftime("%d")
    hh = currentdate.strftime("%H")
    minute = currentdate.strftime("%M")

    for row in csv_f:
        print row
        if not pertama:
            try:
                flashfloodArray = [float(row[21]),float(row[24]),float(row[27])]
                flashflood = max(flashfloodArray)
            except:
                flashflood = 0

            try:
                snowWater  = float(row[29])
            except:
                snowWater = 0

            flashFloodState = 0
            if flashflood > 0 and flashflood <= 5:
                flashFloodState = 1 # very low
            elif flashflood > 5 and flashflood <= 10:
                flashFloodState = 2 # low
            elif flashflood > 10 and flashflood <= 25:
                flashFloodState = 3 # moderate
            elif flashflood > 25 and flashflood <= 60:
                flashFloodState = 4 # high
            elif flashflood > 60 and flashflood <= 100:
                flashFloodState = 5 # very high
            elif flashflood > 100:
                flashFloodState = 6 # Extreme


            snowWaterState = 0
            if snowWater > 60 and snowWater <= 100:
                snowWaterState = 1 #low
            elif snowWater > 100 and snowWater <= 140:
                snowWaterState = 2 #moderate
            elif snowWater > 140:
                snowWaterState = 3 #high

            basin = AfgShedaLvl4.objects.get(value=row[0])
            if flashFloodState>0:
                # basin = AfgShedaLvl4.objects.get(value=row[0])
                recordExists = Forcastedvalue.objects.all().filter(datadate=year+'-'+month+'-'+day,forecasttype='flashflood',basin=basin)
                if recordExists.count() > 0:
                    if recordExists[0].riskstate < flashFloodState:
                        c = Forcastedvalue(pk=recordExists[0].pk,basin=basin)
                        c.riskstate = flashFloodState
                        c.datadate = recordExists[0].datadate
                        c.forecasttype = recordExists[0].forecasttype
                        c.save()
                    #     print 'flashflood modified'
                    # print 'flashflood skip'
                else:
                    c = Forcastedvalue(basin=basin)
                    c.datadate = year+'-'+month+'-'+day
                    c.forecasttype = 'flashflood'
                    c.riskstate = flashFloodState
                    c.save()
                    # print 'flashflood added'

            if snowWaterState>0:
                # basin = AfgShedaLvl4.objects.get(value=row[0])
                recordExists = Forcastedvalue.objects.all().filter(datadate=year+'-'+month+'-'+day,forecasttype='snowwater',basin=basin)
                if recordExists.count() > 0:
                    if recordExists[0].riskstate < snowWaterState:
                        c = Forcastedvalue(pk=recordExists[0].pk,basin=basin)
                        c.riskstate = snowWaterState
                        c.datadate = recordExists[0].datadate
                        c.forecasttype = recordExists[0].forecasttype
                        c.save()
                    #     print 'snowwater modified'
                    # print 'snowwater skip'
                else:
                    c = Forcastedvalue(basin=basin)
                    c.datadate = year+'-'+month+'-'+day
                    c.forecasttype = 'snowwater'
                    c.riskstate = snowWaterState
                    c.save()
                    # print 'snowwater added'

            if snowWater>0:
                # basin = AfgShedaLvl4.objects.get(value=row[0])
                recordExists = Forcastedvalue.objects.all().filter(datadate=year+'-'+month+'-'+day,forecasttype='snowwaterreal',basin=basin)
                if recordExists.count() > 0:
                    if recordExists[0].riskstate < snowWater:
                        c = Forcastedvalue(pk=recordExists[0].pk,basin=basin)
                        c.riskstate = snowWater
                        c.datadate = recordExists[0].datadate
                        c.forecasttype = recordExists[0].forecasttype
                        c.save()
                    #     print 'snowwaterreal modified'
                    # print 'snowwaterreal skip'
                else:
                    c = Forcastedvalue(basin=basin)
                    c.datadate = year+'-'+month+'-'+day
                    c.forecasttype = 'snowwaterreal'
                    c.riskstate = snowWater
                    c.save()
                    # print 'snowwaterreal added'



        pertama=False
    ff = forecastedLastUpdate(datadate=year+'-'+month+'-'+day+' '+hh+':'+minute,forecasttype='flashflood')
    ff.save()
    ff = forecastedLastUpdate(datadate=year+'-'+month+'-'+day+' '+hh+':'+minute,forecasttype='snowwater')
    ff.save()
    ff = forecastedLastUpdate(datadate=year+'-'+month+'-'+day+' '+hh+':'+minute,forecasttype='snowwaterreal')
    ff.save()

def getOverviewMaps(request):
    selectedBox = request.GET['send']

    map_obj = _resolve_map(request, request.GET['mapID'], 'base.view_resourcebase', _PERMISSION_MSG_VIEW)
    queryset = matrix(user=request.user,resourceid=map_obj,action='Interactive Map Download')
    queryset.save()

    response = HttpResponse(mimetype="image/png")
    url = 'http://asdc.immap.org/geoserver/geonode/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=geonode%3Aafg_admbnda_adm2%2Cgeonode%3Aafg_admbnda_adm1&STYLES=overview_adm2,overview_adm1&SRS=EPSG%3A4326&WIDTH=292&HEIGHT=221&BBOX=59.150390625%2C28.135986328125%2C76.025390625%2C38.792724609375'
    # url2='http://asdc.immap.org/geoserver/geonode/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&SRS=EPSG%3A4326&WIDTH=768&HEIGHT=485&BBOX=59.150390625%2C28.135986328125%2C76.025390625%2C38.792724609375&SLD_BODY='+selectedBox
    url2='http://asdc.immap.org/geoserver/geonode/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&SRS=EPSG%3A4326&WIDTH=292&HEIGHT=221&BBOX=59.150390625%2C28.135986328125%2C76.025390625%2C38.792724609375'
    template = '<sld:StyledLayerDescriptor xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" xmlns:sld="http://www.opengis.net/sld" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0">'
    template +='<sld:UserLayer>'
    template +=     '<sld:Name>Inline</sld:Name>'
    template +=      '<sld:InlineFeature>'
    template +=         '<sld:FeatureCollection>'
    template +=             '<gml:featureMember>'
    template +=                 '<feature>'
    template +=                     '<polygonProperty>'
    template +=                         '<gml:Polygon  srsName="4326">'
    template +=                             '<gml:outerBoundaryIs>'
    template +=                                 '<gml:LinearRing>'
    template +=                                     '<gml:coordinates xmlns:gml="http://www.opengis.net/gml" decimal="." cs="," ts=" ">'+selectedBox
    template +=                                     '</gml:coordinates>'
    template +=                                 '</gml:LinearRing>'
    template +=                             '</gml:outerBoundaryIs>'
    template +=                         '</gml:Polygon>'
    template +=                      '</polygonProperty>'
    template +=                      '<title>Pacific NW</title>'
    template +=                 '</feature>'
    template +=             '</gml:featureMember>'
    template +=         '</sld:FeatureCollection>'
    template +=     '</sld:InlineFeature>'
    template +=     '<sld:UserStyle>'
    template +=         '<sld:FeatureTypeStyle>'
    template +=             '<sld:Rule>'
    template +=                 '<sld:PolygonSymbolizer>'
    template +=                     '<sld:Stroke>'
    template +=                         '<sld:CssParameter name="stroke">#FF0000</sld:CssParameter>'
    template +=                         '<sld:CssParameter name="stroke-width">1</sld:CssParameter>'
    template +=                     '</sld:Stroke>'
    template +=                 '</sld:PolygonSymbolizer>'
    template +=             '</sld:Rule>'
    template +=         '</sld:FeatureTypeStyle>'
    template +=     '</sld:UserStyle>'
    template += '</sld:UserLayer>'
    template +='</sld:StyledLayerDescriptor>'

    header = {
        "Content-Type": "application/json",
        "Authorization": "Basic " + base64.encodestring("boedy1996:kontol").replace('\n', '')
    }

    request1 = urllib2.Request(url, None, header)

    input_file = StringIO(urllib2.urlopen(request1).read())


    background = Image.open(input_file)

    values = {'SLD_BODY' : template}
    data = urllib.urlencode(values)


    request2 = urllib2.Request(url2, data)
    request2.add_header('Authorization', "Basic " + base64.encodestring("boedy1996:kontol").replace('\n', ''))
    response2 = urllib2.urlopen(request2)

    input_file2 = StringIO(response2.read())
    # input_file = StringIO(urllib2.urlopen(request2,data).read())

    overlay = Image.open(input_file2)

    new_img = Image.blend(background, overlay, 0.5)  #background.paste(overlay, overlay.size, overlay)

    new_img.save(response, 'PNG', quality=300)
    background.save(response, 'PNG', quality=300)

    return response

# Create your views here.
def update_progress(progress, msg, proctime):
    barLength = 100 # Modify this to change the length of the progress bar
    status = ""
    # print float(progress)
    if isinstance(progress, int):
        progress = float(progress)
    if not isinstance(progress, float):
        progress = 0
        status = "error: progress var must be float"
    if progress < 0:
        progress = 0
        status = "Halt..."
    if progress >= 1:
        progress = 1
        status = "Done..."
    block = int(round(barLength*progress))
    text = "\rPercent: [{0}] {1}% {2} {3} {4}s \r".format( "#"*block + "-"*(barLength-block), progress*100, status, msg, proctime)
    sys.stdout.write(text)
    sys.stdout.flush()

def updateForecastSummary():
    print 'kontol'
    # targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY)
    # counts =  getRiskNumber(), filterLock, 'basinmember__basins__riskstate', 'fldarea_population', 'fldarea_sqm', flag, code, 'afg_fldzonea_100k_risk_landcover_pop')
    # temp = dict([(c['basinmember__basins__riskstate'], c['count']) for c in counts])
    # response['riverflood_forecast_verylow_pop']=round(temp.get(1, 0),0)
    # response['riverflood_forecast_low_pop']=round(temp.get(2, 0),0)
    # response['riverflood_forecast_med_pop']=round(temp.get(3, 0),0)
    # response['riverflood_forecast_high_pop']=round(temp.get(4, 0),0)
    # response['riverflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0)
    # response['riverflood_forecast_extreme_pop']=round(temp.get(6, 0),0)
    # response['total_riverflood_forecast_pop']=response['riverflood_forecast_verylow_pop'] + response['riverflood_forecast_low_pop'] + response['riverflood_forecast_med_pop'] + response['riverflood_forecast_high_pop'] + response['riverflood_forecast_veryhigh_pop'] + response['riverflood_forecast_extreme_pop']


def updateSummaryTable():   # for district
    YEAR = datetime.datetime.utcnow().strftime("%Y")
    MONTH = datetime.datetime.utcnow().strftime("%m")
    DAY = datetime.datetime.utcnow().strftime("%d")
    resourcesProvinces = AfgAdmbndaAdm1.objects.all().order_by('prov_code')
    resourcesDistricts = AfgAdmbndaAdm2.objects.all().order_by('dist_code')
    resourcesBasin = AfgPpla.objects.all()

    header = []

    print '----- Process Provinces Statistics ------\n'
    ppp = resourcesProvinces.count()
    xxx = 0
    update_progress(float(xxx/ppp), 'start', 0)

    databaseFields = provincesummary._meta.get_all_field_names()
    databaseFields.remove('id')
    databaseFields.remove('province')
    for aoi in resourcesProvinces:
        start = time.time()
        riskNumber = getRiskExecuteExternal('ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)', 'currentProvince', aoi.prov_code, YEAR, MONTH, DAY)
        px = provincesummary.objects.filter(province=aoi.prov_code)

        if px.count()>0:
            a = provincesummary(id=px[0].id,province=aoi.prov_code)
        else:
            a = provincesummary(province=aoi.prov_code)

        for i in databaseFields:
            setattr(a, i, riskNumber[i])
        a.save()
        loadingtime = time.time() - start
        xxx=xxx+1
        update_progress(float(float(xxx)/float(ppp)), aoi.prov_code, loadingtime)

    print '----- Process Districts Statistics ------\n'
    ppp = resourcesDistricts.count()
    xxx = 0
    update_progress(float(xxx/ppp), 'start', 0)

    databaseFields = districtsummary._meta.get_all_field_names()
    databaseFields.remove('id')
    databaseFields.remove('district')
    for aoi in resourcesDistricts:
        start = time.time()
        riskNumber = getRiskExecuteExternal('ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)', 'currentProvince', aoi.dist_code, YEAR, MONTH, DAY)
        px = districtsummary.objects.filter(district=aoi.dist_code)

        if px.count()>0:
            a = districtsummary(id=px[0].id,district=aoi.dist_code)
        else:
            a = districtsummary(district=aoi.dist_code)

        for i in databaseFields:
            setattr(a, i, riskNumber[i])
        a.save()
        loadingtime = time.time() - start
        xxx=xxx+1
        update_progress(float(float(xxx)/float(ppp)), aoi.dist_code, loadingtime)

    print '----- Process Villages Statistics ------\n'
    cursor = connections['geodb'].cursor()
    cursor.execute('\
        update "villagesummary" \
            set \
            riverflood_forecast_verylow_pop = 0,\
            riverflood_forecast_low_pop = 0,\
            riverflood_forecast_med_pop = 0,\
            riverflood_forecast_high_pop = 0,\
            riverflood_forecast_veryhigh_pop = 0,\
            riverflood_forecast_extreme_pop = 0,\
            total_riverflood_forecast_pop = 0,\
            \
            riverflood_forecast_verylow_area = 0,\
            riverflood_forecast_low_area = 0,\
            riverflood_forecast_med_area = 0,\
            riverflood_forecast_high_area = 0,\
            riverflood_forecast_veryhigh_area = 0,\
            riverflood_forecast_extreme_area = 0,\
            total_riverflood_forecast_area = 0,\
            \
            flashflood_forecast_verylow_pop = 0,\
            flashflood_forecast_low_pop = 0,\
            flashflood_forecast_med_pop = 0,\
            flashflood_forecast_high_pop = 0,\
            flashflood_forecast_veryhigh_pop = 0,\
            flashflood_forecast_extreme_pop = 0,\
            total_flashflood_forecast_pop = 0,\
            \
            flashflood_forecast_verylow_area = 0,\
            flashflood_forecast_low_area = 0,\
            flashflood_forecast_med_area = 0,\
            flashflood_forecast_high_area = 0,\
            flashflood_forecast_veryhigh_area = 0,\
            flashflood_forecast_extreme_area = 0,\
            total_flashflood_forecast_area = 0,\
            \
            ava_forecast_low_pop = 0,\
            ava_forecast_med_pop = 0,\
            ava_forecast_high_pop = 0,\
            total_ava_forecast_pop = 0;\
            \
            update "villagesummary"\
            set\
            riverflood_forecast_verylow_pop = p.riverflood_forecast_verylow_pop,\
            riverflood_forecast_low_pop = p.riverflood_forecast_low_pop,\
            riverflood_forecast_med_pop = p.riverflood_forecast_med_pop,\
            riverflood_forecast_high_pop = p.riverflood_forecast_high_pop,\
            riverflood_forecast_veryhigh_pop = p.riverflood_forecast_veryhigh_pop,\
            riverflood_forecast_extreme_pop = p.riverflood_forecast_extreme_pop,\
            \
            riverflood_forecast_verylow_area = p.riverflood_forecast_verylow_area,\
            riverflood_forecast_low_area = p.riverflood_forecast_low_area,\
            riverflood_forecast_med_area = p.riverflood_forecast_med_area,\
            riverflood_forecast_high_area = p.riverflood_forecast_high_area,\
            riverflood_forecast_veryhigh_area = p.riverflood_forecast_veryhigh_area,\
            riverflood_forecast_extreme_area = p.riverflood_forecast_extreme_area\
            from (\
            SELECT \
            "afg_fldzonea_100k_risk_landcover_pop"."vuid", \
            "afg_fldzonea_100k_risk_landcover_pop"."basin_id", \
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 1 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as riverflood_forecast_verylow_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 2 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as riverflood_forecast_low_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 3 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as riverflood_forecast_med_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 4 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as riverflood_forecast_high_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 5 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as riverflood_forecast_veryhigh_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 6 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as riverflood_forecast_extreme_pop,\
            \
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 1 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as riverflood_forecast_verylow_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 2 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as riverflood_forecast_low_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 3 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as riverflood_forecast_med_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 4 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as riverflood_forecast_high_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 5 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as riverflood_forecast_veryhigh_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 6 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as riverflood_forecast_extreme_area\
            FROM "afg_fldzonea_100k_risk_landcover_pop" \
            INNER JOIN "afg_sheda_lvl4" ON ( "afg_fldzonea_100k_risk_landcover_pop"."basinmember_id" = "afg_sheda_lvl4"."ogc_fid" ) \
            INNER JOIN "forcastedvalue" ON ( "afg_sheda_lvl4"."ogc_fid" = "forcastedvalue"."basin_id" ) \
            WHERE (NOT ("afg_fldzonea_100k_risk_landcover_pop"."agg_simplified_description" = \'Water body and marshland\' ) \
            AND NOT ("afg_fldzonea_100k_risk_landcover_pop"."basinmember_id" IN (SELECT U1."ogc_fid" FROM "afg_sheda_lvl4" U1 LEFT OUTER JOIN "forcastedvalue" U2 ON ( U1."ogc_fid" = U2."basin_id" ) WHERE U2."riskstate" IS NULL)) \
            AND "forcastedvalue"."datadate" = \''+YEAR+'-'+MONTH+'-'+DAY+' 00:00:00\'  \
            AND "forcastedvalue"."forecasttype" = \'riverflood\' ) \
            GROUP BY \
            "afg_fldzonea_100k_risk_landcover_pop"."vuid", \
            "afg_fldzonea_100k_risk_landcover_pop"."basin_id") as p \
            WHERE p.vuid = "villagesummary".vuid and p.basin_id = cast("villagesummary".basin as float);\
            \
            update "villagesummary"\
            set\
            flashflood_forecast_verylow_pop = p.flashflood_forecast_verylow_pop,\
            flashflood_forecast_low_pop = p.flashflood_forecast_low_pop,\
            flashflood_forecast_med_pop = p.flashflood_forecast_med_pop,\
            flashflood_forecast_high_pop = p.flashflood_forecast_high_pop,\
            flashflood_forecast_veryhigh_pop = p.flashflood_forecast_veryhigh_pop,\
            flashflood_forecast_extreme_pop = p.flashflood_forecast_extreme_pop,\
            \
            flashflood_forecast_verylow_area = p.flashflood_forecast_verylow_area,\
            flashflood_forecast_low_area = p.flashflood_forecast_low_area,\
            flashflood_forecast_med_area = p.flashflood_forecast_med_area,\
            flashflood_forecast_high_area = p.flashflood_forecast_high_area,\
            flashflood_forecast_veryhigh_area = p.flashflood_forecast_veryhigh_area,\
            flashflood_forecast_extreme_area = p.flashflood_forecast_extreme_area\
            from (\
            SELECT \
            "afg_fldzonea_100k_risk_landcover_pop"."vuid", \
            "afg_fldzonea_100k_risk_landcover_pop"."basin_id", \
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 1 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as flashflood_forecast_verylow_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 2 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as flashflood_forecast_low_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 3 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as flashflood_forecast_med_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 4 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as flashflood_forecast_high_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 5 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as flashflood_forecast_veryhigh_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 6 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_population"\
             else 0\
            end\
            )) as flashflood_forecast_extreme_pop,\
            \
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 1 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as flashflood_forecast_verylow_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 2 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as flashflood_forecast_low_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 3 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as flashflood_forecast_med_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 4 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as flashflood_forecast_high_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 5 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as flashflood_forecast_veryhigh_area,\
            SUM(\
            case\
             when "forcastedvalue"."riskstate" = 6 then "afg_fldzonea_100k_risk_landcover_pop"."fldarea_sqm"\
             else 0\
            end\
            )/1000000 as flashflood_forecast_extreme_area\
            FROM "afg_fldzonea_100k_risk_landcover_pop" \
            INNER JOIN "afg_sheda_lvl4" ON ( "afg_fldzonea_100k_risk_landcover_pop"."basinmember_id" = "afg_sheda_lvl4"."ogc_fid" ) \
            INNER JOIN "forcastedvalue" ON ( "afg_sheda_lvl4"."ogc_fid" = "forcastedvalue"."basin_id" ) \
            WHERE (NOT ("afg_fldzonea_100k_risk_landcover_pop"."agg_simplified_description" = \'Water body and marshland\' ) \
            AND NOT ("afg_fldzonea_100k_risk_landcover_pop"."basinmember_id" IN (SELECT U1."ogc_fid" FROM "afg_sheda_lvl4" U1 LEFT OUTER JOIN "forcastedvalue" U2 ON ( U1."ogc_fid" = U2."basin_id" ) WHERE U2."riskstate" IS NULL)) \
            AND "forcastedvalue"."datadate" = \''+YEAR+'-'+MONTH+'-'+DAY+' 00:00:00\'  \
            AND "forcastedvalue"."forecasttype" = \'flashflood\' ) \
            GROUP BY \
            "afg_fldzonea_100k_risk_landcover_pop"."vuid", \
            "afg_fldzonea_100k_risk_landcover_pop"."basin_id") as p \
            WHERE p.vuid = "villagesummary".vuid and p.basin_id = cast("villagesummary".basin as float);\
            \
            update "villagesummary"\
            set\
            ava_forecast_low_pop = p.ava_forecast_low_pop,\
            ava_forecast_med_pop = p.ava_forecast_med_pop,\
            ava_forecast_high_pop = p.ava_forecast_high_pop\
            From (SELECT \
            "afg_avsa"."vuid", \
            "afg_avsa"."basin_id",\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 1 then "afg_avsa"."avalanche_pop"\
             else 0\
            end\
            )) as ava_forecast_low_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 2 then "afg_avsa"."avalanche_pop"\
             else 0\
            end\
            )) as ava_forecast_med_pop,\
            round(SUM(\
            case\
             when "forcastedvalue"."riskstate" = 3 then "afg_avsa"."avalanche_pop"\
             else 0\
            end\
            )) as ava_forecast_high_pop\
            FROM "afg_avsa" \
            INNER JOIN "afg_sheda_lvl4" ON ( "afg_avsa"."basinmember_id" = "afg_sheda_lvl4"."ogc_fid" ) \
            INNER JOIN "forcastedvalue" ON ( "afg_sheda_lvl4"."ogc_fid" = "forcastedvalue"."basin_id" ) \
            WHERE (NOT ("afg_avsa"."basinmember_id" IN (SELECT U1."ogc_fid" FROM "afg_sheda_lvl4" U1 LEFT OUTER JOIN "forcastedvalue" U2 ON ( U1."ogc_fid" = U2."basin_id" ) WHERE U2."riskstate" IS NULL)) \
            AND "forcastedvalue"."datadate" = \''+YEAR+'-'+MONTH+'-'+DAY+' 00:00:00\'  \
            AND "forcastedvalue"."forecasttype" = \'snowwater\' )\
            GROUP BY  \
            "afg_avsa"."vuid", \
            "afg_avsa"."basin_id") as p\
            WHERE p.vuid = "villagesummary".vuid and p.basin_id = cast("villagesummary".basin as float);\
            \
            update "villagesummary"\
            set\
            total_riverflood_forecast_pop = riverflood_forecast_verylow_pop + riverflood_forecast_low_pop + riverflood_forecast_med_pop + riverflood_forecast_high_pop + riverflood_forecast_veryhigh_pop + riverflood_forecast_extreme_pop,\
            total_riverflood_forecast_area = riverflood_forecast_verylow_area + riverflood_forecast_low_area + riverflood_forecast_med_area + riverflood_forecast_high_area + riverflood_forecast_veryhigh_area + riverflood_forecast_extreme_area,\
            total_flashflood_forecast_pop = flashflood_forecast_verylow_pop + flashflood_forecast_low_pop + flashflood_forecast_med_pop + flashflood_forecast_high_pop + flashflood_forecast_veryhigh_pop + flashflood_forecast_extreme_pop,\
            total_flashflood_forecast_area = flashflood_forecast_verylow_area + flashflood_forecast_low_area + flashflood_forecast_med_area + flashflood_forecast_high_area + flashflood_forecast_veryhigh_area + flashflood_forecast_extreme_area,\
            total_ava_forecast_pop = ava_forecast_low_pop+ava_forecast_med_pop+ava_forecast_high_pop;\
    ')
    cursor.close()
    print 'done'
    # ppp = resourcesBasin.count()
    # xxx = 0
    # update_progress(float(xxx/ppp), 'start', 0)

    # databaseFields = basinsummary._meta.get_all_field_names()
    # databaseFields.remove('id')
    # databaseFields.remove('basin')
    # for aoi in resourcesBasin:
    #     start = time.time()
    #     riskNumber = getRiskExecuteExternal('ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)', 'currentBasin', aoi.vuid)
    #     px = basinsummary.objects.filter(basin=aoi.vuid)
    #     if px.count()>0:
    #         a = basinsummary(id=px[0].id,basin=aoi.vuid)
    #     else:
    #         a = basinsummary(basin=aoi.vuid)

    #     for i in databaseFields:
    #         setattr(a, i, riskNumber[i])
    #     a.save()
    #     loadingtime = time.time() - start
    #     xxx=xxx+1
    #     update_progress(float(float(xxx)/float(ppp)), aoi.vuid, loadingtime)


    return

def exportdata():
    outfile_path = '/Users/budi/Documents/iMMAP/out.csv' # for local
    # outfile_path = '/home/ubuntu/DRR-datacenter/geonode/static_root/intersection_stats.csv' # for server

    csvFile = open(outfile_path, 'w')

    # resources = AfgAdmbndaAdm2.objects.all().filter(dist_code__in=['1205']).order_by('dist_code')  # ingat nanti ganti
    resources = AfgAdmbndaAdm2.objects.all().order_by('dist_code')  # ingat nanti ganti

    writer = csv.writer(csvFile)
    header = []
    headerTemp = []
    ppp = resources.count()
    xxx = 0
    update_progress(float(xxx/ppp), 'start', 0)
    for aoi in resources:
        start = time.time()
        row = []
        # test = getRiskExecuteExternal('ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)', 'drawArea', None) # real calculation
        test = getRiskExecuteExternal('ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)', 'currentProvince', aoi.dist_code)

        if len(header) == 0:
            headerTemp.append('aoi_id')
            for i in test:
                header.append(i)
                headerTemp.append(i)
            writer.writerow(headerTemp)

        row.append(aoi.dist_code)
    	for i in header:
            row.append(test[i])

        writer.writerow(row)

        loadingtime = time.time() - start
        xxx=xxx+1
        update_progress(float(float(xxx)/float(ppp)), aoi.dist_code, loadingtime)
    return


def updateEarthQuakeSummaryTable(event_code):
    # cursor = connections['geodb'].cursor()
    # cursor.execute("\
    #     select st_astext(a.wkb_geometry) as wkb_geometry, a.vuid, a.dist_code     \
    #     from afg_ppla a, earthquake_shakemap b   \
    #     where b.event_code = '"+event_code+"' and b.grid_value > 1 \
    #     and ST_Intersects(a.wkb_geometry,b.wkb_geometry)    \
    # ")
    # row = cursor.fetchall()
    # cursor.close()

    databaseFields = villagesummaryEQ._meta.get_all_field_names()
    databaseFields.remove('id')
    databaseFields.remove('district')
    databaseFields.remove('village')
    databaseFields.remove('event_code')

    print '----- Process baseline historical Statistics for EarthQuake------\n'

    cursor = connections['geodb'].cursor()

    resources = AfgAdmbndaAdm2.objects.all().order_by('dist_code')

    ppp = resources.count()
    xxx = 0
    update_progress(float(xxx/ppp), 'start', 0)

    for aoi in resources:
        start = time.time()
        # cursor.execute("\
        #     select a.vuid, b.grid_value, sum(   \
        #     case    \
        #         when ST_CoveredBy(a.wkb_geometry,b.wkb_geometry) then a.area_population \
        #         else st_area(st_intersection(a.wkb_geometry,b.wkb_geometry))/st_area(a.wkb_geometry)*a.area_population \
        #     end) as pop     \
        #     from afg_lndcrva a, earthquake_shakemap b   \
        #     where b.event_code = '"+event_code+"' and b.grid_value > 1  and a.dist_code="+str(aoi.dist_code)+"\
        #     and ST_Intersects(a.wkb_geometry,b.wkb_geometry)    \
        #     group by a.vuid, b.grid_value\
        # ")

        cursor.execute("\
            select a.vil_uid, b.grid_value, sum(a.vuid_population) as pop, sum(a.vuid_buildings) as buldings     \
            from afg_pplp a, earthquake_shakemap b   \
            where b.event_code = '"+event_code+"' and b.grid_value > 1  and a.dist_code="+str(aoi.dist_code)+"\
            and ST_Within(a.wkb_geometry,b.wkb_geometry)    \
            group by a.vil_uid, b.grid_value\
        ")
        popData = cursor.fetchall()


        cursor.execute("\
            select a.vuid, a.dist_code, b.grid_value, count(*) as numbersettlements     \
            from afg_pplp a, earthquake_shakemap b   \
            where b.event_code = '"+event_code+"' and b.grid_value > 1  and a.dist_code="+str(aoi.dist_code)+" \
            and ST_Within(a.wkb_geometry,b.wkb_geometry)    \
            group by a.vuid, a.dist_code, b.grid_value\
        ")
        settlementData = cursor.fetchall()
        # print popData


        riskNumber = {}


        for settlement in settlementData:

            if settlement[0] != None:


                settlementInPopData = [x for x in popData if x[0]==settlement[0]]

                temp = [x for x in settlementInPopData if x[1]==2]
                riskNumber['pop_shake_weak']= getKeyCustom(temp,2)
                riskNumber['buildings_shake_weak']= getKeyCustom(temp,3)
                temp = [x for x in settlementInPopData if x[1]==3]
                riskNumber['pop_shake_weak']= riskNumber['pop_shake_weak'] + getKeyCustom(temp,2)
                riskNumber['buildings_shake_weak']= riskNumber['buildings_shake_weak'] + getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==4]
                riskNumber['pop_shake_light']=getKeyCustom(temp,2)
                riskNumber['buildings_shake_light']=getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==5]
                riskNumber['pop_shake_moderate']=getKeyCustom(temp,2)
                riskNumber['buildings_shake_moderate']=getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==6]
                riskNumber['pop_shake_strong']=getKeyCustom(temp,2)
                riskNumber['buildings_shake_strong']=getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==7]
                riskNumber['pop_shake_verystrong']=getKeyCustom(temp,2)
                riskNumber['buildings_shake_verystrong']=getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==8]
                riskNumber['pop_shake_severe']=getKeyCustom(temp,2)
                riskNumber['buildings_shake_severe']=getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==9]
                riskNumber['pop_shake_violent']=getKeyCustom(temp,2)
                riskNumber['buildings_shake_violent']=getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==10]
                riskNumber['pop_shake_extreme']=getKeyCustom(temp,2)
                riskNumber['buildings_shake_extreme']=getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==11]
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp,2)
                riskNumber['buildings_shake_extreme']=riskNumber['buildings_shake_extreme']+getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==12]
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp,2)
                riskNumber['buildings_shake_extreme']=riskNumber['buildings_shake_extreme']+getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==13]
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp,2)
                riskNumber['buildings_shake_extreme']=riskNumber['buildings_shake_extreme']+getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==14]
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp,2)
                riskNumber['buildings_shake_extreme']=riskNumber['buildings_shake_extreme']+getKeyCustom(temp,3)

                temp = [x for x in settlementInPopData if x[1]==15]
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp,2)
                riskNumber['buildings_shake_extreme']=riskNumber['buildings_shake_extreme']+getKeyCustom(temp,3)

                riskNumber['settlement_shake_weak']=0
                riskNumber['settlement_shake_light']=0
                riskNumber['settlement_shake_moderate']=0
                riskNumber['settlement_shake_strong']=0
                riskNumber['settlement_shake_verystrong']=0
                riskNumber['settlement_shake_severe']=0
                riskNumber['settlement_shake_violent']=0
                riskNumber['settlement_shake_extreme']=0

                if settlement[2] in [2,3]:
                    riskNumber['settlement_shake_weak']=1
                elif settlement[2]==4:
                    riskNumber['settlement_shake_light']=1
                elif settlement[2]==5:
                    riskNumber['settlement_shake_moderate']=1
                elif settlement[2]==6:
                    riskNumber['settlement_shake_strong']=1
                elif settlement[2]==7:
                    riskNumber['settlement_shake_verystrong']=1
                elif settlement[2]==8:
                    riskNumber['settlement_shake_severe']=1
                elif settlement[2]==9:
                    riskNumber['settlement_shake_violent']=1
                elif settlement[2]>=10:
                    riskNumber['settlement_shake_extreme']=1


                px = villagesummaryEQ.objects.filter(event_code=event_code,village=settlement[0],district=settlement[1])
                if px.count()>0:
                    a = villagesummaryEQ(id=px[0].id,event_code=event_code,village=settlement[0],district=settlement[1])
                else:
                    a = villagesummaryEQ(event_code=event_code,village=settlement[0],district=settlement[1])

                for i in databaseFields:
                    setattr(a, i, riskNumber[i])

                a.save()
        loadingtime = time.time() - start
        xxx=xxx+1
        update_progress(float(float(xxx)/float(ppp)),  aoi.dist_code, loadingtime)
    cursor.close()
    return

def getKeyCustom(dt, idx):
    result = 0
    if len(dt)>0:
        result = round(dt[0][idx] or 0,0)
    return result

def getClimateVillage(request):
    template = './climateinfo.html'
    village = request.GET["v"]
    context_dict = getCommonVillageData(village)
    currentdate = datetime.datetime.utcnow()
    year = currentdate.strftime("%Y")
    month = currentdate.strftime("%m")
    day = currentdate.strftime("%d")

    climatePrec = get_object_or_404(AfgMettClimperc1KmChelsaPrec, vuid=village)
    climateTempAVG = get_object_or_404(AfgMettClimtemp1KmChelsaTempavg, vuid=village)
    climateTempMAX = get_object_or_404(AfgMettClimtemp1KmChelsaTempmax, vuid=village)
    climateTempMIN = get_object_or_404(AfgMettClimtemp1KmChelsaTempmin, vuid=village)

    tempData = []
    tempData.append([_('Month'),_('Precipitation'),_('Max Temp'),_('Avg Temp'),_('Min Temp')])
    tempData.append([_('Jan'),climatePrec.january,climateTempMAX.january,climateTempAVG.january,climateTempMIN.january])
    tempData.append([_('Feb'),climatePrec.february,climateTempMAX.february,climateTempAVG.february,climateTempMIN.february])
    tempData.append([_('Mar'),climatePrec.march,climateTempMAX.march,climateTempAVG.march,climateTempMIN.march])
    tempData.append([_('Apr'),climatePrec.april,climateTempMAX.april,climateTempAVG.april,climateTempMIN.april])
    tempData.append([_('May'),climatePrec.may,climateTempMAX.may,climateTempAVG.may,climateTempMIN.may])
    tempData.append([_('Jun'),climatePrec.june,climateTempMAX.june,climateTempAVG.june,climateTempMIN.june])
    tempData.append([_('Jul'),climatePrec.july,climateTempMAX.july,climateTempAVG.july,climateTempMIN.july])
    tempData.append([_('Aug'),climatePrec.august,climateTempMAX.august,climateTempAVG.august,climateTempMIN.august])
    tempData.append([_('Sep'),climatePrec.september,climateTempMAX.september,climateTempAVG.september,climateTempMIN.september])
    tempData.append([_('Oct'),climatePrec.october,climateTempMAX.october,climateTempAVG.october,climateTempMIN.october])
    tempData.append([_('Nov'),climatePrec.november,climateTempMAX.november,climateTempAVG.november,climateTempMIN.november])
    tempData.append([_('Dec'),climatePrec.december,climateTempMAX.december,climateTempAVG.december,climateTempMIN.december])

    context_dict['temperature_line_chart'] = gchart.ComboChart(
        SimpleDataSource(data=tempData), 
        html_id="line_chart1", 
        options={
            'title': _("Current Climate"), 
            'width': 500,
            'height': 400, 
            'legend': 'bottom', 
            # 'curveType': 'function', 
            'seriesType': 'bars',
            'colors': ['#3366cc', 'red', 'black', 'blue'],
            'chartArea': {'top':10, 'bottom':90, 'left':50, 'right':50},
            'vAxes': { 
                0:{'format': u'# \u00b0C'},
                1:{'format':"# mm", 'viewWindow':{'min':0}} 
            },
            'series': {
                0: {'targetAxisIndex':1,'type':'bars'},
                1: {'targetAxisIndex':0,'type':'line'},
                2: {'targetAxisIndex':0,'type':'line'},
                3: {'targetAxisIndex':0,'type':'line'},
            },
        })

    climateBioClim = get_object_or_404(AfgMettClim1KmChelsaBioclim, vuid=village)
    climateBioClim2050Rpc26 = get_object_or_404(AfgMettClim1KmWorldclimBioclim2050Rpc26, vuid=village)
    climateBioClim2050Rpc45 = get_object_or_404(AfgMettClim1KmWorldclimBioclim2050Rpc45, vuid=village)
    climateBioClim2050Rpc85 = get_object_or_404(AfgMettClim1KmWorldclimBioclim2050Rpc85, vuid=village)
    climateBioClim2070Rpc26 = get_object_or_404(AfgMettClim1KmWorldclimBioclim2070Rpc26, vuid=village)
    climateBioClim2070Rpc45 = get_object_or_404(AfgMettClim1KmWorldclimBioclim2070Rpc45, vuid=village)
    climateBioClim2070Rpc85 = get_object_or_404(AfgMettClim1KmWorldclimBioclim2070Rpc85, vuid=village)

    climDataTemp = []
    climDataTemp.append([
        'State',
        'Annual Mean Temperature',
        'Mean Diurnal Range',
        'Isothermality',
        'Temperature Seasonality',
        'Max Temperature of Warmest Month',
        'Min Temperature of Coldest Month',
        'Temperature Annual Range',
        'Mean Temperature of Wettest Quarter',
        'Mean Temperature of Driest Quarter',
        'Mean Temperature of Warmest Quarter',
        'Mean Temperature of Coldest Quarter',
        {'type': 'string', 'role': 'style'}
    ])

    climDataTemp.append([
        _('Current Climate'),
        climateBioClim.bio1,
        climateBioClim.bio2,
        climateBioClim.bio3,
        climateBioClim.bio4,
        climateBioClim.bio5,
        climateBioClim.bio6,
        climateBioClim.bio7,
        climateBioClim.bio8,
        climateBioClim.bio9,
        climateBioClim.bio10,
        climateBioClim.bio11,
        'color: #3366cc'
    ])
    climDataTemp.append([
        _('RPC 26\n'),
        climateBioClim2050Rpc26.bio1,
        climateBioClim2050Rpc26.bio2,
        climateBioClim2050Rpc26.bio3*10,
        climateBioClim2050Rpc26.bio4,
        climateBioClim2050Rpc26.bio5,
        climateBioClim2050Rpc26.bio6,
        climateBioClim2050Rpc26.bio7,
        climateBioClim2050Rpc26.bio8,
        climateBioClim2050Rpc26.bio9,
        climateBioClim2050Rpc26.bio10,
        climateBioClim2050Rpc26.bio11,
        'color: #ffff03'
    ])
    climDataTemp.append([
        _('RPC 45\n2050'),
        climateBioClim2050Rpc45.bio1,
        climateBioClim2050Rpc45.bio2,
        climateBioClim2050Rpc45.bio3*10,
        climateBioClim2050Rpc45.bio4,
        climateBioClim2050Rpc45.bio5,
        climateBioClim2050Rpc45.bio6,
        climateBioClim2050Rpc45.bio7,
        climateBioClim2050Rpc45.bio8,
        climateBioClim2050Rpc45.bio9,
        climateBioClim2050Rpc45.bio10,
        climateBioClim2050Rpc45.bio11,
        'color: #ffc003'
    ])
    climDataTemp.append([
        _('RPC 85\n'),
        climateBioClim2050Rpc85.bio1,
        climateBioClim2050Rpc85.bio2,
        climateBioClim2050Rpc85.bio3*10,
        climateBioClim2050Rpc85.bio4,
        climateBioClim2050Rpc85.bio5,
        climateBioClim2050Rpc85.bio6,
        climateBioClim2050Rpc85.bio7,
        climateBioClim2050Rpc85.bio8,
        climateBioClim2050Rpc85.bio9,
        climateBioClim2050Rpc85.bio10,
        climateBioClim2050Rpc85.bio11,
        'color: #ff0303'
    ])
    climDataTemp.append([
        _('RPC 26\n'),
        climateBioClim2070Rpc26.bio1,
        climateBioClim2070Rpc26.bio2,
        climateBioClim2070Rpc26.bio3*10,
        climateBioClim2070Rpc26.bio4,
        climateBioClim2070Rpc26.bio5,
        climateBioClim2070Rpc26.bio6,
        climateBioClim2070Rpc26.bio7,
        climateBioClim2070Rpc26.bio8,
        climateBioClim2070Rpc26.bio9,
        climateBioClim2070Rpc26.bio10,
        climateBioClim2070Rpc26.bio11,
        'color: #ffff03'
    ])
    climDataTemp.append([
        _('RPC 45\n2070'),
        climateBioClim2070Rpc45.bio1,
        climateBioClim2070Rpc45.bio2,
        climateBioClim2070Rpc45.bio3*10,
        climateBioClim2070Rpc45.bio4,
        climateBioClim2070Rpc45.bio5,
        climateBioClim2070Rpc45.bio6,
        climateBioClim2070Rpc45.bio7,
        climateBioClim2070Rpc45.bio8,
        climateBioClim2070Rpc45.bio9,
        climateBioClim2070Rpc45.bio10,
        climateBioClim2070Rpc45.bio11,
        'color: #ffc003'
    ])
    climDataTemp.append([
        _('RPC 85\n'),
        climateBioClim2070Rpc85.bio1,
        climateBioClim2070Rpc85.bio2,
        climateBioClim2070Rpc85.bio3*10,
        climateBioClim2070Rpc85.bio4,
        climateBioClim2070Rpc85.bio5,
        climateBioClim2070Rpc85.bio6,
        climateBioClim2070Rpc85.bio7,
        climateBioClim2070Rpc85.bio8,
        climateBioClim2070Rpc85.bio9,
        climateBioClim2070Rpc85.bio10,
        climateBioClim2070Rpc85.bio11,
        'color: #ff0303'
    ])
    context_dict['climatechange_temp_data'] = json.dumps(climDataTemp)


    climDataPrec = []
    climDataPrec.append([
        'State',
        'Annual Precipitation',
        'Precipitation of Wettest Month',
        'Precipitation of Driest Month',
        'Precipitation Seasonality',
        'Precipitation of Wettest Quarter',
        'Precipitation of Driest Quarter',
        'Precipitation of Warmest Quarter',
        'Precipitation of Coldest Quarter',
        {'type': 'string', 'role': 'style'}
    ])

    climDataPrec.append([
        _('Current Climate'),
        climateBioClim.bio12,
        climateBioClim.bio13,
        climateBioClim.bio14,
        climateBioClim.bio15,
        climateBioClim.bio16,
        climateBioClim.bio17,
        climateBioClim.bio18,
        climateBioClim.bio19,
        'color: #3366cc'
    ])
    climDataPrec.append([
        _('RPC 26\n'),
        climateBioClim2050Rpc26.bio12,
        climateBioClim2050Rpc26.bio13,
        climateBioClim2050Rpc26.bio14,
        climateBioClim2050Rpc26.bio15,
        climateBioClim2050Rpc26.bio16,
        climateBioClim2050Rpc26.bio17,
        climateBioClim2050Rpc26.bio18,
        climateBioClim2050Rpc26.bio19,
        'color: #ffff03'
    ])
    climDataPrec.append([
        _('RPC 45\n2050'),
        climateBioClim2050Rpc45.bio12,
        climateBioClim2050Rpc45.bio13,
        climateBioClim2050Rpc45.bio14,
        climateBioClim2050Rpc45.bio15,
        climateBioClim2050Rpc45.bio16,
        climateBioClim2050Rpc45.bio17,
        climateBioClim2050Rpc45.bio18,
        climateBioClim2050Rpc45.bio19,
        'color: #ffc003'
    ])
    climDataPrec.append([
        _('RPC 85\n'),
        climateBioClim2050Rpc85.bio12,
        climateBioClim2050Rpc85.bio13,
        climateBioClim2050Rpc85.bio14,
        climateBioClim2050Rpc85.bio15,
        climateBioClim2050Rpc85.bio16,
        climateBioClim2050Rpc85.bio17,
        climateBioClim2050Rpc85.bio18,
        climateBioClim2050Rpc85.bio19,
        'color: #ff0303'
    ])
    climDataPrec.append([
        _('RPC 26\n'),
        climateBioClim2070Rpc26.bio12,
        climateBioClim2070Rpc26.bio13,
        climateBioClim2070Rpc26.bio14,
        climateBioClim2070Rpc26.bio15,
        climateBioClim2070Rpc26.bio16,
        climateBioClim2070Rpc26.bio17,
        climateBioClim2070Rpc26.bio18,
        climateBioClim2070Rpc26.bio19,
        'color: #ffff03'
    ])
    climDataPrec.append([
        _('RPC 45\n2070'),
        climateBioClim2070Rpc45.bio12,
        climateBioClim2070Rpc45.bio13,
        climateBioClim2070Rpc45.bio14,
        climateBioClim2070Rpc45.bio15,
        climateBioClim2070Rpc45.bio16,
        climateBioClim2070Rpc45.bio17,
        climateBioClim2070Rpc45.bio18,
        climateBioClim2070Rpc45.bio19,
        'color: #ffc003'
    ])
    climDataPrec.append([
        _('RPC 85\n'),
        climateBioClim2070Rpc85.bio12,
        climateBioClim2070Rpc85.bio13,
        climateBioClim2070Rpc85.bio14,
        climateBioClim2070Rpc85.bio15,
        climateBioClim2070Rpc85.bio16,
        climateBioClim2070Rpc85.bio17,
        climateBioClim2070Rpc85.bio18,
        climateBioClim2070Rpc85.bio19,
        'color: #ff0303'
    ])

    context_dict['climatechange_prec_data'] = json.dumps(climDataPrec)

    context_dict.pop('position')
    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getSnowVillage(request):
    template = './snowInfo.html'
    village = request.GET["v"]
    context_dict = getCommonVillageData(village)
    currentdate = datetime.datetime.utcnow()
    year = currentdate.strftime("%Y")
    month = currentdate.strftime("%m")
    day = currentdate.strftime("%d")

    # print context_dict

    snowCal = AfgSnowaAverageExtent.objects.all().filter(dist_code=context_dict['dist_code'])
    snowCal = snowCal.filter(wkb_geometry__contains=context_dict['position'])


    cursor = connections['geodb'].cursor()
    cursor.execute("\
        select b.ogc_fid, b.value, c.riskstate, a.wkb_geometry \
        from current_sc_basins a \
        inner join afg_sheda_lvl4 b on a.basin=b.value \
        left outer join forcastedvalue c on b.ogc_fid=c.basin_id and c.forecasttype = 'snowwaterreal' and c.datadate = NOW()::date \
        where st_intersects(ST_GeomFromText('"+context_dict['position'].wkt+"', 4326), a.wkb_geometry)\
    ")
    currSnow = cursor.fetchall()
    cursor.close()

    # currSnow = AfgShedaLvl4.objects.all().filter(wkb_geometry__contains=context_dict['position']).select_related("basins").filter(basins__datadate=year+'-'+month+'-'+day,basins__forecasttype='snowwaterreal').values('basins__riskstate')
    tempDepth = None
    for i in currSnow:
        tempDepth = i[2]
        if tempDepth == None :
            tempDepth = 1

    if tempDepth > 0 and tempDepth <=10:
        context_dict['current_snow_depth'] = 'Snow cover, no info on depth'
    elif tempDepth > 10 and tempDepth <=25:
        context_dict['current_snow_depth'] = '5cm - 25cm'
    elif tempDepth > 25 and tempDepth <=50:
        context_dict['current_snow_depth'] = '15cm - 50cm'
    elif tempDepth > 50 and tempDepth <=100:
        context_dict['current_snow_depth'] = '25cm - 1m'
    elif tempDepth > 100 and tempDepth <=150:
        context_dict['current_snow_depth'] = '50cm - 1.5m'
    elif tempDepth > 150 and tempDepth <=200:
        context_dict['current_snow_depth'] = '75cm - 2m'
    elif tempDepth > 200:
        context_dict['current_snow_depth'] = '> 1m - 2m'
    else:
        context_dict['current_snow_depth'] = 'not covered by snow'
    # Forcastedvalue.objects.all().filter(datadate=year+'-'+month+'-'+day,forecasttype='flashflood',basin=basin)
    # targetAvalanche.select_related("basinmembersava").exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='snowwater',basinmember__basins__datadate='%s-%s-%s' %(YEAR,MONTH,DAY))
    data1 = []
    data1.append([_('Month'),'Snow_Cover'])
    for i in snowCal:
        data1.append([_('Jan'),getSnowCoverClassNumber(i.cov_01_jan)])
        data1.append([_('Feb'),getSnowCoverClassNumber(i.cov_02_feb)])
        data1.append([_('Mar'),getSnowCoverClassNumber(i.cov_03_mar)])
        data1.append([_('Apr'),getSnowCoverClassNumber(i.cov_04_apr)])
        data1.append([_('May'),getSnowCoverClassNumber(i.cov_05_may)])
        data1.append([_('Jun'),getSnowCoverClassNumber(i.cov_06_jun)])
        data1.append([_('Jul'),getSnowCoverClassNumber(i.cov_07_jul)])
        data1.append([_('Aug'),getSnowCoverClassNumber(i.cov_08_aug)])
        data1.append([_('Sep'),getSnowCoverClassNumber(i.cov_09_sep)])
        data1.append([_('Oct'),getSnowCoverClassNumber(i.cov_10_oct)])
        data1.append([_('Nov'),getSnowCoverClassNumber(i.cov_11_nov)])
        data1.append([_('Dec'),getSnowCoverClassNumber(i.cov_12_dec)])

    context_dict['snowcover_line_chart'] = gchart.LineChart(SimpleDataSource(data=data1), html_id="line_chart1", options={'title': _("Snow Cover Calendar"), 'width': 500,'height': 250, 'legend': 'none', 'curveType': 'function', 'vAxis': { 'ticks': [{ 'v': 0, 'f': _('No Snow')}, {'v': 1, 'f': _('Very low')}, {'v': 2, 'f': _('Low')}, {'v': 3, 'f': _('Average')}, {'v': 4, 'f': _('High')}, {'v': 5, 'f': _('Very high')}]}})
    context_dict.pop('position')
    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getAccesibilityInfoVillages(request):
    template = './accessInfo.html'
    village = request.GET["v"]
    context_dict = getCommonVillageData(village)

    px = get_object_or_404(AfgCaptPpl, vil_uid=village)
    context_dict['cl_road_time']=getConvertedTime(px.time_to_road)
    context_dict['cl_road_distance']=getConvertedDistance(px.distance_to_road)

    # airport
    try:
        ptemp = get_object_or_404(AfgAirdrmp, geonameid=px.airdrm_id)
        angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
        context_dict['cl_airport_name']=ptemp.namelong
        context_dict['cl_airport_time']=getConvertedTime(px.airdrm_time)
        context_dict['cl_airport_distance']=getConvertedDistance(px.airdrm_dist)
        context_dict['cl_airport_angle']=angle['angle']
        context_dict['cl_airport_direction_label']=getDirectionLabel(angle['angle'])
    except:
        print 'not found'

    # closest prov capital
    try:
        ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_provc_vuid)
        angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
        context_dict['cl_prov_cap_name']=ptemp.name_en
        context_dict['cl_prov_cap_time']=getConvertedTime(px.ppl_provc_time)
        context_dict['cl_prov_cap_distance']=getConvertedDistance(px.ppl_provc_dist)
        context_dict['cl_prov_cap_angle']=angle['angle']
        context_dict['cl_prov_cap_direction_label']=getDirectionLabel(angle['angle'])
        context_dict['cl_prov_cap_parent'] = ptemp.prov_na_en
    except:
        print 'not found'

    # Its prov capital
    try:
        ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_provc_its_vuid)
        angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
        context_dict['it_prov_cap_name']=ptemp.name_en
        context_dict['it_prov_cap_time']=getConvertedTime(px.ppl_provc_its_time)
        context_dict['it_prov_cap_distance']=getConvertedDistance(px.ppl_provc_its_dist)
        context_dict['it_prov_cap_angle']=angle['angle']
        context_dict['it_prov_cap_direction_label']=getDirectionLabel(angle['angle'])
    except:
        print 'not found'

    # closest district capital
    try:
        ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_distc_vuid)
        angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
        context_dict['cl_dist_cap_name']=ptemp.name_en
        context_dict['cl_dist_cap_time']=getConvertedTime(px.ppl_distc_time)
        context_dict['cl_dist_cap_distance']=getConvertedDistance(px.ppl_distc_dist)
        context_dict['cl_dist_cap_angle']=angle['angle']
        context_dict['cl_dist_cap_direction_label']=getDirectionLabel(angle['angle'])
        context_dict['cl_dist_cap_parent'] = ptemp.prov_na_en
    except:
        print 'not found'

    # Its district capital
    try:
        ptemp = get_object_or_404(AfgPplp, vil_uid=px.ppl_distc_its_vuid)
        angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
        context_dict['it_dist_cap_name']=ptemp.name_en
        context_dict['it_dist_cap_time']=getConvertedTime(px.ppl_distc_its_time)
        context_dict['it_dist_cap_distance']=getConvertedDistance(px.ppl_distc_its_dist)
        context_dict['it_dist_cap_angle']=angle['angle']
        context_dict['it_dist_cap_direction_label']=getDirectionLabel(angle['angle'])
    except:
        print 'not found'

    # Closest HF tier 1
    try:
        ptemp = get_object_or_404(AfgHltfac, facility_id=px.hltfac_tier1_id)
    except:
        ptemp = AfgHltfac.objects.all().filter(facility_id=px.hltfac_tier1_id)[0]
    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
    context_dict['t1_hf_name']=ptemp.facility_name
    context_dict['t1_hf_time']=getConvertedTime(px.hltfac_tier1_time)
    context_dict['t1_hf_distance']=getConvertedDistance(px.hltfac_tier1_dist)
    context_dict['t1_hf_angle']=angle['angle']
    context_dict['t1_hf_direction_label']=getDirectionLabel(angle['angle'])
    context_dict['t1_hf_prov_parent'] = ptemp.prov_na_en
    context_dict['t1_hf_dist_parent'] = ptemp.dist_na_en

    # Closest HF tier 2
    try:
        ptemp = get_object_or_404(AfgHltfac, facility_id=px.hltfac_tier2_id)
    except:
        ptemp = AfgHltfac.objects.all().filter(facility_id=px.hltfac_tier2_id)[0]
    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
    context_dict['t2_hf_name']=ptemp.facility_name
    context_dict['t2_hf_time']=getConvertedTime(px.hltfac_tier2_time)
    context_dict['t2_hf_distance']=getConvertedDistance(px.hltfac_tier2_dist)
    context_dict['t2_hf_angle']=angle['angle']
    context_dict['t2_hf_direction_label']=getDirectionLabel(angle['angle'])
    context_dict['t2_hf_prov_parent'] = ptemp.prov_na_en
    context_dict['t2_hf_dist_parent'] = ptemp.dist_na_en

    # Closest HF tier 3
    try:
        ptemp = get_object_or_404(AfgHltfac, facility_id=px.hltfac_tier3_id)
    except:
        ptemp = AfgHltfac.objects.all().filter(facility_id=px.hltfac_tier3_id)[0]
    angle = getAngle(ptemp.wkb_geometry.x, ptemp.wkb_geometry.y, context_dict['position'].x, context_dict['position'].y)
    context_dict['t3_hf_name']=ptemp.facility_name
    context_dict['t3_hf_time']=getConvertedTime(px.hltfac_tier3_time)
    context_dict['t3_hf_distance']=getConvertedDistance(px.hltfac_tier3_dist)
    context_dict['t3_hf_angle']=angle['angle']
    context_dict['t3_hf_direction_label']=getDirectionLabel(angle['angle'])
    context_dict['t3_hf_prov_parent'] = ptemp.prov_na_en
    context_dict['t3_hf_dist_parent'] = ptemp.dist_na_en

    # GSM Coverages
    try:
        ptemp = get_object_or_404(AfgCaptGmscvr, vuid=village)
        if ptemp:
            context_dict['gsm_covered'] = 'Yes'
        else:
            context_dict['gsm_covered'] = 'No coverage'
    except:
        ptemp = AfgCaptGmscvr.objects.all().filter(vuid=village)
        if len(ptemp)>0:
            context_dict['gsm_covered'] = 'Yes'
        else:
            context_dict['gsm_covered'] = 'No coverage'

    context_dict.pop('position')
    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getGeneralInfoVillages(request):
    template = './generalInfo.html'
    village = request.GET["v"]

    context_dict = getCommonVillageData(village)
    px = AfgLndcrva.objects.all().filter(vuid=village).values('agg_simplified_description').annotate(totalpop=Sum('area_population'), totalarea=Sum('area_sqm')).values('agg_simplified_description','totalpop', 'totalarea')
    data1 = []
    data2 = []
    data1.append(['agg_simplified_description','area_population'])
    data2.append(['agg_simplified_description','area_sqm'])
    for i in px:
        data1.append([i['agg_simplified_description'],round(i['totalpop'] or 0,0)])
        data2.append([i['agg_simplified_description'],round(i['totalarea']/1000000,1)])

    context_dict['landcover_pop_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title': _("# of Population"), 'width': 225,'height': 225, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})
    context_dict['landcover_area_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title': _("# of Area (KM2)"), 'width': 225,'height': 225, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})
    context_dict['longitude'] = context_dict['position'].x
    context_dict['latitude'] = context_dict['position'].y
    context_dict.pop('position')
    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getEarthquakeInfoVillages(request):
    template = './earthquakeInfo.html'
    village = request.GET["v"]

    context_dict = getCommonVillageData(village)

    # cursor = connections['geodb'].cursor()
    # cursor.execute("\
    #     select st_astext(a.wkb_geometry) as wkb_geometry, a.vuid, a.dist_code     \
    #     from afg_ppla a, earthquake_shakemap b   \
    #     where b.event_code = '"+event_code+"' and b.grid_value > 1 \
    #     and ST_Intersects(a.wkb_geometry,b.wkb_geometry)    \
    # ")
    # row = cursor.fetchall()
    # cursor.close()

    context_dict['sic_1']=''
    context_dict['sic_2']=''
    context_dict['sic_3']=''
    context_dict['sic_4']=''
    context_dict['sic_5']=''
    context_dict['sic_6']=''
    context_dict['sic_7']=''
    context_dict['sic_8']=''

    px = AfgEqtUnkPplEqHzd.objects.all().filter(vuid=village)
    for i in px:
        if i.seismic_intensity_cat == 'II':
           context_dict['sic_1']='X'
        if i.seismic_intensity_cat == 'III':
           context_dict['sic_1']='X'
        if i.seismic_intensity_cat == 'IV':
           context_dict['sic_2']='X'
        if i.seismic_intensity_cat == 'V':
           context_dict['sic_3']='X'
        if i.seismic_intensity_cat == 'VI':
           context_dict['sic_4']='X'
        if i.seismic_intensity_cat == 'VII':
           context_dict['sic_5']='X'
        if i.seismic_intensity_cat == 'VIII':
           context_dict['sic_6']='X'
        if i.seismic_intensity_cat == 'IX':
           context_dict['sic_7']='X'
        if i.seismic_intensity_cat == 'X+':
           context_dict['sic_8']='X'

    px = earthquake_shakemap.objects.all().filter(wkb_geometry__intersects=context_dict['position']).exclude(grid_value=1).values('event_code','grid_value')

    event_code = []
    event_mag = {}

    data = []
    for i in px:
        event_code.append(i['event_code'])
        event_mag[i['event_code']]=i['grid_value']

    px = earthquake_events.objects.all().filter(event_code__in=event_code).order_by('-dateofevent')
    for i in px:
        data.append({'date':i.dateofevent.strftime("%Y-%m-%d %H:%M") ,'magnitude':i.magnitude,'sic':event_mag[i.event_code]})

    context_dict['eq_history']=data
    # data1 = []
    # data2 = []
    # data1.append(['agg_simplified_description','area_population'])
    # data2.append(['agg_simplified_description','area_sqm'])
    # for i in px:
    #     data1.append([i['agg_simplified_description'],i['totalpop']])
    #     data2.append([i['agg_simplified_description'],round(i['totalarea']/1000000,1)])

    # context_dict['landcover_pop_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title': _("# of Population"), 'width': 250,'height': 250, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})
    # context_dict['landcover_area_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title': _("# of Area (KM2)"), 'width': 250,'height': 250, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})

    context_dict.pop('position')
    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getLandSlideInfoVillages(request):
    template = './landslideinfo.html'
    village = request.GET["v"]
    currentdate = datetime.datetime.utcnow()
    year = currentdate.strftime("%Y")
    month = currentdate.strftime("%m")
    day = currentdate.strftime("%d")

    context_dict = getCommonVillageData(village)

    px = get_object_or_404(AfgLspAffpplp, vuid=village)
    try:
        context_dict['landslide_risk'] = px.lsi_immap
    except:
        context_dict['landslide_risk'] = 0

    try:
        context_dict['landslide_risk_lsi_ku'] = px.lsi_ku
    except:
        context_dict['landslide_risk_lsi_ku'] = 0

    try:
        context_dict['landslide_risk_ls_s1_wb'] = px.ls_s1_wb
    except:
        context_dict['landslide_risk_ls_s1_wb'] = 0

    try:
        context_dict['landslide_risk_ls_s2_wb'] = px.ls_s2_wb
    except:
        context_dict['landslide_risk_ls_s2_wb'] = 0

    try:
        context_dict['landslide_risk_ls_s3_wb'] = px.ls_s3_wb
    except:
        context_dict['landslide_risk_ls_s3_wb'] = 0

    if context_dict['landslide_risk'] >= 7:
        context_dict['landslide_risk'] = 'Very High'
    elif context_dict['landslide_risk'] >= 5 and context_dict['landslide_risk'] < 7:
        context_dict['landslide_risk'] = 'High'
    elif context_dict['landslide_risk'] >= 4 and context_dict['landslide_risk'] < 5:
        context_dict['landslide_risk'] = 'Moderate'
    elif context_dict['landslide_risk'] >= 2 and context_dict['landslide_risk'] < 4:
        context_dict['landslide_risk'] = 'Low'
    elif context_dict['landslide_risk'] >= 1 and context_dict['landslide_risk'] < 2:
        context_dict['landslide_risk'] = 'Very Low'
    else :
        context_dict['landslide_risk'] = 'None'


    if context_dict['landslide_risk_lsi_ku'] >= 7:
        context_dict['landslide_risk_lsi_ku'] = 'Very High'
    elif context_dict['landslide_risk_lsi_ku'] >= 5 and context_dict['landslide_risk_lsi_ku'] < 7:
        context_dict['landslide_risk_lsi_ku'] = 'High'
    elif context_dict['landslide_risk_lsi_ku'] >= 4 and context_dict['landslide_risk_lsi_ku'] < 5:
        context_dict['landslide_risk_lsi_ku'] = 'Moderate'
    elif context_dict['landslide_risk_lsi_ku'] >= 2 and context_dict['landslide_risk_lsi_ku'] < 4:
        context_dict['landslide_risk_lsi_ku'] = 'Low'
    elif context_dict['landslide_risk_lsi_ku'] >= 1 and context_dict['landslide_risk_lsi_ku'] < 2:
        context_dict['landslide_risk_lsi_ku'] = 'Very Low'
    else :
        context_dict['landslide_risk_lsi_ku'] = 'None'

    if context_dict['landslide_risk_ls_s1_wb'] >= 7:
        context_dict['landslide_risk_ls_s1_wb'] = 'Very High'
    elif context_dict['landslide_risk_ls_s1_wb'] >= 5 and context_dict['landslide_risk_ls_s1_wb'] < 7:
        context_dict['landslide_risk_ls_s1_wb'] = 'High'
    elif context_dict['landslide_risk_ls_s1_wb'] >= 4 and context_dict['landslide_risk_ls_s1_wb'] < 5:
        context_dict['landslide_risk_ls_s1_wb'] = 'Moderate'
    elif context_dict['landslide_risk_ls_s1_wb'] >= 2 and context_dict['landslide_risk_ls_s1_wb'] < 4:
        context_dict['landslide_risk_ls_s1_wb'] = 'Low'
    elif context_dict['landslide_risk_ls_s1_wb'] >= 1 and context_dict['landslide_risk_ls_s1_wb'] < 2:
        context_dict['landslide_risk_ls_s1_wb'] = 'Very Low'
    else :
        context_dict['landslide_risk_ls_s1_wb'] = 'None'

    if context_dict['landslide_risk_ls_s2_wb'] >= 7:
        context_dict['landslide_risk_ls_s2_wb'] = 'Very High'
    elif context_dict['landslide_risk_ls_s2_wb'] >= 5 and context_dict['landslide_risk_ls_s2_wb'] < 7:
        context_dict['landslide_risk_ls_s2_wb'] = 'High'
    elif context_dict['landslide_risk_ls_s2_wb'] >= 4 and context_dict['landslide_risk_ls_s2_wb'] < 5:
        context_dict['landslide_risk_ls_s2_wb'] = 'Moderate'
    elif context_dict['landslide_risk_ls_s2_wb'] >= 2 and context_dict['landslide_risk_ls_s2_wb'] < 4:
        context_dict['landslide_risk_ls_s2_wb'] = 'Low'
    elif context_dict['landslide_risk_ls_s2_wb'] >= 1 and context_dict['landslide_risk_ls_s2_wb'] < 2:
        context_dict['landslide_risk_ls_s2_wb'] = 'Very Low'
    else :
        context_dict['landslide_risk_ls_s2_wb'] = 'None'

    if context_dict['landslide_risk_ls_s3_wb'] >= 7:
        context_dict['landslide_risk_ls_s3_wb'] = 'Very High'
    elif context_dict['landslide_risk_ls_s3_wb'] >= 5 and context_dict['landslide_risk_ls_s3_wb'] < 7:
        context_dict['landslide_risk_ls_s3_wb'] = 'High'
    elif context_dict['landslide_risk_ls_s3_wb'] >= 4 and context_dict['landslide_risk_ls_s3_wb'] < 5:
        context_dict['landslide_risk_ls_s3_wb'] = 'Moderate'
    elif context_dict['landslide_risk_ls_s3_wb'] >= 2 and context_dict['landslide_risk_ls_s3_wb'] < 4:
        context_dict['landslide_risk_ls_s3_wb'] = 'Low'
    elif context_dict['landslide_risk_ls_s3_wb'] >= 1 and context_dict['landslide_risk_ls_s3_wb'] < 2:
        context_dict['landslide_risk_ls_s3_wb'] = 'Very Low'
    else :
        context_dict['landslide_risk_ls_s3_wb'] = 'None'

    context_dict.pop('position')

    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getFloodInfoVillages(request):
    template = './floodInfo.html'
    village = request.GET["v"]
    currentdate = datetime.datetime.utcnow()
    year = currentdate.strftime("%Y")
    month = currentdate.strftime("%m")
    day = currentdate.strftime("%d")

    context_dict = getCommonVillageData(village)

    targetRiskIncludeWater = AfgFldzonea100KRiskLandcoverPop.objects.all().filter(vuid=village)
    targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and Marshland')

    # riverflood
    currRF = targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(year,month,day))
    currRF = currRF.values('basinmember__basins__riskstate').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('basinmember__basins__riskstate','pop', 'area')
    temp = dict([(c['basinmember__basins__riskstate'], c['pop']) for c in currRF])
    context_dict['riverflood_forecast_verylow_pop']=round(temp.get(1, 0) or 0,0)
    context_dict['riverflood_forecast_low_pop']=round(temp.get(2, 0) or 0,0)
    context_dict['riverflood_forecast_med_pop']=round(temp.get(3, 0) or 0,0)
    context_dict['riverflood_forecast_high_pop']=round(temp.get(4, 0) or 0,0)
    context_dict['riverflood_forecast_veryhigh_pop']=round(temp.get(5, 0) or 0,0)
    context_dict['riverflood_forecast_extreme_pop']=round(temp.get(6, 0) or 0,0)

    currFF = targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(year,month,day))
    currFF = currFF.values('basinmember__basins__riskstate').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('basinmember__basins__riskstate','pop', 'area')
    temp = dict([(c['basinmember__basins__riskstate'], c['pop']) for c in currFF])
    context_dict['flashflood_forecast_verylow_pop']=round(temp.get(1, 0) or 0,0)
    context_dict['flashflood_forecast_low_pop']=round(temp.get(2, 0) or 0,0)
    context_dict['flashflood_forecast_med_pop']=round(temp.get(3, 0) or 0,0)
    context_dict['flashflood_forecast_high_pop']=round(temp.get(4, 0) or 0,0)
    context_dict['flashflood_forecast_veryhigh_pop']=round(temp.get(5, 0) or 0,0)
    context_dict['flashflood_forecast_extreme_pop']=round(temp.get(6, 0) or 0,0)

    floodRisk = targetRisk.values('deeperthan').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('deeperthan','pop', 'area')
    temp = dict([(c['deeperthan'], c['pop']) for c in floodRisk])
    context_dict['high_risk_population']=round(temp.get('271 cm', 0) or 0,0)
    context_dict['med_risk_population']=round(temp.get('121 cm', 0) or 0, 0)
    context_dict['low_risk_population']=round(temp.get('029 cm', 0) or 0,0)
    context_dict['total_risk_population']=context_dict['high_risk_population']+context_dict['med_risk_population']+context_dict['low_risk_population']
    temp = dict([(c['deeperthan'], c['area']) for c in floodRisk])
    context_dict['high_risk_area']=round((temp.get('271 cm', 0) or 0)/1000000,1)
    context_dict['med_risk_area']=round((temp.get('121 cm', 0) or 0)/1000000,1)
    context_dict['low_risk_area']=round((temp.get('029 cm', 0) or 0)/1000000,1)


    floodRiskLC = targetRiskIncludeWater.values('agg_simplified_description').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('agg_simplified_description','pop', 'area')
    temp = dict([(c['agg_simplified_description'], c['pop']) for c in floodRiskLC])
    context_dict['water_body_pop_risk']=round(temp.get('Water body and Marshland', 0) or 0,0)
    context_dict['barren_land_pop_risk']=round(temp.get('Barren land', 0) or 0,0)
    context_dict['built_up_pop_risk']=round(temp.get('Build Up', 0) or 0,0)
    context_dict['fruit_trees_pop_risk']=round(temp.get('Fruit Trees', 0) or 0,0)
    context_dict['irrigated_agricultural_land_pop_risk']=round(temp.get('Irrigated Agricultural Land', 0) or 0,0)
    context_dict['permanent_snow_pop_risk']=round(temp.get('Snow', 0) or 0,0)
    context_dict['rainfed_agricultural_land_pop_risk']=round(temp.get('Rainfed', 0) or 0,0)
    context_dict['rangeland_pop_risk']=round(temp.get('Rangeland', 0) or 0,0)
    context_dict['sandcover_pop_risk']=round(temp.get('Sand Covered Areas', 0) or 0,0)
    context_dict['vineyards_pop_risk']=round(temp.get('Vineyards', 0) or 0,0)
    context_dict['forest_pop_risk']=round(temp.get('Forest & Shrub', 0) or 0,0)
    context_dict['sand_dunes_pop_risk']=round(temp.get('Sand Dunes', 0) or 0,0)
    temp = dict([(c['agg_simplified_description'], c['area']) for c in floodRiskLC])
    context_dict['water_body_area_risk']=round(temp.get('Water body and Marshland', 0)/1000000,1)
    context_dict['barren_land_area_risk']=round(temp.get('Barren land', 0)/1000000,1)
    context_dict['built_up_area_risk']=round(temp.get('Build Up', 0)/1000000,1)
    context_dict['fruit_trees_area_risk']=round(temp.get('Fruit Trees', 0)/1000000,1)
    context_dict['irrigated_agricultural_land_area_risk']=round(temp.get('Irrigated Agricultural Land', 0)/1000000,1)
    context_dict['permanent_snow_area_risk']=round(temp.get('Snow', 0)/1000000,1)
    context_dict['rainfed_agricultural_land_area_risk']=round(temp.get('Rainfed', 0)/1000000,1)
    context_dict['rangeland_area_risk']=round(temp.get('Rangeland', 0)/1000000,1)
    context_dict['sandcover_area_risk']=round(temp.get('Sand Covered Areas', 0)/1000000,1)
    context_dict['vineyards_area_risk']=round(temp.get('Vineyards', 0)/1000000,1)
    context_dict['forest_area_risk']=round(temp.get('Forest & Shrub', 0)/1000000,1)
    context_dict['sand_dunes_area_risk']=round(temp.get('Sand Dunes', 0),0)

    data = []
    data.append(['floodtype',_('Very Low'), _('Low'), _('Moderate'), _('High'), _('Very High'), _('Extreme'), _('Population at flood risk'), _('Population')])
    data.append(['',0,0,0,0,0,0,context_dict['total_risk_population'], round(context_dict['vuid_population'] or 0, 0)])
    data.append([_('River Flood'),context_dict['riverflood_forecast_verylow_pop'], context_dict['riverflood_forecast_low_pop'], context_dict['riverflood_forecast_med_pop'], context_dict['riverflood_forecast_high_pop'], context_dict['riverflood_forecast_veryhigh_pop'], context_dict['riverflood_forecast_extreme_pop'], context_dict['total_risk_population'], round(context_dict['vuid_population'] or 0, 0)])
    data.append([_('Flash Flood'),context_dict['flashflood_forecast_verylow_pop'], context_dict['flashflood_forecast_low_pop'], context_dict['flashflood_forecast_med_pop'], context_dict['flashflood_forecast_high_pop'], context_dict['flashflood_forecast_veryhigh_pop'], context_dict['flashflood_forecast_extreme_pop'], context_dict['total_risk_population'], round(context_dict['vuid_population'] or 0, 0)])
    data.append(['',0,0,0,0,0,0,context_dict['total_risk_population'], round(context_dict['vuid_population'] or 0, 0)])
    context_dict['combo_pop_chart'] = gchart.ComboChart(SimpleDataSource(data=data), html_id="combo_chart", options={'vAxis': {'title': _('Number of population')},'legend': {'position': 'top', 'maxLines':2}, 'colors': ['#b9c246', '#e49307', '#e49307', '#e7711b', '#e2431e', '#d3362d', 'red', 'green' ], 'title': _("Flood Prediction Exposure"), 'seriesType': 'bars', 'series': {6: {'type': 'area', 'lineDashStyle': [2, 2, 20, 2, 20, 2]}, 7: {'type': 'area', 'lineDashStyle':[10, 2]}}, 'isStacked': 'false'})

    dataFLRiskPop = []
    dataFLRiskPop.append([_('Flood Risk'),'Population'])
    dataFLRiskPop.append([_('Low'),context_dict['low_risk_population']])
    dataFLRiskPop.append([_('Moderate'),context_dict['med_risk_population']])
    dataFLRiskPop.append([_('High'),context_dict['high_risk_population']])
    context_dict['floodrisk_pop_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskPop), html_id="pie_chart1", options={'slices': {0:{'color': 'blue'},1:{'color': 'orange'},2:{'color': 'red'}}, 'title': _("Flood Risk Population Exposure"), 'width': 225,'height': 225, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})

    dataFLRiskPop = []
    dataFLRiskPop.append([_('Lancover Type'),'Population'])
    dataFLRiskPop.append([_('water body'),context_dict['water_body_pop_risk']])
    dataFLRiskPop.append([_('barren land'),context_dict['barren_land_pop_risk']])
    dataFLRiskPop.append([_('built up'),context_dict['built_up_pop_risk']])
    dataFLRiskPop.append([_('fruit trees'),context_dict['fruit_trees_pop_risk']])
    dataFLRiskPop.append([_('irrigated agricultural'),context_dict['irrigated_agricultural_land_pop_risk']])
    dataFLRiskPop.append([_('permanent snow'),context_dict['permanent_snow_pop_risk']])
    dataFLRiskPop.append([_('rainfeld agricultural'),context_dict['rainfed_agricultural_land_pop_risk']])
    dataFLRiskPop.append([_('rangeland'),context_dict['rangeland_pop_risk']])
    dataFLRiskPop.append([_('sandcover'),context_dict['sandcover_pop_risk']])
    dataFLRiskPop.append([_('vineyards'),context_dict['vineyards_pop_risk']])
    dataFLRiskPop.append([_('forest'),context_dict['forest_pop_risk']])
    dataFLRiskPop.append([_('sand dunes'),context_dict['sand_dunes_pop_risk']])
    context_dict['floodriskLC_pop_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskPop), html_id="pie_chart2", options={'title': _("Flood Risk Population Exposure by Landcover type"), 'width': 225,'height': 225, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})

    dataFLRiskArea = []
    dataFLRiskArea.append([_('Flood Risk'),'Area'])
    dataFLRiskArea.append([_('Low'),context_dict['low_risk_area']])
    dataFLRiskArea.append([_('Moderate'),context_dict['med_risk_area']])
    dataFLRiskArea.append([_('High'),context_dict['high_risk_area']])
    print 'dataFLRiskArea', dataFLRiskArea
    context_dict['floodrisk_area_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskArea), html_id="pie_chart3", options={'slices': {0:{'color': 'blue'},1:{'color': 'orange'},2:{'color': 'red'}},'title': _("Flood Risk Area Exposure"), 'width': 225,'height': 225, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})

    dataFLRiskPop = []
    dataFLRiskPop.append([_('Lancover Type'),'Area'])
    dataFLRiskPop.append([_('water body'),context_dict['water_body_area_risk']])
    dataFLRiskPop.append([_('barren land'),context_dict['barren_land_area_risk']])
    dataFLRiskPop.append([_('built up'),context_dict['built_up_area_risk']])
    dataFLRiskPop.append([_('fruit trees'),context_dict['fruit_trees_area_risk']])
    dataFLRiskPop.append([_('irrigated agricultural'),context_dict['irrigated_agricultural_land_area_risk']])
    dataFLRiskPop.append([_('permanent snow'),context_dict['permanent_snow_area_risk']])
    dataFLRiskPop.append([_('rainfeld agricultural'),context_dict['rainfed_agricultural_land_area_risk']])
    dataFLRiskPop.append([_('rangeland'),context_dict['rangeland_area_risk']])
    dataFLRiskPop.append([_('sandcover'),context_dict['sandcover_area_risk']])
    dataFLRiskPop.append([_('vineyards'),context_dict['vineyards_area_risk']])
    dataFLRiskPop.append([_('forest'),context_dict['forest_area_risk']])
    dataFLRiskPop.append([_('sand dunes'),context_dict['sand_dunes_pop_risk']])
    context_dict['floodriskLC_area_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskPop), html_id="pie_chart4", options={'title': _("Flood Risk Area Exposure by Landcover type"), 'width': 225,'height': 225, 'pieSliceText': _('percentage'),'legend': {'position': 'top', 'maxLines':3}})

    context_dict.pop('position')
    print context_dict
    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getCommonVillageData(village):
    databaseFields = AfgPpla._meta.get_all_field_names()
    databaseFields.remove('ogc_fid')
    databaseFields.remove('wkb_geometry')
    databaseFields.remove('shape_length')
    databaseFields.remove('shape_area')
    px = get_object_or_404(AfgPpla, vuid=village)
    context_dict = {}
    for i in databaseFields:
        context_dict[i] = getattr(px, i)

    px = get_object_or_404(AfgPplp, vil_uid=village)
    context_dict['language_field'] = px.language_field
    context_dict['elevation'] = round(px.elevation,1)
    context_dict['position'] = px.wkb_geometry
    return context_dict

def getSnowCoverClassNumber(x):
    if x == 'Very low':
        return 1
    elif x == 'Low':
        return 2
    elif x == 'Average':
        return 3
    elif x == 'High':
        return 4
    elif x == 'Very high':
        return 5
    else:
        return 0

def getConvertedTime(t):
    if t>120 and t<3600:
        m, s = divmod(t, 60)
        return str(m)+' minutes'
        # return str(round(t/60,0))+' minutes'
    elif t>3600:
        m, s = divmod(t, 60)
        h, m = divmod(m, 60)
        return "%d hours %d minutes" % (h, m)
        # return str(round(t/3600,1))+' hour(s)'
    else :
        return str(t)+' second(s)'

def getConvertedDistance(d):
    if d>1000:
        km, m = divmod(d, 1000)
        return str(km)+' km'
        # return str(round(d/1000))+' km'
    else:
        return str(d)+' m'

def getAngle(x, y, center_x, center_y):
    angle = degrees(atan2(y - center_y, x - center_x))
    bearing1 = (angle + 360) % 360
    bearing2 = (90 - angle) % 360
    if angle < 0:
        angle = 360 + angle
    angle = -(angle)
    return {'angle':angle,'bearing1':bearing1,'bearing2':bearing2}

def getDirectionLabel(angle):
    angle = -(angle)
    if angle == 0:
       return 'E'
    elif angle == 90:
        return 'N'
    elif angle == 180:
        return 'W'
    elif angle == 270:
        return 'S'
    elif angle == 360:
        return 'E'
    elif angle > 0 and angle<45:
        return 'EN'
    elif angle > 45 and angle<90:
        return 'NE'
    elif angle > 90 and angle<135:
        return 'NW'
    elif angle > 135 and angle<180:
        return 'WN'
    elif angle > 180 and angle<225:
        return 'WS'
    elif angle > 225 and angle<270:
        return 'SW'
    elif angle > 270 and angle<315:
        return 'SE'
    elif angle > 315 and angle<360:
        return 'ES'

def databasevacumm():
    cursor = connections['geodb'].cursor()
    cursor.execute("VACUUM (VERBOSE, ANALYZE);")
    cursor.close()

def getWMS(request):

    # print request
    req = urllib2.Request('http://asdc.immap.org/geoserver/wms?'+request.META['QUERY_STRING'])
    # print request.META['QUERY_STRING']
    # print request.GET.get('request')
    # print request.GET.get('bbox')

    if request.GET.get('request') == 'GetLegendGraphic' or request.GET.get('bbox') == '60.4720890240001,29.3771715570001,74.889451148,38.4907374680001':
        base64string = base64.encodestring('%s:%s' % ('boedy1996', 'kontol'))[:-1]
        authheader =  "Basic %s" % base64string
        req.add_header('Authorization', authheader)
        req.add_header('Content-Type', 'image/png')
        response = urllib2.urlopen(req).read()
        # print response

        return HttpResponse(response, content_type='image/png' )
    else:
        base64string = base64.encodestring('%s:%s' % ('boedy1996', 'kontol'))[:-1]
        authheader =  "Basic %s" % base64string
        req.add_header('Authorization', authheader)
        req.add_header('Content-Type', 'image/png')
        response = urllib2.urlopen(req).read()
        return HttpResponse(response, content_type='image/png' )

def get_month_name(monthNo):
    if monthNo==1:
        return 'January'
    elif monthNo==2:
        return 'February'
    elif monthNo==3:
        return 'March'
    elif monthNo==4:
        return 'April'
    elif monthNo==5:
        return 'May'
    elif monthNo==6:
        return 'June'
    elif monthNo==7:
        return 'July'
    elif monthNo==8:
        return 'August'
    elif monthNo==9:
        return 'September'
    elif monthNo==10:
        return 'October'
    elif monthNo==11:
        return 'November'
    elif monthNo==12:
        return 'December'

def getGlofasChart(request):

    date = request.GET['date']
    lat = float(request.GET['lat'])
    lon = float(request.GET['lon'])

    filename = "%s%s00.nc" % (getattr(settings, 'GLOFAS_NC_FILES'),date)
    nc = Dataset(filename, 'r', Format='NETCDF4')

    # get coordinates variables
    lats = nc.variables['lat'][:]
    lons = nc.variables['lon'][:]
    times= nc.variables['time'][:]

    lat_idx = np.where(lats==lat)[0]
    lon_idx = np.where(lons==lon)[0]

    coord_idx = list(set(lat_idx) & set(lon_idx))[0]

    d = np.array(nc.variables['dis'])

    rl2= nc.variables['rl2'][:]
    rl5= nc.variables['rl5'][:]
    rl20= nc.variables['rl20'][:]

    units = nc.variables['time'].units

    dates = num2date(times[:], units=units, calendar='365_day')
    date_arr = []

    median = []
    mean75 = []
    mean25 = []
    rl2_arr = []
    rl5_arr = []
    rl20_arr = []
    maximum = []

    date_number = []
    date_number_label = []
    month_name = []

    first_date_even = False

    for i in dates:
        date_number.append(i.day)
        month_name.append(i.month)

    if date_number[0] % 2 == 0:
        first_date_even = True
    for i in dates:
        if first_date_even:
            if i.day % 2 == 0:
                date_number_label.append(i.day)
        else:
            if i.day % 2 != 0:
                date_number_label.append(i.day)


    for i in range(len(date_number)):
        date_arr.append(i)
        # get median line
        median.append(np.mean(list(d[i,:,coord_idx])))
        maximum.append(np.max(list(d[i,:,coord_idx])))
        mean75.append(np.percentile(list(d[i,:,coord_idx]),75))
        mean25.append(np.percentile(list(d[i,:,coord_idx]),25))
        rl2_arr.append(rl2[coord_idx])
        rl5_arr.append(rl5[coord_idx])
        rl20_arr.append(rl20[coord_idx])

    fig=Figure(dpi=120)

    plt=fig.add_subplot(111)

    plt.fill_between(date_arr, rl2_arr, rl5_arr, color='#fff68f', alpha=1, label="2 years return period")
    plt.fill_between(date_arr, rl5_arr, rl20_arr, color='#ffaeb9', alpha=1, label="5 years return period")
    plt.fill_between(date_arr, rl20_arr, np.max(maximum)+100, color='#ffbbff', alpha=1, label="20 years return period")


    plt.plot(date_arr, median, c='black', alpha=1, linestyle='solid', label="EPS mean")
    plt.plot(date_arr, mean75, color='black', alpha=1, linestyle='dashed', label="25% - 75%")
    plt.plot(date_arr, mean25, color='black', alpha=1, linestyle='dashed')

    for i in range(51):
        plt.fill_between(date_arr, median, list(d[:,i,coord_idx]), color='#178bff', alpha=0.25)

    # print 'rl 2  ',rl2[coord_idx]
    # print 'rl 5  ',rl5[coord_idx]
    # print 'rl 20  ',rl20[coord_idx]



    plt.margins(x=0,y=0,tight=True)

    # plt.xticks(date_arr, date_number, rotation=45)
    major_ticks = np.arange(min(date_number)-1, max(date_number), 2)
    minor_ticks = np.arange(min(date_number)-1, max(date_number), 1)

    plt.set_xticks(major_ticks)
    plt.set_xticks(minor_ticks, minor=True)
    plt.set_xticklabels(date_number_label)
    plt.set_ylabel('discharge (m$^3$/s)')

    if max(month_name)==min(month_name):
        plt.set_xlabel('Period of '+get_month_name(max(month_name)))
    else:
        plt.set_xlabel('Period of '+get_month_name(min(month_name))+' - '+get_month_name(max(month_name)))

    plt.grid(which='both')
    plt.grid(True, 'major', 'y', ls='--', lw=.5, c='k', alpha=.2)

    plt.grid(True, 'major', 'x', ls='--', lw=.5, c='k', alpha=.2)
    plt.grid(True, 'minor', 'x', lw=.3, c='k', alpha=.2)

    leg = plt.legend(prop={'size':6})
    leg.get_frame().set_alpha(0)

    canvas=FigureCanvas(fig)

    response=HttpResponse(content_type='image/jpeg')
    canvas.print_png(response)
    return response

def getGlofasPointsJSON(request):
    date = request.GET['date']
    cursor = connections['geodb'].cursor()
    cursor.execute("\
        SELECT row_to_json(fc) \
 FROM ( SELECT 'FeatureCollection' As type, array_to_json(array_agg(f)) As features \
 FROM (SELECT 'Feature' As type \
    , ST_AsGeoJSON(ST_SetSRID(ST_MakePoint(lg.lon, lg.lat),4326))::json As geometry \
    , row_to_json(lp) As properties \
   FROM glofasintegrated As lg \
         INNER JOIN (select distinct \
        id, round(lon, 2) as lon, \
        round(lat, 2) as lat, \
        rl2, \
        rl5, \
        rl20, \
        rl2_dis_percent, \
        rl2_avg_dis_percent, \
        rl5_dis_percent, \
        rl5_avg_dis_percent, \
        rl20_dis_percent, \
        rl20_avg_dis_percent, \
        ST_SetSRID(ST_MakePoint(lon, lat),4326) as geom \
        from glofasintegrated where datadate = '"+date+"' and rl5_dis_percent > 25) As lp \
       ON lg.id = lp.id  ) As f )  As fc;\
    ")
    currPoints = cursor.fetchone()
    cursor.close()
    if currPoints[0]["features"] is None:
        currPoints[0]["features"] = []
    return HttpResponse(json.dumps(currPoints[0]), content_type='application/json')


def getRefactorData():
    # f_IN = open("/Users/budi/Documents/iMMAP/DRR-datacenter/scripts/misc-boedy1996/Glofas_Baseline_Output_Adjustment_factor.csv", 'rU')
    f_IN = open("/home/ubuntu/Glofas_Baseline_Output_Adjustment_factor.csv", 'rU')
    reader = csv.reader(f_IN)
    first = True
    data = {}

    for row in reader:
        if first:
            first = False
        else:
            lon = row[2]
            lat = row[1]

            # data[lat][lon]['rl2_factor']=row[8]
            data[lat]={lon:{'rl2_factor':row[8],'rl5_factor':row[9],'rl20_factor':row[10]}}

    f_IN.close()
    return data

def calculate_glofas_params(date):
    date_arr = date.split('-')
    filename = getattr(settings, 'GLOFAS_NC_FILES')+date_arr[0]+date_arr[1]+date_arr[2]+"00.nc"
    # print Glofasintegrated.objects.latest('datadate').date

    nc = Dataset(filename, 'r', Format='NETCDF4')

    # get coordinates variables
    lats = nc.variables['lat'][:]
    lons = nc.variables['lon'][:]

    rl2= nc.variables['rl2'][:]
    rl5= nc.variables['rl5'][:]
    rl20= nc.variables['rl20'][:]
    times = nc.variables['time'][:]
    essemble = nc.variables['ensemble'][:]

    # convert date, how to store date only strip away time?
    # print "Converting Dates"
    units = nc.variables['time'].units
    dates = num2date (times[:], units=units, calendar='365_day')

    d = np.array(nc.variables['dis'])
    # header = ['Latitude', 'Longitude', 'rl2', 'rl5', 'rl20', 'rl2_dis_percent', 'rl2_avg_dis_percent', 'rl5_dis_percent', 'rl5_avg_dis_percent', 'rl20_dis_percent', 'rl20_avg_dis_percent']
    times_index=[]
    for i,j in enumerate(times):
        times_index.append(i)

    coord_index = 0
    refactor = getRefactorData()

    for lat, lon, rl2, rl5, rl20 in zip(lats, lons, rl2, rl5, rl20):

        try:
            # print refactor[str(lat)][str(lon)]
            rl2_temp = rl2*float(refactor[str(lat)][str(lon)]['rl2_factor'])
            rl5_temp = rl5*float(refactor[str(lat)][str(lon)]['rl5_factor'])
            rl20_temp = rl20*float(refactor[str(lat)][str(lon)]['rl20_factor'])
        except:
            rl2_temp = rl2
            rl5_temp = rl5
            rl20_temp = rl20

        rl2 = rl2_temp
        rl5 = rl5_temp
        rl20 = rl20_temp

        data_in = []
        data_in.append(lat)
        data_in.append(lon)
        data_in.append(rl2)
        data_in.append(rl5)
        data_in.append(rl20)

        rl2_dis_percent = []
        rl5_dis_percent = []
        rl20_dis_percent = []

        rl2_avg_dis = []
        rl5_avg_dis = []
        rl20_avg_dis = []

        for i in times_index:
            data = d[i,:,coord_index]

            dis_data = []
            for l in data:
                dis_data.append(l)

            # dis_avg = sum(dis_data)/float(51)
            dis_avg = np.median(dis_data)

            count = sum(1 for x in data if x>rl2)
            percent_rl2 = round(float(count)/float(51)*100)
            rl2_avg_dis.append(round(float(dis_avg)/float(rl2)*100))
            rl2_dis_percent.append(percent_rl2)

            count = sum(1 for x in data if x>rl5)
            percent_rl5 = round(float(count)/float(51)*100)
            rl5_avg_dis.append(round(float(dis_avg)/float(rl5)*100))
            rl5_dis_percent.append(percent_rl5)

            count = sum(1 for x in data if x>rl20)
            percent_rl20 = round(float(count)/float(51)*100)
            rl20_avg_dis.append(round(float(dis_avg)/float(rl20)*100))
            rl20_dis_percent.append(percent_rl20)
            if i>=19:
                break

        # print rl2_avg_dis
        data_in.append(max(rl2_dis_percent))
        temp_avg_dis=[]
        for index, item in enumerate(rl2_dis_percent):
            if item == max(rl2_dis_percent):
                # print index, item
                temp_avg_dis.append(rl2_avg_dis[index])
        data_in.append(max(temp_avg_dis))
        rl2_avg_dis_percent = max(temp_avg_dis)

        data_in.append(max(rl5_dis_percent))
        temp_avg_dis=[]
        for index, item in enumerate(rl5_dis_percent):
            if item == max(rl5_dis_percent):
                # print index, item
                temp_avg_dis.append(rl5_avg_dis[index])
        data_in.append(max(temp_avg_dis))
        rl5_avg_dis_percent = max(temp_avg_dis)

        data_in.append(max(rl20_dis_percent))
        temp_avg_dis=[]
        for index, item in enumerate(rl20_dis_percent):
            if item == max(rl20_dis_percent):
                # print index, item
                temp_avg_dis.append(rl20_avg_dis[index])
        data_in.append(max(temp_avg_dis))
        rl20_avg_dis_percent = max(temp_avg_dis)

        if coord_index>2035 and max(rl2_dis_percent)>=25:
            pnt = Point(round(float(lon),2), round(float(lat),2), srid=4326)
            checkdata = AfgBasinLvl4GlofasPoint.objects.filter(geom__intersects=pnt)
            for z in checkdata:
                p = Glofasintegrated(basin_id=z.value, datadate=date, lon=lon, lat=lat, rl2=rl2, rl5=rl5, rl20=rl20, rl2_dis_percent=max(rl2_dis_percent), rl2_avg_dis_percent=rl2_avg_dis_percent, rl5_dis_percent=max(rl5_dis_percent), rl5_avg_dis_percent=rl5_avg_dis_percent, rl20_dis_percent=max(rl20_dis_percent), rl20_avg_dis_percent=rl20_avg_dis_percent)
                p.save()
                # print coord_index, z.value

        coord_index = coord_index+1
        # print data_in

    # print Glofasintegrated.objects.filter(datadate=date).count()
    if Glofasintegrated.objects.filter(datadate=date).count() == 0 :
        Glofasintegrated(datadate=date).save()

    nc.close()
    # GS_TMP_DIR = getattr(settings, 'GS_TMP_DIR', '/tmp')


def get_nc_file_from_ftp(date):
    # print getattr(settings, ' _FTP_UNAME')
    # print getattr(settings, 'GLOFAS_FTP_UPASS')
    # print Glofasintegrated.objects.latest('datadate').date
    date_arr = date.split('-')
    base_url = 'ftp.ecmwf.int'
    # filelist=[]

    server = FTP()
    server.connect('data-portal.ecmwf.int')
    server.login(getattr(settings, 'GLOFAS_FTP_UNAME'),getattr(settings, 'GLOFAS_FTP_UPASS'))

    server.cwd("/for_IMMAP/")

    try:
        print server.size("glofas_arealist_for_IMMAP_in_Afghanistan_"+date_arr[0]+date_arr[1]+date_arr[2]+"00.nc")
        print getattr(settings, 'GLOFAS_NC_FILES')+date_arr[0]+date_arr[1]+date_arr[2]+"00.nc"
        server.retrbinary("RETR " + "glofas_arealist_for_IMMAP_in_Afghanistan_"+date_arr[0]+date_arr[1]+date_arr[2]+"00.nc", open(getattr(settings, 'GLOFAS_NC_FILES')+date_arr[0]+date_arr[1]+date_arr[2]+"00.nc","wb").write)
        server.close()
        return True
    except:
        server.close()
        return False


def runGlofasDownloader():
    delta = datetime.timedelta(days=1)
    d = Glofasintegrated.objects.latest('datadate').datadate + delta
    end_date = datetime.date.today() - delta

    while d <= end_date:
        try:
            print d.strftime("%Y-%m-%d")
            get_nc_file_from_ftp(d.strftime("%Y-%m-%d"))
            calculate_glofas_params(d.strftime("%Y-%m-%d"))
            d += delta
        except:
            d += delta

def getWeatherInfoVillages(request):
    template = './weatherinfo.html'
    context_dict = {}
    # village = request.GET["v"]

    # context_dict = getCommonVillageData(village)

    # link = "https://www.ventusky.com/panel.php?link="+request.GET["x"]+";"+request.GET["y"]+"&lang=en-us&id="
    # f = urllib.urlopen(link)
    # myfile = f.read()
    headers = {'Cookie':{}}
    if 'parametr' in request.GET:
        response = requests.get("https://www.ventusky.com/aside/forecast.ajax.php?parametr="+request.GET["parametr"]+"&lon="+request.GET["lon"]+"&lat="+request.GET["lat"]+"&tz=Asia/Kabul&lang=en-ca", verify=False)
        return HttpResponse(response.content)
    else:
        response = requests.get("https://www.ventusky.com/panel.php?link="+request.GET["x"]+";"+request.GET["y"]+"&lang=en-ca&id=", verify=False)

    response.cookies = {}
    # print response.cookies
    context_dict['htmlrsult'] = response.content

    return render_to_response(template,
                                  RequestContext(request, context_dict))

def getDemographicInfo(request):
    template = './demographic.html'
    village = request.GET["v"]

    context_dict = getCommonVillageData(village)

    rowsgenderpercent = AfgPpltDemographics.objects.all().filter(vuidnear=village).values()
    i = rowsgenderpercent[0]

    data3 = []
    data3.append(['Gender','Percent'])
    data3.append(['Male', i['vuid_male_perc']])
    data3.append(['Female', i['vuid_female_perc']])

    data4 = []
    data4.append(['Age','Male','Female'])
    data4options={'title': _("Gender Ratio by Age Group (in %)"), 'width': 510, 'isStacked': True, 'hAxis': {'format': ';','title': _('in percent of total population')}, 'vAxis': {'title': _('age group in years'),'direction': -1}, 'legend': {'position': 'top', 'maxLines':3}}
    if context_dict['vuid_population'] > 200:
        data4.append(['0-4',   -i['m_perc_yrs_0_4'],    i['f_perc_yrs_0_4']])
        data4.append(['5-9',   -i['m_perc_yrs_5_9'],    i['f_perc_yrs_5_9']])
        data4.append(['10-14', -i['m_perc_yrs_10_14'],  i['f_perc_yrs_10_14']])
        data4.append(['15-19', -i['m_perc_yrs_15_19'],  i['f_perc_yrs_15_19']])
        data4.append(['20-24', -i['m_perc_yrs_20_24'],  i['f_perc_yrs_20_24']])
        data4.append(['25-29', -i['m_perc_yrs_25_29'],  i['f_perc_yrs_25_29']])
        data4.append(['30-34', -i['m_perc_yrs_30_34'],  i['f_perc_yrs_30_34']])
        data4.append(['35-39', -i['m_perc_yrs_35_39'],  i['f_perc_yrs_35_39']])
        data4.append(['40-44', -i['m_perc_yrs_40_44'],  i['f_perc_yrs_40_44']])
        data4.append(['45-49', -i['m_perc_yrs_45_49'],  i['f_perc_yrs_45_49']])
        data4.append(['50-54', -i['m_perc_yrs_50_54'],  i['f_perc_yrs_50_54']])
        data4.append(['55-59', -i['m_perc_yrs_55_59'],  i['f_perc_yrs_55_59']])
        data4.append(['60-64', -i['m_perc_yrs_60_64'],  i['f_perc_yrs_60_64']])
        data4.append(['65-69', -i['m_perc_yrs_65_69'],  i['f_perc_yrs_65_69']])
        data4.append(['70-74', -i['m_perc_yrs_70_74'],  i['f_perc_yrs_70_74']])
        data4.append(['75-79', -i['m_perc_yrs_75_79'],  i['f_perc_yrs_75_79']])
        data4.append(['80+',   -i['m_perc_yrs_80pls'],  i['f_perc_yrs_80pls']])

        data4options['height'] = 450
        data4options['vAxis']['textStyle'] = {'fontSize': 11}
    else:
        data4.append(['0-9',   -i['m_perc_yrs_0_4']  -i['m_perc_yrs_5_9'],    i['f_perc_yrs_0_4']  +i['f_perc_yrs_5_9']])
        data4.append(['10-19', -i['m_perc_yrs_10_14']-i['m_perc_yrs_15_19'],  i['f_perc_yrs_10_14']+i['f_perc_yrs_15_19']])
        data4.append(['20-29', -i['m_perc_yrs_20_24']-i['m_perc_yrs_25_29'],  i['f_perc_yrs_20_24']+i['f_perc_yrs_25_29']])
        data4.append(['30-39', -i['m_perc_yrs_30_34']-i['m_perc_yrs_35_39'],  i['f_perc_yrs_30_34']+i['f_perc_yrs_35_39']])
        data4.append(['40-49', -i['m_perc_yrs_40_44']-i['m_perc_yrs_45_49'],  i['f_perc_yrs_40_44']+i['f_perc_yrs_45_49']])
        data4.append(['50-59', -i['m_perc_yrs_50_54']-i['m_perc_yrs_55_59'],  i['f_perc_yrs_50_54']+i['f_perc_yrs_55_59']])
        data4.append(['60-69', -i['m_perc_yrs_60_64']-i['m_perc_yrs_65_69'],  i['f_perc_yrs_60_64']+i['f_perc_yrs_65_69']])
        data4.append(['70-79', -i['m_perc_yrs_70_74']-i['m_perc_yrs_75_79'],  i['f_perc_yrs_70_74']+i['f_perc_yrs_75_79']])
        data4.append(['80+',   -i['m_perc_yrs_80pls'],                        i['f_perc_yrs_80pls']])

    for i, v in enumerate(data3):
        if i > 0:
            v[1] = {'v':v[1], 'f':str(abs(round(v[1], 1)))+' %'}

    for i, v in enumerate(data4):
        if i > 0:
            v[1] = {'v':v[1], 'f':str(abs(round(v[1], 1)))+' %'}
            v[2] = {'v':v[2], 'f':str(abs(round(v[2], 1)))+' %'}

    context_dict['gender_ratio_chart'] = gchart.PieChart(SimpleDataSource(data=data3), html_id="pie_chart3", width=510, options={'title': _("Gender Ratio (in %)"), 'width': 510, 'pieSliceText': _('value'),'pieHole':0.5,'legend': {'position': 'top', 'maxLines':3},'tooltip': {'text': 'value'}})
    context_dict['gender_ratio_by_age_chart'] = gchart.BarChart(SimpleDataSource(data=data4), html_id="bar_chart1", width=510, options=data4options)

    context_dict.pop('position')
    return render_to_response(template,
                                  RequestContext(request, context_dict))

def test_getLatestShakemap(includeShakeMap=False):
    startdate = datetime.datetime.utcnow()
    startdate = startdate - datetime.timedelta(days=30)
    contents = getContents('shakemap',['shape.zip'],bounds=[60,77,29,45], magrange=[4,9], starttime=startdate, listURL=True, getAll=True)

    for content in contents:
        point = Point(x=content['geometry']['coordinates'][0], y=content['geometry']['coordinates'][1],srid=4326)
        dateofevent = getUTCTimeStamp(content['properties']['time'])
        shakemaptimestamp = content['shakemap_url'].split('/')[-3]
        print content
        print content['shakemap_url']
        name, hdrs = urllib.urlretrieve(content['shakemap_url'], filename)




