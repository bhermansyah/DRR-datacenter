from osgeo import gdal, ogr
from osgeo.gdalconst import *
import numpy as np
import sys
from django.conf import settings
from geodb.models import HistoryDrought
from django.db import connection, connections
import os
import time
import datetime, sys
import logging
import logging.config
from ftplib import FTP
from geodb.geoapi import query_to_dicts

gdal.PushErrorHandler('CPLQuietErrorHandler')
# getattr(settings, 'DB_UNAME')

databaseServer = getattr(settings, 'DB_HOST')
databaseName = getattr(settings, 'DB_NAME')
databaseUser = getattr(settings, 'DB_UNAME')
databasePW = getattr(settings, 'DB_UPASS')
connString = "PG: host=%s dbname=%s user=%s password=%s" % (databaseServer,databaseName,databaseUser,databasePW)

server = 'ftp.star.nesdis.noaa.gov'
directory = 'pub/corp/scsb/wyang/data'

# week = datetime.date(int(year), int(month), int(day)).isocalendar()[1]

# local development
# PATH = '/Users/budi/Documents/test/tif_file/'
# output = '/Users/budi/Documents/test/reclassify_file/'

# Server
PATH = '/home/uploader/drought_raster/tif_file/'
output = '/home/uploader/drought_raster/reclassify_file/'

def downloadtif():

    sql = "select distinct woy from history_drought ORDER BY woy ASC"
    cursor = connections['geodb'].cursor()
    row = query_to_dicts(cursor, sql)  
    woys = [] 
    for i in row:
        woys.append(i['woy'])
    cursor.close()

    ftp = FTP(server)
    ftp.login()

    # logger.info("changing to directory: "+directory)
    print "changing to directory: "+directory
    ftp.cwd(directory)
    # ftp.retrlines('LIST')

    filenames = []
    # CountData = []
    ftp.retrlines('NLST', filenames.append)
    print woys
    for filename in filenames:
        if "VHI" in filename:
            filecode = filename[-14:-7]
            # print filecode, filename
            if filecode not in woys:

                if not os.path.exists(PATH):
                    os.makedirs(PATH)

                # if os.path.exists(PATH+filename):
                #     # logger.info("File already exists")
                #     print filecode
                #     print "File already exists"
                # else:
                # print(PATH)
                # logger.debug("starting to download: "+ filename)
                print "starting to download: "+ filename
                ftp.retrbinary("RETR {}".format(filename), open(PATH+filename, 'wb').write)
                reclassify(filename, filecode)
                # logger.info("Success")
                print "Success"

    # if NoData == True:
    #     # logger.info("Data Not Found")
    #     print "Data Not Found"
    # else:
    #     # logger.info("Downloading and Reclassify is success")
    #     print "Downloading and Reclassify is success"
    ftp.quit()

def reclassify(filename, filecode):
    Image = gdal.Open(os.path.join(PATH, filename))
    Driver = gdal.GetDriverByName(Image.GetDriver().ShortName)
    X_Size = Image.RasterXSize
    Y_Size = Image.RasterYSize
    Projection = Image.GetProjectionRef()
    GeoTransform = Image.GetGeoTransform()

    # Read the first band as a np array
    Band1 = Image.GetRasterBand(1).ReadAsArray()

    # Create a new array of the same shape and fill with zeros
    NewClass = np.zeros_like(Band1).astype('uint8')

    # Reclassify using np.where
    NewClass = np.where(((Band1 >= 0) & (Band1 < 3)), 4, NewClass) # Reclassify as 4
    NewClass = np.where(((Band1 >= 3) & (Band1 < 8)), 3, NewClass) # Reclassify as 3
    NewClass = np.where(((Band1 >= 8) & (Band1 < 16)), 2, NewClass) # Reclassify as 2
    NewClass = np.where(((Band1 >= 16) & (Band1 < 24)), 1, NewClass) # Reclassify as 1
    NewClass = np.where(((Band1 >= 24) & (Band1 < 32)), 0, NewClass) # Reclassify as 1
    NewClass = np.where(((Band1 >= 32) & (Band1 <= 100)), 0.001, NewClass) # Reclassify as 5, set it to nodata
    NewClass = np.where(((Band1 >= -9999) & (Band1 <= -0.010000)),0.001, NewClass) # Reclassify as 5, set it to nodata
    del Band1

    if not os.path.exists(output):
        os.makedirs(output)

    # Export the new classification:
    OutImage = Driver.Create(output+'/re_'+filename, X_Size, Y_Size, 1, gdal.GDT_Byte)
    OutImage.SetProjection(Projection)
    OutImage.SetGeoTransform(GeoTransform)
    OutBand = OutImage.GetRasterBand(1)
    OutBand.SetNoDataValue(0.001)
    OutBand.WriteArray(NewClass)
    OutImage = None
    del NewClass
    # logger.debug("Reclassifying : "+filename)
    print "Reclassifying : "+filename

    zonal_stats('afg_lndcrva', output+'/re_'+filename, filecode)

    print filename + ' added in database'


def bbox_to_pixel_offsets(gt, bbox):
    originX = gt[0]
    originY = gt[3]
    pixel_width = gt[1]
    pixel_height = gt[5]
    x1 = int((bbox[0] - originX) / pixel_width)
    x2 = int((bbox[1] - originX) / pixel_width) + 1

    y1 = int((bbox[3] - originY) / pixel_height)
    y2 = int((bbox[2] - originY) / pixel_height) + 1

    xsize = x2 - x1
    ysize = y2 - y1
    return (x1, y1, xsize, ysize)


def zonal_stats(vector_path, raster_path, filecode, nodata_value=None, global_src_extent=False):
    rds = gdal.Open(raster_path, GA_ReadOnly)
    assert(rds)
    rb = rds.GetRasterBand(1)
    rgt = rds.GetGeoTransform()

    if nodata_value:
        nodata_value = float(nodata_value)
        rb.SetNoDataValue(nodata_value)

    # vds = ogr.Open(vector_path, GA_ReadOnly)  # TODO maybe open update if we want to write stats
    # assert(vds)
    # vlyr = vds.GetLayer(0)

    conn = ogr.Open(connString)
    vlyr = conn.GetLayer( vector_path )

    # create an in-memory numpy array of the source raster data
    # covering the whole extent of the vector layer
    if global_src_extent:
        # use global source extent
        # useful only when disk IO or raster scanning inefficiencies are your limiting factor
        # advantage: reads raster data in one pass
        # disadvantage: large vector extents may have big memory requirements
        src_offset = bbox_to_pixel_offsets(rgt, vlyr.GetExtent())
        src_array = rb.ReadAsArray(*src_offset)

        # calculate new geotransform of the layer subset
        new_gt = (
            (rgt[0] + (src_offset[0] * rgt[1])),
            rgt[1],
            0.0,
            (rgt[3] + (src_offset[1] * rgt[5])),
            0.0,
            rgt[5]
        )

    mem_drv = ogr.GetDriverByName('Memory')
    driver = gdal.GetDriverByName('MEM')

    # Loop through vectors
    stats = []
    feat = vlyr.GetNextFeature()
    while feat is not None:

        if not global_src_extent:
            # use local source extent
            # fastest option when you have fast disks and well indexed raster (ie tiled Geotiff)
            # advantage: each feature uses the smallest raster chunk
            # disadvantage: lots of reads on the source raster
            src_offset = bbox_to_pixel_offsets(rgt, feat.geometry().GetEnvelope())
            src_array = rb.ReadAsArray(*src_offset)

            # calculate new geotransform of the feature subset
            new_gt = (
                (rgt[0] + (src_offset[0] * rgt[1])),
                rgt[1],
                0.0,
                (rgt[3] + (src_offset[1] * rgt[5])),
                0.0,
                rgt[5]
            )

        # Create a temporary vector layer in memory
        mem_ds = mem_drv.CreateDataSource('out')
        mem_layer = mem_ds.CreateLayer('poly', None, ogr.wkbPolygon)
        mem_layer.CreateFeature(feat.Clone())

        # Rasterize it
        rvds = driver.Create('', src_offset[2], src_offset[3], 1, gdal.GDT_Byte)
        rvds.SetGeoTransform(new_gt)
        gdal.RasterizeLayer(rvds, [1], mem_layer, burn_values=[1])
        rv_array = rvds.ReadAsArray()

        # Mask the source data array with our current feature
        # we take the logical_not to flip 0<->1 to get the correct mask effect
        # we also mask out nodata values explictly
        masked = np.ma.MaskedArray(
            src_array,
            mask=np.logical_or(
                src_array == nodata_value,
                np.logical_not(rv_array)
            )
        )

        feature_stats = {
            'min': float(masked.min()),
            'mean': float(masked.mean()),
            'max': float(masked.max()),
            'std': float(masked.std()),
            'sum': float(masked.sum()),
            'count': int(masked.count()),
            'fid': int(feat.GetFID()),
            'basin_id': feat.GetField(2),
            'agg_code': feat.GetField(4)
        }

        stats.append(feature_stats)

        if int(masked.count())>0:
            c = HistoryDrought(
                ogc_fid=int(feat.GetFID()),
                min=float(masked.min()),
                mean=float(masked.mean()),
                max=float(masked.max()),
                std=float(masked.std()),
                sum=float(masked.sum()),
                count=float(masked.count()),
                basin_id=feat.GetField(2),
                agg_code=feat.GetField(4),
                woy=filecode
            )
            c.save()
            print feature_stats
        

        rvds = None
        mem_ds = None
        feat = vlyr.GetNextFeature()

    vds = None
    rds = None

    conn.Destroy()

    # return stats