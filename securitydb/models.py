#from django.db import models
from django.contrib.gis.db import models
from django.forms import ModelForm
from django.core.validators import MinValueValidator, MaxValueValidator

class SecureFeature(models.Model):
	id = models.AutoField(primary_key=True)
	scre_notes = models.TextField(null=True, blank=True)
	scre_username = models.CharField(max_length=255, blank=True)
	scre_sourceid = models.ForeignKey('SourceType')
	scre_sourcename = models.CharField(max_length=255, null=True, blank=True) #only for table, not viewed on the form
	scre_incidentdatestr = models.CharField(max_length=10)
	scre_incidenttimestr = models.CharField(max_length=5)
	scre_incidentdate = models.DateTimeField(null=True, blank=True)
	scre_eventid = models.ForeignKey('EventType')
	scre_eventname = models.CharField(max_length=255, null=True, blank=True) #only for table, not viewed on the form
	scre_incidenttarget = models.ForeignKey('IncidentTarget')
	scre_incidenttargetname = models.CharField(max_length=255, null=True, blank=True) #only for table, not viewed on the form
	scre_violent = models.BooleanField(default=False)
	scre_unknown = models.BooleanField(default=False)
	scre_arrested = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
	scre_injured = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
	scre_dead = models.PositiveIntegerField(null=True, blank=True, validators=[MinValueValidator(0)])
	scre_provid = models.IntegerField(blank=True, null=True)
	# scre_provid = models.ForeignKey('geodb.AfgAdmbndaAdm1', to_field="prov_code", db_column="scre_provid", null=True, blank=True)
	scre_provname = models.CharField(max_length=255, null=True, blank=True) #only for table, not viewed on the form
	scre_distid = models.IntegerField(blank=True, null=True)
	# scre_distid = models.ForeignKey('geodb.AfgAdmbndaAdm2', to_field="dist_code", db_column="scre_distid", null=True, blank=True)
	scre_distname = models.CharField(max_length=255, null=True, blank=True) #only for table, not viewed on the form
	scre_placename = models.CharField(max_length=255, null=True, blank=True)
	scre_latitude = models.FloatField(null=True, blank=True)
	scre_longitude = models.FloatField(null=True, blank=True)
    # GeoDjango-specific: a geometry field (MultiPolygonField), and
    # overriding the default manager with a GeoManager instance.
	mpoint = models.PointField(null=True, blank=True)
	objects = models.GeoManager()

	userid = models.IntegerField(null=True, blank=True)
	entrydatetime = models.DateTimeField(null=True, blank=True)
	userud = models.IntegerField(null=True, blank=True)
	updatedatetime = models.DateTimeField(null=True, blank=True)
	recstatus = models.IntegerField(null=True, blank=True)
	scre_settvuid = models.CharField(max_length=255, null=True, blank=True)
	# scre_settvuid = models.ForeignKey('geodb.AfgPpla', to_field="vuid", db_column="scre_settvuid", null=True, blank=True)
	class Meta:
		managed = True
		db_table = 'afg_scr_securefeature'
	def __unicode__(self):
		return self.scre_notes

# ---------------------------------- Its moved from ishlah/models.py
	# standard table for accountability
	# userid = id based on user login
	# entrydate = based on first entry date by system
	# entrytime = based on first entry time by system
	# userud = id user updated based on user login
	# updatedate = based on last update date by system
	# updatetime = based on last update time by system
	# recstatus = record status. 0: delete, 1: input, 2: approved. First entry recstatus = 1

class SourceGroup(models.Model):
	id = models.AutoField(primary_key=True)
	scrg_name = models.CharField(max_length=255, blank=True)

	userid = models.IntegerField(null=True, blank=True)
	entrydatetime = models.DateTimeField(null=True, blank=True)
	userud = models.IntegerField(null=True, blank=True)
	updatedatetime = models.DateTimeField(null=True, blank=True)
	recstatus = models.IntegerField(null=True, blank=True)
	class Meta:
		managed = True
		db_table = 'afg_scr_sourcegroup'
		#ordering = ['scrg_name']
	def __unicode__(self):
		return self.scrg_name

class SourceType(models.Model):
	id = models.AutoField(primary_key=True)
	scrc_scrgid  = models.ForeignKey(SourceGroup, db_column='scrc_scrgid', blank=True, null=True)
	scrc_name = models.CharField(max_length=255, blank=True)
	scrc_description = models.CharField(max_length=400, null=True, blank=True)
	scrc_url = models.CharField(max_length=255, null=True, blank=True)

	userid = models.IntegerField(null=True, blank=True)
	entrydatetime = models.DateTimeField(null=True, blank=True)
	userud = models.IntegerField(null=True, blank=True)
	updatedatetime = models.DateTimeField(null=True, blank=True)
	recstatus = models.IntegerField(null=True, blank=True)
	class Meta:
		managed = True
		db_table = 'afg_scr_sourcetype'
		#ordering = ['scrc_name']
	def __unicode__(self):
		return self.scrc_name

class AfgScrEventtypecat(models.Model):
    id = models.AutoField(primary_key=True)
    cat_name = models.CharField(max_length=255, blank=True)
    name_short = models.CharField(max_length=255, blank=True)

    userid = models.IntegerField(blank=True, null=True)
    entrydatetime = models.DateTimeField(blank=True, null=True)
    userud = models.IntegerField(blank=True, null=True)
    updatedatetime = models.DateTimeField(blank=True, null=True)
    recstatus = models.IntegerField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_scr_eventtypecat'
    def __unicode__(self):
        return self.cat_name

class EventType(models.Model):
	id = models.AutoField(primary_key=True)
	evnt_name = models.CharField(max_length=255)
	# evnt_cat = models.IntegerField(blank=True, null=True)

	userid = models.IntegerField(null=True, blank=True)
	entrydatetime = models.DateTimeField(null=True, blank=True)
	userud = models.IntegerField(null=True, blank=True)
	updatedatetime = models.DateTimeField(null=True, blank=True)
	recstatus = models.IntegerField(null=True, blank=True)
	evnt_cat = models.ForeignKey(AfgScrEventtypecat, db_column='evnt_cat', blank=True, null=True)
	class Meta:
		managed = True
		db_table = 'afg_scr_eventtype'
		#ordering = ['evnt_name']
	def __unicode__(self):
		return self.evnt_name

class AfgScrIncidenttargetcat(models.Model):
    id = models.IntegerField(primary_key=True)
    cat_name = models.CharField(max_length=255)
    name_short = models.CharField(max_length=255, blank=True)

    userid = models.IntegerField(blank=True, null=True)
    entrydatetime = models.DateTimeField(blank=True, null=True)
    userud = models.IntegerField(blank=True, null=True)
    updatedatetime = models.DateTimeField(blank=True, null=True)
    recstatus = models.IntegerField(blank=True, null=True)
    class Meta:
        managed = False
        db_table = 'afg_scr_incidenttargetcat'
    def __unicode__(self):
        return self.cat_name

class IncidentTarget(models.Model):
	id = models.AutoField(primary_key=True)
	inct_name = models.CharField(max_length=255)
	inct_short = models.CharField(max_length=255, null=True, blank=True)
	inct_description= models.CharField(max_length=400, null=True, blank=True)
	inct_scoring = models.IntegerField(null=True, blank=True)
	inct_catid = models.ForeignKey(AfgScrIncidenttargetcat, db_column='inct_catid', blank=True, null=True)

	userid = models.IntegerField(null=True, blank=True)
	entrydatetime = models.DateTimeField(null=True, blank=True)
	userud = models.IntegerField(null=True, blank=True)
	updatedatetime = models.DateTimeField(null=True, blank=True)
	recstatus = models.IntegerField(null=True, blank=True)
	class Meta:
		managed = True
		db_table = 'afg_scr_incidenttarget'
		#ordering = ['inct_name']
	def __unicode__(self):
		return self.inct_name
