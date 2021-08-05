import React,{useState} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,TextField,Switch,Button,Divider,CircularProgress,InputAdornment,IconButton} from '@material-ui/core';
import TrackSearchResult from './TrackSearchResult'
import CloseIcon from '@material-ui/icons/Close';
import AddedTracks from './AddedTracks'
import Options from './Options'
import axios from 'axios';
import useDebouncedSearch from '../DebounceSearch'
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const useStyles = makeStyles(() => ({
    root:{
        padding:'30px 0px 0 0px',
    },
    cont1:{
        marginTop:'30px',
    },
    cont2:{
        marginTop:'30px',
    },
    resultCont:{
        width:'100%',
    },
    results:{
        maxHeight:'212px', 
        overflowY:'auto',
        margin:'20px 0px 0px 0px',
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
    divider1:{
        marginTop:'30px',
    },
    divider2:{
        marginTop:'20px',
        marginBottom:'30px',
    },
    button:{
        margin:'30px 17% 70px 0',
        alignSelf:'flex-start ',
        '@media screen and (max-width: 768px)':{
            margin:'30px 17% 150px 0',
          }
    },
    loading1:{
        marginTop:80,
        marginBottom:50,
        width:40,
        marginLeft: 'auto',
        marginRight:'auto',
    }
  }));

const CreateRadio = ({page,setPage,add}) => {
    const classes = useStyles();
    const [name,setName]=useState("My New Radio")
    const [pub,setPub]=useState(false)
    const [description,setDescription]=useState("")
    const { search, setSearch, searchResults } = useDebouncedSearch();
    const [added,setAdded]=useState();
    const [options,setOptions]=useState({})
    const [radioResults,setRadioResults]=useState()
    const [reset,setReset]=useState(false)

    const addTrack = (track)=>{
        if (added){
            if (!added.includes(track)){
                setAdded([...added,track])
            }
        } else{
            setAdded([track])
        }
    }

    const deleteTrack = (item)=>{
        const newAdded = added.filter((track) => track.id !== item.id);
        if (newAdded.length===0){
            setAdded(null);
        } else{
            setAdded(newAdded);
        } 
        
    }

    const removeTrack = (item)=>{
        const newRadio = radioResults.filter((track) => track.id !== item.id);
        if (newRadio.length===0){
            setRadioResults(null);
        } else{
            setRadioResults(newRadio);
        }   
    }

    const create = ()=>{
        axios.post("/spotify/get-radio", {'track':added.map(track=>{
            return track.id
        }),'options':options})
        .then((data)=>{
            if (!data.data.tracks){
                setRadioResults('error')
            } else if (data.data.tracks.length === 0){
                setRadioResults('error')
            } else{
            setRadioResults(
                added.map(track=>{
                    return {
                        artist: track.artist,
                        title: track.title,
                        uri: track.uri,
                        albumUrl: track.albumUrl,
                        id: track.id,
                        largeAlbumUrl: track.largeAlbumUrl
                    }
                })
                .concat(data.data.tracks.map(track => {
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
                }))
            )}
        })
    }

    const handleCreate = ()=>{
        if (added){
            create()
            setPage(!page)
        }
    }

    return (
        <>
        <Typography variant="h4" className = {classes.cont1}>Create</Typography>
        <Typography variant = "subtitle1" color="textSecondary">Generate amazing playlists based on songs, and customise them with up to 14 uniquely tunable attributes.</Typography>
        {page ? 
            <Grid container direction = "column" className = {classes.root}>
                <TextField placeholder="Add songs to get started..." value = {search}
                    variant="outlined" fullWidth onChange={e => setSearch(e.target.value)}
                    color="secondary"
                    InputProps={{
                        endAdornment:(
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={()=>setSearch("")} edge="end">
                                    <CloseIcon/>
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
                <Grid item className={classes.resultCont} >
                    {search ? searchResults.result ? <>
                    <Typography variant="h5" className = {classes.cont1}>Search Results</Typography>
                    <div className = {classes.results}>{searchResults.result.map(track => (
                        <TrackSearchResult
                            track={track}
                            key={track.uri}
                            addTrack={addTrack}
                        />
                    ))}</div>
                    </>: <div className={classes.loading1}><CircularProgress /></div>:null} 
                </Grid>
                {search ? <Divider className={classes.divider1}/>:null }
                <Grid item className={classes.resultCont}>
                    <Typography variant="h5" className = {classes.cont2}>Track List</Typography>
                    <div className = {classes.results}>
                        {added ? <>{added.map(track => (
                            <AddedTracks
                                key={track.uri}
                                track={track}
                                deleteTrack={deleteTrack}
                            />
                        ))}</>:<Typography color="textSecondary">No songs added yet</Typography>}
                    </div>
                </Grid>
                <Divider className={classes.divider2}/>
                <Grid item>
                    <Typography variant="h5">Tunable Options<Button style={{marginLeft:'10px'}}variant="outlined" size="small" onClick={()=>{setReset(!reset);setOptions({})}}color="secondary">Reset</Button></Typography>
                    <Typography variant="body1" color="textSecondary">Use the sliders to tune the radio to your liking. Select minimum, maximum, and target values for any attribute you wish to adjust. </Typography>
                    <Options options = {options} reset={reset} setOptions={setOptions}/>
                </Grid>
                <Button variant="contained" color="primary" className={classes.button} onClick={()=>{handleCreate()}}>Create</Button>
            </Grid> 
        : 
        <Grid container direction = "column" className = {classes.root}>
            <Grid item container direction="column">
                <TextField inputProps={{ maxLength: 50 }} label="Name" variant="outlined" fullWidth value = {name} onChange={e => setName(e.target.value)}/>
                <Grid item  >
                    {radioResults ? <Typography variant="h5" className = {classes.cont1}>Radio Results</Typography>:null}
                        <div className = {classes.results}>
                        {radioResults? radioResults !== "error" ? <>{radioResults.map(track => (
                            <AddedTracks
                                key={track.uri}
                                track={track}
                                deleteTrack={removeTrack}
                            />
                        ))}</>:<Typography color="error">Unable to curate songs, please go back and edit your preferences</Typography>:null}
                        </div>
                </Grid>
                <TextField inputProps={{ maxLength: 200 }}label="Add a description" value = {description}
                                   multiline rows={6}
                                    onChange={e => setDescription(e.target.value)}/>
                <Grid item>Private<Switch checked={pub} onChange={e=>setPub(e.target.checked)} name="Public" />Public</Grid>
                
            </Grid>
            <Grid item className={classes.button}>
                <Button variant="contained" color="secondary" style={{marginRight:10}} onClick={()=>{setPage(!page);setOptions({})}}>Back</Button>
                {radioResults !== "error" ? <Button variant="contained" color="primary" style={{marginLeft:10}} onClick={()=>add(pub,description,name,radioResults)}>Add Radio</Button>:null}
            </Grid>
            
        </Grid> 
        }</>
    )
}

export default React.memo(CreateRadio)

