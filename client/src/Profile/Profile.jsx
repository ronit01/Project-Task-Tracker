import React from 'react'
import "./Profile.css"
import Navbar from '../Navbar/Navbar'
import axios from 'axios'
import { useEffect, useState } from 'react'

const Profile = () => {
  // State to hold user data and projects
  const [user, setUser] = useState()
  const [projects, setProjects] = useState([])
  var profile = JSON.parse(localStorage.getItem("CURRENT_USER"))

  useEffect(() => {
    // Fetch user profile data 
    axios.get(`/api/user/${profile['username']}`)
      .then((response) => {
        console.log(response.data)
        setUser(response.data)
      })
      .catch((error) => {
        console.log(error)
        window.alert(error.response.data.message)
      })

    // Fetch user's projects
    axios.get(`/api/projects/${profile["username"]}`)
      .then((response) => {
        console.log(response.data)
        setProjects([...response.data].reverse()) // Setting the projects and reverse for latest first
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])  // Empty dependency array ensures this runs only once when component mounts

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      {user && <>
        <Navbar />
        <h1 style={{ marginTop: "100px" }}>Profile</h1>
        <div className='user-data'>
          <p><strong>Name: </strong>{`${user['name']}`}</p>
          <p><strong>Email: </strong>{`${user['email']}`}</p>
          <p><strong>UserName: </strong>{`${user['username']}`}</p>
        </div>
        <br />
        <div className='list-project'>
          {projects.map((item) => {
            return (
              <div className='project' key={item["project_id"]}>
                <p className='project-title'>{item["name"]}</p>
                <p className='project-owner'><strong>Created by:</strong> {item["owner"]}</p>
                <p className='project-description'>{item['description']}</p>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end'
                }}>
                </div>
              </div >
            )
          })}
        </div>
      </>}
    </div>
  )
}

export default Profile