const Product = require('../models/Product');

// Get All Products (With Category Filter)
exports.getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        let filter = {};
        if (category && category !== 'all') {
            filter.category = category;
        }
        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: products.length, products });
    } catch (error) {
        console.error("Get Products Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Add New Product (Admin)
exports.createProduct = async (req, res) => {
    try {
        let imageUrl = "";
        if (req.file && req.file.path) {
            imageUrl = req.file.path;
        } else if (req.body.imageUrl) {
            imageUrl = req.body.imageUrl;
        }

        const productData = {
            name: req.body.name,
            category: req.body.category,
            price: Number(req.body.price),
            mrp: req.body.mrp ? Number(req.body.mrp) : undefined,
            description: req.body.description,
            imageUrl: imageUrl,
            metalType: req.body.metalType || '22K Yellow Gold',
            karatage: req.body.karatage || '22K',
            stock: req.body.stock ? Number(req.body.stock) : 10
        };

        const newProduct = new Product(productData);
        const savedProduct = await newProduct.save();

        res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
        console.error("Create Product Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Update Product (Admin)
exports.updateProduct = async (req, res) => {
    try {
        let updateData = {
            name: req.body.name,
            category: req.body.category,
            price: Number(req.body.price),
            mrp: req.body.mrp ? Number(req.body.mrp) : undefined,
            description: req.body.description,
            metalType: req.body.metalType,
            karatage: req.body.karatage,
            stock: req.body.stock ? Number(req.body.stock) : undefined
        };

        if (req.file && req.file.path) {
            updateData.imageUrl = req.file.path;
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, product: updatedProduct });
    } catch (error) {
        console.error("Update Product Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Delete Product (Admin)
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "Product removed from catalog" });
    } catch (error) {
        console.error("Delete Product Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};