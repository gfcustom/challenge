const Joi = require("joi");

const companyAdhesionSchema = Joi.object({
  cuit: Joi.string().pattern(/^\d{2}-\d{8}-\d{1}$/).required(),
  name: Joi.string().min(3).required(),
  adhesionDate: Joi.date().iso().required(),
});

const transferSchema = Joi.object({
  amount: Joi.number().greater(0).required(),
  companyId: Joi.string().pattern(/^\d{2}-\d{8}-\d{1}$/).required(),
  debitAccount: Joi.string().min(1).required(),
  creditAccount: Joi.string().min(1).required(),
  date: Joi.date().iso().required(),
});

/**
 * Middleware que valida req.body con el esquema Joi y devuelve errores 400
 */
function validateCompanyAdhesion(req, res, next) {
  const { error } = companyAdhesionSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

function validateTransfer(req, res, next) {
  const { error } = transferSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}

module.exports = { validateCompanyAdhesion, validateTransfer };