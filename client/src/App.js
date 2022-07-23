import "./App.css"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "./components/login"
import CreateUser from "./components/createUser"
import Navbar from "./components/navBar"
import UserManagementGroup from "./components/userManagementGroup"

// toggle to check ( test only )
const loggedin = true

function App() {
  return (
    <Router>
      {loggedin ? <Navbar /> : ""}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/createUser" element={<CreateUser />} />
        <Route path="/UserManagementGroup" element={<UserManagementGroup />} />
      </Routes>
    </Router>
  )
}

export default App
