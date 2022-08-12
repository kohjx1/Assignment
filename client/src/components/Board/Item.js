import React, { Fragment, useState, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import Window from "./Window"
import ITEM_TYPE from "../../data/types"

const Item = ({ item, index, moveItem, status }) => {
  const ref = useRef(null)

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    hover(item, monitor) {
      if (!ref.current) {
        return
      }

      // when click on certain item, id is tagged to dragindex
      const dragIndex = item.index
      // hovering over index position
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoveredRect = ref.current.getBoundingClientRect()
      // get middle position of box column
      const hoverMiddleY = (hoveredRect.bottom - hoveredRect.top) / 2

      const mousePosition = monitor.getClientOffset()

      const hoverClientY = (mousePosition.y = hoveredRect.top)

      // if item is halfway over hovering spot, then item will be dropped there
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // change the card position
      moveItem(dragIndex, hoverIndex)
      item.index = hoverIndex
    }
  })

  const [{ isDragging }, drag] = useDrag({
    // spread actual data and the index that is supplied to it
    type: ITEM_TYPE,
    item: { ...item, index },
    collect: monitor => ({
      // monitor when playing around with the screen
      isDragging: monitor.isDragging()
    })
  })

  // state properties for showing modal window on item click
  const [show, setShow] = useState(false)

  const onOpen = () => setShow(true)

  const onClose = () => setShow(false)

  // so that item can be dropped and also dragged
  drag(drop(ref))

  return (
    <Fragment>
      <div ref={ref} style={{ opacity: isDragging ? 0 : 1 }} className={"item"} onClick={onOpen}>
        <div className={"color-bar"} style={{ backgroundColor: status.color }} />
        <p className={"item-app"}>{item.Task_app_Acronym}</p>
        <p className={"item-title"}>{item.Task_name}</p>
        <p className={"item-status"}>{item.icon}</p>
      </div>
      <Window item={item} onClose={onClose} show={show} />
    </Fragment>
  )
}

export default Item
