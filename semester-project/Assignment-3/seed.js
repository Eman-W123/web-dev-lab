const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rivajDB')
  .then(()=> console.log('Connected to MongoDB for seeding'))
  .catch(err=> console.error('Seed DB connection error', err));

const products = [
  { name: 'SPF 60 Bright Sunblock', price: 257, category: 'Skincare', rating: 4.5, stock: 50, image: '/images/face/image.png' },
  { name: 'SPF 90 Sunblock', price: 257, category: 'Skincare', rating: 4.3, stock: 40, image: '/images/face/image%20copy.png' },
  { name: 'SPF 50 Kids Sunblock', price: 270, category: 'Skincare', rating: 4.7, stock: 30, image: '/images/face/image%20copy%202.png' },
  { name: 'Rose Water 100ml', price: 170, category: 'Skincare', rating: 4.2, stock: 60, image: '/images/face/image%20copy%203.png' },
  { name: 'Pink Bright Face Wash', price: 214, category: 'Skincare', rating: 4.4, stock: 45, image: '/images/face/image%20copy%204.png' },
  { name: 'Anti-Sebum Sunblock', price: 329, category: 'Skincare', rating: 4.1, stock: 35, image: '/images/face/image%20copy%205.png' },
  { name: 'Cleansing Milk 150ml', price: 436, category: 'Skincare', rating: 4.6, stock: 25, image: '/images/face/image.png' },

  { name: 'Glow Face Serum 30ml', price: 595, category: 'Serums', rating: 4.8, stock: 20, image: '/images/serums/image.png' },
  { name: 'Vitamin C Serum 30ml', price: 595, category: 'Serums', rating: 4.7, stock: 22, image: '/images/serums/image%20copy.png' },
  { name: 'Acne Care Face Serum', price: 595, category: 'Serums', rating: 4.5, stock: 18, image: '/images/serums/image%20copy%202.png' },
  { name: 'Whitening Face Serum 30ml', price: 595, category: 'Serums', rating: 4.6, stock: 15, image: '/images/serums/image%20copy%203.png' },
  { name: 'Vitamin C Brightening Serum', price: 650, category: 'Serums', rating: 4.9, stock: 12, image: '/images/serums/image%20copy%204.png' },
  { name: 'Retinol Renewal Serum', price: 725, category: 'Serums', rating: 4.4, stock: 10, image: '/images/serums/image%20copy%205.png' },
  { name: 'Niacinamide Pore Serum', price: 680, category: 'Serums', rating: 4.3, stock: 14, image: '/images/serums/image.png' },

  { name: 'Rivaj Matte Lipstick', price: 257, category: 'Makeup', rating: 4.5, stock: 55, image: '/images/lips/image.png' },
  { name: 'Mineral Foundation TV Stick', price: 595, category: 'Makeup', rating: 4.2, stock: 30, image: '/images/face/image%20copy%202.png' },
  { name: 'Fantasy Two Way Cake Foundation', price: 257, category: 'Makeup', rating: 4.6, stock: 28, image: '/images/face/image%20copy%203.png' },
  { name: 'Dazzling Shimmer Eye Shadow', price: 170, category: 'Makeup', rating: 4.3, stock: 40, image: '/images/eyes/image.png' },
  { name: 'Velvet Matte Lipstick', price: 650, category: 'Makeup', rating: 4.7, stock: 35, image: '/images/lips/image%20copy.png' },
  { name: 'Liquid Lip Color', price: 720, category: 'Makeup', rating: 4.8, stock: 20, image: '/images/lips/image%20copy%202.png' },

  { name: 'Evernoya Shampoo 200ml', price: 450, category: 'Hair Care', rating: 4.5, stock: 40, image: '/images/items/image.png' },
  { name: 'Hair Growth Serum', price: 650, category: 'Hair Care', rating: 4.4, stock: 25, image: '/images/items/image%20copy.png' },
  { name: 'Hair Mask Treatment', price: 550, category: 'Hair Care', rating: 4.6, stock: 30, image: '/images/items/image%20copy%202.png' },

  { name: 'Charcoal Face Wax Strips', price: 456, category: 'Personal Care', rating: 4.2, stock: 50, image: '/images/body/image.png' },
  { name: 'Beads Wax Natural 150g', price: 546, category: 'Personal Care', rating: 4.3, stock: 35, image: '/images/body/image%20copy.png' }
];

async function seedDatabase(){
  await Product.deleteMany({});
  console.log('Existing products deleted');
  await Product.insertMany(products);
  console.log('Products inserted');
  mongoose.connection.close();
}

seedDatabase();