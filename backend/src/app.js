const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');

dotenv.config();

const app = express();

/* =======================
   DATABASE CONNECTION
======================= */
connectDB();

/* =======================
   CORS CONFIG (FINAL FIX)
======================= */

app.use(cors({
  origin: 'https://vas-styling-1.onrender.com',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

/* =======================
   MIDDLEWARES
======================= */

app.use(express.json());

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* =======================
   ROUTES
======================= */

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

app.get('/', (req, res) => {
  res.send('VASmart Backend API running');
});

/* =======================
   SERVER
======================= */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});