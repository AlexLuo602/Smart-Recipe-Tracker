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


module.exports = router;