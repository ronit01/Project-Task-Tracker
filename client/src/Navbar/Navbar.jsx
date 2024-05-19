import React from 'react';
import './Navbar.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

  // State to manage notification visibility and fetched data
  const [showNotifications, setshowNotifications] = useState(false)
  const [noti, setNoti] = useState([])
  const navigate = useNavigate()

  // Function to handle user logout
  function handleLogout() {
    localStorage.removeItem("CURRENT_USER")
    navigate("/")
  }
  // Fetch notifications when computing mounts (one-time only)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("CURRENT_USER"))
    axios.get(`/api/user/${user["username"]}`)
      .then((response) => {
        console.log(response)
        let notifications = response.data["notifications"]
        setNoti(notifications)
      })
      .catch((error) => console.log(error))
  }, [])


  return (
    <div className='navbar'>
      <div className='nav-left'>
        <div className='logo'>
          <p style={{ margin: "0px" }}>Project Task Tracker</p>
        </div>
      </div>
      <div className='nav-right'>
        <div className='nav-ele' onClick={() => setshowNotifications(!showNotifications)}>Notifications ({noti.length})</div>
        <div className='nav-ele' onClick={() => {
          navigate("/profile")
        }}>Profile</div>
        <div className='nav-ele' onClick={handleLogout}>Logout</div>
      </div>
      {showNotifications && (
        <div className="notification-box">
          <ul>
            {
              noti.map((item) => (
                <li>{item}</li>
              ))
            }
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
