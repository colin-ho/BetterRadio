import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import Pipeline
from joblib import dump


spotify_data = pd.read_csv('tracks.csv')
song_scaler = Pipeline([('scaler', StandardScaler())], verbose=True)
X = spotify_data.select_dtypes(np.number)
song_scaler.fit(X)
dump(song_scaler, 'scaler.joblib') 