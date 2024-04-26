const Joi = require('joi');

const RegisterSiteValidate = Joi.object({
  sitename: Joi.string().required(),
  namapic: Joi.string(),
  notelp: Joi.string(),
  status: Joi.string(),
  durasi: Joi.string(),
  remark: Joi.string(),
  location: Joi.string(),
  provinsi: Joi.string(),
  kota: Joi.string(),
  kecamatan: Joi.string(),
  desa: Joi.string(),
});

module.exports = { RegisterSiteValidate };
