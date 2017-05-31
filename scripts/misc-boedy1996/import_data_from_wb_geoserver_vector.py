from xml.dom import minidom
import urllib2 
import urllib
import csv

# http://disasterrisk.af.geonode.org/geoserver/wfs?format_options=charset%3AUTF-8&typename=geonode%3Adrought_risk_affected_pop_class2&outputFormat=SHAPE-ZIP&version=1.0.0&service=WFS&request=GetFeature
xmldoc = minidom.parse('/Users/budi/Documents/iMMAP/DRR-datacenter/scripts/misc-boedy1996/geoserver_wb-GetCapabilities_vector.xml')
itemlist = xmldoc.getElementsByTagName('FeatureType')
i = 1
header = ['name', 'title', 'abstract']
with open('/Users/budi/Documents/uplaod document unanet/data_download/vector_meta.csv', 'wb') as csvFile:
	outputwriter = csv.writer(csvFile, delimiter=',')
	outputwriter.writerow(header)
	
	for s in itemlist:
		
		
		
		data_in = []
		# print(i, s.getElementsByTagName("Title")[0])
		name = s.getElementsByTagName("Name")	
		title = s.getElementsByTagName("Title")	
		abstract = s.getElementsByTagName("Abstract")
		data_in.append(name[0].firstChild.nodeValue.encode('ascii', 'ignore'))
		data_in.append(title[0].firstChild.nodeValue.encode('ascii', 'ignore'))
		data_in.append(abstract[0].firstChild.nodeValue.encode('ascii', 'ignore'))

		url = 'http://disasterrisk.af.geonode.org/geoserver/wfs?format_options=charset%3AUTF-8&outputFormat=SHAPE-ZIP&version=1.0.0&service=WFS&request=GetFeature&typename='+name[0].firstChild.nodeValue
		urllib.urlretrieve(url, '/Users/budi/Documents/uplaod document unanet/data_download/'+name[0].firstChild.nodeValue.encode('utf8')+'.zip')
		# print title[0].firstChild.nodeValue, abstract[0].firstChild.nodeValue
		# for t in test:
		# 	print t.firstChild.nodeValue

		i = i+1
		# http://disasterrisk.af.geonode.org:8080/geoserver/wcs?format=image%2Ftiff&request=GetCoverage&version=2.0.1&service=WCS&coverageid=geonode__wp6_hef_1000_healthcenter_count
	
		print data_in
		outputwriter.writerow( data_in )

	
	csvFile.close()		