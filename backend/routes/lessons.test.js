const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /lessons */

describe("POST /lessons", function () {
    test("ok for correct logged in user", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const newLesson = {
            title: "newLesson",
            unitId: unitId,
            lessonOrder: 4,
            lessonType: "video",
            lessonURL: "new.com"
        }
        const resp = await request(app)
            .post("/lessons")
            .send(newLesson)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({"lesson":{id:expect.any(Number), ...newLesson}})
    })

    test("unauth for different user", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const newLesson = {
            title: "newLesson",
            unitId: unitId,
            lessonOrder: 4,
            lessonType: "video",
            lessonURL: "new.com"
        }
        const resp = await request(app)
            .post("/lessons")
            .send(newLesson)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual("must be logged in as creator")
    })

    test("unauth for anon", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const newLesson = {
            title: "newLesson",
            unitId: unitId,
            lessonOrder: 4,
            lessonType: "video",
            lessonURL: "new.com"
        }
        const resp = await request(app)
            .post("/lessons")
            .send(newLesson);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual("must be logged in")
    })

    test("bad request with missing data", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const newLesson = {
            title: "newLesson",
            unitId: unitId,
            lessonOrder: 4,
            lessonType: "video"
        }
        const resp = await request(app)
            .post("/lessons")
            .send(newLesson)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST')
    })

    test("bad request with invalid data", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const unitId = unitIdRes.rows[0].id;
        const newLesson = {
            title: "newLesson",
            unitId: unitId,
            lessonOrder: 4,
            lessonType: "video",
            lessonURL: "new.com",
            id: 2
        }
        const resp = await request(app)
            .post("/lessons")
            .send(newLesson)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST')
    })

    test("not found with incorrect unitId", async function () {
        const newLesson = {
            title: "newLesson",
            unitId: 0,
            lessonOrder: 4,
            lessonType: "video",
            lessonURL: "new.com",
            id: 2
        }
        const resp = await request(app)
            .post("/lessons")
            .send(newLesson)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    })
})

/************************************** PATCH /lessons/:id */

describe("PATCH /lessons/:id", function () {
    test("works for correct logged in user", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
        const id = lessonIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/lessons/${id}`)
            .send({
                lessonURL:"new.com",
                lessonOrder:1
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            lesson: {
              id: id,
              title: '1L2',
              unitId: expect.any(Number),
              lessonOrder: 1,
              lessonType: 'video',
              lessonURL: 'new.com'
            }
          })
    })

    test("unauth for other users", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
        const id = lessonIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/lessons/${id}`)
            .send({
                lessonURL:"new.com",
                lessonOrder:1
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in as creator');
    })

    test("unauth for anon", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
        const id = lessonIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/lessons/${id}`)
            .send({
                lessonURL:"new.com",
                lessonOrder:1
            })
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })

    test("not found for no such lesson", async function () {
        const resp = await request(app)
        .patch(`/lessons/0`)
        .send({
            lessonURL:"new.com",
            lessonOrder:1
        })
        .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
    expect(resp.body.message).toEqual('could not find lesson');
    })

    test("bad request on invalid data", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
        const id = lessonIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/lessons/${id}`)
            .send({
                lessonURL:"new.com",
                id:1
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST');
    })
})

/************************************** DELETE /lessons/:id */

describe("DELETE /lessons/:id", function () {
    test("works for correct user", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
        const id = lessonIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/lessons/${id}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({ deleted: `${id}` });
    })

    test("unauth for incorrect user", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
        const id = lessonIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/lessons/${id}`)
            .set("authorization", `Bearer ${u2Token}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in as creator');
    })

    test("unauth for anon", async function () {
        const lessonIdRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
        const id = lessonIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/lessons/${id}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })

    test("not found if no such lesson", async function () {
        const resp = await request(app)
            .delete(`/lessons/0`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(404);
    })
})