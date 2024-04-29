const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const coba = async (req, res) => {
  const Token = {
    id: 'fd757f0e-32f5-4816-a0c0-2b7a3a8ddc1e',
    name: 'Admin',
  };
  const errorterus = await prisma.PersonRes.create({
    data: {
      id_site: '0d317749-2ade-4f38-9a24-eb677d1f675c',
      name_site: 'datasiteRegister.sitename,',
      id_admin: Token.id,
      name_admin: Token.name,
    },
  });
  console.log(errorterus);
};
coba();
