// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const multer = require('multer');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, './uploads/resumes'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${req.user.id}-${Date.now()}${ext}`);
    }
});
const upload = multer({ storage });

// make sure ./uploads/resumes exists and is served statically:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// =======================
// User Schema & Auth Logic
// =======================
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['employer', 'jobseeker'], required: true },
    company: String,
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

const User = mongoose.model('User', userSchema);

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, role, company } = req.body;
        const user = new User({ name, email, password, role, company });
        await user.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(400).json({ message: 'Registration failed', error: err.message });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ message: 'Invalid credentials or User not found' });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
    res.json({
        token,
        user: {
            name: user.name,
            email: user.email,
            role: user.role,
            company: user.company,
        }
    });
});

// =======================
// Auth Middleware
// =======================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

function authorizeRoles(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: role not authorized' });
        }
        next();
    };
}

// =======================
// Job Listing Model & Routes
// =======================
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

// Create Job (Employer Only)
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
            employerId: req.user.id
        });
        await job.save();
        console.log('POST Jobs form submitted successfully:', job);
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error creating job', error: err.message });
    }
});

// Get All Jobs (Public + Filterable)
app.get('/api/jobs', async (req, res) => {
    try {
        const { title, category, location } = req.query;
        const filter = {};
        if (title) filter.title = new RegExp(title, 'i');
        if (category) filter.category = category;
        if (location) filter.location = new RegExp(location, 'i');
        const jobs = await Job.find(filter).sort({ postedDate: -1 });
        console.log('GET Jobs fetched successfully:', jobs);
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching jobs', error: err.message });
    }
});

// Get Job by ID
app.get('/api/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job', error: err.message });
    }
});

// Update Job (Employer Owner Only)
app.patch('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to edit this job' });
        }
        Object.assign(job, req.body);
        await job.save();
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error updating job', error: err.message });
    }
});

// Delete Job (Employer Owner Only)
app.delete('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        if (job.employerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this job' });
        }
        await job.deleteOne();
        res.json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting job', error: err.message });
    }
});

// =======================
// Job Application Model & Routes
// =======================

// Application model
const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // from form
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    resumeLink: { type: String, required: true },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
    coverLetter: { type: String, default: '' },

    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now },
});

const Application = mongoose.model('Application', applicationSchema);


app.post(
    '/api/jobs/:id/apply',
    authenticateToken,
    authorizeRoles('jobseeker'),
    async (req, res) => {
        try {
            const {
                fullName,
                email,
                phone,
                location,
                resumeLink,
                linkedin = '',
                portfolio = '',
                experience = '',
                education = '',
                coverLetter = '',
            } = req.body;

            // Basic required‑fields check
            if (!fullName || !email || !phone || !location || !resumeLink) {
                return res.status(400).json({ message: 'Missing required application fields.' });
            }

            const job = await Job.findById(req.params.id);
            if (!job) return res.status(404).json({ message: 'Job not found' });

            const application = new Application({
                jobId: req.params.id,
                userId: req.user.id,
                fullName,
                email,
                phone,
                location,
                resumeLink,
                linkedin,
                portfolio,
                experience,
                education,
                coverLetter,
            });

            await application.save();
            res.status(201).json({ message: 'Application submitted successfully!', application });
        } catch (err) {
            console.error('Error applying to job:', err);
            res.status(500).json({ message: 'Error submitting application', error: err.message });
        }
    }
);

app.get(
    '/api/applications',
    authenticateToken,
    async (req, res) => {
        try {
            const { userId, jobId } = req.query;
            let filter = {};

            if (req.user.role === 'jobseeker') {
                // Job seeker: only their own applications
                filter.userId = req.user.id;
            } else if (req.user.role === 'employer') {
                // Employer: only apps for jobs they posted
                // First find this employer’s jobs
                const jobs = await Job.find({ employerId: req.user.id }, '_id');
                const jobIds = jobs.map(j => j._id);
                filter.jobId = { $in: jobIds };
            }

            // Allow optional query-string overrides
            if (userId) filter.userId = userId;
            if (jobId) filter.jobId = jobId;

            // Populate job & user details for convenience
            const apps = await Application.find(filter)
                .populate('jobId', 'title company')
                .populate('userId', 'name email');

            res.json(apps);
        } catch (err) {
            console.error('Error fetching applications:', err);
            res.status(500).json({ message: 'Error fetching applications', error: err.message });
        }
    }
);

// 3.2) Get a single application by its ID
app.get(
    '/api/applications/:id',
    authenticateToken,
    async (req, res) => {
        try {
            const appDoc = await Application.findById(req.params.id)
                .populate('jobId', 'title company')
                .populate('userId', 'name email');

            if (!appDoc) return res.status(404).json({ message: 'Application not found' });

            // Enforce visibility rules
            if (
                req.user.role === 'jobseeker' && appDoc.userId._id.toString() !== req.user.id ||
                req.user.role === 'employer' && appDoc.jobId.employerId.toString() !== req.user.id
            ) {
                return res.status(403).json({ message: 'Access denied' });
            }

            res.json(appDoc);
        } catch (err) {
            console.error('Error fetching application:', err);
            res.status(500).json({ message: 'Error fetching application', error: err.message });
        }
    }
);


// =======================
// Start Server
// =======================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
