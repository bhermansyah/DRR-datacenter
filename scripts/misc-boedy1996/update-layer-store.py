import os,sys
import csv, json
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

#import geonode.base.models
from geonode.maps.models import MapLayer
from geonode.layers.models import Layer

all_data = MapLayer.objects.all().exclude(group='background')

for i in all_data:
	st = json.loads(i.layer_params)
	# print st['capability']['abstract']
	xx = Layer.objects.filter(typename=i.name)
	# print xx[0].abstract
	st['capability']['abstract'] = xx[0].abstract
	to_edit = MapLayer.objects.get(pk=i.pk)
	print to_edit
	to_edit.layer_params = json.dumps(st)
	to_edit.save()


# {"selected": false, "attribution": "<span class='gx-attribution-title'>admin</span>", "title": "Population density districts", "cached": true, "capability": {"abstract": "No abstract provided", "nestedLayers": [], "cascaded": 0, "fixedHeight": 0, "prefix": "geonode", "keywords": ["features", "population_density_districts"], "noSubsets": false, "dimensions": {}, "opaque": false, "infoFormats": ["text/plain", "application/vnd.ogc.gml", "text/xml", "application/vnd.ogc.gml/3.1.1", "text/xml; subtype=gml/3.1.1", "text/html", "application/json"], "styles": [{"abstract": "", "legend": {"width": "74", "format": "image/png", "href": "http://asdc.immap.org/geoserver/wms?request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=geonode%3Apopulation_density_districts", "height": "100"}, "name": "population_density_districts", "title": "current river flood forecasted district area"}], "attribution": {"title": "admin"}, "authorityURLs": {}, "bbox": {"EPSG:4326": {"srs": "EPSG:4326", "bbox": [60.4719772600001, 29.3770600820001, 74.8895617910001, 38.4907374680001]}}, "fixedWidth": 0, "metadataURLs": [{"href": "http://asdc.immap.orgcatalogue/csw?outputschema=http%3A%2F%2Fwww.opengis.net%2Fcat%2Fcsw%2Fcsdgm&service=CSW&request=GetRecordById&version=2.0.2&elementsetname=full&id=8d293837-4c45-42c8-bc15-2da4e6b024af", "type": "FGDC", "format": "text/xml"}], "name": "geonode:population_density_districts", "identifiers": {}, "srs": {"EPSG:900913": true}, "formats": ["image/png", "application/atom xml", "application/atom+xml", "application/openlayers", "application/pdf", "application/rss xml", "application/rss+xml", "application/vnd.google-earth.kml", "application/vnd.google-earth.kml xml", "application/vnd.google-earth.kml+xml", "application/vnd.google-earth.kml+xml;mode=networklink", "application/vnd.google-earth.kmz", "application/vnd.google-earth.kmz xml", "application/vnd.google-earth.kmz+xml", "application/vnd.google-earth.kmz;mode=networklink", "atom", "image/geotiff", "image/geotiff8", "image/gif", "image/gif;subtype=animated", "image/jpeg", "image/png8", "image/png; mode=8bit", "image/svg", "image/svg xml", "image/svg+xml", "image/tiff", "image/tiff8", "kml", "kmz", "openlayers", "rss", "text/html; subtype=openlayers"], "title": "Population density districts", "queryable": true, "llbbox": [60.4719772600001, 29.3770600820001, 74.8895617910001, 38.4907374680001]}, "tiled": true}