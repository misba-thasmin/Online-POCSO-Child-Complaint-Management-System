const mongoose = require('mongoose');

const advocateRequestSchema = mongoose.Schema({
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
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    caseDescription: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected', 'Completed'],
        default: 'Pending'
    },
    requestDate: {
        type: Date,
        default: Date.now
    }
});

advocateRequestSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

advocateRequestSchema.set('toJSON', {
    virtuals: true,
});

exports.AdvocateRequest = mongoose.model('AdvocateRequest', advocateRequestSchema);
