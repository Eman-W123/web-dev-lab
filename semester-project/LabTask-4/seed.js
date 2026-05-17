require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rivajDB')
  .then(()=> console.log('Connected to MongoDB for seeding'))
  .catch(err=> console.error('Seed DB connection error', err));

const products = [
  {
    "name": "SPF 60 Bright Sunblock",
    "price": 257,
    "category": "Skincare",
    "rating": 4.5,
    "stock": 50,
    "image": "/uploads/1778995759096.png"
  },
  {
    "name": "SPF 90 Sunblock",
    "price": 257,
    "category": "Skincare",
    "rating": 4.3,
    "stock": 40,
    "image": "/uploads/1778995786118.png"
  },
  {
    "name": "SPF 50 Kids Sunblock",
    "price": 270,
    "category": "Skincare",
    "rating": 4.7,
    "stock": 30,
    "image": "/uploads/1778995804737.png"
  },
  {
    "name": "Rose Water 100ml",
    "price": 170,
    "category": "Skincare",
    "rating": 4.2,
    "stock": 60,
    "image": "/uploads/1778995820010.png"
  },
  {
    "name": "Pink Bright Face Wash",
    "price": 214,
    "category": "Skincare",
    "rating": 4.4,
    "stock": 45,
    "image": "/uploads/1778995841674.png"
  },
  {
    "name": "Eyeshadow brush 06",
    "price": 329,
    "category": "Makeup",
    "rating": 4.1,
    "stock": 35,
    "image": "/images/face/anti-sebum-sunblock.png"
  },
  {
    "name": "Eyeshadow brush 05",
    "price": 436,
    "category": "Makeup",
    "rating": 4.6,
    "stock": 25,
    "image": "/images/face/cleansing-milk-150ml.png"
  },
  {
    "name": "Glow Face Serum 30ml",
    "price": 595,
    "category": "Serums",
    "rating": 4.8,
    "stock": 20,
    "image": "/images/serums/glow-face-serum-30ml.png"
  },
  {
    "name": "Vitamin C Serum 30ml",
    "price": 595,
    "category": "Serums",
    "rating": 4.7,
    "stock": 22,
    "image": "/images/serums/vitamin-c-serum-30ml.png"
  },
  {
    "name": "Acne Care Face Serum",
    "price": 595,
    "category": "Serums",
    "rating": 4.5,
    "stock": 18,
    "image": "/images/serums/acne-care-face-serum.png"
  },
  {
    "name": "Whitening Face Serum 30ml",
    "price": 595,
    "category": "Serums",
    "rating": 4.6,
    "stock": 15,
    "image": "/images/serums/whitening-face-serum-30ml.png"
  },
  {
    "name": "Vitamin C Brightening Serum",
    "price": 650,
    "category": "Serums",
    "rating": 4.9,
    "stock": 12,
    "image": "/images/serums/vitamin-c-brightening-serum.png"
  },
  {
    "name": "Retinol Renewal Serum",
    "price": 725,
    "category": "Serums",
    "rating": 4.4,
    "stock": 10,
    "image": "/images/serums/retinol-renewal-serum.png"
  },
  {
    "name": "Niacinamide Pore Serum",
    "price": 680,
    "category": "Serums",
    "rating": 4.3,
    "stock": 14,
    "image": "/images/serums/niacinamide-pore-serum.png"
  },
  {
    "name": "Rivaj Matte Lipstick",
    "price": 257,
    "category": "Makeup",
    "rating": 4.5,
    "stock": 55,
    "image": "/images/lips/rivaj-matte-lipstick.png"
  },
  {
    "name": "Water proof long lasting mascara",
    "price": 595,
    "category": "Makeup",
    "rating": 4.2,
    "stock": 30,
    "image": "/uploads/1778996100081.png"
  },
  {
    "name": "Rivaj Cleansing Milk",
    "price": 257,
    "category": "Skincare",
    "rating": 4.6,
    "stock": 28,
    "image": "/uploads/1778995944305.png"
  },
  {
    "name": "Dazzling Shimmer Eye Shadow",
    "price": 170,
    "category": "Makeup",
    "rating": 4.3,
    "stock": 40,
    "image": "/images/eyes/dazzling-shimmer-eye-shadow.png"
  },
  {
    "name": "Velvet Matte Lipstick",
    "price": 650,
    "category": "Makeup",
    "rating": 4.7,
    "stock": 35,
    "image": "/images/lips/velvet-matte-lipstick.png"
  },
  {
    "name": "Liquid Lip Color",
    "price": 720,
    "category": "Makeup",
    "rating": 4.8,
    "stock": 20,
    "image": "/images/lips/liquid-lip-color.png"
  },
  {
    "name": "Bold glitter Lipstick",
    "price": 450,
    "category": "Makeup",
    "rating": 4.5,
    "stock": 40,
    "image": "/images/items/evernoya-shampoo-200ml.png"
  },
  {
    "name": "Mineral TV Foundation",
    "price": 650,
    "category": "Makeup",
    "rating": 4.4,
    "stock": 25,
    "image": "/images/items/hair-growth-serum.png"
  },
  {
    "name": "Matte Face Powder",
    "price": 550,
    "category": "Makeup",
    "rating": 4.6,
    "stock": 30,
    "image": "/images/items/hair-mask-treatment.png"
  },
  {
    "name": "Cotton pads",
    "price": 456,
    "category": "Personal Care",
    "rating": 4.2,
    "stock": 50,
    "image": "/images/body/charcoal-face-wax-strips.png"
  },
  {
    "name": "Beads Wax Natural 150g",
    "price": 546,
    "category": "Personal Care",
    "rating": 4.3,
    "stock": 35,
    "image": "/images/body/beads-wax-natural-150g.png"
  },
  {
    "name": "Eyes and Lip Makeup Remover",
    "price": 336.95,
    "category": "Skincare",
    "rating": 3.1,
    "stock": 50,
    "image": "/uploads/1778996889546.png"
  },
  {
    "name": "Lip Liner",
    "price": 200,
    "category": "Makeup",
    "rating": 4.5,
    "stock": 0,
    "image": "/uploads/1778996961291.png"
  }
];

async function seedDatabase(){
  const existingCount = await Product.countDocuments();
  if (existingCount > 0) {
    console.log(`Seed skipped: ${existingCount} products already exist.`);
    await mongoose.connection.close();
    return;
  }
  await Product.insertMany(products);
  console.log('Products inserted');
  await mongoose.connection.close();
}

seedDatabase();