import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,CircularProgress} from '@material-ui/core';
import Discover from './Discover'
import RadioOpen from './RadioOpen'
import CreateRadio from './CreateRadio'
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const useStyles = makeStyles((theme) => ({
    root: { 
        display: 'flex',
        flexDirection:'column',
        margin:'30px 30px 60px 30px',
        '@media screen and (max-width: 768px)':{
            margin:'30px 30px 30px 30px',
          }
    },
    sub:{
        color:'#d9d9d9'
    },
    discoverCont:{
        marginTop:'20px',
        flexWrap: 'nowrap',
        marginBottom:'10px',
        overflowX : 'scroll',
        '&::-webkit-scrollbar': {
            height: '4px',
            border: "4px solid #cdcdcd",
            },
            '&::-webkit-scrollbar-track': {
            borderRadius: "100px",
            },
            '&::-webkit-scrollbar-thumb': {
            borderRadius: "100px",
            backgroundColor: "#0D5279",
            }
    },
    loading:{
        marginTop: 70,
        marginBottom:80,
        width:40,
        marginLeft: 'auto',
        marginRight:'auto',
    },
    
  }));

const Home = ({chooseRadio,redirect,discover,creator,update}) => {
    const classes = useStyles();
    const [radio,setRadio]=useState();
    const [radioOpen,setRadioOpen]=useState(false);
    const [indexOpen,setIndexOpen]=useState()
    const [page,setPage] = useState(true)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    
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

    const add = (pub,description,name,radioResults)=>{
        axios.post("/api/create-playlist",{'creator':creator,'public':pub,
            'description':description,'name':name,'songs':radioResults.map(track=>{
                return{
                    artist: track.artist,
                    title: track.title,
                    uri: track.uri,
                    albumUrl: track.albumUrl,
                    id: track.id,
                }})
            })
            .then(data=>{
                chooseRadio(radioResults.map(track=>{return track.uri}))
                update()
                redirect('radio')
            })
    }

    return (
        <div className={classes.root}>
            <Typography variant='h4' >
                Discover
            </Typography>
            <Typography className = {classes.sub}variant='subtitle1' >
                Curated playlists just for you
            </Typography>
            <Grid container direction="row"
            justify="flex-start"
            alignItems="center" className={classes.discoverCont}>
                {discover ? discover !== "error" ?<>{discover.map((item,i)=> 
                <Discover key = {i} radio = {item} index = {i} handleOpen = {handleOpen} chooseRadio={chooseRadio}/>
                )}</>:<Typography color="secondary">No Recommendations yet, please listen to more music</Typography>: <CircularProgress className={classes.loading}/>}
            </Grid>
            {radioOpen ? <RadioOpen addRadio={add} radio={radio.tracks} genres={radio.genres} indexOpen={indexOpen} handlePlay={handlePlay}/>: null}
            <CreateRadio add={add} page={page} setPage={setPage}/>
        </div>
    )
}

export default React.memo(Home)
