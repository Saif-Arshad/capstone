/* eslint-disable no-console */
const { faker } = require('@faker-js/faker');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// ─── tweak counts here ──────────────────────────────────────────
const NUM_NEW_CUSTOMERS = 40;
const NUM_NEW_GARAGES = 5;
const NUM_ORDERS_TOTAL = 300;
const MAX_ITEMS_PER_ORDER = 4;
// ────────────────────────────────────────────────────────────────

const statusPool = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const paymentPool = ['cod', 'stripe', 'paypal'];

async function main() {
    /* 1 ─ add extra users ------------------------------------------------ */
    await prisma.user.createMany({
        data: Array.from({ length: NUM_NEW_CUSTOMERS }, () => ({
            id: faker.string.uuid(),
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.string.nanoid(),
            role: 'CUSTOMER',
        })),
    });

    await prisma.user.createMany({
        data: Array.from({ length: NUM_NEW_GARAGES }, () => ({
            id: faker.string.uuid(),
            fullName: `${faker.company.name()} Garage`,
            email: faker.internet.email(),
            password: faker.string.nanoid(),
            role: 'GARAGE',
        })),
    });

    /* 2 ─ grab reference data once --------------------------------------- */
    const garages = await prisma.user.findMany({ where: { role: 'GARAGE' } });
    const customers = await prisma.user.findMany({ where: { role: 'CUSTOMER' } });
    const products = await prisma.products.findMany({
        select: { id: true, name: true, category: true, price: true },
    });
    if (!products.length) throw new Error('❌  No products found – seed products first.');

    /* 3 ─ build synthetic orders ----------------------------------------- */
    const now = new Date();
    const msPerMonth = 1000 * 60 * 60 * 24 * 30;

    const ordersData = Array.from({ length: NUM_ORDERS_TOTAL }).map(() => {
        const garage = faker.helpers.arrayElement(garages);
        const customer = faker.helpers.arrayElement(customers);

        // random date in the last 12 months
        const createdAt = new Date(now - faker.number.int({ min: 0, max: 11 }) * msPerMonth);
        createdAt.setDate(faker.number.int({ min: 1, max: 28 }));
        createdAt.setHours(
            faker.number.int({ min: 0, max: 23 }),
            faker.number.int({ min: 0, max: 59 }),
        );

        // line-items
        const numItems = faker.number.int({ min: 1, max: MAX_ITEMS_PER_ORDER });
        const items = Array.from({ length: numItems }).map(() => {
            const prod = faker.helpers.arrayElement(products);
            const quantity = faker.number.int({ min: 1, max: 5 });
            return {
                productId: prod.id,
                name: prod.name,
                category: prod.category,
                price: prod.price,
                totalPrice: prod.price * quantity,
                quantity,
                selectedColor: '',
                selectedSize: '',
            };
        });

        const totalPrice = items.reduce((sum, it) => sum + it.totalPrice, 0);

        return {
            id: faker.string.uuid(),
            userId: garage.id,          // GARAGE seller – good for garage dashboard
            customerId: customer.id,
            items,                           // Json field – no stringify required
            totalPrice,
            status: faker.helpers.arrayElement(statusPool),
            paymentType: faker.helpers.arrayElement(paymentPool),
            address: faker.location.streetAddress(),
            city: faker.location.city(),
            country: faker.location.country(),
            createdAt,
            updatedAt: createdAt,
        };
    });

    await prisma.order.createMany({ data: ordersData });
    console.log(`✨  Inserted ${NUM_ORDERS_TOTAL} synthetic orders`);
}

main()
    .then(() => prisma.$disconnect())
    .catch((e) => {
        console.error(e);
        prisma.$disconnect();
        process.exit(1);
    });
