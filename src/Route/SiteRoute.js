const { Router } = require('express');
const routeSite = Router();
const SiteController = require('../Controller/SiteController/SiteController');

//=================================== Call Utilty ==========================================================
const { ValidasiToken } = require('../Middleware/Jwt/ValidasiToken');

//=================================== END Call Utilty ==========================================================

// ============================== Route SIte from COntroller ====================================================
routeSite.post('/siteregister', ValidasiToken, SiteController.SiteRegisterController);

routeSite.get('/site', SiteController.GetAllSiteController);

// ============================== END Route SIte from COntroller ====================================================

module.exports = routeSite;
