const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

exports.getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await prisma.order.findUnique({
            where: { id },
        });

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        return res.status(200).json({ data: order });
    } catch (error) {
        console.error("Get Order By ID Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.status(400).json({ message: "Order ID and status are required" });
        }
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: { status },
        });

        return res.status(200).json({ data: updatedOrder });
    } catch (error) {
        console.error("Update Order Status Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getAllOrders = async (req, res) => {
    try {
        const orders = await prisma.order.findMany();
        return res.status(200).json({ data: orders });
    } catch (error) {
        console.error("Get All Orders Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const orders = await prisma.order.findMany({
            where: {
                userId
            }
        });
        return res.status(200).json({ data: orders });
    } catch (error) {
        console.error("Get All Orders Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.createOrder = async (req, res) => {
    try {
        const { items, totalPrice, status, city, country, address, customerId, paymentMethod } = req.body;

        // const productIds = Object.keys(items);

        // const products = await prisma.products.findMany({
        //     where: {
        //         id: { in: productIds },
        //     },
        // });

        // const orderItems = products.map(product => {
        //     const quantity = items[product.id];
        //     if (!quantity) {
        //         throw new Error("Product not found in cart");
        //     }
        //     return {
        //         ...product,
        //         quantity,
        //     };
        // });

        const orderData = {
            userId: req.user.id,
            items: items,
            totalPrice,
            country,
            customerId,
            paymentType: paymentMethod,
            address,
            city,
            ...(status && { status }),
        };

        const newOrder = await prisma.order.create({
            data: orderData,
        });

        return res.status(201).json({ data: newOrder });
    } catch (error) {
        console.error("Create Order Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

