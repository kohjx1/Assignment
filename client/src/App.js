import "./App.css"

import React, { useEffect, useState } from "react"
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import { useImmerReducer } from "use-immer"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { BrowserRouter as Router, Route, Routes } from "react-router-dom"

import Home from "./components/Board/Home"
import Login from "./components/Login"
import Navbar from "./components/NavBar"
import UserManagement from "./components/UserManagement"
import Dashboard from "./components/Dashboard"
import CreateUser from "./components/CreateUser"
import EditUser from "./components/EditUser"
import DisableUser from "./components/DisableUser"
import ErrorPage from "./components/ErrorPage"

import GroupManagement from "./components/GroupManagement"
import ViewGroupManagement from "./components/ViewGroupManagement"
import AssignGroupManagement from "./components/AssignGroupManagement"
import CreateGroup from "./components/CreateGroup"
import Profile from "./components/Profile"

import ProtectedRoutes from "./components/authRoutes/ProtectedRoutes"

function App() {
  const initialState = {
    loggedIn: Boolean(sessionStorage.getItem("token")),
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
      sessionStorage.removeItem("role")
      sessionStorage.removeItem("groups")
    }
  }, [state.loggedIn])

  return (
    // <DndProvider backend={HTML5Backend}>
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <Router>
          {state.loggedIn ? <Navbar /> : ""}

          <Routes>
            {/* public routes */}
            <Route path="/" element={<Login />} />
            <Route path="/Unauthorized" element={<ErrorPage />} />
            <Route path="*" element={<ErrorPage />} />
            {/* protected routes */}
            <Route element={<ProtectedRoutes allowedRoles={["admin", "user"]} />}>
              <Route path="/Home" element={<Home />} />

              <Route path="/Profile" element={<Profile />} />
            </Route>

            <Route element={<ProtectedRoutes allowedRoles={["admin"]} />}>
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/UserManagement" element={<UserManagement />} />
              <Route path="/UserManagement/CreateUser" element={<CreateUser />} />
              <Route path="/UserManagement/EditUser" element={<EditUser />} />
              <Route path="/UserManagement/DisableUser" element={<DisableUser />} />
              <Route path="/GroupManagement" element={<GroupManagement />} />
              <Route path="/GroupManagement/Create" element={<CreateGroup />} />
              <Route path="/GroupManagement/View" element={<ViewGroupManagement />} />
              <Route path="/GroupManagement/Assign" element={<AssignGroupManagement />} />
            </Route>
          </Routes>
        </Router>
      </DispatchContext.Provider>
    </StateContext.Provider>
    // </DndProvider>
  )
}

export default App
