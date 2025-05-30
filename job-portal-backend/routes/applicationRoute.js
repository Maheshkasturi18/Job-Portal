const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeRoles } = require("../middleware/auth");


const { handlePostApplication,
    handleGetApplication,
    handleGetApplicationbyId,
    handleUpdateApplication } = require("../controllers/applicationController");



router.post('/api/jobs/:id/apply',
    authenticateToken,
    authorizeRoles('jobseeker'), handlePostApplication);

router.get('/api/applications',
    authenticateToken, handleGetApplication);

router.get('/api/applications/:id',
    authenticateToken, handleGetApplicationbyId);

router.patch('/api/applications/:id', authenticateToken, handleUpdateApplication);

module.exports = router;