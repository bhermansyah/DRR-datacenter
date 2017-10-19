import os
import geonode_formhub

SITEURL = "http://asdc.immap.org"
#ALLOWED_HOST = ['52.24.183.157']

DATABASES = {
    'default': {
         'ENGINE': 'django.contrib.gis.db.backends.postgis',
         #  'ENGINE': 'django.db.backends.postgresql_psycopg2',
         'NAME': 'geonode_data',
         'USER': 'geonode',
         'PASSWORD': '!MM@P2016',
         'HOST' : 'asdc.immap.org',
         'PORT' : '5432',
     },
    # vector datastore for uploads
    'geodb' : {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        #'ENGINE': '', # Empty ENGINE name disables
        'NAME': 'geodb',
        'USER' : 'geonode',
        'PASSWORD' : '!MM@P2016',
        'HOST' : 'asdc.immap.org',
        'PORT' : '5432',
    },
    'securitydb' : {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        #'ENGINE': '', # Empty ENGINE name disables
        'NAME': 'security_data',
        'USER' : 'geonode',
        'PASSWORD' : '!MM@P2016',
        'HOST' : 'asdc.immap.org',
        'PORT' : '5432',
    }
}

# OGC (WMS/WFS/WCS) Server Settings
OGC_SERVER = {
    'default' : {
        'BACKEND' : 'geonode.geoserver',
        'LOCATION' : 'http://asdc.immap.org/geoserver/',
        'PUBLIC_LOCATION' : 'http://asdc.immap.org/geoserver/',
        'USER' : 'admin',
        'PASSWORD' : 'geoserver',
        'MAPFISH_PRINT_ENABLED' : True,
        'PRINT_NG_ENABLED' : True,
        'GEONODE_SECURITY_ENABLED' : True,
        'GEOGIG_ENABLED' : False,
        'WMST_ENABLED' : False,
        'BACKEND_WRITE_ENABLED': True,
        'WPS_ENABLED' : False,
        #'LOG_FILE': '%s/geoserver/data/logs/geoserver.log' % os.path.abspath(os.path.join(PROJECT_ROOT, os.pardir)),
        # Set to name of database in DATABASES dictionary to enable
        'DATASTORE': '', #'datastore',
    }
}

CATALOGUE = {
    'default': {
        # The underlying CSW implementation
        # default is pycsw in local mode (tied directly to GeoNode Django DB)
        'ENGINE': 'geonode.catalogue.backends.pycsw_local',
        # pycsw in non-local mode
        # 'ENGINE': 'geonode.catalogue.backends.pycsw_http',
        # GeoNetwork opensource
        # 'ENGINE': 'geonode.catalogue.backends.geonetwork',
        # deegree and others
        # 'ENGINE': 'geonode.catalogue.backends.generic',

        # The FULLY QUALIFIED base url to the CSW instance for this GeoNode
        'URL': 'http://%s/catalogue/csw' % SITEURL,
        # 'URL': 'http://localhost:8080/geonetwork/srv/en/csw',
        # 'URL': 'http://localhost:8080/deegree-csw-demo-3.0.4/services',

        # login credentials (for GeoNetwork)
        'USER': 'admin',
        'PASSWORD': 'admin',
    }
}


# Default preview library
#LAYER_PREVIEW_LIBRARY = 'geoext'
# GeoNode vector data backend configuration.

# Uploader backend (rest or importer)

UPLOADER_BACKEND_URL = 'rest'

# Import uploaded shapefiles into a GeoGig repository
GEOGIG_DATASTORE = True
GEOGIG_DATASTORE_NAME = 'geogig-repo'

UPLOADER_SHOW_TIME_STEP=False

# Use the printNG geoserver lib
PRINT_NG_ENABLED=True

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_HOST_USER = 'admin.geonode@immap.org'
EMAIL_HOST_PASSWORD = 'SQqwhtiqYzX9'
EMAIL_PORT = 587
EMAIL_USE_TLS = True

# Settings for Social Apps
REGISTRATION_OPEN = True
ACCOUNT_EMAIL_CONFIRMATION_EMAIL = True
ACCOUNT_EMAIL_CONFIRMATION_REQUIRED = True
ACCOUNT_APPROVAL_REQUIRED = True

#The formhub media url
FORMHUB_MEDIA_URL = 'http://asdc.immap.org:8000/media/'

FORMHUB_TRUSTED_IP = 'asdc.immap.org'

GEONODE_FORMHUB_ROOT = os.path.abspath(os.path.dirname(geonode_formhub.__file__))
PROJECT_ROOT = os.path.abspath(os.path.dirname(__file__))

STATICFILES_DIRS = [
    os.path.join(PROJECT_ROOT, "static"),
    os.path.join(GEONODE_FORMHUB_ROOT, "static"),
]

DB_DATASTORE=True

#Location of GeoServer data directory
GS_DATA_DIR = '/Users/budi/Documents/iMMAP/DRR-datacenter/geoserver/data'

#Directory where temporary dataqs geoprocessing files should be downloaded
GS_TMP_DIR = GS_DATA_DIR + '/tmp'

#AirNow API username:password
#(sign up for a free account at http://airnowapi.org/account/request/)
AIRNOW_ACCOUNT = 'boedy1996:kontol'

#Time to wait before updating Geoserver mosaic (keep at 0 unless Geoserver
#is on a different server. In that case, there will need to be an automated
#rsync between GS_TMP_DIR where celery is running and
#GS_DATA_DIR where GeoServer is running.
RSYNC_WAIT_TIME = 0

# PDF
PDFCROWD_UNAME = 'twat'
PDFCROWD_UPASS = 'twat'