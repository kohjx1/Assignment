import "./App.css"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "./components/login"
import Signup from "./components/signup"

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
      </Routes>
    </Router>
  )
}

export default App
