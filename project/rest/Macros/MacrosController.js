const express = require('express');
const goalService = require('./goalsService');
const macrosService = require('./MacrosService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints for Goals
router.get('/goals', async (req, res) => {
    const tableContent = await goalService.fetchGoalsFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-goal", async (req, res) => {
    const { goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id } = req.body;
    const insertResult = await goalService.insertGoal(goal_id, start_date, end_date, goals_type, value_diff, user_id, macro_id);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-goal", async (req, res) => {
    const ToUpdate = {};
    const body = req.body;
    for (const attribute in body) {
        if (attribute !== "goal_id" && body[attribute] !== "") {
            ToUpdate[attribute] = body[attribute];
        }
    }
    const updateResult = await goalService.updateGoal(body["goal_id"], ToUpdate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-from-goals", async (req, res) => {
    const { goal_id } = req.body;
    const deleteResult = await goalService.deleteFromGoals(goal_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-goals', async (req, res) => {
    const tableCount = await goalService.countGoals();
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

// API endpoints for Macros
router.get('/macros', async (req, res) => {
    const tableContent = await macrosService.fetchMacrosFromDb();
    res.json({ data: tableContent });
});

router.post("/insert-macro", async (req, res) => {
    const { macro_id, fiber, sugar, fat, carbohydrates, protein, calories } = req.body;
    const insertResult = await macrosService.insertMacro(macro_id, fiber, sugar, fat, carbohydrates, protein, calories);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-macro", async (req, res) => {
    const ToUpdate = {};
    const body = req.body;
    for (const attribute in body) {
        if (attribute !== "macro_id" && body[attribute] !== "") {
            ToUpdate[attribute] = body[attribute];
        }
    }
    const updateResult = await macrosService.updateMacro(body["macro_id"], ToUpdate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-from-macros", async (req, res) => {
    const { macro_id } = req.body;
    const deleteResult = await macrosService.deleteFromMacros(macro_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-macros', async (req, res) => {
    const tableCount = await macrosService.countMacros();
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