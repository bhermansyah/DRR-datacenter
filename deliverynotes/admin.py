from django.contrib import admin

from deliverynotes.models import Notes


class NotesAdmin(admin.ModelAdmin):  
    list_display = ["author", "content_type", "public"]
    list_filter = ["public", "content_type"]


admin.site.register(Notes, NotesAdmin)
