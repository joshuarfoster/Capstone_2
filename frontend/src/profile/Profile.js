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
    const [loaded, setLoaded] = useState(false)

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

    return (
        <>
        <h1>{loaded && user.username}</h1>
        <div className="courses-container">
            <div className="created-courses">
                <h3>Created Courses:</h3>
                {loaded && (
                    <div className="card-container">
                        <CourseList courses={createdCourses}/>
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