const oracledb = require('oracledb');
const sanitize = require('../sanitization')

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
async function fetchGoalsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Goals');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertGoal(goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id) {
    const allParams = `${goal_id}, ${start_date}, ${end_date}, ${goals_type}, ${value_diff}, ${user_id}, ${macro_id}`;
    sanitize.sanitizeQuery(allParams);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Goals (goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id) VALUES (:goal_id, :start_date, :end_date, :goals_type, :value_diff, :user_id, :macro_id)`,
            [goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateGoal(goal_id, ToUpdate) {
    const allParams = `${goal_id}, ${ToUpdate}`;
    sanitize.sanitizeQuery(allParams);
    const valClause = Object.entries(ToUpdate).map(([attribute, val]) => `${attribute}=:${attribute}`).join(", ");
    if (valClause == "") return false;

    const values = Object.values(ToUpdate);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Goals SET ${valClause} WHERE goal_id=:goal_id`,
            [...values, goal_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteFromGoals(goal_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Goals WHERE goal_id=:goal_id`,
            [goal_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countGoals() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT COUNT(*) FROM Goals');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    fetchGoalsFromDb,
    insertGoal,
    updateGoal,
    deleteFromGoals,
    countGoals
};