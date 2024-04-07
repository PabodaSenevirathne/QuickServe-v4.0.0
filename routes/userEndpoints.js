const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a specific user by userId
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new user
router.post('/', async (req, res) => {
    const { userId, email, password, userName, firstName, lastName, shippingAddress } = req.body;
    try {
        const newUser = new User({ userId, email, password, userName, firstName, lastName, shippingAddress });
        await newUser.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE a user by userId
router.put('/:userId', async (req, res) => {
    const { email, password, userName, firstName, lastName, shippingAddress } = req.body;
    try {
        const user = await User.findOne({ userId: req.params.userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.email = email;
        user.password = password;
        user.userName = userName;
        user.firstName = firstName;
        user.lastName = lastName;
        user.shippingAddress = shippingAddress;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE a user by userId
router.delete('/:userId', async (req, res) => {
    try {
        const user = await User.findOneAndDelete({ userId: req.params.userId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;