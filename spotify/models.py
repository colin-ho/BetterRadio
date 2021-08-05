from django.db import models

class SpotifyToken(models.Model):
    user = models.CharField(max_length=50,unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    refresh_token = models.CharField(max_length=150)
    access_token = models.CharField(max_length=500)
    expires_in = models.DateTimeField()
    token_type = models.CharField(max_length=50)
    mean_vector = models.TextField(null=True)
    expiry= models.IntegerField(null=True)
    top_artists = models.TextField(null=True)
