import json

from django.http import HttpResponse

from django.views.decorators.http import require_POST
from django.shortcuts import get_object_or_404, redirect
from django.template import RequestContext
from django.template.loader import render_to_string

from django.contrib.auth.decorators import login_required
from django.contrib.contenttypes.models import ContentType

from deliverynotes.authorization import load_can_delete, load_can_edit
from deliverynotes.forms import DeliveryNotesForm
from deliverynotes.models import Notes
# from deliverynotes.signals import commented, comment_updated


can_delete = load_can_delete()
can_edit = load_can_edit()

from avatar.models import Orglogo

def dehydrate_note(notes):
    return {
        "pk": notes.pk,
        "note": notes.note,
        "author": notes.author.username,
        "copies": notes.copies,
        "orgtarget": notes.orgtarget,
        "orgcontact": notes.orgcontact,
        "submit_date": str(notes.submit_date)
    }


@require_POST
def post_comment(request, content_type_id, object_id, form_class=DeliveryNotesForm):
    content_type = get_object_or_404(ContentType, pk=content_type_id)
    obj = get_object_or_404(content_type.model_class(), pk=object_id)
    form = form_class(request.POST, request=request, obj=obj, user=request.user)
    print form
    if form.is_valid():
        note = form.save()
        if request.is_ajax():
            return HttpResponse(json.dumps({
                "status": "OK",
                "comment": dehydrate_note(note),
                "html": render_to_string("deliverynotes/_comment.html", {
                    "comment": note
                }, context_instance=RequestContext(request))
            }), mimetype="application/json")
    else:
        if request.is_ajax():
            return HttpResponse(json.dumps({
                "status": "ERROR",
                "errors": form.errors,
                "html": render_to_string("deliverynotes/_form.html", {
                    "form": form,
                    "obj": obj
                }, context_instance=RequestContext(request))
            }), mimetype="application/json")
    redirect_to = request.POST.get("next")
    # light security check -- make sure redirect_to isn't garbage.
    if not redirect_to or " " in redirect_to or redirect_to.startswith("http"):
        redirect_to = obj
    return redirect(redirect_to)


@login_required
@require_POST
def edit_comment(request, comment_id, form_class=DeliveryNotesForm):
    notes = get_object_or_404(Notes, pk=comment_id)
    form = form_class(request.POST, instance=notes, request=request, obj=notes.content_object, user=request.user)
    if form.is_valid():
        notes = form.save()
        if request.is_ajax():
            return HttpResponse(json.dumps({
                "status": "OK",
                "comment": dehydrate_note(notes)
            }), mimetype="application/json")
    else:
        if request.is_ajax():
            return HttpResponse(json.dumps({
                "status": "ERROR",
                "errors": form.errors
            }), mimetype="application/json")
    redirect_to = request.POST.get("next")
    # light security check -- make sure redirect_to isn't garbage.
    if not redirect_to or " " in redirect_to or redirect_to.startswith("http"):
        redirect_to = notes.content_object
    return redirect(redirect_to)


@login_required
@require_POST
def delete_comment(request, comment_id):
    notes = get_object_or_404(Notes, pk=comment_id)
    obj = notes.content_object
    if can_delete(request.user, notes):
        notes.delete()
        if request.is_ajax():
            return HttpResponse(json.dumps({"status": "OK"}))
    else:
        if request.is_ajax():
            return HttpResponse(json.dumps({"status": "ERROR", "errors": "You do not have permission to delete this comment."}))
    return redirect(obj)
