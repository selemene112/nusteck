const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

const SiteValidasi = async (id, next) => {
  try {
    const datasite = await prisma.Site.findFirst({
      where: {
        id: id,
      },
    });

    return datasite;
  } catch (error) {
    return next(error);
  }
};

const LocationSiteValidasi = async (id, next) => {
  try {
    const datasite = await prisma.LocationSite.findFirst({
      where: {
        id_site: id,
      },
    });

    return datasite;
  } catch (error) {
    return next(error);
  }
};

module.exports = { SiteValidasi, LocationSiteValidasi };
