# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Remove `managed = False` lines if you wish to allow Django to create and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
#
# Also note: You'll have to insert the output of 'django-admin.py sqlcustom [appname]'
# into your database.
from __future__ import unicode_literals

from django.contrib.gis.db import models

class AfgAdmbndaAdm1(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    reg_code = models.IntegerField(blank=True, null=True)
    area = models.FloatField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_admbnda_adm1'
    def __unicode__(self):
        return self.prov_na_en    

class AfgAdmbndaAdm2(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    unit_type = models.CharField(max_length=255, blank=True)
    dist_na_dar = models.CharField(max_length=255, blank=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    dist_na_ps = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    test2 = models.IntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_admbnda_adm2'
    def __unicode__(self):
        return self.dist_na_en     

class AfgAdmbndaInt(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    name_en = models.CharField(max_length=255, blank=True)
    name_en_short = models.CharField(max_length=255, blank=True)
    names_ps = models.CharField(max_length=255, blank=True)
    name_prs = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_admbnda_int'
    def __unicode__(self):
        return self.name_en      

class AfgAdmbndlAdm1(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiLineStringField(blank=True, null=True)
    fid_afg_admbnda_adm1_50000_agcho = models.IntegerField(blank=True, null=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_admbndl_adm1'
    def __unicode__(self):
        return self.prov_na_en        

class AfgAdmbndlAdm2(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiLineStringField(blank=True, null=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    unit_type = models.CharField(max_length=255, blank=True)
    dist_na_dar = models.CharField(max_length=255, blank=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    dist_na_ps = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_admbndl_adm2'
    def __unicode__(self):
        return self.dist_na_en     

class AfgAdmbndlInt(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiLineStringField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_admbndl_int'
    def __unicode__(self):
        return self.name    

class AfgAirdrma(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(dim=3, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True)
    nameshort = models.CharField(max_length=255, blank=True)
    namelong = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    icao = models.CharField(max_length=255, blank=True)
    iata = models.CharField(max_length=255, blank=True)
    apttype = models.CharField(max_length=255, blank=True)
    aptclass = models.CharField(max_length=255, blank=True)
    authority = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=255, blank=True)
    rwpaved = models.CharField(max_length=255, blank=True)
    rwlengthm = models.IntegerField(blank=True, null=True)
    elevm = models.IntegerField(blank=True, null=True)
    humuse = models.CharField(max_length=255, blank=True)
    humoperate = models.CharField(max_length=255, blank=True)
    locprecisi = models.CharField(max_length=255, blank=True)
    iso3 = models.CharField(max_length=255, blank=True)
    lastcheckd = models.DateTimeField(blank=True, null=True)
    source = models.CharField(max_length=255, blank=True)
    createdate = models.DateTimeField(blank=True, null=True)
    updatedate = models.DateTimeField(blank=True, null=True)
    adjusted_by = models.CharField(max_length=255, blank=True)
    type = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_airdrma'
    def __unicode__(self):
        return self.name      

class AfgAirdrmp(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.PointField(dim=3, blank=True, null=True)
    nameshort = models.CharField(max_length=255, blank=True)
    namelong = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=255, blank=True)
    icao = models.CharField(max_length=255, blank=True)
    iata = models.CharField(max_length=255, blank=True)
    apttype = models.CharField(max_length=255, blank=True)
    aptclass = models.CharField(max_length=255, blank=True)
    authority = models.CharField(max_length=255, blank=True)
    status = models.CharField(max_length=255, blank=True)
    rwpaved = models.CharField(max_length=255, blank=True)
    rwlengthm = models.IntegerField(blank=True, null=True)
    rwlengthf = models.IntegerField(blank=True, null=True)
    elevm = models.IntegerField(blank=True, null=True)
    humuse = models.CharField(max_length=255, blank=True)
    humoperate = models.CharField(max_length=255, blank=True)
    locprecisi = models.CharField(max_length=255, blank=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    iso3 = models.CharField(max_length=255, blank=True)
    country = models.CharField(max_length=255, blank=True)
    lastcheckd = models.DateTimeField(blank=True, null=True)
    remarks = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=255, blank=True)
    createdate = models.DateTimeField(blank=True, null=True)
    updatedate = models.DateTimeField(blank=True, null=True)
    geonameid = models.IntegerField(blank=True, null=True)
    adjusted_by = models.CharField(max_length=255, blank=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_airdrmp'
    def __unicode__(self):
        return self.namelong      

class AfgFldzonea100KNciaV2029Cm(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(dim=3, blank=True, null=True)
    id = models.IntegerField(blank=True, null=True)
    deeperthan = models.CharField(max_length=255, blank=True)
    province_n = models.CharField(max_length=255, blank=True)
    district_n = models.CharField(max_length=255, blank=True)
    basinname = models.CharField(max_length=255, blank=True)
    near_fid = models.IntegerField(blank=True, null=True)
    near_dist = models.FloatField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_fldzonea_100k_ncia_v2_029cm'

class AfgFldzonea100KNciaV2121Cm(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(dim=3, blank=True, null=True)
    id = models.IntegerField(blank=True, null=True)
    deeperthan = models.CharField(max_length=255, blank=True)
    province_n = models.CharField(max_length=255, blank=True)
    district_n = models.CharField(max_length=255, blank=True)
    basinname = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_fldzonea_100k_ncia_v2_121cm'

class AfgFldzonea100KNciaV2271Cm(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(dim=3, blank=True, null=True)
    id = models.IntegerField(blank=True, null=True)
    deeperthan = models.CharField(max_length=255, blank=True)
    province_n = models.CharField(max_length=255, blank=True)
    district_n = models.CharField(max_length=255, blank=True)
    basinname = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_fldzonea_100k_ncia_v2_271cm'

class AfgFldzonea100KNciaV2Risk25Mbuffer(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    id = models.IntegerField(blank=True, null=True)
    deeperthan = models.CharField(max_length=255, blank=True)
    province_n = models.CharField(max_length=255, blank=True)
    district_n = models.CharField(max_length=255, blank=True)
    basinname = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_fldzonea_100k_ncia_v2_risk_25mbuffer'


class AfgLndcrva(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    lccsperc = models.CharField(max_length=255, blank=True)
    aggcode = models.CharField(max_length=255, blank=True)
    aggcode_simplified = models.CharField(max_length=255, blank=True)
    agg_simplified_description = models.CharField(max_length=255, blank=True, db_index=True)
    vuid = models.CharField(max_length=255, blank=True)
    vuid_population_landscan = models.IntegerField(blank=True, null=True)
    vuid_area_sqm = models.FloatField(blank=True, null=True)
    area_population = models.FloatField(blank=True, null=True)
    area_sqm = models.FloatField(blank=True, null=True)
    population_misti = models.IntegerField(blank=True, null=True)
    language_field = models.CharField(db_column='language_', max_length=255, blank=True) # Field renamed because it ended with '_'.
    lang_code = models.IntegerField(blank=True, null=True)
    note = models.CharField(max_length=255, blank=True)
    edited_by = models.CharField(max_length=255, blank=True)
    name_en = models.CharField(max_length=255, blank=True)
    type_settlement = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    unit_type = models.CharField(max_length=255, blank=True)
    dist_na_dar = models.CharField(max_length=255, blank=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    dist_na_ps = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    aggcodeperc = models.FloatField(blank=True, null=True)
    count = models.IntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_lndcrva'

class AfgPpla(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    vuid = models.CharField(max_length=255, blank=True)
    vuid_population_landscan = models.IntegerField(blank=True, null=True)
    vuid_area_sqm = models.FloatField(blank=True, null=True)
    language_field = models.CharField(db_column='language_', max_length=255, blank=True) # Field renamed because it ended with '_'.
    lang_code = models.IntegerField(blank=True, null=True)
    name_en = models.CharField(max_length=255, blank=True)
    type_settlement = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    unit_type = models.CharField(max_length=255, blank=True)
    dist_na_dar = models.CharField(max_length=255, blank=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    dist_na_ps = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_ppla'

class AfgPplp(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.PointField(blank=True, null=True)
    source = models.CharField(max_length=255, blank=True)
    vil_uid = models.CharField(max_length=255, blank=True)
    cntr_code = models.IntegerField(blank=True, null=True)
    afg_uid = models.CharField(max_length=255, blank=True)
    language_field = models.CharField(db_column='language_', max_length=255, blank=True) # Field renamed because it ended with '_'.
    lang_code = models.IntegerField(blank=True, null=True)
    elevation = models.FloatField(blank=True, null=True)
    lat_y = models.FloatField(blank=True, null=True)
    lon_x = models.FloatField(blank=True, null=True)
    note = models.CharField(max_length=255, blank=True)
    edited_by = models.CharField(max_length=255, blank=True)
    name_en = models.CharField(max_length=255, blank=True)
    type_settlement = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code_1 = models.IntegerField(blank=True, null=True)
    unit_type = models.CharField(max_length=255, blank=True)
    dist_na_dar = models.CharField(max_length=255, blank=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    dist_na_ps = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    vuid = models.CharField(max_length=255, blank=True)
    vuid_population_landscan = models.IntegerField(blank=True, null=True)
    vuid_area_sqm = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_pplp'

class AfgRdsl(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiLineStringField(blank=True, null=True)
    z_min = models.FloatField(blank=True, null=True)
    z_max = models.FloatField(blank=True, null=True)
    avg_slope = models.FloatField(blank=True, null=True)
    sinuosity = models.FloatField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True)
    source = models.CharField(max_length=255, blank=True)
    speedkmh = models.IntegerField(blank=True, null=True)
    rivercrossingsn = models.IntegerField(blank=True, null=True)
    waterlenght = models.IntegerField(blank=True, null=True)
    builduplenght = models.IntegerField(blank=True, null=True)
    type_update = models.CharField(max_length=255, blank=True)
    temp = models.FloatField(blank=True, null=True)
    reduct_river = models.FloatField(blank=True, null=True)
    reduct_water = models.FloatField(blank=True, null=True)
    reduct_urb = models.FloatField(blank=True, null=True)
    reduct_slope = models.FloatField(blank=True, null=True)
    reduct_sin = models.FloatField(blank=True, null=True)
    adjusted_kmh = models.IntegerField(blank=True, null=True)
    travel_time_in_s = models.FloatField(blank=True, null=True)
    meter_per_second = models.FloatField(blank=True, null=True)
    priority_class = models.IntegerField(blank=True, null=True)
    localtimemin = models.IntegerField(blank=True, null=True)
    urb_factor = models.FloatField(blank=True, null=True)
    dist_code = models.IntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_rdsl'

class AfgRiv(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiLineStringField(blank=True, null=True)
    join_count = models.IntegerField(blank=True, null=True)
    join_cou_1 = models.IntegerField(blank=True, null=True)
    join_cou_2 = models.IntegerField(blank=True, null=True)
    objectid = models.IntegerField(blank=True, null=True)
    arcid = models.IntegerField(blank=True, null=True)
    grid_code = models.IntegerField(blank=True, null=True)
    from_node = models.IntegerField(blank=True, null=True)
    to_node = models.IntegerField(blank=True, null=True)
    shape_leng = models.FloatField(blank=True, null=True)
    idcode = models.IntegerField(blank=True, null=True)
    fnode = models.IntegerField(blank=True, null=True)
    tnode = models.IntegerField(blank=True, null=True)
    strahler = models.IntegerField(blank=True, null=True)
    segment = models.IntegerField(blank=True, null=True)
    shreve = models.IntegerField(blank=True, null=True)
    us_accum = models.FloatField(blank=True, null=True)
    link_type = models.CharField(max_length=255, blank=True)
    riverwidth = models.IntegerField(blank=True, null=True)
    landcover = models.CharField(max_length=255, blank=True)
    vertices = models.IntegerField(blank=True, null=True)
    name = models.CharField(max_length=255, blank=True)
    flooddepth = models.FloatField(blank=True, null=True)
    riverwid_1 = models.FloatField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_riv'

class AfgShedaLvl2(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(dim=3, blank=True, null=True)
    basinnumbe = models.IntegerField(blank=True, null=True)
    basinname = models.CharField(max_length=255, blank=True)
    area = models.IntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_sheda_lvl2'

class AfgShedaLvl3(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(dim=3, blank=True, null=True)
    basinnumbe = models.IntegerField(blank=True, null=True)
    basinname = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_sheda_lvl3'

class AfgShedaLvl4(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    value = models.FloatField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = True
        db_table = 'afg_sheda_lvl4'

class Layer(models.Model):
    topology = models.ForeignKey('Topology')
    layer_id = models.IntegerField()
    schema_name = models.CharField(max_length=255)
    table_name = models.CharField(max_length=255)
    feature_column = models.CharField(max_length=255)
    feature_type = models.IntegerField()
    level = models.IntegerField()
    child_id = models.IntegerField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'layer'

class Topology(models.Model):
    id = models.IntegerField(primary_key=True)
    name = models.CharField(unique=True, max_length=255)
    srid = models.IntegerField()
    precision = models.FloatField()
    hasz = models.BooleanField()
    class Meta:
        managed = False
        db_table = 'topology'

class WrlAdmbndaInt(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    name_en = models.CharField(max_length=255, blank=True)
    continent = models.CharField(max_length=255, blank=True)
    name_prs = models.CharField(max_length=255, blank=True)
    name_ps = models.CharField(max_length=255, blank=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'wrl_admbnda_int'

# Added recently
class FloodRiskExposure(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=255, blank=True)
    code = models.CharField(max_length=255, blank=True)
    class Meta:
        managed = False
        db_table = 'FloodRiskExposure'

class LandcoverDescription(models.Model):
    code = models.CharField(max_length=255, blank=True)
    id = models.IntegerField(primary_key=True)
    class Meta:
        managed = False
        db_table = 'landcover_description'        

class AfgFldzonea100KRiskMitigatedAreas(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(dim=3, blank=True, null=True)
    aggcode = models.CharField(max_length=255, blank=True)
    aggcode_simplified = models.CharField(max_length=255, blank=True)
    agg_simplified_description = models.CharField(max_length=255, blank=True)
    vuid = models.CharField(max_length=255, blank=True)
    vuid_population_landscan = models.IntegerField(blank=True, null=True)
    vuid_area_sqm = models.FloatField(blank=True, null=True)
    name_en = models.CharField(max_length=255, blank=True)
    type_settlement = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    dist_na_dar = models.CharField(max_length=255, blank=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    dist_na_ps = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    deeperthan = models.CharField(max_length=255, blank=True)
    mitigated_fld_pop = models.FloatField(blank=True, null=True)
    mitigated_fld_area_sqm = models.FloatField(blank=True, null=True)
    basin_id = models.FloatField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_fldzonea_100k_risk_mitigated_areas'

class AfgAvsa(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    avalanche_cat = models.CharField(max_length=255, blank=True)
    avalanche_id = models.IntegerField(blank=True, null=True)
    avalanche_zone = models.CharField(max_length=255, blank=True)
    avalanche_area = models.IntegerField(blank=True, null=True)
    avalanche_lenght_m = models.IntegerField(blank=True, null=True)
    vuid = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    basin_id = models.FloatField(blank=True, null=True)
    sum_area_population = models.FloatField(blank=True, null=True)
    sum_area_sqm = models.FloatField(blank=True, null=True)
    avalanche_pop = models.IntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    basinmember = models.ForeignKey(AfgShedaLvl4, related_name='basinmembersava')
    objects = models.GeoManager()
    class Meta:
        managed = False
        db_table = 'afg_avsa'


class AfgFldzonea100KRiskLandcoverPop(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    aggcode = models.CharField(max_length=255, blank=True)
    aggcode_simplified = models.CharField(max_length=255, blank=True)
    agg_simplified_description = models.CharField(max_length=255, blank=True)
    vuid = models.CharField(max_length=255, blank=True)
    vuid_population_landscan = models.IntegerField(blank=True, null=True)
    vuid_area_sqm = models.FloatField(blank=True, null=True)
    name_en = models.CharField(max_length=255, blank=True)
    type_settlement = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    dist_na_dar = models.CharField(max_length=255, blank=True)
    prov_na_dar = models.CharField(max_length=255, blank=True)
    reg_unama_na_en = models.CharField(max_length=255, blank=True)
    dist_na_ps = models.CharField(max_length=255, blank=True)
    reg_unama_na_dar = models.CharField(max_length=255, blank=True)
    deeperthan = models.CharField(max_length=255, blank=True)
    basinname = models.CharField(max_length=255, blank=True)
    fldarea_population = models.FloatField(blank=True, null=True) # this is ......
    fldarea_sqm = models.FloatField(blank=True, null=True)
    basin_id = models.FloatField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    basinmember = models.ForeignKey(AfgShedaLvl4, related_name='basinmembers')
    mitigated_pop = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta():
        managed = False
        db_table = 'afg_fldzonea_100k_risk_landcover_pop'

class Forcastedvalue(models.Model):
    basin = models.ForeignKey(AfgShedaLvl4, related_name='basins')
    datadate = models.DateTimeField(blank=False, null=False)
    forecasttype = models.CharField(max_length=50, blank=False)
    riskstate = models.IntegerField(blank=False, null=False)
    class Meta:
        managed = False
        db_table = 'forcastedvalue' 

class provincesummary(models.Model):
    province                                    = models.CharField(max_length=255, blank=False)
    
    # total
    Population                                  = models.FloatField(blank=True, null=True)
    Area                                        = models.FloatField(blank=True, null=True)
    settlements                                 = models.FloatField(blank=True, null=True) 
    
    # landcover total population
    water_body_pop                              = models.FloatField(blank=True, null=True) 
    barren_land_pop                             = models.FloatField(blank=True, null=True)
    built_up_pop                                = models.FloatField(blank=True, null=True)
    fruit_trees_pop                             = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_pop             = models.FloatField(blank=True, null=True)  
    permanent_snow_pop                          = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_pop               = models.FloatField(blank=True, null=True)
    rangeland_pop                               = models.FloatField(blank=True, null=True)
    sandcover_pop                               = models.FloatField(blank=True, null=True)
    vineyards_pop                               = models.FloatField(blank=True, null=True)
    forest_pop                                  = models.FloatField(blank=True, null=True)
    
    # landcover total area
    water_body_area                             = models.FloatField(blank=True, null=True)
    barren_land_area                            = models.FloatField(blank=True, null=True)
    built_up_area                               = models.FloatField(blank=True, null=True) 
    fruit_trees_area                            = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_area            = models.FloatField(blank=True, null=True)
    permanent_snow_area                         = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_area              = models.FloatField(blank=True, null=True)
    rangeland_area                              = models.FloatField(blank=True, null=True) 
    sandcover_area                              = models.FloatField(blank=True, null=True)
    vineyards_area                              = models.FloatField(blank=True, null=True)
    forest_area                                 = models.FloatField(blank=True, null=True)
    
    # Flood Risk Population
    high_risk_population                        = models.FloatField(blank=True, null=True)
    med_risk_population                         = models.FloatField(blank=True, null=True)
    low_risk_population                         = models.FloatField(blank=True, null=True)
    total_risk_population                       = models.FloatField(blank=True, null=True) 
    settlements_at_risk                         = models.FloatField(blank=True, null=True)
    
    # Flood Risk Area
    high_risk_area                              = models.FloatField(blank=True, null=True) 
    med_risk_area                               = models.FloatField(blank=True, null=True)
    low_risk_area                               = models.FloatField(blank=True, null=True)  
    total_risk_area                             = models.FloatField(blank=True, null=True)
    
    # landcover flood risk population
    water_body_pop_risk                         = models.FloatField(blank=True, null=True)
    barren_land_pop_risk                        = models.FloatField(blank=True, null=True) 
    built_up_pop_risk                           = models.FloatField(blank=True, null=True)
    fruit_trees_pop_risk                        = models.FloatField(blank=True, null=True)
    irrigated_agricultural_land_pop_risk        = models.FloatField(blank=True, null=True)    
    permanent_snow_pop_risk                     = models.FloatField(blank=True, null=True) 
    rainfed_agricultural_land_pop_risk          = models.FloatField(blank=True, null=True)
    rangeland_pop_risk                          = models.FloatField(blank=True, null=True) 
    sandcover_pop_risk                          = models.FloatField(blank=True, null=True)
    vineyards_pop_risk                          = models.FloatField(blank=True, null=True)
    forest_pop_risk                             = models.FloatField(blank=True, null=True) 

    # landcover flood risk area
    water_body_area_risk                        = models.FloatField(blank=True, null=True)
    barren_land_area_risk                       = models.FloatField(blank=True, null=True)
    built_up_area_risk                          = models.FloatField(blank=True, null=True)
    fruit_trees_area_risk                       = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_area_risk       = models.FloatField(blank=True, null=True) 
    permanent_snow_area_risk                    = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_area_risk         = models.FloatField(blank=True, null=True)
    rangeland_area_risk                         = models.FloatField(blank=True, null=True)
    sandcover_area_risk                         = models.FloatField(blank=True, null=True)
    vineyards_area_risk                         = models.FloatField(blank=True, null=True)
    forest_area_risk                            = models.FloatField(blank=True, null=True)

    # Avalanche Risk Population
    high_ava_population                         = models.FloatField(blank=True, null=True)
    med_ava_population                          = models.FloatField(blank=True, null=True)
    low_ava_population                          = models.FloatField(blank=True, null=True)    
    total_ava_population                        = models.FloatField(blank=True, null=True)

    # Avalanche Risk Area
    high_ava_area                               = models.FloatField(blank=True, null=True)
    med_ava_area                                = models.FloatField(blank=True, null=True) 
    low_ava_area                                = models.FloatField(blank=True, null=True)
    total_ava_area                              = models.FloatField(blank=True, null=True)

    ### Forecasting Sections  ###
    # --- This section values will be updated every 3 hours --- #

    # River Flood Forecasted Population 
    riverflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    riverflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_pop               = models.FloatField(blank=True, null=True)
    
    # River Flood Forecasted Area
    riverflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_area               = models.FloatField(blank=True, null=True) 
    riverflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_area            = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Flash Flood Forecasted Population
    flashflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True) 
    flashflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)     
    flashflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_flashflood_forecast_pop               = models.FloatField(blank=True, null=True)

    # Flash Flood Forecasted Area
    flashflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    flashflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_area               = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_area            = models.FloatField(blank=True, null=True) 
    total_flashflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Avalanche Forecasted Population
    ava_forecast_low_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_med_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_high_pop                       = models.FloatField(blank=True, null=True)
    total_ava_forecast_pop                      = models.FloatField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'provincesummary'             

class districtsummary(models.Model):
    district                                    = models.CharField(max_length=255, blank=False)
    
    # total
    Population                                  = models.FloatField(blank=True, null=True)
    Area                                        = models.FloatField(blank=True, null=True)
    settlements                                 = models.FloatField(blank=True, null=True) 
    
    # landcover total population
    water_body_pop                              = models.FloatField(blank=True, null=True) 
    barren_land_pop                             = models.FloatField(blank=True, null=True)
    built_up_pop                                = models.FloatField(blank=True, null=True)
    fruit_trees_pop                             = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_pop             = models.FloatField(blank=True, null=True)  
    permanent_snow_pop                          = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_pop               = models.FloatField(blank=True, null=True)
    rangeland_pop                               = models.FloatField(blank=True, null=True)
    sandcover_pop                               = models.FloatField(blank=True, null=True)
    vineyards_pop                               = models.FloatField(blank=True, null=True)
    forest_pop                                  = models.FloatField(blank=True, null=True)
    
    # landcover total area
    water_body_area                             = models.FloatField(blank=True, null=True)
    barren_land_area                            = models.FloatField(blank=True, null=True)
    built_up_area                               = models.FloatField(blank=True, null=True) 
    fruit_trees_area                            = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_area            = models.FloatField(blank=True, null=True)
    permanent_snow_area                         = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_area              = models.FloatField(blank=True, null=True)
    rangeland_area                              = models.FloatField(blank=True, null=True) 
    sandcover_area                              = models.FloatField(blank=True, null=True)
    vineyards_area                              = models.FloatField(blank=True, null=True)
    forest_area                                 = models.FloatField(blank=True, null=True)
    
    # Flood Risk Population
    high_risk_population                        = models.FloatField(blank=True, null=True)
    med_risk_population                         = models.FloatField(blank=True, null=True)
    low_risk_population                         = models.FloatField(blank=True, null=True)
    total_risk_population                       = models.FloatField(blank=True, null=True) 
    settlements_at_risk                         = models.FloatField(blank=True, null=True)
    
    # Flood Risk Area
    high_risk_area                              = models.FloatField(blank=True, null=True) 
    med_risk_area                               = models.FloatField(blank=True, null=True)
    low_risk_area                               = models.FloatField(blank=True, null=True)  
    total_risk_area                             = models.FloatField(blank=True, null=True)
    
    # landcover flood risk population
    water_body_pop_risk                         = models.FloatField(blank=True, null=True)
    barren_land_pop_risk                        = models.FloatField(blank=True, null=True) 
    built_up_pop_risk                           = models.FloatField(blank=True, null=True)
    fruit_trees_pop_risk                        = models.FloatField(blank=True, null=True)
    irrigated_agricultural_land_pop_risk        = models.FloatField(blank=True, null=True)    
    permanent_snow_pop_risk                     = models.FloatField(blank=True, null=True) 
    rainfed_agricultural_land_pop_risk          = models.FloatField(blank=True, null=True)
    rangeland_pop_risk                          = models.FloatField(blank=True, null=True) 
    sandcover_pop_risk                          = models.FloatField(blank=True, null=True)
    vineyards_pop_risk                          = models.FloatField(blank=True, null=True)
    forest_pop_risk                             = models.FloatField(blank=True, null=True) 

    # landcover flood risk area
    water_body_area_risk                        = models.FloatField(blank=True, null=True)
    barren_land_area_risk                       = models.FloatField(blank=True, null=True)
    built_up_area_risk                          = models.FloatField(blank=True, null=True)
    fruit_trees_area_risk                       = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_area_risk       = models.FloatField(blank=True, null=True) 
    permanent_snow_area_risk                    = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_area_risk         = models.FloatField(blank=True, null=True)
    rangeland_area_risk                         = models.FloatField(blank=True, null=True)
    sandcover_area_risk                         = models.FloatField(blank=True, null=True)
    vineyards_area_risk                         = models.FloatField(blank=True, null=True)
    forest_area_risk                            = models.FloatField(blank=True, null=True)

    # Avalanche Risk Population
    high_ava_population                         = models.FloatField(blank=True, null=True)
    med_ava_population                          = models.FloatField(blank=True, null=True)
    low_ava_population                          = models.FloatField(blank=True, null=True)    
    total_ava_population                        = models.FloatField(blank=True, null=True)

    # Avalanche Risk Area
    high_ava_area                               = models.FloatField(blank=True, null=True)
    med_ava_area                                = models.FloatField(blank=True, null=True) 
    low_ava_area                                = models.FloatField(blank=True, null=True)
    total_ava_area                              = models.FloatField(blank=True, null=True)

    ### Forecasting Sections  ###
    # --- This section values will be updated every 3 hours --- #

    # River Flood Forecasted Population 
    riverflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    riverflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_pop               = models.FloatField(blank=True, null=True)
    
    # River Flood Forecasted Area
    riverflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_area               = models.FloatField(blank=True, null=True) 
    riverflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_area            = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Flash Flood Forecasted Population
    flashflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True) 
    flashflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)     
    flashflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_flashflood_forecast_pop               = models.FloatField(blank=True, null=True)

    # Flash Flood Forecasted Area
    flashflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    flashflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_area               = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_area            = models.FloatField(blank=True, null=True) 
    total_flashflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Avalanche Forecasted Population
    ava_forecast_low_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_med_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_high_pop                       = models.FloatField(blank=True, null=True)
    total_ava_forecast_pop                      = models.FloatField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'districtsummary'

class basinsummary(models.Model):
    basin                                      = models.CharField(max_length=255, blank=False)
    
    # total
    Population                                  = models.FloatField(blank=True, null=True)
    Area                                        = models.FloatField(blank=True, null=True)
    settlements                                 = models.FloatField(blank=True, null=True) 
    
    # landcover total population
    water_body_pop                              = models.FloatField(blank=True, null=True) 
    barren_land_pop                             = models.FloatField(blank=True, null=True)
    built_up_pop                                = models.FloatField(blank=True, null=True)
    fruit_trees_pop                             = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_pop             = models.FloatField(blank=True, null=True)  
    permanent_snow_pop                          = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_pop               = models.FloatField(blank=True, null=True)
    rangeland_pop                               = models.FloatField(blank=True, null=True)
    sandcover_pop                               = models.FloatField(blank=True, null=True)
    vineyards_pop                               = models.FloatField(blank=True, null=True)
    forest_pop                                  = models.FloatField(blank=True, null=True)
    
    # landcover total area
    water_body_area                             = models.FloatField(blank=True, null=True)
    barren_land_area                            = models.FloatField(blank=True, null=True)
    built_up_area                               = models.FloatField(blank=True, null=True) 
    fruit_trees_area                            = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_area            = models.FloatField(blank=True, null=True)
    permanent_snow_area                         = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_area              = models.FloatField(blank=True, null=True)
    rangeland_area                              = models.FloatField(blank=True, null=True) 
    sandcover_area                              = models.FloatField(blank=True, null=True)
    vineyards_area                              = models.FloatField(blank=True, null=True)
    forest_area                                 = models.FloatField(blank=True, null=True)
    
    # Flood Risk Population
    high_risk_population                        = models.FloatField(blank=True, null=True)
    med_risk_population                         = models.FloatField(blank=True, null=True)
    low_risk_population                         = models.FloatField(blank=True, null=True)
    total_risk_population                       = models.FloatField(blank=True, null=True) 
    settlements_at_risk                         = models.FloatField(blank=True, null=True)
    
    # Flood Risk Area
    high_risk_area                              = models.FloatField(blank=True, null=True) 
    med_risk_area                               = models.FloatField(blank=True, null=True)
    low_risk_area                               = models.FloatField(blank=True, null=True)  
    total_risk_area                             = models.FloatField(blank=True, null=True)
    
    # landcover flood risk population
    water_body_pop_risk                         = models.FloatField(blank=True, null=True)
    barren_land_pop_risk                        = models.FloatField(blank=True, null=True) 
    built_up_pop_risk                           = models.FloatField(blank=True, null=True)
    fruit_trees_pop_risk                        = models.FloatField(blank=True, null=True)
    irrigated_agricultural_land_pop_risk        = models.FloatField(blank=True, null=True)    
    permanent_snow_pop_risk                     = models.FloatField(blank=True, null=True) 
    rainfed_agricultural_land_pop_risk          = models.FloatField(blank=True, null=True)
    rangeland_pop_risk                          = models.FloatField(blank=True, null=True) 
    sandcover_pop_risk                          = models.FloatField(blank=True, null=True)
    vineyards_pop_risk                          = models.FloatField(blank=True, null=True)
    forest_pop_risk                             = models.FloatField(blank=True, null=True) 

    # landcover flood risk area
    water_body_area_risk                        = models.FloatField(blank=True, null=True)
    barren_land_area_risk                       = models.FloatField(blank=True, null=True)
    built_up_area_risk                          = models.FloatField(blank=True, null=True)
    fruit_trees_area_risk                       = models.FloatField(blank=True, null=True) 
    irrigated_agricultural_land_area_risk       = models.FloatField(blank=True, null=True) 
    permanent_snow_area_risk                    = models.FloatField(blank=True, null=True)
    rainfed_agricultural_land_area_risk         = models.FloatField(blank=True, null=True)
    rangeland_area_risk                         = models.FloatField(blank=True, null=True)
    sandcover_area_risk                         = models.FloatField(blank=True, null=True)
    vineyards_area_risk                         = models.FloatField(blank=True, null=True)
    forest_area_risk                            = models.FloatField(blank=True, null=True)

    # Avalanche Risk Population
    high_ava_population                         = models.FloatField(blank=True, null=True)
    med_ava_population                          = models.FloatField(blank=True, null=True)
    low_ava_population                          = models.FloatField(blank=True, null=True)    
    total_ava_population                        = models.FloatField(blank=True, null=True)

    # Avalanche Risk Area
    high_ava_area                               = models.FloatField(blank=True, null=True)
    med_ava_area                                = models.FloatField(blank=True, null=True) 
    low_ava_area                                = models.FloatField(blank=True, null=True)
    total_ava_area                              = models.FloatField(blank=True, null=True)

    ### Forecasting Sections  ###
    # --- This section values will be updated every 3 hours --- #

    # River Flood Forecasted Population 
    riverflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    riverflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_pop               = models.FloatField(blank=True, null=True)
    
    # River Flood Forecasted Area
    riverflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_area               = models.FloatField(blank=True, null=True) 
    riverflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_area            = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Flash Flood Forecasted Population
    flashflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True) 
    flashflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)     
    flashflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_flashflood_forecast_pop               = models.FloatField(blank=True, null=True)

    # Flash Flood Forecasted Area
    flashflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    flashflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_area               = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_area            = models.FloatField(blank=True, null=True) 
    total_flashflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Avalanche Forecasted Population
    ava_forecast_low_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_med_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_high_pop                       = models.FloatField(blank=True, null=True)
    total_ava_forecast_pop                      = models.FloatField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'basinsummary'   

class tempCurrentSC(models.Model):
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = True
        db_table = 'temp_current_sc'

class earthquake_events(models.Model):
    wkb_geometry = models.PointField(blank=True, null=True)
    event_code = models.CharField(max_length=25, blank=False)
    title = models.CharField(max_length=255, blank=False)
    dateofevent = models.DateTimeField(blank=False, null=False)
    magnitude = models.FloatField(blank=True, null=True)
    depth = models.FloatField(blank=True, null=True)
    shakemaptimestamp = models.BigIntegerField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = True
        db_table = 'earthquake_events'

class earthquake_shakemap(models.Model):
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    event_code = models.CharField(max_length=25, blank=True)
    shakemaptimestamp = models.BigIntegerField(blank=True, null=True)
    grid_value = models.IntegerField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = True
        db_table = 'earthquake_shakemap'        

class villagesummaryEQ(models.Model):
    event_code = models.CharField(max_length=20, blank=False)
    village = models.CharField(max_length=255, blank=False)
    district = models.CharField(max_length=255, blank=False)
    pop_shake_weak =  models.FloatField(blank=True, null=True) 
    pop_shake_light =  models.FloatField(blank=True, null=True) 
    pop_shake_moderate =  models.FloatField(blank=True, null=True) 
    pop_shake_strong =  models.FloatField(blank=True, null=True) 
    pop_shake_verystrong =  models.FloatField(blank=True, null=True) 
    pop_shake_severe =  models.FloatField(blank=True, null=True) 
    pop_shake_violent =  models.FloatField(blank=True, null=True) 
    pop_shake_extreme =  models.FloatField(blank=True, null=True)   

    settlement_shake_weak =  models.FloatField(blank=True, null=True) 
    settlement_shake_light =  models.FloatField(blank=True, null=True) 
    settlement_shake_moderate =  models.FloatField(blank=True, null=True) 
    settlement_shake_strong =  models.FloatField(blank=True, null=True) 
    settlement_shake_verystrong =  models.FloatField(blank=True, null=True) 
    settlement_shake_severe =  models.FloatField(blank=True, null=True) 
    settlement_shake_violent =  models.FloatField(blank=True, null=True) 
    settlement_shake_extreme =  models.FloatField(blank=True, null=True)     
    class Meta:
        managed = True
        db_table = 'villagesummary_eq'         

class AfgPplaBasin(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    vuid = models.CharField(max_length=255, blank=True)
    name_en = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=255, blank=True)
    prov_na_en = models.CharField(max_length=255, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    basin_id = models.FloatField(blank=True, null=True)
    area_population = models.FloatField(blank=True, null=True)
    area_sqm = models.FloatField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    basinmember = models.ForeignKey(AfgShedaLvl4, related_name='basinmemberpplp')
    objects = models.GeoManager()
    class Meta:
        managed = True
        db_table = 'afg_ppla_basin'

class villagesummary(models.Model):
    vuid                                       = models.CharField(max_length=255, blank=False)
    basin                                      = models.CharField(max_length=255, blank=False)
    ### Forecasting Sections  ###
    # --- This section values will be updated every 3 hours --- #

    # River Flood Forecasted Population 
    riverflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    riverflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_pop               = models.FloatField(blank=True, null=True)
    
    # River Flood Forecasted Area
    riverflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    riverflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    riverflood_forecast_high_area               = models.FloatField(blank=True, null=True) 
    riverflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True) 
    riverflood_forecast_extreme_area            = models.FloatField(blank=True, null=True)
    total_riverflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Flash Flood Forecasted Population
    flashflood_forecast_verylow_pop             = models.FloatField(blank=True, null=True) 
    flashflood_forecast_low_pop                 = models.FloatField(blank=True, null=True)     
    flashflood_forecast_med_pop                 = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_pop                = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_pop            = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_pop             = models.FloatField(blank=True, null=True)
    total_flashflood_forecast_pop               = models.FloatField(blank=True, null=True)

    # Flash Flood Forecasted Area
    flashflood_forecast_verylow_area            = models.FloatField(blank=True, null=True)
    flashflood_forecast_low_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_med_area                = models.FloatField(blank=True, null=True)
    flashflood_forecast_high_area               = models.FloatField(blank=True, null=True)
    flashflood_forecast_veryhigh_area           = models.FloatField(blank=True, null=True)
    flashflood_forecast_extreme_area            = models.FloatField(blank=True, null=True) 
    total_flashflood_forecast_area              = models.FloatField(blank=True, null=True) 

    # Avalanche Forecasted Population
    ava_forecast_low_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_med_pop                        = models.FloatField(blank=True, null=True) 
    ava_forecast_high_pop                       = models.FloatField(blank=True, null=True)
    total_ava_forecast_pop                      = models.FloatField(blank=True, null=True)

    class Meta:
        managed = True
        db_table = 'villagesummary'   

class AfgSnowaAverageExtent(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.MultiPolygonField(blank=True, null=True)
    aver_cov = models.CharField(max_length=50, blank=True)
    cov_10_oct = models.CharField(max_length=50, blank=True)
    cov_11_nov = models.CharField(max_length=50, blank=True)
    cov_05_may = models.CharField(max_length=50, blank=True)
    cov_03_mar = models.CharField(max_length=50, blank=True)
    cov_04_apr = models.CharField(max_length=50, blank=True)
    cov_08_aug = models.CharField(max_length=50, blank=True)
    cov_12_dec = models.CharField(max_length=50, blank=True)
    cov_02_feb = models.CharField(max_length=50, blank=True)
    cov_01_jan = models.CharField(max_length=50, blank=True)
    cov_07_jul = models.CharField(max_length=50, blank=True)
    cov_06_jun = models.CharField(max_length=50, blank=True)
    cov_09_sep = models.CharField(max_length=50, blank=True)
    source = models.CharField(max_length=250, blank=True)
    author = models.CharField(max_length=250, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    shape_length = models.FloatField(blank=True, null=True)
    shape_area = models.FloatField(blank=True, null=True)
    objects = models.GeoManager()
    class Meta:
        managed = True
        db_table = 'afg_snowa_average_extent'

class AfgCaptPpl(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    vil_uid = models.CharField(max_length=50, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    distance_to_road = models.IntegerField(blank=True, null=True)
    time_to_road = models.IntegerField(blank=True, null=True)
    airdrm_id = models.IntegerField(blank=True, null=True)
    airdrm_dist = models.IntegerField(blank=True, null=True)
    airdrm_time = models.IntegerField(blank=True, null=True)
    ppl_provc_vuid = models.CharField(max_length=50, blank=True)
    ppl_provc_dist = models.IntegerField(blank=True, null=True)
    ppl_provc_time = models.IntegerField(blank=True, null=True)
    ppl_provc_its_vuid = models.CharField(max_length=50, blank=True)
    ppl_provc_its_dist = models.IntegerField(blank=True, null=True)
    ppl_provc_its_time = models.IntegerField(blank=True, null=True)
    ppl_distc_vuid = models.CharField(max_length=50, blank=True)
    ppl_distc_dist = models.IntegerField(blank=True, null=True)
    ppl_distc_time = models.IntegerField(blank=True, null=True)
    ppl_distc_its_vuid = models.CharField(max_length=50, blank=True)
    ppl_distc_its_dist = models.IntegerField(blank=True, null=True)
    ppl_distc_its_time = models.IntegerField(blank=True, null=True)
    hltfac_tier1_id = models.IntegerField(blank=True, null=True)
    hltfac_tier1_dist = models.IntegerField(blank=True, null=True)
    hltfac_tier1_time = models.IntegerField(blank=True, null=True)
    hltfac_tier2_id = models.IntegerField(blank=True, null=True)
    hltfac_tier2_dist = models.IntegerField(blank=True, null=True)
    hltfac_tier2_time = models.IntegerField(blank=True, null=True)
    hltfac_tier3_id = models.IntegerField(blank=True, null=True)
    hltfac_tier3_dist = models.IntegerField(blank=True, null=True)
    hltfac_tier3_time = models.IntegerField(blank=True, null=True)
    class Meta:
        managed = True
        db_table = 'afg_capt_ppl'        

class AfgHltfac(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    wkb_geometry = models.PointField(blank=True, null=True)
    facility_id = models.FloatField(blank=True, null=True)
    vilicode = models.CharField(max_length=50, blank=True)
    facility_name = models.CharField(max_length=255, blank=True)
    facility_name_dari = models.CharField(max_length=255, blank=True)
    facility_name_pashto = models.CharField(max_length=255, blank=True)
    location = models.CharField(max_length=255, blank=True)
    location_dari = models.CharField(max_length=255, blank=True)
    location_pashto = models.CharField(max_length=255, blank=True)
    facilitytype = models.FloatField(blank=True, null=True)
    lat = models.FloatField(blank=True, null=True)
    lon = models.FloatField(blank=True, null=True)
    activestatus = models.CharField(max_length=255, blank=True)
    date_established = models.DateTimeField(blank=True, null=True)
    subimplementer = models.CharField(max_length=255, blank=True)
    locationsource = models.CharField(max_length=255, blank=True)
    moph = models.CharField(max_length=250, blank=True)
    hproreply = models.CharField(max_length=250, blank=True)
    facility_types_description = models.CharField(max_length=255, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    dist_na_en = models.CharField(max_length=250, blank=True)
    prov_na_en = models.CharField(max_length=250, blank=True)
    prov_code = models.IntegerField(blank=True, null=True)
    hpro_facilitytypes_description = models.CharField(max_length=250, blank=True)
    objects = models.GeoManager()
    class Meta:
        managed = True
        db_table = 'afg_hltfac'       


class forecastedLastUpdate(models.Model):
    datadate = models.DateTimeField(blank=False, null=False)
    forecasttype = models.CharField(max_length=50, blank=False) 
    class Meta:
        managed = True
        db_table = 'forecastedlastupdate' 

class AfgCaptAdm1ItsProvcImmap(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    vuid = models.CharField(max_length=50, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    facilities_name = models.CharField(max_length=50, blank=True)
    time = models.CharField(max_length=50, blank=True)
    sum_area_population = models.FloatField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_capt_adm1_its_provc_immap'

class AfgCaptAdm1NearestProvcImmap(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    vuid = models.CharField(max_length=50, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    facilities_name = models.CharField(max_length=50, blank=True)
    time = models.CharField(max_length=50, blank=True)
    sum_area_population = models.FloatField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_capt_adm1_nearest_provc_immap'

class AfgCaptAdm2NearestDistrictcImmap(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    vuid = models.CharField(max_length=50, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    facilities_name = models.CharField(max_length=50, blank=True)
    time = models.CharField(max_length=50, blank=True)
    sum_area_population = models.FloatField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_capt_adm2_nearest_districtc_immap'

class AfgCaptAirdrmImmap(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    vuid = models.CharField(max_length=50, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    facilities_name = models.CharField(max_length=50, blank=True)
    time = models.CharField(max_length=50, blank=True)
    sum_area_population = models.FloatField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_capt_airdrm_immap'

class AfgCaptHltfacTier1Immap(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    vuid = models.CharField(max_length=50, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    facilities_name = models.CharField(max_length=50, blank=True)
    time = models.CharField(max_length=50, blank=True)
    sum_area_population = models.FloatField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_capt_hltfac_tier1_immap'

class AfgCaptHltfacTier2Immap(models.Model):
    ogc_fid = models.IntegerField(primary_key=True)
    vuid = models.CharField(max_length=50, blank=True)
    dist_code = models.IntegerField(blank=True, null=True)
    facilities_name = models.CharField(max_length=50, blank=True)
    time = models.CharField(max_length=50, blank=True)
    sum_area_population = models.FloatField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_capt_hltfac_tier2_immap'
