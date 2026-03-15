const mongoose = require('mongoose');

const advocateRatingSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    advocateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    feedback: {
        type: String,
        required: true
    },
    dateSubmitted: {
        type: Date,
        default: Date.now
    }
});

advocateRatingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

advocateRatingSchema.set('toJSON', {
    virtuals: true,
});

exports.AdvocateRating = mongoose.model('AdvocateRating', advocateRatingSchema);
