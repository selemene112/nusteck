const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

//============================ Call Utility ===============================
const Joi = require('joi');
const secretKey = 'mysecretkey'; // make secret key from env
const { RegisterSiteValidate, PatchSiteStatusValidate } = require('../../Validation/SiteValidation');
const jwt = require('jsonwebtoken');
const { CountTimeDownSite } = require('../../Utility/CountTImeUtility');
//============================ END Call Utility ===============================
//================================ Call Validasi ===========================================
const validasi = require('../../Validation/SIteValidasi');
const AdminValidasi = require('../../Validation/AdminValidate');
const RemarkValidate = require('../../Validation/RemarkValidate');

//================================ END Call Validasi ===========================================

//============================ Register Site Controller ===============================
const AddRemarkController = async (req, res) => {
  const form = req.body;
  const Token = req.user;
  const { id } = req.params;

  // This Code For Validation site already or not if not will be return this response site not found
  const validatesite = await validasi.SiteValidasi(id);
  if (!validatesite) {
    return res.status(400).json({
      status: 'failed',
      message: 'Site Not Found',
      error: null,
      data: null,
    });
  }

  //+++++++++++++++++++++++++++++++++++++++++++++ Validate Admin Or Not ++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // This code for make sure you admin or not if you not admin will be return this response you are not admin
  const AdminOrNot = await AdminValidasi.AdminOrNot(Token.id);
  if (!AdminOrNot) {
    return res.status(400).json({
      status: 'failed',
      message: 'You Are Not Admin',
      error: null,
      data: null,
    });
  }
  //+++++++++++++++++++++++++++++++++++++++++++++ End Validate Admin Or Not +++++++++++++++++++++++++++++++++++++++++++

  try {
    const remarkdata = await prisma.Renmark.create({
      data: {
        id_site: id,
        remark: form.remark,
        CreatedMarkby: Token.name,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Remark Added',
      error: null,
      data: remarkdata,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      message: error.message,
      error: error,
      data: null,
    });
  }
};
//============================ END Register Site Controller ===============================

//============================ Patch For Edit Status Site COntroller =================================================
const EditRemarkController = async (req, res) => {
  const { id } = req.params;
  const { remark } = req.body;
  const Token = req.user;
  //   console.log(Token);
  const RemarkAlreadyValidate = await RemarkValidate.RemarkAlreadyValidation(id);
  if (!RemarkAlreadyValidate) {
    return res.status(404).json({
      status: 'failed',
      message: 'Remark Not Found',
      error: null,
      data: null,
    });
  }

  //++++++++++++++++++++++++++++++++++++++++++++++ Validate Admin Or Not ++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const ValidasiAmin = await prisma.Admin.findFirst({
    where: {
      id: Token.id,
    },
  });
  if (!ValidasiAmin) {
    return res.status(400).json({
      status: 'failed',
      message: 'You Are Not Admin',
      error: null,
      data: null,
    });
  }

  try {
    const remarkdata = await prisma.Renmark.update({
      where: {
        id: id,
      },
      data: {
        remark: remark,
      },
    });

    return res.status(201).json({
      status: 'success',
      message: 'Remark Edited',
      error: null,
      data: remarkdata,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      message: error.message,
      error: error,
      data: null,
    });
  }
};

//============================ END Patch For Edit Status Site COntroller =================================================

//====================================== Get All Renmark by id Site ====================================================

const GetAllRenmarkByIdSiteController = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await prisma.Renmark.findMany({
      where: {
        id_site: id,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Remark Found',
      error: null,
      data: data,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'failed',
      message: error.message,
      error: error,
      data: null,
    });
  }
};

const DeleteRenmarkbyidController = async (req, res) => {
  const { id } = req.params;
  const Token = req.user;
  const RemarkAlreadyValidate = await RemarkValidate.RemarkAlreadyValidation(id);
  if (!RemarkAlreadyValidate) {
    return res.status(404).json({
      status: 'failed',
      message: 'Remark Not Found',
      error: null,
      data: null,
    });
  }
  //++++++++++++++++++++++++++++++++++++++++++++++ Validate Admin Or Not ++++++++++++++++++++++++++++++++++++++++++++++++++++++
  const ValidasiAmin = await prisma.Admin.findFirst({
    where: {
      id: Token.id,
    },
  });
  if (!ValidasiAmin) {
    return res.status(400).json({
      status: 'failed',
      message: 'You Are Not Admin',
      error: null,
      data: null,
    });
  }
  //+++++++++++++++++++++++++++++++++++++++++++++ End Validate Admin Or Not +++++++++++++++++++++++++++++++++++++++++++
  try {
    const remarkdata = await prisma.Renmark.delete({
      where: {
        id: id,
      },
    });
    return res.status(200).json({
      status: 'success',
      message: 'Remark Deleted',
      error: null,
      data: remarkdata,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      message: error.message,
      error: error,
      data: null,
    });
  }
};

module.exports = {
  AddRemarkController,
  EditRemarkController,
  GetAllRenmarkByIdSiteController,
  DeleteRenmarkbyidController,
};
