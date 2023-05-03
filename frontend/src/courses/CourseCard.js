import React, {useContext, useState} from "react";
import { Link } from "react-router-dom";
import UserContext from "../auth/UserContext";
import EditCourseForm from "./EditCourseForm"

import "./CourseCard.css";

/** Show limited information about a course
 *
 * Is rendered by CourseList to show a "card" for each course.
 *
 * CourseList -> CourseCard
 */

function CourseCard({ id, title, creatorUsername, about, removeCourseatCourseList, changeCourseatCourseList }) {

    const hasAddedCourse = useContext(UserContext).hasAddedCourse;
    const hasCreatedCourse = useContext(UserContext).hasCreatedCourse;
    const startCourse = useContext(UserContext).startCourse;
    const stopCourse = useContext(UserContext).stopCourse;

    const [formActive, setFormActive]  = useState(false)
    const [isAdded,setIsAdded] = useState(hasAddedCourse(id));
    const isCreated = hasCreatedCourse(id)

    async function handleStart(e) {
        e.preventDefault();
        await startCourse(id);
        setIsAdded(true);
    }

    async function handleStop(e) {
        e.preventDefault();
        await stopCourse(id);
        setIsAdded(false);
    }

    async function handleRemove(e) {
      e.preventDefault();
      await removeCourseatCourseList(id);
    }

    function activateForm(e) {
      e.preventDefault();
      setFormActive(true)
    }

  return (
    <div>
      <Link className="CourseCard card" to={`/courses/${id}`}>
        <div className="card-body">
          <h6 className="card-title">
            {title}
          </h6>
          <p><small>{about}</small></p>
          <p><small>Created by: {hasCreatedCourse(id) ? ('you'): creatorUsername}</small></p>
          {isAdded? (
            <button onClick={handleStop} className="btn btn-outline-danger btn-sm">Stop Course</button>
          ) : (
            <button onClick={handleStart} className="btn btn-outline-success btn-sm">Add Course</button>
          )}
          {isCreated && (<button type="button" onClick= {handleRemove} className="btn btn-danger btn-sm">&#128465;</button>)}
          {isCreated && (<button type="button" onClick={activateForm} className="btn btn-outline-secondary btn-sm">&#9999;</button>)}
          
        </div>
      </Link>
      {formActive && <EditCourseForm id={id} title={title} about={about} setActive={setFormActive} changeCourse={changeCourseatCourseList}/>}
    </div>
  );
}

export default CourseCard;
