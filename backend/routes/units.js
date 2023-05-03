/** Routes for units. */

const jsonschema = require("jsonschema");

const express = require("express");

const unitUpdateSchema = require("../schemas/unitUpdateSchema.json")
const unitNewSchema = require("../schemas/unitNewSchema.json")
const { ensureLoggedIn } = require("../middleware/auth");
const Course = require("../models/course");
const Unit = require("../models/unit");

const router = new express.Router();

/** POST / { unit } =>  { unit }
 *
 * ccourse should be { title, courseId, unitOrder }
 *
 * Returns { id, title, courseId, unitOrder }
 *
 * Authorization required: logged in as creatorUsername of course referenced in course id
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try{
        const validator = jsonschema.validate(req.body, unitNewSchema);
        if(!validator.valid){
            throw {message: 'BAD JSON REQUEST', status:400}
        }
        const course = await Course.findOne(req.body.courseId);
        if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}

        const unit = await Unit.create(req.body);
        return res.status(201).json({ unit });

    }catch(err){
        return next(err)
    }
})

/** GET /[id]  =>  { unit }
 *
 *  Unit is { id, title, courseId, unitOrder, lessons }
 *   where lessons is [{id, title, lessonOrder, lessonType, lessonURL}, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
    try{
        const unit = await Unit.findOne(req.params.id);
        const lessons = await Unit.lessons(req.params.id);
        unit.lessons = lessons;
        return res.json({ unit });
    }catch(err){
        return next(err)
    }
})

/** PATCH /[id] { fld1, fld2, ... } => { unit }
 *
 * Patches unit data.
 *
 * fields can be: { title, unitOrder }
 *
 * Returns { id, title, courseId, unitOrder }
 *
 * Authorization required: logged in as creatorUsername
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
    try{
        const unit = await Unit.findOne(req.params.id);
        const course = await Course.findOne(unit.courseId)
        if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}
        const validator = jsonschema.validate(req.body, unitUpdateSchema);
        if(!validator.valid){
            throw {message: 'BAD JSON REQUEST', status:400}
        }
        const updatedUnit = await Unit.update(req.params.id,req.body)
        return res.json({ "unit" : updatedUnit })
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
      const unit = await Unit.findOne(req.params.id)
      const course = await Course.findOne(unit.courseId);
      if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}
      await Unit.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
});

module.exports = router;

