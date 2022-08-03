import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../../DispatchContext"
import StateContext from "../../StateContext"
import Axios from "axios"
import { Navigate, Outlet, useLocation } from "react-router-dom"

const ProtectedRoutes = ({ allowedRoles }) => {
  // const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)
  console.log([appState.user])
  const location = useLocation()
  // // get current logged in user
  // const currentUser = appState.user.username
  // let auth = { token: appState.user.token, role: appState.user.role }

  return [sessionStorage.getItem("role")].find(role => allowedRoles.includes(role)) ? <Outlet /> : sessionStorage.getItem("token") ? <Navigate to="/Unauthorized" state={{ from: location }} replace /> : <Navigate to="/" state={{ from: location }} replace />
}

export default ProtectedRoutes
