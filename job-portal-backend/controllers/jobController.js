const Job = require('../models/Job');

async function handlePostJob(req, res) {
    try {
        const { title, description, requirements, company, location, category, salaryMin, salaryMax, salaryType, currency, type } = req.body;

        // ✅ Salary range validation
        if (salaryMin && salaryMax && Number(salaryMin) > Number(salaryMax)) {
            return res.status(400).json({ message: "Min salary cannot be greater than max salary" });
        }

        const job = new Job({
            title,
            description,
            requirements,
            company,
            location,
            category,
            salaryMin,
            salaryMax,
            salaryType,
            currency,
            type,
            employerId: req.user.id
        });
        await job.save();
        console.log('POST Jobs form submitted successfully:', job);
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error creating job', error: err.message });
    }
};

async function handleGetJob(req, res) {
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
};


async function handleGetbyIdJob(req, res) {
    try {
        const job = await Job.findById(req.params.id);
        if (!job) return res.status(404).json({ message: 'Job not found' });
        res.json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching job', error: err.message });
    }
}


async function handleGetJobEmployer(req, res) {
    try {
        const { title, category, location } = req.query;
        const filter = { employerId: req.user.id };

        if (title) filter.title = new RegExp(title, 'i');
        if (category) filter.category = category;
        if (location) filter.location = new RegExp(location, 'i');

        const jobs = await Job.find(filter).sort({ postedDate: -1 });
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching employer jobs', error: err.message });
    }
}

async function handleUpdateJob(req, res) {
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
};

async function handleDeleteJob(req, res) {
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
};



module.exports = {
    handlePostJob,
    handleGetJob,
    handleGetbyIdJob,
    handleGetJobEmployer,
    handleUpdateJob,
    handleDeleteJob
};