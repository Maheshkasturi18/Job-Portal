const express = require('express');
const router = express.Router();
const { Login, Register } = require('../controllers/userController');

router.post('/api/register', Register);

router.post('/api/login', Login);

module.exports = router;