import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,Card,CardActionArea,CardMedia,CardContent} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    card:{
        height:'266px',
        width:'190px',
        display:'flex',
        flexDirection:'column',
        backgroundColor:'#0A0708',
        '@media screen and (max-width: 768px)':{
            height:'224px',
            width:'148px',
          }
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
    }
}));


const Discover = ({radio,index,handleOpen}) => {
    const classes = useStyles()

    return (
        <Grid onClick = {()=>handleOpen(radio,index)} key = {index} item style={{ cursor: "pointer",marginRight:'50px' }}>
            <Card className={classes.card} >
                <CardActionArea >
                    <div style= {{margin:'10px 10px 0px 10px'}}>
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
                    <CardContent>
                        <Typography noWrap variant="body1">
                            {"Playlist " + (index+1)}
                        </Typography>
                            <Typography variant="body2" color="textSecondary" className = {classes.artist} >
                                {radio['tracks'][0].artist + ", " + radio['tracks'][1].artist + ", " + radio['tracks'][2].artist + ", ..."}
                            </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    )
}

export default Discover
