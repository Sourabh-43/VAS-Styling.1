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
    default: 0,
    min: 0
  },

  images: {
    type: [String],
    default: []
  },

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