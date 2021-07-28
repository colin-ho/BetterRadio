import React, {useState,useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Drawer,List,ListItem,ListItemIcon,ListItemText,BottomNavigation,BottomNavigationAction} from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import SearchIcon from '@material-ui/icons/Search';
import CreateIcon from '@material-ui/icons/Create';
import RadioIcon from '@material-ui/icons/Radio';
import SpotifyPlayer from "react-spotify-web-playback"
import Search from './Search/Search'
import Home from './Home/Home'
import CreateRadio from './CreateRadio/CreateRadio';
import MyRadio from './MyRadio/MyRadio'
import { Redirect} from "react-router-dom";


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    width:'100%',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    display: 'flex',
    alignItems: 'center',
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
    marginLeft:'20px',
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

  const chooseTrack=(track)=> {
    setUri(track.uri)     
  }

  const chooseRadio = (radio)=>{
    setUri(radio)
  }

  const handleCallback = (state)=>{
      setIsPlaying(state.isPlaying)
      if (state.errorType === 'authentication_error') {
          console.log('error')
          fetchData()
        }
  }

  useEffect(()=>[
    setIsPlaying(true),
  ],[uri])

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
          <div className={classes.drawerContainer}>
            <List>
              <ListItem button onClick={()=>setView("home")}>
                  <ListItemIcon><HomeIcon color="primary"/></ListItemIcon>
                  <ListItemText>Home</ListItemText>
              </ListItem>
              <ListItem button onClick={()=>setView("search")}>
                  <ListItemIcon><SearchIcon color="primary"/></ListItemIcon>
                  <ListItemText>Search</ListItemText>
              </ListItem>
              <ListItem button onClick={()=>setView("create")}>
                  <ListItemIcon><CreateIcon color="primary" /></ListItemIcon>
                  <ListItemText>Create Radio</ListItemText>
              </ListItem>
              <ListItem button onClick={()=>setView("radio")}>
                  <ListItemIcon><RadioIcon color="primary"/></ListItemIcon>
                  <ListItemText>My Radios</ListItemText>
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>
      <div className = {classes.body}>
      {view==="home"? <Home chooseTrack = {chooseTrack} chooseRadio={chooseRadio}/> 
      : view==="search" ? <Search chooseTrack = {chooseTrack} chooseRadio={chooseRadio}/> 
      : view==="create" ? <CreateRadio chooseRadio={chooseRadio}/> : <MyRadio chooseRadio={chooseRadio}/>}
      </div>
      <div className = {classes.player}>
          <SpotifyPlayer
          token={token}
          uris={uri}
          play={isPlaying}
          callback={(state)=>handleCallback(state)}
          />
          <BottomNavigation showLabels className={classes.bot}>
            <BottomNavigationAction label="Home" icon={<HomeIcon color="primary"/>} onClick={()=>setView("home")}/>
            <BottomNavigationAction label="Search" icon={<SearchIcon color="primary"/>} onClick={()=>setView("search")}/>
            <BottomNavigationAction label="Create" icon={<CreateIcon color="primary" />} onClick={()=>setView("create")}/>
            <BottomNavigationAction label="My Radios" icon={<RadioIcon color="primary" />} onClick={()=>setView("radio")}/>
          </BottomNavigation>
      </div>
      {console.log(token)}
      </>:<Redirect to="/"/>
  )

}

export default Main;
