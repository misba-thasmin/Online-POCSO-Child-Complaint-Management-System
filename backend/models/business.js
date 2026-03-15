const mongoose = require('mongoose');

const businessSchema = mongoose.Schema({
    advocateemail: {
        type: String,
        required: true,    
    },
    name: {
        type: String,
        required: true,    
    },
    service: {
        type: String,
        required: true,    
    },
    available : {
        type: String,
        required: true,    
    },
    locality: {
        type: String,
        required: true,    
    },
    address: {
        type: String,
        required: true,    
    },
    city: {
        type: String
    },
    mobile: {
        type: Number,
        required: true,    
    },
    lat: {
        type: Number,  
        default: 0,         
    },
    long: {
        type: Number,
        default: 0,   
    },
    status: {
        type: String,
        default: 'Pending',   
    },
    profilePhoto: {
        type: String,
        default: ''
    },
    experience: {
        type: Number,
        default: 0
    },
    barCouncilNumber: {
        type: String,
        default: ''
    },
    totalCasesHandled: {
        type: Number,
        default: 0
    },
    completedCases: {
        type: Number,
        default: 0
    },
    successRate: {
        type: String,
        default: '0%'
    },
    caseTypes: [{
        type: String
    }],
    portfolio: [{
        title: String,
        description: String,
        caseType: String
    }],
    dateCreated: {
        type: Date,
        default: Date.now,
    }
})


businessSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

businessSchema.set('toJSON', {
    virtuals: true,
});


exports.Business = mongoose.model('Business', businessSchema);
