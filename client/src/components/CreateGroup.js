import React, { useState, useEffect, useContext } from "react"
import { Card, CardHeader, Divider, List, ListItem, ListItemIcon, ListItemText, Checkbox, Paper, IconButton, Box, Modal, Typography, Grid, Button, TextField, Alert, Collapse } from "@mui/material"
import { fontSize } from "@mui/system"
import Axios from "axios"
// import Box from "@mui/material/Box"
import { DataGrid } from "@mui/x-data-grid"
import CloseIcon from "@mui/icons-material/Close"

function CreateGroup() {
  const fontProps = { style: { fontSize: 17.5 }, sx: { height: 45 } }
  const buttonProps = { backgroundColor: "#94128a", "&:hover": { backgroundColor: "#333" } }
  const gridStyles = { paddingTop: 0 }
  const style = {
    position: "absolute",
    top: "50%",
    left: "80%",
    transform: "translate(-60%, -45%)",
    width: 600,
    height: 500,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4
  }

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [selectedGroup, setSelectedGroup] = useState("")
  const [groupname, setGroupname] = useState("")
  const [username, setUsername] = useState(sessionStorage.getItem("username"))
  const [error, setErrors] = useState("")
  const [success, setSuccess] = useState(false)

  const [data, setData] = useState("")
  // console.log(Object.entries(data))
  // console.log(Object.entries(data).length)

  var arr = Object.entries(data)
  var temp = []
  for (var i = 0; i < arr.length; i++) {
    // get group
    var groupName = arr[i][0]
    // console.log(arr[i][0])
    let users = arr[i][1]
    var member = []
    for (var j = 0; j < users.length; j++) {
      // get username
      // console.log(users[j].username)
      member.push(users[j].username)
    }
    temp.push({ id: i, UserGroup: groupName, Members: member })
  }
  // console.log(temp)

  const columns = [
    { field: "id", headerName: "id", type: "number", width: 90 },
    { field: "UserGroup", headerName: "UserGroup", type: "string", width: 150 },
    { field: "Members", headerName: "Members", width: 300 },
    {
      field: "Edit",
      renderCell: cellValues => {
        return (
          <Button
            variant="contained"
            color="primary"
            onClick={event => {
              handleClick(event, cellValues)
            }}
          >
            Edit
          </Button>
        )
      }
    }
  ]

  const handleClickSuccess = () => {
    setGroupname("")
    setErrors("")
    getData()
  }

  // get data upon start
  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSuccess(false)
    }, 1000)

    return () => clearTimeout(timeout)
  }, [success])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setErrors("")
    }, 1000)

    return () => clearTimeout(timeout)
  }, [error])

  // function for capturing validation error message from backend
  const getError = (errors, prop) => {
    try {
      return errors.filter(e => e.param === prop)[0].msg
    } catch (error) {
      return ""
    }
  }

  async function getUserFilter(selected) {
    try {
      const response = await Axios.post("http://localhost:8080/getUsersOnly", { selectedMembers: selected })
      if (!response) {
        return "No User exists in database"
      } else {
        // console.log(response.data)
        // console.log(response.data[0].username)
        const test = () => {
          var tmp = []
          for (var i = 0; i < response.data.length; i++) {
            tmp.push(response.data[i].username)
          }
          // console.log(tmp)
          setLeft(tmp)
        }
        test()

        // return response.data
      }
    } catch (e) {
      console.log("There was an issue with the retrieval")
    }
  }
  // console.log(filterUsers)
  // console.log(allMembers)
  async function getData(e) {
    try {
      const response = await Axios.get("http://localhost:8080/getGroups")
      if (!response) {
        return "No Groups Exists in database"
      } else {
        // filter collection of usernames by groups

        const temp = response.data.reduce((group, username) => {
          const { groupname } = username
          group[groupname] = group[groupname] ?? []
          group[groupname].push(username)
          return group
        }, {})
        setData(temp)
      }
    } catch (e) {
      console.log("There was an issue with the retrieval")
    }
  }

  async function addGroup(e) {
    // e.preventDefault()
    try {
      const response = await Axios.post("http://localhost:8080/createGroup", { groupname: groupname, username: username })

      const err = response.data.errors
      if (err) {
        setErrors(getError(err, "groupname"))
      } else {
        setSuccess(true)
        handleClickSuccess()
      }

      return
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  async function updateUsers(groupname, users) {
    try {
      const response = await Axios.post("http://localhost:8080/updateGroupsForUser", { groupname: groupname, users: users })
      getData()
    } catch (e) {
      console.log("There was a problem")
      return
    }
  }

  async function deleteUsers(groupname, users) {
    try {
      const response = await Axios.post("http://localhost:8080/removeGroupsFromUser", { groupname: groupname, users: users })
      getData()
    } catch (e) {
      console.log("There was a problem")
    }
  }

  const handleClick = (event, value) => {
    handleOpen()
    // set global variable to access members selected
    // console.log(value.row.UserGroup)
    setSelectedGroup(value.row.UserGroup)
    const selectedMembers = value.row.Members
    setRight(selectedMembers)
    // console.log(selectedMembers)
    getUserFilter(selectedMembers)

    // setFilterUsers()
  }

  function not(a, b) {
    return a.filter(value => b.indexOf(value) === -1)
  }

  function intersection(a, b) {
    return a.filter(value => b.indexOf(value) !== -1)
  }

  function union(a, b) {
    return [...a, ...not(b, a)]
  }

  // console.log(selectedGroup)
  const [checked, setChecked] = useState([])
  const [left, setLeft] = useState([0, 1, 2, 3])
  const [right, setRight] = useState([])

  const leftChecked = intersection(checked, left)
  const rightChecked = intersection(checked, right)

  // if selected these objects will be submitted to the database for insertion based on role
  // console.log(leftChecked)

  // if selected these objects will be submitted to the database for deletion based on role
  // console.log(rightChecked)

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }

    setChecked(newChecked)
  }

  const numberOfChecked = items => intersection(checked, items).length

  const handleToggleAll = items => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items))
    } else {
      setChecked(union(checked, items))
    }
  }

  const handleCheckedRight = () => {
    // console.log("on right click")
    setRight(right.concat(leftChecked))
    setLeft(not(left, leftChecked))
    setChecked(not(checked, leftChecked))
    updateUsers(selectedGroup, leftChecked)
  }

  const handleCheckedLeft = () => {
    // console.log("on left click")
    setLeft(left.concat(rightChecked))
    setRight(not(right, rightChecked))
    setChecked(not(checked, rightChecked))
    deleteUsers(selectedGroup, rightChecked)
  }

  const customList = (title, items) => (
    <Card>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0}
            disabled={items.length === 0}
            inputProps={{
              "aria-label": "all items selected"
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: 200,
          height: 230,
          bgcolor: "background.paper",
          overflow: "auto"
        }}
        dense
        component="div"
        role="list"
      >
        {items.map(value => {
          const labelId = `transfer-list-all-item-${value}-label`

          return (
            <ListItem key={value} role="listitem" button onClick={handleToggle(value)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value}`} />
            </ListItem>
          )
        })}
        <ListItem />
      </List>
    </Card>
  )

  return (
    <>
      <Grid container direction="column" spacing={7} sx={gridStyles}>
        <Collapse in={success} className="parent">
          <Alert severity="success">Created New Group Successfully</Alert>
        </Collapse>

        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal keepMounted open={open} onClose={handleClose} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description">
          <Box sx={style}>
            <Grid container direction="row" justify="space-between" alignItems="center">
              <h2></h2>
              <IconButton edge="start" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Grid>

            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item>{customList("Choices", left)}</Grid>
              <Grid item>
                <Grid container direction="column" alignItems="center">
                  <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedRight} disabled={leftChecked.length === 0} aria-label="move selected right">
                    &gt;
                  </Button>
                  <Button sx={{ my: 0.5 }} variant="outlined" size="small" onClick={handleCheckedLeft} disabled={rightChecked.length === 0} aria-label="move selected left">
                    &lt;
                  </Button>
                </Grid>
              </Grid>
              <Grid item>{customList("Chosen", right)}</Grid>
            </Grid>
          </Box>
        </Modal>

        <Grid item>
          <Grid container direction="row" alignItems="center" justifyContent="center" spacing={5}>
            <Grid item>
              <TextField
                InputProps={fontProps}
                InputLabelProps={fontProps}
                value={groupname}
                label="groupname"
                onChange={e => {
                  setGroupname(e.target.value)
                }}
                error={error ? true : false}
                helperText={error}
              />
            </Grid>
            <Grid item>
              <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={addGroup}>
                Create
              </Button>
            </Grid>
            {/* <Grid item>
              <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth onClick={getData}>
                Generate Data
              </Button>
            </Grid> */}
          </Grid>
        </Grid>

        <Grid item>
          <Grid container direction="row" alignItems="center" justifyContent="center" spacing={5}>
            <Box sx={{ height: 400, width: 1000, paddingLeft: 5 }}>
              <DataGrid
                density="compact"
                initialState={{
                  sorting: { sortModel: [{ field: "id", sort: "asc" }] },
                  columns: {
                    columnVisibilityModel: {
                      id: false
                    }
                  }
                }}
                // editMode="row"
                // processRowUpdate={updateSingleRow}
                // experimentalFeatures={{ newEditingApi: true }}
                // onProcessRowUpdateError={error => error}
                columns={columns}
                rows={temp}
                // onCellClick={handleCellClick}
                // onRowClick={handleRowClick}
              />
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateGroup
