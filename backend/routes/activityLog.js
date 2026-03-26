const { ActivityLog } = require('../models/activityLog');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const logs = await ActivityLog.find().sort({ timestamp: -1 });
        if(!logs) {
            return res.status(500).json({ success: false });
        }
        res.status(200).send(logs);
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
