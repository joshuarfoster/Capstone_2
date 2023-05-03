const db = require("../db");
const Course = require('./course')
const User = require('./user')
const Unit = require('./unit')

class User_Lesson {

        /**given a unit id returns correct userLesson data
     * 
     * => {id, title, courseId, unitOrder}
     */

    static async findOne(id) {
        const userLessonRes = await db.query(
            `SELECT id,
                    user_username AS "userUsername",
                    course_id AS "courseId",
                    unit_id AS "unitId",
                    lesson_id AS "lessonId",
                    stat
                FROM users_lessons
                WHERE id = $1`, [id]);
        
        if (userLessonRes.rows.length === 0) {
            throw { message:'could not find userLesson', status : 404}
        }

        return userLessonRes.rows[0];
    }
    
    /** create users_lessons in database from course_id and username returns course_id:
   *
   * (username, course_id)
   *
   * => {course_id}
   *
   * */
    static async addCourse(username, courseId) {
        const currentRes = await db.query(
            `SELECT id
                FROM users_lessons
                WHERE user_username=$1 AND course_id=$2
                ORDER BY lesson_id`,
            [
                username,
                courseId
            ]
            )

        if(currentRes.rows.length !== 0) throw {message:`course:${courseId} already added`, status: 400 }

        const units = await Course.units(courseId);
        await User.get(username);
        for (let unit of units) {
            const lessons = await Unit.lessons(unit.id)
            for (let lesson of lessons) {
                await db.query(
                    `INSERT INTO users_lessons (
                            user_username,
                            course_id,
                            unit_id,
                            lesson_id,
                            stat)
                    VALUES ($1, $2, $3, $4, 'incomplete')`,
                    [
                        username,
                        courseId,
                        unit.id,
                        lesson.id,
                    ]
                );
            }
        }
        return {'courseId':courseId}
    }

    /** remove course progress for user with matching id. Returns undefined. */

    static async removeCourse(username, course_id) {
        const result = await db.query(
            `DELETE FROM users_lessons
                WHERE user_username=$1 AND course_id=$2
                RETURNING id`,
            [
                username,
                course_id
            ]
        );
        
        if (result.rows.length === 0) {
            throw {message: `could not find course progress`, status: 404}
        }
    }

    /**given a unit id and username returns correct unit progress data synced with unit data
     * 
     * => [{id, lesson_id, stat},...]
     */

    static async findUnitData(username,unit_id){

        const unitLessons = await db.query(
            `SELECT id,
                    title,
                    lesson_order,
                    lesson_type,
                    lesson_url
            FROM lessons
            WHERE unit_id=$1
            ORDER BY id`,
            [unit_id]
        )

        const currentRes = await db.query(
            `SELECT id,
                    course_id,
                    lesson_id,
                    stat
                FROM users_lessons
                WHERE user_username=$1 AND unit_id=$2
                ORDER BY lesson_id`,
            [
                username,
                unit_id
            ]
        );

        const data = []
        let i = 0;
        let j = 0;

        while(j < unitLessons.rows.length){
            if(currentRes.rows[i] && currentRes.rows[i].lesson_id === unitLessons.rows[j].id){
                let dataObj = {
                    id: unitLessons.rows[j].id,
                    title: unitLessons.rows[j].title,
                    lessonOrder: unitLessons.rows[j].lesson_order,
                    lessonType: unitLessons.rows[j].lesson_type,
                    lessonURL: unitLessons.rows[j].lesson_url,
                    userLessonId: currentRes.rows[i].id,
                    status: currentRes.rows[i].stat
                }
                data.push(dataObj);
                i = i + 1;
                j = j + 1;
            }else if(currentRes.rows[i] && currentRes.rows[i].lesson_id < unitLessons.rows[j].id){
                const remRes = await db.query(
                    `DELETE from users_lessons
                        WHERE id=$1`,
                    [currentRes.rows[i].lesson_id]
                );
                i = i + 1;
            }else if(!currentRes.rows[i] || currentRes.rows[i].lesson_id > unitLessons.rows[j].id){
                const res = await db.query(
                    `INSERT INTO users_lessons (
                        user_username,
                        course_id,
                        unit_id,
                        lesson_id,
                        stat)
                    VALUES ($1, $2, $3, $4, 'incomplete')
                    RETURNING id`,
                    [
                        username,
                        currentRes.rows[0].course_id,
                        unit_id,
                        unitLessons.rows[j].id
                    ]
                );
                let dataObj = {
                    id: unitLessons.rows[j].id,
                    title: unitLessons.rows[j].title,
                    lessonOrder: unitLessons.rows[j].lesson_order,
                    lessonType: unitLessons.rows[j].lesson_type,
                    lessonURL: unitLessons.rows[j].lesson_url,
                    userLessonId: res.rows[0].id,
                    status: 'incomplete'
                }
                data.push(dataObj);
                j = j + 1
            }
        }

        for(let i = 0; i < data.length; i++){
            let swapped = false;
            for(let j=0; j < data.length - i; j++){
                if(j+1 !== data.length && data[j].lessonOrder > data[j+1].lessonOrder){
                    let temp = data[j];
                    data[j] = data[j+1];
                    data[j+1] =temp;
                    swapped = true;
                }
            }
            if(!swapped){
                return data
            }
        }


        return data;
    }

    /**given a user_lesson id and stat updates the stat of the lesson and returns new data
     * 
     * => {id, lesson_id, stat}
     */

    static async updateLessonData(id, stat){
        const result = await db.query(
            `UPDATE users_lessons SET
                stat=$1
                WHERE id=$2
            RETURNING id,
                      lesson_id AS "lessonId",
                      stat`,
            [stat,id]
        );

        if (result.rows.length === 0) {
            throw {message: `could not find course progress`, status: 404}
        }

        return result.rows[0]
    }

}

module.exports = User_Lesson