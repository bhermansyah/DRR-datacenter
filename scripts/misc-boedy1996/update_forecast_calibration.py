import os,sys
import csv, json
import datetime
from django.db import connection, connections

os.environ.setdefault("DJANGO_SETTINGS_MODULE","geonode.settings")

from gfms_backdate import GFMSProcessor

start_date = datetime.datetime(2015, 9, 17, 10)
end_date = datetime.datetime(2017, 2, 21, 10)
d=start_date
delta = datetime.timedelta(days=1)
while d <= end_date:
	processor = GFMSProcessor()
	processor.run(d)
	print d.strftime("%Y-%m-%d")
	d += delta

# first = True
# f_IN = open(sys.argv[1], 'rU')
# f_OUT= open(sys.argv[2], 'wt')
# try:
# 	reader = csv.reader(f_IN)
# 	writer = csv.writer(f_OUT)
# 	for row in reader:
# 		if first:
# 			first = False
# 		else:
# 			arr_date = row[1].split("-")	
# 			tmpdate = datetime.date(int(arr_date[0]),int(arr_date[1]),int(arr_date[2]))
# 			daymin5 = tmpdate - datetime.timedelta(days=5)
# 			daymin4 = tmpdate - datetime.timedelta(days=4)
# 			daymin3 = tmpdate - datetime.timedelta(days=3)
# 			daymin2 = tmpdate - datetime.timedelta(days=2)
# 			daymin1 = tmpdate - datetime.timedelta(days=1)

# 			daymax1 = tmpdate + datetime.timedelta(days=1)
# 			daymax2 = tmpdate + datetime.timedelta(days=2)
# 			daymax3 = tmpdate + datetime.timedelta(days=3)
			
# 			cursor = connections['geodb'].cursor()
			
# 			# -5 days
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin5.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[23] != '':
# 						if i[0]>row[23] : row[23]=i[0]
# 					else:	
# 						row[23]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[32] != '':
# 						if i[0]>row[32] : row[32]=i[0] 
# 					else:	
# 						row[32]=i[0]	


# 			# -4 days
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin4.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[24] != '':
# 						if i[0]>row[24] : row[24]=i[0]
# 					else:	
# 						row[24]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[33] != '':
# 						if i[0]>row[33] : row[33]=i[0] 
# 					else:	
# 						row[33]=i[0]


# 			# -3 days
# 			# flood
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin3.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[25] != '':
# 						if i[0]>row[25] : row[25]=i[0]
# 					else:	
# 						row[25]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[34] != '':
# 						if i[0]>row[34] : row[34]=i[0] 
# 					else:	
# 						row[34]=i[0]	

# 			# avalanche
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_avsa \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_avsa.basinmember_id \
# 				where afg_avsa.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin3.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			for i in data:
# 				if i[1]=='snowwaterreal':
# 					if row[16] != '':
# 						if i[0]>row[16] : row[16]=i[0]
# 					else:	
# 						row[16]=i[0]			


# 			# -2 days
# 			# flood
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin2.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[26] != '':
# 						if i[0]>row[26] : row[26]=i[0]
# 					else:	
# 						row[26]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[35] != '':
# 						if i[0]>row[35] : row[35]=i[0] 
# 					else:	
# 						row[35]=i[0]	

# 			# avalanche
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_avsa \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_avsa.basinmember_id \
# 				where afg_avsa.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin2.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			for i in data:
# 				if i[1]=='snowwaterreal':
# 					if row[17] != '':
# 						if i[0]>row[17] : row[17]=i[0]
# 					else:	
# 						row[17]=i[0]

# 			# -1 days
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin1.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[27] != '':
# 						if i[0]>row[27] : row[27]=i[0]
# 					else:	
# 						row[27]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[36] != '':
# 						if i[0]>row[36] : row[36]=i[0] 
# 					else:	
# 						row[36]=i[0]

# 			# avalanche
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_avsa \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_avsa.basinmember_id \
# 				where afg_avsa.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymin1.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			for i in data:
# 				if i[1]=='snowwaterreal':
# 					if row[18] != '':
# 						if i[0]>row[18] : row[18]=i[0]
# 					else:	
# 						row[18]=i[0]	

# 			# in days
# 			# flood
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+tmpdate.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[28] != '':
# 						if i[0]>row[28] : row[28]=i[0]
# 					else:	
# 						row[28]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[37] != '':
# 						if i[0]>row[37] : row[37]=i[0] 
# 					else:	
# 						row[37]=i[0]

# 			# avalanche
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_avsa \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_avsa.basinmember_id \
# 				where afg_avsa.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+tmpdate.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			for i in data:
# 				if i[1]=='snowwaterreal':
# 					if row[19] != '':
# 						if i[0]>row[19] : row[19]=i[0]
# 					else:	
# 						row[19]=i[0]			


# 			# +1 days
# 			# flood
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymax1.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[29] != '':
# 						if i[0]>row[29] : row[29]=i[0]
# 					else:	
# 						row[29]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[38] != '':
# 						if i[0]>row[38] : row[38]=i[0] 
# 					else:	
# 						row[38]=i[0]

# 			# avalanche
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_avsa \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_avsa.basinmember_id \
# 				where afg_avsa.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymax1.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			for i in data:
# 				if i[1]=='snowwaterreal':
# 					if row[20] != '':
# 						if i[0]>row[20] : row[20]=i[0]
# 					else:	
# 						row[20]=i[0]		


# 			# +2 days
# 			# flood
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymax2.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[30] != '':
# 						if i[0]>row[30] : row[30]=i[0]
# 					else:	
# 						row[30]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[39] != '':
# 						if i[0]>row[39] : row[39]=i[0] 
# 					else:	
# 						row[39]=i[0]	

# 			# avalanche
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_avsa \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_avsa.basinmember_id \
# 				where afg_avsa.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymax2.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			for i in data:
# 				if i[1]=='snowwaterreal':
# 					if row[21] != '':
# 						if i[0]>row[21] : row[21]=i[0]
# 					else:	
# 						row[21]=i[0]

# 			# +3 days
# 			# flood
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_fldzonea_100k_risk_landcover_pop \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_fldzonea_100k_risk_landcover_pop.basinmember_id \
# 				where afg_fldzonea_100k_risk_landcover_pop.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymax3.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			# cursor.close()
# 			for i in data:
# 				if i[1]=='riverflood':
# 					if row[31] != '':
# 						if i[0]>row[31] : row[31]=i[0]
# 					else:	
# 						row[31]=i[0]
# 				elif i[1]=='flashflood':
# 					if row[40] != '':
# 						if i[0]>row[40] : row[40]=i[0] 
# 					else:	
# 						row[40]=i[0]

# 			# avalanche
# 			cursor.execute("\
# 		        select distinct forcastedvalue.riskstate, forecasttype from afg_avsa \
# 				inner join forcastedvalue on forcastedvalue.basin_id=afg_avsa.basinmember_id \
# 				where afg_avsa.vuid = '"+row[10]+"' \
# 				and forcastedvalue.datadate = '"+daymax3.strftime("%Y-%m-%d")+"' \
# 		    ")
# 			data = cursor.fetchall()
# 			cursor.close()
# 			for i in data:
# 				if i[1]=='snowwaterreal':
# 					if row[22] != '':
# 						if i[0]>row[22] : row[22]=i[0]
# 					else:	
# 						row[22]=i[0]																						
				


# 			print row[10]

# 		writer.writerow(row)
# finally:
# 	f_IN.close()
# 	f_OUT.close()
