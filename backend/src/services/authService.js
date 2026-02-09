const bcrypt = require('bcryptjs');
const User = require('../models/User');
const AppError = require('../utils/appError');
const generateToken = require('../utils/generateToken');

const registerUser = async ({ name, email, password, role }) => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('Email already registered.', 409);
  }

  // Hash password before storage; raw passwords are never persisted.
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role
  });

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return {
    user: safeUser,
    token: generateToken(user)
  };
};

const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('Invalid email or password.', 401);
  }

  // Compare plaintext password against stored bcrypt hash.
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Invalid email or password.', 401);
  }

  const safeUser = {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  };

  return {
    user: safeUser,
    token: generateToken(user)
  };
};

module.exports = {
  registerUser,
  loginUser
};
