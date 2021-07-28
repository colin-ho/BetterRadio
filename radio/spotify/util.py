from re import split
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import *
import difflib
from itertools import groupby
from requests import post, put, get
import json
import numpy as np
from scipy.spatial.distance import cdist
from joblib import load
import os
from django.conf import settings
from collections import Counter

def scale(item):
    song_scaler=load(os.path.join(settings.BASE_DIR, 'new_scaler.joblib'))
    scaler = song_scaler.steps[0][1]
    
    return scaler.transform(item)

number_cols = ['valence', 'acousticness', 'danceability', 'duration_ms', 'energy',
 'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'speechiness', 'tempo','time_signature']


BASE_URL = "https://api.spotify.com/v1/"


def get_user_tokens(session_id):
    user_tokens = SpotifyToken.objects.filter(user=session_id)
    if user_tokens.exists():
        return user_tokens[0]
    else:
        return None


def update_or_create_user_tokens(session_id, access_token, token_type, expires_in, refresh_token):
    tokens = get_user_tokens(session_id)
    expiry=expires_in
    expires_in = timezone.now() + timedelta(seconds=expires_in)

    if tokens:
        tokens.access_token = access_token
        tokens.refresh_token = refresh_token
        tokens.expires_in = expires_in
        tokens.token_type = token_type
        tokens.mean_vector = None
        tokens.top_artists = None
        tokens.expiry = expiry
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type','mean_vector','expiry','top_artists'])
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in,mean_vector=None,expiry=expiry,top_artists=None)
        tokens.save()


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        expires_in = tokens.expires_in
        if expires_in < timezone.now():
            refresh_spotify_token(session_id)
            
        return [True,tokens.access_token,tokens.expiry]

    return [False,""]


def refresh_spotify_token(session_id):
    print('refreshing')
    refresh_token = get_user_tokens(session_id).refresh_token

    response = post('https://accounts.spotify.com/api/token', data={
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET
    }).json()

    access_token = response.get('access_token')
    token_type = response.get('token_type')
    expires_in = response.get('expires_in')

    update_or_create_user_tokens(
        session_id, access_token, token_type, expires_in, refresh_token)

    return access_token

def execute_spotify_api_request(session_id,endpoint,post_=False,put_=False):
    tokens = get_user_tokens(session_id)

    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer " + tokens.access_token}
    if post_:
        post(BASE_URL + endpoint, headers=headers)
    if put_:
        put(BASE_URL + endpoint, headers=headers)

    response = get(BASE_URL + endpoint, headers=headers)
    
    try:
        return response.json()
    except:
        print(response)
        return {'Error': 'Issue with request'}

def play_song(session_id):
    return execute_spotify_api_request(session_id,"me/player/play",put_=True)

def pause_song(session_id):
    return execute_spotify_api_request(session_id,"me/player/pause",put_=True)

def skip_song(session_id):
    return execute_spotify_api_request(session_id,"me/player/next",post_=True)

def search_song(session_id,query):
    
    user_tokens=get_user_tokens(session_id)
    song_matrix=[]
    if user_tokens.mean_vector is None:
        mean_vector = get_mean_vector(session_id)
        user_tokens.mean_vector = mean_vector
        user_tokens.save(update_fields=['mean_vector']) 
        song_matrix=mean_vector
    else:
        jsonDec = json.decoder.JSONDecoder()
        song_matrix = np.array(jsonDec.decode(user_tokens.mean_vector))

    endpoint = "search?=q=" + query + "&type=track"+"&limit=20"
    temp = execute_spotify_api_request(session_id,endpoint,post_=False)
    temp = [item for item in temp['tracks']['items']]
    result = []
    check = set()
    for item in temp:
        checker=(item['name'],item['artists'][0]['name'])
        if checker not in check:
            check.add(checker)
            result.append(item)
    #return result
    endpoint2 = "audio-features?ids=" + result[0]['id']
    for i in range (1,len(result)):
        endpoint2+= "," + result[i]['id']
    feats = execute_spotify_api_request(session_id,endpoint2,post_=False)
    new=[]
    for item in feats['audio_features']:
        if item is not None:
            new.append([item[x] for x in number_cols])
        else:
            new.append([0 for x in number_cols])
    song_matrix2 = np.array(list(new))

    song_matrix2 = scale(song_matrix2)
    distances = cdist(song_matrix, song_matrix2,'cosine')
    index = list(np.argsort(distances)[:,:20][0])
    reordered_by_scale = [result[k] for k in index]
    reordered=[]
    for i in range (len(reordered_by_scale)):
        reordered.append(result[i])
        reordered.append(reordered_by_scale[i])
        
    reordered = [i for n, i in enumerate(reordered) if i not in reordered[:n]]

    return reordered

def get_radio(session_id,tracks,options):
    endpoint = "recommendations?seed_tracks=" + tracks[0]
    for i in range (1,len(tracks)):
        endpoint += "," + tracks[i]
    for option in options:
        if options[option]!="":
            endpoint += "&" + option+ "=" + str(options[option])

    return execute_spotify_api_request(session_id,endpoint,post_=False)

def get_top(session_id):
    endpoint = "me/top/tracks?time_range=short_term&limit=50"
    return execute_spotify_api_request(session_id,endpoint,post_=False)
    
def get_discover(session_id):
    artists=[]
    user_tokens=get_user_tokens(session_id)
    if user_tokens.top_artists is None:
        top_artists = get_top_artists(session_id)
        user_tokens.top_artists = json.dumps(top_artists)
        user_tokens.save(update_fields=['top_artists']) 
        artists=top_artists
    else:
        jsonDec = json.decoder.JSONDecoder()
        artists = jsonDec.decode(user_tokens.top_artists)

    radios = []
    for group in artists:
        genres=[]
        for artist in group:
            if len(genres) >= 3:
                break
            genre = artist[1][0]
            if genre not in genres:
                genres.append(genre)
                
        ep = "recommendations?seed_artists=" + group[0][0]
        if len(group)<6:
            for i in range (1,len(group)):
                ep += "," + group[i][0]
        else :
            for i in range (1,5):
                ep += "," + group[i][0]
        radios.append([execute_spotify_api_request(session_id,ep,post_=False),genres])
    final = []
    for radio in radios:
        temp1 = []
        for track in radio[0]['tracks']:
            temp2 ={}
            temp2['artists']=track['artists']
            temp2['name']=track['name']
            temp2['uri']=track['uri']
            temp2['id']=track['id']
            temp2['images']=track['album']['images']
            temp1.append(temp2)
        final.append([temp1,radio[1]])
    return final

def get_user(session_id):
    endpoint = "me"
    return execute_spotify_api_request(session_id,endpoint,post_=False)

def get_mean_vector(session_id):
    temp = get_top(session_id)
    endpoint="audio-features?ids=" + temp['items'][0]['id']
    for i in range (1,len(temp['items'])):
        endpoint+= "," + temp['items'][i]['id']
    feats = execute_spotify_api_request(session_id,endpoint,post_=False)
    new=[]
    for item in feats['audio_features']:
        new.append([item[x] for x in number_cols])
    song_matrix = np.array(list(new))
    song_matrix = np.transpose(np.mean(song_matrix, axis=0).reshape(-1,1))
    song_matrix=scale(song_matrix)
    return song_matrix.tolist()

def get_top_artists(session_id):
    endpoint = "me/top/artists?time_range=short_term&limit=50"
    data = execute_spotify_api_request(session_id,endpoint,post_=False)['items']
    genres = {}
    for i in data:
        for genre in i['genres']:
            if genre in genres:
                genres[genre] += 1
            else:
                genres[genre] = 1
    genres = {k: v for k, v in sorted(genres.items(), key=lambda item: item[1],reverse=True)}
    corpus = ""
    for name in genres.keys():
        corpus += name + " "
    split_it = corpus.split()
    split_it = Counter(split_it)
    most_occur = split_it.most_common(5)
    artists=[]
    for word in most_occur:
        group = []
        for artist in data:
            for genre in artist['genres']:
                if word[0] in genre and artist['id'] not in group:
                    group.append([artist['id'],artist['genres']])
        artists.append(group)
    return artists