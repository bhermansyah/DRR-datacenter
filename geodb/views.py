from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
import csv, os
from geodb.models import AfgFldzonea100KRiskLandcoverPop, AfgLndcrva, AfgAdmbndaAdm1, AfgAdmbndaAdm2, AfgFldzonea100KRiskMitigatedAreas, AfgAvsa, Forcastedvalue, AfgShedaLvl4, districtsummary, provincesummary, basinsummary, AfgPpla, tempCurrentSC, earthquake_events, earthquake_shakemap, villagesummaryEQ 
import requests
from django.core.files.base import ContentFile
import urllib2, base64
import urllib
from PIL import Image
from StringIO import StringIO
from django.db.models import Count, Sum, F
import time, sys
import subprocess

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

            if includeShakeMap and long(recordExists[0].shakemaptimestamp) < long(shakemaptimestamp):
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

    subprocess.call('%s %s -f "ESRI Shapefile" %s' %(os.path.join(gdal_path,'gdal_polygonize.py'), os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_reproj.tif', os.path.join(GS_TMP_DIR,filelist[-1].split()[8][:-7])+'_poly_temp.shp'),shell=True)
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
    cursor.execute("insert into current_sc_basins(basin,wkb_geometry) select a.value, a.wkb_geometry from afg_sheda_lvl4 as a, temp_current_sc as b where st_intersects(a.wkb_geometry, b.wkb_geometry)")

    cursor.close()
    # clean temporary files
    cleantmpfile('ims')
    

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
                        c.save()
                        print 'flashflood modified'
                    print 'flashflood skip'    
                else:
                    c = Forcastedvalue(basin=basin)  
                    c.datadate = year+'-'+month+'-'+day
                    c.forecasttype = 'flashflood'
                    c.riskstate = flashFloodState 
                    c.save()
                    print 'flashflood added'

            if snowWaterState>0:
                # basin = AfgShedaLvl4.objects.get(value=row[0]) 
                recordExists = Forcastedvalue.objects.all().filter(datadate=year+'-'+month+'-'+day,forecasttype='snowwater',basin=basin)  
                if recordExists.count() > 0:
                    if recordExists[0].riskstate < snowWaterState:
                        c = Forcastedvalue(pk=recordExists[0].pk,basin=basin)  
                        c.riskstate = snowWaterState
                        c.save()
                        print 'snowwater modified'
                    print 'snowwater skip'    
                else:
                    c = Forcastedvalue(basin=basin)  
                    c.datadate = year+'-'+month+'-'+day
                    c.forecasttype = 'snowwater'
                    c.riskstate = snowWaterState 
                    c.save()
                    print 'snowwater added'       

            if snowWater>0:
                # basin = AfgShedaLvl4.objects.get(value=row[0]) 
                recordExists = Forcastedvalue.objects.all().filter(datadate=year+'-'+month+'-'+day,forecasttype='snowwaterreal',basin=basin)  
                if recordExists.count() > 0:
                    if recordExists[0].riskstate < snowWater:
                        c = Forcastedvalue(pk=recordExists[0].pk,basin=basin)  
                        c.riskstate = snowWater
                        c.save()
                        print 'snowwaterreal modified'
                    print 'snowwaterreal skip'    
                else:
                    c = Forcastedvalue(basin=basin)  
                    c.datadate = year+'-'+month+'-'+day
                    c.forecasttype = 'snowwaterreal'
                    c.riskstate = snowWater 
                    c.save()
                    print 'snowwaterreal added'            



        pertama=False    

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

    input_file = StringIO(urllib2.urlopen(url).read())
    background = Image.open(input_file)

    values = {'SLD_BODY' : template }
    data = urllib.urlencode(values)     
    input_file = StringIO(urllib2.urlopen(url2, data).read())
    overlay = Image.open(input_file)
    new_img = Image.blend(background, overlay, 0.5)  #background.paste(overlay, overlay.size, overlay)
    
    new_img.save(response, 'PNG', quality=300)
    
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



