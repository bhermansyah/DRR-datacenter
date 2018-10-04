import json

from django.shortcuts import render_to_response, get_object_or_404
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.template import RequestContext, loader
from django.utils.translation import ugettext as _
from django.contrib.auth.decorators import login_required
from django.conf import settings
from django.core.urlresolvers import reverse
from django.core.exceptions import PermissionDenied
from django_downloadview.response import DownloadResponse
from django.views.generic.edit import UpdateView, CreateView
from django.db.models import F

from geonode.utils import resolve_object
from geonode.security.views import _perms_info_json
from geonode.people.forms import ProfileForm
from geonode.base.forms import CategoryForm
from geonode.base.models import TopicCategory, ResourceBase
from geonode.documents.models import Document
from geonode.documents.forms import DocumentForm, DocumentCreateForm, DocumentReplaceForm
from geonode.documents.models import IMGTYPES
from geonode.utils import build_social_links

# addded by boedy
from matrix.models import matrix

# upload pdf api
from django.conf.urls import url
from django.contrib.auth import authenticate, login
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from pprint import pprint
from subprocess import call, check_output, CalledProcessError, STDOUT
from tastypie.authentication import BasicAuthentication
from tastypie.authorization import DjangoAuthorization
from tastypie.resources import ModelResource, Resource
from tastypie.utils import trailing_slash
import logging
import os.path

# ASDC
from django.utils.text import get_valid_filename, slugify

ALLOWED_DOC_TYPES = settings.ALLOWED_DOCUMENT_TYPES

_PERMISSION_MSG_DELETE = _("You are not permitted to delete this document")
_PERMISSION_MSG_GENERIC = _('You do not have permissions for this document.')
_PERMISSION_MSG_MODIFY = _("You are not permitted to modify this document")
_PERMISSION_MSG_METADATA = _(
    "You are not permitted to modify this document's metadata")
_PERMISSION_MSG_VIEW = _("You are not permitted to view this document")


def _resolve_document(request, docid, permission='base.change_resourcebase',
                      msg=_PERMISSION_MSG_GENERIC, **kwargs):
    '''
    Resolve the document by the provided primary key and check the optional permission.
    '''
    return resolve_object(request, Document, {'pk': docid},
                          permission=permission, permission_msg=msg, **kwargs)


def document_detail(request, docid):
    """
    The view that show details of each document
    """
    document = None
    try:
        document = _resolve_document(
            request,
            docid,
            'base.view_resourcebase',
            _PERMISSION_MSG_VIEW)

    except Http404:
        return HttpResponse(
            loader.render_to_string(
                '404.html', RequestContext(
                    request, {
                        })), status=404)

    except PermissionDenied:
        return HttpResponse(
            loader.render_to_string(
                '401.html', RequestContext(
                    request, {
                        'error_message': _("You are not allowed to view this document.")})), status=403)

    if document is None:
        return HttpResponse(
            'An unknown error has occured.',
            mimetype="text/plain",
            status=401
        )

    else:
        try:
            related = document.content_type.get_object_for_this_type(
                id=document.object_id)
        except:
            related = ''

        # Update count for popularity ranking,
        # but do not includes admins or resource owners
        if request.user != document.owner and not request.user.is_superuser:
            Document.objects.filter(id=document.id).update(popular_count=F('popular_count') + 1)
            queryset = matrix(user=request.user,resourceid=document,action='View')
            queryset.save()

        metadata = document.link_set.metadata().filter(
            name__in=settings.DOWNLOAD_FORMATS_METADATA)
        preview_url = document.thumbnail_url.replace("-thumb", "-preview")
        context_dict = {
            'permissions_json': _perms_info_json(document),
            'resource': document,
            'metadata': metadata,
            'imgtypes': IMGTYPES,
            'related': related,
            'preview_url':preview_url}

        if settings.SOCIAL_ORIGINS:
            context_dict["social_links"] = build_social_links(request, document)

        # ubah
        template = 'documents/document_detail.html'
        if request.resolver_match.namespace == 'v2':
            template = 'v2/document_detail.html'
        return render_to_response(
            template,
            RequestContext(request, context_dict))
        # /ubah


def document_download(request, docid):
    document = get_object_or_404(Document, pk=docid)
    if request.user != document.owner and not request.user.is_superuser:
        queryset = matrix(user=request.user,resourceid=document,action='Download')
        queryset.save()
    if not request.user.has_perm(
            'base.download_resourcebase',
            obj=document.get_self_resource()):
        return HttpResponse(
            loader.render_to_string(
                '401.html', RequestContext(
                    request, {
                        'error_message': _("You are not allowed to view this document.")})), status=401)
    return DownloadResponse(document.doc_file)


class DocumentUploadView(CreateView):
    template_name = 'documents/document_upload.html'
    form_class = DocumentCreateForm

    def get_context_data(self, **kwargs):
        context = super(DocumentUploadView, self).get_context_data(**kwargs)
        context['ALLOWED_DOC_TYPES'] = ALLOWED_DOC_TYPES
        return context

    def form_valid(self, form):
        """
        If the form is valid, save the associated model.
        """
        self.object = form.save(commit=False)
        self.object.owner = self.request.user
        resource_id = self.request.POST.get('resource', None)
        if resource_id:
            self.object.content_type = ResourceBase.objects.get(id=resource_id).polymorphic_ctype
            self.object.object_id = resource_id
        # by default, if RESOURCE_PUBLISHING=True then document.is_published
        # must be set to False
        is_published = True
        if settings.RESOURCE_PUBLISHING:
            is_published = False
        self.object.is_published = is_published
        self.object.save()
        self.object.set_permissions(form.cleaned_data['permissions'])
        return HttpResponseRedirect(
            reverse(
                'document_metadata',
                args=(
                    self.object.id,
                )))


class DocumentUpdateView(UpdateView):
    template_name = 'documents/document_replace.html'
    pk_url_kwarg = 'docid'
    form_class = DocumentReplaceForm
    queryset = Document.objects.all()
    context_object_name = 'document'

    def get_context_data(self, **kwargs):
        context = super(DocumentUpdateView, self).get_context_data(**kwargs)
        context['ALLOWED_DOC_TYPES'] = ALLOWED_DOC_TYPES
        return context

    def form_valid(self, form):
        """
        If the form is valid, save the associated model.
        """
        self.object = form.save()
        return HttpResponseRedirect(
            reverse(
                'document_metadata',
                args=(
                    self.object.id,
                )))


@login_required
def document_metadata(
        request,
        docid,
        template='v2/document_metadata.html'):

    document = None
    try:
        document = _resolve_document(
            request,
            docid,
            'base.change_resourcebase_metadata',
            _PERMISSION_MSG_METADATA)

    except Http404:
        return HttpResponse(
            loader.render_to_string(
                '404.html', RequestContext(
                    request, {
                        })), status=404)

    except PermissionDenied:
        return HttpResponse(
            loader.render_to_string(
                '401.html', RequestContext(
                    request, {
                        'error_message': _("You are not allowed to edit this document.")})), status=403)

    if document is None:
        return HttpResponse(
            'An unknown error has occured.',
            mimetype="text/plain",
            status=401
        )

    else:
        poc = document.poc
        metadata_author = document.metadata_author
        topic_category = document.category

        if request.method == "POST":
            document_form = DocumentForm(
                request.POST,
                instance=document,
                prefix="resource")
            category_form = CategoryForm(
                request.POST,
                prefix="category_choice_field",
                initial=int(
                    request.POST["category_choice_field"]) if "category_choice_field" in request.POST else None)
        else:
            document_form = DocumentForm(instance=document, prefix="resource")
            category_form = CategoryForm(
                prefix="category_choice_field",
                initial=topic_category.id if topic_category else None)

        if request.method == "POST" and document_form.is_valid(
        ) and category_form.is_valid():
            new_poc = document_form.cleaned_data['poc']
            new_author = document_form.cleaned_data['metadata_author']
            new_keywords = document_form.cleaned_data['keywords']
            new_category = TopicCategory.objects.get(
                id=category_form.cleaned_data['category_choice_field'])

            if new_poc is None:
                if poc.user is None:
                    poc_form = ProfileForm(
                        request.POST,
                        prefix="poc",
                        instance=poc)
                else:
                    poc_form = ProfileForm(request.POST, prefix="poc")
                if poc_form.has_changed and poc_form.is_valid():
                    new_poc = poc_form.save()

            if new_author is None:
                if metadata_author is None:
                    author_form = ProfileForm(request.POST, prefix="author",
                                              instance=metadata_author)
                else:
                    author_form = ProfileForm(request.POST, prefix="author")
                if author_form.has_changed and author_form.is_valid():
                    new_author = author_form.save()

            if new_poc is not None and new_author is not None:

                # rename document file if any title fields changed
                title_fields = ['category', 'regions', 'datasource', 'title', 'subtitle', 'papersize', 'date', 'edition']
                title_fields_changed = [i for e in title_fields for i in document_form.changed_data if e == i]
                if title_fields_changed:
                    doc_file_path = os.path.dirname(document.doc_file.name)
                    new_filename = '%s.%s' % (
                        get_valid_filename('_'.join([
                            'afg',
                            new_category.identifier,
                            '-'.join([r.code for r in document_form.cleaned_data['regions']]),
                            document_form.cleaned_data['datasource'],
                            slugify(document_form.cleaned_data['title']),
                            slugify(document_form.cleaned_data['subtitle']),
                            document_form.cleaned_data['papersize'],
                            document_form.cleaned_data['date'].strftime('%Y-%m-%d'),
                            document_form.cleaned_data['edition']])),
                        document.extension
                        )
                    new_doc_file = os.path.join(doc_file_path, new_filename)
                    old_path = os.path.join(settings.MEDIA_ROOT, document.doc_file.name)
                    new_path = os.path.join(settings.MEDIA_ROOT, new_doc_file)
                    os.rename(old_path, new_path)
                    document.doc_file.name = new_doc_file
                    document.save()

                the_document = document_form.save()
                the_document.poc = new_poc
                the_document.metadata_author = new_author
                the_document.keywords.add(*new_keywords)
                Document.objects.filter(id=the_document.id).update(category=new_category)
                return HttpResponseRedirect(
                    reverse(
                        'document_detail',
                        args=(
                            document.id,
                        )))

        if poc is None:
            poc_form = ProfileForm(request.POST, prefix="poc")
        else:
            if poc is None:
                poc_form = ProfileForm(instance=poc, prefix="poc")
            else:
                document_form.fields['poc'].initial = poc.id
                poc_form = ProfileForm(prefix="poc")
                poc_form.hidden = True

        if metadata_author is None:
            author_form = ProfileForm(request.POST, prefix="author")
        else:
            if metadata_author is None:
                author_form = ProfileForm(
                    instance=metadata_author,
                    prefix="author")
            else:
                document_form.fields[
                    'metadata_author'].initial = metadata_author.id
                author_form = ProfileForm(prefix="author")
                author_form.hidden = True

        return render_to_response(template, RequestContext(request, {
            "document": document,
            "document_form": document_form,
            "poc_form": poc_form,
            "author_form": author_form,
            "category_form": category_form,
        }))


def document_search_page(request):
    # for non-ajax requests, render a generic search page

    if request.method == 'GET':
        params = request.GET
    elif request.method == 'POST':
        params = request.POST
    else:
        return HttpResponse(status=405)

    return render_to_response(
        'documents/document_search.html',
        RequestContext(
            request,
            {
                'init_search': json.dumps(
                    params or {}),
                "site": settings.SITEURL}))


@login_required
def document_remove(request, docid, template='documents/document_remove.html'):
    try:
        document = _resolve_document(
            request,
            docid,
            'base.delete_resourcebase',
            _PERMISSION_MSG_DELETE)

        if request.method == 'GET':
            return render_to_response(template, RequestContext(request, {
                "document": document
            }))
        if request.method == 'POST':
            document.delete()
            return HttpResponseRedirect(reverse("document_browse"))
        else:
            return HttpResponse("Not allowed", status=403)

    except PermissionDenied:
        return HttpResponse(
            'You are not allowed to delete this document',
            mimetype="text/plain",
            status=401
        )

class uploadpdf(Resource):
    """ wrapper api for checkPDFExists.py """
    # usage example, call url http://asdc.immap.org/api/uploadpdf/?csv=uploadlist.csv

    class Meta:
        authentication = BasicAuthentication()
        # authorization = DjangoAuthorization()
        resource_name = 'uploadpdf'
        allowed_methods = ['get', 'post']
        list_allowed_methods = ['get', 'post']
        detail_allowed_methods = ['get', 'post']
        always_return_data = True

    def __init__(self,api_name=None):

        # init logging
        self.appfolder = os.path.dirname(os.path.realpath(__file__))+'/'
        self.logger = logging.getLogger('uploadpdf')
        if not len(self.logger.handlers):
            self.logger.setLevel(logging.DEBUG)
            fh = logging.handlers.RotatingFileHandler(filename=self.appfolder+'uploadpdflog.txt', mode='a', maxBytes=1024*1024, backupCount=1)
            fh.setLevel(logging.DEBUG)
            formatter = logging.Formatter('%(asctime)s;%(name)s;%(funcName)s:%(lineno)d;%(levelname)s;%(message)s')
            fh.setFormatter(formatter)
            self.logger.addHandler(fh)

        super(uploadpdf,self).__init__(api_name)

    def base_urls(self):
        return [
            url(r"^%s%s$" % (self._meta.resource_name, trailing_slash()), self.wrap_view('run_checkPDFExists'), name="run_checkPDFExists"),
        ]

    # @logged_in_or_basicauth()
    def run_checkPDFExists(self, request, **kwargs):

        # manual basic auth 
        auth_result = BasicAuthentication().is_authenticated(request)
        if isinstance(auth_result, bool) and (auth_result == True):
            login(request, request.user)
        else:
            return auth_result

        result = {'success': False}
        try:
            # Notes:
            # set file_out to output csv file
            # set path_upload to path of csv input
            # set file_checkPDFExists to location of checkPDFExists.py
            # make sure csv output file exist

            path_upload = "/home/uploader/161213/"
            file_checkPDFExists = self.appfolder+"checkPDFExists.py"
            filename_csv = request.GET.get('csv', '') or 'uploadlist.csv'
            file_csv = path_upload+filename_csv
            file_out = self.appfolder+"uploadedlist.csv"

            # print 'make sure file exist'
            if not os.path.isfile(file_csv):
                raise IOError('file csv(\''+file_csv+'\') not found')
            if not os.path.isfile(file_out):
                raise IOError('file output(\''+file_out+'\') not found')
            if not os.path.isfile(file_checkPDFExists):
                raise IOError('file checkPDFExists(\''+file_checkPDFExists+'\') not found')

            # print 'call the main script'
            outputtext = check_output(
                ["python", file_checkPDFExists, file_csv, file_out],
                stderr=STDOUT
            )
            result['outputtext'] = outputtext

        except CalledProcessError as e:
            # print 'exception from script checkPDFExists.py'
            result['exception'] = {}
            result['exception']['name'] = 'CalledProcessError'
            if hasattr(e, 'output') and (e.output) : 
                result['exception']['output'] = e.output
                self.logger.error(result['exception']['name']+'; '+e.output)
            if hasattr(e, 'message') and (e.message) : 
                result['exception']['message'] = e.message
                self.logger.error(result['exception']['name']+'; '+e.message)
            result['exception']['returncode'] = e.returncode

        except Exception as e:
            # print 'exception not from script checkPDFExists.py'
            result['exception'] = {}
            if hasattr(e, '__name__'): 
                result['exception']['name'] = e.__name__
            result['exception']['message'] = 'exception on def run_checkPDFExists()'
            if hasattr(e, 'message'): 
                result['exception']['message'] = e.message
            self.logger.error(result['exception'].get('name', 'exception_type')+';'+e.message)

        else:
            # print 'no exception occured'
            result['success'] = True

        return self.create_response(request, result)
