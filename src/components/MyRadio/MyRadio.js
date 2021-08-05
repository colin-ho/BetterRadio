import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,Modal,DialogContent,Divider,Button,Snackbar,IconButton} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import CloseIcon from '@material-ui/icons/Close';
import Settings from './Settings';
import DeleteIcon from '@material-ui/icons/Delete';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const useStyles = makeStyles(() => ({
    root: {
        padding:'30px 30px 50px 30px',
        '@media screen and (max-width: 1023px)':{
            padding:'30px 30px 100px 30px',
          },
        '@media screen and (max-width: 768px)':{
            padding:'30px 30px 150px 30px',
          }
    },
    cont:{
        width:'100%',
    },
    headers:{
        flexWrap:'nowrap',
    },
    images:{
        margin:'0 60px 50px 0',
        height:128,
        width:128,
        '@media screen and (max-width: 768px)':{
            margin:'0 30px 15px 0',
          }
    },
    imgTop:{
        width:64,
        '@media screen and (max-width: 768px)':{
            width:'48px',
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
    },
    name:{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2, /* number of lines to show */
        '-webkit-box-orient': 'vertical',
        '@media screen and (max-width: 768px)':{
            fontSize:'12',
          }
    },
    sub:{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2, /* number of lines to show */
        '-webkit-box-orient': 'vertical'
    },
    divider:{
        marginBottom:'20px',
    },
    list:{
        height: "220px" ,
        marginBottom:"70px",
        overflowY : 'scroll',
        '&::-webkit-scrollbar': {
            width: '4px',
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
    button:{
        fontSize:14,
        '@media screen and (max-width: 768px)':{
            fontSize:12
          }
    }
  }));

const MyRadio = ({chooseRadio,radioData,errorMessage,update}) => {
    const classes = useStyles();
    const [settingsOpen,setSettingsOpen]=useState(false)
    const [settingsId,setSettingsId] = useState()
    const [open,setOpen]=useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])
    
    const handlePlay = (songs,i)=>{
        chooseRadio(songs.slice(i).concat(songs.slice(0,i)),i)
    }

    const handleRemove =(radioId,trackId)=>{
        axios.post("/api/remove-song",{'playlist_id':radioId,'song_id':trackId})
        .then(data=>{
            update()
        })
    }

    const handleClose = ()=>{
        setSettingsId("")
        setSettingsOpen(false)
    }

    const handleOpen = (radio)=>{
        setSettingsId(radio)
        setSettingsOpen(true)
    }

    const addPlaylist=(radio)=>{
        axios.post("spotify/add-playlist",{'data':radio}).then((data)=>{
            setOpen(true)
        })
    }

    return (
        <Grid container direction="column" className={classes.root}>
            {radioData && (radioData.map(radio=>(
                <Grid item container direction="column" className={classes.cont} spacing={3} key = {radio.id}>
                    <Grid item container direction="row" alignItems="center" className={classes.headers} spacing={5} >
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
                        <Grid item container direction="column">
                            <Typography className={classes.name} variant='h4'>
                                {radio.name}
                            </Typography>
                            <Typography className={classes.sub} color="textSecondary" variant='subtitle1'>
                                {radio.description}
                            </Typography>
                            <Grid item container direction="row" justify="space-between">
                                <SettingsIcon onClick={()=>handleOpen(radio)}/>
                                <Button size="small"variant="outlined" color="secondary" className={classes.button} onClick={()=>addPlaylist(radio)}>Add To Spotify</Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Divider className={classes.divider}/>
                    <Grid item container className={classes.list}>
                        {radio.songs.map((track,index) => (
                            <Grid key = {track.track_id} spacing={3} item container style={{ cursor: "pointer" }} direction="row" justify="flex-start"alignItems='center'>
                                <Grid item container justify="center" xs={1} >
                                    <Typography >{index+1}</Typography>
                                </Grid>
                                <Grid item style={{marginLeft:'1%',marginRight:"3%"}}onClick = {()=>handlePlay(radio.songs.map(track=> {return track.uri}),index)}>
                                    <img src={track.album_url} style={{height:'48px',width:'48px'}} alt=""/>
                                </Grid>
                                <Grid item xs zeroMinWidth onClick = {()=>handlePlay(radio.songs.map(track=> {return track.uri}),index)} >
                                    <Typography variant='body2' noWrap>{track.title}</Typography>
                                    <Typography variant='body2' noWrap color="textSecondary">{track.artist}</Typography>
                                </Grid>
                                <Grid item xs={1} style={{ margin:'0 15px 0 auto',cursor:'pointer'}}>
                                    <DeleteIcon  onClick = {()=>handleRemove(radio.id,track.track_id)}/>
                                </Grid>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            )))}
            {errorMessage && <>
            <Typography variant="h3">{errorMessage}</Typography>
            <Typography variant="h6" color="textSecondary">Please create radios from the Homepage</Typography>
            </>}
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
            <Snackbar
                    anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                    }}
                    open={open}
                    autoHideDuration={4000}
                    onClose={()=>setOpen(false)}
                    message="Playlist Added!"
                    action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={()=>setOpen(false)}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    }
                />
        </Grid>
    )
}

export default React.memo(MyRadio)

