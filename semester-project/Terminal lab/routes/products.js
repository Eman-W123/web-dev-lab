const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseOptionalNumber(value) {
  if (value === undefined || value === null) return NaN;
  if (typeof value === 'string' && value.trim() === '') return NaN;
  const num = Number(value);
  return Number.isFinite(num) ? num : NaN;
}

router.get('/', async function(req, res){
  try{
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = 8;
    const skip = (page -1) * limit;

    const search = typeof req.query.search === 'string' ? req.query.search.trim() : '';
    const category = typeof req.query.category === 'string' ? req.query.category : '';
    const minPrice = parseOptionalNumber(req.query.minPrice);
    const maxPrice = parseOptionalNumber(req.query.maxPrice);
    const sort = typeof req.query.sort === 'string' ? req.query.sort : 'name_asc';

    const filter = {};
    if (search) filter.name = { $regex: escapeRegex(search), $options: 'i' };
    if (category) filter.category = category;
    const priceFilter = {};
    if (Number.isFinite(minPrice)) priceFilter.$gte = minPrice;
    if (Number.isFinite(maxPrice)) priceFilter.$lte = maxPrice;
    if (Object.keys(priceFilter).length) filter.price = priceFilter;

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
      layout: false,
      products, currentPage: page, totalPages, totalProducts,
      search,
      category,
      minPrice: Number.isFinite(minPrice) ? minPrice : '',
      maxPrice: Number.isFinite(maxPrice) ? maxPrice : '',
      categories,
      sort
    }, function(renderErr, html) {
      if (renderErr) {
        console.error('Products render error:', renderErr);
        const message = (process.env.NODE_ENV === 'production')
          ? 'Server error'
          : (renderErr && renderErr.message ? renderErr.message : 'Server error');
        return res.status(500).send(message);
      }
      return res.send(html);
    });

  }catch(err){
    console.error('Products route error:', err);
    const message = (process.env.NODE_ENV === 'production')
      ? 'Server error'
      : (err && err.message ? err.message : 'Server error');
    res.status(500).send(message);
  }
});

module.exports = router;