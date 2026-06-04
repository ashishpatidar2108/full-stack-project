
require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const Task = require('./models/task');


// Use the PORT

const PORT = process.env.PORT || 5000;


(async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todo_app';
    const hasMongoEnv = process.env.MONGO_URI || process.env.MONGODB_URI;
    console.log('Using MongoDB URI:', hasMongoEnv ? '[env]' : '[fallback to localhost]');
    if (!hasMongoEnv) console.warn('MONGO_URI not set, falling back to local MongoDB at mongodb://127.0.0.1:27017');
    await connectDB(mongoUri);
    await Task.syncIndexes();
    app.listen(PORT, () => console.log(`Server running on :${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
})();
