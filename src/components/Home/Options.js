import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Slider,Typography} from '@material-ui/core';

const useStyles = makeStyles(()=>({
    root:{
        padding:"10px 40px 0px 10px",
        height:'240px',
        overflowY:'auto',
        '&::-webkit-scrollbar': {
            width: '4px',
            border: "4px solid #cdcdcd",
          },
          '&::-webkit-scrollbar-track': {
            borderRadius: "100px",
          },
          '&::-webkit-scrollbar-thumb': {
            borderRadius: "100px",
            backgroundColor: "#0D5279",
          }
    }
}))


const Options = ({options,setOptions,reset}) => {
    const [values,setValues]=useState([[0.1,0.2,0.6],[0.5,0.6,0.9],[100,250,300],[0.2,0.7,0.8],[0.1,0.2,0.4],[2,4,5],[0,0.1,0.2],[-60,-45,30],[0,0.5,1],[70,85,100],[0.6,0.8,0.9],[120,130,150],[4,5,12],[0,0.4,0.6]])
    const classes = useStyles()

    useEffect(()=>{
        setValues([[0.1,0.2,0.6],[0.5,0.6,0.9],[100,250,300],[0.2,0.7,0.8],[0.1,0.2,0.4],[2,4,5],[0,0.1,0.2],[-60,-45,30],[0,0.5,1],[70,85,100],[0.6,0.8,0.9],[120,130,150],[4,5,12],[0,0.4,0.6]])
    },[reset])

    const handleChange=(val,index)=>{
        let temp = values.slice()
        temp[index]=val
        setValues(temp)
    }

    return (
        <Grid container className={classes.root}>
            <Typography variant="body2" color="textSecondary">*Initial values are placeholders </Typography>

            <Grid item style={{width:'100%'}}>
                <Typography>Acousticness</Typography>
                {options.min_acousticness || options.max_acousticness || options.target_acousticness ? <Typography  color="textSecondary">{"(Min: "+ options.min_acousticness + " | Target: " + options.target_acousticness + " | Max: " + options.max_acousticness + ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" value={values[0]} onChange={(e,val) => {
                    handleChange(val,0);setOptions({...options,min_acousticness:val[0],target_acousticness:val[1],max_acousticness:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Danceability</Typography>
                {options.min_danceability || options.max_danceability || options.target_danceability? <Typography  color="textSecondary">{"(Min: "+ options.min_danceability + " | Target: " + options.target_danceability + " | Max: " + options.max_danceability + ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" value={values[1]} onChange={(e,val) => {
                    handleChange(val,1);setOptions({...options,min_danceability:val[0],target_danceability:val[1],max_danceability:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Duration (s)</Typography>
                {options.min_duration || options.max_duration || options.target_duration? <Typography  color="textSecondary">{"(Min: "+ options.min_duration/1000 + " | Target: " + options.target_duration/1000 + " | Max: " + options.max_duration/1000 + ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={500} step={1} valueLabelDisplay="auto" value={values[2]} onChange={(e,val) => {
                    handleChange(val,2);setOptions({...options,min_duration:(val[0]*1000),target_duration:(val[1]*1000),max_duration:(val[2]*1000)});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Energy</Typography>
                {options.min_energy || options.max_energy || options.target_energy? <Typography  color="textSecondary">{"(Min: "+ options.min_energy + " | Target: " + options.target_energy + " | Max: " + options.max_energy + ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" value={values[3]} onChange={(e,val) => {
                    handleChange(val,3);setOptions({...options,min_energy:val[0],target_energy:val[1],max_energy:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Instrumentalness</Typography>
                {options.min_instrumentalness || options.max_instrumentalness || options.target_instrumentalness? <Typography  color="textSecondary">{"(Min: "+ options.min_instrumentalness+ " | Target: " + options.target_instrumentalness+ " | Max: " + options.max_instrumentalness+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" value={values[4]} onChange={(e,val) => {
                    handleChange(val,4);setOptions({...options,min_instrumentalness:val[0],target_instrumentalness:val[1],max_instrumentalness:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Key</Typography>
                {options.min_key || options.max_key || options.target_key? <Typography  color="textSecondary">{"(Min: "+ options.min_key+ " | Target: " + options.target_key+ " | Max: " + options.max_key+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={10} step={1} valueLabelDisplay="auto" value={values[5]} onChange={(e,val) => {
                    handleChange(val,5);setOptions({...options,min_key:val[0],target_key:val[1],max_key:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Liveness</Typography>
                {options.min_liveness || options.max_liveness || options.target_liveness? <Typography  color="textSecondary">{"(Min: "+ options.min_liveness+ " | Target: " + options.target_liveness+ " | Max: " + options.max_liveness+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.1} valueLabelDisplay="auto" value={values[6]} onChange={(e,val) => {
                    handleChange(val,6);setOptions({...options,min_liveness:val[0],target_liveness:val[1],max_liveness:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Loudness</Typography>
                {options.min_loudness || options.max_loudness || options.target_loudness? <Typography  color="textSecondary">{"(Min: "+ options.min_loudness+ " | Target: " + options.target_loudness+ " | Max: " + options.max_loudness+ ")"}</Typography>:null}
                <Slider color="secondary" min={-60} max={0} step={1} valueLabelDisplay="auto" value={values[7]} onChange={(e,val) => {
                    handleChange(val,7);setOptions({...options,min_loudness:val[0],target_loudness:val[1],max_loudness:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Mode</Typography>
                {options.min_mode || options.max_mode || options.target_mode? <Typography color="textSecondary">{"(Min: "+ options.min_mode+ " | Target: " + options.target_mode+ " | Max: " + options.max_mode+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" value={values[8]} onChange={(e,val) => {
                    handleChange(val,8);setOptions({...options,min_mode:val[0],target_mode:val[1],max_mode:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Popularity</Typography>
                {options.min_popularity || options.max_popularity || options.target_popularity? <Typography  color="textSecondary">{"(Min: "+ options.min_popularity+ " | Target: " + options.target_popularity+ " | Max: " + options.max_popularity+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={100} step={1} valueLabelDisplay="auto" value={values[9]} onChange={(e,val) => {
                    handleChange(val,9);setOptions({...options,min_popularity:val[0],target_popularity:val[1],max_popularity:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Speechiness</Typography>
                {options.min_speechiness || options.max_speechiness || options.target_speechiness? <Typography  color="textSecondary">{"(Min: "+ options.min_speechiness+ " | Target: " + options.target_speechiness+ " | Max: " + options.max_speechiness+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" value={values[10]} onChange={(e,val) => {
                    handleChange(val,10);setOptions({...options,min_speechiness:val[0],target_speechiness:val[1],max_speechiness:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Tempo</Typography>
                {options.min_tempo || options.max_tempo || options.target_tempo? <Typography  color="textSecondary">{"(Min: "+ options.min_tempo+ " | Target: " + options.target_tempo+ " | Max: " + options.max_tempo+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={250} step={1} valueLabelDisplay="auto" value={values[11]} onChange={(e,val) => {
                    handleChange(val,11);setOptions({...options,min_tempo:val[0],target_tempo:val[1],max_tempo:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Time Signature</Typography>
                {options.min_time_signature || options.max_time_signature || options.target_time_signature? <Typography  color="textSecondary">{"(Min: "+ options.min_time_signature+ " | Target: " + options.target_time_signature+ " | Max: " + options.max_time_signature+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={12} step={1} valueLabelDisplay="auto" value={values[12]} onChange={(e,val) => {
                    handleChange(val,12);setOptions({...options,min_time_signature:val[0],target_time_signature:val[1],max_time_signature:val[2]});
                }}/>
            </Grid>
            <Grid item style={{width:'100%'}}>
                <Typography>Valence</Typography>
                {options.min_valence || options.max_valence || options.target_valence? <Typography  color="textSecondary">{"(Min: "+ options.min_valence+ " | Target: " + options.target_valence+ " | Max: " + options.max_time_signature+ ")"}</Typography>:null}
                <Slider color="secondary" min={0} max={1} step={0.01} valueLabelDisplay="auto" value={values[13]} onChange={(e,val) => {
                    handleChange(val,13);setOptions({...options,min_valence:val[0],target_valence:val[1],max_valence:val[2]});
                }}/>
            </Grid>
        </Grid>
    )
}

export default Options

