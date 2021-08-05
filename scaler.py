from os import X_OK
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from joblib import dump

number_cols = ['valence', 'acousticness', 'danceability', 'duration_ms', 'energy',
 'instrumentalness', 'key', 'liveness', 'loudness', 'mode', 'speechiness', 'tempo','time_signature','popularity']
spotify_data = pd.read_csv('tracks.csv')
song_scaler = Pipeline([('scaler', StandardScaler())], verbose=True)
X = spotify_data[number_cols]
print(X)
#song_scaler.fit(X)
#dump(song_scaler,'scaler.joblib')