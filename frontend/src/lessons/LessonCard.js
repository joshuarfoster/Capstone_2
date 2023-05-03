import React, { useContext, useState, useEffect } from "react";
import "./LessonCard.css";
import CourseContext from "../courses/CourseContext";
import LessonTitleEditForm from "./LessonTitleEditForm";

/** Show limited information about a lesson.
 *
 * Is rendered by LessonList to show a "card" for each lesson.
 *
 * LessonList -> LessonCard
 */

function LessonCard({ id, title, order, url, removeLesson, changeLessonTitle, lessonChangeActive,lessonChangeId, setChangeLessonOrderActive, cancelChangeLessonOrder, changeLessonOrder}) {

    const [error, setError] = useState(null);
    const [formActive, setFormActive] = useState(false)
    const [isHovered, setIsHovered] = useState(false);
    const [backgroundColor, setBackgroundColor] = useState("transparent");
    const [onClickFunction, setOnClickFunction] = useState(() => {});

    const created = useContext(CourseContext).created

    useEffect(function changeBackgroundColor() {
      if (!lessonChangeActive){
        setBackgroundColor("transparent");
      }else{
        if(lessonChangeId === id){
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
    }, [isHovered, lessonChangeActive]);
  
    async function handleChangeOrder(){
      await changeLessonOrder(order)
    }
  
    function cancelChangeOrder(){
      cancelChangeLessonOrder()
    }
  
    useEffect(function changeOnClickFunction() {
      if(lessonChangeActive){
        if(lessonChangeId === id){
          setOnClickFunction(() => cancelChangeOrder);
        }else{
          setOnClickFunction(() => handleChangeOrder);
        }
      }else{
        setOnClickFunction(() => {})
      }
    }, [id, lessonChangeActive, lessonChangeId])

    function handleRemove (e) {
      e.preventDefault();
      removeLesson(id,order)
    }

    function activateForm (e) {
      e.preventDefault();
      setFormActive(true)
    }

    function handleActivateChangeOrder (e) {
      e.preventDefault();
      setChangeLessonOrderActive(id)
    }
  
    return (
        <div style={{backgroundColor}} className="LessonCard card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} onClick={onClickFunction}>
          <div className="card-body">
            <h6 className="card-title">{title}</h6>
            {!lessonChangeActive && created && (<button type="button" onClick= {handleRemove} className="btn btn-danger btn-sm">&#128465;</button>)}
            {!lessonChangeActive && created && (<button type="button" onClick={activateForm} className="btn btn-outline-secondary btn-sm">&#9999;</button>)}
            {!lessonChangeActive && created && (<button type="button" onClick={handleActivateChangeOrder} className="btn btn-outline-warning btn-sm">&#8597;</button>)}
            {!lessonChangeActive && <iframe 
              width="560" 
              height="315" 
              src={url} 
              title="YouTube video player"  
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
              onError={() => {
                try {
                  new Request(url, { mode: 'no-cors' });
                } catch (error) {
                  setError(error);
                }
              }}
            ></iframe>}
            {!lessonChangeActive && formActive && <LessonTitleEditForm id={id} title={title} setActive={setFormActive} changeTitle={changeLessonTitle}/>}
            {error && <p>Failed to load video</p>}
          </div>
        </div>
    );
  }
  
  export default LessonCard;