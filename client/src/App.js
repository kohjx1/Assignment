import "./App.css"

import React, { useEffect } from "react"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Login from "./components/Login"
import Navbar from "./components/NavBar"
import UserManagement from "./components/UserManagement"
import Dashboard from "./components/Dashboard"
import CreateUser from "./components/CreateUser"
import EditUser from "./components/EditUser"
import DisableUser from "./components/DisableUser"

import GroupManagement from "./components/GroupManagement"
import ViewGroupManagement from "./components/ViewGroupManagement"
import AssignGroupManagement from "./components/AssignGroupManagement"

import Profile from "./components/Profile"

import FlashMessages from "./components/FlashMessages"

import AdminRoutes from "./components/authRoutes/AdminRoutes"

function App() {
  const initialState = {
    loggedIn: Boolean(sessionStorage.getItem("token")),
    flashMessages: [],
    user: {
      token: sessionStorage.getItem("token"),
      username: sessionStorage.getItem("username")
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

      // to assign new token after credential change
      case "newToken":
        draft.user.token = action.value
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
      sessionStorage.setItem("username", state.user.username)
    } else {
      sessionStorage.removeItem("token")
      sessionStorage.removeItem("username")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          {state.loggedIn ? <Navbar /> : ""}
          <FlashMessages messages={state.flashMessages} />
          <Routes>
            <Route path="/" element={<Login />} />

            <Route element={<AdminRoutes />}>
              <Route path="/Dashboard" element={<Dashboard />} />

              <Route path="/UserManagement" element={<UserManagement />} />
              <Route path="/UserManagement/CreateUser" element={<CreateUser />} />
              <Route path="/UserManagement/EditUser" element={<EditUser />} />
              <Route path="/UserManagement/DisableUser" element={<DisableUser />} />

              <Route path="/GroupManagement" element={<GroupManagement />} />
              <Route path="/GroupManagement/View" element={<ViewGroupManagement />} />
              <Route path="/GroupManagement/Assign" element={<AssignGroupManagement />} />

              <Route path="/Profile" element={<Profile />} />
            </Route>
          </Routes>
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}

export default App
