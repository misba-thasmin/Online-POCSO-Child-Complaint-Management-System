const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/user');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, city, question1, question2 } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Hash the password
        const passwordHash = bcrypt.hashSync(password, 10);

        // Create new user
        let user = new User({
            name,
            email: email.toLowerCase(),
            passwordHash,
            phone,
            city,
            question1,
            question2,
            isAdmin: false
        });

        user = await user.save();
        if (!user) {
            return res.status(500).json({ success: false, message: 'The user cannot be created' });
        }

        res.status(201).json({ success: true, message: 'Registration successful', user });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(400).json({ success: false, message: 'The user not found' });
        }

        if (user && bcrypt.compareSync(password, user.passwordHash)) {
            const secret = process.env.secret;
            const token = jwt.sign(
                {
                    useremail: user.email,
                    isAdmin: user.isAdmin
                },
                secret,
                { expiresIn: '1d' }
            );

            res.status(200).json({ success: true, user: user.email, token: token });
        } else {
            res.status(400).json({ success: false, message: 'password is wrong!' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
