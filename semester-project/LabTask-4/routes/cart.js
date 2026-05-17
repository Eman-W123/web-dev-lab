const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { isLoggedIn } = require('../middleware/auth');

// GET /cart - View cart
router.get('/', isLoggedIn, async function(req, res) {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    return res.render('cart', { cart: [], totalAmount: 0 });
  }

  const ids = cart.map(function(item) { return item.productId; });
  const products = await Product.find({ _id: { $in: ids } }).select('_id stock');
  const productMap = new Map(products.map(function(p) { return [String(p._id), p]; }));

  let adjusted = false;
  let removed = false;

  const nextCart = cart.filter(function(item) {
    const product = productMap.get(String(item.productId));
    if (!product || product.stock <= 0) {
      removed = true;
      return false;
    }

    if (item.quantity > product.stock) {
      item.quantity = product.stock;
      adjusted = true;
    }

    return item.quantity > 0;
  });

  if (removed || adjusted) {
    const parts = [];
    if (removed) parts.push('Some items were removed because they are out of stock');
    if (adjusted) parts.push('Some quantities were reduced to available stock');
    req.flash('error', parts.join('. '));
  }

  req.session.cart = nextCart;

  let totalAmount = 0;
  nextCart.forEach(function(item) {
    totalAmount += item.price * item.quantity;
  });

  res.render('cart', { cart: nextCart, totalAmount });
});

// GET /cart/count - Cart item count (for header badge)
router.get('/count', function(req, res) {
  const cart = req.session.cart || [];
  const count = cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
  res.json({ count: count });
});

// POST /cart/add - Add item to cart
router.post('/add', async function(req, res) {
  try {
    if (!req.session.user) {
      return res.status(401).json({ success: false, message: 'Please login to add items to cart' });
    }

    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ success: false, message: 'Product ID is required' });
    }

    const qty = parseInt(quantity, 10) || 1;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: 'Product is out of stock' });
    }

    if (!req.session.cart) req.session.cart = [];
    const id = String(productId);
    const existingItem = req.session.cart.find(function(i) { return String(i.productId) === id; });
    const currentQty = existingItem ? existingItem.quantity : 0;
    const requestedQty = currentQty + qty;
    if (requestedQty > product.stock) {
      return res.status(400).json({
        success: false,
        message: `Only ${product.stock} in stock`
      });
    }

    if (existingItem) existingItem.quantity = requestedQty;
    else {
      req.session.cart.push({
        productId: product._id.toString(),
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty
      });
    }

    const cartCount = req.session.cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
    res.json({ success: true, message: 'Product added to cart', cartCount: cartCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /cart/remove - Remove item
router.post('/remove', isLoggedIn, function(req, res) {
  const { productId } = req.body;
  const id = String(productId);
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(function(i) { return String(i.productId) !== id; });
  }
  res.redirect('/cart');
});

// POST /cart/update - Update quantity
router.post('/update', isLoggedIn, async function(req, res) {
  const { productId, quantity } = req.body;
  const qty = parseInt(quantity, 10);
  const id = String(productId);

  if (req.session.cart) {
    const item = req.session.cart.find(function(i) { return String(i.productId) === id; });
    if (item) {
      if (qty <= 0) {
        req.session.cart = req.session.cart.filter(function(i) { return String(i.productId) !== id; });
        return res.redirect('/cart');
      }

      const product = await Product.findById(productId);
      if (!product) {
        req.session.cart = req.session.cart.filter(function(i) { return String(i.productId) !== id; });
        req.flash('error', 'Product no longer exists');
        return res.redirect('/cart');
      }

      if (qty > product.stock) {
        item.quantity = product.stock;
        req.flash('error', `Only ${product.stock} in stock`);
        return res.redirect('/cart');
      }

      item.quantity = qty;
    }
  }
  res.redirect('/cart');
});

// POST /cart/clear - Clear cart
router.post('/clear', isLoggedIn, function(req, res) {
  req.session.cart = [];
  res.redirect('/cart');
});

module.exports = router;
