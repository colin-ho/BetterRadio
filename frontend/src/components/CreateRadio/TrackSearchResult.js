import React from "react"
import { makeStyles} from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    cursor: "pointer",
  },
  img:{
    height: "48px", 
    width: "48px" 
  },
  text:{
    paddingLeft:"20px",
  },
  button:{
    cursor: "pointer",
  }
}));

const TrackSearchResult=({ track, addTrack})=> {
  const classes = useStyles()
  const handleAdd=()=> {
    addTrack(track)
  }

  return (
    <Grid container>
      <Grid item container className = {classes.root} direction="row" alignItems="center" justify="flex-start">
        <Grid item onClick={handleAdd}>
          <img src={track.albumUrl} className = {classes.img} alt=""/>
        </Grid>
        <Grid item onClick={handleAdd} xs={9} className = {classes.text}>
            <div>{track.title}</div>
            <div style={{color:"#cdcdcd"}}>{track.artist}</div>
        </Grid>
      </Grid>

    </Grid>
  )
}

export default TrackSearchResult

