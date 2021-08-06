import React, {useState,useEffect} from 'react'
import Login from './components/Login'
import Main from './components/Main'
import axios from 'axios';
axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'

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
        })
    }, (expiry - 60)*1000)

    return () => clearInterval(interval)
  }, [expiry])

  return (
    <>
      {auth ? auth === "true" ?<Main token={token} fetchData={fetchData}/> : <Login/>:null}
    </>
          
  );
}

export default App;
