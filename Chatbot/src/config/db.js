const mongoose = require('mongoose');
const logger = require('heroku-logger');

const DB_URL = process.env.MONGODB_URL || "MONGO_DB_URL";

// exports database connection
mongoose.connect(DB_URL, { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false, retryWrites:false })
    .then(() => logger.info('MongoDB connected'))
    .catch(err => logger.error('Could not connect to MongoDB...'));

module.exports= mongoose;