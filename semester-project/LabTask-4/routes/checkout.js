const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { isLoggedIn } = require('../middleware/auth');

function getCartTotal(cart) {
  let total = 0;
  cart.forEach(function(item) {
    total += item.price * item.quantity;
  });
  return total;
}

// GET /checkout
router.get('/', isLoggedIn, function(req, res) {
  const cart = req.session.cart || [];
  if (cart.length === 0) {
    req.flash('error', 'Your cart is empty');
    return res.redirect('/cart');
  }
  res.render('checkout', { cart: cart, totalAmount: getCartTotal(cart) });
});

function handlePlaceOrder(req, res) {
  return (async function() {
  try {
    const cart = req.session.cart || [];
    if (cart.length === 0) {
      req.flash('error', 'Your cart is empty');
      return res.redirect('/cart');
    }

    const { street, city, postalCode, phone } = req.body;
    if (!street || !city || !postalCode || !phone) {
      req.flash('error', 'All shipping fields are required');
      return res.redirect('/checkout');
    }

    const decremented = [];
    for (const item of cart) {
      const qty = parseInt(item.quantity, 10);
      if (!Number.isFinite(qty) || qty <= 0) {
        continue;
      }

      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: qty } },
        { $inc: { stock: -qty } },
        { new: true }
      );

      if (!updated) {
        await Promise.all(decremented.map(function(entry) {
          return Product.findByIdAndUpdate(entry.productId, { $inc: { stock: entry.qty } });
        }));

        req.flash('error', `Not enough stock for ${item.name}`);
        return res.redirect('/cart');
      }

      decremented.push({ productId: item.productId, qty: qty });
    }

    const products = cart.map(function(item) {
      return {
        product: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      };
    });

    const order = new Order({
      user: req.session.user._id,
      products: products,
      totalAmount: getCartTotal(cart),
      shippingAddress: { street: street, city: city, postalCode: postalCode, phone: phone }
    });

    await order.save();
    req.session.cart = [];
    req.flash('success', 'Order placed successfully!');
    res.redirect('/order-success');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Could not place order. Please try again.');
    res.redirect('/checkout');
  }
  })();
}

// POST /checkout - Place order
router.post('/', isLoggedIn, handlePlaceOrder);

// Backwards-compatible route for older forms
router.post('/place-order', isLoggedIn, handlePlaceOrder);

module.exports = router;
