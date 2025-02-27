const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

const handleTokenError = (error, res) => {
    if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: "Invalid token." });
    }
    if (error.name === "TokenExpiredError") {
        return res.status(401).json({ error: "Token has expired." });
    }
    return res.status(500).json({ error: error.message });
};


exports.verifyGarageToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log("🚀 ~ exports.verifyGarageToken= ~ token:", token)
        if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("🚀 ~ exports.verifyEmployeeToken= ~ decoded:", decoded)

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: "Invalid or expired session." });

        if (user.role !== "GARAGE") return res.status(403).json({ error: "Access Denied. Garage Owner only route." });

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        handleTokenError(error, res);
    }
};
exports.verifySupplierToken = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log("🚀 ~ exports.verifyGarageToken= ~ token:", token)
        if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("🚀 ~ exports.verifyEmployeeToken= ~ decoded:", decoded)

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: "Invalid or expired session." });

        if (user.role !== "SUPPLIER") return res.status(403).json({ error: "Access Denied. Garage Owner only route." });

        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        handleTokenError(error, res);
    }
};
exports.verifyUser = async (req, res, next) => {
    try {
        let token = req.header("Authorization");
        console.log("🚀 ~ exports.verifyGarageToken= ~ token:", token)
        if (!token) return res.status(403).json({ error: "Access Denied. No token provided." });

        if (token.startsWith("Bearer ")) token = token.slice(7, token.length).trimLeft();

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("🚀 ~ exports.verifyEmployeeToken= ~ decoded:", decoded)

        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) return res.status(401).json({ error: "Invalid or expired session." });


        req.user = user;
        req.token = token;

        next();
    } catch (error) {
        handleTokenError(error, res);
    }
};