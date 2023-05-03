const db = require("../db");
const Course = require('./course');
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Collection of related methods for units. */

class Unit {
    /**given a unit id returns correct course data
     * 
     * => {id, title, courseId, unitOrder}
     */

    static async findOne(id) {
        const unitRes = await db.query(
            `SELECT id,
                    title,
                    course_id AS "courseId",
                    unit_order AS "unitOrder"
                FROM units
                WHERE id = $1`, [id]);
        
        if (unitRes.rows.length === 0) {
            throw { message:'could not find unit', status : 404}
        }

        return unitRes.rows[0];
    }

    /** create unit in database from data and updates order of surrounding units, return unit data:
   *
   * {title, course_id, unit_order}
   *
   * => {id, title, course_id, unit_order}
   *
   * */

    static async create(data) {
        const unitsRes = await Course.units(data.courseId);
        if(data.unitOrder > unitsRes.length + 1){
            data.unitOrder = unitsRes.length + 1
        }
        if(data.unitOrder < 1){
            data.unitOrder = 1
        }
        for (let unit of unitsRes){
            if(unit.unitOrder >= data.unitOrder){
                await db.query(
                    `UPDATE units SET
                        unit_order=$1
                        WHERE id=$2`,
                    [
                        unit.unitOrder + 1,
                        unit.id
                    ]
                )
            }
        }
        const result = await db.query(
            `INSERT INTO units (
                title,
                course_id,
                unit_order)
            VALUES ($1, $2, $3)
            RETURNING id,
                      title,
                      course_id AS "courseId",
                      unit_order AS "unitOrder"`,
            [
                data.title,
                data.courseId,
                data.unitOrder
            ]
        );

        return result.rows[0];
    }

    /** remove unit with matching id and updates order of surrounding units. Returns undefined. */

    static async remove(id) {
        const result = await db.query(
            `DELETE FROM units
                WHERE id=$1
                RETURNING unit_order AS "unitOrder",
                          course_id AS "courseId"`,
            [id]);
        
        if(result.rows.length === 0) {
            throw {message: `could not find unit`}
        }

        const unitsRes = await Course.units (result.rows[0].courseId);
        for (let unit of unitsRes){
            if (unit.unitOrder > result.rows[0].unitOrder){
                const unitRes = await db.query (
                    `UPDATE units SET
                        unit_order=$1
                        WHERE id=$2`,
                    [
                        unit.unitOrder - 1,
                        unit.id
                    ]
                )
            }
        }
    }


      /** Update data with matching ID to data and updates surrounding unit orders if unit_order is updated, return updated unit.
   * {title, unit_order}
   *
   * => {id, title, course_id, unit_order}
   *
   * */

      static async update(id, data) {
        const unitRes = await db.query(
            `SELECT unit_order AS "unitOrder",
                    course_id AS "courseId"
                FROM units
                WHERE id=$1`,
            [
                id
            ]
        );
    
        if (unitRes.rows.length === 0) {
            throw { message: `could not find unit`, status: 404 };
        }
    
        const unitsRes = await Course.units(unitRes.rows[0].courseId);
    
        if (data.hasOwnProperty('unitOrder') && unitRes.rows[0].unitOrder !== data.unitOrder) {
            if (data.unitOrder > unitsRes.length) {
                data.unitOrder = unitsRes.length;
            }
            if (data.unitOrder < 1) {
                data.unitOrder = 1;
            }
    
            // Update the target unit's order
            await db.query(
                `UPDATE units SET
                    unit_order=$1
                    WHERE id=$2`,
                [
                    data.unitOrder,
                    id
                ]
            );
    
            // Update the surrounding units' orders
            if (unitRes.rows[0].unitOrder < data.unitOrder) {
                await db.query(
                    `UPDATE units SET
                        unit_order = unit_order - 1
                    WHERE course_id=$1
                    AND unit_order > $2
                    AND unit_order <= $3
                    AND id <> $4`,
                    [
                        unitRes.rows[0].courseId,
                        unitRes.rows[0].unitOrder,
                        data.unitOrder,
                        id
                    ]
                );
            } else {
                await db.query(
                    `UPDATE units SET
                        unit_order = unit_order + 1
                    WHERE course_id=$1
                    AND unit_order < $2
                    AND unit_order >= $3
                    AND id <> $4`,
                    [
                        unitRes.rows[0].courseId,
                        unitRes.rows[0].unitOrder,
                        data.unitOrder,
                        id
                    ]
                );
            }
        }
    

        const {setCols, values} =sqlForPartialUpdate(
            data,
            {
                title: 'title',
                unitOrder:'unit_order'
            }
        );
        const handleVarIdx = "$" + (values.length + 1);

        const querySql = `UPDATE units 
                          SET ${setCols}
                          WHERE id = ${handleVarIdx}
                          RETURNING id,
                                    title,
                                    course_id AS "courseId",
                                    unit_order AS "unitOrder"`;
        
        const result = await db.query(querySql,[...values,id]);
        
        return result.rows[0];
    }

    /** Return array of lesson data given unit_id:
    *
    * => [ {id, title, lesson_order, lesson_type, lesson_url}, ... ]
    *
    * */

    static async lessons(unitId){
        const res = await db.query(`SELECT id FROM units WHERE id=$1`,[unitId]);
        if(res.rows.length===0) throw {message: 'could not find unit', status:404}
        
        const result = await db.query(
            `SELECT id,
                    title,
                    lesson_order AS "lessonOrder",
                    lesson_type AS "lessonType",
                    lesson_url AS "lessonURL"
            FROM lessons
            WHERE unit_id=$1
            ORDER BY lesson_order`,
            [unitId]
        )
        return result.rows;
    }
}

module.exports = Unit;