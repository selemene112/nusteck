const { Router } = require('express');
const routeAdmin = Router();

// ============================ Import Controller ==============================
const adminController = require('../Controller/User/Admin/AdminAuthController');
// ============================= END Import Controller ==============================

// =========================== Route Auth for Admin ====================================

routeAdmin.post('/register', adminController.AdminRegisterController);

routeAdmin.post('/login', adminController.AdminLoginController);

// =========================== END Route Auth for Admin ====================================

module.exports = routeAdmin;
