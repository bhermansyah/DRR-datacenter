import os,sys
import csv, json
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from geonode.layers.models import Layer

test = Layer.objects.all()
# test = Layer.objects.filter(pk=5831)

ids = []

for i in test:
	ids.append(i.pk)


for x in ids:
	layer = Layer.objects.filter(pk=x)[0]
	try:
		layer.save()
	except:	
		print layer
		pass


