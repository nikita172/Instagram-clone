import React, { useEffect } from 'react'
import axios from "axios";
const Home = () => {
  useEffect(() => {
    const getData = async () => {
      const data = await axios.get("http://localhost:8000/auth/user/signin/facebook/success")
      console.log(data)
    }
    getData();

  }, [])
  return (
    <div>
      <div> home </div>
      <div> querk </div>
    </div>
  )
}

export default Home