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
            <Link to="/Home" className="navbar-brand">
              <span></span> Kanban
            </Link>
          </div>
          {sessionStorage.getItem("role") === "admin" ? (
            <ul className="nav navbar-nav">
              <li className="dropdown">
                <a className="dropdown-toggle pointer " data-toggle="dropdown">
                  <Link to="/Dashboard">User Management</Link>
                  {/* <span className="caret"></span> */}
                </a>
                {/* <ul className="dropdown-menu">
                <li>
                  <Link to="/UserManagement/createUser">Create User</Link>
                </li>
                <li>
                  <Link to="/UserManagement/EditUser">Edit User</Link>
                </li>
                <li>
                  <Link to="/UserManagement/DisableUser">Disable User</Link>
                </li>
              </ul> */}
              </li>
              <li className="dropdown">
                <a className="dropdown-toggle pointer" data-toggle="dropdown">
                  <Link to="/GroupManagement/Create">Group Management</Link>
                  {/* <span className="caret"></span> */}
                </a>
                {/* <ul className="dropdown-menu">
                <li>
                  <Link to="/GroupManagement/Create">Create Group</Link>
                </li>
                <li>
                  <Link to="/GroupManagement/View">View Group</Link>
                </li>
                <li>
                  <Link to="/GroupManagement/Assign">Assign Group</Link>
                </li>
              </ul> */}
              </li>
            </ul>
          ) : (
            ""
          )}
          <ul className="nav navbar-nav navbar-right">
            <li>
              <Link to="/Profile">
                <span className="glyphicon glyphicon-user"></span> Profile
              </Link>
            </li>
            <li>
              <Link to="/" onClick={logout}>
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
