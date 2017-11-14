const mongoose = require('mongoose');
const _ = require('lodash');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 100
  },
  salary: {
    type: Number,
    required: true
  },
  address: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 200
  },
  senior: {
    type: Boolean,
    required: true
  },
  workExperience: {
    type: Number,
    required: true
  }
});

EmployeeSchema.methods.toJSON = function () {
  const employee = this;
  return _.omit(employee.toObject(), ['__v']);
};

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;

module.exports.getListOfEmployees = () => {
  return Employee.find();
};

module.exports.getUserById = (root, {_id}) => {
  return Employee.findById({_id});
};

module.exports.addEmployee = (root, employeeInfo) => {
  const newUser = new Employee(employeeInfo);
  return newUser.save();
};

module.exports.updateEmployee = async (root, employeeInfo) => {
  const employee = await Employee.findById(employeeInfo._id);
  const employeeDoc = _.extend(employee, _.omit(employeeInfo, ['_id']));
  return employeeDoc.save();
};

module.exports.deleteEmployee = async (root, {_id}) => {
  const employee = await Employee.findById(_id);
  return employee.remove();
};
