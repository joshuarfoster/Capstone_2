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

/************************************** POST /units */
describe("POST /units", function() {
    test("ok for correct logged in user", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const newUnit = {
            title: 'newUnit',
            courseId: id,
            unitOrder: 2
        }
        const resp = await request(app)
            .post("/units")
            .send(newUnit)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({"unit": {id:expect.any(Number), ...newUnit}})
    })

    test("unauth for different user", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const newUnit = {
            title: 'newUnit',
            courseId: id,
            unitOrder: 2
        }
        const resp = await request(app)
            .post("/units")
            .send(newUnit)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual("must be logged in as creator")
    })

    test("unauth for anon", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const newUnit = {
            title: 'newUnit',
            courseId: id,
            unitOrder: 2
        }
        const resp = await request(app)
            .post("/units")
            .send(newUnit);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual("must be logged in");
    })

    test("bad request with missing data", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const newUnit = {
            title: 'newUnit',
            courseId: id
        }
        const resp = await request(app)
            .post("/units")
            .send(newUnit)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST');
    })

    test("bad request with invalid data", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const newUnit = {
            title: 'newUnit',
            courseId: id,
            unitOrder: 'first'
        }
        const resp = await request(app)
            .post("/units")
            .send(newUnit)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST')
    })

    test("not found for incorrect courseId", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const newUnit = {
            title: 'newUnit',
            courseId: -1,
            unitOrder: 2
        }
        const resp = await request(app)
            .post("/units")
            .send(newUnit)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    })
})

/************************************** GET /units/:id */

describe("GET /units/:id", function () {
    test("ok for anon", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app).get(`/units/${id}`);
        expect(resp.body).toEqual(
            {
                unit: {
                  id: expect.any(Number),
                  title: '1U1',
                  courseId: expect.any(Number),
                  unitOrder: 1,
                  lessons: [
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
                }
              }
        )
    })

    test("not found for no such unit", async function () {
        const resp = await request(app).get(`/companies/0`);
        expect(resp.statusCode).toEqual(404);
      });
})

/************************************** PATCH /units/:id */

describe("PATCH /units/:id", function () {
    test("works for correct logged in user", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/units/${id}`)
            .send({
                title:"newTitle"
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            unit : {
                id: id,
                title: 'newTitle',
                courseId: expect.any(Number),
                unitOrder: 2
            }
        })
    })

    test("unauth for other users", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/units/${id}`)
            .send({
                title:"newTitle"
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in as creator');
    })

    test("unauth for anon", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/units/${id}`)
            .send({
                title:"newTitle"
            })
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })

    test("not found for no such unit", async function () {
        const resp = await request(app)
            .patch(`/units/0`)
            .send({
                title:"newTitle"
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404)
        expect(resp.body.message).toEqual('could not find unit');
    })

    test("bad request on invalid data", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/units/${id}`)
            .send({
                courseId:707
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST');
    })
})

/************************************** DELETE /courses/:id */

describe("DELETE /units/:id", function () {
    test("works for correct user", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/units/${id}`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({ deleted: `${id}` });
    })

    test("unauth for incorrect user", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/units/${id}`)
            .set("authorization", `Bearer ${u2Token}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in as creator');
    })

    test("unauth for anon", async function () {
        const unitIdRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
        const id = unitIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/units/${id}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })

    test("not found if no such unit", async function () {
        const resp = await request(app)
            .delete(`/units/0`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.statusCode).toEqual(404);
    })
})