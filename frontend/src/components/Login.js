import React from 'react'
import useAuth from './Auth'
import { Redirect} from "react-router-dom";
import axios from 'axios'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Button, Typography} from '@material-ui/core';
const useStyles = makeStyles(() => ({
    root: {
        minHeight: "100vh",
    },
    box:{
        display:'flex',
        flexDirection:'column',
        alignItems:"center",
    }
  }));

const code = new URLSearchParams(window.location.search).get("code")

const Login = () => {
    const classes = useStyles()
    const token = useAuth(code)

    const handleLogin = ()=>{
        axios.get('/spotify/login').then(response=>{
            window.location.replace(response.data.url)
        })
    }


    return (
        token ? <Redirect to="/"/> :
        <Grid container className={classes.root} direction="column" justify = "space-around" alignItems="center">
            <Grid item className={classes.box}>
                <Typography variant='h1'>Welcome</Typography>
                <Button variant="contained" 
                color="primary" onClick={handleLogin}>Login</Button>
            </Grid>
        </Grid>
    );
}

export default Login
