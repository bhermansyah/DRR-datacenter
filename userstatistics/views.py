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

@user_passes_test(lambda u: u.is_staff, login_url='/')
def userstatistics(request):
    # has_access = ('geodb.delete_afgincidentoasis' in request.user.get_all_permissions())
    # if not has_access:
    #     return TemplateResponse(request, '401.html', {}, status=401).render()

    data = {}
    data['jsondata'] = {}
    data['jsondata']['useractivities'] = {}
    data['jsondata']['user'] = {}
    user_exclude = ['admin', 'dodiws', 'dodiwsreg', 'rafinkanisa', 'boedy1996', 'razinal']
    start = time.time()
    print 'query start', start
    data['jsondata']['useractivities']['data'] = [
        [
            unicode(r[0]).encode('utf-8').strip(),
            unicode(r[1]).encode('utf-8').strip(),
            unicode(r[2]).encode('utf-8').strip(),
            unicode(r[3]).encode('utf-8').strip(),
            unicode(r[4]).encode('utf-8').strip(),
            unicode(r[5]).encode('utf-8').strip(),
            unicode(r[6]).encode('utf-8').strip(),
            unicode(r[7]).encode('utf-8').strip(),
            unicode(r[8]).encode('utf-8').strip(),
            unicode(r[9]).encode('utf-8').strip(),
            # str(r[3]),
            # str(r[4]),
            # str(r[5]),
            # str(r[6]),
            # str(r[7]),
            r[10].strftime('%Y-%m-%d %H:%M:%S'),
            r[11].strftime('%Y-%m-%d %H:%M:%S'),
            r[12].strftime('%Y-%m-%d %H:%M:%S'),
            r[12].year,
            r[12].month,
            r[12].day
        ]
        for r in matrix.objects.exclude(user__username__in=user_exclude).values_list(
            'user__username',
            'user__first_name',
            'user__last_name',
            'user__email',
            'user__organization',
            'user__org_acronym',
            'user__org_type',
            'action',
            'resourceid__title',
            'resourceid__csw_type',
            'user__last_login',
            'user__date_joined',
            'created'
        )
    ]

    data['jsondata']['user']['data'] = [
        [
            unicode(r[0]).encode('utf-8').strip(),
            unicode(r[1]).encode('utf-8').strip(),
            unicode(r[2]).encode('utf-8').strip(),
            unicode(r[3]).encode('utf-8').strip(),
            r[4].strftime('%Y-%m-%d %H:%M:%S')
        ]
        for r in get_user_model().objects.exclude(username__in=user_exclude).values_list('username', 'organization', 'org_acronym', 'org_type', 'date_joined')
    ]
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
        str('org_acronym'),
        str('org_type'),
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
    data['jsondata']['user']['columns'] = [str('username'), str('organization'), str('org_acronym'), str('org_type'), str('date_join')]
    return render(request, 'userstatistics.html', data)
