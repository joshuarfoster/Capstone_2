/** Routes for lessons. */

const jsonschema = require("jsonschema");

const express = require("express");

const lessonUpdateSchema = require("../schemas/lessonUpdateSchema.json")
const lessonNewSchema = require("../schemas/lessonNewSchema.json")
const { ensureLoggedIn } = require("../middleware/auth");
const Lesson = require("../models/lesson");
const Unit = require("../models/unit");
const Course = require("../models/course");
const router = new express.Router();

/** POST / { lesson } =>  { lesson }
 *
 * lesson should be { title, unitId, lessonOrder. lessonType, lessonURL }
 *
 * Returns { id, unitId, lessonOrder. lessonType, lessonURL }
 *
 * Authorization required: logged in as creatorUsername
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try{
        const unit = await Unit.findOne(req.body.unitId);
        const course = await Course.findOne(unit.courseId);
        if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}
        const validator = jsonschema.validate(req.body, lessonNewSchema);
        if(!validator.valid){
            throw {message: 'BAD JSON REQUEST', status:400}
        }

        const lesson = await Lesson.create(req.body);
        return res.status(201).json({ lesson });

    }catch(err){
        return next(err)
    }
})

/** PATCH /[id] { fld1, fld2, ... } => { lesson }
 *
 * Patches lesson data.
 *
 * fields can be: { title, lessonOrder, lessonURL }
 *
 * Returns { id, title, lessonOrder, lessonURL }
 *
 * Authorization required: logged in as creatorUsername
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
    try{
        const lesson = await Lesson.findOne(req.params.id)
        const unit = await Unit.findOne(lesson.unitId);
        const course = await Course.findOne(unit.courseId)
        if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}
        const validator = jsonschema.validate(req.body, lessonUpdateSchema);
        if(!validator.valid){
            throw {message: 'BAD JSON REQUEST', status:400}
        }
        const updatedLesson = await Lesson.update(req.params.id,req.body)
        return res.json({ "lesson" : updatedLesson })
    }catch(err){
        return next(err)
    }
})

/** DELETE /[id]  =>  { deleted: id }
 *
 * Authorization: login as creatorUsername
 */

router.delete("/:id", ensureLoggedIn, async function (req, res, next) {
    try {
      const lesson = await Lesson.findOne(req.params.id);
      const unit = await Unit.findOne(lesson.unitId);
      const course = await Course.findOne(unit.courseId);
      if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}
      await Lesson.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
});

module.exports = router;