const db = require("../db");
const Unit = require('./unit');
const { sqlForPartialUpdate } = require("../helpers/sql");


class Lesson {
    /**given a lesson id returns correct lesson data
     * 
     * => {id, title, unitId, lessonOrder, LessonType, LessonURL}
     */

    static async findOne(id) {
        const lessonRes = await db.query(
            `SELECT id,
                    title,
                    unit_id AS "unitId",
                    lesson_order AS "lessonOrder",
                    lesson_type AS "lessonType",
                    lesson_url AS "lessonURL"
                FROM lessons
                WHERE id = $1`, [id]);
        
        if (lessonRes.rows.length === 0) {
            throw { message:'could not find lesson', status : 404}
        }

        return lessonRes.rows[0];
    }

    /** create lesson in database from data and updates order of surrounding lessons, return lesson data:
   *
   * {title, unit_id, lesson_order, lesson_type, lesson_url}
   *
   * => {id, title, unit_id, lesson_order, lesson_type, lesson_url}
   *
   * */

    static async create(data) {
        const lessonsRes = await Unit.lessons(data.unitId);
        if(data.lessonOrder > lessonsRes.length + 1){
            data.lessonOrder = lessonsRes.length + 1
        }
        if(data.lessonOrder < 1){
            data.lessonOrder = 1
        }
        for (let lesson of lessonsRes){
            if(lesson.lessonOrder >= data.lessonOrder){
                const lessonRes = await db.query(
                    `UPDATE lessons SET
                        lesson_order=$1
                        WHERE id=$2`,
                    [
                        lesson.lessonOrder + 1,
                        lesson.id
                    ]
                )
            }
        }
        const result = await db.query(
            `INSERT INTO lessons (
                title,
                unit_id,
                lesson_order,
                lesson_type,
                lesson_url)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id,
                      title,
                      unit_id AS "unitId",
                      lesson_order AS "lessonOrder",
                      lesson_type AS "lessonType",
                      lesson_url AS "lessonURL"`,
            [
                data.title,
                data.unitId,
                data.lessonOrder,
                data.lessonType,
                data.lessonURL
            ]
        );

        return result.rows[0];
    }

    /** remove lesson with matching id and updates order of surrounding lessons. Returns undefined. */

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM lessons
                WHERE id=$1
                RETURNING lesson_order AS "lessonOrder",
                          unit_id AS "unitId"`,
            [id]);
        
        if(result.rows.length === 0) {
            throw {message: `could not find lesson`}
        }

        const lessonsRes = await Unit.lessons(result.rows[0].unitId);
        for (let lesson of lessonsRes){
            if (lesson.lessonOrder > result.rows[0].lessonOrder){
                const unitRes = await db.query (
                    `UPDATE lessons SET
                        lesson_order=$1
                        WHERE id=$2`,
                    [
                        lesson.lessonOrder - 1,
                        lesson.id
                    ]
                )
            }
        }
    }

      /** Update lesson with matching ID to data and updates surrounding lesson orders if lesson_order is updated, return updated lesson.
   * {title, lesson_order, lesson_url}
   *
   * => {id, title, unit_id, lesson_order, lesson_type, lesson_url}
   *
   * */

      static async update(id,data) {
        const lessonRes = await db.query(
            `SELECT lesson_order AS "lessonOrder",
                    unit_id AS "unitId"
                FROM lessons
                WHERE id=$1`,
            [
                id
            ]
        )

        if (lessonRes.rows.length === 0){
            throw {message: `could not find lesson`, status: 404}
        }

        const lessonsRes = await Unit.lessons(lessonRes.rows[0].unitId);


        if(data.hasOwnProperty('lessonOrder') && data.lessonOrder > lessonsRes.length){
            data.lessonOrder = lessonsRes.length;
        }
        if(data.hasOwnProperty('lessonOrder') && data.lessonOrder < 1){
            data.lessonOrder = 1;
        }

        
        if(data.hasOwnProperty('lessonOrder') && lessonRes.rows[0].lessonOrder !== data.lessonOrder){
            if(lessonRes.rows[0].lessonOrder < data.lessonOrder){
                for (let lesson of lessonsRes){
                    if(lesson.lessonOrder > lessonRes.rows[0].lessonOrder && lesson.lessonOrder <= data.lessonOrder) {
                        await db.query (
                            `UPDATE lessons SET
                                lesson_order=$1
                                WHERE id=$2`,
                            [
                                lesson.lessonOrder - 1,
                                lesson.id
                            ]
                        )
                    }
                }
            }else {
                for (let lesson of lessonsRes){
                    if(lesson.lessonOrder < lessonRes.rows[0].lessonOrder && lesson.lessonOrder >= data.lessonOrder) {
                        await db.query (
                            `UPDATE lessons SET
                                lesson_order=$1
                                WHERE id=$2`,
                            [
                                lesson.lessonOrder + 1,
                                lesson.id
                            ]
                        )
                    }
                }
            }
        }

        const {setCols, values} =sqlForPartialUpdate(
            data,
            {
                title:'title',
                lessonOrder:'lesson_order',
                lessonURL:'lesson_url'
            }
        );
        const handleVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE lessons
                          SET ${setCols}
                          WHERE id = ${handleVarIdx}
                          RETURNING id,
                                    title,
                                    unit_id AS "unitId",
                                    lesson_order AS "lessonOrder",
                                    lesson_type AS "lessonType",
                                    lesson_url AS "lessonURL"`

        const result = await db.query(querySql,[...values,id]);
        
        return result.rows[0];
    }
}

module.exports = Lesson;