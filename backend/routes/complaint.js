const {Complaint} = require('../models/complaint');
const {Officer} = require('../models/officer');
const {User} = require('../models/user');
const {Notification} = require('../models/notification');
const { ActivityLog } = require('../models/activityLog');
const { AdvocateRequest } = require('../models/advocateRequest');
const express = require('express');
const router = express.Router();
const auth = require('../helpers/jwt');
const multer = require('multer');
const path = require('path');


// Set up multer storage for storing uploaded images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname);
    },
  });
  
  const upload = multer({ storage: storage });






router.get(`/`,  async (req, res) =>{
    const complaintList = await Complaint.find();

    if(!complaintList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(complaintList);
})



router.get(`/:id`, async (req, res) =>{
    const complaintList = await Complaint.findById(req.params.id);

    if(!complaintList) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(complaintList);
})


router.post('/', auth, async (req,res)=>{
    try {
        console.log("Complaint received:", req.body);
        
        // Attempt to find an officer matching the district or location
        const { district, location } = req.body;
        
        let assignedOfficer = null;
        
        if (district) {
            assignedOfficer = await Officer.findOne({ district: { $regex: new RegExp(`^${district}$`, 'i') } });
        }
        
        if (!assignedOfficer && location) {
            assignedOfficer = await Officer.findOne({ location: { $regex: new RegExp(`^${location}$`, 'i') } });
        }

        // Generate custom complaint ID e.g. CMP-2026-0001
        const year = new Date().getFullYear();
        const count = await Complaint.countDocuments();
        const paddedCount = String(count + 1).padStart(4, '0');
        const generatedComplaintId = `CMP-${year}-${paddedCount}`;
        
        const currentUserEmail = (req.user && req.user.useremail) ? req.user.useremail : req.body.useremail;
    
        let complaintData = {
            complaintId: generatedComplaintId,
            useremail: currentUserEmail,
            name: req.body.name,
            mobile: req.body.mobile,
            address: req.body.address,
            district: req.body.district,
            location: req.body.location,
            department: req.body.department,
            writecomplaint: req.body.writecomplaint
        };
        
        // Auto-assign if an officer was found
        if (assignedOfficer) {
            complaintData.assignedOfficer = assignedOfficer._id;
            complaintData.assignedOfficerName = assignedOfficer.name;
            complaintData.assignedAt = new Date();
            complaintData.status = 'Under Investigation';
        }
    
        let complaint = new Complaint(complaintData);
        complaint = await complaint.save();
    
        if(!complaint)
            return res.status(400).send('the complaint cannot be created!')
            
        // Find User to create notification
        const user = await User.findOne({ email: currentUserEmail });
        if (user) {
            let userNotif = new Notification({
                userId: user._id,
                userType: 'User',
                message: `Your complaint (${generatedComplaintId}) has been successfully submitted.`
            });
            await userNotif.save();
        }

        // Create activity log for complaint creation
        let log = new ActivityLog({
            userRole: 'User', // Assuming the user creating the complaint is a 'User'
            userId: user ? user._id : currentUserEmail, // Get user ID from the user document instead of missing token payload
            action: 'Complaint Created',
            description: `New complaint (${generatedComplaintId}) created by ${currentUserEmail}.`
        });
        await log.save();

        // Create advocate request if advocateId is provided
        if (req.body.advocateId && user) {
            let advocateReq = new AdvocateRequest({
                userId: user._id,
                advocateId: req.body.advocateId,
                complaintId: complaint._id,
                caseDescription: `Legal assistance requested for complaint ID: ${generatedComplaintId}. Description: ${req.body.writecomplaint}`
            });
            await advocateReq.save();
            
            // Generate notification for the advocate
            let advNotif = new Notification({
                userId: req.body.advocateId,
                userType: 'Business',
                message: `You have received a new legal assistance request for complaint: ${generatedComplaintId}.`
            });
            await advNotif.save();
        }

        res.status(201).json({ message: "Complaint submitted successfully", complaint });
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
})



router.delete('/:id', auth, (req, res)=>{
    Complaint.findByIdAndRemove(req.params.id).then(complaint =>{
        if(complaint) {
            return res.status(200).json({success: true, message: 'the complaint is deleted!'})
        } else {
            return res.status(404).json({success: false , message: "complaint not found!"})
        }
    }).catch(err=>{
       return res.status(500).json({success: false, error: err}) 
    })
})



router.put('/:id',async (req, res)=> {
    const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        {  
        //complaintarea: req.body.complaintarea,
        useremail: req.body.useremail,
        name: req.body.name,
        mobile: req.body.mobile,
        address: req.body.address,
        district: req.body.district,
        location: req.body.location,
        department: req.body.department,
        writecomplaint: req.body.writecomplaint
        },
        { new: true}
    )

    if(!complaint)
    return res.status(400).send('the complaint cannot be updated!')

    res.send(complaint);
})




router.put('/map/:id',async (req, res)=> {
    const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        {        
            lat: req.body.lat,
            long: req.body.long
        },
        { new: true}
    )

    if(!complaint)
    return res.status(400).send('the map cannot be created!')

    res.send(complaint);
})




// PUT route to update the status and upload an image for a complaint
router.put('/status/:id', auth, upload.single('image'), async (req, res) => {
    try {
      const complaintId = req.params.id;
      const { status, reason, remedies, notes } = req.body;
      const imagePath = req.file ? req.file.path : undefined;
  
      // Find the complaint by ID and update its status and image path
      const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        { $set: { status, reason, remedies, notes, imagePath } },
        { new: true } // To return the updated document
      );
  
      if (!updatedComplaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
  
      res.status(200).json({ success: true, message: 'Complaint status and image updated successfully', complaint: updatedComplaint });
    } catch (error) {
      console.error('Error updating complaint status and image:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });


// PUT route to update the status and upload an image for a complaint
router.put('/upload_image/:id', auth, upload.single('image'), async (req, res) => {
    try {
      const complaintId = req.params.id;
      //const { status, reason, remedies, notes } = req.body;
      const image1 = req.file ? req.file.path : undefined;
  
      // Find the complaint by ID and update its status and image path
      const updatedComplaint = await Complaint.findByIdAndUpdate(
        complaintId,
        { $set: {image1 } },
        { new: true } // To return the updated document
      );
  
      if (!updatedComplaint) {
        return res.status(404).json({ success: false, message: 'Complaint not found' });
      }
  
      res.status(200).json({ success: true, message: 'Complaint status and image updated successfully', complaint: updatedComplaint });
    } catch (error) {
      console.error('Error updating complaint status and image:', error);
      res.status(500).json({ success: false, message: 'Internal server error' });
    }
  });


















{/*
router.put('/status/:id', auth, async (req, res)=> {
    const complaint = await Complaint.findByIdAndUpdate(
        req.params.id,
        {        
            status: req.body.status,
            reason: req.body.reason,
            remedies: req.body.remedies,
            notes: req.body.notes,
            
        },
        { new: true}
    )

    if(!complaint)
    return res.status(400).send('the status cannot be created!')

    res.send(complaint);
})
*/}


// PUT route to explicitly assign a complaint to an officer
router.put('/assign/:id', auth, async (req, res) => {
    try {
        const complaintId = req.params.id;
        const { officerId, officerName } = req.body;

        if (!officerId || !officerName) {
            return res.status(400).json({ success: false, message: 'Officer ID and Name are required for assignment.' });
        }

        // Fetch complaint to check atomic state
        const complaint = await Complaint.findById(complaintId);
        
        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found.' });
        }

        if (complaint.assignedOfficer) {
            return res.status(400).json({ success: false, message: 'This complaint is already being handled by another officer.' });
        }

        // Update complaint
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { 
                $set: { 
                    assignedOfficer: officerId,
                    assignedOfficerName: officerName,
                    assignedAt: new Date(),
                    status: 'In Progress' 
                } 
            },
            { new: true }
        );

        // Notify User
        const user = await User.findOne({ email: updatedComplaint.useremail });
        if (user) {
            let userNotif = new Notification({
                userId: user._id,
                userType: 'User',
                message: `Officer ${officerName} has been assigned to investigate your complaint (${updatedComplaint.complaintId}).`
            });
            await userNotif.save();
        }

        res.status(200).json({ success: true, message: 'Complaint assigned successfully.', complaint: updatedComplaint });

    } catch (error) {
        console.error('Error assigning complaint:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// GET user's eligible complaints (for requesting an advocate)
router.get('/eligible/:useremail', async (req, res) => {
    try {
        const eligibleComplaints = await Complaint.find({
            useremail: req.params.useremail,
            status: { $in: ['Under Investigation', 'FIR Registered'] }
        });
        
        if (!eligibleComplaints) {
            return res.status(404).json({ success: false, message: 'No eligible complaints found' });
        }
        res.status(200).send(eligibleComplaints);
    } catch (error) {
        console.error('Error fetching eligible complaints:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports =router;