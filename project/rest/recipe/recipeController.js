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

router.post('/select-recipes', async (req, res) => {
    const { recipe_id } = req.body;
    console.log("CHUAIJMKJHUBGBHINUYG")
    console.log(recipe_id)
    try {
        const records = await recipeService.selectRecipes(Number(recipe_id));
        res.json({ data: records });
    } catch (error) {
        console.error('Error fetching steps:', error);
        res.status(500).json({ error: 'Failed to fetch steps.' });
    }
});

module.exports = router;