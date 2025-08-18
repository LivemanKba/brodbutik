const { PrismaClient } = require('@prisma/client');

let prisma;

// Reuse Prisma client across hot-reloads in Azure Functions/local dev
if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.__prisma) {
    global.__prisma = new PrismaClient();
  }
  prisma = global.__prisma;
}

module.exports = { prisma };