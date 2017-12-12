# make sure this is at the top if it isn't already
from django import forms
from django.forms import ModelForm
from django.forms.util import ErrorList
from django.forms.forms import NON_FIELD_ERRORS
from django.forms import ModelChoiceField, Select

#from bootstrap3_datepicker.fields import DatePickerField
#from bootstrap3_datepicker.widgets import DatePickerInput
from bootstrap3_datetime.widgets import DateTimePicker

from securitydb.models import SecureFeature
from securitydb.models import IncidentTarget
from securitydb.models import SourceType
from securitydb.models import EventType
from geodb.models import AfgAdmbndaAdm1
from geodb.models import AfgAdmbndaAdm2
from geodb.models import AfgPplp, AfgPpla
# from django.contrib.auth.models import User

import json
from datetime import datetime, timedelta
from securitydb.includes import *

class SecureFeatureForm(ModelForm):

	# scre_provid = ModelChoiceField(
	# 	queryset=AfgAdmbndaAdm1.objects.all().order_by('prov_na_en'),
	# 	# widget=Select(option_attrs={'class':'hidden'}),
	# 	to_field_name="prov_code",
	# 	required=False,
	# 	label='Province'
	# 	)
	scre_provid = forms.ChoiceField(
		choices = [],
		# required=False,
		label='Province'
		)
	scre_distid = forms.ChoiceField(
		choices = [],
		# required=False,
		label='District'
		)
	scre_settvuid = forms.ChoiceField(
		choices = [],
		# disabled=True,
		# required=False,
		label='Settlement')
	recstatus = forms.ChoiceField(
		widget = forms.Select(),
		choices = recstatus_choices_title_case,
		initial=1, # currently doesnt work
		# required = True,
		label = 'Record Status',
		)
	scre_violent = forms.ChoiceField(
		widget = forms.RadioSelect(),
		choices = yesno_choices,
		initial=1, # currently doesnt work
		# required = True,
		label = 'Violent',
		)

	class Meta:
		model = SecureFeature
		fields = (
			'id',
			'scre_notes',
			'scre_username',
			'scre_provid',
			'scre_distid',
			'scre_settvuid',
			'scre_placename',
			'scre_latitude',
			'scre_longitude',
			'scre_incidenttimestr',
			'scre_incidentdatestr',
			'scre_sourceid',
			'scre_eventid',
			'scre_incidenttarget',
			'scre_violent',
			'scre_unknown',
			'scre_arrested',
			'scre_injured',
			'scre_dead',
			# 'scre_incidentdate',
			# 'mpoint',
			# 'userid',
			# 'entrydatetime',
			'recstatus'
			# 'userud',
			# 'updatedatetime',
			# 'scre_sourcename',
			# 'scre_eventname',
			# 'scre_incidenttargetname',
			# 'scre_provname',
			# 'scre_distname'
		)

		widgets = {
			'scre_incidentdate': forms.HiddenInput(),
			'mpoint': forms.HiddenInput(),
			'userid': forms.HiddenInput(),
			'entrydatetime': forms.HiddenInput(),
			'userud': forms.HiddenInput(),
			'updatedatetime': forms.HiddenInput(),
			'scre_sourcename': forms.HiddenInput(),
			'scre_eventname': forms.HiddenInput(),
			'scre_incidenttargetname': forms.HiddenInput(),
			'scre_provname': forms.HiddenInput(),
			'scre_distname': forms.HiddenInput(),

			# 'recstatus': forms.Select(),

			'scre_incidentdatestr': DateTimePicker(options={"format": "YYYY-MM-DD"
				# , "maxDate": json.dumps(datetime.datetime.today(), default=json_util.default)
				# , "maxDate": (datetime.now() + timedelta(days=1)).strftime('%Y-%m-%d')
				, "maxDate": datetime.now().strftime('%Y-%m-%d') # doesnt work, because cached, put in init instead
				, "pickTime": False}),
			'scre_incidenttimestr': DateTimePicker(options={"format": "HH:mm"
				, "pickDate": False
				, "pickSeconds": False}),
		}
		labels = {
			'id': 'ID Record',
			'scre_notes': 'Notes',
			'scre_username': 'Data Entry Operator',
			'scre_sourceid': 'Source of Information',
			'scre_incidentdatestr': 'Incident Date',
			'scre_incidenttimestr': 'Incident Time',
			'scre_incidenttarget': 'Target',
			'scre_eventid': 'Event Type',
			'scre_violent': 'Violent',
			'scre_unknown': 'Unknown',

			'scre_arrested': 'Number of Arrested',
			'scre_injured': 'Number of Injured',
			'scre_dead': 'Number of dead',
			'scre_provid': 'Province',
			'scre_distid': 'District',
			'scre_placename': 'Place Description',
			'scre_latitude': 'Latitude',
			'scre_longitude': 'Longitude',
			'recstatus': 'Approved',
		}

	def __init__(self, *args, **kwargs):
		# if (instance) :
		# 	print instance
		super(SecureFeatureForm, self).__init__(*args, **kwargs)
		self.fields['scre_eventid'].queryset = EventType.objects.order_by('evnt_name')
		self.fields['scre_sourceid'].queryset = SourceType.objects.order_by('scrc_name')
		self.fields['scre_incidenttarget'].queryset = IncidentTarget.objects.order_by('inct_name')
		self.fields['scre_provid'].choices = self.queryset_to_choices(AfgAdmbndaAdm1.objects, 'prov_code', 'prov_na_en')
		if (self.initial['scre_provid']):
			self.fields['scre_distid'].choices = self.queryset_to_choices(AfgAdmbndaAdm2.objects.filter(prov_code=self.initial['scre_provid']), 'dist_code', 'dist_na_en')
		else:
			self.fields['scre_distid'].widget.attrs['disabled'] = 'disabled'
		if (self.initial['scre_distid']):
			# self.fields['scre_settvuid'].choices = self.queryset_to_choices(AfgPplp.objects.filter(dist_code=self.initial['scre_distid'], vuid__isnull=False), 'ogc_fid', 'name_en')
			self.fields['scre_settvuid'].choices = self.queryset_to_choices(AfgPplp.objects.filter(dist_code=self.initial['scre_distid']), 'ogc_fid', 'name_en')
			queryset = AfgPplp.objects.filter(dist_code=self.initial['scre_distid'])
			datalonlat = [[row.ogc_fid, row.vuid, row.name_en, row.lon_x, row.lat_y] for row in queryset]
			self.fields['scre_settvuid'].widget.attrs['data-lonlat'] = json.dumps(datalonlat)
		else:
			self.fields['scre_settvuid'].widget.attrs['disabled'] = 'disabled'
		if self.initial['recstatus'] is None:
			self.initial['recstatus'] = 1
		print 'self.fields[\'scre_latitude\']', dir(self.fields['scre_latitude'])
		print 'self.fields.keys()', self.fields.keys()
		self.fields['scre_latitude'].required = False
		self.fields['scre_longitude'].required = False

		# put here because dynamic content, where as class meta is cached
		self.fields['scre_incidentdatestr'].widget.options['maxDate'] = datetime.now().strftime('%Y-%m-%d')

	def queryset_to_choices(self, queryset, value_col, label_col, add_empty = True):
		list_choices = list(queryset.values(value_col, label_col).order_by(label_col))
		choices = []
		if add_empty:
			choices = [['', '----------']]
		for c in list_choices:
			choices.append([c[value_col], c[label_col]])
		return choices

class SearchFiltersForm(ModelForm):

	recstatus = forms.ChoiceField(
		widget = forms.Select(),
		choices = recstatus_choices,
		label = 'Record Status',
		)

	class Meta:
		model = SecureFeature
		fields = {
			'recstatus'
		}
		widgets = {
		}
		labels = {
			'recstatus': 'Record Status',
		}

	def __init__(self, *args, **kwargs):
		super(SearchFiltersForm, self).__init__(*args, **kwargs)
		if (self.initial.get('recstatus', False) == False) or (self.initial['recstatus'] is None):
			self.initial['recstatus'] = 1

class EventTypeForm(ModelForm):
    class Meta:
        model = EventType
        fields = ['id', 'evnt_name']

class IncidentTargetForm(ModelForm):
    class Meta:
        model = IncidentTarget
        fields = ['id', 'inct_name']

class SourceTypeForm(ModelForm):
    class Meta:
        model = SourceType
        fields = ['id', 'scrc_name']

class SearchForm(ModelForm):
    class Meta:
        model = SecureFeature
        fields = ['id', 'scre_notes', 'scre_incidentdate', 'scre_placename', 'scre_latitude', 'scre_longitude']

class EventTypeCombo(ModelForm):
    class Meta:
        model = EventType
        fields = ['id', 'evnt_name']
