const express = require('express');
const exerciseService = require('./excercisesService.js');

const router = express.Router();

router.get('/exercises', async (req, res) => {
    const tableContent = await exerciseService.fetchExercisesFromDb();
    res.json({ data: tableContent });
});

router.get('/averageBurntCalories', async (req, res) => {
    const averageBurntCalories = await exerciseService.averageCaloriesBurned();
    res.json({ data: averageBurntCalories });
});

router.get('/highCalorieExercises', async (req, res) => {
    const exercises = await exerciseService.getHighCalorieExercises();
    res.json({ data: exercises });
});

router.post("/insert-exercise-record", async (req, res) => {
    const { excercise_record_id, exercise_record_date, calories_burned, type, user_id } = req.body;
    const insertResult = await exerciseService.insertExerciseRecord(excercise_record_id, exercise_record_date, calories_burned, type, user_id);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-exercise-record", async (req, res) => {
    const ToUpdate = {};
    const body = req.body;
    for (const attribute in body) {
        if (attribute !== "excercise_record_id" && body[attribute] !== "") {
            ToUpdate[attribute] = body[attribute];
        }
    }
    const updateResult = await exerciseService.updateExerciseRecord(body["excercise_record_id"], ToUpdate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-from-exercise-record", async (req, res) => {
    const { excercise_record_id } = req.body;
    const deleteResult = await exerciseService.deleteFromExerciseRecord(excercise_record_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

module.exports = router;