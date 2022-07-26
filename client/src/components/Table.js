import React, { useState, useEffect, useContext } from "react"
import DispatchContext from "../DispatchContext"
import StateContext from "../StateContext"
import Axios from "axios"

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
        console.log(response.data.length)
      }
    } catch (e) {
      console.log("There was an issue with retrieval")
    }
  }

  let USERS = []
  for (let i = 0; i < data.length; i++) {
    USERS[i] = {
      id: data[0].id,
      username: data[0].username,
      password: data[0].password,
      email: data[0].email,
      status: data[0].status
    }
  }
  console.log(USERS)

  return (
    <button name="button" onClick={getData}>
      Click me
    </button>
  )
}

export default Table
