const User = require('../models/User');
const Job = require('../models/Job');
const asyncHandler = require('../utils/asyncHandler');

const getSystemStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalJobs, usersByRole, topSkills] = await Promise.all([
    User.countDocuments(),
    Job.countDocuments(),
    User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]),
    User.aggregate([
      { $unwind: '$skills' },
      {
        $group: {
          _id: { $toLower: '$skills.name' },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalJobs,
      usersByRole,
      topSkills
    }
  });
});

module.exports = {
  getSystemStats
};
