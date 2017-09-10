import os, sys
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

import csv
from django.db import connection, connections
from django.conf import settings

from geodb.models import Glofasintegrated, AfgBasinLvl4GlofasPoint
from netCDF4 import Dataset, num2date
import numpy as np

from django.contrib.gis.geos import Point

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
	# print data['67.75']['31.85']
	return data

def calculate_glofas_params(date):

    date_arr = date.split('-')
    filename = getattr(settings, 'GLOFAS_NC_FILES')+date_arr[0]+date_arr[1]+date_arr[2]+"00.nc"
    # print Glofasintegrated.objects.latest('datadate').date

    nc = Dataset(filename, 'r', Format='NETCDF4')

    # get coordinates variables
    lats = nc.variables['lat'][:]
    lons = nc.variables['lon'][:]

    rl2s= nc.variables['rl2'][:]
    rl5s= nc.variables['rl5'][:]
    rl20s= nc.variables['rl20'][:]
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

    for lat, lon, rl2, rl5, rl20 in zip(lats, lons, rl2s, rl5s, rl20s):
    	# print str(lat), str(lon)
    	
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

        # print rl2,rl5,rl20, refactor[str(lat)][str(lon)]['rl2_factor']

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
                print coord_index, z.value

        coord_index = coord_index+1
        # print data_in

    # print Glofasintegrated.objects.filter(datadate=date).count()
    # if Glofasintegrated.objects.filter(datadate=date).count() == 0 :
    #     Glofasintegrated(datadate=date).save()

    nc.close()

Glofasintegrated.objects.filter(datadate='2017-04-13').delete()
calculate_glofas_params('2017-04-13')
# px = Glofasintegrated.objects.order_by().values('datadate').distinct()
# for i in px:
# 	print str(i['datadate'])
# 	Glofasintegrated.objects.filter(datadate=i['datadate']).delete()
# 	calculate_glofas_params(str(i['datadate']))





