import React from "react"
import { makeStyles} from '@material-ui/core/styles';
import {Grid} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';

const useStyles = makeStyles(() => ({
  root: {
    cursor: "pointer",
    width:'80%',
  },
  img:{
    height: "40px", 
    width: "40px" 
  },
  text:{
    paddingLeft:"20px",
  },
  button:{
    cursor: "pointer",
  }
}));

const AddedTracks=({track,deleteTrack})=> {
  const classes = useStyles()

  const handleDelete = ()=>{
    deleteTrack(track)
  }

  return (
    <Grid container alignItems="center">
      <Grid item container className = {classes.root} direction="row" alignItems="center" justify="flex-start">
        <Grid item>
          <img src={track.albumUrl} className = {classes.img} alt=""/>
        </Grid>
        <Grid item xs={9} className = {classes.text}>
            <div>{track.title}</div>
            <div style={{color:"#cdcdcd"}}>{track.artist}</div>
        </Grid>
      </Grid>
      <DeleteIcon style={{cursor:'pointer'}} onClick = {handleDelete}/>
    </Grid>
  )
}


export default AddedTracks;