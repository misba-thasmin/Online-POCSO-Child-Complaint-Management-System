const { Admin } = require('../models/admin');
const { Complaint } = require('../models/complaint');
const { Advocate } = require('../models/advocate');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Analytics / Reports endpoint for Admin
router.get('/reports/statistics', async (req, res) => {
    try {
        // 1. Total Complaints
        const totalComplaints = await Complaint.countDocuments();
        
        // 2. Complaints by Status
        const pending = await Complaint.countDocuments({ status: 'pending' });
        const inProgress = await Complaint.countDocuments({ status: { $in: ['on-progress', 'in-progress'] } });
        const resolved = await Complaint.countDocuments({ status: { $in: ['resolved', 'closed'] } });
        
        // 3. Complaints by Category (Department)
        const categoriesData = await Complaint.aggregate([
            { $group: { _id: "$department", count: { $sum: 1 } } }
        ]);
        
        // 4. Complaints by Location (District)
        const locationsData = await Complaint.aggregate([
            { $group: { _id: "$location", count: { $sum: 1 } } }
        ]);

        // 5. Total Advocates Active
        const totalAdvocates = await Advocate.countDocuments({ status: 'approved' });

        res.status(200).json({
            success: true,
            totalComplaints,
            statusCounts: { pending, inProgress, resolved },
            categories: categoriesData,
            locations: locationsData,
            totalAdvocates
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});
router.get(`/`, async (req, res) => {
    const adminList = await Admin.find().select('-passwordHash');
    if (!adminList) {
        res.status(500).json({ success: false })
    }
    res.send(adminList);
})

router.get(`/:id`, async (req, res) => {
    const adminList = await Admin.findById(req.params.id);
    if (!adminList) {
        res.status(500).json({ success: false })
    }
    res.send(adminList);
})


router.post('/login', async (req, res) => {
    const admin = await Admin.findOne({ email: req.body.email })
    const secret = process.env.secret;
    if (!admin) {
        return res.status(400).send('The admin not found');
    }

    if (admin && bcrypt.compareSync(req.body.password, admin.passwordHash)) {
        const token = jwt.sign(
            {
                adminemail: admin.email,
                isAdmin: admin.isAdmin
            },
            secret,
            { expiresIn: '1d' }
        )

        res.status(200).send({ admin: admin.email, token: token })
    } else {
        res.status(400).send('password is wrong!');
    }
})

router.post(`/`, async (req, res) => {
    let admin = new Admin({
        email: req.body.email,
        passwordHash: bcrypt.hashSync(req.body.password, 10),
    })
    admin = await admin.save();
    if (!admin)
        return res.status(500).send('The Admin cannot be created')

    res.send(admin);
})


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { email, passwordHash } = req.body;

        // Check if the admin with the given ID exists
        let admin = await Admin.findById(id);
        if (!admin) {
            return res.status(404).send('Admin not found');
        }

        // Update the admin properties
        admin.email = email;
        admin.passwordHash = bcrypt.hashSync(passwordHash, 10);

        // Save the updated admin to the database
        admin = await admin.save();

        // Send the updated admin as the response
        res.send(admin);
    } catch (error) {
        console.error('Error updating admin:', error.message);
        res.status(500).send('Internal server error');
    }
});







module.exports = router;