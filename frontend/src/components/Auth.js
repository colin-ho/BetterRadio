import { useState, useEffect } from "react"

const axios = require('axios');

export default function Auth(code) {
  const [accessToken, setAccessToken] = useState()

  useEffect(() => {
    if(!code){
        return null
    } else{
    axios
      .post("spotify/get-token", {
        'code':code
      })
      .then(res => {
        setAccessToken(res.data.accessToken)
        window.history.pushState({}, null, "/")
      })
      .catch(() => {
        window.location = "/"
      })}
  }, [code])

  return accessToken
}