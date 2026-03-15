const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CourtStaff } = require('../models/courtStaff');

// POST /api/court_auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, courtName, district } = req.body;
        const existingStaff = await CourtStaff.findOne({ email: email.toLowerCase() });
        if (existingStaff) {
            return res.status(400).json({ success: false, message: 'Court Staff already exists' });
        }
        
        const passwordHash = bcrypt.hashSync(password, 10);
        let staff = new CourtStaff({ 
            name, 
            email: email.toLowerCase(), 
            passwordHash, 
            courtName, 
            district 
        });
        
        staff = await staff.save();
        if(!staff) return res.status(500).json({ success: false, message: 'Cannot be created' });
        
        res.status(201).json({ success: true, message: 'Registration successful', staff });
    } catch (e) {
        console.error('Court Register Error:', e);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// POST /api/court_auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const staff = await CourtStaff.findOne({ email: email.toLowerCase() });
        if (!staff) {
            return res.status(400).json({ success: false, message: 'The user not found' });
        }
        
        if (staff && bcrypt.compareSync(password, staff.passwordHash)) {
            const secret = process.env.secret || 'mysecretkey';
            const token = jwt.sign(
                { email: staff.email, role: 'courtStaff' },
                secret,
                { expiresIn: '1d' }
            );
            res.status(200).json({ success: true, email: staff.email, token: token });
        } else {
            res.status(400).json({ success: false, message: 'Wrong password!' });
        }
    } catch (e) {
        console.error('Court Login Error:', e);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
