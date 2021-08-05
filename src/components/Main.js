import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Drawer,List,ListItem,ListItemIcon,ListItemText,BottomNavigation,BottomNavigationAction,Snackbar,IconButton} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import RadioIcon from '@material-ui/icons/Radio';
import CloseIcon from '@material-ui/icons/Close';
import SpotifyPlayer from "react-spotify-web-playback"
import Browse from './Browse/Browse'
import Home from './Home/Home'
import MyRadio from './MyRadio/MyRadio'
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width:'100%',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    '@media screen and (max-width: 768px)':{
      display:'none',
    }
    
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: '#000',
    color:'#fff',
    
  },
  drawerContainer: {
    marginTop:'20px',
    overflow: 'auto',
  },
  body:{
    marginLeft:drawerWidth,
    color:'#fff',
    '@media screen and (max-width: 768px)':{
      marginLeft:0,
    }
  },
  player :{
    zIndex: theme.zIndex.drawer + 1,
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%'
  },
  bot:{
    backgroundColor:'#000',
    display:'none',
    '@media screen and (max-width: 768px)':{
      display:'flex',
    }
  }
}));

const Main = ({token,fetchData}) => {

  const [uri,setUri]=useState()
  const [isPlaying,setIsPlaying]=useState(false)
  const classes = useStyles();
  const [view,setView]=useState("home")
  const [top,setTop]=useState();
  const [discover,setDiscover]=useState();
  const [creator,setCreator]=useState();
  const [radioData,setRadioData]=useState()
  const [errorMessage,setErrorMessage]=useState("")
  const [open,setOpen]=useState(false)

  const chooseTrack=(track)=> {
    setUri(track.uri)     
  }

  const chooseRadio = (radio)=>{
    setUri(radio)
  }

  const handleCallback = (state)=>{
      setIsPlaying(state.isPlaying)
      if (state.error ==='Browser prevented autoplay due to lack of interaction'){
        setOpen(true)
      }
      if (state.errorType === 'authentication_error') {
        fetchData()
      }
  }

  const handleRedirect = (page)=>{
    setView(page)
  }

  useEffect(()=>[
    setIsPlaying(true),
  ],[uri])

  const update = async()=>{
    let data = await axios.get("/spotify/get-user")
    try {
      let data2 = await axios.post('/api/get-playlist',{'creator':data.data.email})
      setErrorMessage("")
      setRadioData(data2.data)
    } catch(err){
      setErrorMessage("No Radios")
      setRadioData()
    }
    
}

  useEffect(()=>{
    axios.get('/spotify/get-top').then((data)=>{
        setTop(
            data.data.map(track => {
            const smallestAlbumImage = track.album.images.reduce(
                (smallest, image) => {
                if (image.height < smallest.height) return image
                return smallest
                },
                track.album.images[0]
            )
            const largestAlbumImage = track.album.images.reduce(
                (largest, image) => {
                if (image.height > largest.height) return image
                return largest
                },
                track.album.images[0]
            )
    
            return {
                artist: track.artists[0].name,
                title: track.name,
                uri: track.uri,
                albumUrl: smallestAlbumImage.url,
                id: track.id,
                largeAlbumUrl:largestAlbumImage.url,
            }
            })
        )
    })
    axios.get('/spotify/get-discover').then((data)=>{
        setDiscover(
            data.data.map(radio=>{
                const tracks = radio[0].map(track=>{
                    const smallestAlbumImage = track.images.reduce(
                        (smallest, image) => {
                        if (image.height < smallest.height) return image
                        return smallest
                        },
                        track.images[0]
                    )
                    const largestAlbumImage = track.images.reduce(
                        (largest, image) => {
                        if (image.height > largest.height) return image
                        return largest
                        },
                        track.images[0]
                    )
            
                    return {
                        artist: track.artists[0].name,
                        title: track.name,
                        uri: track.uri,
                        albumUrl: smallestAlbumImage.url,
                        id: track.id,
                        largeAlbumUrl:largestAlbumImage.url,
                    }
                })
            return {
                tracks:tracks,
                genres:radio[1],
            }
        })
        )
    })
    axios.get("/spotify/get-user").then(data=>{
      setCreator(data.data.email)
    })
    update()
},[])

  if(!token) return null;

  return (
    token ? <>
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
        >
          <List className={classes.drawerContainer}>
            <ListItem button onClick={()=>setView('home')}>
                <ListItemIcon style={{marginLeft:'20px'}}><HomeIcon color="primary"/></ListItemIcon>
                <ListItemText>Home</ListItemText>
            </ListItem>
            <ListItem button onClick={()=>setView("browse")}>
                <ListItemIcon style={{marginLeft:'20px'}}><SearchIcon color="primary"/></ListItemIcon>
                <ListItemText>Browse</ListItemText>
            </ListItem>
            <ListItem button onClick={()=>setView("radio")}>
                <ListItemIcon style={{marginLeft:'20px'}}><RadioIcon color="primary"/></ListItemIcon>
                <ListItemText>My Radios</ListItemText>
            </ListItem>
          </List>
        </Drawer>
      </div>
      <div className = {classes.body}>
      {view==="home"? <Home  discover = {discover} update={update} redirect= {handleRedirect} chooseRadio={chooseRadio} creator={creator}/> 
      : view==="browse" ? <Browse top={top} chooseTrack = {chooseTrack} chooseRadio={chooseRadio}/> 
      : <MyRadio update={update} radioData={radioData} errorMessage={errorMessage} chooseRadio={chooseRadio} />}
      </div>
      <div className = {classes.player}>
          <SpotifyPlayer
          token={token}
          uris={uri}
          play={isPlaying}
          callback={(state)=>handleCallback(state)}
          styles={{
            bgColor: '#111',
            color: '#fff',
            loaderColor: '#0D5279',
            sliderHandleColor: '#fff',
            trackArtistColor: '#ccc',
            trackNameColor: '#fff',
          }}
          />
          <BottomNavigation showLabels className={classes.bot}>
            <BottomNavigationAction label="Home" icon={<HomeIcon color="primary"/>} onClick={()=>setView("home")}/>
            <BottomNavigationAction label="Browse" icon={<SearchIcon color="primary"/>} onClick={()=>setView("browse")}/>
            <BottomNavigationAction label="My Radios" icon={<RadioIcon color="primary" />} onClick={()=>setView("radio")}/>
          </BottomNavigation>
      </div>
      <Snackbar anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
          }}
          open={open}
          onClose={()=>setOpen(false)}
          message="In-App Playback only works on desktop computers using Chrome/Firefox/IE/Edge"
          action={
          <IconButton size="small" aria-label="close" color="inherit" onClick={()=>setOpen(false)}>
              <CloseIcon fontSize="small" />
          </IconButton>
          }
      />
      {console.log(token)}
      </>:window.location = ""
  )

}

export default Main;
