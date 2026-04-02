const Product = require('../models/Product');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

/* =======================
   CLOUDINARY CONFIG
======================= */

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vasmart-products',
    allowed_formats: ['jpg', 'png', 'webp'],
    transformation: [{ width: 1200, crop: 'limit' }]
  }
});

const upload = multer({ storage });

exports.upload = upload.fields([
  { name: 'images', maxCount: 3 },
  { name: 'hoverImage', maxCount: 1 }
]);

/* =======================
   GET ALL PRODUCTS
======================= */

exports.getProducts = async (req, res) => {
  try {

    const { gender, category } = req.query;

    const filter = {};

    if (gender) filter.gender = gender;
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch products'
    });

  }
};

/* =======================
   SEARCH PRODUCTS
======================= */

exports.searchProducts = async (req, res) => {

  try {

    const { q, gender, category } = req.query;

    if (!q || q.trim().length < 2) {
      return res.json([]);
    }

    const filter = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { category: { $regex: q, $options: 'i' } },
        { gender: { $regex: q, $options: 'i' } }
      ]
    };

    if (gender) filter.gender = gender;
    if (category) filter.category = category;

    const products = await Product.find(filter)
      .limit(5)
      .sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Search failed'
    });

  }

};

/* =======================
   GET PRODUCT BY ID
======================= */

exports.getProductById = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    res.json(product);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Failed to fetch product'
    });

  }

};

/* =======================
   CREATE PRODUCT
======================= */

exports.createProduct = async (req, res) => {

  try {

    let {
      name,
      slug,
      price,
      stock,
      gender,
      category,
      description,
      sizes
    } = req.body;

    if (!name || price === undefined || !gender || !category) {
      return res.status(400).json({
        message: 'Name, price, gender and category are required'
      });
    }

    let generatedSlug = slug
      ? slug.toLowerCase()
      : name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-');

    const existing = await Product.findOne({
      slug: generatedSlug
    });

    if (existing) generatedSlug += '-' + Date.now();

    const parsedSizes = sizes
      ? Array.isArray(sizes)
        ? sizes
        : JSON.parse(sizes)
      : [];

    const images = req.files?.images
      ? req.files.images.map(file => file.path)
      : [];

    const hoverImage = req.files?.hoverImage
      ? req.files.hoverImage[0].path
      : null;

    if (images.length === 0) {
      return res.status(400).json({
        message: 'At least one product image required'
      });
    }

    const product = await Product.create({
      name,
      slug: generatedSlug,
      price,
      stock: stock || 0,
      gender,
      category,
      description,
      sizes: parsedSizes,
      images,
      hoverImage
    });

    res.status(201).json(product);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Failed to create product'
    });

  }

};

/* =======================
   UPDATE PRODUCT
======================= */

exports.updateProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    let updateData = { ...req.body };

    if (updateData.sizes) {
      updateData.sizes = Array.isArray(updateData.sizes)
        ? updateData.sizes
        : JSON.parse(updateData.sizes);
    }

    if (req.files?.images) {
      updateData.images =
        req.files.images.map(file => file.path);
    }

    if (req.files?.hoverImage) {
      updateData.hoverImage =
        req.files.hoverImage[0].path;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updated);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Failed to update product'
    });

  }

};

/* =======================
   DELETE PRODUCT
======================= */

exports.deleteProduct = async (req, res) => {

  try {

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Product not found'
      });
    }

    await product.deleteOne();

    res.json({
      message: 'Product deleted successfully'
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: 'Failed to delete product'
    });

  }

};