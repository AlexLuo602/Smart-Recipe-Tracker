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

async function fetchRecipesFromDb() {
    return await withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Recipe');
        return result.rows;
    }).catch(() => []);
}

async function insertRecipe(recipe_id, name) {
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

module.exports = {
    insertRecipe,
    fetchRecipesFromDb,
    searchRecipes
};