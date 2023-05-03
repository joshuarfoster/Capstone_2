const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Collection of related methods for courses. */

class Course {
    /**given a course id returns correct course data
     * 
     * => {id, creator_username, title, about}
     */

    static async findOne(id) {
        const courseRes = await db.query(
            `SELECT id,
                    creator_username AS "creatorUsername",
                    title,
                    about
                FROM courses
                WHERE id = $1`, [id]);
        
        if (courseRes.rows.length === 0) {
            throw { message:'could not find course', status : 404}
        }

        return courseRes.rows[0];
    }

      /** Return array of course data:
   *
   * => [ {id, creator_username, title, about}, ... ]
   *
   * */

    static async findAll() {
        const coursesRes = await db.query(
            `SELECT id,
                    creator_username AS "creatorUsername",
                    title,
                    about
                FROM courses
                ORDER BY title`);

        return coursesRes.rows;
    }

    /** create course in database from data, return course data:
   *
   * {creator_username, title, about}
   *
   * => {id, creator_username, title, about}
   *
   * */

    static async create(data) {
        const result = await db.query(
            `INSERT INTO courses (
                    creator_username,
                    title,
                    about)
            VALUES ($1, $2, $3)
            RETURNING id,
                      creator_username AS "creatorUsername",
                      title,
                      about`,
            [
                data.creatorUsername,
                data.title,
                data.about
            ]
        );

        return result.rows[0];
    }

      /** Update data with matching ID to data, return updated course.
   * { title, about}
   *
   * => {id, creator_username, title, about}
   *
   * */
    
      static async update(id, data) {
        const {setCols, values} =sqlForPartialUpdate(
            data,
            {
                title: 'title',
                about:'about'
            }
        );
        const handleVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE courses 
                          SET ${setCols}
                          WHERE id = ${handleVarIdx}
                          RETURNING id,
                                    creator_username AS "creatorUsername",
                                    title,
                                    about`;
        
        const result = await db.query(querySql,[...values, id])

        if (result.rows.length === 0){
            throw {message: `could not find course`, status : 404}
        }

        return result.rows[0];
      }

      /** remove course with matching id. Returns undefined. */

      static async remove(id) {
        const result = await db.query(
            `DELETE FROM courses
                WHERE id=$1
                RETURNING id`,
            [id]);

        if (result.rows.length === 0) {
            throw {message: `could not find course`, status: 404}
        }
      }

      /** Return array of unit data given course_id:
   *
   * => [ {id, title, unitOrder}, ... ]
   *
   * */

      static async units(course_id){
        try{
            await this.findOne(course_id)
        }catch(e){
            throw {message: `could not find course`, status: 404}
        }
        
        const result = await db.query(
            `SELECT id,
                    title,
                    unit_order AS "unitOrder"
            FROM units
            WHERE course_id = $1
            ORDER BY unit_order`,
            [course_id]
        )

        return result.rows;
      }
}

module.exports = Course;