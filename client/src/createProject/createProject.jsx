import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import "./createProject.css"


const CreateProject = () => {
  const [projectName, setProjectname] = useState("");
  const [projectDesc, setProjectdesc] = useState("");

  // Get current user's info from local storage
  let cur_user = JSON.parse(localStorage.getItem("CURRENT_USER"))

  // Function to handle the project creation logic
  function handleCreateProject(e) {
    console.log(projectName)
    if (projectName.trim() === "")
      window.alert("Give some project name")
    else {
      e.preventDefault()
      // Send a POST request to create the project in the backend
      axios.post("/api/projects", {
        "name": projectName,
        "description": projectDesc,
        "owner": cur_user["username"]
      }).then((response) => {
        console.log(response)
        window.location.reload() // Reload the page
      })
        .catch((error) => {
          console.log(error)
        })
    }
  }

  return (
    <div>
      <h4 className='create-project-title'>Create a New Project!</h4>
      <div className="create-project-container">
        <div className="project-info">
          <input placeholder='Enter Project Name ...' className="project-name" type="text" onChange={
            (e) => setProjectname(e.target.value)
          } />
          <textarea placeholder='Enter Project Description ...' className="project-description" onChange={
            (e) => setProjectdesc(e.target.value)
          } />
        </div>
        <button className="create-button" onClick={handleCreateProject}>Create</button>
      </div>
    </div>
  );
}

export default CreateProject;