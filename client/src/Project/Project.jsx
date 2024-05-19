import React from 'react'
import "./Project.css"
import axios from 'axios'

function Project({ project }) {

  // Get current user information from local storage
  const user = JSON.parse(localStorage.getItem("CURRENT_USER"))

  // Function to handle the "Join Project" action
  function handleJoin() {
    axios.put(`/api/projects/${project["project_id"]}/join`, {
      "user": user["username"]
    }).then((response) => {
      console.log(response)

      // Send a notification to the project owner upon successful join
      axios.post("/api/notify", {
        "username": project["owner"],
        "notification": `${user["username"]} is added to project '${project["name"]}'`
      })
       // Display a success message to the user
      window.alert(response.data.message)
    })
      .catch((error) => {
        console.log(error)
        // Display error message to user
        window.alert(error.response.data.message)
      })
  }

  return (
    <div className='project'>
      <p className='project-title'>{project["name"]}</p>
      <p className='project-owner'><strong>Created by:</strong> {project["owner"]}</p>
      <p className='project-description'>{project['description']}</p>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end'
      }}>
        <button className='project-button' onClick={handleJoin}>Join Project</button>
      </div>
    </div >
  )
}

export default Project