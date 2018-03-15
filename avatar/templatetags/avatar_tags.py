import urllib
import hashlib


from django import template
from django.utils.translation import ugettext as _
from django.core.urlresolvers import reverse

from django.contrib.auth import get_user_model

from avatar.settings import (AVATAR_GRAVATAR_BACKUP, AVATAR_GRAVATAR_DEFAULT,
                             AVATAR_DEFAULT_SIZE, AVATAR_GRAVATAR_SSL)
from avatar.util import get_primary_avatar, get_default_avatar_url, cache_result

from avatar.models import Orglogo

register = template.Library()

@cache_result
@register.simple_tag
def avatar_print_url(user, size=AVATAR_DEFAULT_SIZE):
    avatar = get_primary_avatar(user, size=size)
    tt = Orglogo.objects.filter(orgacronym=user.org_acronym)
    # if avatar:
    #     return avatar.avatar_url(size)
    # else:
    #     if tt.count()>0:
    #         return tt[0].logo_url(200)
    #     else:
    #         return get_default_avatar_url()

    if tt.count()>0:
        return {'onpdf':str(tt[0].onpdf).lower(), 'logo_url':tt[0].logo_url(size)}
    elif avatar:
        return {'onpdf':str(False).lower(), 'logo_url': avatar.avatar_url(size)}
    else:
        return {'onpdf':str(False).lower(), 'logo_url': get_default_avatar_url()} 

@cache_result
@register.simple_tag
def avatar_url(user, size=AVATAR_DEFAULT_SIZE):
    avatar = get_primary_avatar(user, size=size)
    tt = Orglogo.objects.filter(orgacronym=user.org_acronym)
    # if avatar:
    #     return avatar.avatar_url(size)
    # else:
    #     if tt.count()>0:
    #         return tt[0].logo_url(200)
    #     else:
    #         return get_default_avatar_url()

    if tt.count()>0:
        return tt[0].logo_url(size)
    elif avatar:
        return avatar.avatar_url(size)
    else:
        return get_default_avatar_url()

@cache_result
@register.simple_tag
def avatar(user, size=AVATAR_DEFAULT_SIZE):
    if not isinstance(user, get_user_model()):
        try:
            user = get_user_model().objects.get(username=user)
            alt = unicode(user)
            url = avatar_url(user, size)
        except get_user_model().DoesNotExist:
            url = get_default_avatar_url()
            alt = _("Default Avatar")
    else:
        alt = unicode(user)
        url = avatar_url(user, size)

    # print user.org_acronym, url    
    return """<img src="%s" alt="%s" />""" % (url, alt,
        )

@cache_result
@register.simple_tag
def primary_avatar(user, size=AVATAR_DEFAULT_SIZE):
    """
    This tag tries to get the default avatar for a user without doing any db
    requests. It achieve this by linking to a special view that will do all the 
    work for us. If that special view is then cached by a CDN for instance,
    we will avoid many db calls.
    """
    alt = unicode(user)
    url = reverse('avatar_render_primary', kwargs={'user' : user, 'size' : size})
    return """<img src="%s" alt="%s" />""" % (url, alt,
        )

@cache_result
@register.simple_tag
def render_avatar(avatar, size=AVATAR_DEFAULT_SIZE):
    if not avatar.thumbnail_exists(size):
        avatar.create_thumbnail(size)
    return """<img src="%s" alt="%s" />""" % (
        avatar.avatar_url(size), str(avatar))
