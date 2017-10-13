from __future__ import unicode_literals

from django.contrib import admin

from account.models import Account, SignupCode, SignupCodeExtended, \
     AccountDeletion, EmailAddress


class SignupCodeAdmin(admin.ModelAdmin):

    list_display = ["code", "max_uses", "use_count", "expiry", "created"]
    search_fields = ["code", "email"]
    list_filter = ["created"]


class EmailAddressAdmin(admin.ModelAdmin):
    list_display = ["user", "email", "verified", "primary"]
    search_fields = ["user", "email"]
    list_filter = ["user"]
    
class SignupCodeExtendedAdmin(admin.ModelAdmin):

    list_display = ["username"]


admin.site.register(Account)
admin.site.register(SignupCode, SignupCodeAdmin)
admin.site.register(AccountDeletion, list_display=["email", "date_requested", "date_expunged"])
admin.site.register(EmailAddress, EmailAddressAdmin)
admin.site.register(SignupCodeExtended, SignupCodeExtendedAdmin)
