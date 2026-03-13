const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  stock: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },

  /* MAIN PRODUCT IMAGE */
  image: {
    type: String,
    required: true
  },

  /* OPTIONAL HOVER IMAGE */
  hoverImage: {
    type: String,
    default: null
  },

  gender: {
    type: String,
    enum: ['men', 'women'],
    required: true
  },

  category: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    default: ''
  },

  sizes: [
    {
      type: String
    }
  ]

},
{
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);