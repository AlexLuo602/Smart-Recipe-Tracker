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
    sanitize.sanitizeQuery(allParams);
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
    deleteFromStep
};