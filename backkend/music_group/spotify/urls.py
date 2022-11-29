from django.urls import path
from . import views
urlpatterns=[
    path('get-auth-url',views.AuthUrl),
    path('redirect',views.spotify_callback),
    path('is-authenticated',views.IsAuthenticated),
    path('current_song',views.current_song),
    path('pause',views.PauseSong),
    path('play',views.PlaySong),
]