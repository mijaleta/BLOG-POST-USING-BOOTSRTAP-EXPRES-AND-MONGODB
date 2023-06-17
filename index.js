
const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');

// Initialize Express
const app = express();
app.use(express.static('public'))
// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/mydatabase', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
















// Define Mongoose schema
const dataSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
});

const Data = mongoose.model('Data', dataSchema);

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname));
  }
});

// Initialize multer upload
const upload = multer({
  storage: storage
}).single('image');

// Set view engine to EJS
app.set('view engine', 'ejs');

// Middleware for parsing form data
app.use(express.urlencoded({ extended: false }));

// Routes
app.get('/', (req, res) => {
  res.render('upload');
});

app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render('error');
    } else {
      const newData = new Data({
        title: req.body.title,
        description: req.body.description,
        image: req.file.filename,
      });

      newData.save()
        .then(() => res.redirect('/data'))
        .catch(err => res.render('error'));
    }
  });
});

app.get('/data', (req, res) => {
  Data.find()
    .then(data => {
      res.render('data', { data });
    })
    .catch(err => res.render('error'));
});

// Start the server
const port = 4000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
