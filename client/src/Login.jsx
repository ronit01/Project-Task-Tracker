
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'


function Login() {
  // State to manage username and password input
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    // Set axios to include credentials in requests
    axios.defaults.withCredentials = true;
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("=====", {username, password})
        // Send login request to backend API
        axios.post('/api/login', {username, password}, {'withCredentials': true})
        .then(res => {
            console.log(res);
            if(res.status === 200) {
              // Store user information in local storage
              localStorage.setItem(
                "CURRENT_USER",
                JSON.stringify(res.data)
              )
              navigate('/dashboard')
            } else {
               // Handle non-200 status responses 
              alert("Error: " + res.data)
            }
        }).catch(err => {
          // Handle network or server errors
          window.alert(err.response.data.message)
          console.log(err)
        })
    }

    return(
        <div className="d-flex justify-content-center align-items-center bg-secondary vh-100">
      <div className="bg-white p-3 rounded w-25">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username">
              <strong>Username</strong>
            </label>
            <input
              type="text"
              placeholder="Enter Username"
              autoComplete="off"
              name="username"
              className="form-control rounded-0"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="username">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter Password"
              name="password"
              className="form-control rounded-0"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {/* <Link to ="/home" type="submit" className="btn btn-success w-100 rounded-0">
            Login
          </Link> */}
          <button type="submit" className="btn btn-success w-100 rounded-0">Login</button>
          </form>
          <p>Don't Have an Account?</p>
          <Link to="/signup" className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
            Sign Up
          </Link>
        
      </div>
    </div>
    )
}

export default Login;