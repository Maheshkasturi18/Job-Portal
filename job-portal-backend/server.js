// server.js
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const app = express();
require('dotenv').config();


// Configuration: Set your PORT, MongoDB URI and JWT secret here or in environment variables.
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

app.use(cors());
app.use(express.json());

// Connect to MongoDB using Mongoose
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Define a Mongoose schema for Job Listings
const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    location: String,
    category: String,
    salary: Number,
    type: String,
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedDate: { type: Date, default: Date.now },
});

const Job = mongoose.model('Job', jobSchema);

// Middleware to verify JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    // Expect a header with format "Bearer <token>"
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user; // Payload should include at least id and role
        next();
    });
}

// Middleware for role-based access control (for employers)
function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied. Insufficient role privileges.' });
        }
        next();
    };
}

// ----- CRUD Endpoints for Job Listings & Search ----- //

// Create a Job Listing (Employers only)
app.post('/api/jobs', authenticateToken, authorizeRoles('employer'), async (req, res) => {
    try {
        const { title, description, location, category, salary, type } = req.body;
        const job = new Job({
            title,
            description,
            location,
            category,
            salary,
            type,
            employerId: req.user.id, // Assumes the JWT payload includes an "id" field
        });
        await job.save();
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error creating job listing', error: err.message });
    }
});

// Get All Job Listings (with search/filtering)
// Query parameters: title, category, location
app.get('/api/jobs', async (req, res) => {
    try {
        const { title, category, location } = req.query;
        const filter = {};
        if (title) {
            filter.title = { $regex: title, $options: 'i' }; // Case-insensitive matching
        }
        if (category) {
            filter.category = category;
        }
        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }
        const jobs = await Job.find(filter).sort({ postedDate: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job listings', error: err.message });
    }
});

// Get a Single Job Listing by ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job listing', error: err.message });
    }
});

// Update a Job Listing (Employers only & only if they own the listing)
app.put('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this job listing' });
        }
        const { title, description, location, category, salary, type } = req.body;
        // Update fields if provided; otherwise, retain previous values.
        job.title = title || job.title;
        job.description = description || job.description;
        job.location = location || job.location;
        job.category = category || job.category;
        job.salary = salary !== undefined ? salary : job.salary;
        job.type = type || job.type;
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error updating job listing', error: err.message });
    }
});

// Delete a Job Listing (Employers only)
app.delete('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this job listing' });
        }
        await job.deleteOne();
        res.json({ message: 'Job listing deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting job listing', error: err.message });
    }
});

// ----- End CRUD Endpoints ----- //

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
