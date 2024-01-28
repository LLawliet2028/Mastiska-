from django.urls import path
from . import views
from django.conf import settings
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

app_name = 'chatbot'

urlpatterns = [
    path("login",views.login,name="login"),
    path("",views.index,name = "dashboard"),
    path("chatbot",views.chat,name="chatbot"),
    path("signup",views.signup,name="register"),
    path("log_view",views.login_view,name="log_view"),
    path("reg_view",views.register_user,name="reg_view"),
    path("com_view",views.com_view,name="community"),
    path("doc_login",views.doc_login,name="doc_login"),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)