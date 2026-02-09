const express = require('express');

const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const validate = require('../middleware/validateMiddleware');
const { updateStudentSkillsSchema } = require('../validators/studentValidator');

const router = express.Router();

router.use(authMiddleware, roleMiddleware('student'));

router.put('/skills', validate(updateStudentSkillsSchema), studentController.upsertSkills);
router.get('/matches', studentController.getMatchedJobs);

module.exports = router;
