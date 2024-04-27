const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

//============================ Call Utility ===============================
const Joi = require('joi');
const secretKey = 'mysecretkey'; // make secret key from env

const { hashPassword, comparePassword } = require('../../../Middleware/Bycrypt/encrypt');
const jwt = require('jsonwebtoken');

//============================ END Call Utility ===============================

// ============================= Admin Register Controller ==============================
const AdminRegisterController = async (req, res) => {
  const { name, email, password, photo } = req.body;
  //+++++++++++++++++++++++++++++++++++++++++++++ Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++
  const skema = Joi.object({
    name: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8),
  });

  const { error } = skema.validate({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // Respon if error from joi
  if (error) {
    return res.status(400).json({
      message: error.message,
      error: error,
      data: null,
    });
  }

  //+++++++++++++++++++++++++++++++++++++++++ END Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++++++++++++++

  try {
    const passwordHashed = await hashPassword(password);

    const data = await prisma.Admin.create({
      data: {
        name: name,
        email: email,
        password: passwordHashed,
        photo: photo,
      },
    });
    return res.status(201).json({
      status: 'success',
      data: data,
      message: 'User has been successfully created',
    });
  } catch (error) {
    // +++++++++++++++++++++++++++++++++++ Return error from Prisma +++++++++++++++++++++++++++++++++++++++++++++++
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // return email already exist from prisma
      if (error.code === 'P2002') {
        return res.status(400).json({
          message: 'There is a unique constraint violation, a new user cannot be created with this email',
          error: error,
          data: null,
        });
      }
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

// ============================= END Admin Register Controller ==============================

// ============================= Admin Login Controller =========================================================
const AdminLoginController = async (req, res) => {
  const { email, password } = req.body;
  //+++++++++++++++++++++++++++++++++++++++++++++ Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++
  const skema = Joi.object({
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
    password: Joi.string().required().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  });

  const { error } = skema.validate({
    email: email,
    password: password,
  });

  // respon from joi
  if (error) {
    return res.status(400).json({
      status: 'failed',
      message: error.message,
      error: error,
      data: null,
    });
  }

  //+++++++++++++++++++++++++++++++++++++++++ END Validate Use Joi +++++++++++++++++++++++++++++++++++++++++++++++++++++++

  try {
    const data = await prisma.Admin.findFirst({
      where: {
        email: email,
      },
    });
    const checkPassword = await comparePassword(password, data.password);

    if (!data || !checkPassword) {
      return res.status(400).json({
        status: 'failed',
        message: 'Email and Password Wrong',
        error: error,
        data: null,
      });
    }

    const token = {
      id: data.id,
      name: data.name,
      email: data.email,
      photo: data.photo,
    };

    const TokenForKogin = jwt.sign(token, secretKey, {
      expiresIn: '1d',
    });

    return res.status(200).json({
      status: 'success',
      message: 'Login Success',
      token: TokenForKogin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'failed',
      message: 'Internal Server Error',
      error: error.message,
      data: null,
    });
  }
};

// ============================= END Admin Login Controller =========================================================

//export Fuction to Route

module.exports = {
  AdminRegisterController,
  AdminLoginController,
};
