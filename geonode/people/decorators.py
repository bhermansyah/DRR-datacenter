from functools import wraps
from geonode.views import err403

def owner_or_staff_member_required(view_func):
    """
    Decorator for views that checks that the user is logged in and is a staff
    member or is owner
    """
    @wraps(view_func)
    def _checklogin(request, *args, **kwargs):
        is_owner = kwargs.get('username') == request.user.username
        if (request.user.is_active and request.user.is_staff) or is_owner:
            # The user is valid. Continue to the page.
            return view_func(request, *args, **kwargs)
        return err403(request)
    return _checklogin
