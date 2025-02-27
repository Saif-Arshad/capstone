
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createBrand = async (req, res) => {
    try {
        const { name, image, slug } = req.body;
        const newBrand = await prisma.brand.create({
            data: {
                name,
                image,
                slug,
            },
        });

        return res.status(201).json({
            message: "Brand created successfully",
            data: newBrand,
        });
    } catch (error) {
        console.error("Create Brand Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.getBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const brand = await prisma.brand.findUnique({
            where: { id },
        });

        if (!brand) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json({
            message: "Brand retrieved successfully",
            data: brand,
        });
    } catch (error) {
        console.error("Get Brand Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
exports.getAllBrand = async (req, res) => {
    try {
        const brands = await prisma.brand.findMany();

        if (!brands) {
            return res.status(404).json({ message: "Brand not found" });
        }

        return res.status(200).json({
            message: "Brand retrieved successfully",
            data: brands,
        });
    } catch (error) {
        console.error("Get Brand Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.updateBrand = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, slug } = req.body;

        const updatedBrand = await prisma.brand.update({
            where: { id },
            data: {
                name,
                image,
                slug,
            },
        });

        return res.status(200).json({
            message: "Brand updated successfully",
            data: updatedBrand,
        });
    } catch (error) {
        console.error("Update Brand Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};

exports.deleteBrand = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.brand.delete({
            where: { id },
        });
        return res.status(200).json({ message: "Brand deleted successfully" });
    } catch (error) {
        console.error("Delete Brand Error:", error);
        return res.status(500).json({ message: "Server Error" });
    }
};
