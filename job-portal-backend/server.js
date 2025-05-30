// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
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


// make sure ./uploads/resumes exists and is served statically:
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const userRoute = require('./routes/userRoute');
const jobRoute = require('./routes/jobRoute');
const applicationRoute = require('./routes/applicationRoute');


app.use("/", userRoute);
app.use("/", jobRoute);
app.use("/", applicationRoute);

// =======================
// User Schema & Auth Logic
// =======================


// Register Route
// app.post('/api/register', async (req, res) => {
//     try {
//         const { name, email, password, role, company } = req.body;
//         const user = new User({ name, email, password, role, company });
//         await user.save();
//         res.status(201).json({ message: 'User registered successfully' });
//     } catch (err) {
//         res.status(400).json({ message: 'Registration failed', error: err.message });
//     }
// });

// // Login Route
// app.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//         return res.status(401).json({ message: 'Invalid credentials or User not found' });
//     }

//     const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
//     res.json({
//         token,
//         user: {
//             // _id: user._id,
//             name: user.name,
//             email: user.email,
//             role: user.role,
//             company: user.company,
//         }
//     });
// });

// =======================
// Auth Middleware
// =======================
// function authenticateToken(req, res, next) {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];
//     if (!token) return res.sendStatus(401);

//     jwt.verify(token, JWT_SECRET, (err, user) => {
//         if (err) return res.sendStatus(403);
//         req.user = user;
//         next();
//     });
// }

// function authorizeRoles(...roles) {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({ message: 'Access denied: role not authorized' });
//         }
//         next();
//     };
// }

// =======================
// Job Listing Model & Routes
// =======================


// Create Job (Employer Only)
// app.post('/api/jobs', authenticateToken, authorizeRoles('employer'), async (req, res) => {
//     try {
//         const { title, description, requirements, company, location, category, salaryMin, salaryMax, salaryType, currency, type } = req.body;

//         // ✅ Salary range validation
//         if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
//             return res.status(400).json({ message: "Min salary cannot be greater than max salary" });
//         }

//         const job = new Job({
//             title,
//             description,
//             requirements,
//             company,
//             location,
//             category,
//             salaryMin,
//             salaryMax,
//             salaryType,
//             currency,
//             type,
//             employerId: req.user.id
//         });
//         await job.save();
//         console.log('POST Jobs form submitted successfully:', job);
//         res.status(201).json(job);
//     } catch (err) {
//         res.status(500).json({ message: 'Error creating job', error: err.message });
//     }
// });

// // Get All Jobs (Public + Filterable)
// app.get('/api/jobs', async (req, res) => {
//     try {
//         const { title, category, location } = req.query;
//         const filter = {};
//         if (title) filter.title = new RegExp(title, 'i');
//         if (category) filter.category = category;
//         if (location) filter.location = new RegExp(location, 'i');
//         const jobs = await Job.find(filter).sort({ postedDate: -1 });
//         console.log('GET Jobs fetched successfully:', jobs);
//         res.json(jobs);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching jobs', error: err.message });
//     }
// });

// // Get Job by ID
// app.get('/api/jobs/:id', async (req, res) => {
//     try {
//         const job = await Job.findById(req.params.id);
//         if (!job) return res.status(404).json({ message: 'Job not found' });
//         res.json(job);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching job', error: err.message });
//     }
// });

// app.get('/api/employer/jobs', authenticateToken, authorizeRoles('employer'), async (req, res) => {
//     try {
//         const { title, category, location } = req.query;
//         const filter = { employerId: req.user.id };

//         if (title) filter.title = new RegExp(title, 'i');
//         if (category) filter.category = category;
//         if (location) filter.location = new RegExp(location, 'i');

//         const jobs = await Job.find(filter).sort({ postedDate: -1 });
//         res.json(jobs);
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching employer jobs', error: err.message });
//     }
// });


// Update Job (Employer Owner Only)
// app.patch('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), async (req, res) => {
//     try {
//         const job = await Job.findById(req.params.id);
//         if (!job) return res.status(404).json({ message: 'Job not found' });
//         if (job.employerId.toString() !== req.user.id) {
//             return res.status(403).json({ message: 'Not authorized to edit this job' });
//         }
//         Object.assign(job, req.body);
//         await job.save();
//         res.json(job);
//     } catch (err) {
//         res.status(500).json({ message: 'Error updating job', error: err.message });
//     }
// });

// // Delete Job (Employer Owner Only)
// app.delete('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), async (req, res) => {
//     try {
//         const job = await Job.findById(req.params.id);
//         if (!job) return res.status(404).json({ message: 'Job not found' });
//         if (job.employerId.toString() !== req.user.id) {
//             return res.status(403).json({ message: 'Not authorized to delete this job' });
//         }
//         await job.deleteOne();
//         res.json({ message: 'Job deleted successfully' });
//     } catch (err) {
//         res.status(500).json({ message: 'Error deleting job', error: err.message });
//     }
// });

// =======================
// Job Application Model & Routes
// =======================

// Application model



// app.post(
//     '/api/jobs/:id/apply',
//     authenticateToken,
//     authorizeRoles('jobseeker'),
//     async (req, res) => {
//         try {
//             const {
//                 fullName,
//                 email,
//                 phone,
//                 location,
//                 jobTitle,
//                 resumeLink,
//                 linkedin = '',
//                 portfolio = '',
//                 experience = '',
//                 education = '',
//                 coverLetter = '',
//             } = req.body;

//             // Basic required‑fields check
//             if (!fullName || !email || !phone || !location || !jobTitle || !resumeLink) {
//                 return res.status(400).json({ message: 'Missing required application fields.' });
//             }

//             const job = await Job.findById(req.params.id);
//             if (!job) return res.status(404).json({ message: 'Job not found' });

//             const application = new Application({
//                 jobId: req.params.id,
//                 userId: req.user.id,
//                 fullName,
//                 email,
//                 phone,
//                 location,
//                 jobTitle,
//                 resumeLink,
//                 linkedin,
//                 portfolio,
//                 experience,
//                 education,
//                 coverLetter,
//             });

//             await application.save();
//             res.status(201).json({ message: 'Application submitted successfully!', application });
//         } catch (err) {
//             console.error('Error applying to job:', err);
//             res.status(500).json({ message: 'Error submitting application', error: err.message });
//         }
//     }
// );

// app.get(
//     '/api/applications',
//     authenticateToken,
//     async (req, res) => {
//         try {
//             const { userId, jobId } = req.query;
//             let filter = {};

//             if (req.user.role === 'jobseeker') {
//                 // Job seeker: only their own applications
//                 filter.userId = req.user.id;
//             } else if (req.user.role === 'employer') {
//                 // Employer: only apps for jobs they posted
//                 // First find this employer’s jobs
//                 const jobs = await Job.find({ employerId: req.user.id }, '_id');
//                 const jobIds = jobs.map(j => j._id);
//                 filter.jobId = { $in: jobIds };
//             }

//             // Allow optional query-string overrides
//             if (userId) filter.userId = userId;
//             if (jobId) filter.jobId = jobId;

//             // Populate job & user details for convenience
//             const apps = await Application.find(filter)
//                 .populate('jobId', 'title company')
//                 .populate('userId', 'name email');

//             res.json(apps);
//         } catch (err) {
//             console.error('Error fetching applications:', err);
//             res.status(500).json({ message: 'Error fetching applications', error: err.message });
//         }
//     }
// );

// app.get(
//     '/api/applications/:id',
//     authenticateToken,
//     async (req, res) => {
//         try {
//             const appDoc = await Application.findById(req.params.id)
//                 .populate('jobId', 'title company employerId')
//                 .populate('userId', 'name email');

//             if (!appDoc) return res.status(404).json({ message: 'Application not found' });

//             // Enforce visibility rules
//             if (
//                 req.user.role === 'jobseeker' && appDoc.userId._id.toString() !== req.user.id ||
//                 req.user.role === 'employer' && appDoc.jobId.employerId.toString() !== req.user.id
//             ) {
//                 return res.status(403).json({ message: 'Access denied' });
//             }

//             res.json(appDoc);
//         } catch (err) {
//             console.error('Error fetching application:', err);
//             res.status(500).json({ message: 'Error fetching application', error: err.message });
//         }
//     }
// );

// app.patch('/api/applications/:id', authenticateToken, async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { status } = req.body;

//         if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
//             return res.status(400).json({ message: 'Invalid status value.' });
//         }

//         const application = await Application.findById(id).populate('jobId');

//         if (!application) {
//             return res.status(404).json({ message: 'Application not found' });
//         }

//         // Ensure only employer who posted the job can update
//         if (
//             req.user.role !== 'employer' ||
//             application.jobId.employerId.toString() !== req.user.id
//         ) {
//             return res.status(403).json({ message: 'Unauthorized' });
//         }

//         application.status = status;
//         await application.save();

//         res.json({ message: 'Application status updated successfully', application });
//     } catch (err) {
//         console.error('Error updating application status:', err);
//         res.status(500).json({ message: 'Error updating application status', error: err.message });
//     }
// });


// =======================
// Start Server
// =======================
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});
