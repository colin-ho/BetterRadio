import React from 'react'
import TextField from '@material-ui/core/TextField';
import TrackSearchResult from './TrackSearchResult'
import { makeStyles } from '@material-ui/core/styles';
import { Typography,Grid,CircularProgress,InputAdornment,IconButton} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import TopSongs from './TopSongs'
import axios from 'axios';
import useDebouncedSearch from '../DebounceSearch';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'


const useStyles = makeStyles(() => ({
    root:{
        width:'100%',
        padding:'30px 30px 0px 30px',
    },
    input:{
        marginTop:'20px',
        backgroundColor:"#0000",
        borderRadius:"5px",
    },
    label:{
        marginTop:'20px',
    },
    results:{
        width:'100%',
        height:'318px', 
        overflowY:'auto',
        marginTop:'30px',
        marginBottom:150,
        '@media screen and (max-width: 768px)':{
            marginBottom:165,
          },
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
    top:{
        marginTop:'40px',
    },
    topCont:{
        margin:'20px 0px 120px 0',
        flexWrap: 'nowrap',
        overflowX : 'scroll',
        '@media screen and (max-width: 768px)':{
            margin:'20px 0px 180px 0',
          },
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
        marginBottom:90,
        width:40,
        marginLeft: 'auto',
        marginRight:'auto',
    },
    loading1:{
        marginTop: 50,
        width:40,
        marginLeft: 'auto',
        marginRight:'auto',
    }
}));

const Browse = ({chooseTrack,chooseRadio,top}) => {
    const classes = useStyles()
    const { search, setSearch, searchResults } = useDebouncedSearch();

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

    return (
        <Grid container direction="column" className={classes.root}>
            <Typography variant="h4" >Browse</Typography>
            <Typography variant = "h6" color="textSecondary" style={{marginTop:'10px'}}>Search for songs filtered to your listening preferences</Typography>
            <TextField placeholder="Search for songs..." value = {search}
                variant="outlined"
                onChange={e => setSearch(e.target.value)}
                color="secondary"
                className={classes.input}
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
        {search ? null: <>
            <Typography variant='h4'className={classes.top}>
                Top Songs
            </Typography>
            <Typography color="textSecondary" variant='subtitle1' >
                Tracks from your favorite artists
            </Typography>
            <Grid container direction="row"
            justify="flex-start"
            alignItems="center" className={classes.topCont}>
                {top ? <>{top.map((track,index) => (
                <TopSongs key={index} track = {track} chooseTrack={chooseTrack} getRadio={getRadio}/>
                ))}</>:<CircularProgress className={classes.loading}/>}
            </Grid> 
            </>
        }
        {search !==""? <>
        <Typography variant="h4" className = {classes.label}>Results</Typography>
        <div className = {classes.results}>
            {searchResults.result ? <>{searchResults.result.map(track => (
                <TrackSearchResult
                    track={track}
                    key={track.uri}
                    chooseTrack={handleTrack}
                    getRadio = {getRadio}
                />
            ))}</>:<div className={classes.loading1}><CircularProgress/> </div>}
        </div></>:null}  
        </Grid>
    )
}

export default Browse

