import "./App.css"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "./components/login"
import Signup from "./components/signup"
import Navbar from "./components/navBar"

// toggle to check ( test only )
const loggedin = true

function App() {
  return (
    <Router>
      {loggedin ? <Navbar /> : ""}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
