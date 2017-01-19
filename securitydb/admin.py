from django.contrib import admin

# Register your models here.
# from .models import AfgAdmbndaAdm1
from .models import SecureFeature
from .models import SourceType
from .models import EventType
from .models import IncidentTarget

# admin.site.register(AfgAdmbndaAdm1)
admin.site.register(SecureFeature)
admin.site.register(SourceType)
admin.site.register(EventType)
admin.site.register(IncidentTarget)
