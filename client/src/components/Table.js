import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import Box from "@mui/material/Box"
import { DataGrid } from "@mui/x-data-grid"

function Table() {
  // const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)

  const [data, setData] = useState("")

  async function getData(e) {
    e.preventDefault()
    try {
      const response = await Axios.get("http://localhost:8080/users")
      console.log(response)
      if (!response) {
        return "No data exists in database"
      } else {
        setData(response.data)
        // console.log(response)
        // console.log(response.data[0])
      }
    } catch (e) {
      console.log("There was an issue with retrieval")
    }
  }

  // let USERS = []
  // for (let i = 0; i < data.length; i++) {
  //   USERS[i] = {
  //     id: data[0].id,
  //     username: data[0].username,
  //     password: data[0].password,
  //     email: data[0].email,
  //     status: data[0].status
  //   }
  // }
  // console.log(USERS)

  const rows = data
  console.log(rows)

  const columns = [
    { field: "id", headerName: "ID", type: "number", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      editable: true
    },
    { field: "password", headerName: "Password", width: 150, editable: true },
    { field: "status", headerName: "Status", type: "number", width: 150, editable: true }
  ]

  return (
    <div>
      <button name="button" onClick={getData}>
        Click me
      </button>
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          initialState={{
            sorting: { sortModel: [{ field: "id", sort: "desc" }] },
            columns: {
              columnVisibilityModel: {
                id: false
              }
            }
          }}
          onCellEditCommit={params => console.log(params)}
          onRowEditCommit={params => console.log(params)}
          columns={columns}
          rows={rows}
        />
      </Box>
    </div>
  )
}

export default Table
