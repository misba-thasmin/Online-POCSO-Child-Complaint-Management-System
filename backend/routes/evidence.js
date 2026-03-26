const { Evidence } = require('../models/evidence');
const { Complaint } = require('../models/complaint');
const { ActivityLog } = require('../models/activityLog');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'video/mp4': 'mp4',
    'application/pdf': 'pdf'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const uploadOptions = multer({ storage: storage });

// Get all evidence for a specific complaint
router.get('/:complaintId', async (req, res) => {
    try {
        const evidenceList = await Evidence.find({ complaintId: req.params.complaintId }).sort({ uploadDate: -1 });
        if (!evidenceList) {
            return res.status(500).json({ success: false });
        }
        res.status(200).send(evidenceList);
    } catch (e) {
        res.status(500).json({ success: false, error: e });
    }
});

// Upload multiple evidence files
router.post('/upload', uploadOptions.array('files', 10), async (req, res) => {
    try {
        const files = req.files;
        if (!files || files.length === 0) return res.status(400).send('No files in the request');
        
        const { complaintId, uploadedBy, uploaderId } = req.body;
        
        let evidenceRecords = [];
        
        for (const file of files) {
            let type = 'document';
            if (file.mimetype.startsWith('image/')) type = 'image';
            if (file.mimetype.startsWith('video/')) type = 'video';
            
            let evidence = new Evidence({
                complaintId: complaintId,
                uploadedBy: uploadedBy,
                uploaderId: uploaderId,
                fileType: type,
                fileUrl: file.path
            });
            
            evidence = await evidence.save();
            evidenceRecords.push(evidence);
        }
        
        // Log Activity
        let log = new ActivityLog({
            userRole: uploadedBy,
            userId: uploaderId,
            action: 'Evidence Uploaded',
            description: `${files.length} evidence file(s) uploaded for complaint ${complaintId}.`
        });
        await log.save();

        res.status(201).send(evidenceRecords);
    } catch (e) {
        res.status(500).json({ success: false, error: e.message });
    }
});

module.exports = router;
