const mongoose = require('mongoose');
const _ = require('lodash');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {JWT_SECRET_KEY} = process.env;

const AdminSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 5
  },

  password: {
    type: String,
    required: true,
    minlength: 6
  },

  tokens: [{
    token: {
      type: String,
      required: true
    }
  }]
});

AdminSchema.pre('save', async function (next) {
  const admin = this;
  if (admin.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
  next();
});

AdminSchema.methods.generateAuthToken = async function () {
  const admin = this;
  const tokenString = jwt.sign({_id: admin._id.toHexString()}, JWT_SECRET_KEY);
  admin.tokens.push(tokenString);

  await admin.save();
  return tokenString;
};

AdminSchema.statics.findByToken = function (tokenString) {
  const Admin = this;
  let decoded;

  try {
    decoded = jwt.verify(tokenString, JWT_SECRET_KEY);
  } catch (e) {
    return null;
  }

  const {_id} = decoded;

  return Admin.findOne({
    _id,
    'tokens.token': tokenString
  });
};
AdminSchema.methods.toJSON = function () {
  const admin = this;
  return _.omit(admin.toObject(), ['__v']);
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
