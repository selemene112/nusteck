const jwt = require('jsonwebtoken');
const secretKey = 'mysecretkey';

// ===================================================== Validasi Token ==============================================
const ValidasiToken = async (req, res, next) => {
  // ================================================= Cek Token ====================================================
  const generateToken = req.header('Authorization');

  if (!generateToken) {
    return res.status(401).json({
      success: false,
      message: 'Input Token First',
    });
  }

  // ================================================= END Cek Token ====================================================

  try {
    const token = generateToken.split(' ')[1];
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid Token',
    });
  }
};

// ===================================================== END Validasi Token ==============================================

module.exports = {
  ValidasiToken,
};
