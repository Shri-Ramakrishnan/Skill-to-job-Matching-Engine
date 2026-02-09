const User = require('../models/User');
const Job = require('../models/Job');
const AppError = require('../utils/appError');

const normalizeSkill = (skillName) => skillName.trim().toLowerCase();
const hasMeaningfulFilter = (value) => {
  if (typeof value !== 'string') return false;
  const normalized = value.trim().toLowerCase();
  return normalized !== '' && normalized !== 'undefined' && normalized !== 'null';
};

const calculateWeightedMatch = (studentSkills = [], jobSkills = []) => {
  // Build a normalized lookup map once for O(1) skill checks per required job skill.
  const studentSkillMap = new Map(
    studentSkills.map((skill) => [normalizeSkill(skill.name), skill.proficiency])
  );

  let totalWeight = 0;
  let matchedWeight = 0;
  const missingSkills = [];

  for (const jobSkill of jobSkills) {
    totalWeight += jobSkill.weight;

    const key = normalizeSkill(jobSkill.name);
    if (studentSkillMap.has(key)) {
      matchedWeight += jobSkill.weight;
    } else {
      missingSkills.push(jobSkill.name);
    }
  }

  // Required formula:
  // match score = (sum of matched weights / total required weights) * 100
  const score = totalWeight === 0 ? 0 : Number(((matchedWeight / totalWeight) * 100).toFixed(2));

  return {
    score,
    missingSkills,
    matchedWeight,
    totalWeight
  };
};

const getStudentMatches = async (studentId, filters) => {
  const student = await User.findById(studentId).lean();

  if (!student || student.role !== 'student') {
    throw new AppError('Student not found.', 404);
  }

  const query = { isActive: true };
  if (hasMeaningfulFilter(filters.location)) {
    query.location = { $regex: filters.location.trim(), $options: 'i' };
  }
  if (hasMeaningfulFilter(filters.role)) {
    query.roleCategory = { $regex: filters.role.trim(), $options: 'i' };
  }

  const jobs = await Job.find(query).sort({ createdAt: -1 }).lean();

  const threshold = Number(filters.threshold || 0);
  const requiredSkillFilter = hasMeaningfulFilter(filters.requiredSkill)
    ? filters.requiredSkill
        .trim()
        .split(',')
        .map((skill) => normalizeSkill(skill))
        .filter(Boolean)
    : [];

  const matches = jobs
    .map((job) => {
      const result = calculateWeightedMatch(student.skills, job.requiredSkills);

      // Keep response explicit so frontend can directly show score + skill gaps.
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        location: job.location,
        roleCategory: job.roleCategory,
        matchScore: result.score,
        missingSkills: result.missingSkills,
        matchedWeight: result.matchedWeight,
        totalWeight: result.totalWeight,
        requiredSkills: job.requiredSkills
      };
    })
    .filter((item) => item.matchScore >= threshold)
    .filter((item) => {
      if (requiredSkillFilter.length === 0) {
        return true;
      }

      const jobSkillSet = new Set(item.requiredSkills.map((skill) => normalizeSkill(skill.name)));
      return requiredSkillFilter.every((skill) => jobSkillSet.has(skill));
    })
    .sort((a, b) => b.matchScore - a.matchScore);

  return {
    student: {
      id: student._id,
      name: student.name,
      email: student.email
    },
    totalMatches: matches.length,
    matches
  };
};

module.exports = {
  calculateWeightedMatch,
  getStudentMatches
};
