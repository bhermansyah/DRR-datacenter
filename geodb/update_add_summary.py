import os,sys
from django.db import connection, connections

os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from geodb.geo_calc import getParentHltFacRecap, getParentRoadNetworkRecap
from geodb.models import provincesummary, districtsummary




base = provincesummary.objects.values('province')
for x in base:
	print x['province']
	hlt = getParentHltFacRecap(None, 'currentProvince', x['province'])
	tempHLTBase = dict([(c['facility_types_description'], c['numberhospital']) for c in hlt])
	# print tempHLTBase
	road = getParentRoadNetworkRecap(None, 'currentProvince', x['province'])
	tempRoadBase = dict([(c['type_update'], c['road_length']) for c in road])

	cursor = connections['geodb'].cursor()
	cursor.execute("update province_add_summary set \
    	hlt_h1="+str(round(tempHLTBase.get("Regional / National Hospital (H1)", 0)))+", \
    	hlt_h2="+str(round(tempHLTBase.get("Provincial Hospital (H2)", 0)))+", \
    	hlt_h3="+str(round(tempHLTBase.get("District Hospital (H3)", 0)))+", \
    	hlt_special_hospital="+str(round(tempHLTBase.get("Special Hospital (SH)", 0)))+", \
    	hlt_rehabilitation_center="+str(round(tempHLTBase.get("Rehabilitation Center (RH)", 0)))+", \
    	hlt_maternity_home="+str(round(tempHLTBase.get("Maternity Home (MH)", 0)))+", \
    	hlt_drug_addicted_treatment_center="+str(round(tempHLTBase.get("Drug Addicted Treatment Center", 0)))+", \
    	hlt_chc="+str(round(tempHLTBase.get("Comprehensive Health Center (CHC)", 0)))+", \
    	hlt_bhc="+str(round(tempHLTBase.get("Basic Health Center (BHC)", 0)))+", \
    	hlt_shc="+str(round(tempHLTBase.get("Sub Health Center (SHC)", 0)))+", \
    	hlt_private_clinic="+str(round(tempHLTBase.get("Private Clinic", 0)))+", \
    	hlt_malaria_center="+str(round(tempHLTBase.get("Malaria Center (MC)", 0)))+", \
    	hlt_mobile_health_team="+str(round(tempHLTBase.get("Mobile Health Team (MHT)", 0)))+", \
    	hlt_other="+str(round(tempHLTBase.get("Other", 0)))+", \
    	road_highway="+str(round(tempRoadBase.get("highway", 0)))+", \
    	road_primary="+str(round(tempRoadBase.get("primary", 0)))+", \
    	road_secondary="+str(round(tempRoadBase.get("secondary", 0)))+", \
    	road_tertiary="+str(round(tempRoadBase.get("tertiary", 0)))+", \
    	road_residential="+str(round(tempRoadBase.get("residential", 0)))+", \
    	road_track="+str(round(tempRoadBase.get("track", 0)))+", \
    	road_path="+str(round(tempRoadBase.get("path", 0)))+", \
    	road_river_crossing="+str(round(tempRoadBase.get("river crossing", 0)))+", \
    	road_bridge="+str(round(tempRoadBase.get("bridge", 0)))+" \
    	where prov_code='"+x['province']+"'"
    )

base = districtsummary.objects.values('district')
for x in base:
	print x['district']
	hlt = getParentHltFacRecap(None, 'currentProvince', x['district'])
	tempHLTBase = dict([(c['facility_types_description'], c['numberhospital']) for c in hlt])
	# print tempHLTBase
	road = getParentRoadNetworkRecap(None, 'currentProvince', x['district'])
	tempRoadBase = dict([(c['type_update'], c['road_length']) for c in road])

	cursor = connections['geodb'].cursor()
	cursor.execute("update district_add_summary set \
    	hlt_h1="+str(round(tempHLTBase.get("Regional / National Hospital (H1)", 0)))+", \
    	hlt_h2="+str(round(tempHLTBase.get("Provincial Hospital (H2)", 0)))+", \
    	hlt_h3="+str(round(tempHLTBase.get("District Hospital (H3)", 0)))+", \
    	hlt_special_hospital="+str(round(tempHLTBase.get("Special Hospital (SH)", 0)))+", \
    	hlt_rehabilitation_center="+str(round(tempHLTBase.get("Rehabilitation Center (RH)", 0)))+", \
    	hlt_maternity_home="+str(round(tempHLTBase.get("Maternity Home (MH)", 0)))+", \
    	hlt_drug_addicted_treatment_center="+str(round(tempHLTBase.get("Drug Addicted Treatment Center", 0)))+", \
    	hlt_chc="+str(round(tempHLTBase.get("Comprehensive Health Center (CHC)", 0)))+", \
    	hlt_bhc="+str(round(tempHLTBase.get("Basic Health Center (BHC)", 0)))+", \
    	hlt_shc="+str(round(tempHLTBase.get("Sub Health Center (SHC)", 0)))+", \
    	hlt_private_clinic="+str(round(tempHLTBase.get("Private Clinic", 0)))+", \
    	hlt_malaria_center="+str(round(tempHLTBase.get("Malaria Center (MC)", 0)))+", \
    	hlt_mobile_health_team="+str(round(tempHLTBase.get("Mobile Health Team (MHT)", 0)))+", \
    	hlt_other="+str(round(tempHLTBase.get("Other", 0)))+", \
    	road_highway="+str(round(tempRoadBase.get("highway", 0)))+", \
    	road_primary="+str(round(tempRoadBase.get("primary", 0)))+", \
    	road_secondary="+str(round(tempRoadBase.get("secondary", 0)))+", \
    	road_tertiary="+str(round(tempRoadBase.get("tertiary", 0)))+", \
    	road_residential="+str(round(tempRoadBase.get("residential", 0)))+", \
    	road_track="+str(round(tempRoadBase.get("track", 0)))+", \
    	road_path="+str(round(tempRoadBase.get("path", 0)))+", \
    	road_river_crossing="+str(round(tempRoadBase.get("river crossing", 0)))+", \
    	road_bridge="+str(round(tempRoadBase.get("bridge", 0)))+" \
    	where dist_code='"+x['district']+"'"
    )