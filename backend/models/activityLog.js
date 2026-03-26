const mongoose = require('mongoose');

const activityLogSchema = mongoose.Schema({
    userRole: {
        type: String, // 'Admin', 'Officer', 'User', 'Advocate', 'Court'
        required: true
    },
    userId: {
        type: String, // The email, ID, or generic role identifier
        required: true
    },
    action: {
        type: String, // e.g., 'Complaint Submitted', 'Status Updated', 'Evidence Uploaded'
        required: true
    },
    description: {
        type: String, // Detailed message
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

exports.ActivityLog = mongoose.model('ActivityLog', activityLogSchema);
