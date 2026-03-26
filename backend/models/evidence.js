const mongoose = require('mongoose');

const evidenceSchema = mongoose.Schema({
    complaintId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Complaint',
        required: true
    },
    uploadedBy: {
        type: String,
        required: true,
        enum: ['User', 'Officer', 'Advocate']
    },
    uploaderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    fileType: {
        type: String, // 'image', 'video', 'document'
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

evidenceSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

evidenceSchema.set('toJSON', {
    virtuals: true,
});

exports.Evidence = mongoose.model('Evidence', evidenceSchema);
