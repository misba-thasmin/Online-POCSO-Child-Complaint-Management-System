const express = require('express');
const router = express.Router();
const { FIR } = require('../models/fir');
const { CourtCase } = require('../models/courtCase');
const { Hearing } = require('../models/hearing');
const { CourtActivity } = require('../models/courtActivity');
const { Complaint } = require('../models/complaint');

const multer = require('multer');
const path = require('path');

// Set up multer storage for storing uploaded documents
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage: storage });

// Helper for Activity Log
const logActivity = async (action, userId, userName, targetId, details) => {
    try {
        const log = new CourtActivity({ 
            action, userRole: 'CourtStaff', userId: userId || 'Unknown', userName: userName || 'Admin', targetId, details 
        });
        await log.save();
    } catch(e) { console.error("Logging failed", e); }
};

// ----- FIR Routes -----
router.post('/fir', upload.single('document'), async (req, res) => {
    try {
        const { firNumber, complaintId, policeStation, date, investigatorName, userId, userName } = req.body;
        const documentPath = req.file ? req.file.path : undefined;

        let fir = new FIR({ firNumber, complaintId, policeStation, date, investigatorName, documentPath });
        fir = await fir.save();
        
        await Complaint.findByIdAndUpdate(complaintId, { status: 'FIR Registered' });
        await logActivity('FIR Registered', userId, userName, firNumber, `FIR registered against complaint ${complaintId}`);
        
        res.status(201).json({ success: true, fir });
    } catch (e) { 
        console.error("SERVER FIR ERROR:", e.message);
        res.status(500).json({ success: false, error: e.message }); 
    }
});

router.get('/firs', async (req, res) => {
    try {
        const firs = await FIR.find().populate('complaintId');
        res.status(200).json({ success: true, firs });
    } catch (e) { res.status(500).json({ success: false }); }
});

// ----- Case Routes -----
router.post('/case', async (req, res) => {
    try {
        const { caseNumber, complaintId, courtName, judgeName, status, userId, userName } = req.body;
        // find FIR if exists
        const fir = await FIR.findOne({ complaintId });
        let newCase = new CourtCase({
            caseNumber, complaintId, courtName, judgeName, status, firId: fir ? fir._id : null
        });
        newCase = await newCase.save();
        await Complaint.findByIdAndUpdate(complaintId, { status: 'Case Filed in Court' });
        await logActivity('Case Filed', userId, userName, caseNumber, `Filed in ${courtName}`);
        res.status(201).json({ success: true, courtCase: newCase });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/cases', async (req, res) => {
    try {
        const cases = await CourtCase.find().populate('complaintId').populate('firId');
        res.status(200).json({ success: true, cases });
    } catch (e) { res.status(500).json({ success: false }); }
});

router.get('/case/:id', async (req, res) => {
    try {
        const courtCase = await CourtCase.findById(req.params.id)
            .populate('complaintId')
            .populate('firId');
        if(!courtCase) return res.status(404).json({ success: false, message: 'Case not found' });
        res.status(200).json({ success: true, courtCase });
    } catch (e) { res.status(500).json({ success: false }); }
});

router.put('/case/:id/details', async (req, res) => {
    try {
        const { judgeName, status, userId, userName } = req.body;
        const courtCase = await CourtCase.findByIdAndUpdate(req.params.id, {
            judgeName, status
        }, { new: true });
        
        await logActivity('Case Details Updated', userId, userName, courtCase.caseNumber, `Status: ${status}`);
        res.status(200).json({ success: true, courtCase });
    } catch (e) { res.status(500).json({ success: false }); }
});

router.put('/case/:id/judgment', upload.single('document'), async (req, res) => {
    try {
        const { verdict, punishment, date, userId, userName } = req.body;
        const documentPath = req.file ? req.file.path : undefined;

        // If there is an existing judgment document, overriding relies on the path. 
        // We'll update only what is provided.
        const updateData = {
            status: 'Closed',
            'judgment.verdict': verdict,
            'judgment.punishment': punishment,
            'judgment.date': date
        };
        
        if (documentPath) {
            updateData['judgment.documentPath'] = documentPath;
        }

        const courtCase = await CourtCase.findByIdAndUpdate(req.params.id, {
            $set: updateData
        }, { new: true });
        
        await Complaint.findByIdAndUpdate(courtCase.complaintId, { status: 'Case Closed' });
        await logActivity('Judgment Uploaded', userId, userName, courtCase.caseNumber, `Verdict: ${verdict}`);
        
        res.status(200).json({ success: true, courtCase });
    } catch (e) { res.status(500).json({ success: false }); }
});

// ----- Hearing Routes -----
router.post('/hearing', async (req, res) => {
    try {
        const { caseId, hearingDate, courtName, notes, status, userId, userName } = req.body;
        let hearing = new Hearing({ 
            caseId, hearingDate, courtName, notes, status: status || 'Scheduled'
        });
        hearing = await hearing.save();
        
        const courtCase = await CourtCase.findById(caseId);
        await Complaint.findByIdAndUpdate(courtCase.complaintId, { status: 'Court Hearing Scheduled' });
        await logActivity('Hearing Scheduled', userId, userName, caseId, `Hearing on ${hearingDate}`);
        
        res.status(201).json({ success: true, hearing });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

router.get('/hearings', async (req, res) => {
    try {
        const hearings = await Hearing.find().populate({
           path: 'caseId',
           populate: { path: 'firId' }
        }).sort('hearingDate');
        res.status(200).json({ success: true, hearings });
    } catch (e) { res.status(500).json({ success: false }); }
});

router.put('/hearing/:id/status', async (req, res) => {
    try {
        const { status, notes, userId, userName } = req.body;
        const updateData = { status };
        if (notes !== undefined) updateData.notes = notes;

        const hearing = await Hearing.findByIdAndUpdate(req.params.id, updateData, { new: true });
        
        await logActivity('Hearing Updated', userId, userName, hearing.caseId, `Status changed to ${status}`);
        res.status(200).json({ success: true, hearing });
    } catch (e) { res.status(500).json({ success: false }); }
});

router.delete('/hearing/:id', async (req, res) => {
    try {
        const hearing = await Hearing.findByIdAndDelete(req.params.id);
        if(!hearing) return res.status(404).json({ success: false, error: 'Not found' });
        // Optionally, log this activity if userId is provided via query
        res.status(200).json({ success: true, message: 'Hearing deleted' });
    } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ----- Analytics & Logs -----
router.get('/analytics', async (req, res) => {
    try {
        const totalCases = await CourtCase.countDocuments();
        const pendingCases = await CourtCase.countDocuments({ status: 'Pending' });
        const activeCases = await CourtCase.countDocuments({ status: 'Active' });
        const completedCases = await CourtCase.countDocuments({ status: 'Closed' });
        const firCases = await FIR.countDocuments();
        res.status(200).json({ success: true, stats: { totalCases, pendingCases, activeCases, completedCases, firCases } });
    } catch (e) { res.status(500).json({ success: false }); }
});

router.get('/logs', async (req, res) => {
    try {
        const logs = await CourtActivity.find().sort({ dateCreated: -1 }).limit(50);
        res.status(200).json({ success: true, logs });
    } catch (e) { res.status(500).json({ success: false }); }
});

module.exports = router;
