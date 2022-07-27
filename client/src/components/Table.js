import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import Box from "@mui/material/Box"
import { DataGrid, GridApi, useGridApiRef } from "@mui/x-data-grid"
import { ToggleButton, ToggleButtonGroup } from "@mui/material"

function Table() {
  // const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)

  const [data, setData] = useState("")
  // const [checkbox, setCheckbox] = useState(false)

  const rows = data
  // console.log(rows)

  const columns = [
    { field: "id", headerName: "ID", type: "number", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    {
      field: "email",
      headerName: "Email",
      width: 150,
      editable: true
    },
    { field: "password", headerName: "Password", width: 700, editable: true },
    { field: "status", headerName: "Status", type: "boolean", width: 150, editable: true }
  ]

  // Function for retrieve all user data from the backend
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

  // const apiRef = useGridApiRef
  // const onRowEditCommit = (id,event) => {
  //   let row = apiRef.current.getEditRowsModels();
  //   handleRowEdit(row);
  // }

  // const processRowUpdate = newRow => {
  //   // const updatedRow = { ...newRow, isNew: false }
  //   // console.log(newRow.id)

  //   // console.log(id)
  //   // console.log(email)
  //   // console.log(password)
  //   // console.log(status)
  async function updateSingleRow(newRow) {
    var updatedRow = { ...newRow, isNew: false }
    console.log(updatedRow)
    const { id, username, email, password, status } = updatedRow
    console.log(updatedRow)
    const response = await Axios.post("http://localhost:8080/updateUser", { id: id, password: password, email: email, status: status })
    // console.log(response)
    if (!response) {
      return "No data exists in database"
    } else {
      const newRow = { id: id, username: username, email: email, password: password, status: status, isNew: false }
      console.log(newRow)
      return newRow
    }

    // return updatedRow
  }

  // const handleRowEditCommit = React.useCallback(params => {
  //   const id = params.id
  //   const password = params.password
  //   const email = params.email
  //   const status = params.status

  //   console.log(id)
  // async function updateSingleRow(e) {
  //   try {
  //     const response = await Axios.post("http://localhost:8080/updateUser", { id: id, password: password, email: email, status: status })
  //     // console.log(response)
  //     if (!response) {
  //       return "No data exists in database"
  //     } else {
  //       return "Successfully Updated Database"
  //     }
  //   } catch (e) {
  //     console.log("There was an issue with updating particular user data")
  //   }
  // }
  //   updateSingleRow()
  // }, [])

  return (
    <div>
      <div className="flex">
        <button name="button" onClick={getData}>
          Generate
        </button>

        <ToggleButtonGroup>
          <ToggleButton>Check</ToggleButton>
        </ToggleButtonGroup>
      </div>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          density="compact"
          // checkboxSelection={checkbox}
          initialState={{
            sorting: { sortModel: [{ field: "id", sort: "desc" }] },
            columns: {
              columnVisibilityModel: {
                id: false
              }
            }
          }}
          editMode="row"
          processRowUpdate={updateSingleRow}
          experimentalFeatures={{ newEditingApi: true }}
          onProcessRowUpdateError={error => console.log(error)}
          onRowDoubleClick={params => {
            console.log(params)
          }}
          columns={columns}
          rows={rows}
        />
      </Box>
    </div>
  )
}

export default Table
