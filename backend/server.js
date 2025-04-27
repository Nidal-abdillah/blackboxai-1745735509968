const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Storage setup for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// In-memory CV storage
let cvs = [];
let idCounter = 1;

// Routes

// POST /api/cvs - submit CV data and upload file
app.post('/api/cvs', upload.single('cvFile'), (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone || !req.file) {
    return res.status(400).json({ error: 'Name, email, phone and CV file are required.' });
  }
  const cvEntry = {
    id: idCounter++,
    name,
    email,
    phone,
    cvFileName: req.file.filename,
    originalFileName: req.file.originalname,
    uploadDate: new Date()
  };
  cvs.push(cvEntry);
  res.status(201).json(cvEntry);
});

// GET /api/cvs - list all CVs
app.get('/api/cvs', (req, res) => {
  res.json(cvs);
});

// GET /api/cvs/:id - get CV detail
app.get('/api/cvs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const cv = cvs.find(c => c.id === id);
  if (!cv) {
    return res.status(404).json({ error: 'CV not found' });
  }
  res.json(cv);
});

// DELETE /api/cvs/:id - delete CV
app.delete('/api/cvs/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const index = cvs.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'CV not found' });
  }
  // Delete file from uploads folder
  const cv = cvs[index];
  const filePath = path.join(__dirname, 'uploads', cv.cvFileName);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
  cvs.splice(index, 1);
  res.json({ message: 'CV deleted successfully' });
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
  console.log(`CV Management backend running on port ${PORT}`);
});
