const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const path = require('path');

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

/* =======================
   MIDDLEWARES
======================= */

// ✅ Enable CORS (VERY IMPORTANT)
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

app.use(express.json());

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

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});
