import React from 'react'
import {Grid,Typography,IconButton,Card,CardMedia,CardContent, CardActionArea} from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import RadioIcon from '@material-ui/icons/Radio';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({
    cont: {
        cursor: "pointer",
        marginBottom:'15px',
        marginRight:'30px',
        '@media screen and (max-width: 768px)':{
            marginRight:'15px',
          },
    },
    card:{
        width:'190px',
        display:'flex',
        flexDirection:'column',
        backgroundColor:'#0A0708',
        '@media(hover: hover) and (pointer: fine)': {
            '&:hover':{
                '& $button1':{
                    display:'block',
                },
            }, 
        },
        '@media screen and (max-width: 768px)':{
            width:'148px',
          }
    },
    button1:{
        zIndex:'1',
        backgroundColor:'#fff',
        margin:'75px 0 0 75px',
        display:'none',
        position:'absolute',
        '&:hover': {
            backgroundColor:'#d9d9d9',
          },
          '@media screen and (max-width: 768px)':{
            margin:'54px 0 0 54px',
        },
    },
    button2:{
        zIndex:'1',
        right:15,
        bottom:20,
        position:'absolute',
        '@media screen and (max-width: 768px)':{
            margin:'160px 0 0 100px',
            right:5,
            bottom:15,
        }
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
    text:{
        width:'85%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2, /* number of lines to show */
        '-webkit-box-orient': 'vertical'
    },
}));

const TopSongs = ({track,chooseTrack,getRadio}) => {
    const classes = useStyles()
    return (
        <Grid key = {track.id} item className={classes.cont} onClick={()=>chooseTrack(track)}>
            <Card className={classes.card} >
                <CardActionArea >
                <IconButton size="small" color="primary" className = {classes.button1}><PlayArrowIcon fontSize="large" /></IconButton>
                <IconButton className = {classes.button2} onClick = {()=>getRadio(track)}><RadioIcon /></IconButton>
                    <CardMedia 
                        component="img"
                        alt="Contemplative Reptile"
                        className = {classes.img}
                        image={track.largeAlbumUrl}
                        title="Album Cover"
                    />
                    <CardContent style={{height:110}}>
                        <Typography className={classes.text} variant="body1">
                            {track.title}
                        </Typography>
                        <Typography className={classes.text}variant="body2" color="textSecondary">
                            {track.artist}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default TopSongs
