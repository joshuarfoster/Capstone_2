const db = require("../db");
const bcrypt = require("bcrypt");

const {BCRYPT_WORK_FACTOR} = require("../config")

class User {
    /** authenticate user with username, password.
   *
   * Returns { username }
   *
   * Throws Error is user not found or wrong password.
   **/
    
    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT username,
                    pass_hash
            FROM users
            WHERE username = $1`,
            [username]
        )

        const user = result.rows[0];

        if(user) {
            const isValid = await bcrypt.compare(password,user.pass_hash)
            if(isValid === true) {
                delete user.pass_hash;
                return user
            }
        }

        throw {message: "Invalid username/password", status:401}
    }

    /** Register user with data.
   *
   * Returns { username }
   *
   * Throws Error on duplicates.
   **/

    static async register(username, password){
        const dupCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username]
        )

        if(dupCheck.rows[0]){
            throw {message: `Duplicate username: ${username}`, status: 400 }
        }

        const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

        const result = await db.query(
            `INSERT INTO users
            (username,
            pass_hash)
            VALUES ($1,$2)
            RETURNING username`,
            [
                username,
                hashedPassword
            ]
        )

        const user = result.rows[0];

        return user;
    }

    /**given a username returns correct user data
     * 
     * => {username, youtube_account, about}
     */

    static async get(username) {
        const userRes = await db.query(
            `SELECT username,
                    youtube_account AS "youtubeAccount",
                    about
                FROM users
                WHERE username = $1`, [username]);
                
        if (userRes.rows.length === 0) {
            throw {message: `No user: ${username}`, status: 404}
        }

        return userRes.rows[0];
    }


    /** Delete given user from database; returns undefined. */

  static async remove(username) {
    let result = await db.query(
          `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
        [username],
    );
    const user = result.rows[0];

    if (!user) throw {message: `No user: ${username}`, status: 404};
  }


   /** Given a username, return users created courses.
   *
   * Returns [{ id, title }, ...]
   **/

   static async findCreatedCourses(username){
    await this.get(username);

    const result = await db.query(
        `SELECT id
         FROM courses
         WHERE creator_username = $1`,
         [username]
    )

    return result.rows;
   }

   /** Given a username, return users saved courses.
   *
   * Returns [{ id, title }, ...]
   **/

   static async findSavedCourses(username){
    await this.get(username);
    
    const result = await db.query(
        `SELECT courses.id
        FROM courses
        JOIN users_lessons
        ON courses.id = users_lessons.course_id
        WHERE users_lessons.user_username = $1
        GROUP BY courses.id`,
        [username]
    )

    return (await result).rows;
   }

}

module.exports = User