const env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (env === 'development') {
  require('dotenv').config();
} else if(env === 'test') {
  require('dotenv').config({path: '.env.test'});
} else if (env === 'production') {
  require('dotenv').config({path: '.env.prod'});
}
