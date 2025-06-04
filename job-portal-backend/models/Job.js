const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: String,
    requirements: String,
    company: String,
    location: String,
    category: String,
    salaryMin: String,
    salaryMax: String,
    salaryType: { type: String, enum: ['per_month', 'per_annum', 'per_hour'] },
    currency: { type: String, enum: ['INR', 'USD', 'EUR'], default: 'INR' },
    type: String,
    employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);