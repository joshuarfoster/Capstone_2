const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  u4Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /userslessons/:courseId */

describe("POST /userslessons/:courseId", function () {
    test("ok for logged in user", async function () {
        const courseIdRes = await db.query(`SELECT id from courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id
        const resp = await request(app)
            .post(`/userslessons/${id}`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.body).toEqual({courseId: `${id}`})
    })

    test("unauth for anon", async function () {
        const courseIdRes = await db.query(`SELECT id from courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id
        const resp = await request(app)
            .post(`/userslessons/${id}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })

    test("Not found for no such course", async function () {
        const resp = await request(app)
            .post(`/userslessons/0`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(404)
    })

    test("throws err for dup", async function () {
        const courseIdRes = await db.query(`SELECT id from courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id
        await request(app)
            .post(`/userslessons/${id}`)
            .set("authorization", `Bearer ${u2Token}`);
        const resp = await request(app)
            .post(`/userslessons/${id}`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual(`course:${id} already added`)
    })
})

describe("DELETE /userslessons/:courseId", function () {
    test("ok for logged in user", async function () {
        const courseIdRes = await db.query(`SELECT id from courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/userslessons/${id}`)
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.body).toEqual({deleted : `${id}`})
    })

    test("unauth for anon", async function () {
        const courseIdRes = await db.query(`SELECT id from courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/userslessons/${id}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in')
    })

    test("Not found for no such added course", async function () {
        const resp = await request(app)
            .delete(`/userslessons/0`)
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode).toEqual(404)
    })
})

describe("GET /userslessons/unitdata/:unitId", function () {
    test("works for logged in user", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const id = unitIdRes.rows[0].id
        const resp = await request(app)
            .get(`/userslessons/unitdata/${id}`)
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.body).toEqual(
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
        )
    })

    test("unauth for anon", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const id = unitIdRes.rows[0].id
        const resp = await request(app)
            .get(`/userslessons/unitdata/${id}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })

    test("Not found for no such course progress", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const id = unitIdRes.rows[0].id
        const resp = await request(app)
            .get(`/userslessons/unitdata/${id}`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
        expect(resp.body.message).toEqual('could not find course progress')
    })
})

describe("PATCH /userslessons/lessondata/:userLessonId", function () {
    test("works for correct user", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L5'`);
        const lessonId = lessonIdRes.rows[0].id;
        const userLessonIdRes = await db.query(`SELECT id FROM users_lessons WHERE lesson_id = $1 and user_username = 'u4'`,[lessonId]);
        const id = userLessonIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/userslessons/lessondata/${id}`)
            .send({
                "status": "complete"
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.body).toEqual({"userLesson": {id:id, lessonId:lessonId, stat: "complete"}})
    })

    test("unauth for incorrect user", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L5'`);
        const lessonId = lessonIdRes.rows[0].id;
        const userLessonIdRes = await db.query(`SELECT id FROM users_lessons WHERE lesson_id = $1 and user_username = 'u4'`,[lessonId]);
        const id = userLessonIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/userslessons/lessondata/${id}`)
            .send({
                "status": "complete"
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.message).toEqual("must be logged in as correct user")
    })

    test("unauth for anon", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L5'`);
        const lessonId = lessonIdRes.rows[0].id;
        const userLessonIdRes = await db.query(`SELECT id FROM users_lessons WHERE lesson_id = $1 and user_username = 'u4'`,[lessonId]);
        const id = userLessonIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/userslessons/lessondata/${id}`)
            .send({
                "status": "complete"
            })
        expect(resp.statusCode).toEqual(401)
        expect(resp.body.message).toEqual("must be logged in")
    })

    test("not found for no such userLesson", async function () {
        const resp = await request(app)
            .patch(`/userslessons/lessondata/0`)
            .send({
                "status": "complete"
            })
            .set("authorization", `Bearer ${u4Token}`);
        expect(resp.statusCode);
        expect(resp.body.message).toEqual('could not find userLesson')
    })

})