const oracledb = require('oracledb');

// ----------------------------------------------------------
// Wrapper to manage OracleDB actions, simplifying connection handling.
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection(); // Gets a connection from the default pool 
        return await action(connection);
    } catch (err) {
        console.error(err);
        throw err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.

async function fetchExercisesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ExerciseRecord');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function averageCaloriesBurned() {
    return await withOracleDB(async (connection) => {
        const query = `
        SELECT type, AVG(calories_burned) AS avg_calories
        FROM ExerciseRecord
        GROUP BY type
        `;
        const result = await connection.execute(query);
        return result.rows;
    }).catch(() => {
        console.log("")
        return -1;
    });
}


async function insertExerciseRecord(excercise_record_id, exercise_record_date, calories_burned, type, user_id) {
    return await withOracleDB(async (connection) => {
        console.log("HERe's the date: ")
        console.log('exercise_record_date:', exercise_record_date);
        const result = await connection.execute(
            `INSERT INTO ExerciseRecord (excercise_record_id, exercise_record_date, calories_burned, type, user_id) VALUES (:excercise_record_id, TO_DATE(:exercise_record_date, 'YYYY-MM-DD'), :calories_burned, :type, :user_id)`,
            [excercise_record_id, exercise_record_date, calories_burned, type, user_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateExerciseRecord(excercise_record_id, ToUpdate) {
    const valClause = Object.entries(ToUpdate).map(([attribute, val]) => `${attribute}=:${attribute}`).join(", ");
    if (valClause == "") return false;

    const values = Object.values(ToUpdate);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE ExerciseRecord SET ${valClause} WHERE excercise_record_id=:excercise_record_id`,
            [...values, excercise_record_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteExerciseRecord(excercise_record_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM ExerciseRecord WHERE excercise_record_id=:excercise_record_id`,
            [excercise_record_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


module.exports = {
    averageCaloriesBurned,
    deleteExerciseRecord,
    updateExerciseRecord,
    insertExerciseRecord,
    fetchExercisesFromDb
};
