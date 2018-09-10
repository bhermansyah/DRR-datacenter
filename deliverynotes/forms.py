from django import forms

from django.contrib.contenttypes.models import ContentType

from deliverynotes.models import Notes
import datetime

from bootstrap3_datetime.widgets import DateTimePicker
from avatar.models import Orglogo


class DeliveryNotesForm(forms.ModelForm):
    
    class Meta:
        model = Notes
        fields = (
            "copies", "orgtarget", "orgcontact", "note", "submit_date"
        )
        labels = {
            "copies":"Copies",
            "orgtarget":"Organization",
            "orgcontact":"Contact Person",
            "note":"Note",
            "submit_date":"Deliver Date"
        }
        widgets = {
            'copies':forms.NumberInput(),
            'submit_date': DateTimePicker(options={"format": "YYYY-MM-DD","pickTime": False}),
            'orgtarget':forms.Select(choices=[(choice, choice) for choice in Orglogo.objects.all().order_by('orgname')])
        } 
    
    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop("request", None)
        self.obj = kwargs.pop("obj")
        self.user = kwargs.pop("user")
        super(DeliveryNotesForm, self).__init__(*args, **kwargs)
        # if self.user is not None and not self.user.is_anonymous():
        #     del self.fields["name"]
        #     del self.fields["email"]
        #     del self.fields["website"]
    
    def save(self, commit=True):
        comment = super(DeliveryNotesForm, self).save(commit=False)
        comment.ip_address = self.request.META.get("REMOTE_ADDR", None)
        comment.content_type = ContentType.objects.get_for_model(self.obj)
        comment.object_id = self.obj.pk
        if self.user is not None and not self.user.is_anonymous():
            comment.author = self.user
        if commit:
            comment.save()
        return comment
