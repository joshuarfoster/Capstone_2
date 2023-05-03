import React, { useState, useEffect, useContext } from "react";
import { useParams, useHistory } from "react-router-dom";
import YouTeachApi from "../api/api";
import UnitList from "../units/UnitList";
import CourseContext from "./CourseContext";
import UserContext from "../auth/UserContext";
import EditCourseForm from "./EditCourseForm";
import LessonList from "../lessons/LessonList"

/** Course Detail page.
 *
 * Renders information about course, along with the units in that course.
 *
 * Routed at /courses/:id
 *
 * Routes -> CourseDetail -> UnitList
 */

function CourseDetail() {
  const { id } = useParams();

  const history = useHistory()

  const [course, setCourse] = useState(null);
  const [created, setCreated] = useState(null)
  const [added, setAdded] = useState(null)
  const [unitList, setUnitList] = useState(null)
  const [formActive, setFormActive] = useState(false)
  const [unitChangeActive, setUnitChangeActive] = useState(false)
  const [unitChangeId, setUnitChangeId] = useState(null);
  const [activeUnit, setActiveUnit] = useState(null)

  const hasAddedCourse = useContext(UserContext).hasAddedCourse;
  const hasCreatedCourse = useContext(UserContext).hasCreatedCourse;
  const startCourse = useContext(UserContext).startCourse;
  const stopCourse = useContext(UserContext).stopCourse;
  const removeCourse = useContext(UserContext).removeCourse

  const handleUnitClick = (unitId) => {
    setActiveUnit(unitId === activeUnit ? null : unitId);
  };


  useEffect(function getCourseAndUnits() {
    async function getCourse() {
        try {
          const course = await YouTeachApi.getCourse(id);
          setCreated(hasCreatedCourse(parseInt(id)));
          setAdded(hasAddedCourse(parseInt(id)));
          setCourse(course);
          setUnitList(course.units);
        } catch (err) {
          console.error('Failed to retrieve course:', err);
        }
      }
    getCourse();
  }, [id]);


  async function handleStart(e) {
      e.preventDefault();
      await startCourse(parseInt(id));
      setAdded(true);
  }

  async function handleStop(e) {
      e.preventDefault();
      await stopCourse(parseInt(id));
      setAdded(false)
  }

  async function handleRemove(e) {
    e.preventDefault();
    await removeCourse(parseInt(id));
    history.push("/courses")
  };

  function activateForm(e){
    e.preventDefault();
    setFormActive(true)
  }

  async function removeUnit(id, order) {
    await YouTeachApi.deleteUnit(id);
    setUnitList(unitList.filter(unit => unit.id !== id).map(unit => {
      if (unit.unitOrder > order) {
        return { ...unit, unitOrder: unit.unitOrder - 1 };
      } else {
        return unit;
      }
    }));
  }

  async function changeCourseatCourseDetail(id,data){
    await YouTeachApi.updateCourse(id,data);
    setCourse({...course, title: data.title, about: data.about})
  }

  async function changeUnitTitle(id, title){
    await YouTeachApi.updateUnit(id,{title:title})
    setUnitList(unitList.map((unit) => {
      if(unit.id === id) {
        return {...unit, title:title}
      }else{
        return unit
      }
    }))
  }

  async function setChangeUnitOrderActive(id){
    setUnitChangeId(id);
    setUnitChangeActive(true)
  }

  async function cancelChangeUnitOrder(){
    setUnitChangeId(null);
    setUnitChangeActive(false);
  }

  async function changeUnitOrder(order){
    await YouTeachApi.updateUnit(unitChangeId, {unitOrder:order});
    const course = await YouTeachApi.getCourse(id);
    setUnitList(course.units);
    setUnitChangeActive(false);
    setUnitChangeId(null);
  }

  async function makeUnit(title){
    console.log({title: title, unitOrder: unitList.length+1 , courseId: id})
    const unit = await YouTeachApi.createUnit({title: title, unitOrder: unitList.length+1 , courseId: parseInt(id)});
    setUnitList([...unitList, unit]);
  }

return (
    <CourseContext.Provider
        value={{added,created}}>
      <div className="CourseDetail col-md-8 offset-md-2">
        {course && unitList && (
          <>
            <h4>{course.title}</h4>
            {added? (
              <button onClick={handleStop} className="btn btn-outline-danger btn-sm">Stop Course</button>
            ) : (
              <button onClick={handleStart} className="btn btn-outline-success btn-sm">Add Course</button>
            )}
            {created && (<button type="button" onClick= {handleRemove} className="btn btn-danger btn-sm">&#128465;</button>)}
            {created && (<button type="button" onClick={activateForm} className="btn btn-outline-secondary btn-sm">&#9999;</button>)}
            <p>{course.about}</p>
            <p>Created by: {created ? ('you'): course.creatorUsername}</p>
            {formActive && <EditCourseForm id={id} title={course.title} about={course.about} setActive={setFormActive} changeCourse={changeCourseatCourseDetail}/>}
            <UnitList activeUnit={activeUnit} makeActive={handleUnitClick} units={unitList} makeUnit = {makeUnit} removeUnit={removeUnit} changeUnitTitle={changeUnitTitle} unitChangeActive={unitChangeActive} unitChangeId={unitChangeId} setChangeUnitOrderActive={setChangeUnitOrderActive} changeUnitOrder={changeUnitOrder} cancelChangeUnitOrder={cancelChangeUnitOrder}/>
          </>
        )}
        {activeUnit && <LessonList unitId={activeUnit}/>}
      </div>
    </CourseContext.Provider>
  );
}

export default CourseDetail;
