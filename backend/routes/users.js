/** Routes for users. */

const jsonschema = require("jsonschema");

const express = require("express");

const { ensureLoggedIn } = require("../middleware/auth");
const User = require("../models/user");

const router = new express.Router();

/** GET /[username]  =>  { user }
 *
 *  user is { username, youtubeAccount, about }
 *
 * Authorization required: none
 */

router.get("/:username", async function (req, res, next) {
    try{
        const user = await User.get(req.params.username);
        return res.json({ user });
    }catch(err){
        return next(err)
    }
})

/** DELETE /[username]  =>  { deleted: username }
 *
 * Authorization: login as username
 */

router.delete("/:username", ensureLoggedIn, async function (req, res, next) {
    try{
        if(res.locals.user.username !== req.params.username) throw {message: "must be logged in as creator", status:401}
        await User.remove(req.params.username);
        return res.json({deleted: req.params.username})
    }catch (err){
        return next(err)
    }
})

/** GET /[username]/savedcourses  =>  { courses: {id, title} ... }
 *
 *
 * Authorization required: login as username
 */

router.get("/:username/savedcourses", ensureLoggedIn, async function (req, res, next) {
    try{
        if(res.locals.user.username !== req.params.username) throw {message: "must be logged in as user", status:401}
        const courses = await User.findSavedCourses(req.params.username);
        return res.json({ courses })
    }catch (err){
        return next(err)
    }
})

/** GET /[username]/createdcourses  =>  { courses: {id, title} ... }
 *
 *
 * Authorization required: none
 */

router.get("/:username/createdcourses", async function (req, res, next) {
    try{
        const courses = await User.findCreatedCourses(req.params.username);
        return res.json({ courses })
    }catch(err){
        return next(err)
    }
})

module.exports = router;
