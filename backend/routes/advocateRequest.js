const { AdvocateRequest } = require('../models/advocateRequest');
const express = require('express');
const router = express.Router();

// Get all requests
router.get('/', async (req, res) => {
    const requestList = await AdvocateRequest.find().populate('userId', 'name email').populate('advocateId', 'name service mobile').populate('complaintId');
    if (!requestList) {
        res.status(500).json({ success: false });
    }
    res.send(requestList);
});

// Get requests for a specific advocate
router.get('/advocate/:advocateId', async (req, res) => {
    const requests = await AdvocateRequest.find({ advocateId: req.params.advocateId }).populate('userId', 'name email phone').populate('complaintId');
    if (!requests) {
        res.status(500).json({ success: false });
    }
    res.send(requests);
});

// Get requests by a specific user
router.get('/user/:userId', async (req, res) => {
    const requests = await AdvocateRequest.find({ userId: req.params.userId }).populate('advocateId', 'name service mobile city').populate('complaintId');
    if (!requests) {
        res.status(500).json({ success: false });
    }
    res.send(requests);
});

// Create a new request
router.post('/', async (req, res) => {
    let request = new AdvocateRequest({
        userId: req.body.userId,
        advocateId: req.body.advocateId,
        complaintId: req.body.complaintId,
        caseDescription: req.body.caseDescription,
        status: 'Pending'
    });

    request = await request.save();

    if (!request)
        return res.status(400).send('The request cannot be created!');

    res.send(request);
});

// Update request status
router.put('/:id/status', async (req, res) => {
    const request = await AdvocateRequest.findByIdAndUpdate(
        req.params.id,
        {
            status: req.body.status
        },
        { new: true }
    );

    if (!request)
        return res.status(400).send('The request cannot be updated!');

    res.send(request);
});

module.exports = router;
