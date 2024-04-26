const { Router } = require('express');
const routeSite = Router();
const SiteController = require('../Controller/SiteController/SiteController');

//=================================== Call Utilty ==========================================================
const { ValidasiToken } = require('../Middleware/Jwt/ValidasiToken');

//=================================== END Call Utilty ==========================================================

// ============================== Route SIte from COntroller ====================================================
routeSite.post('/siteregister', ValidasiToken, SiteController.SiteRegisterController);

routeSite.get('/site', SiteController.GetAllSiteController);

routeSite.get('/countstatus', SiteController.GetCountStatusSiteController); // This for count status

routeSite.get('/pagnation', SiteController.PagnationSiteController);

// ============================== END Route SIte from COntroller ====================================================

module.exports = routeSite;
