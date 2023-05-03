const db = require("../db.js");
const User = require("./user");

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

/************************************** create */

describe("authenticate", function() {
    test("authenticates exiting user with correct password", async function(){
        const  result = await User.authenticate('u2', 'password2');
        expect(result.username).toEqual('u2');
    })

    test("throws error with incorrect username", async function() {
        try{
            const result = await User.authenticate('u1', 'fakePass');
            fail();
        }catch(err){
            expect(err.message).toEqual('Invalid username/password');
            expect(err.status).toEqual(401);
        }
    })

    test("throws error with incorrect password", async function() {
        try{
            const result = await User.authenticate('fakeu3', 'password3');
            fail();
        }catch(err){
            expect(err.message).toEqual('Invalid username/password');
            expect(err.status).toEqual(401);
        }
    })

    test("throws error with incorrect username and password", async function() {
        try{
            const result = await User.authenticate('fakeUser', 'fakePass');
            fail();
        }catch(err){
            expect(err.message).toEqual('Invalid username/password');
            expect(err.status).toEqual(401);
        }
    })
});

/************************************** register */

describe("register", function() {
    test("works", async function() {
        const result = await User.register('newUser','newPass');
        const auth = await User.authenticate('newUser','newPass');
        expect(result.username).toEqual('newUser');
        expect(auth.username).toEqual('newUser');
    })

    test("throws error with dupe username", async function() {
        try{
            const result = await User.register('u4','newPass');
            fail();
        }catch (err){
            expect(err.message).toEqual('Duplicate username: u4');
            expect(err.status).toEqual(400);
        }
    })
})

/************************************** get */

describe('get', function () {
    test("works", async function () {
      let user = await User.get('u1');
      expect(user).toEqual({username:'u1', youtubeAccount: null, about: null});
    })

    test("throws Error when can't find course", async function() {
        try {
            await User.get('fakeUser');
            fail();
        }catch (err){
            expect(err.message).toEqual('No user: fakeUser')
        }
    })
  });

/************************************** remove */

describe("remove", function() {
    test("works", async function() {
        await User.remove('u2');
        try{
            await User.get('u2');
            fail();
        }catch(err){
            expect(err.message).toEqual('No user: u2');
            expect(err.status).toEqual(404)
        }
    })

    test("throws error if no user", async function() {
        try{
            const result = await User.remove('fakeUser');
            fail();
        }catch(err){
            expect(err.message).toEqual('No user: fakeUser');
            expect(err.status).toEqual(404)
        }
    })
})

/************************************** findCreatedCourses */

describe("findCreatedCourses", function(){
    test("works with user that has created courses", async function() {
        const result = await User.findCreatedCourses('u1');
        expect(result).toEqual( [ { id: expect.any(Number) } ])
    })

    test("works with user that has no created courses", async function() {
        const result = await User.findCreatedCourses('u4');
        expect(result).toEqual( [] )
    })

    test("throws error when no user", async function() {
        try{
            const result = await User.findCreatedCourses('fakeUser');
            fail();
        }catch(err){
            expect(err.message).toEqual('No user: fakeUser');
            expect(err.status).toEqual(404);
        }
    })
})

/************************************** findSavedCourses */

describe("findSavedCourses", function(){
    test("works with user that has saved courses", async function() {
        const result = await User.findSavedCourses('u4');
        expect(result).toEqual( [ { id: expect.any(Number)} ])
    })

    test("works with user that has no created courses", async function() {
        const result = await User.findSavedCourses('u1');
        expect(result).toEqual( [] )
    })

    test("throws error when no user", async function() {
        try{
            const result = await User.findSavedCourses('fakeUser');
            fail();
        }catch(err){
            expect(err.message).toEqual('No user: fakeUser');
            expect(err.status).toEqual(404);
        }
    })
})