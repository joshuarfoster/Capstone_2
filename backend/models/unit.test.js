const db = require("../db.js");
const Unit = require("./unit")
const Course = require("./course");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll
} = require("./_testCommon.js");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** findOne */


describe('findOne', function () {
    test("works", async function () {
      const courseIdRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
      const courseId = courseIdRes.rows[0].id;
      const idRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
      const id = idRes.rows[0].id;
      let unit = await Unit.findOne(id);
  
      expect(unit).toEqual({id:id, title:'1U1', courseId: courseId, unitOrder: 1});
    })

    test("throws Error when can't find course", async function() {
        try {
            await Unit.findOne(-1);
            fail();
        }catch (err){
            expect(err.message).toEqual('could not find unit')
        }
    })
  });

/************************************** create */

describe('create', function () {
    test("works", async function() {
      const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
      const id = idRes.rows[0].id;
      const data = {
        title: 'newUnit',
        courseId: id,
        unitOrder: 3
      }
      const newUnit = await Unit.create(data);
      const units = await Course.units(id);
      expect(newUnit).toEqual(
        {
            id: expect.any(Number),
            title: 'newUnit',
            courseId: id,
            unitOrder: 3
        }
      )
      expect(units).toEqual(
        [
            { id: expect.any(Number), title: '1U1', unitOrder: 1 },
            {  id: expect.any(Number), title: '1U2', unitOrder: 2 },
            {  id: expect.any(Number), title: 'newUnit', unitOrder: 3 },
            {  id: expect.any(Number), title: '1U3', unitOrder: 4 },
            {  id: expect.any(Number), title: '1U4', unitOrder: 5 },
            {  id: expect.any(Number), title: '1U5', unitOrder: 6 }
        ]
      )
    })

    test("works with too high unitOrder", async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        const data = {
          title: 'newUnit',
          courseId: id,
          unitOrder: 500
        }
        const newUnit = await Unit.create(data);
        const units = await Course.units(id);
        expect(newUnit).toEqual(
          {
              id: expect.any(Number),
              title: 'newUnit',
              courseId: id,
              unitOrder: 6
          }
        )
        expect(units).toEqual(
          [
              { id: expect.any(Number), title: '1U1', unitOrder: 1 },
              {  id: expect.any(Number), title: '1U2', unitOrder: 2 },
              {  id: expect.any(Number), title: '1U3', unitOrder: 3 },
              {  id: expect.any(Number), title: '1U4', unitOrder: 4 },
              {  id: expect.any(Number), title: '1U5', unitOrder: 5 },
              {  id: expect.any(Number), title: 'newUnit', unitOrder: 6 }
          ]
        )
      })

    test("works with too high unitOrder", async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        const data = {
          title: 'newUnit',
          courseId: id,
          unitOrder: 0
        }
        const newUnit = await Unit.create(data);
        const units = await Course.units(id);
        expect(newUnit).toEqual(
          {
              id: expect.any(Number),
              title: 'newUnit',
              courseId: id,
              unitOrder: 1
          }
        )
        expect(units).toEqual(
          [
              {  id: expect.any(Number), title: 'newUnit', unitOrder: 1 },
              {  id: expect.any(Number), title: '1U1', unitOrder: 2 },
              {  id: expect.any(Number), title: '1U2', unitOrder: 3 },
              {  id: expect.any(Number), title: '1U3', unitOrder: 4 },
              {  id: expect.any(Number), title: '1U4', unitOrder: 5 },
              {  id: expect.any(Number), title: '1U5', unitOrder: 6 },
          ]
        )
      })

    test("throws error when invalid courseId", async function() {
        const data = {
            title:'newUnit',
            courseId: -1,
            unitOrder: 3
        }
        try{
            const newUnit = await Unit.create(data);
            fail();
        }catch (err){
            expect(err.message).toEqual('could not find course')
        }
    })
})

/************************************** remove */

describe('remove', function () {
    test('works', async function() {
        const res = await db.query(`SELECT id, course_id AS "courseId" FROM units WHERE title='1U2'`);
        const id = res.rows[0].id;
        const courseId = res.rows[0].courseId;
        const remRes = await Unit.remove(id);
        const units = await Course.units(courseId);
        expect(units).toEqual(
            [
                { id: expect.any(Number), title: '1U1', unitOrder: 1 },
                { id: expect.any(Number), title: '1U3', unitOrder: 2 },
                { id: expect.any(Number), title: '1U4', unitOrder: 3 },
                { id: expect.any(Number), title: '1U5', unitOrder: 4 }
            ]
        )
    })

    test('throws error when cant find unit', async function() {
        try{
            const remRes = await Unit.remove(-1);
        }catch(err){
            expect(err.message).toEqual('could not find unit')
        }
    })
})

/************************************** update */

describe('update', function (){
    test('works without order change', async function() {
        const res = await db.query(`SELECT id, course_id AS "courseId" FROM units WHERE title='1U2'`);
        const id = res.rows[0].id;
        const courseId = res.rows[0].courseId;
        const data = {
            title: 'NewTitle',
            unitOrder: 2
        }
        const result = await Unit.update(id,data);
        const units = await Course.units(courseId)
        expect(result).toEqual({
            id: id,
            title: 'NewTitle',
            courseId: courseId,
            unitOrder: 2
        })
        expect(units).toEqual(
            [
                { id: expect.any(Number), title: '1U1', unitOrder: 1 },
                { id: expect.any(Number), title: 'NewTitle', unitOrder: 2 },
                { id: expect.any(Number), title: '1U3', unitOrder: 3 },
                { id: expect.any(Number), title: '1U4', unitOrder: 4 },
                { id: expect.any(Number), title: '1U5', unitOrder: 5 }
            ]
        )

    })

    test('works with order change', async function () {
        const res = await db.query(`SELECT id, course_id AS "courseId" FROM units WHERE title='1U2'`);
        const id = res.rows[0].id;
        const courseId = res.rows[0].courseId;
        const data = {
            title: 'NewTitle',
            unitOrder: 3
        }
        const result = await Unit.update(id,data);
        const units = await Course.units(courseId)
        expect(result).toEqual({
            id: id,
            title: 'NewTitle',
            courseId: courseId,
            unitOrder: 3
        })
        expect(units).toEqual(
            [
                { id: expect.any(Number), title: '1U1', unitOrder: 1 },
                { id: expect.any(Number), title: '1U3', unitOrder: 2 },
                { id: expect.any(Number), title: 'NewTitle', unitOrder: 3 },
                { id: expect.any(Number), title: '1U4', unitOrder: 4 },
                { id: expect.any(Number), title: '1U5', unitOrder: 5 }
            ]
        )
    })

    test('works with partial data', async function () {
        const res = await db.query(`SELECT id, course_id AS "courseId" FROM units WHERE title='1U2'`);
        const id = res.rows[0].id;
        const courseId = res.rows[0].courseId;
        const data = {
            unitOrder: 4
        }
        const result = await Unit.update(id,data);
        const units = await Course.units(courseId)
        expect(result).toEqual({
            id: id,
            title: '1U2',
            courseId: courseId,
            unitOrder: 4
        })
        expect(units).toEqual(
            [
                { id: expect.any(Number), title: '1U1', unitOrder: 1 },
                { id: expect.any(Number), title: '1U3', unitOrder: 2 },
                { id: expect.any(Number), title: '1U4', unitOrder: 3 },
                { id: expect.any(Number), title: '1U2', unitOrder: 4 },
                { id: expect.any(Number), title: '1U5', unitOrder: 5 }
            ]
        )
    })

    test('works with unitOrder higher than amount of units', async function () {
        const res = await db.query(`SELECT id, course_id AS "courseId" FROM units WHERE title='1U2'`);
        const id = res.rows[0].id;
        const courseId = res.rows[0].courseId;
        const data = {
            unitOrder: 500
        }
        const result = await Unit.update(id,data);
        const units = await Course.units(courseId)
        expect(result).toEqual({
            id: id,
            title: '1U2',
            courseId: courseId,
            unitOrder: 5
        })
        expect(units).toEqual(
            [
                { id: expect.any(Number), title: '1U1', unitOrder: 1 },
                { id: expect.any(Number), title: '1U3', unitOrder: 2 },
                { id: expect.any(Number), title: '1U4', unitOrder: 3 },
                { id: expect.any(Number), title: '1U5', unitOrder: 4 },
                { id: expect.any(Number), title: '1U2', unitOrder: 5 }
            ]
        )
    })

    test('works with unitOrder lower than 1', async function () {
        const res = await db.query(`SELECT id, course_id AS "courseId" FROM units WHERE title='1U2'`);
        const id = res.rows[0].id;
        const courseId = res.rows[0].courseId;
        const data = {
            unitOrder: -2
        }
        const result = await Unit.update(id,data);
        const units = await Course.units(courseId)
        expect(result).toEqual({
            id: id,
            title: '1U2',
            courseId: courseId,
            unitOrder: 1
        })
        expect(units).toEqual(
            [
                { id: expect.any(Number), title: '1U2', unitOrder: 1 },
                { id: expect.any(Number), title: '1U1', unitOrder: 2 },
                { id: expect.any(Number), title: '1U3', unitOrder: 3 },
                { id: expect.any(Number), title: '1U4', unitOrder: 4 },
                { id: expect.any(Number), title: '1U5', unitOrder: 5 }
            ]
        )
    })

    test('throws error when cant find unit', async function() {
        const data = {
            title: 'NewTitle',
            unitOrder: 4
        }
        try{
            const result = await Unit.update(-1,data);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find unit')
        }
    })
})

/************************************** lessons */

describe('lessons', function() {
    test('works', async function() {
        const res = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const id = res.rows[0].id;
        const lessons = await Unit.lessons(id)
        expect(lessons).toEqual(
            [
                {
                  id: expect.any(Number),
                  title: '1L1',
                  lessonOrder: 1,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L2',
                  lessonOrder: 2,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L3',
                  lessonOrder: 3,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L4',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L5',
                  lessonOrder: 5,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                }
              ]
        )
    })

    test("throws error when can't find unit", async function() {
        try{
            const result = await Unit.lessons(-1);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find unit')
        }
    })
})