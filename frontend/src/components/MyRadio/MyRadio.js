import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,Modal,DialogContent,Divider} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import axios from 'axios';
import Settings from './Settings';
import DeleteIcon from '@material-ui/icons/Delete';


const useStyles = makeStyles(() => ({
    root: {
        width:'90%',
        display: 'flex',
        flexDirection:'column',
        margin:'60px 0px 100px 60px',
    },
    root2:{
        maxWidth:'100%'
    },
    images:{
        margin:'0 30px 60px 0',
        height:128,
        width:128,
        '@media screen and (max-width: 768px)':{
            margin:'0 15px 30px 0',
          }
    },
    imgTop:{
        width:64,
        '@media screen and (max-width: 768px)':{
            width:'48px',
          }
    },
    list:{
        width:'90%',
        height: "220px" ,
        marginBottom:"70px",
        overflowY : 'scroll',
        overflowX:'hidden',
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
    img1:{
        height:'64px',
        width:'64px',
        marginBottom:'-5px',
        '@media screen and (max-width: 768px)':{
            height:'48px',
            width:'48px',
          }
    },
    img2:{
        height:'64px',
        width:'64px',
        '@media screen and (max-width: 768px)':{
            height:'48px',
            width:'48px',
          }
    }
  }));

const MyRadio = ({chooseRadio}) => {
    const classes = useStyles();
    const [radioData,setRadioData]=useState()
    const [settingsOpen,setSettingsOpen]=useState(false)
    const [settingsId,setSettingsId] = useState()
    const [errorMessage,setErrorMessage]=useState("")

    const update = ()=>{
        axios.get("/spotify/get-user").then(data=>{
            axios.post('/api/get-playlist',{'creator':data.data.email}).then((data)=>{
                setRadioData(data.data)
            })
            .catch(err=>{
                setErrorMessage("No Radios")
                setRadioData()
            })
        })
    }

    const handlePlay = (songs,i)=>{
        chooseRadio(songs.slice(i).concat(songs.slice(0,i)),i)
    }

    const handleRemove =(radioId,trackId)=>{
        axios.post("/api/remove-song",{'playlist_id':radioId,'song_id':trackId})
        .then(data=>{
            console.log(data)
            update()
        })
    }

    useEffect(()=>{
        update()
    },[])

    const handleClose = ()=>{
        setSettingsId("")
        setSettingsOpen(false)
    }

    const handleOpen = (radio)=>{
        setSettingsId(radio)
        setSettingsOpen(true)
    }

    return (
        <Grid container className={classes.root}>
            {radioData && (radioData.map(radio=>(
                <Grid className={classes.root2} item container direction="column" spacing={3} key = {radio.id}>{console.log(radioData)}
                    <Grid item container direction="row" style={{width:'100%'}} spacing={6}>
                        <Grid item container direction="column" className={classes.images}>
                            <Grid item className={classes.imgTop}>
                                <img src={radio.songs[0].album_url} className = {classes.img1} alt=""/>
                                <img src={radio.songs[1].album_url} className = {classes.img2}  alt=""/>
                            </Grid>
                            <Grid item>
                                <img src={radio.songs[2].album_url} className = {classes.img1}  alt=""/>
                                <img src={radio.songs[3].album_url} className = {classes.img2}  alt=""/>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant='h4'>
                                {radio.name}
                            </Typography>
                            <Typography variant='subtitle1'>
                                {radio.description}
                            </Typography>
                            <SettingsIcon style={{ cursor: "pointer"}} onClick={()=>handleOpen(radio)}/>
                        </Grid>
                    </Grid>
                    <Divider style={{width:'90%',marginBottom:'10px'}}/>
                    <Grid item container className={classes.list}>
                        {radio.songs.map((track,index) => (
                            <Grid key = {track.track_id} spacing={3} item container style={{ cursor: "pointer" }} direction="row" justify="flex-start"alignItems='center'>
                                <Grid item xs={0} style={{marginLeft:"2%"}}  >
                                    <Typography >{index+1}</Typography>
                                </Grid>
                                <Grid item xs={0} style={{marginLeft:'2%',marginRight:"2%"}}onClick = {()=>handlePlay(radio.songs.map(track=> {return track.uri}),index)}>
                                    <img src={track.album_url} style={{height:'48px',width:'48px'}} alt=""/>
                                </Grid>
                                <Grid item xs={6} onClick = {()=>handlePlay(radio.songs.map(track=> {return track.uri}),index)} >
                                    <Typography variant="body">{track.title}</Typography>
                                    <div style={{color:"#cdcdcd"}}>{track.artist}</div>
                                </Grid>
                                <Grid item xs={1} style={{ margin:'0 10px 0 auto',cursor:'pointer'}}>
                                    <DeleteIcon  onClick = {()=>handleRemove(radio.id,track.track_id)}/>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )))}
            {errorMessage && <div>{errorMessage}</div>}
            <Modal
                open={settingsOpen}
                onClose={()=>handleClose()}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <DialogContent>
                    <Settings radio = {settingsId} close = {handleClose} update = {update}/>
                </DialogContent>
            </Modal>
        </Grid>
    )
}

export default MyRadio

