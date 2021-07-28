import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Slider,Typography} from '@material-ui/core';

const useStyles = makeStyles((theme)=>({
    root:{
        padding:"10px 40px 0px 10px",
        maxHeight: '212px',
        overflowY:'auto',
        overflowX:'hidden',
        flexWrap: 'wrap',
        '&::-webkit-scrollbar': {
            width: '4px',
            border: "4px solid #cdcdcd",
          },
          '&::-webkit-scrollbar-track': {
            borderRadius: "100px",
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: "100px",
            backgroundColor: "#556cd6",
          }
    }
}))


const Options = ({options,setOptions}) => {
    const classes = useStyles()

    return (
        <>
        <Grid container className={classes.root}>
            <Typography>Acousticness</Typography>
            <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" defaultValue={[0.1,0.2,0.6]} onChange={(e,val) => {
                setOptions({...options,min_acousticness:val[0],target_acousticness:val[1],max_acousticness:val[2]});
            }}/>
            <Typography>Danceability</Typography>
            <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" defaultValue={[0.5,0.6,0.9]} onChange={(e,val) => {
                setOptions({...options,min_danceability:val[0],target_danceability:val[1],max_danceability:val[2]});
            }}/>
            <Typography>Duration (s)</Typography>
            <Slider color="secondary" min={0} max={500} step={1} valueLabelDisplay="auto" defaultValue={[100,250,300]} onChange={(e,val) => {
                setOptions({...options,min_duration:(val[0]*1000),target_duration:(val[1]*1000),max_duration:(val[2]*1000)});
            }}/>
            <Typography>Energy</Typography>
            <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" defaultValue={[0.2,0.7,0.8]} onChange={(e,val) => {
                setOptions({...options,min_energy:val[0],target_energy:val[1],max_energy:val[2]});
            }}/>
            <Typography>Instrumentalness</Typography>
            <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" defaultValue={[0.1,0.2,0.4]} onChange={(e,val) => {
                setOptions({...options,min_energy:val[0],target_energy:val[1],max_energy:val[2]});
            }}/>
            <Typography>Key</Typography>
            <Slider color="secondary" min={0} max={10} step={1} valueLabelDisplay="auto" defaultValue={[2,4,5]} onChange={(e,val) => {
                setOptions({...options,min_key:val[0],target_key:val[1],max_key:val[2]});
            }}/>
            <Typography>Liveness</Typography>
            <Slider color="secondary" min={0} max={1} step={0.1} valueLabelDisplay="auto" defaultValue={[0,0.1,0.2]} onChange={(e,val) => {
                setOptions({...options,min_liveness:val[0],target_liveness:val[1],max_liveness:val[2]});
            }}/>
            <Typography>Loudness</Typography>
            <Slider color="secondary" min={-60} max={0} step={1} valueLabelDisplay="auto" defaultValue={[-60,-45,30]} onChange={(e,val) => {
                setOptions({...options,min_loudness:val[0],target_loudness:val[1],max_loudness:val[2]});
            }}/>
            <Typography>Mode</Typography>
            <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" defaultValue={[0,0.5,1]} onChange={(e,val) => {
                setOptions({...options,min_mode:val[0],target_mode:val[1],max_mode:val[2]});
            }}/>
            <Typography>Popularity</Typography>
            <Slider color="secondary" min={0} max={100} step={1} valueLabelDisplay="auto" defaultValue={[70,85,100]} onChange={(e,val) => {
                setOptions({...options,min_popularity:val[0],target_popularity:val[1],max_popularity:val[2]});
            }}/>
            <Typography>Speechiness</Typography>
            <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" defaultValue={[0.6,0.8,0.9]} onChange={(e,val) => {
                setOptions({...options,min_speechiness:val[0],target_speechiness:val[1],max_speechiness:val[2]});
            }}/>
            <Typography>Tempo</Typography>
            <Slider color="secondary" min={0} max={250} step={1} valueLabelDisplay="auto" defaultValue={[120,130,150]} onChange={(e,val) => {
                setOptions({...options,min_tempo:val[0],target_tempo:val[1],max_tempo:val[2]});
            }}/>
            <Typography>Time Signature</Typography>
            <Slider color="secondary" min={0} max={12} step={1} valueLabelDisplay="auto" defaultValue={[4,5,12]} onChange={(e,val) => {
                setOptions({...options,min_time_signature:val[0],target_time_signature:val[1],max_time_signature:val[2]});
            }}/>
            <Typography>Valence</Typography>
            <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" defaultValue={[0,0.4,0.6]} onChange={(e,val) => {
                setOptions({...options,min_valence:val[0],target_valence:val[1],max_valence:val[2]});
            }}/>
        </Grid>
        </>
    )
}

export default Options

