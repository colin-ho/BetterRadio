from django.urls import path
from .views import *


urlpatterns = [
    path('create-playlist', CreatePlaylist.as_view()),
    path('get-playlist',GetPlaylist.as_view()),
    path('delete-playlist',DeletePlaylist.as_view()),
    path('update-playlist',UpdatePlaylist.as_view()),
    path('remove-song',RemoveSong.as_view())
]

