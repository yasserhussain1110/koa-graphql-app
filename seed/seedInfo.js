const mongoose = require('mongoose');
const Employee = require('../models/employee/employee');
const Admin = require('../models/admin/admin');
const jwt = require('jsonwebtoken');

const {JWT_SECRET_KEY} = process.env;

const EMPLOYEES = [{
  _id: mongoose.Types.ObjectId().toString(),
  name: 'John Doe',
  salary: 100000,
  address: 'Bangalore, India',
  senior: true,
  workExperience: 10
}, {
  name: 'Samuel Johnson',
  salary: 60000,
  address: 'Paris, France',
  senior: false,
  workExperience: 2
}];

const insertEmployeesInDB = async () => {
  await Employee.remove({});
  Employee.insertMany(EMPLOYEES);
};

const SYS_ADMIN_ID = mongoose.Types.ObjectId().toString();
const ADMINS = [{
  _id: SYS_ADMIN_ID,
  username: 'Sys Admin',
  password: 'somepassword',
  tokens: [{
    token: jwt.sign({_id: SYS_ADMIN_ID}, JWT_SECRET_KEY)
  }]
}];

const insertAdminsInDB = async () => {
  await Admin.remove();
  await Promise.all(
    ADMINS.map(admin => new Admin(admin).save())
  );
};

module.exports = {
  EMPLOYEES,
  ADMINS,
  insertEmployeesInDB,
  insertAdminsInDB
};
