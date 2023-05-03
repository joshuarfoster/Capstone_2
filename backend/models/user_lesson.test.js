const db = require("../db.js");
const { findAll } = require("./course.js");
const User = require("./user.js");
const User_Lesson = require("./user_lesson")
const Lesson = require("./lesson")
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
    const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title='1L1'`);
    const lessonId = lessonIdRes.rows[0].id;
    const idRes = await db.query(`SELECT id FROM users_lessons WHERE user_username = 'u4' AND lesson_id = $1`,[lessonId]);
    const id = idRes.rows[0].id;
    let userLesson = await User_Lesson.findOne(id);

    expect(userLesson).toEqual({
      id: id,
      userUsername: 'u4',
      courseId: expect.any(Number),
      unitId: expect.any(Number),
      lessonId: lessonId,
      stat: 'complete'
    }
)
  })

  test("throws Error when can't find course", async function() {
      try {
          await User_Lesson.findOne(-1);
          fail();
      }catch (err){
          expect(err.message).toEqual('could not find userLesson')
      }
  })
});

/************************************** addCourse */

describe("addCourse", function() {
    test("works", async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        const result = await User_Lesson.addCourse('u2',id);
        expect(result.courseId).toEqual(id);
        const courseRes = await User.findSavedCourses('u2');
        expect(courseRes).toEqual([ { id: expect.any(Number)} ]);
    })

    test("throws error when no course", async function() {
        try{
            const result = await User_Lesson.addCourse('u2',-1);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find course');
            expect(err.status).toEqual(404)
        }
    })

    test("throws error when no user", async function() {
        try{
            const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
            const id = idRes.rows[0].id;
            const result = await User_Lesson.addCourse('fakeUser', id);
            fail();
        }catch(err){
            expect(err.message).toEqual('No user: fakeUser');
            expect(err.status).toEqual(404)
        }
    })

    test("throws error for dupe", async function() {
      const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
      const id = idRes.rows[0].id;
        try{
          await User_Lesson.addCourse('u2',id);
          await User_Lesson.addCourse('u2',id);
        }catch(err){
          expect(err.message).toEqual(`course:${id} already added`)
          expect(err.status).toEqual(400)
        }
    })
})

/************************************** removeCourse */

describe("removeCourse", function() {
    test("works", async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        const remRes = await User_Lesson.removeCourse('u4',id);
        const result = await User.findSavedCourses('u4');
        expect(result).toEqual([]);
    })

    test("throws error when invalid user", async function() {
        const idRes = await db.query(`SELECT id FROM courses WHERE title='C1'`);
        const id = idRes.rows[0].id;
        try{
            const remRes = await User_Lesson.removeCourse('fakeUser', id);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find course progress');
            expect(err.status).toEqual(404);
        }
    })

    test("throws error when invalid course", async function() {
        try{
            const remRes = await User_Lesson.removeCourse('u4',-1);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find course progress');
            expect(err.status).toEqual(404);
        }
    })
})

/************************************** findUnitData */

describe("findUnitData", function() {
    test("works", async function() {
        const idRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const id = idRes.rows[0].id;
        const result = await User_Lesson.findUnitData('u4', id)
        expect(result).toEqual(
            [
                {
                  id: expect.any(Number),
                  title: '1L1',
                  lessonOrder: 1,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L2',
                  lessonOrder: 2,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L3',
                  lessonOrder: 3,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                },
                {
                  id: expect.any(Number),
                  title: '1L4',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L5',
                  lessonOrder: 5,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                }
              ]
        );
    })

    test("syncs with missing userLesson", async function() {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title='1L4'`);
        const lessonId = lessonIdRes.rows[0].id;
        const remRes = db.query(
            `DELETE FROM users_lessons
                WHERE lesson_id=$1`,[lessonId]
        );
        const result = await User_Lesson.findUnitData('u4',unitId);
        expect(result).toEqual(
            [
                {
                  id: expect.any(Number),
                  title: '1L1',
                  lessonOrder: 1,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L2',
                  lessonOrder: 2,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L3',
                  lessonOrder: 3,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                },
                {
                  id: expect.any(Number),
                  title: '1L4',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                },
                {
                  id: expect.any(Number),
                  title: '1L5',
                  lessonOrder: 5,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                }
              ]
        );
    })

    test("syncs with missing lesson", async function() {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title='1L4'`);
        const lessonId = lessonIdRes.rows[0].id;
        await Lesson.remove(lessonId);
        const result = await User_Lesson.findUnitData('u4',unitId);
        expect(result).toEqual(
            [
                {
                  id: expect.any(Number),
                  title: '1L1',
                  lessonOrder: 1,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L2',
                  lessonOrder: 2,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L3',
                  lessonOrder: 3,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                },
                {
                  id: expect.any(Number),
                  title: '1L5',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                }
              ]
        );
    });

    test("syncs with new lesson", async function() {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const data = {
            title: 'newLesson',
            unitId: unitId,
            lessonOrder: 3,
            lessonType: 'video',
            lessonURL: 'new.com'
        }
        await Lesson.create(data);
        const result = await User_Lesson.findUnitData('u4',unitId);
        expect(result).toEqual(
            [
                {
                  id: expect.any(Number),
                  title: '1L1',
                  lessonOrder: 1,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L2',
                  lessonOrder: 2,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title:'newLesson',
                  lessonOrder: 3,
                  lessonType:'video',
                  lessonURL: 'new.com',
                  userLessonId:expect.any(Number),
                  status:'incomplete'
                },
                {
                  id: expect.any(Number),
                  title: '1L3',
                  lessonOrder: 4,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                },
                {
                  id: expect.any(Number),
                  title: '1L4',
                  lessonOrder: 5,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'complete'
                },
                {
                  id: expect.any(Number),
                  title: '1L5',
                  lessonOrder: 6,
                  lessonType: 'video',
                  lessonURL: 'asjd',
                  userLessonId: expect.any(Number),
                  status: 'incomplete'
                }
              ])

    })

    test("throws error when invalid user", async function() {
        const idRes = await db.query(`SELECT id FROM units WHERE title='1U1'`);
        const id = idRes.rows[0].id;
        try{
            const result = await User_Lesson.findUnitData('fakeUser', id);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find course progress');
            expect(err.status).toEqual(404);
        }
    })

    test("throws error when invalid course", async function() {
        try{
            const remRes = await User_Lesson.findUnitData('u4',-1);
            fail();
        }catch(err){
            expect(err.message).toEqual('could not find course progress');
            expect(err.status).toEqual(404);
        }
    })
})

/************************************** updateLessonData */

describe("updateLessonData", function() {
    test("works", async function() {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title='1L1'`);
        const lessonId = lessonIdRes.rows[0].id;
        const userLessonIdRes = await db.query(`SELECT id from users_lessons WHERE lesson_id = $1 AND user_username ='u4'`,[lessonId]);
        const id = userLessonIdRes.rows[0].id;
        const result = await User_Lesson.updateLessonData(id, 'incomplete');
        expect(result).toEqual({id:id, lessonId:lessonId, stat:'incomplete'})
    })

    test("throws error when invalid id", async function() {
        try{
            const result = await User_Lesson.updateLessonData(-1,'complete');
            fail();
        }catch(err){
            expect(err.message).toEqual(`could not find course progress`);
            expect(err.status).toEqual(404)
        }
    })
})