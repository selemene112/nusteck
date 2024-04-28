const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const RemarkAlreadyValidation = async (id) => {
  try {
    const datasite = prisma.Remark.findFirst({
      where: {
        id: id,
      },
    });
    return datasite;
  } catch (error) {
    return error;
  }
};

module.exports = { RemarkAlreadyValidation };
