const db = require("../db.js");
const Lesson = require("./lesson");
const Unit = require("./unit");

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


describe('findOne', function () {
  test("works", async function () {
    const unitIdRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
    const unitId = unitIdRes.rows[0].id;
    const idRes = await db.query(`SELECT id FROM lessons WHERE title='1L1'`);
    const id = idRes.rows[0].id;
    let lesson = await Lesson.findOne(id);

    expect(lesson).toEqual({id:id, title:'1L1', unitId: unitId, lessonOrder: 1, lessonType:"video", lessonURL:"asjd"});
  })

  test("throws Error when can't find course", async function() {
      try {
          await Lesson.findOne(-1);
          fail();
      }catch (err){
          expect(err.message).toEqual('could not find lesson')
      }
  })
});

/************************************** create */

describe('create', function () {
    test("works", async function() {
      const idRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
      const id = idRes.rows[0].id;
      const data = {
        title: 'newLesson',
        unitId: id,
        lessonOrder: 3,
        lessonType: 'video',
        lessonURL: 'new.com'
      }
      const newLesson = await Lesson.create(data);
      const lessons = await Unit.lessons(id);
      expect(newLesson).toEqual(
        {
            id: expect.any(Number),
            title: 'newLesson',
            unitId: id,
            lessonOrder: 3,
            lessonType: 'video',
            lessonURL: 'new.com'
        }
      )
      expect(lessons).toEqual(expect.arrayContaining(
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
              title: 'newLesson',
              lessonOrder: 3,
              lessonType: 'video',
              lessonURL: 'new.com'
            },
            {
              id: expect.any(Number),
              title: '1L3',
              lessonOrder: 4,
              lessonType: 'video',
              lessonURL: 'asjd'
            },
            {
              id: expect.any(Number),
              title: '1L4',
              lessonOrder: 5,
              lessonType: 'video',
              lessonURL: 'asjd'
            },
            {
              id: expect.any(Number),
              title: '1L5',
              lessonOrder: 6,
              lessonType: 'video',
              lessonURL: 'asjd'
            }
          ]
      ))
    })

    test("works with too high lesson order", async function() {
        const idRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const id = idRes.rows[0].id;
        const data = {
          title: 'newLesson',
          unitId: id,
          lessonOrder: 9000,
          lessonType: 'video',
          lessonURL: 'new.com'
        }
        const newLesson = await Lesson.create(data);
        const lessons = await Unit.lessons(id);
        expect(newLesson).toEqual(
          {
              id: expect.any(Number),
              title: 'newLesson',
              unitId: id,
              lessonOrder: 6,
              lessonType: 'video',
              lessonURL: 'new.com'
          }
        )
        expect(lessons).toEqual(expect.arrayContaining(
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
              },
              {
                id: expect.any(Number),
                title: 'newLesson',
                lessonOrder: 6,
                lessonType: 'video',
                lessonURL: 'new.com'
              }
            ]
        ))
      })

    test("works with lessonOrder less than 1", async function() {
        const idRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const id = idRes.rows[0].id;
        const data = {
          title: 'newLesson',
          unitId: id,
          lessonOrder: 0,
          lessonType: 'video',
          lessonURL: 'new.com'
        }
        const newLesson = await Lesson.create(data);
        const lessons = await Unit.lessons(id);
        expect(newLesson).toEqual(
          {
              id: expect.any(Number),
              title: 'newLesson',
              unitId: id,
              lessonOrder: 1,
              lessonType: 'video',
              lessonURL: 'new.com'
          }
        )
        expect(lessons).toEqual(expect.arrayContaining(
          [
              {
                id: expect.any(Number),
                title: 'newLesson',
                lessonOrder: 1,
                lessonType: 'video',
                lessonURL: 'new.com'
              },
              {
                id: expect.any(Number),
                title: '1L1',
                lessonOrder: 2,
                lessonType: 'video',
                lessonURL: 'asjd'
              },
              {
                id: expect.any(Number),
                title: '1L2',
                lessonOrder: 3,
                lessonType: 'video',
                lessonURL: 'asjd'
              },
              {
                id: expect.any(Number),
                title: '1L3',
                lessonOrder: 4,
                lessonType: 'video',
                lessonURL: 'asjd'
              },
              {
                id: expect.any(Number),
                title: '1L4',
                lessonOrder: 5,
                lessonType: 'video',
                lessonURL: 'asjd'
              },
              {
                id: expect.any(Number),
                title: '1L5',
                lessonOrder: 6,
                lessonType: 'video',
                lessonURL: 'asjd'
              }
            ]
        ))
      })

    test("throws error when invalid course_id", async function() {
        const data = {
            title: 'newLesson',
            unit_id: -1,
            lessonOrder: 3,
            lessonType: 'video',
            lessonURL: 'new.com'
          }
        try{
            const newLesson = await Lesson.create(data);
            fail();
        }catch (err){
            expect(err.message).toEqual('could not find unit')
        }
    })
})

/************************************** remove */

describe('remove', function() {
    test('works', async function() {
        const res = await db.query(`SELECT id, unit_id AS "unitId" FROM lessons WHERE title='1L3'`);
        const id =  res.rows[0].id;
        const unitId = res.rows[0].unitId;
        await Lesson.remove(id);
        const lessons = await Unit.lessons(unitId);
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
                  title: '1L4',
                  lessonOrder: 3,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L5',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                }
              ]
        )
    })

    test('throws error when invalid lesson id', async function() {
        try{
            const result = await Lesson.remove(-1);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find lesson')
        }
    })
})

/************************************** update */

describe('update', function() {
    test('works without order change', async function() {
        const res = await db.query(`SELECT id, unit_id AS "unitId" FROM lessons WHERE title='1L4'`);
        const id =  res.rows[0].id;
        const unitId = res.rows[0].unitId;
        const data = {
            title:'newTitle',
            lessonOrder: 4,
            lessonURL: 'new.com'
        }
        const result = await Lesson.update(id, data);
        const lessons = await Unit.lessons(unitId);
        expect(result).toEqual({
            id:id,
            title:'newTitle',
            unitId:unitId,
            lessonOrder: 4,
            lessonType: 'video',
            lessonURL:'new.com'
        })
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
                  id: id,
                  title: 'newTitle',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'new.com'
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

    test('works with order change', async function() {
        const res = await db.query(`SELECT id, unit_id as "unitId" FROM lessons WHERE title='1L4'`);
        const id =  res.rows[0].id;
        const unitId = res.rows[0].unitId;
        const data = {
            title:'newTitle',
            lessonOrder: 1,
            lessonURL: 'new.com'
        }
        const result = await Lesson.update(id, data);
        const lessons = await Unit.lessons(unitId);
        expect(result).toEqual({
            id:id,
            title:'newTitle',
            unitId:unitId,
            lessonOrder: 1,
            lessonType: 'video',
            lessonURL:'new.com'
        })
        expect(lessons).toEqual(expect.arrayContaining(
            [
                {
                  id: id,
                  title: 'newTitle',
                  lessonOrder: 1,
                  lessonType: 'video',
                  lessonURL: 'new.com'
                },
                {
                  id: expect.any(Number),
                  title: '1L1',
                  lessonOrder: 2,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L2',
                  lessonOrder: 3,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L3',
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
        ))
    })

    test('works with too high lessonOrder', async function() {
        const res = await db.query(`SELECT id, unit_id as "unitId" FROM lessons WHERE title='1L4'`);
        const id =  res.rows[0].id;
        const unitId = res.rows[0].unitId;
        const data = {
            title:'newTitle',
            lessonOrder: 70,
            lessonURL: 'new.com'
        }
        const result = await Lesson.update(id, data);
        const lessons = await Unit.lessons(unitId);
        expect(result).toEqual({
            id:id,
            title:'newTitle',
            unitId:unitId,
            lessonOrder: 5,
            lessonType: 'video',
            lessonURL:'new.com'
        })
        expect(lessons).toEqual(expect.arrayContaining(
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
                  title: '1L5',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                    id: id,
                    title: 'newTitle',
                    lessonOrder: 5,
                    lessonType: 'video',
                    lessonURL: 'new.com'
                }
              ]
        ))
    })

    test('works with lessonOrder less than 1', async function() {
        const res = await db.query(`SELECT id, unit_id as "unitId" FROM lessons WHERE title='1L4'`);
        const id =  res.rows[0].id;
        const unitId = res.rows[0].unitId;
        const data = {
            title:'newTitle',
            lessonOrder: -5,
            lessonURL: 'new.com'
        }
        const result = await Lesson.update(id, data);
        const lessons = await Unit.lessons(unitId);
        expect(result).toEqual({
            id:id,
            title:'newTitle',
            unitId:unitId,
            lessonOrder: 1,
            lessonType: 'video',
            lessonURL:'new.com'
        })
        expect(lessons).toEqual(expect.arrayContaining(
            [
                {
                  id: id,
                  title: 'newTitle',
                  lessonOrder: 1,
                  lessonType: 'video',
                  lessonURL: 'new.com'
                },
                {
                  id: expect.any(Number),
                  title: '1L1',
                  lessonOrder: 2,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L2',
                  lessonOrder: 3,
                  lessonType: 'video',
                  lessonURL: 'asjd'
                },
                {
                  id: expect.any(Number),
                  title: '1L3',
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
        ))
    })

    test('throws error if invalid lesson id', async function() {
        const data = {
            title:'newTitle',
            lessonOrder: 1,
            lessonURL: 'new.com'
        }
        try{
            const result = await Lesson.update(-1, data);
            fail();
        }catch (err){
            expect(err.message).toEqual('could not find lesson')
        }
    })
})