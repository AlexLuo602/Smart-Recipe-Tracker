const oracledb = require('oracledb');
const sanitize = require('../sanitization')

// Wrapper for OracleDB actionsss
async function withOracleDB(action) {
    let connection;
    try {
        connection = await oracledb.getConnection();
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

async function fetchMealRecordsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM MealRecord');
        return result.rows;
    }).catch(() => []);
}

async function insertMealRecord(meal_record_id, meal_record_date, user_id, recipe_id) {
    const allParams = `${meal_record_id}, ${meal_record_date}, ${user_id}, ${recipe_id}`;
    sanitize.sanitizeDropTable(allParams);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO MealRecord (meal_record_id, meal_record_date, user_id, recipe_id) VALUES (:meal_record_id, TO_DATE(:meal_record_date, 'YYYY-MM-DD'), :user_id, :recipe_id)`,
            [meal_record_id, meal_record_date, user_id, recipe_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateMealRecord(meal_record_id, ToUpdate) {
    const allParams = `${meal_record_id}, ${ToUpdate}`;
    sanitize.sanitizeDropTable(allParams);
    const valClause = Object.entries(ToUpdate)
        .map(([attribute, val]) => `${attribute}=:${attribute}`)
        .join(", ");
    if (valClause == "") return false;

    const values = Object.values(ToUpdate);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE MealRecord SET ${valClause} WHERE meal_record_id=:meal_record_id`,
            [...values, meal_record_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function deleteFromMealRecords(meal_record_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM MealRecord WHERE meal_record_id=:meal_record_id`,
            [meal_record_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function countMealRecords() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT COUNT(*) FROM MealRecord');
        return result.rows[0][0];
    }).catch(() => -1);
}

async function getMealsForUser(userId) {
    const allParams = `${userId}`;
    sanitize.sanitizeDropTable(allParams);
    return await withOracleDB(async (connection) => {
        console.log(userId)
        try {
            const query = `
                SELECT mr.meal_record_id, mr.meal_record_date, mr.recipe_id, r.name AS recipe_name
                FROM MealRecord mr
                JOIN Recipe r ON mr.recipe_id = r.recipe_id
                WHERE mr.user_id = :userId
            `;
            const result = await connection.execute(query, { userId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
            return result.rows;
        } catch (err) {
            console.error('Error fetching meals for user:', err);
            throw err;
        }
    })
}

module.exports = {
    fetchMealRecordsFromDb,
    insertMealRecord,
    updateMealRecord,
    deleteFromMealRecords,
    countMealRecords,
    getMealsForUser,
};
