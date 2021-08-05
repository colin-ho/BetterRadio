import React,{useState,useEffect} from 'react'
import {Typography,TextField,Switch,Grid,Button, CircularProgress,InputAdornment,IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import TrackSearchResult from './TrackSearchResult'
import CloseIcon from '@material-ui/icons/Close';
import AddedTracks from './AddedTracks';
import useDebouncedSearch from '../DebounceSearch'
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const useStyles = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      width: 400,
      height:618,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      top: '50%',
      left: '50%', 
      transform: 'translate(-50%, -50%)',
      '@media screen and (max-width: 1023px)':{
        width:350,
      },
    },
    buttons:{
        alignSelf:"center",
        marginTop:'15px',
    },
    results:{
        margin:'10px 0 10px 0',
        height:'150px', 
        width:'100%',
        overflowY:'auto',
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
    recs:{
        margin:'5px 0 10px 0',
        height:'126px', 
        width:'100%',
        overflowY:'auto',
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
    added:{
        height:'150px', 
        width:'100%',
        overflowY:'auto',
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
    loading1:{
        width:40,
        marginTop:40,
        marginLeft: 'auto',
        marginRight:'auto',
    }
  }));

const Settings = React.forwardRef(({radio,update,close},ref) => {
    const classes = useStyles();
    const [name,setName]=useState(radio.name)
    const [pub,setPub]=useState(radio.public)
    const [description,setDescription]=useState(radio.description)
    const { search, setSearch, searchResults } = useDebouncedSearch();
    const [added,setAdded] = useState([])
    const [recs,setRecs]=useState()

    const addTrack = (track)=>{
        setAdded([...added,track])
    }

    const handleDelete = ()=>{
        axios.post("/api/delete-playlist",{'id':radio.id}).then(data=>{
            update()
        })
    }

    const deleteTrack = (item)=>{
        const newAdded = added.filter((track) => track.id !== item.id);
        setAdded(newAdded);
    }

    const handleUpdate = ()=>{
        axios.post("/api/update-playlist",{'id':radio.id,'public':pub,
            'description':description,'name':name,'songs':added})
            .then(data=>{
                update()
            })
        
    }

    useEffect(()=>{
        axios.post('/spotify/get-playlist-recs',{'track':[radio.songs[0].track_id]}).then((data)=>{
            setRecs(
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
    },[radio])

    return (
        <Grid container direction="column" className={classes.root} ref = {ref}>
            <TextField label="Name" value = {name} inputProps={{ maxLength: 50 }}
                    onChange={e => setName(e.target.value)}/>
            <TextField label="Description" value = {description} inputProps={{ maxLength: 200 }}
                    onChange={e => setDescription(e.target.value)}/>
            <Grid item container alignItems='center'>
                <Typography variant='subtitle2'>
                    Private
                </Typography>
                <Switch checked={pub} onChange={e=>setPub(e.target.checked)} name="Public" />
                <Typography variant='subtitle2'>
                    Public
                </Typography>
            </Grid>
            <TextField placeholder="Search for songs to add" value = {search}
                    onChange={e => setSearch(e.target.value)}
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={()=>setSearch("")} edge="end">
                                    <CloseIcon/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}/>
            {search !== "" ? <Grid item className = {classes.results}>
                {searchResults.result ? <>{searchResults.result.map(track => (
                <TrackSearchResult
                    track={track}
                    key={track.uri}
                    addTrack={addTrack}
                />
            ))}</>:<div className={classes.loading1}><CircularProgress /></div>}</Grid>:<>
                <Typography style={{marginTop:5}}>Suggested Tracks</Typography>
                <Grid item className = {classes.recs}>
                {recs ? <>{recs.map(track => (
                <TrackSearchResult
                    track={track}
                    key={track.uri}
                    addTrack={addTrack}
                />
            ))}</>:<div className={classes.loading1}><CircularProgress /></div>}</Grid></>}
            {added.length ===0? <div style={{height:'32px'}}/>:<Typography variant='h6'>Added Tracks</Typography>}
            <Grid item className = {classes.added}>
                {added.map(track => (
                    <AddedTracks
                        key={track.uri}
                        track={track}
                        deleteTrack={deleteTrack}
                    />
                ))}
            </Grid>
            {radio && 
                <Grid item className={classes.buttons}>
                    <Button style={{marginRight:'30px',}}variant = "contained"
                     color = "primary" onClick = {()=>{handleDelete();close()}}>Delete</Button>
                    <Button style={{marginLeft:'30px',}}variant = "contained" color="secondary" onClick = {()=>{handleUpdate();close()}}>Update</Button>
                </Grid>
            }
        </Grid>
    )
})

export default Settings
