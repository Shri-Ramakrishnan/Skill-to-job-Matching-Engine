const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

const User = require('../models/User');
const Job = require('../models/Job');

dotenv.config();

const usersSeed = [
  {
    name: 'System Admin',
    email: 'admin@skilltojob.com',
    password: 'Admin@123',
    role: 'admin'
  },
  {
    name: 'Recruiter One',
    email: 'recruiter1@skilltojob.com',
    password: 'Recruiter@123',
    role: 'recruiter'
  },
  {
    name: 'Recruiter Two',
    email: 'recruiter2@skilltojob.com',
    password: 'Recruiter@123',
    role: 'recruiter'
  },
  {
    name: 'Demo Student',
    email: 'student@skilltojob.com',
    password: 'Student@123',
    role: 'student',
    skills: [
      { name: 'JavaScript', proficiency: 4 },
      { name: 'React', proficiency: 3 },
      { name: 'Node.js', proficiency: 3 },
      { name: 'MongoDB', proficiency: 2 }
    ],
    location: 'Bangalore'
  }
];

const buildJobsSeed = (recruiterOneId, recruiterTwoId) => [
  {
    title: 'Frontend Developer',
    company: 'Pixel Labs',
    description: 'Build responsive React user interfaces and consume REST APIs.',
    location: 'Bangalore',
    roleCategory: 'Frontend',
    requiredSkills: [
      { name: 'React', weight: 8 },
      { name: 'JavaScript', weight: 7 },
      { name: 'HTML', weight: 4 },
      { name: 'CSS', weight: 4 }
    ],
    recruiterId: recruiterOneId,
    isActive: true
  },
  {
    title: 'MERN Stack Developer',
    company: 'CodeWorks',
    description: 'Develop full-stack web apps with Node.js, React and MongoDB.',
    location: 'Hyderabad',
    roleCategory: 'Full Stack',
    requiredSkills: [
      { name: 'Node.js', weight: 7 },
      { name: 'React', weight: 7 },
      { name: 'MongoDB', weight: 6 },
      { name: 'Express', weight: 5 }
    ],
    recruiterId: recruiterOneId,
    isActive: true
  },
  {
    title: 'Backend Developer',
    company: 'DataForge',
    description: 'Design and maintain robust backend APIs and database models.',
    location: 'Pune',
    roleCategory: 'Backend',
    requiredSkills: [
      { name: 'Node.js', weight: 8 },
      { name: 'MongoDB', weight: 7 },
      { name: 'Express', weight: 6 },
      { name: 'Docker', weight: 3 }
    ],
    recruiterId: recruiterTwoId,
    isActive: true
  },
  {
    title: 'Junior React Developer',
    company: 'UICraft',
    description: 'Work with the UI team to build modern components and pages.',
    location: 'Bangalore',
    roleCategory: 'Frontend',
    requiredSkills: [
      { name: 'React', weight: 9 },
      { name: 'JavaScript', weight: 7 },
      { name: 'Redux', weight: 4 }
    ],
    recruiterId: recruiterTwoId,
    isActive: true
  },
  {
    title: 'API Engineer',
    company: 'ServiceStack',
    description: 'Create secure API layers with auth, validation and observability.',
    location: 'Remote',
    roleCategory: 'Backend',
    requiredSkills: [
      { name: 'Node.js', weight: 8 },
      { name: 'Express', weight: 8 },
      { name: 'JWT', weight: 5 },
      { name: 'MongoDB', weight: 6 }
    ],
    recruiterId: recruiterOneId,
    isActive: true
  }
];

const seed = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI missing in environment.');
  }

  await mongoose.connect(process.env.MONGO_URI);

  // Reset users/jobs so the demo starts from a predictable dataset.
  await Promise.all([User.deleteMany({}), Job.deleteMany({})]);

  const passwordMap = new Map();
  for (const user of usersSeed) {
    passwordMap.set(user.email, await bcrypt.hash(user.password, 10));
  }

  const createdUsers = await User.insertMany(
    usersSeed.map((user) => ({
      ...user,
      password: passwordMap.get(user.email)
    }))
  );

  const recruiterOne = createdUsers.find((user) => user.email === 'recruiter1@skilltojob.com');
  const recruiterTwo = createdUsers.find((user) => user.email === 'recruiter2@skilltojob.com');

  const jobsSeed = buildJobsSeed(recruiterOne._id, recruiterTwo._id);
  await Job.insertMany(jobsSeed);

  console.log('Seed complete. Created users:', createdUsers.length, 'jobs:', jobsSeed.length);
};

seed()
  .then(async () => {
    await mongoose.disconnect();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Seed failed:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  });
