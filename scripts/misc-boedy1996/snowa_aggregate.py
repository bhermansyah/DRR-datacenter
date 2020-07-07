import os,sys
import csv, json
from calendar import monthrange
import datetime
import gzip
import subprocess
import glob
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")
# from django.conf import settings
from ftplib import FTP

GS_TMP_DIR = '/home/ubuntu/SnowCover/' # in production
initial_data_path = "/home/ubuntu/DRR-datacenter/geodb/initialdata/" # Production
gdal_path = '/usr/bin/' # production

# GS_TMP_DIR = '/Users/immap/Desktop/SnowCover/' # in development
# initial_data_path = "/Users/immap/DRR-datacenter/geodb/initialdata/" # in developement
# gdal_path = '/usr/local/bin/' # development

def cleantmpfile(filepattern):

    tmpfilelist = glob.glob("{}*.*".format(
        os.path.join(GS_TMP_DIR, filepattern)))
    for f in tmpfilelist:
        os.remove(f)

year_start = 2015
year_stop  = 2020

months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

base_url = 'sidads.colorado.edu'
filelist=[]

number_of_day_annually = 0
anually_target_filename = 'snowa_1km_annually_coverage.tif'

annually_data_first = True

month_number = 1
for month in months:
	number_of_day_monthly = 0
	first = True
	monthly_target_filename = 'snowa_1km_monthly_coverage_%s.tif' % (month) 
	for year in range(year_start, year_stop):
		# print str(month_number) + ' ' + month + ' - ' + str(year) + ' ' + str(monthrange(year, month_number)[1])
		for day in range(1,monthrange(year, month_number)[1]+1):
			d = datetime.date(year, month_number, day)
			day_number = d.strftime('%j')

			print day_number

			ftp = FTP(base_url)
			ftp.login()
			ftp.cwd("pub/DATASETS/NOAA/G02156/GIS/1km/"+ "{year}/".format(year=year))
			# ftp.retrlines('LIST',filelist.append)
			filename = 'ims%s%s_1km_GIS_v1.3.tif.gz' % (year,day_number)
			ftp.retrbinary("RETR " + filename, open(os.path.join(GS_TMP_DIR,filename),"wb").write)

			decompressedFile = gzip.GzipFile(os.path.join(GS_TMP_DIR,filename), 'rb')
			s=decompressedFile.read()
			decompressedFile.close()
			outF = file(os.path.join(GS_TMP_DIR,filename[:-3]), 'wb')
			outF.write(s)
			outF.close()

			ftp.quit()

			subprocess.call('%s -te 2438000 4432000 4429000 6301000 %s %s' %(os.path.join(gdal_path,'gdalwarp'), os.path.join(GS_TMP_DIR,filename[:-3]), os.path.join(GS_TMP_DIR,filename[:-7])+'_cropped.tif'),shell=True)
			subprocess.call('%s -t_srs EPSG:4326 %s %s' %(os.path.join(gdal_path,'gdalwarp'), os.path.join(GS_TMP_DIR,filename[:-7])+'_cropped.tif', os.path.join(GS_TMP_DIR,filename[:-7])+'_reproj.tif'),shell=True)
			subprocess.call('%s -cutline %s -crop_to_cutline %s %s' %(os.path.join(gdal_path,'gdalwarp'), os.path.join(initial_data_path,'afg_admbnda_int.shp'), os.path.join(GS_TMP_DIR,filename[:-7])+'_reproj.tif', os.path.join(GS_TMP_DIR,filename[:-7])+'_cropped_afg.tif'),shell=True)

			subprocess.call('%s -A %s --outfile=%s --overwrite --calc="(A<=3)*0 + (A>3)*1"' %(os.path.join(gdal_path,'gdal_calc.py'), os.path.join(GS_TMP_DIR,filename[:-7])+'_cropped_afg.tif', os.path.join(GS_TMP_DIR,'ims_'+monthly_target_filename)),shell=True)

			if first:
				subprocess.call('%s -A %s --outfile=%s --overwrite --calc="A"' %(os.path.join(gdal_path,'gdal_calc.py'), os.path.join(GS_TMP_DIR,'ims_'+monthly_target_filename), os.path.join(GS_TMP_DIR, monthly_target_filename)),shell=True)
			else:
				subprocess.call('%s -A %s -B %s --outfile=%s --overwrite --calc="A+B"' %(os.path.join(gdal_path,'gdal_calc.py'), os.path.join(GS_TMP_DIR,'ims_'+monthly_target_filename), os.path.join(GS_TMP_DIR, monthly_target_filename), os.path.join(GS_TMP_DIR, monthly_target_filename)),shell=True)	

			if annually_data_first:
				subprocess.call('%s -A %s --outfile=%s --overwrite --calc="A"' %(os.path.join(gdal_path,'gdal_calc.py'), os.path.join(GS_TMP_DIR, monthly_target_filename), os.path.join(GS_TMP_DIR, anually_target_filename)),shell=True)
			else:
				subprocess.call('%s -A %s -B %s --outfile=%s --overwrite --calc="A+B"' %(os.path.join(gdal_path,'gdal_calc.py'), os.path.join(GS_TMP_DIR,monthly_target_filename), os.path.join(GS_TMP_DIR, anually_target_filename), os.path.join(GS_TMP_DIR, anually_target_filename)),shell=True)		

			number_of_day_monthly  += 1
			number_of_day_annually += 1
			print 'number_of_day_annually : '+str(number_of_day_annually)
			print 'number_of_day_monthly :' +str(number_of_day_monthly)
			cleantmpfile('ims')
	month_number += 1




