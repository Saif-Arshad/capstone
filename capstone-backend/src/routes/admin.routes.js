const express = require("express");
const admincontrollers = require("../controllers/admin.controller"); 
const router = express.Router();


router.post("/users", admincontrollers.createUser);
router.get("/users", admincontrollers.getUsers);
router.get("/users/:id", admincontrollers.getUserById);
router.put("/users/:id", admincontrollers.updateUser);
router.delete("/users/:id", admincontrollers.deleteUser);

router.post("/products", admincontrollers.createProduct);
router.get("/products", admincontrollers.getAllProducts);
router.get("/products/:id", admincontrollers.getProductById);
router.put("/products/:id", admincontrollers.updateProduct);
router.delete("/products/:id", admincontrollers.deleteProduct);

module.exports = router;
