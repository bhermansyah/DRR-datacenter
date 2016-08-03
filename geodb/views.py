from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
import csv, os
from geodb.models import AfgFldzonea100KRiskLandcoverPop, AfgLndcrva, AfgAdmbndaAdm1, AfgAdmbndaAdm2, AfgFldzonea100KRiskMitigatedAreas, AfgAvsa, Forcastedvalue, AfgShedaLvl4, districtsummary, provincesummary, basinsummary, AfgPpla, tempCurrentSC, earthquake_events, earthquake_shakemap, villagesummaryEQ, AfgPplp, AfgSnowaAverageExtent, AfgCaptPpl, AfgAirdrmp, AfgHltfac, forecastedLastUpdate, AfgCaptGmscvr, AfgEqtUnkPplEqHzd
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

GS_TMP_DIR = getattr(settings, 'GS_TMP_DIR', '/tmp')

initial_data_path = "/home/ubuntu/DRR-datacenter/geodb/initialdata/" # Production
gdal_path = '/usr/bin/' # production

# initial_data_path = "/Users/budi/Documents/iMMAP/DRR-datacenter/geodb/initialdata/" # in developement
# gdal_path = '/usr/local/bin/' # development


def getLatestEarthQuake():
    startdate = datetime.datetime.utcnow()
    startdate = startdate - datetime.timedelta(days=30)
    contents = getContents('dyfi',['stationlist.txt'],bounds=[60,77,29,45], magrange=[4,9], starttime=startdate, listURL=True, getAll=True)
    
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
                subprocess.call('%s -f "ESRI Shapefile" %s %s -overwrite -dialect sqlite -sql "select ST_union(Geometry),GRID_CODE from mi GROUP BY GRID_CODE"' %(os.path.join(gdal_path,'ogr2ogr'), os.path.join(GS_TMP_DIR,'mi_dissolved.shp'), os.path.join(GS_TMP_DIR,'mi.shp')),shell=True)
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
        riskNumber = getRiskExecuteExternal('ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)', 'currentProvince', aoi.prov_code)
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
        riskNumber = getRiskExecuteExternal('ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)', 'currentProvince', aoi.dist_code)
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
            select a.vil_uid, b.grid_value, sum(a.vuid_population_landscan) as pop     \
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
                riskNumber['pop_shake_weak']= getKeyCustom(temp)
                temp = [x for x in settlementInPopData if x[1]==3]
                riskNumber['pop_shake_weak']= riskNumber['pop_shake_weak'] + getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==4]
                riskNumber['pop_shake_light']=getKeyCustom(temp) 
                
                temp = [x for x in settlementInPopData if x[1]==5]
                riskNumber['pop_shake_moderate']=getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==6]
                riskNumber['pop_shake_strong']=getKeyCustom(temp) 
                
                temp = [x for x in settlementInPopData if x[1]==7]
                riskNumber['pop_shake_verystrong']=getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==8]
                riskNumber['pop_shake_severe']=getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==9]  
                riskNumber['pop_shake_violent']=getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==10] 
                riskNumber['pop_shake_extreme']=getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==11] 
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==12] 
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==13] 
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==14] 
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp) 

                temp = [x for x in settlementInPopData if x[1]==15] 
                riskNumber['pop_shake_extreme']=riskNumber['pop_shake_extreme']+getKeyCustom(temp) 

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

def getKeyCustom(dt):
    result = 0
    if len(dt)>0:
        result = round(dt[0][2],0)
    return result    

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
    data1.append(['Month','Snow_Cover'])
    for i in snowCal:
        data1.append(['Jan',getSnowCoverClassNumber(i.cov_01_jan)])
        data1.append(['Feb',getSnowCoverClassNumber(i.cov_02_feb)])
        data1.append(['Mar',getSnowCoverClassNumber(i.cov_03_mar)])
        data1.append(['Apr',getSnowCoverClassNumber(i.cov_04_apr)])
        data1.append(['May',getSnowCoverClassNumber(i.cov_05_may)])
        data1.append(['Jun',getSnowCoverClassNumber(i.cov_06_jun)])
        data1.append(['Jul',getSnowCoverClassNumber(i.cov_07_jul)])
        data1.append(['Aug',getSnowCoverClassNumber(i.cov_08_aug)])
        data1.append(['Sep',getSnowCoverClassNumber(i.cov_09_sep)])
        data1.append(['Oct',getSnowCoverClassNumber(i.cov_10_oct)])
        data1.append(['Nov',getSnowCoverClassNumber(i.cov_11_nov)])
        data1.append(['Dec',getSnowCoverClassNumber(i.cov_12_dec)])
    
    context_dict['snowcover_line_chart'] = gchart.LineChart(SimpleDataSource(data=data1), html_id="line_chart1", options={'title': "Snow Cover Calendar", 'width': 500,'height': 250, 'legend': 'none', 'curveType': 'function', 'vAxis': { 'ticks': [{ 'v': 0, 'f': 'No Snow'}, {'v': 1, 'f': 'Very low'}, {'v': 2, 'f': 'Low'}, {'v': 3, 'f': 'Average'}, {'v': 4, 'f': 'High'}, {'v': 5, 'f': 'Very high'}]}})  
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
            context_dict['gsm_covered'] = 'YES'
        else:
            context_dict['gsm_covered'] = 'NO'     
    except:
        ptemp = AfgCaptGmscvr.objects.all().filter(vuid=village)
        if len(ptemp)>0:
            context_dict['gsm_covered'] = 'YES'
        else:
            context_dict['gsm_covered'] = 'NO'  

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
        data1.append([i['agg_simplified_description'],i['totalpop']])
        data2.append([i['agg_simplified_description'],round(i['totalarea']/1000000,1)])

    context_dict['landcover_pop_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title': "# of Population", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  
    context_dict['landcover_area_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title': "# of Area (KM2)", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  
    
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
        data.append({'date':i.dateofevent.strftime("%Y-%m-%d %H:%M:%S") ,'magnitude':i.magnitude,'sic':event_mag[i.event_code]})

    context_dict['eq_history']=data   
    # data1 = []
    # data2 = []
    # data1.append(['agg_simplified_description','area_population'])
    # data2.append(['agg_simplified_description','area_sqm'])
    # for i in px:
    #     data1.append([i['agg_simplified_description'],i['totalpop']])
    #     data2.append([i['agg_simplified_description'],round(i['totalarea']/1000000,1)])

    # context_dict['landcover_pop_chart'] = gchart.PieChart(SimpleDataSource(data=data1), html_id="pie_chart1", options={'title': "# of Population", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  
    # context_dict['landcover_area_chart'] = gchart.PieChart(SimpleDataSource(data=data2), html_id="pie_chart2", options={'title': "# of Area (KM2)", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  
    
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
    targetRisk = targetRiskIncludeWater.exclude(agg_simplified_description='Water body and marshland')
    
    # riverflood
    currRF = targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='riverflood',basinmember__basins__datadate='%s-%s-%s' %(year,month,day))
    currRF = currRF.values('basinmember__basins__riskstate').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('basinmember__basins__riskstate','pop', 'area')
    temp = dict([(c['basinmember__basins__riskstate'], c['pop']) for c in currRF])
    context_dict['riverflood_forecast_verylow_pop']=round(temp.get(1, 0),0) 
    context_dict['riverflood_forecast_low_pop']=round(temp.get(2, 0),0) 
    context_dict['riverflood_forecast_med_pop']=round(temp.get(3, 0),0) 
    context_dict['riverflood_forecast_high_pop']=round(temp.get(4, 0),0) 
    context_dict['riverflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0) 
    context_dict['riverflood_forecast_extreme_pop']=round(temp.get(6, 0),0) 

    currFF = targetRisk.select_related("basinmembers").defer('basinmember__wkb_geometry').exclude(basinmember__basins__riskstate=None).filter(basinmember__basins__forecasttype='flashflood',basinmember__basins__datadate='%s-%s-%s' %(year,month,day))
    currFF = currFF.values('basinmember__basins__riskstate').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('basinmember__basins__riskstate','pop', 'area')
    temp = dict([(c['basinmember__basins__riskstate'], c['pop']) for c in currFF])
    context_dict['flashflood_forecast_verylow_pop']=round(temp.get(1, 0),0) 
    context_dict['flashflood_forecast_low_pop']=round(temp.get(2, 0),0) 
    context_dict['flashflood_forecast_med_pop']=round(temp.get(3, 0),0) 
    context_dict['flashflood_forecast_high_pop']=round(temp.get(4, 0),0) 
    context_dict['flashflood_forecast_veryhigh_pop']=round(temp.get(5, 0),0) 
    context_dict['flashflood_forecast_extreme_pop']=round(temp.get(6, 0),0) 

    floodRisk = targetRisk.values('deeperthan').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('deeperthan','pop', 'area')
    temp = dict([(c['deeperthan'], c['pop']) for c in floodRisk])
    context_dict['high_risk_population']=round(temp.get('271 cm', 0),0)
    context_dict['med_risk_population']=round(temp.get('121 cm', 0), 0)
    context_dict['low_risk_population']=round(temp.get('029 cm', 0),0)
    context_dict['total_risk_population']=context_dict['high_risk_population']+context_dict['med_risk_population']+context_dict['low_risk_population']
    temp = dict([(c['deeperthan'], c['area']) for c in floodRisk])
    context_dict['high_risk_area']=round(temp.get('271 cm', 0)/1000000,1)
    context_dict['med_risk_area']=round(temp.get('121 cm', 0)/1000000,1)
    context_dict['low_risk_area']=round(temp.get('029 cm', 0)/1000000,1)


    floodRiskLC = targetRiskIncludeWater.values('agg_simplified_description').annotate(pop=Sum('fldarea_population'), area=Sum('fldarea_sqm')).values('agg_simplified_description','pop', 'area')
    temp = dict([(c['agg_simplified_description'], c['pop']) for c in floodRiskLC])
    context_dict['water_body_pop_risk']=round(temp.get('Water body and marshland', 0),0)
    context_dict['barren_land_pop_risk']=round(temp.get('Barren land', 0),0)
    context_dict['built_up_pop_risk']=round(temp.get('Built-up', 0),0)
    context_dict['fruit_trees_pop_risk']=round(temp.get('Fruit trees', 0),0)
    context_dict['irrigated_agricultural_land_pop_risk']=round(temp.get('Irrigated agricultural land', 0),0)
    context_dict['permanent_snow_pop_risk']=round(temp.get('Permanent snow', 0),0)
    context_dict['rainfed_agricultural_land_pop_risk']=round(temp.get('Rainfed agricultural land', 0),0)
    context_dict['rangeland_pop_risk']=round(temp.get('Rangeland', 0),0)
    context_dict['sandcover_pop_risk']=round(temp.get('Sand cover', 0),0)
    context_dict['vineyards_pop_risk']=round(temp.get('Vineyards', 0),0)
    context_dict['forest_pop_risk']=round(temp.get('Forest and shrubs', 0),0)
    temp = dict([(c['agg_simplified_description'], c['area']) for c in floodRiskLC])
    context_dict['water_body_area_risk']=round(temp.get('Water body and marshland', 0)/1000000,1)
    context_dict['barren_land_area_risk']=round(temp.get('Barren land', 0)/1000000,1)
    context_dict['built_up_area_risk']=round(temp.get('Built-up', 0)/1000000,1)
    context_dict['fruit_trees_area_risk']=round(temp.get('Fruit trees', 0)/1000000,1)
    context_dict['irrigated_agricultural_land_area_risk']=round(temp.get('Irrigated agricultural land', 0)/1000000,1)
    context_dict['permanent_snow_area_risk']=round(temp.get('Permanent snow', 0)/1000000,1)
    context_dict['rainfed_agricultural_land_area_risk']=round(temp.get('Rainfed agricultural land', 0)/1000000,1)
    context_dict['rangeland_area_risk']=round(temp.get('Rangeland', 0)/1000000,1)
    context_dict['sandcover_area_risk']=round(temp.get('Sand cover', 0)/1000000,1)
    context_dict['vineyards_area_risk']=round(temp.get('Vineyards', 0)/1000000,1)
    context_dict['forest_area_risk']=round(temp.get('Forest and shrubs', 0)/1000000,1)

    data = []
    data.append(['floodtype','Very Low', 'Low', 'Moderate', 'High', 'Very High', 'Extreme', 'Population at flood risk', 'Population'])
    data.append(['',0,0,0,0,0,0,context_dict['total_risk_population'], context_dict['vuid_population_landscan']])
    data.append(['River Flood',context_dict['riverflood_forecast_verylow_pop'], context_dict['riverflood_forecast_low_pop'], context_dict['riverflood_forecast_med_pop'], context_dict['riverflood_forecast_high_pop'], context_dict['riverflood_forecast_veryhigh_pop'], context_dict['riverflood_forecast_extreme_pop'], context_dict['total_risk_population'], context_dict['vuid_population_landscan']])
    data.append(['Flash Flood',context_dict['flashflood_forecast_verylow_pop'], context_dict['flashflood_forecast_low_pop'], context_dict['flashflood_forecast_med_pop'], context_dict['flashflood_forecast_high_pop'], context_dict['flashflood_forecast_veryhigh_pop'], context_dict['flashflood_forecast_extreme_pop'], context_dict['total_risk_population'], context_dict['vuid_population_landscan']])    
    data.append(['',0,0,0,0,0,0,context_dict['total_risk_population'], context_dict['vuid_population_landscan']])
    context_dict['combo_pop_chart'] = gchart.ComboChart(SimpleDataSource(data=data), html_id="combo_chart", options={'vAxis': {'title': 'Number of population'},'legend': {'position': 'top', 'maxLines':2}, 'colors': ['#b9c246', '#e49307', '#e49307', '#e7711b', '#e2431e', '#d3362d', 'red', 'green' ], 'title': "Flood Forecast Exposure", 'seriesType': 'bars', 'series': {6: {'type': 'area', 'lineDashStyle': [2, 2, 20, 2, 20, 2]}, 7: {'type': 'area', 'lineDashStyle':[10, 2]}}, 'isStacked': 'true'})  
    
    dataFLRiskPop = []
    dataFLRiskPop.append(['Flood Risk','Population'])
    dataFLRiskPop.append(['Low',context_dict['low_risk_population']])
    dataFLRiskPop.append(['Moderate',context_dict['med_risk_population']])
    dataFLRiskPop.append(['High',context_dict['high_risk_population']])
    context_dict['floodrisk_pop_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskPop), html_id="pie_chart1", options={'slices': {0:{'color': 'blue'},1:{'color': 'orange'},2:{'color': 'red'}}, 'title': "Flood Risk Population Exposure", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  

    dataFLRiskPop = []
    dataFLRiskPop.append(['Lancover Type','Population'])
    dataFLRiskPop.append(['water body',context_dict['water_body_pop_risk']])
    dataFLRiskPop.append(['barren land',context_dict['barren_land_pop_risk']])
    dataFLRiskPop.append(['built up',context_dict['built_up_pop_risk']])
    dataFLRiskPop.append(['fruit trees',context_dict['fruit_trees_pop_risk']])
    dataFLRiskPop.append(['irrigated agricultural',context_dict['irrigated_agricultural_land_pop_risk']])
    dataFLRiskPop.append(['permanent snow',context_dict['permanent_snow_pop_risk']])
    dataFLRiskPop.append(['rainfeld agricultural',context_dict['rainfed_agricultural_land_pop_risk']])
    dataFLRiskPop.append(['rangeland',context_dict['rangeland_pop_risk']])
    dataFLRiskPop.append(['sandcover',context_dict['sandcover_pop_risk']])
    dataFLRiskPop.append(['vineyards',context_dict['vineyards_pop_risk']])
    dataFLRiskPop.append(['forest',context_dict['forest_pop_risk']])
    context_dict['floodriskLC_pop_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskPop), html_id="pie_chart2", options={'title': "Flood Risk Population Exposure by Landcover type", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  

    dataFLRiskArea = []
    dataFLRiskArea.append(['Flood Risk','Area'])
    dataFLRiskArea.append(['Low',context_dict['low_risk_area']])
    dataFLRiskArea.append(['Moderate',context_dict['med_risk_area']])
    dataFLRiskArea.append(['High',context_dict['high_risk_area']])
    context_dict['floodrisk_area_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskArea), html_id="pie_chart3", options={'slices': {0:{'color': 'blue'},1:{'color': 'orange'},2:{'color': 'red'}},'title': "Flood Risk Area Exposure", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  

    dataFLRiskPop = []
    dataFLRiskPop.append(['Lancover Type','Area'])
    dataFLRiskPop.append(['water body',context_dict['water_body_area_risk']])
    dataFLRiskPop.append(['barren land',context_dict['barren_land_area_risk']])
    dataFLRiskPop.append(['built up',context_dict['built_up_area_risk']])
    dataFLRiskPop.append(['fruit trees',context_dict['fruit_trees_area_risk']])
    dataFLRiskPop.append(['irrigated agricultural',context_dict['irrigated_agricultural_land_area_risk']])
    dataFLRiskPop.append(['permanent snow',context_dict['permanent_snow_area_risk']])
    dataFLRiskPop.append(['rainfeld agricultural',context_dict['rainfed_agricultural_land_area_risk']])
    dataFLRiskPop.append(['rangeland',context_dict['rangeland_area_risk']])
    dataFLRiskPop.append(['sandcover',context_dict['sandcover_area_risk']])
    dataFLRiskPop.append(['vineyards',context_dict['vineyards_area_risk']])
    dataFLRiskPop.append(['forest',context_dict['forest_area_risk']])
    context_dict['floodriskLC_area_chart'] = gchart.PieChart(SimpleDataSource(data=dataFLRiskPop), html_id="pie_chart4", options={'title': "Flood Risk Area Exposure by Landcover type", 'width': 250,'height': 250, 'pieSliceText': 'percentage','legend': {'position': 'top', 'maxLines':3}})  

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
        return HttpResponse({}, content_type='image/png' )   

