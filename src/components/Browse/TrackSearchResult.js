import React,{useState}from "react"
import { makeStyles} from '@material-ui/core/styles';
import {Grid,Menu,MenuItem, Typography} from '@material-ui/core';
import MoreVertIcon from '@material-ui/icons/MoreVert';
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

const TrackSearchResult=({ track, chooseTrack, getRadio})=> {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePlay=()=> {
    chooseTrack(track)
  }

  const handleRadio = ()=>{
    getRadio(track)
  }

  const handleOpen = (event)=>{
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Grid container className = {classes.root} direction="row" alignItems="center" justify="flex-start">
        <Grid item onClick={handlePlay}>
          <img src={track.albumUrl} className = {classes.img} alt=""/>
        </Grid>
        <Grid item onClick={handlePlay} xs zeroMinWidth className = {classes.text}>
            <Typography variant='body2' noWrap>{track.title}</Typography>
            <Typography variant='body2' noWrap color="textSecondary">{track.artist}</Typography>
        </Grid>
        <MoreVertIcon className = {classes.button} onClick = {handleOpen}/>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem onClick={handlePlay}>Play Song</MenuItem>
          <MenuItem onClick={handleRadio}>Get Radio</MenuItem>
        </Menu>
      </Grid>
      
  )
}


export default TrackSearchResult;
