import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,CircularProgress} from '@material-ui/core';
import axios from 'axios';
import Discover from './Discover'
import RadioOpen from './RadioOpen'
import TopSongs from './TopSongs';


const useStyles = makeStyles((theme) => ({
    root: { 
        display: 'flex',
        flexDirection:'column',
        margin:'30px 0 0 30px',
    },
    sub:{
        color:'#d9d9d9'
    },
    discoverCont:{
        marginTop:'20px',
        flexWrap: 'nowrap',
        marginBottom:'10px',
        overflowX : 'scroll'
    },
    top:{
        marginTop:'30px',
    },
    topCont:{
        margin:'20px 0 80px 0',
        flexWrap: 'nowrap',
        overflowX : 'scroll',
        '@media screen and (max-width: 768px)':{
            margin:'20px 0 150px 0',
          }
    },
    loading:{
        marginLeft:'500px',
    }
    
  }));

const Home = ({chooseTrack,chooseRadio}) => {
    const classes = useStyles();
    const [top,setTop]=useState([]);
    const [discover,setDiscover]=useState();
    const [radio,setRadio]=useState();
    const [radioOpen,setRadioOpen]=useState(false);
    const [indexOpen,setIndexOpen]=useState()

    useEffect(()=>{
        axios.get('/spotify/get-top').then((data)=>{
            setTop(
                data.data.items.map(track => {
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
    },[])

    const getRadio=(track)=>{
        let arr = [track.uri]
        axios.post("/spotify/get-radio", {'track':[track.id],'options':[]})
        .then((data)=>{
            chooseRadio(arr.concat(data.data.tracks.map(track => {   
                return track.uri
            })))
        })
    }

    const handleOpen = (r,i)=>{
        if(radioOpen){
            if (r===radio){
                setRadioOpen(false)
            }else{
                setRadio(r)
                setIndexOpen(i)
            }
        } else{
            setRadio(r)
            setIndexOpen(i)
            setRadioOpen(true)
        }
    }

    const handlePlay = (songs,i)=>{
        chooseRadio(songs.slice(i).concat(songs.slice(0,i)),i)
    }

    return (
        <div className={classes.root}>
            <Typography variant='h4' >
                Discover
            </Typography>
            <Typography className = {classes.sub}variant='subtitle1' >
                Recommended playlists just for you
            </Typography>
            <Grid container direction="row"
            justify="flex-start"
            alignItems="center" className={classes.discoverCont}>
                {discover ? <>{discover.map((item,i)=> 
                        <Discover key = {i} radio = {item} index = {i} handleOpen = {handleOpen}/>
                )}</>: <CircularProgress className={classes.loading}/>}
            </Grid>
            {radioOpen ? <RadioOpen radio={radio.tracks} genres={radio.genres} indexOpen={indexOpen} handlePlay={handlePlay}/>: null}
            <Typography variant='h4'className={classes.top}>
                Top Songs
            </Typography>
            <Typography className = {classes.sub}variant='subtitle1' >
                Tracks you play on repeat
            </Typography>
            <Grid container direction="row"
            justify="flex-start"
            alignItems="center" className={classes.topCont}>
                {top.slice(0,20).map((track,index) => (
                <TopSongs key={index} track = {track} chooseTrack={chooseTrack} getRadio={getRadio}/>
                ))}
            </Grid>
        </div>
    )
}

export default Home
