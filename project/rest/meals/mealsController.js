const express = require('express');
const mealRecordService = require('./mealRecordService');

const router = express.Router();

router.get('/meal-records', async (req, res) => {
    const records = await mealRecordService.fetchMealRecordsFromDb();
    res.json({ data: records });
});

router.post('/insert-meal-record', async (req, res) => {
    const { meal_record_id, meal_record_date, user_id, recipe_id } = req.body;
    const result = await mealRecordService.insertMealRecord(meal_record_id, meal_record_date, user_id, recipe_id);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post('/update-meal-record', async (req, res) => {
    const ToUpdate = {};
    const body = req.body;
    for (const attribute in body) {
        if (attribute !== "meal_record_id" && body[attribute] !== "") {
            ToUpdate[attribute] = body[attribute];
        }
    }
    const result = await mealRecordService.updateMealRecord(body["meal_record_id"], ToUpdate);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete('/delete-meal-record', async (req, res) => {
    const { meal_record_id } = req.body;
    const result = await mealRecordService.deleteFromMealRecords(meal_record_id);
    if (result) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-meal-records', async (req, res) => {
    const count = await mealRecordService.countMealRecords();
    if (count >= 0) {
        res.json({ success: true, count });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/meal-records', async (req, res) => {
    const records = await mealRecordService.fetchMealRecordsFromDb();
    res.json({ data: records });
});

router.post('/get-meals-for-user', async (req, res) => {
    const { user_id } = req.body;
    console.log("CHUAIJMKJHUBGBHINUYG")
    console.log(user_id)
    try {
        const records = await mealRecordService.getMealsForUser(Number(user_id));
        res.json({ data: records });
    } catch (error) {
        console.error('Error fetching meal records:', error);
        res.status(500).json({ error: 'Failed to fetch meal records.' });
    }
});

module.exports = router;
