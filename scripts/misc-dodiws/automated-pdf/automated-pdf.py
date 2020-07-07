'''
create pdf file for each district in districts.csv where column 'print' == 'yes'

Requirements:
edit privatedata.py login information

Usage:
python automated-pdf.py makecsv-districts
	make districts.csv
python automated-pdf.py makepdf-districts
	create pdf file for each district in districts.csv where column 'print' == 'yes'
python automated-pdf.py makecsv-provinces
	make provinces.csv
python automated-pdf.py makepdf-provinces
	create pdf file for each province in provinces.csv where column 'print' == 'yes'

Notes:
to add layer create new create.json file 

Troubleshooting:
if request to http://asdc.immap.org/geoserver/pdf/create.json failed, recreate create.json, previous file might be missing new attributes
'''

import os, sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from geodb.models import AfgAdmbndaAdm1, AfgAdmbndaAdm2
from django.contrib.gis.db.models import Extent
from django.contrib.gis.geos import Point, LineString, LinearRing, Polygon, GEOSGeometry
from string import Template
from time import gmtime, strftime
from django.contrib.gis.gdal import DataSource
import csv
import time
import datetime
import urllib, urllib2
import requests
import privatedata
import pprint
import json
import re
import math
import os.path

csv.register_dialect('minimalquote', quotechar="'", quoting=csv.QUOTE_MINIMAL)

folderbase = os.path.dirname(os.path.realpath(__file__))+'/'
folder_pdf = folderbase+'pdf/'
districts = []
provinces = []
drawareas = []
# frame = {'portrait':{'width': 2394.0, 'height': 2772.0}, 'landscape':{'width': 3020.0, 'height': 2191.0}} # frame size in pixel measured from created pdf file converted to image in 150 dpi A2 paper size
# frame size in pixel measured from created pdf file converted to image in 150 dpi
if len(sys.argv) > 3:
	dpi = sys.argv[3]
	paper_size = sys.argv[2]
else:    
	dpi = 300
	paper_size = 'A3'

frames = {
	'A1':{'portrait':{'width': 3409.0, 'height': 4210.0}, 'landscape':{'width': 4370.0, 'height': 3232.0}},
	'A2':{'portrait':{'width': 2394.0, 'height': 2772.0}, 'landscape':{'width': 3020.0, 'height': 2191.0}},
	'A3':{'portrait':{'width': 1664.0, 'height': 1814.0}, 'landscape':{'width': 1942.0, 'height': 1503.0}},
	'A4':{'portrait':{'width': 1162.0, 'height': 1064.0}, 'landscape':{'width': 1243.0, 'height': 1018.0}}
}
frame = frames[paper_size]

scales = [1000, 1500, 2500, 5000, 7500, 10000, 15000, 20000, 25000, 30000, 40000, 50000, 60000, 70000, 75000, 80000, 90000, 100000, 125000, 150000, 175000, 200000, 225000, 250000, 275000, 300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000, 525000, 550000, 575000, 600000, 625000, 650000, 675000, 700000, 725000, 750000, 850000, 1000000, 1250000, 1500000, 2000000, 2500000, 3000000, 3500000, 4000000, 4500000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000, 11000000, 12000000, 13000000, 14000000, 15000000, 16000000]
scaleratio = 4.5e-6
radtopixelratio_x = 1.5209135935789859e-09 # = boundary width in radian/(boundary width in pixel*scale)
radtopixelratio_y = 1.241717452991453e-09 # = boundary height in radian/(boundary height in pixel*scale)
createjsondata = ''
# createjsondata = r'{"units":"m","srs":"EPSG:900913","layout":"A2 landscape","dpi":150,"outputFilename":"\"iMMAP_AFG_Transportation network of Afghanistan_A2 landscape_map_2017-12-18\"","mapTitle":"Transportation network of Afghanistan","comment":"Gives the transportation network of Afghanistan as well as various points of interest.","layers":[{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":0,"singleTile":false,"type":"WMS","layers":["geonode:afg_ppla"],"format":"image/png8","styles":["polygon_nothing"],"customParams":{"TRANSPARENT":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_elev_dem_30m_aster_hillshade"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm1"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_riv"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"minScaleDenominator":0.520684892112729,"maxScaleDenominator":559081145.7863648,"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_rdsl"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrma"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_poia_buildings"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_hltfac"],"format":"image/png8","styles":["afg_hltfac_hospitals"],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_airdrmp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_pplp"],"format":"image/png8","styles":[""],"customParams":{"TRANSPARENT":true,"TILED":true}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","customParams":{"TRANSPARENT":true,"SLD_BODY":"<?xml version=\"1.0\" encoding=\"UTF-8\"?><sld:StyledLayerDescriptor xmlns=\"http://www.opengis.net/sld\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml\" version=\"1.0.0\"><sld:NamedLayer><sld:Name>geonode:afg_admbnda_adm2</sld:Name><sld:UserStyle><sld:Name>afg_admbnda_adm2</sld:Name><sld:IsDefault>1</sld:IsDefault><sld:FeatureTypeStyle><sld:Rule><sld:PolygonSymbolizer><sld:Fill><sld:CssParameter name=\"fill\">#FFFFFF</sld:CssParameter><sld:CssParameter name=\"fill-opacity\">0.5</sld:CssParameter></sld:Fill></sld:PolygonSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>","CQL_FILTER":"dist_code<>$dist_code"}},{"baseURL":"http://asdc.immap.org/geoserver/wms","opacity":1,"singleTile":false,"type":"WMS","layers":["geonode:afg_admbnda_adm2"],"format":"image/png8","customParams":{"TRANSPARENT":true,"SLD_BODY":"<?xml version=\"1.0\" encoding=\"UTF-8\"?><sld:StyledLayerDescriptor xmlns=\"http://www.opengis.net/sld\" xmlns:sld=\"http://www.opengis.net/sld\" xmlns:ogc=\"http://www.opengis.net/ogc\" xmlns:gml=\"http://www.opengis.net/gml\" version=\"1.0.0\"><sld:NamedLayer><sld:Name>geonode:afg_admbnda_adm2</sld:Name><sld:UserStyle><sld:Name>afg_admbnda_adm2</sld:Name><sld:IsDefault>1</sld:IsDefault><sld:FeatureTypeStyle><sld:Rule><sld:LineSymbolizer><sld:Stroke><sld:CssParameter name=\"stroke\">#0000FF</sld:CssParameter><sld:CssParameter name=\"stroke-width\">3</sld:CssParameter></sld:Stroke></sld:LineSymbolizer></sld:Rule></sld:FeatureTypeStyle></sld:UserStyle></sld:NamedLayer></sld:StyledLayerDescriptor>","CQL_FILTER":"dist_code=$dist_code"}}],"pages":[{"center":[7544465.2706235,4261242.1398269],"scale":350000,"bbox":[7455071.2029465,4196419.0935141,7633859.3383005,4326065.1861397],"rotation":0}],"legends":[{"name":"Settlements","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_pplp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]},{"name":"Airports/Airfields","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrmp&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]},{"name":"Health facilities (H1,2,3)","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_hltfac&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]},{"name":"Buildings/Structures","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_poia_buildings&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]},{"name":"Aerodrome","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_airdrma&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]},{"name":"Road network","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?EXCEPTIONS=application%2Fvnd.ogc.se_xml&TRANSPARENT=TRUE&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&TILED=true&LAYER=geonode%3Aafg_rdsl&STYLE=afg_rdsl_legend_osm&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000&width=12&height=12"]}]},{"name":"Rivers","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_riv&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]},{"name":"District boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm2&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]},{"name":"Provincial boundaries","classes":[{"name":"","icons":["http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&width=12&height=12&layer=geonode%3Aafg_admbnda_adm1&transparent=true&format=image%2Fpng&Language=en&legend_options=fontSize%3A5%3Bdpi%3A300&SCALE=350000"]}]}],"selectedBox":"66.97004406738378,35.2390820646417%2068.57612521368462,35.2390820646417%2068.57612521368462,36.18469657249865%2066.97004406738378,36.18469657249865%2066.97004406738378,35.2390820646417","showRiskTable":false,"mapID":"709"}'
timeout = 300
districts_keys = ['prov_code', 'prov_name', 'dist_code', 'dist_name', 'bbox', 'bbox4point', 'page_orientation', 'print']
provinces_keys = ['prov_code', 'prov_name', 'bbox', 'bbox4point', 'page_orientation', 'print']
drawarea_keys = ['print', 'title', 'wkt_drawarea', 'bbox', 'bbox4point', 'page_orientation']
debuglevel = 1 # [0-3]

polar_circumference = 1.57512e+9 # in inch

def make_districts_csv():
	global districts

	if debuglevel >= 1: start_time = time.time()
	if debuglevel >= 1: print 'timer start AfgAdmbndaAdm2 at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')
	a = AfgAdmbndaAdm2.objects.values('prov_code', 'prov_na_en', 'dist_code', 'dist_na_en').annotate(bbox=Extent('wkb_geometry')).order_by('prov_code', 'prov_na_en', 'dist_code', 'dist_na_en')
	if debuglevel >= 1: print("timer end AfgAdmbndaAdm2, %s seconds" % (time.time() - start_time))
	for r in a:
		bbox = list(r['bbox'])
		bbox_4point = [
		str(bbox[0])+','+str(bbox[1]),
		str(bbox[2])+','+str(bbox[1]),
		str(bbox[2])+','+str(bbox[3]),
		str(bbox[0])+','+str(bbox[3]),
		str(bbox[0])+','+str(bbox[1]),
		]
		width = bbox[2]-bbox[0]
		height = bbox[3]-bbox[1]
		page_orientation = 'landscape' if (width/radtopixelratio_x) > (height/radtopixelratio_y) else 'portrait'
		d = [r['prov_code'], r['prov_na_en'], r['dist_code'], r['dist_na_en'], ','.join(map(str, r['bbox'])), ' '.join(map(str, bbox_4point)), page_orientation, 'yes']
		districts.append(d)

	print 'write districts data to districts.csv'
	with open(folderbase+'districts.csv', 'w+') as f:
		csv.writer(f, dialect='minimalquote').writerows([districts_keys]+districts)

def make_provinces_csv():
	global provinces

	if debuglevel >= 1: start_time = time.time()
	if debuglevel >= 1: print 'timer start AfgAdmbndaAdm1 at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')
	a = AfgAdmbndaAdm1.objects.values('prov_code', 'prov_na_en').annotate(bbox=Extent('wkb_geometry')).order_by('prov_code', 'prov_na_en')
	if debuglevel >= 1: print("timer end AfgAdmbndaAdm1, %s seconds" % (time.time() - start_time))
	for r in a:
		bbox = list(r['bbox'])
		bbox_4point = [
			str(bbox[0])+','+str(bbox[1]),
			str(bbox[2])+','+str(bbox[1]),
			str(bbox[2])+','+str(bbox[3]),
			str(bbox[0])+','+str(bbox[3]),
			str(bbox[0])+','+str(bbox[1]),
		]
		width = bbox[2]-bbox[0]
		height = bbox[3]-bbox[1]
		page_orientation = 'landscape' if (width/radtopixelratio_x) > (height/radtopixelratio_y) else 'portrait'
		d = [r['prov_code'], r['prov_na_en'], ','.join(map(str, r['bbox'])), ' '.join(map(str, bbox_4point)), page_orientation, 'yes']
		provinces.append(d)

	print 'write provinces data to provinces.csv'
	with open(folderbase+'provinces.csv', 'w+') as f:
		csv.writer(f, dialect='minimalquote').writerows([provinces_keys]+provinces)

def make_drawarea_csv():
	'''
	TODO:
	- calculate wkt_drawarea from shapefile, geojson, or wkt input file in srid 4326
	  for shapefile use:
		from django.contrib.gis.gdal import DataSource
		ds = DataSource('test_poly.shp')
		layer = ds[0]
	  for geojson file use:
		with open('file.json', 'r') as f:
			j = json.load(f)
	  for wkt file use:
		with open('file.wkt', 'r') as f:
			g = GEOSGeometry(f.read())
	  transform to srid 4326 if necessary:
		GEOSGeometry.transform(4326)
	- calculate bbox using GEOSGeometry.extent
	- calculate bbox_4point using Polygon.from_bbox(GEOSGeometry.extent)
	- calculate page_orientation
	- put above values into drawarea.csv in column wkt_drawarea, bbox, bbox_4point, page_orientation
	'''
	shapefile_fullname = '/home/dodi/Downloads/mitigation_area_iom_201317.shp'
	ds = DataSource(shapefile_fullname)
	layer = ds[0]
	idx_title = layer.fields.index("Title_2")
	for feature in layer:
		extent = feature.geom.extent
		extent = resize_extent(extent, 2)
		bbox = ','.join(map(str, extent))
		page_orientation = get_page_orientation_from_extent(extent)
		title = feature[idx_title]
		d = ['yes', title, feature.geom.wkt, bbox, bbox4point_from_extent(extent), page_orientation]
		drawareas.append(d)

	with open(folderbase+'drawarea.csv', 'w+') as f:
		csv.writer(f, dialect='minimalquote').writerows([drawarea_keys]+drawareas)

def resize_extent(extent, ratio):
	width = extent[2]-extent[0]
	height = extent[3]-extent[1]
	delta_width = (width * (ratio - 1)) / 2
	delta_height = (height * (ratio - 1)) / 2
	new_extent = (
		extent[0] - delta_width,
		extent[1] - delta_height,
		extent[2] + delta_width,
		extent[3] + delta_height
		)    
	return new_extent
	
def get_page_orientation_from_extent(extent):
	width = extent[2]-extent[0]
	height = extent[3]-extent[1]
	return 'landscape' if (width/radtopixelratio_x) > (height/radtopixelratio_y) else 'portrait'
	
def bbox4point_from_extent(extent):
	p = Polygon.from_bbox(extent)
	bbox4point = ' '.join([','.join(map(str, c)) for c in p.coords[0]])
	return bbox4point

def get_pdf(areadata={}):

	session2 = session_asdc
	if debuglevel >= 1: print '{area_type} {area_code} {area_name}'.format(**areadata)

	# prepare post data for geoserver request to create map pdf
	mappdf_requestdata_str = Template(areadata['createjson']).substitute(**areadata)
	mappdf_requestdata = json.loads(mappdf_requestdata_str)
	areadata['multipdf_url_add'] = ''
	if (areadata['area_type'] == 'drawarea'):
		poly = GEOSGeometry(areadata['wkt_drawarea'], srid=4326)
		areadata['multipdf_url_add'] = '&flag=drawArea&filter={0}'.format(urllib.quote(poly.ewkt))
		poly.transform(3857)
		mappdf_requestdata['layers'][-1]['geoJson']['features'][0]['geometry']['coordinates'][1] = list(poly[0])
	elif (areadata['area_type'] in ['district', 'province']):
		areadata['multipdf_url_add'] = '&code={0}'.format(areadata[areadata['key_prefix']+'_code'])

	# transform projection from srid 4326 to 3857
	if debuglevel >= 2: print 'areadata[\'bbox\']', areadata['bbox']
	bboxlist = map(float, areadata['bbox'].split(","))
	if debuglevel >= 2: print 'bboxlist', bboxlist
	p = Point(bboxlist[0], bboxlist[1], srid=4326)
	p.transform(3857)
	p2 = Point(bboxlist[2], bboxlist[3], srid=4326)
	p2.transform(3857)

	mappdf_requestdata['pages'][0]['bbox'] = [p.x, p.y, p2.x, p2.y]
	if debuglevel >= 3: print 'mappdf_requestdata[\'pages\'][0][\'bbox\']', mappdf_requestdata['pages'][0]['bbox']
	mappdf_requestdata['pages'][0]['center'] = [(p.x+p2.x)/2, (p.y+p2.y)/2]
	width = bboxlist[2]-bboxlist[0]
	height = bboxlist[3]-bboxlist[1]
	# lengthNorthSouth = height * (polar_circumference/(2*math.pi))
	if debuglevel >= 3: print 'radian width', width
	if debuglevel >= 3: print 'radian height', height
	if debuglevel >= 3: print 'areadata[\'page_orientation\']', areadata['page_orientation']
	frame_width = frame[areadata['page_orientation']]['width']
	frame_height = frame[areadata['page_orientation']]['height']
	if debuglevel >= 3: print 'frame_width', frame_width
	if debuglevel >= 3: print 'frame_height', frame_height
	if debuglevel >= 3: print 'if ((frame_width < (width/(scale*radtopixelratio_x))) and (frame_height < (height/(scale*radtopixelratio_y)))))'
	for scale in scales:
		geomwidth_px = width/(scale*radtopixelratio_x)
		geomheight_px = height/(scale*radtopixelratio_y)
		if debuglevel >= 3: print 'if ((({0} > ({1}/({2}*{3}))) and (({4} > ({5}/({6}*{7})))) '.format(frame_width,width,scale,radtopixelratio_x,frame_height,height,scale,radtopixelratio_y)
		if debuglevel >= 3: print 'if (({0} > ({1})) and ({2} > ({3})))'.format(frame_width,geomwidth_px,frame_height,geomheight_px)
		# select scale where geometry fit inside frame
		if ((frame_width > geomwidth_px) and (frame_height > geomheight_px)):
			mappdf_requestdata['pages'][0]['scale'] = scale
			# mappdf_requestdata['pages'][0]['scale'] = 200000
			if debuglevel >= 1: print 'scale', mappdf_requestdata['pages'][0]['scale']
			break
	mappdf_requestdata['selectedBox'] = urllib.quote(areadata['bbox4point'], ',')
	mappdf_requestdata['mapTitle'] = areadata['title']
	mappdf_requestdata['comment'] = areadata['title']
	mappdf_requestdata['dpi'] = dpi
	mappdf_requestdata['layout'] = '{paper_size} {page_orientation}'.format(**dict(areadata, **{'paper_size':paper_size}))
	if debuglevel >= 3: pprint.pprint(mappdf_requestdata)
	mappdf_response = session2.post('http://asdc.immap.org/geoserver/pdf/create.json', data=json.dumps(mappdf_requestdata))
	if debuglevel >= 2: print 'request make map pdf', mappdf_response
	if mappdf_response.status_code != 200:
		print 'request server to make map pdf failed on {area_type} {area_name} code {area_code}'.format(**areadata)
		if debuglevel >= 1: print 'reason', '\n', mappdf_response.reason
		if debuglevel >= 2: print 'response content', '\n', mappdf_response.content
		return

	# command server to combine map and dashboard pdfs
	multipdf_requestdata_tpl = Template('{"urls":[null,$baseline,$accesibility,null,$floodrisk,null,$avalancherisk,$earthquake,$security,$landslide,$drought],"fileName":"$filename","mapTitle":"$mapTitle","mapUrl":"$mapUrl"}')
	mappdf_responsecontent = json.loads(mappdf_response.content)
	multipdf_requestdata = multipdf_requestdata_tpl.substitute(
		mapUrl=mappdf_responsecontent['getURL'],
		mapTitle = areadata['title'],
		filename = urllib.quote(areadata['file_name']),
		baseline='null',
		accesibility='null',
		# floodrisk='null',
		avalancherisk='null',
		earthquake='null',
		security='null',
		landslide='null',
		drought='null',
		# baseline='"?page=baseline&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		# accesibility='"?page=accessibility&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		floodrisk='"?page=floodrisk&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		# avalancherisk='"?page=avalancherisk&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		# earthquake='"?page=earthquake&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		# security='"?page=security&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		# landslide='"?page=landslide&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		# drought='"?page=drought&pdf=true&date={date_now}{multipdf_url_add}"'.format(**areadata),
		)
	response = session2.post('http://asdc.immap.org/dashboard/multiple?hideuserinfo=true', data=multipdf_requestdata, timeout=timeout)

	# get combined pdf
	if debuglevel >= 2: print 'request combine multiple pdf', response
	if debuglevel >= 1: print 'request combine multiple pdf finish at', datetime.datetime.now().strftime('%H:%M:%S')
	if response.status_code != 200:
		print 'request server to combine multiple pdf failed on {area_type} {area_name} code {area_code}'.format(**areadata)
		if debuglevel >= 1: print 'reason', '\n', response.reason
		if debuglevel >= 2: print 'response content', '\n', response.content
		return
	combined_pdf_name = json.loads(response.content).get('filename')
	tpl = Template('http://asdc.immap.org/dashboard/downloadPDFFile?filename=$filename&filenameoutput=$filenameoutput&hideuserinfo=true')
	url = tpl.substitute(
		filename = combined_pdf_name,
		filenameoutput = areadata['file_name']
		)
	response = session2.get(url)

	return response.content

def get_login_session(url = 'http://localhost:8000/account/login/'):
	if debuglevel >= 1: start_time = time.time()
	if debuglevel >= 1: print 'timer start get_login_session at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')
	session = requests.session()
	session.get(url)
	login_data = {
		'csrfmiddlewaretoken': session.cookies.get('csrftoken'),
		'username': privatedata.login_data['username'],
		'password': privatedata.login_data['password'],
		}
	r = session.post(url, data=login_data)
	if not session.cookies.get('sessionid'):
		print 'Warning: no sessionid after login attempt, login probably failed.'
	if debuglevel >= 1: print("timer end get_login_session, %s seconds" % (time.time() - start_time))
	return session

def make_districts_pdf():
	areadata = {
			'csv_file': 'districts.csv',
			'createjson_file': 'create.json',
			'mask_sld_file': 'mask_district.sld',
			'outline_sld_file': 'outline_district.sld',
			# 'title_tpl': 'Overview Province {prov_name} - District {dist_name}',
			'title_tpl': '{prov_name} Province {dist_name} District Flood Risk',
			'area_type': 'district',
			'key_prefix': 'dist',
			'pk_column': 'dist_code',
			'folder_pdf_area': folder_pdf+'district/',
			'csv_headers': districts_keys,
			'key_adm_code': 'dist_code',
			'adm_layer_name': 'geonode:afg_admbnda_adm2',
			}
	make_admarea_pdf(areadata)

def make_provinces_pdf():
	areadata = {
			'csv_file': 'provinces.csv',
			'createjson_file': 'create.json',
			'mask_sld_file': 'mask_province.sld',
			'outline_sld_file': 'outline_province.sld',
			'title_tpl': '{prov_name} Province Hospitals Accessibility (Tier All)',
			'area_type': 'province',
			'key_prefix': 'prov',
			'pk_column': 'prov_code',
			'folder_pdf_area': folder_pdf+'province/',
			'csv_headers': provinces_keys,
			'key_adm_code': 'prov_code',
			'adm_layer_name': 'geonode:afg_admbnda_adm1',
			}
	make_admarea_pdf(areadata)

def make_drawarea_pdf():
	areadata = {
			'csv_file': 'drawarea.csv',
			'createjson_file': 'create_drawarea.json',
			# 'mask_sld_file': 'mask_province.sld',
			# 'outline_sld_file': 'outline_province.sld',
			'title_tpl': '{title}',
			'area_type': 'drawarea',
			'key_prefix': '',
			'pk_column': 'wkt_drawarea',
			'folder_pdf_area': folder_pdf+'drawarea/',
			'csv_headers': drawarea_keys,
			# 'key_adm_code': 'prov_code',
			# 'adm_layer_name': 'geonode:afg_admbnda_adm1',
			}
	make_admarea_pdf(areadata)

def make_admarea_pdf(areadata):
	print_counter = 0
	print 'create pdf file for each {area_type} in {csv_file} where column \'print\' == \'yes\''.format(**areadata)
	print 'folder pdf is', areadata['folder_pdf_area']
	if not os.path.isfile(folderbase+areadata['csv_file']):
		print '{csv_file} not found'.format(**areadata)
		return
	with open(folderbase+areadata['createjson_file'], 'r') as f:
		areadata['createjson'] = ''.join([x.strip() for x in f.readlines()])
		if debuglevel >= 2: print 'createjson\n', areadata['createjson']
	if areadata.get('mask_sld_file'):
		with open(folderbase+areadata['mask_sld_file'], 'r') as f:
			areadata['mask_sld'] = ''.join([x.strip() for x in f.readlines()]).replace('"', '\\"')
			if debuglevel >= 2: print areadata['mask_sld_file']+'\n', areadata['mask_sld']
	if areadata.get('outline_sld_file'):
		with open(folderbase+areadata['outline_sld_file'], 'r') as f:
			areadata['outline_sld'] = ''.join([x.strip() for x in f.readlines()]).replace('"', '\\"')
			if debuglevel >= 2: print areadata['outline_sld_file']+'\n', areadata['outline_sld']

	with open(folderbase+areadata['csv_file'], 'r') as f:
		has_header = csv.Sniffer().has_header(f.read(1024))
		f.seek(0)  # Rewind.
		reader = csv.reader(f, dialect='minimalquote')
		if has_header:
			next(reader)  # Skip header row.
		areas = [dict(zip(areadata['csv_headers'], d)) for d in reader]
		areas_print = (x for x in areas if x.get('print', '').strip().lower() == 'yes')
	
	for d in areas_print:
		areadata['title'] = areadata['title_tpl'].format(**d)
		areadata['file_name'] = re.sub(r'[^a-zA-Z0-9]+', '_', areadata['title']).strip('_')+'.pdf'
		areadata['date_now'] = strftime("%Y-%m-%d", gmtime())
		areadata['datetime_now'] = strftime("%Y-%m-%d %H-%M-%S", gmtime())
		areadata['area_code'] = d.get(areadata.get('key_prefix')+'_code')
		areadata['area_name'] = d.get(areadata.get('key_prefix')+'_name')
		start_time = time.time()
		if debuglevel >= 1: print 'timer start get_pdf at', datetime.datetime.fromtimestamp(int(start_time)).strftime('%H:%M:%S')
		file_content = get_pdf(dict(d, **areadata))
		get_pdf_time = time.time() - start_time
		if debuglevel >= 1: print("timer end get_pdf, %s seconds" % (get_pdf_time))
		if file_content:
			with open(areadata['folder_pdf_area']+areadata['file_name'], 'w+') as f:
				if isinstance(file_content, unicode):
					file_content = file_content.encode('utf-8')
				f.write(file_content)
				print_counter += 1
				print print_counter, 'code='+str(areadata['area_code']), areadata['area_name'], areadata['file_name'], '%.2f seconds' % round(get_pdf_time,2)

				# if pdf created succesfully set 'print' = 'no' in csv
				with open(folderbase+areadata['csv_file'], 'r+') as f:
					has_header = csv.Sniffer().has_header(f.read(1024))
					f.seek(0)  # Rewind.
					reader = csv.reader(f, dialect='minimalquote')
					if has_header:
						next(reader)  # Skip header row.
					areas = list(reader)
					pk_column = areadata['pk_column']
					idx_pk_column = areadata['csv_headers'].index(pk_column)
					r = next((x for x in areas if x[idx_pk_column] == d[pk_column]), None)
					r[areadata['csv_headers'].index('print')] = 'no'
					f.seek(0)
					csv.writer(f, dialect='minimalquote').writerows([areadata['csv_headers']]+areas)
					f.truncate()
	else:
		print 'pdf created:', print_counter

session_asdc = get_login_session('http://asdc.immap.org/account/login/')

if len(sys.argv) > 1 and sys.argv[1] == 'makecsv-districts':
	make_districts_csv()
elif len(sys.argv) > 1 and sys.argv[1] == 'makecsv-provinces':
	make_provinces_csv()
elif len(sys.argv) > 1 and sys.argv[1] == 'makecsv-drawarea':
	make_drawarea_csv()
elif len(sys.argv) > 1 and sys.argv[1] == 'makepdf-districts':
	make_districts_pdf()
elif len(sys.argv) > 1 and sys.argv[1] == 'makepdf-provinces':
	make_provinces_pdf()
elif len(sys.argv) > 1 and sys.argv[1] == 'makepdf-drawarea':
	make_drawarea_pdf()
else:
	print 'options are: makecsv-districts, makecsv-provinces, makecsv-drawarea, makepdf-districts <papersize> <dpi>, makepdf-provinces <papersize> <dpi>, makepdf-drawarea <papersize> <dpi>'
