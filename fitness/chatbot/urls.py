from django.urls import path
from . import views

app_name="chatbot2"

urlpatterns = [
    path("",views.index,name="chatbot"),
    path("dash",views.dashboar,name="dsahboard"),
    path("chatbot",views.chatbot,name="chatbot")
]