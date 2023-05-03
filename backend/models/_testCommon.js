const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {

  await db.query("DELETE FROM courses");
  await db.query("DELETE FROM units");
  await db.query("DELETE FROM lessons");
  await db.query("DELETE FROM users_lessons")
  await db.query("DELETE FROM users");

  await db.query(`
        INSERT INTO users(username,
                          pass_hash)
        VALUES ('u1', $1),
               ('u2', $2),
               ('u3', $3),
               ('u4', $4),
               ('u5', $5),
               ('u6', $6)
        RETURNING username`,
      [
        await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password3", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password4", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password5", BCRYPT_WORK_FACTOR),
        await bcrypt.hash("password6", BCRYPT_WORK_FACTOR)
      ]);
  
  await db.query(`
    INSERT INTO courses(title, creator_username, about)
    VALUES ('C1', 'u1', 'About1'),
           ('C2', 'u2', 'About2'),
           ('C3', 'u3', 'About3')`);

  const c1_idRes = await db.query(`SELECT id FROM courses WHERE title = 'C1'`);
  const c2_idRes = await db.query(`SELECT id FROM courses WHERE title = 'C2'`);
  const c3_idRes = await db.query(`SELECT id FROM courses WHERE title = 'C3'`);
  
  await db.query(`
    INSERT INTO units(title, course_id, unit_order)
    VALUES ('1U1', $1, 1),
           ('1U2', $1, 2),
           ('1U3', $1, 3),
           ('1U4', $1, 4),
           ('1U5', $1, 5),
           ('2U1', $2, 1),
           ('2U2', $2, 2),
           ('2U3', $2, 3)`,
    [
        c1_idRes.rows[0].id,
        c2_idRes.rows[0].id
    ])

    const u1_idRes = await db.query(`SELECT id FROM units WHERE title = '1U1'`);
    const u2_idRes = await db.query(`SELECT id FROM units WHERE title = '1U2'`);
    

  await db.query(`
    INSERT INTO lessons(title, unit_id, lesson_order, lesson_type, lesson_url)
    VALUES ('1L1', $1, 1, 'video', 'asjd'),
           ('1L2', $1, 2, 'video', 'asjd'),
           ('1L3', $1, 3, 'video', 'asjd'),
           ('1L4', $1, 4, 'video', 'asjd'),
           ('1L5', $1, 5, 'video', 'asjd'),
           ('2L1', $2, 1, 'video', 'asjd'),
           ('2L2', $2, 2, 'video', 'asjd'),
           ('2L3', $2, 3, 'video', 'asjd')`,
    [
        u1_idRes.rows[0].id,
        u2_idRes.rows[0].id
    ]);

  const L11_idRes = await db.query(`SELECT id FROM lessons WHERE title = '1L1'`);
  const L12_idRes = await db.query(`SELECT id FROM lessons WHERE title = '1L2'`);
  const L13_idRes = await db.query(`SELECT id FROM lessons WHERE title = '1L3'`);
  const L14_idRes = await db.query(`SELECT id FROM lessons WHERE title = '1L4'`);
  const L15_idRes = await db.query(`SELECT id FROM lessons WHERE title = '1L5'`);
  const L21_idRes = await db.query(`SELECT id FROM lessons WHERE title = '2L1'`);
  const L22_idRes = await db.query(`SELECT id FROM lessons WHERE title = '2L2'`);
  const L23_idRes = await db.query(`SELECT id FROM lessons WHERE title = '2L3'`);

  await db.query(
    `INSERT INTO users_lessons(user_username,course_id,unit_id,lesson_id, stat)
    VALUES ('u4', $1, $2, $4, 'complete'),
           ('u4', $1, $2, $5, 'complete'),
           ('u4', $1, $2, $6, 'incomplete'),
           ('u4', $1, $2, $7, 'complete'),
           ('u4', $1, $2, $8, 'incomplete'),
           ('u4', $1, $3, $9, 'incomplete'),
           ('u4', $1, $3, $10, 'incomplete'),
           ('u4', $1, $3, $11, 'incomplete'),
           ('u5', $1, $2, $4, 'complete'),
           ('u5', $1, $2, $5, 'incomplete'),
           ('u5', $1, $2, $6, 'incomplete'),
           ('u5', $1, $2, $7, 'complete'),
           ('u5', $1, $2, $8, 'complete'),
           ('u5', $1, $3, $9, 'complete'),
           ('u5', $1, $3, $10, 'incomplete'),
           ('u5', $1, $3, $9, 'complete')`,
    [
        c1_idRes.rows[0].id,
        u1_idRes.rows[0].id,
        u2_idRes.rows[0].id,
        L11_idRes.rows[0].id,
        L12_idRes.rows[0].id,
        L13_idRes.rows[0].id,
        L14_idRes.rows[0].id,
        L15_idRes.rows[0].id,
        L21_idRes.rows[0].id,
        L22_idRes.rows[0].id,
        L23_idRes.rows[0].id,
    ]
  );

}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}


module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
};