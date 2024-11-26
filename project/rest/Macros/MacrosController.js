const express = require('express');
const macrosService = require('./MacrosService');

const router = express.Router();

// ----------------------------------------------------------
// API endpoints
// Modify or extend these routes based on your project's needs.
router.get('/macros', async (req, res) => {
    const tableContent = await macrosService.fetchMacrosFromDb();
    res.json({data: tableContent});
});

router.post("/insert-macros", async (req, res) => {
    const { macro_id, fiber, sugar, fat, carbohydrates, protein, calories } = req.body;
    const insertResult = await macrosService.insertMacros(macro_id, fiber, sugar, fat, carbohydrates, protein, calories);
    if (insertResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.post("/update-macros", async (req, res) => {
    const ToUpdate = {};
    const body = req.body;
    for (const attribute in body) {
        if (attribute !== "macro_id" && body[attribute] !== "") {
            ToUpdate[attribute] = body[attribute];
        }
    }
    const updateResult = await macrosService.updateMacros(body["macro_id"], ToUpdate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

router.delete("/delete-from-macros", async (req, res) => {
    const {macro_id} = req.body;
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