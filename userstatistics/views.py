from django import forms
from django.contrib.auth import authenticate, login, get_user_model
from django.http import HttpResponse, HttpResponseRedirect
from django.core.urlresolvers import reverse
from django.utils import simplejson as json
from django.db.models import Q
from django.template.response import TemplateResponse

from geonode.groups.models import GroupProfile
from django.shortcuts import render

from matrix.models import matrix
from geonode.base.models import ResourceBase
from django.contrib.auth import get_user_model
from django.core import serializers
import time

from django.contrib.auth.decorators import user_passes_test

@user_passes_test(lambda u: u.is_superuser, login_url='/')
def userstatistics(request):
    # has_access = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())
    # if not has_access:
    #     return TemplateResponse(request, '401.html', {}, status=401).render()

    data = {}
    data['jsondata'] = {}
    data['jsondata']['useractivities'] = {}
    data['jsondata']['user'] = {}
    start = time.time()
    print 'query start', start
    data['jsondata']['useractivities']['data'] = [
        [
            r[0].encode('utf-8').strip(),
            r[1].encode('utf-8').strip(),
            r[2].encode('utf-8').strip(),
            str(r[3]),
            str(r[4]),
            str(r[5]),
            str(r[6]),
            str(r[7]),
            r[8].strftime('%Y-%m-%d %H:%M:%S'),
            r[9].strftime('%Y-%m-%d %H:%M:%S'),
            r[10].strftime('%Y-%m-%d %H:%M:%S'),
            r[10].strftime('%Y'),
            r[10].strftime('%m'),
            r[10].strftime('%d')
        ]
        for r in matrix.objects.values_list(
            'user__username',
            'user__first_name',
            'user__last_name',
            'user__email',
            'user__organization',
            'action',
            'resourceid__title',
            'resourceid__csw_type',
            'user__last_login',
            'user__date_joined',
            'created'
        )
    ]
    data['jsondata']['user']['data'] = [[str(r[0]), str(r[1]), r[2].strftime('%Y-%m-%d %H:%M:%S')] for r in get_user_model().objects.values_list('username', 'organization', 'date_joined')]
    # data['user']['data'] = get_user_model().objects.all()
    end = time.time()
    print 'query end', end
    print 'query time', end - start, 'seconds'
    data['jsondata']['useractivities']['columns'] = [
        str('user'),
        str('first_name'),
        str('last_name'),
        str('email'),
        str('organization'),
        str('action'),
        str('resource'),
        str('type_of_object'),
        str('last_login'),
        str('date_join'),
        str('actiontime'),
        str('action_year'),
        str('action_month'),
        str('action_day')
    ]
    data['jsondata']['user']['columns'] = [str('username'), str('organization'), str('date_join')]
    return render(request, 'userstatistics.html', data)
