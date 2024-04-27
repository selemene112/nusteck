const Joi = require('joi');

const RegisterSiteValidate = Joi.object({
  siteid: Joi.string().required(),
  sitename: Joi.string().required(),
  status: Joi.string().valid('Close', 'Open', 'On_Progress').default('Close'),
});

module.exports = { RegisterSiteValidate };
