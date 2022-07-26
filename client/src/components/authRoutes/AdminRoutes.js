import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"

import { Navigate, Outlet } from "react-router-dom"

function AdminRoutes() {
  // const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)

  // // get current logged in user
  // const currentUser = appState.user.username
  let auth = { token: true, isAdmin: true }

  return auth.token && auth.isAdmin ? <Outlet /> : <Navigate to="/login" />
}

export default AdminRoutes
