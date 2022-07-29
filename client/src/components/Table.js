import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"
import Box from "@mui/material/Box"
import { DataGrid } from "@mui/x-data-grid"
import { Grid, Alert, Collapse, AlertTitle, LinearProgress } from "@mui/material"

function Table() {
  // const appDispatch = useContext(DispatchContext)
  // const appState = useContext(StateContext)

  const [data, setData] = useState("")
  const [error, setErrors] = useState("")
  const [success, setSuccess] = useState(false)
  const [fail, setFail] = useState(false)

  const rows = data
  console.log(rows)

  var temp = []
  for (var i = 0; i < rows.length; i++) {
    // test = temp.push({ ...rows[i], password: "**********" })
    temp.push({ ...rows[i], password: "**********" })
  }
  console.log(temp)

  const columns = [
    { field: "id", headerName: "ID", type: "number", width: 90 },
    { field: "username", headerName: "Username", width: 150 },
    {
      field: "email",
      headerName: "Email",
      width: 200,
      editable: true
    },
    { field: "password", headerName: "Password", type: "string", width: 300, editable: true },
    { field: "status", headerName: "Status", type: "boolean", width: 150, editable: true }
  ]

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFail(false)
    }, 500)

    return () => clearTimeout(timeout)
  }, [fail])

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

  async function updateSingleRow(newRow) {
    var updatedRow = { ...newRow, isNew: false }

    // console.log(updatedRow)
    const { id, username, password, email, status } = updatedRow
    // const oldPassword = oldPw.filter(row => row.id === id)[0].password
    // console.log(oldPw.filter(row => row.id === id)[0].password)

    const response = await Axios.post("http://localhost:8080/updateUser", { id: id, password: password, email: email, status: status })
    const err = response.data.errors
    console.log(err)
    console.log(err.length)
    console.log(!err)
    if (err.length > 0) {
      // setErrors(getError(err))
      setErrors(err)
      setFail(true)
    } else if (err.length === 0) {
      setSuccess(true)
      const newRow = { id: id, username: username, email: email, password: password, status: status, isNew: false }

      console.log(newRow)
      return newRow
    }
    return
  }

  console.log(error)
  return (
    <Grid>
      <Collapse in={fail}>
        <Alert severity="warning">
          <AlertTitle>
            {(error || []).map((item, i) => (
              <li>{item.msg}</li>
            ))}
          </AlertTitle>
          {/* some error */}
        </Alert>
      </Collapse>

      <Collapse in={success}>
        <Alert severity="success">Successfully Updated User</Alert>
      </Collapse>

      <div className="flex">
        <button name="button" onClick={getData}>
          Generate
        </button>
      </div>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          density="compact"
          initialState={{
            sorting: { sortModel: [{ field: "id", sort: "desc" }] },
            columns: {
              columnVisibilityModel: {
                id: false
              }
            }
          }}
          components={{
            LoadingOverlay: LinearProgress
          }}
          // Loading
          // {...rows}
          editMode="row"
          processRowUpdate={updateSingleRow}
          experimentalFeatures={{ newEditingApi: true }}
          onProcessRowUpdateError={error => error}
          // onRowClick={params => {
          //   console.log("This is email valiation: ", validEmail.test(params.row.email))
          //   console.log("This is password validation: ", validPassword.test(params.row.password))
          // }}
          // onRowDoubleClick={params => {
          //   console.log(params)
          // }}
          columns={columns}
          rows={temp}
        />
      </Box>
    </Grid>
  )
}

export default Table
