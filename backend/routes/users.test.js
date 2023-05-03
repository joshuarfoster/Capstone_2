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

/************************************** GET /courses/:id */

describe("GET /users/:username", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get(`/users/u1`);
        expect(resp.body).toEqual(
            { user : {username:'u1', youtubeAccount: null, about: null}}
        )
    })

    test("not found for no such course", async function () {
        const resp = await request(app).get(`/users/fakeUser`);
        expect(resp.statusCode).toEqual(404);
      });
})

/************************************** DELETE /users */

describe("DELETE /users/:username", function() {
    test("works for correct user", async function () {
        const resp = await request(app)
            .delete(`/users/u1`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual({ deleted: `u1` });
    })

    test("unauth for incorrect user", async function () {
        const resp = await request(app)
            .delete(`/users/u1`)
            .set("authorization", `Bearer ${u2Token}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in as creator');
    })

    test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/users/u1`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual('must be logged in');
    })
})

/************************************** GET /users/:username/savedcourses */

describe("GET /users/:username/savedcourses", function () {
    test("works for correct user", async function () {
        const resp = await request(app)
            .get(`/users/u4/savedcourses`)
            .set("authorization", `Bearer ${u4Token}`)
        expect(resp.body).toEqual( { courses: [ { id: expect.any(Number)} ] } )
    })

    test("works for correct user with no saved courses", async function () {
        const resp = await request(app)
            .get(`/users/u1/savedcourses`)
            .set("authorization", `Bearer ${u1Token}`)
        expect(resp.body).toEqual( { courses: [] } )
    })

    test("unauth for incorrect user", async function () {
        const resp = await request(app)
            .get(`/users/u4/savedcourses`)
            .set("authorization", `Bearer ${u2Token}`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual(`must be logged in as user`);
    })

    test("unauth for anon", async function () {
        const resp = await request(app)
            .get(`/users/u4/savedcourses`)
        expect(resp.statusCode).toEqual(401);
        expect(resp.body.message).toEqual(`must be logged in`)
    })
})

/************************************** GET /users/:username/createdcourse */

describe("GET /users/:username/createdcourses", function () {
    test("ok for anon", async function () {
        const resp = await request(app)
            .get('/users/u1/createdcourses')
        expect(resp.body).toEqual( { courses: [ { id: expect.any(Number)} ] } )
    })

    test("works for user that has created no courses", async function () {
        const resp = await request(app)
            .get('/users/u4/createdcourses')
        expect(resp.body).toEqual( { courses: [] } )
    })

    test("not found if no such user", async function () {
        const resp = await request(app)
            .get('/users/fakeuser/createdcourses')
        expect(resp.statusCode).toEqual(404)
    })
})