const { prisma } = require('../../shared/prismaClient');

module.exports = async function (context, req) {
  try {
    const method = (req.method || '').toUpperCase();

    if (method === 'GET') {
      const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' }
      });
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: customers
      };
      return;
    }

    if (method === 'POST') {
      const { email, name, address, zip, city } = req.body || {};
      if (!email || !name) {
        context.res = {
          status: 400,
          body: { error: 'Missing required fields: email, name' }
        };
        return;
      }

      const customer = await prisma.customer.upsert({
        where: { email },
        update: { name, address, zip, city },
        create: { email, name, address, zip, city }
      });

      context.res = {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: customer
      };
      return;
    }

    context.res = { status: 405, body: { error: 'Method Not Allowed' } };
  } catch (err) {
    context.log('customers error', err);
    context.res = {
      status: 500,
      body: { error: 'Internal Server Error' }
    };
  }
};