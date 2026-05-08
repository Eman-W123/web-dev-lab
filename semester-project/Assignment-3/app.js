const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rivajDB')
  .then(()=> console.log('Connected to MongoDB'))
  .catch(err=> console.log('MongoDB connection error:', err));

// view engine
app.set('view engine','ejs');
app.set('views', path.join(__dirname,'views'));

// static
app.use(express.static(path.join(__dirname,'public')));
// allow /images/* to resolve from project root images folder
app.use('/images', express.static(path.join(__dirname,'images')));
app.use(express.urlencoded({ extended: true }));

// routes
const productRoutes = require('./routes/products');
app.use('/products', productRoutes);

app.get('/', (req,res)=> res.render('index'));

app.listen(PORT, ()=> console.log(`Assignment-3 running at http://localhost:${PORT}`));