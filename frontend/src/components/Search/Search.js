import React, {useState,useEffect} from 'react'
import TextField from '@material-ui/core/TextField';
import TrackSearchResult from './TrackSearchResult'
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import { Typography,Grid } from '@material-ui/core';


const useStyles = makeStyles(() => ({
    root:{
        width:'90%',
        padding:'60px 0px 0px 60px',
    },
    input:{
        backgroundColor:"#0000",
        borderRadius:"5px",
    },
    label:{
        marginTop:'30px',
    },
    results:{
        height:'318px', 
        overflowY:'auto',
        marginTop:'50px',
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
    }
}));

const Search = ({chooseTrack,chooseRadio}) => {
    const classes = useStyles()
    const [search,setSearch]=useState("")
    const [searchResults, setSearchResults] = useState([])

    const handleTrack = (track)=>{
        chooseTrack(track);
    }

    const getRadio=(track)=>{
        let arr = [track.uri]
        axios.post("/spotify/get-radio", {'track':[track.id],'options':[]})
        .then((data)=>{
            chooseRadio(arr.concat(data.data.tracks.map(track => {   
                return track.uri
            })))
        })
    }

    useEffect(() => {
        if (!search) {return setSearchResults([])} else{
        axios.post("/spotify/search", {'query':search})
        .then((data)=>{
            let temp = data.data.map(track => {
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
            setSearchResults(temp)
        });}
    }, [search])

    return (
        <Grid container direction="column" className={classes.root}>
            <TextField placeholder="Search for songs" value = {search}
                variant="outlined"
                onChange={e => setSearch(e.target.value)}
                color="secondary"
                className={classes.input}
            />
        {search !==""? <>
        <Typography variant="h3" className = {classes.label}>Results</Typography>
        <div className = {classes.results}>
            {searchResults.map(track => (
                <TrackSearchResult
                    track={track}
                    key={track.uri}
                    chooseTrack={handleTrack}
                    getRadio = {getRadio}
                />
            ))}
        </div></>:null}  
        </Grid>
    )
}

export default Search
