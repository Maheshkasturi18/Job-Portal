const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // from form
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    location: { type: String, required: true },
    jobTitle: { type: String, required: true },
    resumeLink: { type: String, required: true },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    experience: { type: String, default: '' },
    education: { type: String, default: '' },
    coverLetter: { type: String, default: '' },

    status: { type: String, enum: ['pending', 'reviewed', 'accepted', 'rejected'], default: 'pending' },
    appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', applicationSchema);
