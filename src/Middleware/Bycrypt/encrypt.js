const bcrypt = require('bcrypt');
const saltRounds = 10;

// const myPlaintextPassword = 's0//P4$$w0rD';
const secretKey = 'your_secret_key_here';
//================================================== hash password =================================================
const hashPassword = async (plainTextPassword) => {
  try {
    const passwordWithSecret = plainTextPassword + secretKey;

    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the concatenated password using the generated salt
    const hash = await bcrypt.hash(passwordWithSecret, salt);

    // Return the hashed password
    return hash;
  } catch (error) {
    // Handle error if any
    console.error('Error:', error);
    throw new Error('Error hashing password');
  }
};

//================================================== END hash password =================================================

//================================================== compare password =================================================

const comparePassword = async (plainTextPassword, hashedPassword) => {
  try {
    const passwordWithSecret = plainTextPassword + secretKey;
    const result = await bcrypt.compare(passwordWithSecret, hashedPassword);
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error comparing password');
  }
};

//==================================================  END compare password =================================================

module.exports = { hashPassword, comparePassword };
