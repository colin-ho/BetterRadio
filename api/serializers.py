from rest_framework import serializers
from .models import *

class SongSerializer(serializers.ModelSerializer):
    class Meta:
        model = Songs
        fields = ('artist','title','uri','album_url','track_id')

class PlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(read_only=True,many=True)
    class Meta:
        model = Playlist
        fields = ('name','creator','public','description','songs')

class CreatePlaylistSerializer(serializers.ModelSerializer):
    songs = SongSerializer(read_only=True,many=True)
    class Meta:
        model = Playlist
        fields = ('name','creator','public','description','songs')



