const mongoose = require('mongoose');
const dns = require('dns');

async function connectDB(uri) {
  mongoose.set('strictQuery', true);
  const usedUri = uri || 'mongodb://127.0.0.1:27017/todo_app';
  if (!uri) console.warn('connectDB: no uri provided, using fallback localhost MongoDB');

  if (typeof usedUri === 'string' && usedUri.startsWith('mongodb+srv://')) {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  }

  try {
    await mongoose.connect(usedUri, { dbName: 'todo_app' });
    console.log('MongoDB connected');
  } catch (e) {
    console.warn('Could not connect to MongoDB, continuing without DB:', e.message);
  }
}

module.exports = connectDB;
