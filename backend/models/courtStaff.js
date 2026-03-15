const mongoose = require('mongoose');

const courtStaffSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    passwordHash: {
        type: String,
        required: true,
    },
    courtName: {
        type: String,
        required: true,
    },
    district: {
        type: String,
        required: true,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});

courtStaffSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

courtStaffSchema.set('toJSON', {
    virtuals: true,
});

exports.CourtStaff = mongoose.model('CourtStaff', courtStaffSchema);
exports.courtStaffSchema = courtStaffSchema;
