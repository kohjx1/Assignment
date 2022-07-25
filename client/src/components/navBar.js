import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"

import { Link } from "react-router-dom"

const Navbar = () => {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  // get current logged in user
  const currentUser = appState.user.username
  console.log(currentUser)

  const logout = function () {
    appDispatch({ type: "logout" })
    // sessionStorage.removeItem("token")
    // sessionStorage.removeItem("username")
  }

  return (
    <>
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <a className="navbar-brand" href="#">
              Kanban
            </a>
          </div>
          <ul className="nav navbar-nav">
            <li className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" href="#">
                User Management<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a href="#">Create User</a>
                </li>
                <li>
                  <a href="#">Edit User</a>
                </li>
              </ul>
            </li>
            <li className="active">
              <a href="#">Group Management</a>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#">
                <span className="glyphicon glyphicon-user"></span> Profile
              </a>
            </li>
            <li>
              <Link to="/login" onClick={logout}>
                <span className="glyphicon glyphicon-log-in"></span> Logout
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}
export default Navbar
