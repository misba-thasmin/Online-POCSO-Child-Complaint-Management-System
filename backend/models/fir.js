const mongoose = require('mongoose');

const firSchema = new mongoose.Schema({
    firNumber: {
        type: String,
        required: true,
        unique: true,
    },
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true,
    },
    policeStation: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
        required: true,
    },
    investigatorName: {
        type: String,
        required: true,
    },
    documentPath: {
        type: String,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

firSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

firSchema.set('toJSON', {
    virtuals: true,
});

exports.FIR = mongoose.model('FIR', firSchema);
