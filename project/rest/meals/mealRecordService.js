const oracledb = require('oracledb');

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
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO MealRecord (meal_record_id, meal_record_date, user_id, recipe_id) VALUES (:meal_record_id, :meal_record_date, :user_id, :recipe_id)`,
            [meal_record_id, meal_record_date, user_id, recipe_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
}

async function updateMealRecord(meal_record_id, ToUpdate) {
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

module.exports = {
    fetchMealRecordsFromDb,
    insertMealRecord,
    updateMealRecord,
    deleteFromMealRecords,
    countMealRecords,
};
