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
   CORS CONFIG (FINAL)
======================= */

app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization']
}));

// 🔥 Important for file upload requests
app.options('*', cors());


/* =======================
   MIDDLEWARES
======================= */

app.use(express.json());

/* =======================
   UPLOADS FOLDER
======================= */

// Ensure uploads folder exists (important for Render)
const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Serve uploaded images
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