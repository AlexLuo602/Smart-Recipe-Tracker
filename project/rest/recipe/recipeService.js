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

module.exports = {
    insertRecipe,
    fetchRecipesFromDb,
    selectRecipes
};

