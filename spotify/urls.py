from django.urls import path
from .views import *

urlpatterns = [
    path('login',Login.as_view()),
    path('get-token',GetToken.as_view()),
    path('is-authenticated',IsAuthenticated.as_view()),
    path('refresh',RefreshToken.as_view()),
    path('search',SearchSong.as_view()),
    path('get-radio',GetRadio.as_view()),
    path('get-top',GetTop.as_view()),
    path('get-user',GetUser.as_view()),
    path('get-discover',GetDiscover.as_view()),
    path('add-playlist',AddPlaylist.as_view()),
    path('get-playlist-recs',GetPlaylistRecs.as_view()),
]