const mongoose = require('mongoose');

const courtActivitySchema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    userRole: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
    },
    targetId: {
        type: String, // Context ID, e.g., Complaint ID or Case ID
    },
    details: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

courtActivitySchema.virtual('id').get(function () {
    return this._id.toHexString();
});

courtActivitySchema.set('toJSON', {
    virtuals: true,
});

exports.CourtActivity = mongoose.model('CourtActivity', courtActivitySchema);
