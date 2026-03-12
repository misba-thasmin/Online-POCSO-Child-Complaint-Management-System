const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    
    
    useremail: {
        type: String,
        required: true,    
    },
    name: {
        type: String,
        required: true,    
    },
    mobile: {
        type: Number,
        required: true,    
    },
    address: {
        type: String,
        required: true,    
    },
    district: {
        type: String,
        required: true,    
    },
    location: {
        type: String,
        required: true,    
    },
    department: {
        type: String,
        required: true,    
    },
    writecomplaint: {
        type: String,
        required:  true,    
    },
    
    status: {
        type: String,
        default: 'Pending',   
    },

    reason: {
        type: String,
        default: 'Nil',   
    },

    remedies: {
        type: String,
        default: 'Nil', 
    },
    notes: {
        type: String,
        default: 'Nil',   
    },

    lat: {
        type: Number,  
        default: 0,         
    },
    long: {
        type: Number,
        default: 0,
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    assignedOfficerId: {
        type: String,
        default: null,
    },
    assignedOfficerName: {
        type: String,
        default: null,
    },
    assignedAt: {
        type: Date,
        default: null,
    },
  
    imagePath: {
        type: String, // Assuming imagePath is a string containing the path to the image file
                         // Optional: Provide a default value if no image is uploaded
      },

      image1: {
        type: String, // Assuming imagePath is a string containing the path to the image file
                         // Optional: Provide a default value if no image is uploaded
      },




})


complaintSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

complaintSchema.set('toJSON', {
    virtuals: true,
});


exports.Complaint = mongoose.model('Complaint', complaintSchema);
