from django.conf.urls import url, patterns


urlpatterns = patterns("deliverynotes.views",
    url(r"^deliverynotes/(?P<content_type_id>\d+)/(?P<object_id>\d+)/$", "post_comment",
        name="post_comment"),
    url(r"^deliverynotes/(?P<comment_id>\d+)/delete/$", "delete_comment",
        name="delete_comment"),
    url(r"^deliverynotes/(?P<comment_id>\d+)/edit/$", "edit_comment",
        name="edit_comment"),
)
