const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/* =======================
   MULTER CONFIG
======================= */

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg','image/png','image/webp'];
  if (allowedTypes.includes(file.mimetype)) cb(null,true);
  else cb(new Error('Only JPG, PNG, WEBP images allowed'),false);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

/* SUPPORT MULTIPLE IMAGES */

exports.upload = upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'hoverImage', maxCount: 1 }
]);

/* =======================
   GET ALL PRODUCTS
======================= */

exports.getProducts = async (req,res)=>{
  try{

    const { gender, category } = req.query;

    const filter = {};
    if(gender) filter.gender = gender;
    if(category) filter.category = category;

    const products = await Product.find(filter)
      .sort({ createdAt:-1 });

    res.json(products);

  }catch(error){
    console.error('Get products error:',error);
    res.status(500).json({ message:'Failed to fetch products' });
  }
};

/* =======================
   GET PRODUCT BY ID
======================= */

exports.getProductById = async (req,res)=>{
  try{

    const product = await Product.findById(req.params.id);

    if(!product){
      return res.status(404).json({ message:'Product not found' });
    }

    res.json(product);

  }catch(error){
    console.error(error);
    res.status(500).json({ message:'Failed to fetch product' });
  }
};

/* =======================
   CREATE PRODUCT
======================= */

exports.createProduct = async (req,res)=>{
  try{

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

    if(!name || price === undefined || !gender || !category){
      return res.status(400).json({
        message:'Name, price, gender and category are required'
      });
    }

    let generatedSlug = slug
      ? slug.toLowerCase()
      : name.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-');

    const existing = await Product.findOne({ slug:generatedSlug });
    if(existing) generatedSlug += '-' + Date.now();

    const parsedSizes = sizes
      ? Array.isArray(sizes)
        ? sizes
        : JSON.parse(sizes)
      : [];

    /* MAIN IMAGE */

    const imagePath = req.files?.image
      ? `/uploads/${req.files.image[0].filename}`
      : null;

    /* HOVER IMAGE */

    const hoverPath = req.files?.hoverImage
      ? `/uploads/${req.files.hoverImage[0].filename}`
      : null;

    const product = await Product.create({
      name,
      slug:generatedSlug,
      price,
      stock: stock || 0,
      gender,
      category,
      description,
      sizes: parsedSizes,
      image: imagePath,
      hoverImage: hoverPath
    });

    res.status(201).json(product);

  }catch(error){
    console.error('Create product error:',error);
    res.status(500).json({
      message:'Failed to create product',
      error:error.message
    });
  }
};

/* =======================
   UPDATE PRODUCT
======================= */

exports.updateProduct = async (req,res)=>{
  try{

    const product = await Product.findById(req.params.id);

    if(!product){
      return res.status(404).json({ message:'Product not found' });
    }

    let updateData = { ...req.body };

    if(updateData.sizes){
      updateData.sizes = Array.isArray(updateData.sizes)
        ? updateData.sizes
        : JSON.parse(updateData.sizes);
    }

    /* UPDATE MAIN IMAGE */

    if(req.files?.image){

      if(product.image){
        const oldPath = path.join(__dirname,'..','..',product.image);
        if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updateData.image = `/uploads/${req.files.image[0].filename}`;
    }

    /* UPDATE HOVER IMAGE */

    if(req.files?.hoverImage){

      if(product.hoverImage){
        const oldPath = path.join(__dirname,'..','..',product.hoverImage);
        if(fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      updateData.hoverImage = `/uploads/${req.files.hoverImage[0].filename}`;
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new:true, runValidators:true }
    );

    res.json(updated);

  }catch(error){
    console.error('Update product error:',error);
    res.status(500).json({ message:'Failed to update product' });
  }
};

/* =======================
   DELETE PRODUCT
======================= */

exports.deleteProduct = async (req,res)=>{
  try{

    const product = await Product.findById(req.params.id);

    if(!product){
      return res.status(404).json({ message:'Product not found' });
    }

    if(product.image){
      const imagePath = path.join(__dirname,'..','..',product.image);
      if(fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    if(product.hoverImage){
      const hoverPath = path.join(__dirname,'..','..',product.hoverImage);
      if(fs.existsSync(hoverPath)) fs.unlinkSync(hoverPath);
    }

    await product.deleteOne();

    res.json({ message:'Product deleted successfully' });

  }catch(error){
    console.error('Delete product error:',error);
    res.status(500).json({ message:'Failed to delete product' });
  }
};