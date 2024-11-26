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
async function fetchUserInfoFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM UserInfo');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertUserInfo(user_id, username, weight, height, gender, age, rci) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO UserInfo (user_id, username, weight, height, gender, age, recommended_calorie_intake) VALUES (:user_id, :username, :weight, :height, :gender, :age, :rci)`,
            [user_id, username, weight, height, gender, age, rci],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateUserInfo(user_id, ToUpdate) {
    const valClause = Object.entries(ToUpdate).map(([attribute, val]) => `${attribute}=:${attribute}`).join(", ");
    if (valClause == "") return false;

    const values = Object.values(ToUpdate);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE UserInfo SET ${valClause} where user_id=:user_id`,
            [...values, user_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteFromUserInfo(user_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM UserInfo WHERE user_id=:user_id`,
            [user_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countUserInfo() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM UserInfo');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    fetchUserInfoFromDb,
    insertUserInfo,
    updateUserInfo,
    deleteFromUserInfo,
    countUserInfo
};