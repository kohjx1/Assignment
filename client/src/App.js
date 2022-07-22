import "./App.css"

import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"

import Login from "./components/login"
import Signup from "./components/signup"

function App() {
  return (
    <Router>
      <nav>
        <Link to="/">Log In</Link>
        <Link to="/Signup">Sign up</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
