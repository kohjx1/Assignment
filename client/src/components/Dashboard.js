import React, { useContext } from "react"

import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Dashboard() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const currentUser = appState.user.username

  return (
    <h2>
      {" "}
      Welcome to your Dashboard, <strong>{currentUser}</strong> !
    </h2>
  )
}

export default Dashboard
