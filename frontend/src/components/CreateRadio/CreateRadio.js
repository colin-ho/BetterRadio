import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,TextField,Switch,Button,Divider,Snackbar,IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import axios from 'axios';
import TrackSearchResult from './TrackSearchResult'
import AddedTracks from './AddedTracks'
import Options from './Options'

const useStyles = makeStyles(() => ({
    root:{
        width:'90%',
        padding:'60px 0 0 60px',
    },
    cont1:{
        marginTop:'20px',
    },
    cont2:{
        marginTop:'20px',
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
            backgroundColor: "#556cd6",
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
  }));

const CreateRadio = ({chooseRadio}) => {
    const classes = useStyles();
    const [page,setPage] = useState(true)
    const [name,setName]=useState("My New Radio")
    const [creator,setCreator]=useState("")
    const [pub,setPub]=useState(true)
    const [description,setDescription]=useState("")
    const [search,setSearch]=useState("");
    const [searchResults,setSearchResults] = useState([]);
    const [added,setAdded]=useState([]);
    const [options,setOptions]=useState({})
    const [radioResults,setRadioResults]=useState([])
    const [open,setOpen]=useState(false)

    useEffect(()=>{
        axios.get("/spotify/get-user").then(data=>{
            setCreator(data.data.email)
        })
    },[])

    useEffect(() => {
        if (!search) return setSearchResults([])
    
        axios.post("/spotify/search", {'query':search})
        .then((data)=>{
            setSearchResults(
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
        });
    }, [search])

    const addTrack = (track)=>{
        if (!added.includes(track)){
            setAdded([...added,track])
        }
    }

    const deleteTrack = (item)=>{
        const newAdded = added.filter((track) => track.id !== item.id);
        setAdded(newAdded);
    }

    const removeTrack = (item)=>{
        const newRadio = radioResults.filter((track) => track.id !== item.id);
        setRadioResults(newRadio);
    }

    const create = ()=>{
        axios.post("/spotify/get-radio", {'track':added.map(track=>{
            return track.id
        }),'options':options})
        .then((data)=>{
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
            )
        })
    }

    const add = ()=>{
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
            })
    }

    const handleCreate = ()=>{
        if (added.length!==0){
            create()
            setPage(!page)
        } else{
            setOpen(true)
        }
    }

    const handleClose = ()=>{
        setOpen(false);
    }

    return (
        <>{page ? 
            <Grid container direction = "column" className = {classes.root}>
                <TextField placeholder="Search for songs to add" value = {search}
                    variant="outlined"
                    fullWidth
                    onChange={e => setSearch(e.target.value)}
                    color="secondary"
                    className={classes.search}
                />
                <Grid item  >
                    {searchResults.length === 0 ? null: <Typography variant="h5" className = {classes.cont1}>Search Results</Typography>}
                        <div className = {classes.results}>
                        {searchResults.map(track => (
                            <TrackSearchResult
                                track={track}
                                key={track.uri}
                                addTrack={addTrack}
                            />
                        ))}
                        </div>
                </Grid>
                {searchResults.length === 0 ? null: <Divider className={classes.divider1}/>}
                <Grid item>
                    {added.length === 0 ? null: <Typography variant="h5" className = {classes.cont2}>Track List</Typography>}
                    <div className = {classes.results}>
                        {added.map(track => (
                            <AddedTracks
                                key={track.uri}
                                track={track}
                                deleteTrack={deleteTrack}
                            />
                        ))}
                    </div>
                </Grid>
                {added.length === 0 ? null: <Divider className={classes.divider2}/>}
                <Grid item>
                    <Typography variant="h5">Options</Typography>
                    <Typography variant="subtitle2">*Use the sliders to select minimum, maximum, and target values</Typography>
                    <Options options = {options} setOptions={setOptions}/>
                </Grid>
                <Button variant="contained" color="primary" className={classes.button} onClick={()=>{handleCreate()}}>Create</Button>
                <Snackbar
                    anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                    }}
                    open={open}
                    autoHideDuration={4000}
                    onClose={handleClose}
                    message="Please add songs"
                    action={
                    <IconButton size="small" aria-label="close" color="inherit" onClick={()=>handleClose()}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    }
                />
            </Grid> 
        : 
        <Grid container direction = "column" className = {classes.root}>
            <Grid item container direction="column">
                <TextField label="Name" variant="outlined" fullWidth value = {name} onChange={e => setName(e.target.value)}/>
                <Grid item  >
                    {radioResults.length === 0 ? null: <Typography variant="h5" className = {classes.cont1}>Radio Results</Typography>}
                        <div className = {classes.results}>
                        {radioResults.map(track => (
                            <AddedTracks
                                key={track.uri}
                                track={track}
                                deleteTrack={removeTrack}
                            />
                        ))}
                        </div>
                </Grid>
                <TextField label="Add a description" value = {description}
                                   multiline rows={6}
                                    onChange={e => setDescription(e.target.value)}/>
                <Grid item>Private<Switch checked={pub} onChange={e=>setPub(e.target.checked)} name="Public" />Public</Grid>
                
            </Grid>
            <Grid item className={classes.button}>
                <Button variant="contained" color="secondary" style={{marginRight:10}} onClick={()=>setPage(!page)}>Back</Button>
                <Button variant="contained" color="primary" style={{marginLeft:10}} onClick={()=>add()}>Add Radio</Button>
            </Grid>
            
        </Grid> 
        }</>
    )
}

export default CreateRadio

