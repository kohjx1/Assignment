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
  }

  return (
    <>
      <nav className="navbar navbar-inverse">
        <div className="container-fluid">
          <div className="navbar-header">
            <Link to="/" className="navbar-brand">
              <span></span> Kanban
            </Link>
          </div>
          <ul className="nav navbar-nav">
            <li className="dropdown">
              <a className="dropdown-toggle pointer " data-toggle="dropdown">
                User Management<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/UserManagement/createUser">Create User</Link>
                </li>
                <li>
                  <Link to="/UserManagement/EditUser">Edit User</Link>
                </li>
                <li>
                  <Link to="/UserManagement/DisableUser">Disable User</Link>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a className="dropdown-toggle pointer" data-toggle="dropdown">
                Group Management<span className="caret"></span>
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/GroupManagement/View">View Group</Link>
                </li>
                <li>
                  <Link to="/GroupManagement/Assign">Assign Group</Link>
                </li>
              </ul>
            </li>
          </ul>
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/Profile">
                <span className="glyphicon glyphicon-user"></span> Profile
              </Link>
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
