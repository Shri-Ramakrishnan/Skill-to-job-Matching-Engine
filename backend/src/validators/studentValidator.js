const Joi = require('joi');

const skillSchema = Joi.object({
  name: Joi.string().trim().min(1).max(60).required(),
  proficiency: Joi.number().integer().min(1).max(5).required()
});

const updateStudentSkillsSchema = Joi.object({
  skills: Joi.array().items(skillSchema).min(1).required(),
  resumeUrl: Joi.string().trim().uri().allow(''),
  location: Joi.string().trim().max(80).allow('')
});

module.exports = {
  updateStudentSkillsSchema
};
