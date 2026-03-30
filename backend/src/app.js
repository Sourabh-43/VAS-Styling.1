const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

/* =======================
   DATABASE CONNECTION
======================= */

connectDB();

/* =======================
   CORS CONFIG
======================= */

app.use(cors({
  origin: [
    "https://vas-styling-1.onrender.com",
    "http://localhost:4200"
  ],
  credentials: true
}));

/* =======================
   MIDDLEWARES
======================= */

app.use(express.json());

/* =======================
   UPLOADS FOLDER (FINAL FIX)
======================= */

const uploadDir = path.join(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

/* =======================
   ROUTES
======================= */

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/products', require('./routes/product.routes'));
app.use('/api/admin', require('./routes/admin.routes'));

/* =======================
   ROOT
======================= */

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