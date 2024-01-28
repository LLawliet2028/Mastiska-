from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

app_name="community"

urlpatterns=[
    path("",views.index,name="mainpage"),
    path("article",views.article,name="article"),
    path("home",views.home,name="home"),
    path("doc_view",views.doc_view,name="doc_view")
]


if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)