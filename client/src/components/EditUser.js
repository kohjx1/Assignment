import React from "react"
import { Grid, Paper, Avatar, TextField, Button, Alert, Collapse } from "@mui/material"
import { fontSize } from "@mui/system"

function EditUser() {
  const gridStyles = { paddingLeft: 5 }
  const fontProps = { style: { fontSize: 17.5 }, sx: { height: 45 } }
  const buttonProps = { backgroundColor: "#94128a" }

  return (
    <Grid container sx={gridStyles} direction={"row"} spacing={5}>
      <Grid item>
        <TextField InputProps={fontProps} InputLabelProps={fontProps} value="username" label="username" helperText="hello" />
      </Grid>
      <Grid item>
        <TextField InputProps={fontProps} InputLabelProps={fontProps} value="email" label="username" />
      </Grid>
      <Grid item>
        <TextField InputProps={fontProps} InputLabelProps={fontProps} value="password" label="username" />
      </Grid>
      <Grid item>
        <Button sx={buttonProps} type="submit" color="primary" variant="contained" fullWidth>
          Create
        </Button>
      </Grid>
    </Grid>
  )
}

export default EditUser
