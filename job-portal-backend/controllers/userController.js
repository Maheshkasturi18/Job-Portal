const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Register Route
async function Register(req, res) {
    try {
        const { name, email, password, role, company } = req.body;
        const user = new User({ name, email, password, role, company });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Registration failed', error: err.message });
    }
}


// Login Route
async function Login(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials or User not found' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({
        token,
        user: {
            // _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
        }
    });
}

module.exports = {
    Register,
    Login
};