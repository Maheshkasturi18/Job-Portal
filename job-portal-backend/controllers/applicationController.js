const Application = require('../models/Application');
const Job = require('../models/Job');


async function handlePostApplication(req, res) {
    try {
        const {
            fullName,
            email,
            phone,
            location,
            jobTitle,
            resumeLink,
            linkedin = '',
            portfolio = '',
            experience = '',
            education = '',
            coverLetter = '',
        } = req.body;

        // Basic required‑fields check
        if (!fullName || !email || !phone || !location || !jobTitle || !resumeLink) {
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
            jobTitle,
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


async function handleGetApplication(req, res) {
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


async function handleGetApplicationbyId(req, res) {
    try {
        const appDoc = await Application.findById(req.params.id)
            .populate('jobId', 'title company employerId')
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


async function handleUpdateApplication(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'reviewed', 'accepted', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status value.' });
        }

        const application = await Application.findById(id).populate('jobId');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Ensure only employer who posted the job can update
        if (
            req.user.role !== 'employer' ||
            application.jobId.employerId.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        application.status = status;
        await application.save();

        res.json({ message: 'Application status updated successfully', application });
    } catch (err) {
        console.error('Error updating application status:', err);
        res.status(500).json({ message: 'Error updating application status', error: err.message });
    }
}






module.exports = {
    handlePostApplication,
    handleGetApplication,
    handleGetApplicationbyId,
    handleUpdateApplication
};