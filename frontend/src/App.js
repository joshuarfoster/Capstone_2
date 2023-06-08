import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import useLocalStorage from "./hooks/useLocalStorage";
import Navigation from "./routes-nav/Navigation";
import Routes from "./routes-nav/Routes";
import YouTeachApi from "./api/api";
import UserContext from "./auth/UserContext";
import jwt from "jsonwebtoken";

// Key name for storing token in localStorage for "remember me" re-login
export const TOKEN_STORAGE_ID = "youteach-token";

/** - infoLoaded: has user data been pulled from API?
 *   
 *
 * - currentUser: user obj from API. This becomes the canonical way to tell
 *   if someone is logged in. This is passed around via context throughout app.
 *
 * - token: for logged in users, this is their authentication JWT.
 *   Is required to be set for most API calls. This is initially read from
 *   localStorage and synced to there via the useLocalStorage hook.
 *
 * App -> Routes
 */


function App() {
  const [infoLoaded, setInfoLoaded] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [currentCourses, setCurrentCourses] = useState(null);
  const [createdCourses, setCreatedCourses] = useState(null);

  console.debug(
      "App",
      "infoLoaded=", infoLoaded,
      "currentUser=", currentUser,
      "token=", token,
  );

  // Load user info from API. Until a user is logged in and they have a token,
  // this should not run. It only needs to re-run when a user logs out, so
  // the value of the token is a dependency for this effect.

  useEffect(function loadUserInfo() {
    console.debug("App useEffect loadUserInfo", "token=", token);

    async function getCurrentUser() {
      if (token) {
        try {
          let { username } = jwt.decode(token);
          // put the token on the Api class so it can use it to call the API.
          YouTeachApi.token = token;
          let currentUser = await YouTeachApi.getUser(username);
          setCurrentUser(currentUser);
          let currCourses = await YouTeachApi.getUserSavedCourses(username);
          setCurrentCourses(new Set(currCourses.map(obj => {
            return obj.id
          })));
          let myCourses = await YouTeachApi.getUserCreatedCourses(username)
          setCreatedCourses(new Set(myCourses.map(obj => {
            return obj.id
          })))
        } catch (err) {
          console.error("App loadUserInfo: problem loading", err);
          setCurrentUser(null);
        }
      }
      setInfoLoaded(true);
    }

    // set infoLoaded to false while async getCurrentUser runs; once the
    // data is fetched (or even if an error happens!), this will be set back
    // to false
    setInfoLoaded(false);
    getCurrentUser();
  }, [token]);

  /** Checks if Course is added by User */
  function hasAddedCourse(id) {
    return currentCourses.has(id)
  }

  /** Checks if Course is added by User */
  function hasCreatedCourse(id) {
    return createdCourses.has(id)
  }

  /** Creates Course for User */
  async function makeCourse(data) {
    try{
      data.creatorUsername = currentUser.username;
      let course = await YouTeachApi.createCourse(data);
      setCreatedCourses(new Set([course.id, ...createdCourses]))
      return course
    }catch (err) {
      console.error("Problem creating course", err);
    }
  }

  /** Adds course to saved courses for User */
  async function startCourse(id) {
    try{
      await YouTeachApi.addCourse(id);
      setCurrentCourses(new Set([id, ...currentCourses]))
    }catch (err) {
      console.error("Problem starting course", err);
    }
  }

   /** Removes Course created by User */
  async function removeCourse(id) {
    try{
      await YouTeachApi.deleteCourse(id)
      setCreatedCourses(new Set([...createdCourses].filter((num) => num !== id)))
    }catch(err){
      console.error("Problem removing course", err);
    }
  }

   /** Removes Course created by User */
  async function stopCourse(id) {
    try{
      await YouTeachApi.removeCourse(id)
      setCurrentCourses(new Set([...currentCourses].filter((num) => num !== id)))
    }catch(err){
      console.error("Problem ending course", err);
    }
  }

  /** Handles site-wide logout. */
  function logout() {
    setCurrentUser(null);
    setToken(null);
  }

  /** Handles site-wide signup.
   *
   * Automatically logs them in (set token) upon signup.
   *
   * Make sure you await this function and check its return value!
   */
  async function signup(signupData) {
    try {
      let token = await YouTeachApi.signup(signupData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("signup failed", errors);
      return { success: false, errors };
    }
  }

  /** Handles site-wide login.
   *
   * Make sure you await this function and check its return value!
   */
  async function login(loginData) {
    try {
      let token = await YouTeachApi.login(loginData);
      setToken(token);
      return { success: true };
    } catch (errors) {
      console.error("login failed", errors);
      return { success: false, errors };
    }
  }

  

  return (
      <BrowserRouter>
        <UserContext.Provider
            value={{ currentUser, setCurrentUser, hasAddedCourse, hasCreatedCourse, makeCourse, removeCourse, startCourse, stopCourse, currentCourses, createdCourses }}>
          <div className="App">
            <Navigation logout={logout} />
            <Routes login={login} signup={signup} />
          </div>
        </UserContext.Provider>
      </BrowserRouter>
  );
}

export default App;

