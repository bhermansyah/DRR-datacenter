import os, sys
import traceback
import csv
import glob

os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from geonode.base.models import Region
from geonode.documents.models import Document
from itertools import tee
from pprint import pprint
import geonode.documents.models
import geonode.documents.views
import logging

# path_source = '/home/dodi/tmp/uploader/161213/'
path_source = '/home/uploader/161213/'
fin_up_path = '96_Geonode/'
# path_dest = '/home/dodi/tmp/uploaded/'+fin_up_path
path_dest = '/home/ubuntu/DRR-datacenter/geonode/uploaded/'+fin_up_path
u = geonode.documents.views.uploadpdf() # instantiate class to init uploadpdf logging
logger = logging.getLogger('uploadpdf')

# log error traceback messages
def exception_hook(exc_type, exc_value, exc_traceback):
    logger.error(
        "Uncaught exception",
        exc_info=(exc_type, exc_value, exc_traceback)
    )
    sys.exit('Uncaught exception')

sys.excepthook = exception_hook

f_IN = open(sys.argv[1], 'r+U')
f_OUT= open(sys.argv[2], 'wt')
first = True
try:
	reader = csv.reader(f_IN)
	writer = csv.writer(f_OUT)
	remaining = list(reader)
	f_IN.seek(0)
	for idx, row in enumerate(reader):
		if first:
			first = False
		else :

			# if (Document.objects.filter(doc_file__icontains=row[0])):
			# 	raise Exception('FileName \'%s\' already exist'%(row[0]))		

			# logger.debug(row)
			if os.path.isfile(os.path.normpath(path_source+row[10]+'/'+row[0])):
				print 'Processing %s.'%(os.path.normpath(path_source+row[10]+'/'+row[0]))
				kwargs = {
					'doc_file':os.path.normpath(fin_up_path+row[10]+'/'+row[0]),
					'title':row[1],
					'owner_id':1,
					'papersize':row[8],
					'datasource':row[2],
					'subtitle':row[12],
					'category_id':row[5],
					'date':row[9],
					'abstract':row[14]
				}
				if (len(row) > 18) and (row[18]):
					# prev_file_name exist
					try:
						newdata = Document.objects.get(doc_file__icontains=row[18])
						# alternative to newdata.update(**kwargs)
						for (key, value) in kwargs.items():
							setattr(newdata, key, value)
					except Document.DoesNotExist:
						raise Exception('previous_file_name \'%s\' not found in database.'%(row[18]))
					except Document.MultipleObjectsReturned:
						raise Exception('previous_file_name \'%s\' returns multiple row.'%(row[18]))
				else:
					# no prev_file_name
					newdata = Document(**kwargs)
				try:
					os.rename((os.path.normpath(path_source+row[10]+'/'+row[0])), (os.path.normpath(path_dest+row[10]+'/'+row[0])))
					newdata.save()
					valid_keywords = filter(None, row[7].split("-"))
					newdata.keywords.add(*valid_keywords)
					row[16]=newdata.id
					loc = Region.objects.get(pk=row[4])
					newdata.regions.add(loc)
					del remaining[idx]
					logger.info('Upload pdf succesfull: '+row[0])
				except Exception as e:
					msg = "Error on row: {0}, {1}".format(row[0], e.message)
					# print msg
					logger.error(msg+'\n'+traceback.format_exc())
					sys.exit(msg)
			else:
				raise Exception('File \'%s\' not found.'%(os.path.normpath(path_source+row[10]+'/'+row[0])))
		writer.writerow(row)
	if first or (idx == 0):
		raise Exception('No rows data.')
except Exception as e:
	# print e.message
	logger.error(e.message+'\n'+traceback.format_exc())
	sys.exit(e.message)
finally:

	# write remaining list back to f_IN
	f_IN.seek(0)
	csv.writer(f_IN).writerows(remaining)
	f_IN.truncate()

	f_IN.close()
	f_OUT.close()
