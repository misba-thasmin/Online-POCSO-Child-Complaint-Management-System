const mongoose = require('mongoose');

const courtCaseSchema = new mongoose.Schema({
    caseNumber: {
        type: String,
        required: true,
        unique: true,
    },
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true,
    },
    firId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FIR',
    },
    courtName: {
        type: String,
        required: true,
    },
    judgeName: {
        type: String,
    },
    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Pending', 'Closed'],
    },
    judgment: {
        verdict: { type: String },
        punishment: { type: String },
        date: { type: Date },
        documentPath: { type: String },
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

courtCaseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

courtCaseSchema.set('toJSON', {
    virtuals: true,
});

exports.CourtCase = mongoose.model('CourtCase', courtCaseSchema);
