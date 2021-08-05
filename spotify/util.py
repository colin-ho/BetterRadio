from re import split
from .models import SpotifyToken
from django.utils import timezone
from datetime import timedelta
from .credentials import *
import random
import math
from requests import post, put, get
import json
import numpy as np
from scipy.spatial.distance import cdist
from joblib import load
import os
from django.conf import settings
from collections import Counter
import threading

def scale(item):
    song_scaler=load(os.path.join(settings.BASE_DIR, 'scaler.joblib'))
    scaler = song_scaler.steps[0][1]
    
    return scaler.transform(item)

number_cols = ['valence', 'acousticness', 'danceability', 'duration_ms', 'energy',
 'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'speechiness', 'tempo','time_signature']


BASE_URL = "https://api.spotify.com/v1/"

def thread_function(session_id,tokens):
    tokens.mean_vector,tokens.top_artists = get_stuff(session_id)
    tokens.save(update_fields=['mean_vector','top_artists']) 


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
        tokens.expiry = expiry
        tokens.save(update_fields=['access_token',
                                   'refresh_token', 'expires_in', 'token_type','top_artists'])
        x = threading.Thread(target=thread_function, args=(session_id,tokens))
        x.start()
        
    else:
        tokens = SpotifyToken(user=session_id, access_token=access_token,
                              refresh_token=refresh_token, token_type=token_type, expires_in=expires_in,mean_vector=None,expiry=expiry,top_artists=None)
        tokens.save()
        tokens.mean_vector,tokens.top_artists = get_stuff(session_id)
        tokens.save(update_fields=['mean_vector','top_artists']) 


def is_spotify_authenticated(session_id):
    tokens = get_user_tokens(session_id)
    if tokens:
        if tokens.expires_in < timezone.now():
            refresh_spotify_token(session_id)
            tokens = get_user_tokens(session_id)
            
        return ["true",tokens.access_token,tokens.expiry]

    return ["false",""]


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

def execute_spotify_api_request(session_id,endpoint,post_=False,put_=False,data=None):
    is_spotify_authenticated(session_id)
    tokens = get_user_tokens(session_id)

    headers = {'Content-Type': 'application/json',
               'Authorization': "Bearer " + tokens.access_token}
    response=""
    if post_:
        if data:
            response=post(BASE_URL + endpoint, headers=headers,data=json.dumps(data))
        else:
            response=post(BASE_URL + endpoint, headers=headers)
    elif put_:
        response=put(BASE_URL + endpoint, headers=headers)
    else:
        response = get(BASE_URL + endpoint, headers=headers)
    
    try:
        return response.json()
    except:
        print(response)
        return {'Error': 'Issue with request'}

def search_song(session_id,query):
    user_tokens=get_user_tokens(session_id)
    jsonDec = json.decoder.JSONDecoder()
    song_matrix = np.array(jsonDec.decode(user_tokens.mean_vector))

    endpoint = "search?=q=" + query + "&type=track"+"&limit=50"
    temp = execute_spotify_api_request(session_id,endpoint,post_=False)
    temp = [item for item in temp['tracks']['items']]
    result = []
    check = set()
    for item in temp:
        checker=(item['name'],item['artists'][0]['name'])
        if checker not in check:
            check.add(checker)
            result.append(item)

    endpoint2 = "audio-features?ids=" + result[0]['id']
    for i in range (1,len(result)):
        endpoint2+= "," + result[i]['id']
    feats = execute_spotify_api_request(session_id,endpoint2,post_=False)
    new=[]
    for i in range(len(result)):
        item = feats['audio_features'][i]
        if item is not None:
            temp2=[item[x] for x in number_cols]
            temp2.append(result[i]['popularity'])
            new.append(temp2)
        else:
            new.append([0 for x in range(14)])
        
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
    jsonDec = json.decoder.JSONDecoder()
    user_tokens=get_user_tokens(session_id)
    artists = jsonDec.decode(user_tokens.top_artists)
    total = sum([len(elem) for elem in artists])
    tracks=[]
    for group in artists:
        count = math.ceil(len(group)/total*(10+int(total/len(artists))))
        for i in range(count):
            ep = "artists/" + random.choice(group)[0] + "/top-tracks?=market=US"
            arr = execute_spotify_api_request(session_id,ep,post_=False)['tracks']
            while True:
                track = random.choice(arr)
                if track not in tracks:
                    tracks.append(track)
                    break

    random.shuffle(tracks)
    return tracks
    
def get_discover(session_id):
    artists=[]
    user_tokens=get_user_tokens(session_id)
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

def get_mean_vector(session_id,top):
    endpoint="audio-features?ids=" + top[0]['id']
    for i in range (1,len(top)):
        endpoint+= "," + top[i]['id']
    feats = execute_spotify_api_request(session_id,endpoint,post_=False)['audio_features']
    new=[]
    for i in range(len(top)):
        item = feats[i]
        temp = [item[x] for x in number_cols]
        temp.append(top[i]['popularity'])
        new.append(temp)
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
        for i in range(genres[name]):
            corpus += name + " "
    split_it = corpus.split()
    split_it = Counter(split_it)
    most_occur = split_it.most_common(5)
    most_occur.insert(3,most_occur[0])
    artists=[]
    for word in most_occur:
        group = []
        for artist in data:
            for genre in artist['genres']:
                if word[0] in genre and [artist['id'],artist['genres']] not in group:
                    group.append([artist['id'],artist['genres']])
        artists.append(group)
    return artists

def add_playlist(session_id,data):
    id = get_user(session_id)['id']
    endpoint1 = "users/" + id + "/playlists"
    payload1 = {'name':data['name'],'description':data['description'],'public':data['public']}
    res = execute_spotify_api_request(session_id,endpoint1,post_=True,data=payload1)
    res=res['id']
    endpoint2 = "playlists/"+res+"/tracks?uris=" + data['songs'][0]['uri']
    for i in range (1,len(data['songs'])):
        endpoint2 += ","+data['songs'][i]['uri']
    result = execute_spotify_api_request(session_id,endpoint2,post_=True)
    return result
    
def get_playlist_recs(session_id,tracks):
    user_tokens=get_user_tokens(session_id)
    jsonDec = json.decoder.JSONDecoder()
    song_matrix = np.array(jsonDec.decode(user_tokens.mean_vector))

    endpoint = "recommendations?limit=10&seed_tracks=" + tracks[0]
    for i in range (1,len(tracks)):
        endpoint += "," + tracks[i]

    result = execute_spotify_api_request(session_id,endpoint,post_=False)['tracks']
    endpoint2 = "audio-features?ids=" + result[0]['id']
    for i in range (1,len(result)):
        endpoint2+= "," + result[i]['id']
    feats = execute_spotify_api_request(session_id,endpoint2,post_=False)
    new=[]
    for i in range(len(result)):
        item = feats['audio_features'][i]
        if item is not None:
            temp2=[item[x] for x in number_cols]
            temp2.append(result[i]['popularity'])
            new.append(temp2)
        else:
            new.append([0 for x in range(14)])
        
    song_matrix2 = np.array(list(new))

    song_matrix2 = scale(song_matrix2)
    distances = cdist(song_matrix, song_matrix2,'cosine')
    index = list(np.argsort(distances)[:,:5][0])
    reordered = [result[k] for k in index]
    return reordered

def get_stuff(session_id):
    artists = get_top_artists(session_id)
    total = sum([len(elem) for elem in artists])
    tracks=[]
    for group in artists:
        count = math.ceil(len(group)/total*(10+int(total/len(artists))))
        for i in range(count):
            ep = "artists/" + random.choice(group)[0] + "/top-tracks?=market=US"
            arr = execute_spotify_api_request(session_id,ep,post_=False)['tracks']
            while True:
                track = random.choice(arr)
                if track not in tracks:
                    tracks.append(track)
                    break

    random.shuffle(tracks)
    song_matrix = get_mean_vector(session_id,tracks)
    return song_matrix, json.dumps(artists)