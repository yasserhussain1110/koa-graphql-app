const mongoose = require('mongoose');
const mongoDbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/koa-app-test';
const path = require('path');

const getFileName = parentFilePath => path.basename(parentFilePath).split('.test.js')[0];

module.exports = parentFilePath => {
  const dbURL = mongoDbURI + '-' + getFileName(parentFilePath);
  mongoose.connect(dbURL, {useMongoClient: true});
};

