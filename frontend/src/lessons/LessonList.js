import React, {useContext, useState, useEffect} from "react";
import LessonCard from "./LessonCard";
import LessonProgressCard from "./LessonProgressCard"
import CourseContext from "../courses/CourseContext";
import YouTeachApi from "../api/api";
import "./LessonList.css"
/** Show list of Lesson cards.
 *
 * Used by UnitCard to list lessons.
 *
 * UnitCard -> LessonList -> LessonCard or AddedLessonCard
 *
 */
// { lessons, changeLessonStatus, removeLesson, changeLessonTitle, lessonChangeActive, lessonChangeId, setChangeLessonOrderActive, cancelChangeLessonOrder, changeLessonOrder}


function LessonList({ unitId }) {

  const [lessons, setLessons] = useState(null);
  const [lessonsLoaded, setLessonsLoaded]=useState(false)
  const [lessonChangeActive, setLessonChangeActive] = useState(false);
  const [lessonChangeId, setLessonChangeId] = useState(null);
  const [toggler, setToggler] =useState (true)
  const [formActive, setFormActive] = useState(false)
  const [formData, setFormData] =useState({
    title: '',
    lessonURL: ''
  })


  const added = useContext(CourseContext).added
  const created = useContext(CourseContext).created

  useEffect(function loadLessons() {
    async function getLessons() {
      try{
        if(!added){
          setLessonsLoaded(false)
          const unit = await YouTeachApi.getUnit(unitId);
          const lessonList = unit.lessons;
          setLessons(lessonList)
          setLessonsLoaded(true)
        }else{
          setLessonsLoaded(false)
          const unitData = await YouTeachApi.getUnitData(unitId);
          setLessons(unitData)
          setLessonsLoaded(true)
        }
      }catch(err) {
        console.error(`Failed to retrieve lessons`, err)
      }
    }
    getLessons()
  }, [added, toggler, unitId])

  function setChangeLessonOrderActive(id){
    setLessonChangeId(id);
    setLessonChangeActive(true)
  }

  function cancelChangeLessonOrder(){
    setLessonChangeId(null);
    setLessonChangeActive(false);
  }

  async function changeLessonOrder(order){
    await YouTeachApi.updateLesson(lessonChangeId, {lessonOrder : order});
    if(!added){
      const unit = await YouTeachApi.getUnit(unitId);
      const lessonList = unit.lessons;
      setLessons(lessonList);
      setLessonChangeId(null);
      setLessonChangeActive(false)
    }else{
      const unitData = await YouTeachApi.getUnitData(unitId);
      setLessons(unitData)
      setLessonChangeId(null);
      setLessonChangeActive(false)
    }
  }

  async function changeLessonStatus(id, status){
    try{
      await YouTeachApi.updateLessonProgress(id, {"status":status});
      const tempList = [...lessons];
      const lesson = tempList.find(obj => obj.userLessonId === id);
      const updatedLesson = {...lesson, status:status};
      const idx = tempList.indexOf(lesson);
      tempList[idx] = updatedLesson;
      setLessons(tempList)
    }catch(err){
      console.error('Failed to Update Lesson Status', err)
    }
  }


  async function removeLesson(id, order){
    try{
      await YouTeachApi.deleteLesson(id);
      setLessons(lessons.filter(lesson => lesson.id !== id).map(lesson => {
        if(lesson.lessonOrder > order){
          return { ...lesson, lessonOrder: lesson.lessonOrder - 1 };
        }else{
          return lesson;
        }
      }))
    }catch(err){
      console.error('Failed to remove lesson', err)
    }
  }

  
  async function changeLessonTitle (id, title){
    await YouTeachApi.updateLesson(id, {title:title});
    setLessons(lessons.map((lesson) => {
      if(lesson.id === id) {
        return {...lesson, title: title}
      }else{
        return lesson
      }
    }))
  }
  
  async function addLesson (title, lessonURL) {
    const data = {
      "title" : title,
      "unitId" : unitId,
      "lessonOrder" : lessons.length + 1,
      "lessonType" : "video",
      "lessonURL" : lessonURL
    };
    const lesson = await YouTeachApi.createLesson(data);
    if(!added){
      setLessons([...lessons, lesson]);
    }else{
      if(toggler){
        setToggler(false)
      }else{
        setToggler(true)
      }
    }
  }

  function handleMakeLesson(e){
    e.preventDefault();
    addLesson(formData.title, formData.lessonURL);
    setFormActive(false)
  }

  function handleActivateForm(e){
    e.preventDefault();
    setFormActive(true);
  }
  
  function handleCancel(e){
    e.preventDefault(e);
    setFormActive(false);
    setFormData({
      title:'',
      lessonURL:''
    })
  }

  function handleChange (e) {
    const {name, value} = e.target;
    setFormData(fData => ({
      ...fData,
      [name]:value
    }))
  }

  if(!lessons){
    return(<div>Loading Lessons</div>)
  }

  if(!added){
    return (
        <div className="LessonList">
          {lessons.map(lesson => (
              <LessonCard
                  key={lesson.id}
                  id={lesson.id}
                  title={lesson.title}
                  order={lesson.lessonOrder}
                  url={lesson.lessonURL}
                  removeLesson={removeLesson}
                  changeLessonTitle={changeLessonTitle}
                  lessonChangeActive={lessonChangeActive}
                  lessonChangeId={lessonChangeId}
                  setChangeLessonOrderActive={setChangeLessonOrderActive}
                  cancelChangeLessonOrder = {cancelChangeLessonOrder}
                  changeLessonOrder ={changeLessonOrder}
              />
          ))}
          {created && !formActive && <button type="button" onClick={handleActivateForm} className="btn btn-success">+</button>}
          {created && formActive &&<form onSubmit={handleMakeLesson} className="formGroup">
          <label>Title</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            />
          <label>Lesson URL</label>
          <input
            name="lessonURL"
            className="form-control"
            value={formData.lessonURL}
            onChange={handleChange}
            />
            <button type = "submit" className = "btn btn-primary">Submit</button>
            <button className = "btn btn-danger" onClick={handleCancel}>Cancel</button>
          </form>}
        </div>
    );
  }
  else{
    return (
      <div className="LessonList">
        {lessons.map(lesson => (
            <LessonProgressCard
                key={lesson.userLessonId}
                id={lesson.userLessonId}
                lessonId={lesson.id}
                status={lesson.status}
                title={lesson.title}
                order={lesson.lessonOrder}
                url={lesson.lessonURL}
                changeLessonStatus={changeLessonStatus}
                removeLesson={removeLesson}
                changeLessonTitle={changeLessonTitle}
                lessonChangeActive={lessonChangeActive}
                lessonChangeId={lessonChangeId}
                setChangeLessonOrderActive={setChangeLessonOrderActive}
                cancelChangeLessonOrder = {cancelChangeLessonOrder}
                changeLessonOrder ={changeLessonOrder}
            />
        ))}
        {created && !formActive && <button type="button" onClick={handleActivateForm} className="btn btn-success">+</button>}
        {created && formActive &&<form onSubmit={handleMakeLesson} className="formGroup">
          <label>Title</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            />
          <label>Lesson URL</label>
          <input
            name="lessonURL"
            className="form-control"
            value={formData.lessonURL}
            onChange={handleChange}
            />
            <button type = "submit" className = "btn btn-primary">Submit</button>
            <button className = "btn btn-danger" onClick={handleCancel}>Cancel</button>
          </form>}
      </div>
    );
  }
}

export default LessonList;
