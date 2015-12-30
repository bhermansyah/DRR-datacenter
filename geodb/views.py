from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render_to_response
import csv
from geodb.models import AfgFldzonea100KRiskLandcoverPop, AfgLndcrva, AfgAdmbndaAdm2, AfgFldzonea100KRiskMitigatedAreas 
import requests
from django.core.files.base import ContentFile
import urllib2
import urllib
from PIL import Image
from StringIO import StringIO
from django.db.models import Count, Sum, F
import time, sys

from urlparse import urlparse
from geonode.maps.models import Map
from geonode.maps.views import _resolve_map, _PERMISSION_MSG_VIEW

# addded by boedy
from matrix.models import matrix

def getOverviewMaps(request):
    selectedBox = request.GET['send']

    map_obj = _resolve_map(request.user, request.GET['mapID'], 'base.view_resourcebase', _PERMISSION_MSG_VIEW)
    queryset = matrix(user=request.user,resourceid=map_obj,action='Interactive Calculation')
    queryset.save()

    response = HttpResponse(mimetype="image/png") 
    url = 'http://asdc.immap.org/geoserver/geonode/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&LAYERS=geonode%3Aafg_admbnda_adm2%2Cgeonode%3Aafg_admbnda_adm1&STYLES=overview_adm2,overview_adm1&SRS=EPSG%3A4326&WIDTH=192&HEIGHT=121&BBOX=59.150390625%2C28.135986328125%2C76.025390625%2C38.792724609375'
    # url2='http://asdc.immap.org/geoserver/geonode/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&SRS=EPSG%3A4326&WIDTH=768&HEIGHT=485&BBOX=59.150390625%2C28.135986328125%2C76.025390625%2C38.792724609375&SLD_BODY='+selectedBox
    url2='http://asdc.immap.org/geoserver/geonode/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image%2Fpng&TRANSPARENT=true&SRS=EPSG%3A4326&WIDTH=192&HEIGHT=121&BBOX=59.150390625%2C28.135986328125%2C76.025390625%2C38.792724609375'
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
    text = "\rPercent: [{0}] {1}% {2} {3} {4}s \r\n".format( "#"*block + "-"*(barLength-block), progress*100, status, msg, proctime)
    sys.stdout.write(text)
    sys.stdout.flush()

def exportdata():
    # response = HttpResponse(content_type='text/csv')
    # response['Content-Disposition'] = 'attachment; filename="exportdata_test.csv"'
    outfile_path = '/Users/budi/Documents/iMMAP/out.csv' # for local
    # outfile_path = '/home/ubuntu/DRR-datacenter/geonode/static_root/intersection_stats_1.csv' # for server
    csvFile = open(outfile_path, 'w')
    resources = AfgAdmbndaAdm2.objects.all().filter(dist_code__in=['1201','1203','1205']).order_by('dist_code')  # ingat nanti ganti
    # resources = AfgAdmbndaAdm2.objects.all().order_by('dist_code')  # ingat nanti ganti
    # print 'AfgAdmbndaAdm2 Loaded !'
    targetRisk = AfgFldzonea100KRiskLandcoverPop.objects.all()
    # print 'AfgFldzonea100KRiskLandcoverPop Loaded !'
    targetBase = AfgLndcrva.objects.all()
    # print 'AfgLndcrva Loaded !'
    writer = csv.writer(csvFile)
    writer.writerow([
    	'aoi_id', 
    	'name_en', 
    	'name_dari', 
    	
    	'pophighrisk', 
    	'popmedrisk', 
    	'poplowrisk', 
    	'areahighrisk', 
    	'areamedrisk', 
    	'arealowrisk',
    	
    	'pop_barrenland',
    	'pop_built_up',
    	'pop_permanent_snow',
    	'pop_Water_body_and_marshland',
    	'pop_Vineyards',
    	'pop_Rainfed_agricultural_land',
    	'pop_Forest_and_shrubs',
    	'pop_Irrigated_agricultural_land',
    	'pop_Sand_cover',
    	'pop_Fruit_trees',
    	'pop_Rangeland',
    	'pop_at_productive_landcover',

    	'area_barrenland',
    	'area_built_up',
    	'area_permanent_snow',
    	'area_Water_body_and_marshland',
    	'area_Vineyards',
    	'area_Rainfed_agricultural_land',
    	'area_Forest_and_shrubs',
    	'area_Irrigated_agricultural_land',
    	'area_Sand_cover',
    	'area_Fruit_trees',
    	'area_Rangeland',
    	'area_at_productive_landcover',

    	'tot_sett_at_risk',
    	## total
    	'tot_pop_barrenland',
    	'tot_pop_built_up',
    	'tot_pop_permanent_snow',
    	'tot_pop_Water_body_and_marshland',
    	'tot_pop_Vineyards',
    	'tot_pop_Rainfed_agricultural_land',
    	'tot_pop_Forest_and_shrubs',
    	'tot_pop_Irrigated_agricultural_land',
    	'tot_pop_Sand_cover',
    	'tot_pop_Fruit_trees',
    	'tot_pop_Rangeland',
    	'tot_pop_at_productive_landcover',

    	'tot_area_barrenland',
    	'tot_area_built_up',
    	'tot_area_permanent_snow',
    	'tot_area_Water_body_and_marshland',
    	'tot_area_Vineyards',
    	'tot_area_Rainfed_agricultural_land',
    	'tot_area_Forest_and_shrubs',
    	'tot_area_Irrigated_agricultural_land',
    	'tot_area_Sand_cover',
    	'tot_area_Fruit_trees',
    	'tot_area_Rangeland',
    	'tot_area_at_productive_landcover',

    	'tot_settlements',
    	'tot_pop',
    	'tot_area'
    ])
    ppp = resources.count()
    xxx = 0
    update_progress(float(xxx/ppp), 'start', 0)
    for aoi in resources:
        start = time.time()
        # print aoi.dist_code
    	## for the flood risk matrix
    	filteredLandCoverRisk = targetRisk.filter(wkb_geometry__intersects=aoi.wkb_geometry)
    	filteredTargetRisk = filteredLandCoverRisk.exclude(agg_simplified_description='Water body and marshland')
        # print 'lewat'
        # filteredTargetRisk.query.group_by.append(("deeperthan"))
    	# counts = list(filteredTargetRisk.values('deeperthan').annotate(count=Sum('fldarea_population'),areaatrisk=Sum('fldarea_sqm')))
    	counts = list(filteredTargetRisk.values('deeperthan').annotate(counter=Count('ogc_fid')).extra(
            select={
                # 'count':'SUM(st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_population)',
                'count' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then fldarea_population \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_population end \
                    )',
                # 'areaatrisk': 'SUM(st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_sqm)'
                'areaatrisk' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then fldarea_sqm \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_sqm end \
                    )'
            }).values('deeperthan','count','areaatrisk'))
        # print 'lewat2'
        popatrisk = dict([(c['deeperthan'], c['count']) for c in counts])
    	areaatrisk = dict([(c['deeperthan'], c['areaatrisk']) for c in counts])

    	# for flood landcover matrix
    	# counts = list(filteredLandCoverRisk.values('agg_simplified_description').annotate(count=Sum('fldarea_population'),areaatrisk=Sum('fldarea_sqm')))
    	counts = list(filteredLandCoverRisk.values('agg_simplified_description').annotate(counter=Count('ogc_fid')).extra(
            select={
                # 'count':'SUM(st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_population)',
                'count' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then fldarea_population \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_population end \
                    )',
                # 'areaatrisk': 'SUM(st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_sqm)'
                'areaatrisk' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then fldarea_sqm \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_sqm end \
                    )'
            }).values('agg_simplified_description','count','areaatrisk'))

        landcoverpopatrisk = dict([(c['agg_simplified_description'], c['count']) for c in counts])
    	landcoverareaatrisk = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])
        # print 'lewat100 '
    	qryTargetBase = targetBase.filter(wkb_geometry__intersects=aoi.wkb_geometry)
        # print 'lewat200'
    	# counts = list(qryTargetBase.values('agg_simplified_description').annotate(count=Sum('area_population'),areaatrisk=Sum('area_sqm')))
    	counts = list(qryTargetBase.values('agg_simplified_description').annotate(counter=Count('ogc_fid')).extra(
            select={
                # 'count':'SUM(st_area(st_intersection(ST_MakeValid(wkb_geometry),ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_population)',
                'count' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then area_population \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_population end \
                    )',
                # 'areaatrisk': 'SUM(st_area(st_intersection(ST_MakeValid(wkb_geometry), ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_sqm)'
                'areaatrisk' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then area_sqm \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_sqm end \
                    )'
            }).values('agg_simplified_description','count','areaatrisk'))
        # print 'lewat3'
        lancoverpopbase = dict([(c['agg_simplified_description'], c['count']) for c in counts])
    	lancoverareabase = dict([(c['agg_simplified_description'], c['areaatrisk']) for c in counts])

    	row = []
    	row.append(aoi.dist_code)
    	row.append(aoi.dist_na_en)
    	row.append(aoi.dist_na_dar.encode('utf-8'))

    	row.append(popatrisk.get('271 cm', 0))
    	row.append(popatrisk.get('121 cm', 0))
    	row.append(popatrisk.get('029 cm', 0))

    	row.append(areaatrisk.get('271 cm', 0))
    	row.append(areaatrisk.get('121 cm', 0))
    	row.append(areaatrisk.get('029 cm', 0))

    	row.append(landcoverpopatrisk.get('Barren land', 0))
    	row.append(landcoverpopatrisk.get('Built-up', 0))
    	row.append(landcoverpopatrisk.get('Permanent snow', 0))
    	row.append(landcoverpopatrisk.get('Water body and marshland', 0))
    	row.append(landcoverpopatrisk.get('Vineyards', 0))
    	row.append(landcoverpopatrisk.get('Rainfed agricultural land', 0))
    	row.append(landcoverpopatrisk.get('Forest and shrubs', 0))
    	row.append(landcoverpopatrisk.get('Irrigated agricultural land', 0))
    	row.append(landcoverpopatrisk.get('Sand cover', 0))
    	row.append(landcoverpopatrisk.get('Fruit trees', 0))
    	row.append(landcoverpopatrisk.get('Rangeland', 0))
    	row.append(landcoverpopatrisk.get('Vineyards', 0)+landcoverpopatrisk.get('Rainfed agricultural land', 0)+landcoverpopatrisk.get('Irrigated agricultural land', 0)+landcoverpopatrisk.get('Fruit trees', 0))

    	row.append(landcoverareaatrisk.get('Barren land', 0))
    	row.append(landcoverareaatrisk.get('Built-up', 0))
    	row.append(landcoverareaatrisk.get('Permanent snow', 0))
    	row.append(landcoverareaatrisk.get('Water body and marshland', 0))
    	row.append(landcoverareaatrisk.get('Vineyards', 0))
    	row.append(landcoverareaatrisk.get('Rainfed agricultural land', 0))
    	row.append(landcoverareaatrisk.get('Forest and shrubs', 0))
    	row.append(landcoverareaatrisk.get('Irrigated agricultural land', 0))
    	row.append(landcoverareaatrisk.get('Sand cover', 0))
    	row.append(landcoverareaatrisk.get('Fruit trees', 0))
    	row.append(landcoverareaatrisk.get('Rangeland', 0))
    	row.append(landcoverareaatrisk.get('Vineyards', 0)+landcoverareaatrisk.get('Rainfed agricultural land', 0)+landcoverareaatrisk.get('Irrigated agricultural land', 0)+landcoverareaatrisk.get('Fruit trees', 0))

    	# countsBase = filteredLandCoverRisk.aggregate(numbersettlementsatrisk=Count('vuid', distinct=True))
        countsBase = filteredTargetRisk.filter(agg_simplified_description='Built-up').extra(
            select={
                'numbersettlementsatrisk': 'count(distinct vuid)'}, 
            where = {'st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*fldarea_sqm > 1'}).values('numbersettlementsatrisk')

    	row.append(countsBase[0]['numbersettlementsatrisk'])
        # print 'lewat4'
    	## total
    	row.append(lancoverpopbase.get('Barren land', 0))
    	row.append(lancoverpopbase.get('Built-up', 0))
    	row.append(lancoverpopbase.get('Permanent snow', 0))
    	row.append(lancoverpopbase.get('Water body and marshland', 0))
    	row.append(lancoverpopbase.get('Vineyards', 0))
    	row.append(lancoverpopbase.get('Rainfed agricultural land', 0))
    	row.append(lancoverpopbase.get('Forest and shrubs', 0))
    	row.append(lancoverpopbase.get('Irrigated agricultural land', 0))
    	row.append(lancoverpopbase.get('Sand cover', 0))
    	row.append(lancoverpopbase.get('Fruit trees', 0))
    	row.append(lancoverpopbase.get('Rangeland', 0))
    	row.append(lancoverpopbase.get('Vineyards', 0)+lancoverpopbase.get('Rainfed agricultural land', 0)+lancoverpopbase.get('Irrigated agricultural land', 0)+lancoverpopbase.get('Fruit trees', 0))

    	row.append(lancoverareabase.get('Barren land', 0))
    	row.append(lancoverareabase.get('Built-up', 0))
    	row.append(lancoverareabase.get('Permanent snow', 0))
    	row.append(lancoverareabase.get('Water body and marshland', 0))
    	row.append(lancoverareabase.get('Vineyards', 0))
    	row.append(lancoverareabase.get('Rainfed agricultural land', 0))
    	row.append(lancoverareabase.get('Forest and shrubs', 0))
    	row.append(lancoverareabase.get('Irrigated agricultural land', 0))
    	row.append(lancoverareabase.get('Sand cover', 0))
    	row.append(lancoverareabase.get('Fruit trees', 0))
    	row.append(lancoverareabase.get('Rangeland', 0))
    	row.append(lancoverareabase.get('Vineyards', 0)+lancoverareabase.get('Rainfed agricultural land', 0)+lancoverareabase.get('Irrigated agricultural land', 0)+lancoverareabase.get('Fruit trees', 0))

        countsBase = qryTargetBase.extra(
            select={
                'numbersettlements': 'count(distinct vuid)'}, 
            where = {'st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_sqm > 1'}).values('numbersettlements')
    	row.append(countsBase[0]['numbersettlements'])

        countsBase = qryTargetBase.extra(
            select={
                # 'countbase': 'SUM(st_area(st_intersection(ST_MakeValid(wkb_geometry),ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_population)'
                'countbase' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then area_population \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_population end \
                    )'
            }).values('countbase')
        row.append(countsBase[0]['countbase'])
        countsBase = qryTargetBase.extra(
            select={
                # 'areabase': 'SUM(st_area(st_intersection(ST_MakeValid(wkb_geometry),ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_sqm)'
                'areabase' : 'SUM(  \
                        case \
                            when ST_CoveredBy(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326)) then area_sqm \
                            else st_area(st_intersection(wkb_geometry,ST_GeomFromText(\''+aoi.wkb_geometry.wkt+'\',4326))) / st_area(wkb_geometry)*area_sqm end \
                    )'
            }).values('areabase')
    	
        row.append(countsBase[0]['areabase'])

    	writer.writerow(row)
        loadingtime = time.time() - start
        xxx=xxx+1
        update_progress(float(float(xxx)/float(ppp)), aoi.dist_code, loadingtime)
    return