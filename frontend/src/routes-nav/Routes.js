import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Homepage from "../homepage/Homepage";
import SignupForm from "../auth/SignUpForm";
import LoginForm from "../auth/LoginForm";
import PrivateRoute from "./PrivateRoute";
import CourseList from "../courses/CourseList"
import CourseDetail from"../courses/CourseDetail"
import Profile from "../profile/Profile.js"

/** Site-wide routes.
 *
 * Parts of site should only be visitable when logged in. Those routes are
 * wrapped by <PrivateRoute>, which is an authorization component.
 *
 * Visiting a non-existant route redirects to the homepage.
 */

function Routes({login, signup}) {
    return (
        <div className="pt-5">
          <Switch>
  
            <Route exact path="/">
              <Homepage />
            </Route>
  
            <Route exact path="/login">
              <LoginForm login={login} />
            </Route>
  
            <Route exact path="/signup">
              <SignupForm signup={signup} />
            </Route>
  
            <PrivateRoute exact path="/courses">
              <CourseList />
            </PrivateRoute>
  
            <PrivateRoute exact path="/courses/:id">
              <CourseDetail />
            </PrivateRoute>
  
            <PrivateRoute exact path="/profile/:username">
              <Profile />
            </PrivateRoute>
  
            <Redirect to="/" />
          </Switch>
        </div>
    );
}

export default Routes;
