import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,Divider} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    title:{
        margin:'20px 0px 10px 10px'
    },
    sub:{
        color:'#d9d9d9',
        margin:'0px 0px 10px 10px'
    },
    divider:{
        width:'80%',
        marginBottom:'10px'
    },
    cont:{
        width:'80%',
        marginBottom:'10px',
        height: "210px" ,
        overflowY : 'scroll',
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
    },
    track:{
        cursor: "pointer",
    },
    img:{
        height:'48px',
        width:'48px'
    },
    text:{
        paddingLeft:"20px"
    },
    artist:{
        color:"#cdcdcd"
    }

  }));

const RadioOpen = ({genres,radio,indexOpen,handlePlay}) => {
    const classes = useStyles()
    return (
        <div>
            <Typography className = {classes.title} variant='h5'>
            {"Playlist " + (indexOpen+1)}
            </Typography>
            <Typography className = {classes.sub} variant='subtitle1'>
            {genres.length === 3 ? genres[0] + ", " + genres[1] + ", " + genres[2] :
            genres.length ===2 ? genres[0] + ", " + genres[1]: genres[0]}
            </Typography>
            <Divider className = {classes.divider}/>
            <Grid item container className = {classes.cont}>
            {radio.map((track,index) => (
                <Grid key = {index} className = {classes.track}onClick = {()=>handlePlay(radio.map(track=> {return track.uri}),index)}item container alignItems='center'>
                    <Grid item xs={1}>
                        <Typography >{index+1}</Typography>
                    </Grid>
                    <Grid item >
                        <img src={track.albumUrl} className={classes.img} alt=""/>
                    </Grid>
                    <Grid item xs={9} className = {classes.text}>
                        <div>{track.title}</div>
                        <div className={classes.artist}>{track.artist}</div>
                    </Grid>
                </Grid>
            ))}
            </Grid>
        </div>
    )
}

export default RadioOpen
