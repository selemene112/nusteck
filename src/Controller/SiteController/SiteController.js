const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

//============================ Call Utility ===============================
const Joi = require('joi');
const secretKey = 'mysecretkey'; // make secret key from env
const { RegisterSiteValidate } = require('../../Validation/SiteValidation');

const jwt = require('jsonwebtoken');
//============================ END Call Utility ===============================

//  ================================================= Register Site Controller ===============================
const SiteRegisterController = async (req, res) => {
  const form = req.body;
  const Token = req.user;

  //+++++++++++++++++++++++++++++++++++++++++++++ Validasi Admin Or NOt ++++++++++++++++++++++++++++++++++++++++++
  //Search from tabel admin and make sure you are an admin
  const ValidasiAdmin = await prisma.admin.findFirst({
    where: {
      id: Token.id,
    },
  });
  // if you not admin will be return this response
  if (!ValidasiAdmin) {
    return res.status(401).json({
      status: 'failed',
      success: false,
      data: null,
      message: 'If you are not an admin, you cannot add ',
    });
  }

  //+++++++++++++++++++++++++++++++++++++++++ END Validasi Admin Or NOt +++++++++++++++++++++++++++++++++++++++++

  //+++++++++++++++++++++++++++++++++++++++++++++ Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++

  const { error } = await RegisterSiteValidate.validate({
    sitename: form.sitename,
    namapic: form.namapic,
    notelp: form.notelp,
    status: form.status,
    durasi: form.durasi,
    remark: form.remark,
    location: form.location,
    provinsi: form.provinsi,
    kota: form.kota,
    kecamatan: form.kecamatan,
    desa: form.desa,
  });
  if (error) {
    return res.status(400).json({
      message: error.message,
      error: error,
      data: null,
    });
  }
  //+++++++++++++++++++++++++++++++++++++++++ END Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++++++++++++

  try {
    //if all clear and this code for create site
    const datasiteRegister = await prisma.Site.create({
      data: {
        sitename: form.sitename,
        namapic: form.namapic,
        notelp: form.notelp,
        status: form.status,
        durasi: form.durasi,
        remark: form.remark,
        location: form.location,
        provinsi: form.provinsi,
        kota: form.kota,
        kecamatan: form.kecamatan,
        desa: form.desa,
      },
    });
    // this respon if success
    return res.status(200).json({
      status: 'success',
      message: 'Register Success',
      error: null,
      data: datasiteRegister,
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

//=========================================== Get all site Controller ====================================================

const GetAllSiteController = async (req, res) => {
  try {
    const datasite = await prisma.Site.findMany();
    return res.status(200).json({
      status: 'success',
      message: 'Get All Site Success',
      error: null,
      data: datasite,
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

//=========================================== END Get all site Controller ====================================================

module.exports = {
  GetAllSiteController,
  SiteRegisterController,
};
