const {Complaint} = require('../models/complaint');
const {Officer} = require('../models/officer');
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
        // Attempt to find an officer matching the district or location
        const { district, location } = req.body;
        
        let assignedOfficer = null;
        
        if (district) {
            assignedOfficer = await Officer.findOne({ district: { $regex: new RegExp(`^${district}$`, 'i') } });
        }
        
        if (!assignedOfficer && location) {
            assignedOfficer = await Officer.findOne({ location: { $regex: new RegExp(`^${location}$`, 'i') } });
        }
    
        let complaintData = {
            useremail: req.body.useremail,
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
            complaintData.assignedOfficerId = assignedOfficer._id.toString();
            complaintData.assignedOfficerName = assignedOfficer.name;
            complaintData.assignedAt = new Date();
            complaintData.status = 'In Progress';
        }
    
        let complaint = new Complaint(complaintData);
        complaint = await complaint.save();
    
        if(!complaint)
            return res.status(400).send('the complaint cannot be created!')
            
        res.send(complaint);
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

        if (complaint.assignedOfficerId) {
            return res.status(400).json({ success: false, message: 'This complaint is already being handled by another officer.' });
        }

        // Update complaint
        const updatedComplaint = await Complaint.findByIdAndUpdate(
            complaintId,
            { 
                $set: { 
                    assignedOfficerId: officerId,
                    assignedOfficerName: officerName,
                    assignedAt: new Date(),
                    status: 'In Progress' 
                } 
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Complaint assigned successfully.', complaint: updatedComplaint });

    } catch (error) {
        console.error('Error assigning complaint:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports =router;