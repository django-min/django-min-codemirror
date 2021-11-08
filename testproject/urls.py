from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path

from testapp.views import WidgetView


urlpatterns = staticfiles_urlpatterns()
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
urlpatterns += [
    path(
        'widget/',
        WidgetView.as_view()
    ),
    path(
        '',
        admin.site.urls
    ),
]
