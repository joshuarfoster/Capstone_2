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

/************************************** POST /courses */
describe("POST /courses", function () {
    const newCourse = {
        title: 'newCourse',
        creatorUsername:'u1',
        about:'newAbout'
    };

    test("ok for correct logged in user", async function () {
        const resp = await request(app)
            .post("/courses")
            .send(newCourse)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect(resp.body).toEqual({"course": {id:expect.any(Number), ...newCourse}})
    })

    test("unauth for different user", async function () {
        const resp = await request(app)
            .post("/courses")
            .send(newCourse)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual("must be logged in as creator")
    })

    test("unauth for anon", async function () {
        const resp = await request(app)
            .post("/courses")
            .send(newCourse);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual("must be logged in")
    })

    test("bad request with missing data", async function() {
        const resp = await request(app)
            .post("/courses")
            .send({
                creatorUsername: 'u1',
                about: 'newAbout'
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST')
    })

    test("bad request with invalid data", async function() {
        const resp = await request(app)
            .post("/courses")
            .send({
                title: 32,
                creatorUsername: 'u1',
                about: 'newAbout'
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST')
    })
})

/************************************** GET /courses */

describe("GET /courses", function () {
    test("ok for anon", async function () {
    const resp = await request(app).get("/courses");
    expect(resp.body).toEqual({
        courses: [
          { id: expect.any(Number), creatorUsername: 'u1', title: 'C1', about: 'About1' },
          { id: expect.any(Number), creatorUsername: 'u2', title: 'C2', about: 'About2' },
          { id: expect.any(Number), creatorUsername: 'u3', title: 'C3', about: 'About3' }
        ]
      });
  });

    test("fails: test next() handler", async function () {
        // there's no normal failure event which will cause this route to fail ---
        // thus making it hard to test that the error-handler works with it. This
        // should cause an error, all right :)
        await db.query("DROP TABLE courses CASCADE");
        const resp = await request(app)
            .get("/courses")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
  });
})

/************************************** GET /courses/:id */

describe("GET /courses/:id", function () {
    test("ok for anon", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app).get(`/courses/${id}`);
        expect(resp.body).toEqual(
            {
                course: {
                  id: expect.any(Number),
                  creatorUsername: 'u1',
                  title: 'C1',
                  about: 'About1',
                  units: [
                    { id: expect.any(Number), title: '1U1', unitOrder: 1 },
                    { id: expect.any(Number), title: '1U2', unitOrder: 2 },
                    { id: expect.any(Number), title: '1U3', unitOrder: 3 },
                    { id: expect.any(Number), title: '1U4', unitOrder: 4 },
                    { id: expect.any(Number), title: '1U5', unitOrder: 5 }
                  ]
                }
              }
        )
    })

    test("not found for no such course", async function () {
        const resp = await request(app).get(`/companies/0`);
        expect(resp.statusCode).toEqual(404);
      });
})

/************************************** PATCH /courses/:id */

describe("PATCH /courses/:id", function() {
    test("works for correct logged in user", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/courses/${id}`)
            .send({
                title:"newTitle"
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            course : {
                id: id,
                title: 'newTitle',
                creatorUsername: 'u1',
                about:'About1'
            }
        })
    })

    test("unauth for other users", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/courses/${id}`)
            .send({
                title:"newTitle"
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in as creator');
    })

    test("unauth for anon", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/courses/${id}`)
            .send({
                title:"newTitle"
            });
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })

    test("not found for no such course", async function () {
        const resp = await request(app)
            .patch(`/courses/-1`)
            .send({
                about:"newAbout"
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404)
        expect(resp.body.message).toEqual('could not find course');
    })

    test("bad request on invalid data", async function() {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app)
            .patch(`/courses/${id}`)
            .send({
                creatorUsername: 'u2'
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
        expect(resp.body.message).toEqual('BAD JSON REQUEST');
    })
})

/************************************** DELETE /courses/:id */

describe("DELETE /courses/:id", function () {
    test("works for correct user", async function () {
      const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
      const id = courseIdRes.rows[0].id;
      const resp = await request(app)
          .delete(`/courses/${id}`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.body).toEqual({ deleted: `${id}` });
    });
  
    test("unauth for incorrect user", async function () {
        const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
        const id = courseIdRes.rows[0].id;
        const resp = await request(app)
            .delete(`/courses/${id}`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in as creator');
    });
  
    test("unauth for anon", async function () {
      const courseIdRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
      const id = courseIdRes.rows[0].id;
      const resp = await request(app)
          .delete(`/courses/${id}`);
      expect(resp.statusCode).toEqual(401);
      expect(resp.body.message).toEqual('must be logged in');
    });
  
    test("not found for no such course", async function () {
      const resp = await request(app)
          .delete(`/courses/-1`)
          .set("authorization", `Bearer ${u1Token}`);
      expect(resp.statusCode).toEqual(404);
    });
});