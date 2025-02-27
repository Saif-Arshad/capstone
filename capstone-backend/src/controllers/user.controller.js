const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        console.log("🚀 ~ exports.register= ~ password:", password)
        console.log("🚀 ~ exports.register= ~ email:", email)
        console.log("🚀 ~ exports.register= ~ fullName:", fullName)

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
            },
        });

        const token = jwt.sign({ id: newUser.id, role: newUser.role }, SECRET_KEY, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "User registered successfully",
            user: { id: newUser.id, fullName: newUser.fullName, email: newUser.email, role: newUser.role },
            token,
        });
    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, {
            expiresIn: "7d",
        });

        res.status(200).json({
            message: "Login successful",
            user: { id: user.id, fullName: user.fullName, email: user.email, role: user.role },
            token,
        });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
