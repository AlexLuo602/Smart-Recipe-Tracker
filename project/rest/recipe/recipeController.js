const express = require('express');
const recipeService = require('./recipeService');

const router = express.Router();

router.get('/recipes', async (req, res) => {
    const records = await recipeService.fetchRecipesFromDb();
    res.json({ data: records });
});

router.post('/insert-recipe', async (req, res) => {
    const { recipe_id, name } = req.body;
    const result = await recipeService.insertRecipe(recipe_id, name);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/search-recipes', async (req, res) => {
    const conditionString = req.body.conditionString;
    try {
        const records = await recipeService.searchRecipes(conditionString);
        res.json({ data: records });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;