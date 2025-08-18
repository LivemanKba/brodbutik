const { prisma } = require('../../shared/prismaClient');

/**
 * POST /api/orders
 * body: {
 *   customer: { email, name, address?, zip?, city? },
 *   items: [{ sku, name, price, quantity }]
 * }
 *
 * Implementation notes:
 * - Products are upserted by sku (convert price kr to cents).
 * - Customer is upserted by email.
 * - Order + OrderItems are created in a transaction and totals computed server-side.
 */
module.exports = async function (context, req) {
  try {
    const method = (req.method || '').toUpperCase();

    if (method === 'GET') {
      // Basic listing (latest first) with items and customer
      const orders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          customer: true,
          items: {
            include: { product: true }
          }
        }
      });
      context.res = {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: orders
      };
      return;
    }

    if (method === 'POST') {
      const { customer, items } = req.body || {};

      // Validate
      if (!customer || !customer.email || !customer.name) {
        context.res = { status: 400, body: { error: 'Missing customer fields: email, name' } };
        return;
      }
      if (!Array.isArray(items) || items.length === 0) {
        context.res = { status: 400, body: { error: 'Items array is required' } };
        return;
      }

      // Normalize items: ensure prices are numbers, convert to cents
      const normalizedItems = items.map((it) => {
        const price = Number(it.price);
        const quantity = Number(it.quantity ?? 1);
        if (!it.sku || !it.name || !Number.isFinite(price) || !Number.isFinite(quantity) || quantity <= 0) {
          throw new Error('Invalid item: must include sku, name, price (number), quantity (>0)');
        }
        const priceCents = Math.round(price * 100);
        return { sku: String(it.sku), name: String(it.name), priceCents, quantity };
      });

      const result = await prisma.$transaction(async (tx) => {
        // Upsert customer
        const dbCustomer = await tx.customer.upsert({
          where: { email: customer.email },
          update: {
            name: customer.name,
            address: customer.address ?? null,
            zip: customer.zip ?? null,
            city: customer.city ?? null
          },
          create: {
            email: customer.email,
            name: customer.name,
            address: customer.address ?? null,
            zip: customer.zip ?? null,
            city: customer.city ?? null
          }
        });

        // Ensure products exist and collect product refs
        const products = [];
        for (const it of normalizedItems) {
          const product = await tx.product.upsert({
            where: { sku: it.sku },
            update: { name: it.name, priceCents: it.priceCents },
            create: { sku: it.sku, name: it.name, priceCents: it.priceCents }
          });
          products.push({ it, product });
        }

        // Compute totals
        const totalCents = products.reduce((sum, p) => sum + p.it.priceCents * p.it.quantity, 0);

        // Create order and items
        const order = await tx.order.create({
          data: {
            customerId: dbCustomer.id,
            totalCents,
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            items: {
              create: products.map(({ it, product }) => ({
                productId: product.id,
                quantity: it.quantity,
                unitPriceCents: it.priceCents
              }))
            }
          },
          include: {
            customer: true,
            items: { include: { product: true } }
          }
        });

        return order;
      });

      context.res = {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
        body: result
      };
      return;
    }

    context.res = { status: 405, body: { error: 'Method Not Allowed' } };
  } catch (err) {
    context.log('orders error', err);
    context.res = { status: 500, body: { error: 'Internal Server Error' } };
  }
};