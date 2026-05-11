const mongoose = require('mongoose');
const User = require('../models/User');

async function run(){
  await mongoose.connect('mongodb://127.0.0.1:27017/rivajDB');
  console.log('Connected');
  const exists = await User.findOne({ email: 'admin@local' });
  if (exists) {
    console.log('Admin already exists');
    process.exit(0);
  }
  const user = new User({ name: 'Admin', email: 'admin@local', password: 'admin123', role: 'admin' });
  await user.save();
  console.log('Admin created');
  mongoose.connection.close();
}
run().catch(err=>{console.error(err); process.exit(1);});