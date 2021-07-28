import React from 'react'
import {Grid,Typography,IconButton,Card,CardActionArea,CardMedia,CardContent} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RadioIcon from '@material-ui/icons/Radio';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    cont: {
        cursor: "pointer",
        marginRight:'50px'
    },
    card:{
        width:'190px',
        display:'flex',
        flexDirection:'column',
        whiteSpace:'nowrap',
        overflow:'hidden',
        backgroundColor:'#0A0708',
        '&:hover':{
            '& $button1':{
                opacity:'1',
            },
            '& $button2':{
                opacity:'1',
            }
        },
        '@media screen and (max-width: 768px)':{
            width:'148px',
          }
    },
    button1:{
        zIndex:'1',
        backgroundColor:'#fff',
        margin:'70px 0 0 70px',
        opacity:'0',
        position:'absolute',
        '&:hover': {
            backgroundColor:'#d9d9d9',
            size: "large",
          },
    },
    button2:{
        zIndex:'1',
        margin:'195px 0 0 130px',
        opacity:'0',
        position:'absolute',
    },
    img:{
        marginTop: '10px',
        marginRight: '10px',
        marginLeft:'10px',
        height:'170px',
        width:'170px', 
        '@media screen and (max-width: 768px)':{
            height:'128px',
            width:'128px',
          }
    },
  }));

const TopSongs = ({track,chooseTrack,getRadio}) => {
    const classes = useStyles()
    return (
        <Grid key = {track.id} item className={classes.cont}>
            <Card className={classes.card} >
                <CardActionArea onClick={()=>chooseTrack(track)}>
                <IconButton size="small" color="primary" className = {classes.button1} onClick = {()=>chooseTrack(track)}><PlayArrowIcon fontSize="large" /></IconButton>
                <IconButton className = {classes.button2} onClick = {()=>getRadio(track)}><RadioIcon color="secondary" /></IconButton>
                    <CardMedia 
                        component="img"
                        alt="Contemplative Reptile"
                        className = {classes.img}
                        image={track.largeAlbumUrl}
                        title="Album Cover"
                    />
                    <CardContent>
                        <Typography noWrap style={{width:'80%'}}variant="body1">
                            {track.title}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {track.artist}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default TopSongs
