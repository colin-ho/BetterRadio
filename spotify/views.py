from django.shortcuts import render, redirect
from .credentials import REDIRECT_URI, CLIENT_SECRET, CLIENT_ID,PASSWORD
from rest_framework.views import APIView
from requests import Request, post
from rest_framework import status
from rest_framework.response import Response
from .util import *
from urllib.parse import urlparse,parse_qs

class IsAuthenticated(APIView):
    def get(self, request, format=None):
        is_authenticated = is_spotify_authenticated(self.request.session.session_key)
        return Response({'status': is_authenticated}, status=status.HTTP_200_OK)

class Login(APIView):
    def post(self, request, fornat=None):
        password = request.data.get('password')
        if password != PASSWORD:
            return Response({'error': 'not registered'}, status=status.HTTP_400_BAD_REQUEST)
        scopes = 'user-top-read streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state user-read-recently-played playlist-modify-public playlist-modify-private'
        url = Request('GET', 'https://accounts.spotify.com/authorize', params={
            'scope': scopes,
            'response_type': 'code',
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID
        }).prepare().url

        return Response({'url': url}, status=status.HTTP_200_OK)

class GetToken(APIView):
    lookup_url_kwarg = 'code'
    def post(self,request, format=None):
        code = request.data.get(self.lookup_url_kwarg)
        response = post('https://accounts.spotify.com/api/token', data={
            'grant_type': 'authorization_code',
            'code': code,
            'redirect_uri': REDIRECT_URI,
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET
        }).json()

        access_token = response.get('access_token')
        token_type = response.get('token_type')
        refresh_token = response.get('refresh_token')
        expires_in = response.get('expires_in')

        if not request.session.exists(request.session.session_key):
            request.session.create()

        update_or_create_user_tokens(
            request.session.session_key, access_token, token_type, expires_in, refresh_token)
        return Response({'accessToken':access_token,'expiresIn':expires_in}, status=status.HTTP_200_OK)

class RefreshToken(APIView):
    def get(self, request, format=None):
        new_token = refresh_spotify_token(self.request.session.session_key)
        return Response({'accessToken':new_token}, status=status.HTTP_200_OK)

class SearchSong(APIView):
    lookup_url_kwarg = 'query'
    def post(self,request,format=None):
        query=request.data.get(self.lookup_url_kwarg)
        if not query:
            return Response("None",status=status.HTTP_200_OK)
        if not request.session.exists(request.session.session_key):
            request.session.create()
        result = search_song(request.session.session_key,query)
        return Response(result,status=status.HTTP_200_OK)

class GetRadio(APIView):
    def post(self,request,format=None):
        #artist=request.data.get('artist')
        tracks=request.data.get('track')
        options=request.data.get('options')
        #genre=request.data.get('genre')
        if not request.session.exists(request.session.session_key):
            request.session.create()
        result = get_radio(request.session.session_key,tracks,options)
        return Response(result,status=status.HTTP_200_OK)

class GetTop(APIView):
    def get(self,request,format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()
        result = get_top(request.session.session_key)
        return Response(result,status=status.HTTP_200_OK)

class GetUser(APIView):
    def get(self,request,format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()
        result = get_user(request.session.session_key)
        return Response(result,status=status.HTTP_200_OK)

class GetDiscover(APIView):
    def get(self,request,format=None):
        if not request.session.exists(request.session.session_key):
            request.session.create()
        result = get_discover(request.session.session_key)
        return Response(result,status=status.HTTP_200_OK)


class AddPlaylist(APIView):
    def post(self,request,format=None):
        data = request.data.get('data')
        if not request.session.exists(request.session.session_key):
            request.session.create()
        result = add_playlist(request.session.session_key,data)
        return Response(result,status=status.HTTP_200_OK)

class GetPlaylistRecs(APIView):
    def post(self,request,format=None):
        tracks=request.data.get('track')
        if not request.session.exists(request.session.session_key):
            request.session.create()
        result = get_playlist_recs(request.session.session_key,tracks)
        return Response(result,status=status.HTTP_200_OK)