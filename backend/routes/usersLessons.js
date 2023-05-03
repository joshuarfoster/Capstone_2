/** Routes for usersLessons. */

const jsonschema = require("jsonschema");

const express = require("express");

const userLessonUpdateSchema = require("../schemas/userLessonUpdateSchema")
const { ensureLoggedIn } = require("../middleware/auth");
const UserLesson = require("../models/user_lesson")


const router = new express.Router();

/** POST /[courseId]  =>  { courseId }
 *
 * Authorization required: logged in
 */

router.post("/:courseId", ensureLoggedIn, async function (req, res, next) {
    try{
        const courseId = await UserLesson.addCourse(res.locals.user.username, req.params.courseId)
        return res.json( courseId )
    }catch(err){
        return next(err)
    }
})

/** Delete /[courseId]  =>  { courseId }
 *
 * Authorization required: logged in
 */

router.delete("/:courseId", ensureLoggedIn, async function (req, res, next) {
    try{
        await UserLesson.removeCourse(res.locals.user.username, req.params.courseId)
        return res.json( {deleted : req.params.courseId} )
    }catch(err){
        return next(err)
    }
})

/** GET /unitdata/[unitId]  =>  { unitData }
 *
 *  UnitData is { lessons}
 *   where lessons is [{id, title, lessonOrder, lessonType, lessonURL, userLessonId, status}, ...]
 *
 * Authorization required:logged in
 */

router.get("/unitdata/:unitId", ensureLoggedIn, async function (req, res, next) {
    try{
        const unitData = await UserLesson.findUnitData(res.locals.user.username,req.params.unitId);
        return res.json( unitData )
    }catch(err){
        return next(err)
    }
})

/** PATCH /[id] { status} => { userLesson }
 *
 * Patches lesson data.
 *
 * Returns { id, lessonId, stat }
 *
 * Authorization required: logged in as userUsername
 */

router.patch("/lessondata/:userLessonId", ensureLoggedIn, async function(req, res, next) {
    try{
        const userLesson = await UserLesson.findOne(req.params.userLessonId)
        const validator = jsonschema.validate(req.body, userLessonUpdateSchema)
        if(!validator.valid){
            throw {message: 'BAD JSON REQUEST', status:400}
        }
        if (res.locals.user.username !== userLesson.userUsername) throw {message: "must be logged in as correct user", status:401}
        const updated = await UserLesson.updateLessonData(req.params.userLessonId,req.body.status)
        return res.json({ "userLesson" : updated })
    }catch(err){
        return next(err)
    }
})

module.exports = router;