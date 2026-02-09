const AppError = require('../utils/appError');

const roleMiddleware = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Unauthorized access.', 401));
  }

  if (!allowedRoles.includes(req.user.role)) {
    return next(new AppError('Forbidden: insufficient role privileges.', 403));
  }

  return next();
};

module.exports = roleMiddleware;
