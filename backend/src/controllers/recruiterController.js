const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/appError');

const createJob = asyncHandler(async (req, res) => {
  // Recruiter ownership is derived from JWT user, not request body.
  const job = await Job.create({
    ...req.body,
    recruiterId: req.user._id
  });

  res.status(201).json({
    success: true,
    message: 'Job created successfully.',
    data: job
  });
});

const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findOneAndUpdate(
    { _id: jobId, recruiterId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!job) {
    throw new AppError('Job not found or you are not allowed to edit this job.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Job updated successfully.',
    data: job
  });
});

const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findOneAndDelete({ _id: jobId, recruiterId: req.user._id });

  if (!job) {
    throw new AppError('Job not found or you are not allowed to delete this job.', 404);
  }

  res.status(200).json({
    success: true,
    message: 'Job deleted successfully.'
  });
});

const getOwnJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ recruiterId: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: {
      total: jobs.length,
      jobs
    }
  });
});

module.exports = {
  createJob,
  updateJob,
  deleteJob,
  getOwnJobs
};
