import React, { useState, useEffect, useContext } from "react";
import YouTeachApi from "../api/api";
import CourseCard from "./CourseCard";
import UserContext from "../auth/UserContext"

/** Show list of courses.
 */

function CourseList({courses}) {

    const [courseList, setCourseList] = useState(null)
    const removeCourse = useContext(UserContext).removeCourse


    useEffect(()=>{
        async function getCoursesOnMount () {
            if(!courses){
                let newCourses = await YouTeachApi.getCourses();
                setCourseList(newCourses)
            }else{
                let lst = []
                for(let id of courses){
                    let courseData = await YouTeachApi.getCourse(id);
                    lst.push({
                        "id": courseData.id,
                        "creatorUsername": courseData.creatorUsername,
                        "title": courseData.title,
                        "about": courseData.about
                    });
                }
                setCourseList(lst);
            }
        }
    getCoursesOnMount();
    }, []);

    async function removeCourseatCourseList(id){
        await removeCourse(id);
        setCourseList(courseList.filter(course => course.id !== id))
    }

    async function changeCourseatCourseList(id, data){
        await YouTeachApi.updateCourse(id,data);
        setCourseList(courseList.map((course) => {
            if (course.id === id) {
                return {...course, title : data.title, about: data.about}
            } else {
                return course
            }
        }))
    }

  return (
      <div className="CourseList col-md-8 offset-md-2">
        {courseList && courseList.length
            ? (
                <div className="CourseList-list">
                  {courseList.map(c => (
                      <CourseCard
                          key={c.id}
                          id={c.id}
                          title={c.title}
                          creatorUsername={c.creatorUsername}
                          about={c.about}
                          removeCourseatCourseList={removeCourseatCourseList}
                          changeCourseatCourseList={changeCourseatCourseList}
                      />
                  ))}
                </div>
            ) : (
                <p className="lead">Sorry, no results were found!</p>
            )}
      </div>
  );
}

export default CourseList;
