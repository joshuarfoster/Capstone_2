import React, { useContext, useState, useEffect } from "react";
import "./UnitCard.css";
import LessonList from "../lessons/LessonList";
import UnitEditTitleForm from "./UnitEditTitleForm";
import CourseContext from "../courses/CourseContext";
import YouTeachApi from "../api/api";

/** Show limited information about a unit.
 *
 * Is rendered by UnitList to show a "card" for each unit.
 *
 * UnitList -> UnitCard
 */

function UnitCard({ makeActive, isActive, id, title, order, removeUnit, changeUnitTitle, unitChangeActive, unitChangeId, setChangeUnitOrderActive, changeUnitOrder, cancelChangeUnitOrder}) {

  const [titleFormActive, setTitleFormActive]=useState(false);
  const [isHovered, setIsHovered] = useState(false)
  const [backgroundColor, setBackgroundColor] = useState("transparent");
  const [onClickFunction, setOnClickFunction] = useState(null);
  const [toggler, setToggler] = useState(true)

  const added = useContext(CourseContext).added
  const created = useContext(CourseContext).created

  useEffect(function changeBackgroundColor() {
    if (!unitChangeActive){
      if(isActive){
        setBackgroundColor('gray')
      }else{
        setBackgroundColor('#333')
      }
    }else{
      if(unitChangeId === id){
        if(isHovered){
          setBackgroundColor("red")
        }else {
          setBackgroundColor("pink")
        }
      }else if(isHovered){
        setBackgroundColor("green")
      }else{
        setBackgroundColor("orange")
      }
    }
  }, [isHovered, unitChangeActive, isActive]);

  async function handleChangeOrder(){
    await changeUnitOrder(order)
  }

  function cancelChangeOrder(){
    cancelChangeUnitOrder()
  }

  function handleMakeActive(){
    makeActive(id)
  }

  useEffect(function changeOnClickFunction() {
    if(unitChangeActive){
      if(unitChangeId === id){
        setOnClickFunction(() => cancelChangeOrder);
      }else{
        setOnClickFunction(() => handleChangeOrder);
      }
    }else{
      console.log("UNIT CHANTE ACTIVE", unitChangeActive, id)
      setOnClickFunction(() => handleMakeActive) /// ALARM!!!
    }
  }, [id, unitChangeActive, unitChangeId])



  async function handleRemoveUnit(e){
    try{
      e.preventDefault();
      await removeUnit(id, order);
    }catch(err){
      console.error('Failed to remove unit', err)
    }
  }

  function activateForm(e){
    e.preventDefault();
    setTitleFormActive(true)
  }

  function handleActivateChangeOrder(e){
    e.preventDefault()
    setChangeUnitOrderActive(id)
  }

  return (
    <div>
      <div style={{backgroundColor}} className="UnitCard card dark" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onClickFunction}>
        <div className="card-body">
          <h6 className="card-title">{title}</h6>
          <div className="button-container"> {/* Add a container for the buttons */}
            {!unitChangeActive && created && (
              <button type="button" onClick={handleRemoveUnit} className="btn btn-danger btn-sm">&#128465;</button>
            )}
            {!unitChangeActive && created && (
              <button type="button" onClick={activateForm} className="btn btn-outline-secondary btn-sm">&#9999;</button>
            )}
            {!unitChangeActive && created && (
              <button type="button" onClick={handleActivateChangeOrder} className="btn btn-outline-warning btn-sm">&#8597;</button>
            )}
          </div>
        </div>
      </div>
      {titleFormActive && (<UnitEditTitleForm id={id} title={title} setActive={setTitleFormActive} changeUnitTitle={changeUnitTitle}/>)}
    </div>
  );
}

export default UnitCard