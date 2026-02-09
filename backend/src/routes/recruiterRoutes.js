const express = require('express');

const recruiterController = require('../controllers/recruiterController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { createJobSchema, updateJobSchema } = require('../validators/jobValidator');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('recruiter'));

router.get('/jobs', recruiterController.getOwnJobs);
router.post('/jobs', validate(createJobSchema), recruiterController.createJob);
router.put('/jobs/:jobId', validate(updateJobSchema), recruiterController.updateJob);
router.delete('/jobs/:jobId', recruiterController.deleteJob);

module.exports = router;
