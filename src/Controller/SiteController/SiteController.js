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

//================================ END Call Validasi ===========================================
/* 
This Code For Modified Data From Site

Feature Site :
1)Register Site Controller 
  ==> Site Register
  ==> LocationSite
  ==> PersonRes
2)Get All Site Controller
3)Get Count Status
4)Patch For Edit Status 
5)Patch For Edit Durasi
 */

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
    siteid: form.siteid,
    sitename: form.sitename,
    status: form.status,
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
    await prisma.$transaction(async (prisma) => {
      // This For Register Site

      const datasiteRegister = await prisma.Site.create({
        data: {
          siteid: form.siteid,
          sitename: form.sitename,
          status: form.status,
        },
      });

      const personResData = {};

      console.log(personResData);

      //++++++++++++++++++++++++++++++++++++++++++++++++ Make PersenRes ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
      // This Code For Create Who Create Site and Who Edit this site
      const dataRegisPersen = await prisma.PersonRes.create({
        data: {
          id_site: datasiteRegister.id,
          name_site: datasiteRegister.sitename,
          id_admin: Token.id,
          name_admin: Token.name,
        },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Register Success',
        error: null,
        data: {
          datasiteRegister: datasiteRegister,
          MakePersenres: dataRegisPersen,
        },
      });
    });

    //++++++++++++++++++++++++++++++++++++++++++++++++ END Make PersenRes +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    // this respon if success
  } catch (error) {
    console.log(error);
    // +++++++++++++++++++++++++++++++++++ Return error from Prisma +++++++++++++++++++++++++++++++++++++++++++++++
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // return email already exist from prisma
      if (error.code === 'P2002') {
        return res.status(400).json({
          message: message.error,
          error: error,
          data: null,
        });
      }
    } else if (error.code === 'P2003') {
      return res.status(400).json({
        message: message.error,
        error: error,
        data: null,
      });
    } else {
      // return error from server
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message,
        data: null,
      });
    }
  }
};

//============================ END Register Site Controller ===============================
//=================================== Register Location Site ======================================================================
const RegisterLocationSiteController = async (req, res) => {
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
    /* 
    this code for check location already or not
    if nothing location this code will be make new location for utilty site
    if locion already this code will be update location for utilty
    */
    const LocationalreadyValidation = await validasi.LocationSiteValidasi(id);
    console.log(LocationalreadyValidation);
    if (!LocationalreadyValidation) {
      // This Code For Create Location
      const datasiteRegister = await prisma.LocationSite.create({
        data: {
          id_site: id,
          namapic: form.namapic,
          notelp: form.notelp,
          latitude: form.latitude,
          longitude: form.longitude,
          provinsi: form.provinsi,
          kabupaten: form.kabupaten,
          kecamatan: form.kecamatan,
          desa: form.desa,
        },
      });
      return res.status(200).json({
        status: 'success',
        message: 'Register Location Success',
        error: null,
        data: datasiteRegister,
      });
    } else {
      // This Code For Update Location
      const editdataLocation = await prisma.LocationSite.update({
        where: {
          id_site: id,
        },
        data: {
          namapic: form.namapic,
          notelp: form.notelp,
          latitude: form.latitude,
          longitude: form.longitude,
          provinsi: form.provinsi,
          kabupaten: form.kabupaten,
          kecamatan: form.kecamatan,
          desa: form.desa,
        },
      });
      // This Code For Create Who Create Site and Who Edit this site
      // await prisma.PersonRes.update({
      //   where: {
      //     id_site: id,
      //   },
      //   data: {
      //     id_admin: Token.id,
      //     name_admin: Token.name,
      //   },
      // });
      return res.status(200).json({
        status: 'success',
        message: 'Edit Location Success',
        error: null,
        data: editdataLocation,
      });
    }
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

//=========================================== END Register Location Site ====================================================
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

//================================================  Get Count Status Site COntroller =================================================

const GetCountStatusSiteController = async (req, res) => {
  try {
    const datasiteClose = await prisma.Site.count({
      where: {
        status: 'Close',
      },
    });

    const datasiteOpen = await prisma.Site.count({
      where: {
        status: 'Open',
      },
    });

    const datasiteOnprogress = await prisma.Site.count({
      where: {
        status: 'On_Progress',
      },
    });

    return res.status(200).json({
      status: 'success',
      message: 'Get Count Status Success',
      error: null,
      data: {
        datasiteClose: datasiteClose,
        datasiteOpen: datasiteOpen,
        datasiteOnprogress: datasiteOnprogress,
      },
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

//================================================ END Get Count Status Site COntroller =================================================

//================================================ Patch For Edit Status Site COntroller =================================================
const EditStatusSiteController = async (req, res) => {
  const { id } = req.params;
  const { status, durasi } = req.body;
  const Token = req.token;
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
  //+++++++++++++++++++++++++++++++++++++++++++++ Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++
  const { error } = PatchSiteStatusValidate.validate({ status, durasi });

  if (error) {
    return res.status(400).json({
      message: error.message,
      error: error,
      data: null,
    });
  }

  //+++++++++++++++++++++++++++++++++++++++++ END Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++++++++++++++
  try {
    await prisma.$transaction(async (tx) => {
      const datasite = await prisma.Site.update({
        where: {
          id: id,
        },
        data: {
          status: status,
          durasi: durasi,
        },
      });

      await prisma.PersonRes.update({
        where: {
          id_site: id,
        },
        data: {
          id_admin: Token.id,
          name_admin: Token.name,
        },
      });

      return res.status(200).json({
        status: 'success',
        message: 'Edit Status Success',
        error: null,
        data: datasite,
      });
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

//================================================ END Patch For Edit Status Site COntroller =================================================

//======================+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++==========================================================

//==============+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++===============================================
/*

This Feature For Pagnation Site 

this Code will Showing data from 
Site table
KontakPerson table
Remark
PersonRes => i will Make this code in future to find out who created and edited the table

*/
//===================================================Pagnation Site Controller ==========================================================

const PagnationSiteController = async (req, res) => {
  const { pageNumber, pageSize, searchCriteria } = req.query;
  let page = parseInt(req.query.pageSize) || 1;
  try {
    const skip = (pageNumber - 1) * pageSize;
    let where = {}; // Save Object for save momery filter

    if (searchCriteria) {
      where = {
        OR: [{ sitename: { contains: searchCriteria } }, { desa: { contains: searchCriteria } }, { kecamatan: { contains: searchCriteria } }, { kota: { contains: searchCriteria } }, { provinsi: { contains: searchCriteria } }],
      };
    }

    const ResultSitePagnation = await prisma.Site.findMany({
      skip,
      take: page,
      orderBy: {
        createdAt: 'desc',
      },
      where,
    });

    const totalSite = await prisma.Site.count({
      where,
    });

    let totalData = totalSite;
    let totalPage = Math.ceil(totalData / pageSize);
    let nextPage = pageNumber < totalPage ? +pageNumber + 1 : null;
    let prevPage = pageNumber > 1 ? pageNumber - 1 : null;
    let lastPage = totalPage;

    return res.status(200).json({
      status: 'success',
      message: 'This All Data Search From Site',
      error: null,
      data: {
        ResultSitePagnation,
        totalData: totalData,
        totalPage: totalPage,
        currentPage: +pageNumber,
        nextPage: nextPage,
        prevPage: prevPage,
        lastPage: lastPage,
      },
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

//=================================================== END Pagnation Site Controller ==========================================================

/* 
                                                      This Code For Modified Data From Site 
================================================================================================================================================================
Plan Feature : 
Patch Status Site
Patch Location Site
Patch Remark
*/

module.exports = {
  GetAllSiteController,
  SiteRegisterController,
  GetCountStatusSiteController,
  PagnationSiteController,
  EditStatusSiteController,
  RegisterLocationSiteController,
};
