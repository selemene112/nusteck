const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//============================ Call Utility ===============================
let datasite = prisma.Site.findMany();

const CountTimeDownSite = async (site) => {
  const currentTime = Date.now();

  const w = await site.map((site) => {
    const updatedAt = new Date(site.updatedAt).getTime();
    const duration = currentTime - updatedAt;

    const seconds = Math.floor((duration / 1000) % 60);
    const minutes = Math.floor((duration / (1000 * 60)) % 60);
    const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    if (site.status === 'Open') {
      const formattedDuration = `Time Site Down : ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      return {
        id: site.id,
        sitename: site.sitename,
        durasi: formattedDuration,
        status: site.status,
        updatedAt: site.updatedAt,
        createdAt: site.createdAt,
      };
    } else if (site.status === 'Close') {
      const formattedDurationClose = `Time Site Up : ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      return {
        id: site.id,
        sitename: site.sitename,
        durasi: formattedDurationClose,
        status: site.status,
        updatedAt: site.updatedAt,
        createdAt: site.createdAt,
      };
    } else if (site.status === 'On_Progress') {
      const formattedDurationOnProgress = `Time Site On Progress : ${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      return {
        id: site.id,
        sitename: site.sitename,
        durasi: formattedDurationOnProgress,
        status: site.status,
        updatedAt: site.updatedAt,
        createdAt: site.createdAt,
      };
    }
  });

  //   console.log(w);
};

// (async () => {
//   let datasite = await prisma.Site.findMany();
//   CountTimeDownSite(datasite);
// })();

// module.exports = { CountTimeDownSite };
