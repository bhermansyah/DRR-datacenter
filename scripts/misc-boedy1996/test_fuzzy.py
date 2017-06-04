import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")


# start of fuzzy look up 
from geodb.models import AfgPplp, Glofasintegrated
from fuzzywuzzy import process
import datetime

# f = AfgPplp.objects.all().filter(dist_na_en='Qala-e-Naw').values('name_en','dist_na_en','prov_na_en')
f = AfgPplp.objects.all().values('name_en','dist_na_en','prov_na_en')


choices = []
for i in f:
	choices.append(i['name_en'].lstrip()+';'+i['dist_na_en']+';'+i['prov_na_en'])

x = process.extract("BAGHBAN HA;Qala-I- Naw;Badghis", choices)

t=1
for i in x:
	print t, i
	t=t+1

# end of fuzzy look up

