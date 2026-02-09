const Joi = require('joi');

const requiredSkillSchema = Joi.object({
  name: Joi.string().trim().min(1).max(60).required(),
  weight: Joi.number().integer().min(1).max(10).required()
});

const createJobSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120).required(),
  company: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(10).required(),
  location: Joi.string().trim().min(2).max(100).required(),
  roleCategory: Joi.string().trim().min(2).max(80).required(),
  requiredSkills: Joi.array().items(requiredSkillSchema).min(1).required()
});

const updateJobSchema = Joi.object({
  title: Joi.string().trim().min(2).max(120),
  company: Joi.string().trim().min(2).max(120),
  description: Joi.string().trim().min(10),
  location: Joi.string().trim().min(2).max(100),
  roleCategory: Joi.string().trim().min(2).max(80),
  requiredSkills: Joi.array().items(requiredSkillSchema).min(1),
  isActive: Joi.boolean()
}).min(1);

module.exports = {
  createJobSchema,
  updateJobSchema
};
