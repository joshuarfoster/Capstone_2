import React, {useContext, useState,  useEffect} from "react";
import {useParams} from "react-router-dom"
import UserContext from "../auth/UserContext";
import CourseList from "../courses/CourseList";
import YouTeachApi from "../api/api";

import "./Profile.css"

function Profile () {

    const { username } = useParams();
    const [user, setUser] =useState(null);
    const [createdCourses, setCreatedCourses] =useState(null);
    const [savedCourses, setSavedCourses] =useState(null);
    const [loaded, setLoaded] = useState(false);
    const [formActive, setFormActive] = useState(false)
    const [formData, setFormData] =useState({
        title: ''
      })
    

    const makeCourse = useContext(UserContext).makeCourse

    useEffect(()=>{
        async function getUserDataonMount () {
            let usr = await YouTeachApi.getUser(username);
            let crtC = await YouTeachApi.getUserCreatedCourses(username);
            crtC = crtC.map(obj => {
                return Object.values(obj)[0]
            })
            let svdC = await YouTeachApi.getUserSavedCourses(username);
            svdC = svdC.map(obj => {
                return Object.values(obj)[0]
            })
            setUser(usr);
            setCreatedCourses(crtC);
            setSavedCourses(svdC);
            setLoaded(true)
        }
        getUserDataonMount();
    }, [])

    async function createCourse(title){
        const data = {
            "title" : title
        }
        const course = await makeCourse(data)
        setCreatedCourses([...createdCourses, course])
    }
    
    function handleMakeCourse(e){
        e.preventDefault();
        createCourse(formData.title);
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
          title:''
        })
      }

      function handleChange (e) {
        const {name, value} = e.target;
        setFormData(fData => ({
          ...fData,
          [name]:value
        }))
      }

    return (
        <>
        <h1>{loaded && user.username}</h1>
        <div className="courses-container">
            <div className="created-courses">
                <h3>Created Courses:</h3>
                {loaded && (
                    <div className="card-container">
                        <CourseList courses={createdCourses}/>
                        {!formActive && <button type="button" onClick={handleActivateForm} className="btn btn-success">+</button>}
                        {formActive &&<form onSubmit={handleMakeCourse} className="formGroup">
          <label>Title</label>
          <input
            name="title"
            className="form-control"
            value={formData.title}
            onChange={handleChange}
            />
            <button type = "submit" className = "btn btn-primary">Submit</button>
            <button className = "btn btn-danger" onClick={handleCancel}>Cancel</button>
          </form>}
                    </div>)}
            </div>
            <div className="saved-courses">
                <h3>Your Courses:</h3>
                {loaded && (
                    <div className="card-container">
                        <CourseList courses={savedCourses}/>
                    </div>)}
            </div>
        </div>
        </>
    )
}

export default Profile