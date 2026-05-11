const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.get('/', async function(req, res){
  try{
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page -1) * limit;

    const search = req.query.search || '';
    const category = req.query.category || '';
    const minPrice = req.query.minPrice || '';
    const maxPrice = req.query.maxPrice || '';
    const sort = req.query.sort || 'name_asc';

    const filter = {};
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseInt(minPrice);
      if (maxPrice) filter.price.$lte = parseInt(maxPrice);
    }

    const sortMap = {
      name_asc: { name: 1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      rating_desc: { rating: -1 },
      stock_desc: { stock: -1 }
    };

    const sortOption = sortMap[sort] || sortMap.name_asc;

    const totalProducts = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await Product.find(filter)
      .select('name price category rating stock image')
      .sort(sortOption)
      .skip(skip)
      .limit(limit)
      .lean();
    const categories = await Product.distinct('category');

    res.render('products', {
      products, currentPage: page, totalPages, totalProducts,
      search, category, minPrice, maxPrice, categories, sort
    });

  }catch(err){
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;