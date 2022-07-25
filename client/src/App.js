import "./App.css"

import React, { useState, useReducer, useEffect, Suspense } from "react"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "./components/login"
import CreateUser from "./components/createUser"
import Navbar from "./components/navBar"
import UserManagement from "./components/userManagement"
import Dashboard from "./components/Dashboard"
import FlashMessages from "./components/flashMessages"

function App() {
  const initialState = {
    loggedIn: Boolean(sessionStorage.getItem("token")),
    flashMessages: [],
    user: {
      token: sessionStorage.getItem("token")
    }
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        draft.user = action.data
        return

      case "logout":
        draft.loggedIn = false
        return

      case "flashMessage":
        draft.flashMessages.push(action.value)
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.loggedIn) {
      sessionStorage.setItem("token", state.user.token)
    } else {
      sessionStorage.removeItem("token")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          <Navbar />
          <FlashMessages messages={state.flashMessages} />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/createUser" element={<CreateUser />} />
            <Route path="/userManagement" element={<UserManagement />} />
          </Routes>
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
