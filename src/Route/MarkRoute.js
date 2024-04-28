const { Router } = require('express');
const routeMark = Router();
const MarkController = require('../Controller/SiteController/RemarkController');
const { ValidasiToken } = require('../Middleware/Jwt/ValidasiToken');

routeMark.post('/addremark/:id', ValidasiToken, MarkController.AddRemarkController);

routeMark.get('/getallremark/:id', MarkController.GetAllRenmarkByIdSiteController);

routeMark.delete('/deleteremark/:id', ValidasiToken, MarkController.DeleteRenmarkbyidController);

routeMark.put('/editremark/:id', ValidasiToken, MarkController.EditRemarkController);

module.exports = routeMark;
