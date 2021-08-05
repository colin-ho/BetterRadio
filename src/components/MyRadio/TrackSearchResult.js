import React from "react"
import { makeStyles} from '@material-ui/core/styles';
import {Grid,Typography} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    cursor: "pointer",
  },
  img:{
    height: "40px", 
    width: "40px" 
  },
  text:{
    paddingLeft:"20px",
  },
}));

const TrackSearchResult=({ track, addTrack})=> {
  const classes = useStyles()
  const handleAdd=()=> {
    addTrack(track)
  }

  return (
      <Grid container onClick={handleAdd} className = {classes.root} direction="row" alignItems="center" justify="flex-start">
        <Grid item>
          <img src={track.albumUrl} className = {classes.img} alt=""/>
        </Grid>
        <Grid item xs zeroMinWidth className = {classes.text}>
          <Typography variant='body2' noWrap>{track.title}</Typography>
          <Typography variant='body2' noWrap color="textSecondary">{track.artist}</Typography>
        </Grid>
      </Grid>

  )
}

export default TrackSearchResult

