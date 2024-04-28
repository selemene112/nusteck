const Joi = require('joi');

const RegisterSiteValidate = Joi.object({
  siteid: Joi.string().required(),
  sitename: Joi.string().required(),
  status: Joi.string().valid('Close', 'Open', 'On_Progress').default('Close'),
});

const PatchSiteStatusValidate = Joi.object({
  status: Joi.string().valid('Close', 'Open', 'On_Progress').default('Close'),
  durasi: Joi.number().integer().default(0),
});

module.exports = { RegisterSiteValidate, PatchSiteStatusValidate };
