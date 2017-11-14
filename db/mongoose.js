const mongoose = require('mongoose');

const mongoDbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koa-app';

mongoose.Promise = global.Promise;
mongoose.connect(mongoDbURI, {useMongoClient: true});

module.exports = mongoose;
