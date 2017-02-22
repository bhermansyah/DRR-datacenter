from __future__ import absolute_import

import logging
import os
import datetime
import calendar
import struct
import re
import requests
from bs4 import BeautifulSoup as bs
from dataqs.helpers import gdal_translate
from dataqs.processor_base import GeoDataProcessor
from osgeo import gdal

from datetime import timedelta
import subprocess, sys

from geodb.models import AfgShedaLvl4, Forcastedvalue, forecastedLastUpdate
import csv

import fiona
from shapely.geometry import shape, mapping
import rtree

logger = logging.getLogger("dataqs.processors")

class GFMSProcessor(GeoDataProcessor):
    """
    Class for processing data from the Global Flood Management System
    """

    rows = 800
    cols = 2458

    header = """ncols        {cols}
    nrows        {rows}
    xllcorner    -128.5
    yllcorner    -50.0
    cellsize     0.125
    NODATA_value -9999
    """.format(cols=cols, rows=rows)

    base_url = "http://eagle1.umd.edu/flood/download/"
    layer_future = "gfms_latest"
    layer_current = "gfms_current"
    layer_current_24h = "gfms_current_24H"
    layer_current_48h = "gfms_current_48H"
    prefix = 'Flood_byStor_'
    
    # initial_data_path = "/Users/budi/Documents/iMMAP/DRR-datacenter/geodb/initialdata/" # in developement
    # gdal_path = '/usr/local/bin/' # development
    
    initial_data_path = "/home/ubuntu/DRR-datacenter/geodb/initialdata/" # Production
    gdal_path = '/usr/bin/' # production

    def get_latest_future(self, today):
        """
        Get the URL for the latest image of future projected flood intensity
        :return: URL of the latest image
        """
        # today  = datetime.datetime.now()
        month = today.strftime("%m")
        year = today.strftime("%Y")
        base_url = self.base_url + "{year}/{year}{month}".format(
            year=year, month=month)

        r = requests.get(base_url)
        html = bs(r.text)
        latest_img =html.find_all('a')[-1].get('href')
        img_url = "{}/{}".format(base_url, latest_img)
        return img_url

    def get_most_current_24h(self, today):
        """
        Get the URL for the image of projected flood intensity,
        closest to current date/time
        :return: URL of the current image
        """
        # today = datetime.datetime.utcnow()
        today = today+timedelta(days=1)
        month = today.strftime("%m")
        year = today.strftime("%Y")
        day = today.strftime("%d")
        hour = today.strftime("%H")

        if int(hour) > 21:
            hour = 21
        else:
            hour = int(hour) - (int(hour) % 3)
        hour = '{0:02d}'.format(hour)    

        base_url = self.base_url + "{year}/{year}{month}".format(
            year=year, month=month)
        latest_img = "{prefix}{year}{month}{day}{hour}.bin".format(
            prefix=self.prefix, year=year, month=month, day=day, hour=hour)
        img_url = "{}/{}".format(base_url, latest_img)
        return img_url   
        
    def get_most_current_48h(self, today):
        """
        Get the URL for the image of projected flood intensity,
        closest to current date/time
        :return: URL of the current image
        """
        # today = datetime.datetime.utcnow()
        today = today+timedelta(days=2)
        month = today.strftime("%m")
        year = today.strftime("%Y")
        day = today.strftime("%d")
        hour = today.strftime("%H")

        if int(hour) > 21:
            hour = 21
        else:
            hour = int(hour) - (int(hour) % 3)
        hour = '{0:02d}'.format(hour)

        base_url = self.base_url + "{year}/{year}{month}".format(
            year=year, month=month)
        latest_img = "{prefix}{year}{month}{day}{hour}.bin".format(
            prefix=self.prefix, year=year, month=month, day=day, hour=hour)
        img_url = "{}/{}".format(base_url, latest_img)
        return img_url     

    def get_most_current(self, today):
        """
        Get the URL for the image of projected flood intensity,
        closest to current date/time
        :return: URL of the current image
        """
        # today = datetime.datetime.utcnow()
        month = today.strftime("%m")
        year = today.strftime("%Y")
        day = today.strftime("%d")
        hour = today.strftime("%H")

        if int(hour) > 21:
            hour = 21
        else:
            hour = int(hour) - (int(hour) % 3)
        hour = '{0:02d}'.format(hour)

        base_url = self.base_url + "{year}/{year}{month}".format(
            year=year, month=month)
        latest_img = "{prefix}{year}{month}{day}{hour}.bin".format(
            prefix=self.prefix, year=year, month=month, day=day, hour=hour)
        img_url = "{}/{}".format(base_url, latest_img)
        return img_url

    def convert(self, img_file):
        """
        Convert a raw GFMS image into a GeoTIFF
        :param img_file: Name of raw image file from GFMS
        (assumed to be in temp directory)
        :return: Name of converted GeoTIFF file
        """
        basename = os.path.splitext(img_file)[0]
        aig_file = "{}.aig".format(basename)
        tif_file = "{}.tif".format(basename)

        outfile = open(os.path.join(self.tmp_dir, aig_file), "w")
        infile = open(os.path.join(self.tmp_dir, img_file), "rb")

        try:
            coords = struct.unpack('f'*self.rows*self.cols,
                                   infile.read(4*self.rows*self.cols))
            outfile.write(self.header)

            for idx, value in enumerate(coords):
                #print idx, value
                outfile.write(str(value) + " ")
                if (idx + 1) % 2458 == 0:
                    outfile.write("\n")
                    #print idx
        finally:
            outfile.close()
            infile.close()

        gdal_translate(os.path.join(self.tmp_dir, aig_file),
                       os.path.join(self.tmp_dir, tif_file),
                       projection="EPSG:4326")
        return tif_file

    def parse_title(self, tif_file):
        """
        Determine title of layer based on date/time within the image filename
        :param tif_file: GFMS GeoTIFF image filename
        :return: New title for layer
        """
        latest_img_datestamp = re.findall("\d+", tif_file)[0]
        latest_img_date = datetime.datetime.strptime(
            latest_img_datestamp, '%Y%m%d%H')
        return "Flood Detection/Intensity - {}".format(
            latest_img_date.strftime("%m-%d-%Y %H:%M UTC"))

    def import_future(self):
        """
        Retrieve and process the GFMS image furthest into the future.
        """
        img_url = self.get_latest_future()
        img_file = self.download(img_url)
        tif_file = self.convert(img_file)
        new_title = self.parse_title(tif_file)
        self.post_geoserver(tif_file, self.layer_future)
        self.update_geonode(self.layer_future, title=new_title)
        self.truncate_gs_cache(self.layer_future)

    def import_current(self):
        """
        Retrieve and process the GFMS image closest to the current date/time.
        """
        img_url = self.get_most_current()
        img_file = self.download(img_url)
        tif_file = self.convert(img_file)
        new_title = self.parse_title(tif_file)
        # self.post_geoserver(tif_file, self.layer_current)
        # self.update_geonode(self.layer_current, title=new_title)
        # self.truncate_gs_cache(self.layer_current)

    def import_current_24h(self):
        """
        Retrieve and process the GFMS image closest to the current date/time.
        """
        img_url = self.get_most_current_24h()
        img_file = self.download(img_url)
        tif_file = self.convert(img_file)
        new_title = self.parse_title(tif_file)
        self.post_geoserver(tif_file, self.layer_current_24h)
        self.update_geonode(self.layer_current_24h, title=new_title)
        self.truncate_gs_cache(self.layer_current_24h)

    def import_current_48h(self):
        """
        Retrieve and process the GFMS image closest to the current date/time.
        """
        img_url = self.get_most_current_48h()
        img_file = self.download(img_url)
        tif_file = self.convert(img_file)
        new_title = self.parse_title(tif_file)
        self.post_geoserver(tif_file, self.layer_current_48h)
        self.update_geonode(self.layer_current_48h, title=new_title)
        self.truncate_gs_cache(self.layer_current_48h)     

    def cropRaster(self, rasterIn, rasterOut):
        # subprocess.call([os.path.join(self.gdal_path,'gdalwarp'), '-cutline', os.path.join(self.initial_data_path,'afg_admbnda_int.shp'),'-crop_to_cutline', rasterIn, rasterOut])     
        # subprocess.call([os.path.join(self.gdal_path,'gdalwarp'), '-te 60 29 75 39','-srcnodata -9999', '-dstnodata -9999', rasterIn,  os.path.join(self.tmp_dir, 'outcroppedproc.tif')]) 
        subprocess.call('%s -overwrite -te 60 29 75 39 -srcnodata -9999 -dstnodata -9999 %s %s' %(os.path.join(self.gdal_path,'gdalwarp'), rasterIn, os.path.join(self.tmp_dir, 'outcroppedproc.tif')),shell=True)
        subprocess.call([os.path.join(self.gdal_path,'gdal_translate'), '-of', 'GTiff','-a_nodata', '0', os.path.join(self.tmp_dir, 'outcroppedproc.tif'),  rasterOut]) 
        return rasterOut

    def GetMossaic(self, file1, file2, file3, file4, outFile):
        subprocess.call('%s -A %s -B %s -C %s -D %s --outfile=%s --calc=\'maximum(maximum(maximum(A,B),C),D)\'' %(os.path.join(self.gdal_path,'gdal_calc.py'),file1, file2, file3, file4, outFile),shell=True)
        return outFile    

    def run(self, date):
        """
        Retrieve and process both current and future GFMS images
        :return:
        """
        # working downloader
        img_url = self.get_most_current(date)
        # print img_url
        img_file1 = self.download(img_url)
        tif_file1 = self.convert(img_file1)
        # print tif_file1

        img_url = self.get_most_current_24h(date)
        # print img_url
        try:
            img_file2 = self.download(img_url)
            tif_file2 = self.convert(img_file2)
        except:
            tif_file2 = tif_file1      
        # print tif_file2

        img_url = self.get_most_current_48h(date)
        # print img_url
        try:
            img_file3 = self.download(img_url)
            tif_file3 = self.convert(img_file3)
        except:
            tif_file3 = tif_file1
        # print tif_file3

        tif_file4 = tif_file3
        # img_url = self.get_latest_future(date)
        # # print img_url
        # img_file4 = self.download(img_url)
        # tif_file4 = self.convert(img_file4)
        # print tif_file4
        
        out1 = self.cropRaster(os.path.join(self.tmp_dir, tif_file1), os.path.join(self.tmp_dir, 'outcropped1.tif'))
        out2 = self.cropRaster(os.path.join(self.tmp_dir, tif_file2), os.path.join(self.tmp_dir, 'outcropped2.tif'))
        out3 = self.cropRaster(os.path.join(self.tmp_dir, tif_file3), os.path.join(self.tmp_dir, 'outcropped3.tif'))
        out4 = self.cropRaster(os.path.join(self.tmp_dir, tif_file4), os.path.join(self.tmp_dir, 'outcropped4.tif'))

        targetfile = self.GetMossaic(out1, out2, out3, out4, os.path.join(self.tmp_dir, 'out.tif'))

        out = self.reclassification(targetfile, os.path.join(self.tmp_dir, 'out.tif')); 

        subprocess.call('%s %s -f "ESRI Shapefile" %s' %(os.path.join(self.gdal_path,'gdal_polygonize.py'), out, os.path.join(self.tmp_dir, 'out.shp')),shell=True)
        
        self.customIntersect(os.path.join(self.tmp_dir,'out.shp'), os.path.join(self.initial_data_path,'water.shp'), date)
        # # print self.tmp_dir
        self.cleanup()

    def reclassification(self, fileIN, fileOUT):
        driver = gdal.GetDriverByName('GTiff')
        file1 = gdal.Open(fileIN)
        band = file1.GetRasterBand(1)
        lista = band.ReadAsArray()

        # reclassification
        # for j in  range(file1.RasterXSize):
        #     for i in  range(file1.RasterYSize):
        #         # if lista[i,j] <= 0:
        #         #     lista[i,j] = 0
        #         # el
        #         if 0 < lista[i,j] <= 10:
        #             lista[i,j] = 1
        #         elif 10 < lista[i,j] <= 20:
        #             lista[i,j] = 2
        #         elif 20 < lista[i,j] <= 50:
        #             lista[i,j] = 3
        #         elif 50 < lista[i,j] <= 100:
        #             lista[i,j] = 4
        #         elif 100 < lista[i,j] <= 200:
        #             lista[i,j] = 5        
        #         elif lista[i,j] > 200:
        #             lista[i,j] = 6

        # create new file
        file2 = driver.Create(fileOUT, file1.RasterXSize , file1.RasterYSize , 1)
        file2.GetRasterBand(1).WriteArray(lista)

        # spatial ref system
        proj = file1.GetProjection()
        georef = file1.GetGeoTransform()
        file2.SetProjection(proj)
        file2.SetGeoTransform(georef)
        file2.FlushCache()
        return fileOUT

    def customIntersect(self,bufSHP,ctSHP,today):
        year = today.strftime("%Y")
        month = today.strftime("%m")
        day = today.strftime("%d")
        hour = today.strftime("%H")
        minute = today.strftime("%M")
        with fiona.open(bufSHP, 'r') as layer1:
            with fiona.open(ctSHP, 'r') as layer2:
                # We copy schema and add the  new property for the new resulting shp
                schema = layer2.schema.copy()
                schema['properties']['uid'] = 'int:10'
                # We open a first empty shp to write new content from both others shp
                # with fiona.open(intSHP, 'w', 'ESRI Shapefile', schema) as layer3:
                index = rtree.index.Index()
                for feat1 in layer1:
                    fid = int(feat1['id'])
                    # print feat1['properties']['DN']
                    geom1 = shape(feat1['geometry'])
                    if feat1['properties']['DN']>0:
                        index.insert(fid, geom1.bounds)

                for feat2 in layer2:
                    geom2 = shape(feat2['geometry'])
                    for fid in list(index.intersection(geom2.bounds)):
                        if fid != int(feat2['id']):
                            feat1 = layer1[fid]
                            geom1 = shape(feat1['geometry'])
                            if geom1.intersects(geom2):
                                # We take attributes from ctSHP
                                props = feat2['properties']
                                props2 = feat1['properties']
                                # print props['value']
                                # print props2['DN']

                                basin = AfgShedaLvl4.objects.get(value=props['value']) 

                                recordExists = Forcastedvalue.objects.all().filter(datadate=year+'-'+month+'-'+day,forecasttype='riverfloodreal',basin=basin)  
                                if recordExists.count() > 0:
                                    if recordExists[0].riskstate < props2['DN']:
                                        c = Forcastedvalue(pk=recordExists[0].pk,basin=basin)  
                                        c.riskstate = props2['DN']
                                        c.datadate = recordExists[0].datadate
                                        c.forecasttype = recordExists[0].forecasttype
                                        c.save()
                                    #     print 'riverflood modified'
                                    # print 'riverflood skip'    
                                else:
                                    c = Forcastedvalue(basin=basin)  
                                    c.datadate = year+'-'+month+'-'+day
                                    c.forecasttype = 'riverfloodreal'
                                    c.riskstate = props2['DN'] 
                                    c.save()
                                    # print 'riverflood added'
        # ff = forecastedLastUpdate(datadate=year+'-'+month+'-'+day+' '+hour+':'+minute,forecasttype='riverflood')
        # ff.save()


# if __name__ == '__main__':
#     processor = GFMSProcessor()
#     processor.run()
