const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

// Controllers import karte waqt dhyan dein ki sabhi functions controller mein defined hon
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

// Routes definitions
router.get('/', getProducts);
router.post('/', upload.single('image'), createProduct);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;