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

async function fetchRecipesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Recipe');
        return result.rows;
    }).catch(() => []);
}

async function insertRecipe(recipe_id, name) {
    const allParams = `${recipe_id}, ${name}`;
    sanitize.sanitizeDropTable(allParams);
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `INSERT INTO Recipe (recipe_id, name) VALUES (:recipe_id, :name)`,
            [recipe_id, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => false);
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
        'recipe_id': 'recipe_id',
        'name': 'name',
        'Recipe ID': 'recipe_id',
        'Name': 'name'
    };
    // Removed duplicated and invalid code below
    // if (!tokens) {
    //     'Recipe ID': 'recipe_id',
    //     'Name': 'name'
    // };
    
    const tokens = conditionString.match(/\w+|'[^']*'|=|AND|OR/g);
    if (!tokens) {
        throw new Error('Invalid input');
    }

    let query = 'SELECT * FROM Recipe WHERE ';
    let params = {};
    let paramIndex = 0;

    for (let i = 0; i < tokens.length; ) {
        let token = tokens[i];

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

async function selectRecipes(recipeId) {
    return await withOracleDB(async (connection) => {
        console.log(recipeId)
        try {
            const query = `
                SELECT r.name AS recipe_name, step.step_number, step.description
                FROM Step step
                JOIN Recipe r ON step.recipe_id = r.recipe_id
                WHERE r.recipe_id = :recipeId
            `;
            const result = await connection.execute(query, { recipeId }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
            return result.rows;
        } catch (err) {
            console.error('Error fetching steps for recipe:', err);
            throw err;
        }
    })
}

async function deleteFromRecipe(recipe_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Recipe WHERE recipe_id=:recipe_id`,
            [recipe_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteFromStep(step_number, recipe_id) {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute(
            `DELETE FROM Step WHERE step_number=:step_number AND recipe_id=:recipe_id`,
            [step_number, recipe_id],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

module.exports = {
    insertRecipe,
    fetchRecipesFromDb,
    selectRecipes,
    deleteFromRecipe,
    deleteFromStep,
    searchRecipes
};