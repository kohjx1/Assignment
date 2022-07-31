import React, { useContext } from "react"
import Table from "./Table"
import StateContext from "../StateContext"
import DispatchContext from "../DispatchContext"
import CreateUser from "./CreateUser"

function Dashboard() {
  const appDispatch = useContext(DispatchContext)
  const appState = useContext(StateContext)

  const currentUser = appState.user.username

  return (
    <div>
      {/* <div className="intromsg">
        <h2>
          {" "}
          Welcome to your Dashboard, <strong>{currentUser}</strong> !
        </h2>
      </div> */}

      <div className="dashboard">
        <Table />
        {/* <CreateUser /> */}
      </div>
    </div>
  )
}

export default Dashboard
