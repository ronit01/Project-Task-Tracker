import React from 'react'
import Navbar from './Navbar/Navbar'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "./Dashboard.css"
import Project from './Project/Project'
import CreateProject from './createProject/createProject'

const Dashboard = () => {

    const [projects, setProjects] = useState([])

    useEffect(() => {
        // Fetch all projects from the backend API
        axios.get("/api/projects")
            .then((response) => {
                setProjects([...response.data].reverse())
            })
            .catch((err) => {
                window.alert(err.response.data.message)
            })
        // Ensure the user is logged in
        if (localStorage.getItem("CURRENT_USER") === null)
            window.location.reload()
    }, [])


    return (
        <>

            {localStorage.getItem("CURRENT_USER") !== null && <div>
                <Navbar />
                <div className='dashboard'>
                    <div className='create-project'>
                        <CreateProject />
                    </div>
                    <div className='list-project'>
                        {projects.map((item) => {
                            return (
                                <Project project={item} key={item["project_id"]} />
                            )
                        })}
                    </div>
                </div>
            </div>}
        </>
    )
}

export default Dashboard