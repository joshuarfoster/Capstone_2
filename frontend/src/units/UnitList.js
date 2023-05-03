import React, {useState, useContext} from "react";
import UnitCard from "./UnitCard";
import CourseContext from "../courses/CourseContext";
import "./UnitList.css"

/** Show list of Unit cards.
 *
 * Used by CourseDetail to list units.
 *
 * CourseDetail -> UnitList -> UnitCard
 *
 */ 

function UnitList({ activeUnit, makeActive, units, removeUnit, changeUnitTitle, unitChangeActive, unitChangeId, setChangeUnitOrderActive, changeUnitOrder, cancelChangeUnitOrder, makeUnit}) {

  const [formActive, setFormActive] = useState(false);
  const [formTitle, setFormTitle] = useState('');

  const created = useContext(CourseContext).created

  function handleCancel(e) {
    e.preventDefault()
    setFormActive(false)
  }

  function handleActivateForm(e) {
    e.preventDefault()
    setFormActive(true)
  }

  function handleChange(e){
    setFormTitle(e.target.value)
  }

  async function handleMakeUnit(e) {
    e.preventDefault()
    await makeUnit(formTitle)
    setFormActive(false)
  }

  return (
      <div className="list-group unit-card-container">
        {units.map(unit => (
            <UnitCard
                isActive={unit.id === activeUnit}
                makeActive={makeActive}
                key={unit.id}
                id={unit.id}
                title={unit.title}
                order={unit.unitOrder}
                removeUnit={removeUnit}
                changeUnitTitle={changeUnitTitle}
                unitChangeActive={unitChangeActive}
                unitChangeId={unitChangeId}
                setChangeUnitOrderActive={setChangeUnitOrderActive}
                changeUnitOrder={changeUnitOrder}
                cancelChangeUnitOrder={cancelChangeUnitOrder}
            />
        ))}
        {created && !formActive && <button type="button" onClick={handleActivateForm} className="btn btn-success">+</button>}
        {created && formActive &&<form onSubmit={handleMakeUnit} className="formGroup">
          <label>Title</label>
          <input
            name="title"
            className="form-control"
            value={formTitle}
            onChange={handleChange}
            />
            <button type = "submit" className = "btn btn-primary">Submit</button>
            <button className = "btn btn-danger" onClick={handleCancel}>Cancel</button>
          </form>}
      </div>
  );
}

export default UnitList;
