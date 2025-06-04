const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");



const { handlePostJob,
    handleGetJob,
    handleGetbyIdJob,
    handleGetJobEmployer,
    handleUpdateJob,
    handleDeleteJob } = require("../controllers/jobController");


router.post('/api/jobs', authenticateToken, authorizeRoles('employer'), handlePostJob);

router.get('/api/jobs', handleGetJob);

router.get('/api/jobs/:id', handleGetbyIdJob);

router.get('/api/employer/jobs', authenticateToken, authorizeRoles('employer'), handleGetJobEmployer);

router.patch('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), handleUpdateJob);

router.delete('/api/jobs/:id', authenticateToken, authorizeRoles('employer'), handleDeleteJob);

module.exports = router;