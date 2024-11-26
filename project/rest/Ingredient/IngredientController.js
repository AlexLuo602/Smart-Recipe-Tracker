const express = require('express');
const ingredientService = require('./IngredientService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/ingredient', async (req, res) => {
    const tableContent = await ingredientService.fetchIngredientsFromDb();
    res.json({ data: tableContent });
});

router.post('/insert-ingredient', async (req, res) => {
    const { name, brand, taste, food_type, macro_id } = req.body;
    const insertResult = await ingredientService.insertIngredient(name, brand, taste, food_type, macro_id);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/update-ingredient', async (req, res) => {
    const ToUpdate = {};
    const body = req.body;
    for (const attribute in body) {
        if (!['name', 'brand'].includes(attribute) && body[attribute] !== '') {
            ToUpdate[attribute] = body[attribute];
        }
    }
    const updateResult = await ingredientService.updateIngredient(body['name'], body['brand'], ToUpdate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete('/delete-from-ingredient', async (req, res) => {
    const { name, brand } = req.body;
    const deleteResult = await ingredientService.deleteFromIngredient(name, brand);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-ingredient', async (req, res) => {
    const tableCount = await ingredientService.countIngredients();
    if (tableCount >= 0) {
        res.json({
            success: true,
            count: tableCount
        });
    } else {
        res.status(500).json({
            success: false,
            count: tableCount
        });
    }
});

module.exports = router;