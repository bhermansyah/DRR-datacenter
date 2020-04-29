from django.shortcuts import render, redirect
# from django.views.generic import View
from django.views.generic import TemplateView
from django.template import RequestContext
from .google_sheet import JsonResponse
from .utils import set_query_parameter


class Covid19(TemplateView):
    template_name = 'covid19/index.html'

    def get(self, request, *args, **kwargs):
        if not request.GET.get('page'):
            currenturl = request.build_absolute_uri()
            return redirect(set_query_parameter(currenturl, 'page', 'covid19'))
        context = JsonResponse(request) 
        return self.render_to_response(context)


# def test(request):
#     template_name = 'index.html'
    
#     if not request.GET.get('page'):
#         currenturl = request.build_absolute_uri()
#         return redirect(set_query_parameter(currenturl, 'page', 'covid19'))

#     response = JsonResponse(request)
#     return render(request, template_name, response)