// controllers.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();



exports.createUser = async (req, res) => {
const ownerId = req.user.id
    try {
        const { fullName, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                fullName,
                email,
                password: hashedPassword,
                role: "CUSTOMER",
                customer: ownerId
            },
        });

        return res.status(201).json({
            message: "User created successfully",
            data: newUser,
        });
    } catch (error) {
        console.error("Create User Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getUsers = async (req, res) => {
    const ownerId = req.user.id

    try {
        const users = await prisma.user.findMany({
            where:{
                customer: ownerId
            }
        });
        return res.status(200).json({ data: users });
    } catch (error) {
        console.error("Get Users Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};


exports.createProduct = async (req, res) => {
    const garageId = req.user.id
    console.log("🚀 ~ exports.createProduct= ~ garageId:", garageId)

    try {
        const { name, description, price, quantity, images, category } = req.body;

        const newProduct = await prisma.products.create({
            data: {
                name,
                description,
                price,
                quantity,
                createdBy: `${garageId}`,
                category,
                images: {
                    create: (images || []).map((url) => ({ url })),
                },
            },
            include: { images: true },
        });

        return res.status(201).json({
            message: "Product created successfully",
            data: newProduct,
        });
    } catch (error) {
        console.error("Create Product Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getProducts = async (req, res) => {
    const garageId = req.user.id
    try {
        const allProducts = await prisma.products.findMany({
            where: {
                createdBy: garageId
            },
            include: { images: true },
        });
        return res.status(200).json({ data: allProducts });
    } catch (error) {
        console.error("Get Products Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma.products.findUnique({
            where: { id },
            include: { images: true },
        });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        return res.status(200).json({ data: product });
    } catch (error) {
        console.error("Get Product By ID Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, images } = req.body;

        const updatedProduct = await prisma.products.update({
            where: { id },
            data: {
                name,
                description,
                price,
                quantity,
                images: {
                    deleteMany: {},
                    create: (images || []).map((url) => ({ url })),
                },
            },
            include: { images: true },
        });

        return res.status(200).json({
            message: "Product updated successfully",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("Update Product Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🚀 ~ exports.deleteProduct ~ id:", id);

        // Delete all associated images first
        await prisma.image.deleteMany({
            where: { productId: id },
        });

        // Then delete the product
        const deletedProduct = await prisma.products.delete({
            where: { id },
        });

        return res.status(200).json({
            message: "Product deleted successfully",
            data: deletedProduct,
        });
    } catch (error) {
        console.error("Delete Product Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

