import React from "react"
import { makeStyles} from '@material-ui/core/styles';
import {Grid,Button,Typography} from '@material-ui/core';

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
    marginLeft:'auto',
    marginRight:'5%'
  }
}));

const TrackSearchResult=({ track, addTrack})=> {
  const classes = useStyles()
  const handleAdd=()=> {
    addTrack(track)
  }

  return (
      <Grid onClick={handleAdd} container className = {classes.root} direction="row" alignItems="center" justify="flex-start">
        <Grid item >
          <img src={track.albumUrl} className = {classes.img} alt=""/>
        </Grid>
        <Grid item xs zeroMinWidth className = {classes.text}>
            <Typography variant='body2' noWrap>{track.title}</Typography>
            <Typography variant='body2' noWrap color="textSecondary">{track.artist}</Typography>
        </Grid>
        <Button variant="outlined" className={classes.button} color="primary">Add</Button>
      </Grid>
  )
}

export default TrackSearchResult

