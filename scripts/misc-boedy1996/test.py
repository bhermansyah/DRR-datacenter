import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from netCDF4 import Dataset, num2date
import numpy as np
import csv
from geodb.models import AfgBasinLvl4GlofasPoint, Glofasintegrated
from django.contrib.gis.geos import Point




filename = "/Users/budi/Desktop/from_ecmwf/glofas_arealist_for_IMMAP_in_Afghanistan_2017052900.nc"
nc = Dataset(filename, 'r', Format='NETCDF4')
# print nc.variables
# print 'Variable List'
for var in nc.variables:
    print var#, var.units, var.shape


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


for i in nc.variables:
	print(i, nc.variables[i].shape)



print nc.variables['ensemble'][:]
d = np.array(nc.variables['dis'])
# print(d[5,7,13])




# # write to file
# 
# header = ['Latitude', 'Longitude', 'rl2']
header = ['Latitude', 'Longitude', 'rl2', 'rl5', 'rl20', 'rl2_dis_percent', 'rl2_avg_dis_percent', 'rl5_dis_percent', 'rl5_avg_dis_percent', 'rl20_dis_percent', 'rl20_avg_dis_percent']
# for i,j in enumerate(times):
# 	header.append(i+1)
# print header
times_index=[]
for i,j in enumerate(times):
    times_index.append(i)


with open('/Users/budi/Downloads/RL2_Output.csv', 'wb') as csvFile:
    outputwriter = csv.writer(csvFile, delimiter=',')
    outputwriter.writerow(header)
    coord_index = 0
    
    for lat, lon, rl2, rl5, rl20 in zip(lats, lons, rl2, rl5, rl20):


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

        # for j in d[9,:,coord_index]:
        # 	# data_in.append(d[1,:,coord_index])
        # 	data_in.append(j)	

        if coord_index>2035 and max(rl2_dis_percent)>0:
            pnt = Point(round(float(lon),2), round(float(lat),2), srid=4326)
            checkdata = AfgBasinLvl4GlofasPoint.objects.filter(geom__intersects=pnt)
            for z in checkdata:
                p = Glofasintegrated(basin_id=z.value, datadate='2017-05-29', lon=lon, lat=lat, rl2=rl2, rl5=rl5, rl20=rl20, rl2_dis_percent=max(rl2_dis_percent), rl2_avg_dis_percent=rl2_avg_dis_percent, rl5_dis_percent=max(rl5_dis_percent), rl5_avg_dis_percent=rl5_avg_dis_percent, rl20_dis_percent=max(rl20_dis_percent), rl20_avg_dis_percent=rl20_avg_dis_percent)
                p.save()
                print coord_index, z.value

        outputwriter.writerow( data_in )
        coord_index = coord_index+1

# # close the output file
csvFile.close()




# close netcdf
nc.close()    