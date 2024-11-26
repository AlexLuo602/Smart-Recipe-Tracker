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
async function fetchMacrosFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Macros');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertMacro(macro_id, fiber, sugar, fat, carbohydrates, protein, calories) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Macros (macro_id, fiber, sugar, fat, carbohydrates, protein, calories) VALUES (:macro_id, :fiber, :sugar, :fat, :carbohydrates, :protein, :calories)`,
            [macro_id, fiber, sugar, fat, carbohydrates, protein, calories],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateMacro(macro_id, ToUpdate) {
    const valClause = Object.entries(ToUpdate).map(([attribute, val]) => `${attribute}=:${attribute}`).join(", ");
    if (valClause == "") return false;
    const values = Object.values(ToUpdate);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Macros SET ${valClause} WHERE macro_id=:macro_id`,
            [...values, macro_id],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteFromMacros(macro_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Macros WHERE macro_id=:macro_id`,
            [macro_id],
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countMacros() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT COUNT(*) FROM Macros');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    fetchMacrosFromDb,
    insertMacro,
    updateMacro,
    deleteFromMacros,
    countMacros
};