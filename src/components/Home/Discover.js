import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import {Grid,Typography,Card,CardActionArea,CardMedia,CardContent,IconButton} from '@material-ui/core';

const useStyles = makeStyles(() => ({
    root:{
        cursor: "pointer",
        marginRight:'30px',
        marginBottom:'15px',
        '@media screen and (max-width: 768px)':{
            marginRight:'15px',
          },
    },
    card:{
        height:'276px',
        width:'190px',
        display:'flex',
        flexDirection:'column',
        backgroundColor:'#0A0708',
        '@media screen and (max-width: 768px)':{
            height:'234px',
            width:'148px',
          },
        '@media(hover: hover) and (pointer: fine)': {
            '&:hover':{
                '& $button1':{
                    display:'block',
                },
            }, 
        },
    },
    img1:{
        height:'85px',
        width:'85px',
        '@media screen and (max-width: 768px)':{
            height:'64px',
            width:'64px',
          }
    },
    artist:{
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2, /* number of lines to show */
        '-webkit-box-orient': 'vertical'
    },
    button1:{
        zIndex:'1',
        backgroundColor:'#fff',
        margin:'75px 0 0 75px',
        display:'none',
        position:'absolute',
        '&:hover': {
            backgroundColor:'#d9d9d9',
            size: "large",
          },
        '@media screen and (max-width: 768px)':{
            margin:'54px 0 0 54px',
        },
    },
}));


const Discover = ({radio,index,handleOpen,chooseRadio}) => {
    const classes = useStyles()

    return (
        <Grid onClick = {()=>handleOpen(radio,index)} key = {index} item className={classes.root}>
            <Card className={classes.card} >
                <CardActionArea >
                    <IconButton size="small" color="primary" className = {classes.button1} onClick = {()=>{chooseRadio(radio.tracks.map(track=> {return track.uri}))}}><PlayArrowIcon fontSize="large" /></IconButton>
                    <div  style= {{padding:'10px 10px 0px 10px'}}>
                        <div style={{display:'flex',flexDirection:'row'}}>
                            <CardMedia 
                                component="img"
                                alt="Contemplative Reptile"
                                className = {classes.img1}
                                image={radio['tracks'][0].largeAlbumUrl}
                                title="Album Cover"
                            />
                            <CardMedia 
                                component="img"
                                alt="Contemplative Reptile"
                                className = {classes.img1}
                                image={radio['tracks'][1].largeAlbumUrl}
                                title="Album Cover"
                            />
                        </div>
                        <div style={{display:'flex',flexDirection:'row'}}>
                            <CardMedia 
                                component="img"
                                alt="Contemplative Reptile"
                                className = {classes.img1}
                                image={radio['tracks'][2].largeAlbumUrl}
                                title="Album Cover"
                            />
                            <CardMedia 
                                component="img"
                                alt="Contemplative Reptile"
                                className = {classes.img1}
                                image={radio['tracks'][3].largeAlbumUrl}
                                title="Album Cover"
                            />
                        </div>
                    </div>
                    <CardContent style={{height:96}}>
                        <Typography noWrap variant="body1">
                            {"Radio " + (index+1)}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" className = {classes.artist} >
                            {radio['tracks'][0].artist + ", " + radio['tracks'][1].artist + ", " + radio['tracks'][2].artist + ", ..."}
                        </Typography>
                        <div style={{height:10}}></div>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default Discover
