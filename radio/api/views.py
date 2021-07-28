from django.db.models import query
from django.db.models.expressions import Expression
from django.http.response import JsonResponse
from django.shortcuts import render
from rest_framework import generics, serializers, status
from .serializers import *
from .models import *
from rest_framework.views import APIView
from rest_framework.response import Response
# Create your views here.

class CreatePlaylist(APIView):
    def post(self,request,format=None):
        creator = request.data.get('creator')
        public = request.data.get('public')
        description = request.data.get('description')
        name = request.data.get('name')
        songs = request.data.get('songs')
        for song in songs:
            queryset = Songs.objects.filter(uri=song['uri'])
            if not queryset.exists():
                new_song = Songs(uri=song['uri'],artist=song['artist'],title=song['title'],album_url=song['albumUrl'],track_id=song['id'])
                new_song.save()
        queryset = Playlist.objects.filter(creator=creator,name=name)
        if queryset.exists():
            playlist = Playlist(creator=creator,public=public,description=description,name=(name+ " (" + str(len(queryset))+ ")"))
        else:
            playlist = Playlist(creator=creator,public=public,description=description,name=name)
        playlist.save()
        for song in songs:
            new_song=Songs.objects.filter(uri=song['uri'])
            playlist.songs.add(new_song[0])
        return Response(PlaylistSerializer(playlist).data, status=status.HTTP_200_OK)

class UpdatePlaylist(APIView):
    def post(self,request,format=None):
        id = request.data.get('id')
        public = request.data.get('public')
        description = request.data.get('description')
        name = request.data.get('name')
        songs = request.data.get('songs')
        for song in songs:
            queryset = Songs.objects.filter(uri=song['uri'])
            if not queryset.exists():
                new_song = Songs(uri=song['uri'],artist=song['artist'],title=song['title'],album_url=song['albumUrl'],track_id=song['id'])
                new_song.save()

        queryset = Playlist.objects.filter(id=id)
        if queryset.exists():
            playlist = queryset[0]
            playlist.public=public
            playlist.description=description
            playlist.name=name
            playlist.save(update_fields=['public','description','name'])
            for song in songs:
                queryset = Playlist.objects.filter(songs=Songs.objects.filter(uri=song['uri'])[0])
                if not queryset.exists():
                    new_song=Songs.objects.filter(uri=song['uri'])
                    playlist.songs.add(new_song[0])
            return Response(PlaylistSerializer(playlist).data, status=status.HTTP_200_OK)

class GetPlaylist(APIView):
    serializer_class = PlaylistSerializer
    def post(self,request,format=None):
        creator =request.data.get('creator')
        if creator != None:
            playlists = Playlist.objects.filter(creator=creator)
            if playlists.exists():
                data=[]
                for playlist in playlists:
                    temp = PlaylistSerializer(playlist).data
                    temp['id']=playlist.id
                    data.append(temp)
                return Response(data,status=status.HTTP_200_OK)
            return Response({'Bad Request':'User has no playlists'},status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request':'Error'},status=status.HTTP_404_NOT_FOUND)

class DeletePlaylist(APIView):
    def post(self,request,format=None):
        id =request.data.get('id')
        if id != None:
            playlists = Playlist.objects.filter(id=id)
            if playlists.exists():
                for playlist in playlists:
                    playlist.delete()
                return Response("deleted",status=status.HTTP_200_OK)
            return Response({'Playlist Not Found':'Invalid Name'},status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request':'Code parameter not found in request'},status=status.HTTP_404_NOT_FOUND)

class RemoveSong(APIView):
    def post(self,request,format=None):
        playlist_id =request.data.get('playlist_id')
        song_id = request.data.get('song_id')
        if playlist_id != None and song_id != None:
            playlists = Playlist.objects.filter(id=playlist_id)
            songs = Songs.objects.filter(track_id=song_id)
            if playlists.exists():
                playlist = playlists[0]
                song = songs[0]
                playlist.songs.remove(song)
                return Response("deleted",status=status.HTTP_200_OK)
            return Response({'Playlist Not Found':'Invalid Name'},status=status.HTTP_404_NOT_FOUND)
        return Response({'Bad Request':'Code parameter not found in request'},status=status.HTTP_404_NOT_FOUND)