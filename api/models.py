from django.db import models

class Songs(models.Model):
    artist = models.CharField(max_length=200,default="")
    title = models.CharField(max_length=200,default="")
    album_url = models.CharField(max_length=200,default="")
    uri = models.CharField(max_length=200,unique=True,default="")
    track_id = models.CharField(max_length = 200,default="")

class Playlist(models.Model):
    name= models.CharField(max_length=50)
    creator = models.CharField(max_length=200)
    public = models.BooleanField(null=False,default=True)
    description = models.CharField(max_length=200)
    songs = models.ManyToManyField(Songs)

