const User = require('../models/User');
const matchingService = require('../services/matchingService');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const upsertSkills = asyncHandler(async (req, res) => {
  const { skills, resumeUrl, location } = req.body;

  // Update all submitted skills in one atomic write.
  const updatePayload = { skills };
  if (typeof resumeUrl !== 'undefined') updatePayload.resumeUrl = resumeUrl;
  if (typeof location !== 'undefined') updatePayload.location = location;

  const updatedStudent = await User.findByIdAndUpdate(req.user._id, updatePayload, {
    new: true,
    runValidators: true
  }).select('-password');

  if (!updatedStudent) {
    throw new AppError('Student not found.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Skills updated successfully.',
    data: updatedStudent
  });
});

const getMatchedJobs = asyncHandler(async (req, res) => {
  // Delegates scoring and filtering to dedicated matching service.
  const result = await matchingService.getStudentMatches(req.user._id, req.query);

  res.status(200).json({
    success: true,
    message: 'Matched jobs fetched successfully.',
    data: result
  });
});

const getProfile = asyncHandler(async (req, res) => {
  const student = await User.findById(req.user._id).select('-password').lean();

  if (!student) {
    throw new AppError('Student not found.', 404);
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

module.exports = {
  upsertSkills,
  getMatchedJobs,
  getProfile
};
