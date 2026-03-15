const { Notification } = require('../models/notification');
const express = require('express');
const router = express.Router();

// Get active notifications for a specific user
router.get('/:userId', async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.params.userId }).sort({ date: -1 });
        if (!notifications) {
            return res.status(404).json({ success: false });
        }
        res.status(200).send(notifications);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Mark notification as read
router.put('/mark-read/:id', async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
        );
        if (!notification) {
            return res.status(400).send('the notification cannot be updated!');
        }
        res.send(notification);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Mark all as read for user
router.put('/mark-all-read/:userId', async (req, res) => {
    try {
        await Notification.updateMany(
            { userId: req.params.userId, read: false },
            { $set: { read: true } }
        );
        res.status(200).send({ success: true, message: 'All marked as read' });
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

// Create notification (Usually called internally by other API routes, but good to have)
router.post('/', async (req, res) => {
    try {
        let notification = new Notification({
            userId: req.body.userId,
            userType: req.body.userType || 'User',
            message: req.body.message,
            link: req.body.link || ''
        });
        notification = await notification.save();
        if (!notification) return res.status(400).send('the notification cannot be created!');
        res.status(201).send(notification);
    } catch (err) {
        res.status(500).json({ success: false, error: err });
    }
});

module.exports = router;
