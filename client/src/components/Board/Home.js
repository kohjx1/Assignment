import React, { useEffect, useState, useContext } from "react"
import KanbanHeader from "./KanbanHeader"
import Item from "./Item"
import DropWrapper from "./DropWrapper"
import Col from "./Col"
import { data, statuses } from "../../data/index"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { Modal, Box, TextField } from "@mui/material"
import CreateNewAppWindow from "./CreateNewAppWindow"
import CreateNewTaskWindow from "./CreateNewTaskWindow"
import EditAppWindow from "./EditAppWindow"
import CreateNewPlanWindow from "./CreateNewPlanWindow"
import AssignPlanWindow from "./AssignPlanWindow"
import Axios from "axios"
import StateContext from "../../StateContext"

function Home() {
  const appState = useContext(StateContext)
  console.log(appState.loggedIn)
  // get all the tasks
  async function getTasks(e) {
    try {
      const response = await Axios.get("http://localhost:8080/getTasks")

      // console.log(response.data)
      let tmp = []
      for (var i = 0; i < response.data.length; i++) {
        let mapping = statuses.find(si => si.Task_state === response.data[i].Task_state)
        let data = { ...response.data[i] }
        data.icon = mapping.icon
        tmp.push(data)
      }
      // console.log(tmp)
      setItems(tmp)
      getApplications()
      getPlans()
    } catch (e) {
      console.log(e)
      return
    }
  }

  // const [items, setItems] = useState(data)
  const [items, setItems] = useState([])
  const [plans, setPlans] = useState([])

  // console.log(items)
  const [openApp, setOpenCreateApplication] = useState(false)
  const onOpenApp = () => setOpenCreateApplication(true)
  const onCloseApp = () => setOpenCreateApplication(false)

  const [openTask, setOpenTask] = useState(false)
  const onOpenTask = () => setOpenTask(true)
  const onCloseTask = () => setOpenTask(false)

  const [openEditApp, setOpenEditApp] = useState(false)
  const onOpenEditApp = () => setOpenEditApp(true)
  const onCloseEditApp = () => setOpenEditApp(false)

  const [openCreatePlan, setOpenCreatePlan] = useState(false)
  const onOpenCreatePlan = () => setOpenCreatePlan(true)
  const onCloseCreatePlan = () => setOpenCreatePlan(false)

  const [openAssignPlan, setOpenAssignPlan] = useState(false)
  const onOpenAssignPlan = () => setOpenAssignPlan(true)
  const onCloseAssignPlan = () => setOpenAssignPlan(false)

  const [userPermission, setUserPermission] = useState([])

  async function getPlans() {
    const response = await Axios.get("http://localhost:8080/getPlans")
    if (response.data) {
      let planArrObj = response.data
      console.log(planArrObj)
      setPlans(planArrObj)
    }
  }

  async function updateStatus(iD, status) {
    try {
      const response = Axios.post("http://localhost:8080/updateStatus", { taskID: iD, taskState: status })
    } catch (e) {
      console.log(e)
      return
    }
  }

  async function updateTransition(id, state, username, prevNote) {
    try {
      const response = Axios.post("http://localhost:8080/updateTransition", { id: id, state: state, username: username, prevNote: prevNote })
    } catch (e) {
      console.log(e)
      return
    }
  }

  async function sendEmail(taskID, taskName, taskOwner, taskAppName, taskPlan) {
    try {
      const response = Axios.post("http://localhost:8080/sendEmail", { taskID: taskID, taskName: taskName, taskOwner: taskOwner, taskAppName: taskAppName, taskPlan: taskPlan })
    } catch (e) {
      console.log(e)
      return
    }
  }

  // change statuses of the items as it is dropped into a new column
  const onDrop = (item, monitor, status) => {
    // after dropping new item to new column, find the status of that new column

    const mapping = statuses.find(si => si.Task_state === status)

    // filter out items to not contain dropped item, then add back the dropped item information with new status and icon
    setItems(prevState => {
      const newItems = prevState.filter(i => i.Task_id !== item.Task_id).concat({ ...item, Task_state: status, icon: mapping.icon })
      console.log(newItems)
      return [...newItems]
    })

    updateTransition(item.Task_id, status, sessionStorage.getItem("username"), item.Task_notes)

    if (status === "done") {
      sendEmail(item.Task_id, item.Task_name, item.Task_owner, item.Task_app_Acronym, item.Task_plan)
    }
    // update task status in database

    // updateStatus(item.Task_id, status)
  }

  const moveItem = (dragIndex, hoverIndex) => {
    const item = items[dragIndex]

    // set previous item column to newstate with removed item
    setItems(prevState => {
      const newItems = prevState.filter((i, idx) => idx !== dragIndex)
      console.log(newItems)
      newItems.splice(hoverIndex, 0, item)
      console.log([...newItems])
      return [...newItems]
    })
  }

  async function getApplications() {
    try {
      const appResponse = await Axios.get("http://localhost:8080/getApps")

      // setAppData(appResponse.data)
      accessRights(appResponse.data)
    } catch (e) {
      console.log(e)
    }
  }

  // console.log(appData)

  async function accessRights(appData) {
    var accessArr = []
    for (var x = 0; x < appData.length; x++) {
      let appArr = appData[x]

      // slice only the roles
      // console.log(Object.entries(appArr).slice(4, 9))

      let appName = appArr.App_Acronym

      var rowOutcome = { appName: appName }
      // rowOutcome.test = "test"
      // console.log(rowOutcome)
      let colData = Object.entries(appArr).slice(4, 9)
      for (var i = 0; i < colData.length; i++) {
        // console.log(colData[i][0])
        // console.log(colData[i][1].split(","))
        //
        let col = colData[i][0]
        let groupArr = colData[i][1].split(",")
        // console.log(groupArr.length)
        for (var j = 0; j < groupArr.length; j++) {
          let groupname = groupArr[j]
          const check = await Axios.post("http://localhost:8080/checkGroup", { username: sessionStorage.getItem("username"), groupname: groupname })
          var outcome = check.data.inGroup
          // console.log(col, groupname, outcome)
          if (outcome === true) {
            rowOutcome[col] = true
            break
          } else if (outcome === false) {
            rowOutcome[col] = false
          }
          continue
        }
      }
      // push rowOutcome into array
      // console.log(rowOutcome)
      accessArr.push(rowOutcome)
    }
    //
    // console.log(accessArr)
    setUserPermission(accessArr)
  }

  // {create: [Feature 1, Feature 2],open: [Feature 1] ,todo: , doing: , done:}

  // create, open, todo, doing, done

  // if create --> create app and task button show

  // if open --> create plan and assign plan button show, move Open - todo

  // if todo --> move to doing

  // if doing --> move to todo || done

  // if done --> move to doing || close

  // testing
  // const [group, setGroup] = useState("PL")

  useEffect(() => {
    getTasks()
  }, [])

  //??
  // console.log(userPermission)
  //
  //

  // useEffect(() => {
  //   setUserCreateRights(
  //     userPermission.filter(e => {
  //       return e.App_permit_Create === true
  //     })
  //   )
  // }, userPermission)

  // console.log(userCreateRights)
  // console.log(userOpenRights)

  return (
    // <>

    <DndProvider backend={HTML5Backend}>
      {/* <KanbanHeader group={group} /> */}
      <div className={"row"}>
        {/* s is the status data */}
        {statuses.map(s => {
          return (
            <div key={s.Task_state} className={"col-wrapper"}>
              <h2 className={"col-header"}>{s.Task_state.toUpperCase()}</h2>
              <DropWrapper onDrop={onDrop} status={s.Task_state} userPermission={userPermission} items={items} setItems={setItems}>
                <Col>
                  {/* i is the item data mapping to each individual item key */}
                  {items
                    .filter(i => i.Task_state === s.Task_state)
                    .map((i, idx) => (
                      <Item key={i.Task_id} item={i} index={idx} moveItem={moveItem} status={s} userPermission={userPermission} items={items} setItems={setItems} />
                    ))}
                </Col>
              </DropWrapper>
              {/* Only main project lead or admin can add new application  */}

              {
                // AOC
                s.Task_state === "open" &&
                sessionStorage.getItem("username") === "admin" &&
                userPermission.some(function (e, i) {
                  return e.App_permit_Create
                }) &&
                sessionStorage.getItem("username") === "admin" &&
                userPermission.some(function (e, i) {
                  return e.App_permit_Open
                }) ? (
                  <>
                    <div className="buttons">
                      <div className="action_btn">
                        <button onClick={onOpenApp} className="button-create action_btn btn-left">
                          New App
                        </button>
                        <button onClick={onOpenEditApp} className="button-create action_btn btn-right">
                          Edit App
                        </button>{" "}
                      </div>
                    </div>

                    <br></br>

                    <button onClick={onOpenTask} className="button-create">
                      New Task
                    </button>
                    <br></br>

                    <button onClick={onOpenCreatePlan} className="button-create">
                      New Plan
                    </button>
                  </>
                ) : // !AOC
                s.Task_state === "open" &&
                  sessionStorage.getItem("username") !== "admin" &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Open
                  }) &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Create
                  }) ? (
                  <>
                    <button onClick={onOpenTask} className="button-create">
                      New Task
                    </button>
                    <br></br>
                    <button onClick={onOpenCreatePlan} className="button-create">
                      New Plan
                    </button>
                  </>
                ) : // !A!O C
                s.Task_state === "open" &&
                  sessionStorage.getItem("username") !== "admin" &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Open
                  }) === false &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Create
                  }) ? (
                  <>
                    <button onClick={onOpenTask} className="button-create">
                      New Task
                    </button>
                  </>
                ) : // !A !O !C
                s.Task_state === "open" &&
                  sessionStorage.getItem("username") !== "admin" &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Open
                  }) === false &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Close
                  }) === false ? (
                  ""
                ) : // A O !C
                s.Task_state === "open" &&
                  sessionStorage.getItem("username") === "admin" &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Open
                  }) &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Create
                  }) === false ? (
                  <>
                    <div className="buttons">
                      <div className="action_btn">
                        <button onClick={onOpenApp} className="button-create action_btn btn-left">
                          New App
                        </button>
                        <button onClick={onOpenEditApp} className="button-create action_btn btn-right">
                          Edit App
                        </button>{" "}
                      </div>
                    </div>
                    <br></br>
                    <button onClick={onOpenCreatePlan} className="button-create">
                      New Plan
                    </button>
                  </>
                ) : // A !O !C
                s.Task_state === "open" &&
                  sessionStorage.getItem("username") === "admin" &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Open
                  }) === false &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Create
                  }) === false ? (
                  <>
                    <div className="buttons">
                      <div className="action_btn">
                        <button onClick={onOpenApp} className="button-create action_btn btn-left">
                          New App
                        </button>
                        <button onClick={onOpenEditApp} className="button-create action_btn btn-right">
                          Edit App
                        </button>{" "}
                      </div>
                    </div>
                  </>
                ) : // !A O !C
                s.Task_state === "open" &&
                  sessionStorage.getItem("username") !== "admin" &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Open
                  }) &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Create
                  }) === false ? (
                  <>
                    <button onClick={onOpenCreatePlan} className="button-create">
                      New Plan
                    </button>
                  </>
                ) : // A !O C
                s.Task_state === "open" &&
                  sessionStorage.getItem("username") === "admin" &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Open
                  }) === false &&
                  userPermission.some(function (e, i) {
                    return e.App_permit_Create
                  }) ? (
                  <>
                    <div className="buttons">
                      <div className="action_btn">
                        <button onClick={onOpenApp} className="button-create action_btn btn-left">
                          New App
                        </button>
                        <button onClick={onOpenEditApp} className="button-create action_btn btn-right">
                          Edit App
                        </button>{" "}
                      </div>
                    </div>
                    <br></br>
                    <button onClick={onOpenTask} className="button-create">
                      New Task
                    </button>
                  </>
                ) : (
                  ""
                )
              }
            </div>
          )
        })}
      </div>
      {/* <button onClick={() => getTasks()}>TEst </button> */}
      <CreateNewAppWindow open={openApp} onClose={onCloseApp} />
      <CreateNewTaskWindow open={openTask} onClose={onCloseTask} userPermission={userPermission} items={items} setItems={setItems} />
      <EditAppWindow open={openEditApp} onClose={onCloseEditApp} />
      <CreateNewPlanWindow open={openCreatePlan} onClose={onCloseCreatePlan} userPermission={userPermission} />
      <AssignPlanWindow open={openAssignPlan} onClose={onCloseAssignPlan} userPermission={userPermission} />
    </DndProvider>

    // </>
  )
}

export default Home

// getTasks={refresh}
