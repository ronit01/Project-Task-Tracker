import Login from "./Login"
import Signup from "./Signup"
import Dashboard from "./Dashboard"
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Profile from "./Profile/Profile"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App