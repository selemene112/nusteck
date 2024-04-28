const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const AdminOrNot = (id) => {
  try {
    const datasite = prisma.Admin.findFirst({
      where: {
        id: id,
      },
    });
    return datasite;
  } catch (error) {
    return error;
  }
};

module.exports = { AdminOrNot };
