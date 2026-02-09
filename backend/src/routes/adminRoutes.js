const express = require('express');

const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('admin'));

router.get('/stats', adminController.getSystemStats);

module.exports = router;
