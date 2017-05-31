from xml.dom import minidom
import urllib2 
import urllib

itemlist = [
	# 'geonode:edl_population_count',
	# 'geonode:wp6_spl_0100',
	# 'geonode:wp6_spl_0250',
	# 'geonode:wp6_spl_0500',
	# 'geonode:wp6_spl_1000',
	'geonode:6b_spl_0250',
	# 'geonode:wp6b_spl_0500',
	# 'geonode:wp6b_spl_1000',
	# 'geonode:wp4_spl_s1',
	# 'geonode:wp4_spl_s2',
	# 'geonode:wp4_spl_s3',
	# 'geonode:wp5_swe_spl_probability_0100',
	# 'geonode:wp2_spl_0005',
	# 'geonode:wp2_spl_0010',
	# 'geonode:wp2_spl_0020',
	# 'geonode:wp2_spl_0050',
	# 'geonode:wp2_spl_0100',
	# 'geonode:wp2_spl_0500'
]

# xmldoc = minidom.parse('/Users/budi/Documents/iMMAP/DRR-datacenter/scripts/misc-boedy1996/geoserver_wb-GetCapabilities.xml')
# itemlist = xmldoc.getElementsByTagName('wcs:CoverageId')
i = 1
for s in itemlist:
	# url = 'http://disasterrisk.af.geonode.org:8080/geoserver/wcs?format=image%2Ftiff&request=GetCoverage&version=2.0.1&service=WCS&coverageid='+s.firstChild.nodeValue
	# urllib.urlretrieve(url, '/Users/budi/Documents/uplaod document unanet/data_download/'+s.firstChild.nodeValue+'.tif')
	url = 'http://disasterrisk.af.geonode.org:8080/geoserver/wcs?format=image%2Ftiff&request=GetCoverage&version=2.0.1&service=WCS&coverageid='+s
	urllib.urlretrieve(url, '/Users/budi/Documents/uplaod document unanet/data_download/raster/'+s+'.tif')

	print(i, s)

	i = i+1
	# http://disasterrisk.af.geonode.org:8080/geoserver/wcs?format=image%2Ftiff&request=GetCoverage&version=2.0.1&service=WCS&coverageid=geonode__wp6_hef_1000_healthcenter_count