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
async function fetchIngredientsFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Ingredient');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function insertIngredient(name, brand, taste, food_type, macro_id) {
    const allParams = `${name}, ${brand}, ${taste}, ${food_type}, ${macro_id}`;
    sanitize.sanitizeDropTable(allParams);
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
    const allParams = `${name}, ${brand}, ${ToUpdate}`;
    sanitize.sanitizeDropTable(allParams);
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

async function searchRecipes(conditionString) {
    return await withOracleDB(async (connection) => {
        const { query, params } = buildSearchQuery(conditionString);
        const result = await connection.execute(query, params);
        return result.rows;
    }).catch(() => []);
}

// Helper function to parse and build the query
function buildSearchQuery(conditionString) {
    const fieldMap = {
        'name': 'name',
        'Name': 'name',
        'Brand': 'brand',
        'brand': 'brand',
        'Taste': 'taste',
        'taste': 'taste',
        'macro id': 'macro_id',
        'Macro ID': 'recipe_id',
        'Food Type': 'food_type',
        'Food type': 'food_type',
        'food type': 'food_type'
    };
    
    const tokens = conditionString.match(/\w+|'[^']*'|=|AND|OR/g);
    if (!tokens) {
        throw new Error('Invalid input');
    }

    let query = 'SELECT * FROM Ingredient WHERE ';
    let params = {};
    let paramIndex = 0;

    for (let i = 0; i < tokens.length; ) {
        let token = tokens[i];
        if (token.startsWith("'") && token.endsWith("'")) {
            token = token.slice(1, -1);
        }
        console.log(token);

        if (fieldMap[token]) {
            let field = fieldMap[token];
            i++;

            if (tokens[i] !== '=') {
                throw new Error('Expected "=" after field');
            }
            i++;

            if (i >= tokens.length) {
                throw new Error('Expected value after "="');
            }

            let valueToken = tokens[i];
            if (valueToken.startsWith("'") && valueToken.endsWith("'")) {
                valueToken = valueToken.slice(1, -1);
            }

            const paramName = `param${paramIndex}`;
            query += `${field} = :${paramName} `; // Include colon here
            params[paramName] = valueToken;        // Exclude colon in param name
            paramIndex++;
            i++;

        } else if (token === 'AND' || token === 'OR') {
            query += `${token} `;
            i++;
        } else {
            throw new Error('Invalid token in condition string');
        }
    }

    return { query, params };
}

async function getSelectedFields(fields) {
    const selectedFields = fields.join(", "); // Format the selected fields for SQL

    return await withOracleDB(async (connection) => {
        const query = `SELECT ${selectedFields} FROM Ingredient`;
        const queryResult = await connection.execute(query);

        return queryResult.rows.map(row => {
            const formattedRow = {};
            fields.forEach((field, index) => {
                formattedRow[field] = row[index];
            });
            return formattedRow;
        });
    }).catch((error) => {
        console.error("Error fetching fields:", error);
        return [];
    });
}

module.exports = {
    fetchIngredientsFromDb,
    insertIngredient,
    updateIngredient,
    deleteFromIngredient,
    countIngredients,
    searchRecipes,
    getSelectedFields
};