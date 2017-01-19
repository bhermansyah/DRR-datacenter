# make sure this is at the top if it isn't already
from django import forms
from django.forms import ModelForm
from django.forms.util import ErrorList
from django.forms.forms import NON_FIELD_ERRORS
from django.forms import ModelChoiceField

#from bootstrap3_datepicker.fields import DatePickerField
#from bootstrap3_datepicker.widgets import DatePickerInput
from bootstrap3_datetime.widgets import DateTimePicker

from securitydb.models import SecureFeature
from securitydb.models import IncidentTarget
from securitydb.models import SourceType
from securitydb.models import EventType
from geodb.models import AfgAdmbndaAdm1
from geodb.models import AfgAdmbndaAdm2

import datetime

class SecureFeatureForm(ModelForm):
	scre_provid = ModelChoiceField(queryset=AfgAdmbndaAdm1.objects.all().order_by('prov_na_en'))
	scre_distid = ModelChoiceField(queryset=AfgAdmbndaAdm2.objects.none())

	class Meta:
		model = SecureFeature
		fields = ('id', 'scre_notes', 'scre_username'
			, 'scre_sourceid', 'scre_incidentdatestr', 'scre_incidenttimestr'
			, 'scre_eventid', 'scre_incidenttarget'
			, 'scre_violent', 'scre_unknown', 'scre_arrested', 'scre_injured', 'scre_dead'
			, 'scre_provid', 'scre_distid', 'scre_placename'
			, 'scre_latitude', 'scre_longitude'
			, 'scre_incidentdate', 'mpoint'
			, 'userid', 'entrydatetime', 'recstatus', 'userud', 'updatedatetime'
			, 'scre_sourcename', 'scre_eventname', 'scre_incidenttargetname', 'scre_provname', 'scre_distname'
		)

		widgets = {
			'scre_incidentdate': forms.HiddenInput(),
			'mpoint': forms.HiddenInput(),
			'userid': forms.HiddenInput(),
			'entrydatetime': forms.HiddenInput(),
			'recstatus': forms.HiddenInput(),
			'userud': forms.HiddenInput(),
			'updatedatetime': forms.HiddenInput(),
			'scre_sourcename': forms.HiddenInput(),
			'scre_eventname': forms.HiddenInput(),
			'scre_incidenttargetname': forms.HiddenInput(),
			'scre_provname': forms.HiddenInput(),
			'scre_distname': forms.HiddenInput(),

			'scre_incidentdatestr': DateTimePicker(options={"format": "YYYY-MM-DD"
#				, "maxDate": json.dumps(datetime.datetime.today(), default=json_util.default)
#				, "maxDate": now()
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
		}

	def __init__(self, *args, **kwargs):
		super(SecureFeatureForm, self).__init__(*args, **kwargs)   
		self.fields['scre_eventid'].queryset = EventType.objects.order_by('evnt_name')
		self.fields['scre_sourceid'].queryset = SourceType.objects.order_by('scrc_name')
		self.fields['scre_incidenttarget'].queryset = IncidentTarget.objects.order_by('inct_name')
		self.fields['scre_provid'].queryset = AfgAdmbndaAdm1.objects.order_by('prov_na_en')
		self.fields['scre_distid'].queryset = AfgAdmbndaAdm2.objects.filter(pk=self.initial['scre_distid']).order_by('prov_na_en', 'dist_na_en')

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