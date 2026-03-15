const { AdvocateRating } = require('../models/advocateRating');
const express = require('express');
const router = express.Router();

// Get ratings for a specific advocate
router.get('/advocate/:advocateId', async (req, res) => {
    const ratings = await AdvocateRating.find({ advocateId: req.params.advocateId }).populate('userId', 'name').sort({'dateSubmitted': -1});
    
    if (!ratings) {
        res.status(500).json({ success: false });
    }
    
    // Calculate average rating
    let averageRating = 0;
    if (ratings.length > 0) {
        const sum = ratings.reduce((acc, current) => acc + current.rating, 0);
        averageRating = (sum / ratings.length).toFixed(1);
    }

    res.send({
        ratings,
        averageRating,
        totalReviews: ratings.length
    });
});

// Create a new rating
router.post('/', async (req, res) => {
    // Check if user already rated this advocate
    const existingRating = await AdvocateRating.findOne({
        userId: req.body.userId,
        advocateId: req.body.advocateId
    });

    if (existingRating) {
        return res.status(400).send('You have already rated this advocate');
    }

    let rating = new AdvocateRating({
        userId: req.body.userId,
        advocateId: req.body.advocateId,
        rating: req.body.rating,
        feedback: req.body.feedback
    });

    rating = await rating.save();

    if (!rating)
        return res.status(400).send('The rating cannot be added!');

    res.send(rating);
});

module.exports = router;
