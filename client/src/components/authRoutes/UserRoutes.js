import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"

import { Navigate, Outlet } from "react-router-dom"

function UserRoutes() {
  // const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)

  // // get current logged in user
  // const currentUser = appState.user.username
  let auth = { token: true, isUser: true }

  return auth.token && auth.isUser ? <Outlet /> : <Navigate to="/login" />
}

export default UserRoutes
