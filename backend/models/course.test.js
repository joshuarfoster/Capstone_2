const db = require("../db.js");
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
      const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
      const id = idRes.rows[0].id;
      let course = await Course.findOne(id);
  
      expect(course).toEqual({id:expect.any(Number), title:'C1', creatorUsername: 'u1', about: 'About1'});
    })

    test("throws Error when can't find course", async function() {
        try {
            await Course.findOne(-1);
            fail();
        }catch (err){
            expect(err.message).toEqual('could not find course')
        }
    })
  });

/************************************** findAll */

describe('findAll', function () {
    test("works", async function () {
        let courses =  await Course.findAll();
        expect(courses).toEqual(
            [
                { id: expect.any(Number), creatorUsername: 'u1', title: 'C1', about: 'About1' },
                { id: expect.any(Number), creatorUsername: 'u2', title: 'C2', about: 'About2' },
                { id: expect.any(Number), creatorUsername: 'u3', title: 'C3', about: 'About3' }
            ]
        )
    })
})

/************************************** create */

describe('create', function () {
    const newCourse = {
        title: 'newCourse',
        creatorUsername: 'u1',
        about: 'newAbout'
    }
    test('works', async function() {
        let course = await Course.create(newCourse);
        expect(course).toEqual(
            {
                id: expect.any(Number),
                title: 'newCourse',
                creatorUsername: 'u1',
                about: 'newAbout'
            }
        )
        const result = await Course.findOne(course.id);
        expect(result).toEqual(
            {
                id: expect.any(Number),
                title: 'newCourse',
                creatorUsername: 'u1',
                about: 'newAbout'
            }
        )
    })
})
  
/************************************** update */

describe('update', function() {
    test('works', async function() {
      const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
      const id = idRes.rows[0].id;
      const updateData = {
        title : 'NewTitle',
        about : 'hi'
      }
      const course = await Course.update(id, updateData);
      expect(course).toEqual(
        {
            id: id,
            title: 'NewTitle',
            creatorUsername: 'u1',
            about: 'hi'
        }
      )
      const findCourse = await Course.findOne(id);
      expect(findCourse).toEqual(
        {
            id: id,
            title: 'NewTitle',
            creatorUsername: 'u1',
            about: 'hi'
        })
    })

    test('works with partial data', async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        const updateData = {
          about : 'hi'
        }
        const course = await Course.update(id, updateData);
        expect(course).toEqual(
          {
              id: id,
              title: 'C1',
              creatorUsername: 'u1',
              about: 'hi'
          }
        )
        const findCourse = await Course.findOne(id);
        expect(findCourse).toEqual(
          {
              id: id,
              title: 'C1',
              creatorUsername: 'u1',
              about: 'hi'
          })
          
    })

    test('throws errror when cant find course', async function () {
        const updateData = {
            title : 'NewTitle',
            about : 'hi'
          }
        try {
            await Course.update(-1,updateData);
            fail();
        }catch (err){
            expect(err.message).toEqual('could not find course')
        }
    })
})

/************************************** remove */

describe('remove', function() {
    test('works', async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        const remRes = await Course.remove(id)
        try{
            await Course.findOne(id);
            fail();
        }catch (err){
            expect(err.message).toEqual('could not find course')
        }
    })

    test('throws error when cant find course', async function () {
        try{
            const remRes = await Course.remove(-1);
        }catch (err){
            expect(err.message).toEqual('could not find course')
        }
    })
})

/************************************** units */

describe('units', function() {
    test('works', async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        const result = await Course.units(id);
        expect(result).toEqual(
            [
                { id: expect.any(Number), title: '1U1', unitOrder: 1 },
                { id: expect.any(Number), title: '1U2', unitOrder: 2 },
                { id: expect.any(Number), title: '1U3', unitOrder: 3 },
                { id: expect.any(Number), title: '1U4', unitOrder: 4 },
                { id: expect.any(Number), title: '1U5', unitOrder: 5 }
            ]
        )
    })

    test('throws error when cant find course', async function () {
        try{
            const result = await Course.units(-1);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find course')
        }
    })
})