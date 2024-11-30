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

router.delete("/delete-from-recipe", async (req, res) => {
    const {recipe_id} = req.body;
    const deleteResult = await recipeService.deleteFromRecipe(recipe_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-from-step", async (req, res) => {
    const {step_number, recipe_id} = req.body;
    const deleteResult = await recipeService.deleteFromStep(step_number, recipe_id);
    if (deleteResult) {
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