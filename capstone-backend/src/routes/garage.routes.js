const express = require("express");
const garagecontrollers = require("../controllers/garage.controller"); // path to the file above
const { verifySupplierToken, verifyGarageToken } = require("../middleware/Garage");
const router = express.Router();



router.post("/user/create", verifyGarageToken, garagecontrollers.createUser);
router.get("/user/get", verifyGarageToken, garagecontrollers.getUsers);
router.post("/products", verifySupplierToken, garagecontrollers.createProduct);
router.get("/products", verifySupplierToken, garagecontrollers.getProducts);
router.get("/products/:id", garagecontrollers.getProductById);
router.put("/products/:id", garagecontrollers.updateProduct);
router.delete("/products/:id", garagecontrollers.deleteProduct);

module.exports = router;
