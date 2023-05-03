/** Routes for courses. */

const jsonschema = require("jsonschema");

const express = require("express");

const courseUpdateSchema = require("../schemas/courseUpdateSchema.json")
const courseNewSchema = require("../schemas/courseNewSchema.json")
const { ensureLoggedIn } = require("../middleware/auth");
const Course = require("../models/course");

const router = new express.Router();

/** POST / { course } =>  { course }
 *
 * company should be { title, creatorUsername, about }
 *
 * Returns { id, title, creatorUsername, about }
 *
 * Authorization required: logged in as creatorUsername
 */

router.post("/", ensureLoggedIn, async function (req, res, next) {
    try{
        if (res.locals.user.username !== req.body.creatorUsername ) throw {message: "must be logged in as creator", status:401}
        const validator = jsonschema.validate(req.body, courseNewSchema);
        if(!validator.valid){
            throw {message: 'BAD JSON REQUEST', status:400}
        }

        const course = await Course.create(req.body);
        return res.status(201).json({ course });

    }catch(err){
        return next(err)
    }
})

/** GET /  =>
 *   { courses: [ { id, title, creatorUsername, about }, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
    try{
        const courses = await Course.findAll()
        return res.json({"courses": courses})
    }catch(err){
        return next(err)
    }
})

/** GET /[id]  =>  { course }
 *
 *  Company is { id, title, creatorUsername, about, units }
 *   where units is [{id, title, unitOrder}, ...]
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
    try{
        const course = await Course.findOne(req.params.id);
        const units = await Course.units(req.params.id);
        course.units = units;
        return res.json({ course });
    }catch(err){
        return next(err)
    }
})

/** PATCH /[id] { fld1, fld2, ... } => { course }
 *
 * Patches company data.
 *
 * fields can be: { title, about }
 *
 * Returns { id, title, creatorUsername, about }
 *
 * Authorization required: logged in as creatorUsername
 */

router.patch("/:id", ensureLoggedIn, async function (req, res, next) {
    try{
        const course = await Course.findOne(req.params.id);
        if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}
        const validator = jsonschema.validate(req.body, courseUpdateSchema);
        if(!validator.valid){
            throw {message: 'BAD JSON REQUEST', status:400}
        }
        const updatedCourse = await Course.update(req.params.id,req.body)
        return res.json({ "course" : updatedCourse })
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
      const course = await Course.findOne(req.params.id);
      if (res.locals.user.username !== course.creatorUsername ) throw {message: "must be logged in as creator", status:401}
      await Course.remove(req.params.id);
      return res.json({ deleted: req.params.id });
    } catch (err) {
      return next(err);
    }
});



module.exports = router;