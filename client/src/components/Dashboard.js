import React, { useContext } from "react"
import Table from "./Table"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"

function Dashboard() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const currentUser = appState.user.username

  return (
    <div>
      <h2>
        {" "}
        Welcome to your Dashboard, <strong>{currentUser}</strong> !
      </h2>
      <Table />
    </div>
  )
}

export default Dashboard
