import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from netCDF4 import Dataset, num2date
import numpy as np

import matplotlib.mlab as mlab
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker


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

filename = "/Users/budi/Desktop/from_ecmwf/glofas_arealist_for_IMMAP_in_Afghanistan_2017041900.nc"
nc = Dataset(filename, 'r', Format='NETCDF4')

# get coordinates variables
lats = nc.variables['lat'][:]
lons = nc.variables['lon'][:]
times= nc.variables['time'][:]

lat_idx = np.where(lats==43.85)[0]
lon_idx = np.where(lons==77.95)[0]

coord_idx = list(set(lat_idx) & set(lon_idx))[0]

d = np.array(nc.variables['dis'])

rl2= nc.variables['rl2'][:]
rl5= nc.variables['rl5'][:]
rl20= nc.variables['rl20'][:]

units = nc.variables['time'].units
dates = num2date (times[:], units=units, calendar='365_day')
date_arr = []

median = []
mean75 = []
mean25 = []
rl2_arr = []
rl5_arr = []
rl20_arr = []
maximum = []

date_number = []
month_name = []
for i in dates:
	date_number.append(i.day)
	month_name.append(i.month)


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


plt.fill_between(date_arr, rl2_arr, rl5_arr, color='#fff68f', alpha=1, label="2 years return period")
plt.fill_between(date_arr, rl5_arr, rl20_arr, color='#ffaeb9', alpha=1, label="5 years return period")
plt.fill_between(date_arr, rl20_arr, np.max(maximum)+100, color='#ffbbff', alpha=1, label="20 years return period")


plt.plot(date_arr, median, c='black', alpha=1, linestyle='solid', label="EPS mean") 
plt.plot(date_arr, mean75, color='black', alpha=1, linestyle='dashed', label="25% - 75%")
plt.plot(date_arr, mean25, color='black', alpha=1, linestyle='dashed')

for i in range(51):
	plt.fill_between(date_arr, median, list(d[:,i,coord_idx]), color='#178bff', alpha=0.05)

plt.margins(x=0,y=0,tight=True)

plt.xticks(date_arr, date_number, rotation=45)
plt.ylabel('discharge (m$^3$/s)')

if max(month_name)==min(month_name):
	plt.xlabel('Period of '+get_month_name(max(month_name)))
else:
	plt.xlabel('Period of '+get_month_name(min(month_name))+' - '+get_month_name(max(month_name)))	

plt.grid(True, 'major', 'y', ls='--', lw=.5, c='k', alpha=.2)
plt.grid(True, 'major', 'x', ls='--', lw=.5, c='k', alpha=.2)

leg = plt.legend(prop={'size':6})
leg.get_frame().set_alpha(0)

plt.show()
