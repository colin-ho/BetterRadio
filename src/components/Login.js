import React,{useState} from 'react'
import useAuth from './Auth'
import { makeStyles } from '@material-ui/core/styles';
import {Grid,Button, Typography, TextField,CircularProgress} from '@material-ui/core';
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

const useStyles = makeStyles(() => ({
    root: {
        background: 'linear-gradient( #0D5279, #171717,#171717)',
        minHeight: "100vh",
        padding:'0 30px 0 30px',
    },
    box:{
        marginTop:'200px',
        marginBottom:'100px',
    },
    login:{
        marginTop:'10px',
        marginBottom:'10px',
    },
    foot:{
        marginTop:'auto',
        marginBottom:'30px',
    },
  }));

const code = new URLSearchParams(window.location.search).get("code")

const Login = () => {
    const classes = useStyles()
    const [password,setPassword] = useState("")
    const [error,setError]=useState()
    const token = useAuth(code)

    const handleLogin = (event)=>{
        event.preventDefault();
        axios.post('/spotify/login',{'password':password}).then(response=>{
            window.location.replace(response.data.url)
        }).catch(()=>{
            setError("Email not found")
        }
        )
    }
    


    return (
        token ? window.location = "" :
        <Grid container className={classes.root} direction="column" justify = "flex-start"  alignItems="center">
            <Grid item container direction="column" alignItems="center" className={classes.box}>
                <Typography variant='h2' align="center" >Welcome</Typography>
                <Typography variant='h6' align="center" color="textSecondary">BetterRadio is a recommendation focused music player powered by Spotify Web API</Typography>
            </Grid>
            <Grid item container direction="column" alignItems="center" >
                <Typography variant='body2' align="center" color="textSecondary">Contact colin.ho99@gmail.com to request access</Typography>
                <Grid item container direction="row" justify="center" className={classes.login}>
                    <form onSubmit={(e)=>handleLogin(e)}>
                        <TextField placeholder="Password" value = {password} variant="outlined" size="small"
                        onChange={e => setPassword(e.target.value)} />
                    </form>
                    {code ? <CircularProgress style={{marginLeft:23}}/>:<Button size="small" variant="contained" 
                        color="primary" onClick={(e)=>handleLogin(e)}>Login</Button>}
                </Grid>
                {error ? <Typography color="error">{error}</Typography>:null}
            </Grid>
            <Grid item container direction="column" alignItems="center" className={classes.foot}>
                <Typography variant='body2' align="center" color="textSecondary">Spotify Premium is required for this app</Typography>
                <Typography variant='body2' align="center" color="textSecondary">To enable in-app playback, use Chrome/Firefox/Edge/Internet Explorer on a desktop computer </Typography>
                <Typography align="center" color="secondary" style={{marginTop:10}}>BetterRadio© {new Date().getFullYear()} | Built and designed by Colin Ho</Typography>
            </Grid>
        </Grid>
    );
}

export default Login
