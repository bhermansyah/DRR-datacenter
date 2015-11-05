from celery.task import task
from geonode.geoserver.helpers import gs_slurp
from geonode.documents.models import Document
from django.core.files import File

import os
from django.conf import settings

@task(name='geonode.tasks.update.geoserver_update_layers', queue='update')
def geoserver_update_layers(*args, **kwargs):
    """
    Runs update layers.
    """
    return gs_slurp(*args, **kwargs)


@task(name='geonode.tasks.update.create_document_thumbnail', queue='update')
def create_document_thumbnail(object_id):
    """
    Runs the create_thumbnail logic on a document.
    """

    try:
        document = Document.objects.get(id=object_id)

    except Document.DoesNotExist:
        return

    image = document._render_thumbnail('thumb')
    
    filename = 'doc-%s-thumb.jpg' % document.id
    document.save_thumbnail(filename, image)

    thumb_folder = 'thumbs'
    preview = document._render_thumbnail('preview')
    filenamePreview = 'doc-%s-preview.jpg' % document.id
    upload_path = os.path.join(settings.MEDIA_ROOT, thumb_folder)
    if not os.path.exists(upload_path):
        os.makedirs(upload_path)

    with open(os.path.join(upload_path, filenamePreview), 'w') as f:
        thumbnail = File(f)
        thumbnail.write(preview)

