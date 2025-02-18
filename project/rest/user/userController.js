const express = require('express');
const userService = require('./userService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/userinfo', async (req, res) => {
    const tableContent = await userService.fetchUserInfoFromDb();
    res.json({data: tableContent});
});

router.post("/insert-userinfo", async (req, res) => {
    const { user_id, username, weight, height, gender, age, recommended_calorie_intake } = req.body;
    const insertResult = await userService.insertUserInfo(user_id, username, weight, height, gender, age, recommended_calorie_intake);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-userinfo", async (req, res) => {
    const ToUpdate = {};
    body = req.body;
    for (const attribute in body) {
        if (attribute !== "user_id" && body[attribute] !== "") {
            ToUpdate[attribute] = body[attribute];
        }
    }
    const updateResult = await userService.updateUserInfo(body["user_id"], ToUpdate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-from-userinfo", async (req, res) => {
    const {user_id} = req.body;
    const deleteResult = await userService.deleteFromUserInfo(user_id);
    if (deleteResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.get('/count-userinfo', async (req, res) => {
    const tableCount = await userService.countUserInfo();
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

router.get('/users-with-more-than-three-meals', async (req, res) => {
    try {
    console.log("UBIN")
      const records = await userService.findUsersWithMoreThanThreeMeals();
      res.json({ data: records });
    } catch (err) {
      console.error('Error fetching meal records:', err);
      res.status(500).json({ error: 'Error while fetching meal records' });
    }
});

router.get('/users-with-all-exercises', async (req, res) => {
    try {
        const users = await userService.findUsersWithAllExercises();
        res.json({ data: users });
    } catch (err) {
        console.error('Error fetching users with all exercises:', err);
        res.status(500).json({ error: 'Error fetching users with all exercises' });
    }
});
module.exports = router;