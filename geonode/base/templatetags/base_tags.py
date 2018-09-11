from django import template

from agon_ratings.models import Rating
from django.contrib.contenttypes.models import ContentType
from django.contrib.auth import get_user_model
from django.db.models import Count

from guardian.shortcuts import get_objects_for_user
from geonode import settings

from geonode.layers.models import Layer
from geonode.maps.models import Map
from geonode.documents.models import Document
from geonode.groups.models import GroupProfile

register = template.Library()

@register.filter(name='split')
def split(value, arg):

    category = ''
    if value.split(arg)[0]=='agr':
        category = "Agriculture"
    elif value.split(arg)[0]=='av':
        category = "Avalanches"   
    elif value.split(arg)[0]=='bnd':
        category = "Administrative"   
    elif value.split(arg)[0]=='dr':
        category = "Drought"   
    elif value.split(arg)[0]=='edu':
        category = "Education"   
    elif value.split(arg)[0]=='eq':
        category = "Earthquakes"   
    elif value.split(arg)[0]=='erm':
        category = "Emergency Response Mechanism"   
    elif value.split(arg)[0]=='fl':
        category = "Flood"   
    elif value.split(arg)[0]=='geo':
        category = "Physical Environment"   
    elif value.split(arg)[0]=='hlt':
        category = "Health"     
    elif value.split(arg)[0]=='hydro':
        category = "Hydrology"     
    elif value.split(arg)[0]=='hz':
        category = "Hazard"     
    elif value.split(arg)[0]=='idp':
        category = "IDP"     
    elif value.split(arg)[0]=='img':
        category = "Imagery"     
    elif value.split(arg)[0]=='infr':
        category = "Infrastructure"     
    elif value.split(arg)[0]=='met':
        category = "Meteorology"  
    elif value.split(arg)[0]=='ot':
        category = "Others"     
    elif value.split(arg)[0]=='ppl':
        category = "Settlements"     
    elif value.split(arg)[0]=='sec':
        category = "Security"     
    elif value.split(arg)[0]=='sos':
        category = "Socio Demographics"

    # return value.split(arg)[0]
    return category

@register.filter(name='split_value')
def split_value(value, arg):
    return value.split(arg)[2]

@register.assignment_tag
def num_ratings(obj):
    ct = ContentType.objects.get_for_model(obj)
    return len(Rating.objects.filter(object_id=obj.pk, content_type=ct))


@register.assignment_tag(takes_context=True)
def facets(context):
    request = context['request']
    title_filter = request.GET.get('title__icontains', '')

    facet_type = context['facet_type'] if 'facet_type' in context else 'all'

    if not settings.SKIP_PERMS_FILTER:
        authorized = get_objects_for_user(
            request.user, 'base.view_resourcebase').values('id')

    if facet_type == 'documents':

        documents = Document.objects.filter(title__icontains=title_filter)

        if settings.RESOURCE_PUBLISHING:
            documents = documents.filter(is_published=True)

        if not settings.SKIP_PERMS_FILTER:
            documents = documents.filter(id__in=authorized)

        counts = documents.values('doc_type').annotate(count=Count('doc_type'))
        facets = dict([(count['doc_type'], count['count']) for count in counts])

        return facets

    else:

        layers = Layer.objects.filter(title__icontains=title_filter)

        if settings.RESOURCE_PUBLISHING:
            layers = layers.filter(is_published=True)

        if not settings.SKIP_PERMS_FILTER:
            layers = layers.filter(id__in=authorized)

        counts = layers.values('storeType').annotate(count=Count('storeType'))
        count_dict = dict([(count['storeType'], count['count']) for count in counts])

        facets = {
            'raster': count_dict.get('coverageStore', 0),
            'vector': count_dict.get('dataStore', 0),
            'remote': count_dict.get('remoteStore', 0),
        }

        # Break early if only_layers is set.
        if facet_type == 'layers':
            return facets

        maps = Map.objects.filter(title__icontains=title_filter)
        documents = Document.objects.filter(title__icontains=title_filter)

        if not settings.SKIP_PERMS_FILTER:
            maps = maps.filter(id__in=authorized)
            documents = documents.filter(id__in=authorized)

        facets['map'] = maps.count()
        facets['document'] = documents.count()

        if facet_type == 'home':
            facets['user'] = get_user_model().objects.exclude(
                username='AnonymousUser').count()

            facets['group'] = GroupProfile.objects.exclude(
                access="private").count()

            facets['layer'] = facets['raster'] + \
                facets['vector'] + facets['remote']

    return facets
