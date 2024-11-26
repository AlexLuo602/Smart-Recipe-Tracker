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
async function fetchIngredientsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Ingredient');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertIngredient(name, brand, taste, food_type, macro_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Ingredient (name, brand, taste, food_type, macro_id) VALUES (:name, :brand, :taste, :food_type, :macro_id)`,
            [name, brand, taste, food_type, macro_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function updateIngredient(name, brand, ToUpdate) {
    const valClause = Object.entries(ToUpdate).map(([attribute, val]) => `${attribute}=:${attribute}`).join(", ");
    if (valClause == "") return false;

    const values = Object.values(ToUpdate);

    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Ingredient SET ${valClause} WHERE name=:name AND brand=:brand`,
            [...values, name, brand],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteFromIngredient(name, brand) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Ingredient WHERE name=:name AND brand=:brand`,
            [name, brand],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function countIngredients() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT COUNT(*) FROM Ingredient');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    fetchIngredientsFromDb,
    insertIngredient,
    updateIngredient,
    deleteFromIngredient,
    countIngredients
};