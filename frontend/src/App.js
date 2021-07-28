import React, {useState,useEffect} from 'react'
import Login from './components/Login'
import Main from './components/Main'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";


const axios = require('axios');

const App=()=> {

  const [auth,setAuth]=useState()
  const [token,setToken]=useState()
  const [expiry,setExpiry]=useState()

  const fetchData=()=>{
    axios.get('spotify/is-authenticated').then(response=>{
      setAuth(response.data.status[0])
      setToken(response.data.status[1])
      setExpiry(response.data.status[2])
    })
  }

  useEffect(()=>{
    fetchData()
  },[])

  useEffect(() => {
    if (!expiry) return
    const interval = setInterval(() => {
      axios
        .get("spotify/refresh")
        .then(res => {
          setToken(res.data.accessToken)
          console.log('refreshing')
        })
    }, (expiry - 60)*1000)

    return () => clearInterval(interval)
  }, [expiry])

  return (
    <Router>
        <Switch>
          <Route exact path="/" render={()=>{
            if (auth!=null){
              return auth ? (
                <Redirect to='/main' />
              ) : (
                <Redirect to = "/login"/>
              );
            } else{
              return null
            }
          }}/>
          <Route path="/main" render={()=>{
              return <Main token={token} fetchData={fetchData}/>
            }} />
          <Route path="/login" render={()=>{
            return <Login/>
          }}/>
        </Switch>
      </Router>
  );
}

export default App;
