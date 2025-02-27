const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brand.controller');

router.post('/', brandController.createBrand);
router.get('/', brandController.getAllBrand);
router.get('/:id', brandController.getBrand);

router.put('/:id', brandController.updateBrand);

router.delete('/:id', brandController.deleteBrand);

module.exports = router;
