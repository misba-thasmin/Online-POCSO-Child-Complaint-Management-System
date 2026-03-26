const { Officer } = require('../models/officer');
const { FIR } = require('../models/fir');
const { Complaint } = require('../models/complaint');
const { Notification } = require('../models/notification');
const { User } = require('../models/user');
const { ActivityLog } = require('../models/activityLog');
const express = require('express');
const router = express.Router();
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');

// Set up multer storage for storing uploaded profile images
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads'); // Specify the directory where you want to store the images
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Generate a unique filename
    }
});

const upload = multer({ storage: storage });

router.get(`/`, async (req, res) => {
    const officerList = await Officer.find().select('-passwordHash');
    if (!officerList) {
        res.status(500).json({ success: false })
    }
    res.send(officerList);
})

// GET complaints for a specific officer by ID
router.get('/complaints/:officerId', async (req, res) => {
    try {
        const officerId = req.params.officerId;
        const officer = await Officer.findById(officerId);

        if (!officer) {
            return res.status(404).json({ success: false, message: 'Officer not found' });
        }

        const officerIdStr = officer._id.toString();
        const officerLoc = (officer.location || '').trim();
        const officerDist = (officer.district || '').trim();
        const officerCity = (officer.city || '').trim();

        const orConditions = [
            { assignedOfficer: officerId }
        ];

        // Also fetch complaints matching officer's jurisdiction if they aren't assigned yet
        if (officerLoc) {
            orConditions.push({ location: { $regex: new RegExp(`^${officerLoc}$`, 'i') } });
            orConditions.push({ district: { $regex: new RegExp(`^${officerLoc}$`, 'i') } });
        }
        if (officerDist) {
            orConditions.push({ district: { $regex: new RegExp(`^${officerDist}$`, 'i') } });
            orConditions.push({ location: { $regex: new RegExp(`^${officerDist}$`, 'i') } });
        }
        if (officerCity) {
            orConditions.push({ district: { $regex: new RegExp(`^${officerCity}$`, 'i') } });
            orConditions.push({ location: { $regex: new RegExp(`^${officerCity}$`, 'i') } });
        }

        // Fix: Use find() to return ALL assigned complaints as an array instead of findOne()
        const complaints = await Complaint.find({ $or: orConditions });

        res.json({
            success: true,
            complaints: complaints
        });
    } catch (error) {
        console.error('Error fetching officer complaints:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

router.get(`/:id`, async (req, res) => {
    const officerList = await Officer.findById(req.params.id);

    if (!officerList) {
        res.status(500).json({ success: false })
    }
    res.send(officerList);
})


router.post(`/`, upload.single('image'), async (req, res) => {
    let officer = new Officer({
        name: req.body.name,
        email: req.body.email.toLowerCase(),
        passwordHash: bcrypt.hashSync(req.body.passwordHash, 10),
        mobile: req.body.mobile,
        location: req.body.location,
        city: req.body.city,
        // Official fields
        officerId: req.body.officerId,
        department: req.body.department,
        designation: req.body.designation,
        policeStation: req.body.policeStation,
        district: req.body.district,
        state: req.body.state,
        experience: req.body.experience,
        officeContact: req.body.officeContact,
        joiningDate: req.body.joiningDate,
        address: req.body.address,
        image: req.file ? `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}` : '',
    })
    officer = await officer.save();
    if (!officer)
        return res.status(500).send('The officer cannot be created')

    res.send(officer);
})



router.post('/login', async (req, res) => {
    const officer = await Officer.findOne({ email: req.body.email.toLowerCase() })
    const secret = process.env.secret;
    if (!officer) {
        return res.status(400).send('The officer not found');
    }

    if (officer && bcrypt.compareSync(req.body.password, officer.passwordHash)) {
        const token = jwt.sign(
            {
                officeremail: officer.email
            },
            secret,
            { expiresIn: '1d' }
        )


        // Set cookies for location and department
        res.cookie('location', officer.location, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
        //   res.cookie('department', officer.department, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });


        res.status(200).send({
            officer: officer.email,
            officerLocation: officer.location,
            // officerDepartment: officer.department,
            token: token
        })
    } else {
        res.status(400).send('password is wrong!');
    }


})

router.put('/:id', upload.single('image'), async (req, res) => {

    const officerExist = await Officer.findById(req.params.id);
    let newPassword
    if (req.body.password) {
        newPassword = bcrypt.hashSync(req.body.password, 10)
    } else {
        newPassword = officerExist.passwordHash;
    }

    let imagePath = officerExist.image;
    if (req.file) {
        imagePath = `${req.protocol}://${req.get('host')}/public/uploads/${req.file.filename}`;
    }

    const officer = await Officer.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            passwordHash: newPassword,
            mobile: req.body.mobile,
            location: req.body.location,
            city: req.body.city,
            officerId: req.body.officerId,
            department: req.body.department,
            designation: req.body.designation,
            policeStation: req.body.policeStation,
            district: req.body.district,
            state: req.body.state,
            experience: req.body.experience,
            officeContact: req.body.officeContact,
            joiningDate: req.body.joiningDate,
            address: req.body.address,
            image: imagePath
        },
        { new: true }
    )

    if (!officer)
        return res.status(400).send('the officer cannot be updated!')

    res.send(officer);
})

router.delete('/:id', async (req, res) => {
    try {
        const officer = await Officer.findByIdAndRemove(req.params.id);
        if (!officer) {
            return res.status(404).send('Officer not found');
        }
        res.send('Officer removed successfully');
    } catch (error) {
        console.error('Error removing officer:', error.message);
        res.status(500).send('Internal server error');
    }
});


// ----- FIR Registration by Officer -----
router.post('/register-fir', upload.single('document'), async (req, res) => {
    try {
        const { firNumber, complaintId, policeStation, investigatorName, officerId } = req.body;
        const documentPath = req.file ? req.file.path : undefined;

        // 1. Create FIR Record
        let fir = new FIR({ 
            firNumber, 
            complaintId, 
            policeStation, 
            investigatorName, 
            documentPath,
            createdByOfficerId: officerId 
        });
        fir = await fir.save();
        
        // 2. Update Complaint Status
        const complaint = await Complaint.findByIdAndUpdate(complaintId, { status: 'FIR Registered' }, { new: true });
        
        // 3. Log Activity
        let log = new ActivityLog({
            userRole: 'Officer',
            userId: investigatorName || officerId,
            action: 'FIR Registered',
            description: `FIR (${firNumber}) registered for complaint ${complaint.complaintId}.`
        });
        await log.save();

        // 4. Notify User
        if (complaint) {
            const user = await User.findOne({ email: complaint.useremail });
            if (user) {
                let userNotif = new Notification({
                    userId: user._id,
                    userType: 'User',
                    message: `FIR (${firNumber}) has been registered for your complaint (${complaint.complaintId}).`
                });
                await userNotif.save();
            }
        }

        res.status(201).json({ success: true, fir });
    } catch (e) { 
        console.error("SERVER FIR ERROR:", e.message);
        res.status(500).json({ success: false, error: e.message }); 
    }
});

module.exports = router;