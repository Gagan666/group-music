from django.urls import path
from . import views
urlpatterns=[
    path("",views.getinfoaboutallrooms),
    path("create/",views.createrooms),
    path("update/",views.updateRoomSettings),
    path("get-room",views.getRoom),
    path("join-room",views.joinRoom),
    path("delete-room",views.deleteRoom)
]