import React,{useState,useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Typography,Divider,Button} from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
    title:{
        margin:'20px 0px 10px 10px'
    },
    sub:{
        color:'#d9d9d9',
        margin:'0px 0px 10px 10px'
    },
    divider:{
        width:'80%',
        marginBottom:'10px'
    },
    cont:{
        marginBottom:'10px',
        height: "210px" ,
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
            backgroundColor: "#",
          }
    },
    track:{
        cursor: "pointer",
    },
    img:{
        height:'48px',
        width:'48px'
    },
    text:{
        paddingLeft:"20px"
    },
    button:{
        marginLeft:"50px",
    }

  }));

const RadioOpen = ({genres,radio,indexOpen,handlePlay,addRadio}) => {
    const classes = useStyles()
    const [description,setDescription]=useState()
    const cap=(string)=> {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    useEffect(()=>{
        if (genres.length === 3){
            setDescription(cap(genres[0]) + ", " + cap(genres[1]) + ", " + cap(genres[2])+", and more...")
        } else if (genres.length ===2){
            setDescription(cap(genres[0]) + ", " + cap(genres[1]) +", and more...")
        } else{
            setDescription(cap(genres[0]) +", and more...")
        }
    },[genres])
    return (
        <div>
            <Typography className = {classes.title} variant='h5'>
            {"Radio " + (indexOpen+1)}
                <Button variant="outlined" color="secondary"className={classes.button} onClick={()=>addRadio(false,description,"New Radio",radio)}>Add to Radios</Button>
            </Typography>
            <Typography className = {classes.sub} variant='subtitle1'>
                {description}
            </Typography>
            <Divider className = {classes.divider}/>
            <Grid item container className = {classes.cont}>
            {radio.map((track,index) => (
                <Grid key = {index} className = {classes.track}onClick = {()=>handlePlay(radio.map(track=> {return track.uri}),index)}item container alignItems='center'>
                    <Grid item xs={1}>
                        <Typography >{index+1}</Typography>
                    </Grid>
                    <Grid item >
                        <img src={track.albumUrl} className={classes.img} alt=""/>
                    </Grid>
                    <Grid item xs zeroMinWidth className = {classes.text}>
                        <Typography variant='body2' noWrap>{track.title}</Typography>
                        <Typography variant='body2' noWrap color="textSecondary">{track.artist}</Typography>
                    </Grid>
                </Grid>
            ))}
            </Grid>
        </div>
    )
}

export default RadioOpen
