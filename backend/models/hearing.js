const mongoose = require('mongoose');

const hearingSchema = new mongoose.Schema({
    caseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'CourtCase',
        required: true,
    },
    hearingDate: {
        type: Date,
        required: true,
    },
    courtName: {
        type: String,
        required: true,
    },
    notes: {
        type: String,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Postponed', 'Rescheduled'],
        default: 'Scheduled'
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

hearingSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

hearingSchema.set('toJSON', {
    virtuals: true,
});

exports.Hearing = mongoose.model('Hearing', hearingSchema);
