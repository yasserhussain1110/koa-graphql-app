const Router = require('koa-router');
const Employee = require('../models/employee/employee');

const router = Router({
  prefix: '/employees'
});

const sendEmployees = async ctx => {
  try {
    const employees = await Employee.find();
    ctx.body = employees;
  } catch (e) {
    ctx.status = 400;
  }
};

router.get('/', sendEmployees);

const sendOneEmployee = async ctx => {
  try {
    const employee = await Employee.findById(ctx.params._id);
    if (employee) {
      ctx.body = employee;
    } else {
      ctx.status = 404;
    }
  } catch (e) {
    ctx.status = 400;
  }
};

router.get('/:_id', sendOneEmployee);

const createEmployee = async ctx => {
  try {
    const employee = await new Employee(ctx.request.body).save();
    ctx.body = employee;
  } catch (e) {
    ctx.status = 400;
  }
};

router.post('/', createEmployee);

const updateEmployee = async ctx => {
  const employeeId = ctx.params._id;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      ctx.status = 404;
      return;
    }
    const updatedEmployee = await Object.assign(employee, ctx.request.body).save();
    ctx.body = updatedEmployee;
  } catch (e) {
    ctx.status = 400;
  }
};

router.patch('/:_id', updateEmployee);

const deleteEmployee = async ctx => {
  const employeeId = ctx.params._id;
  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      ctx.status = 404;
      return;
    }
    const removedEmployee = await employee.remove();
    ctx.body = removedEmployee;
    ctx.status = 200;
  } catch (e) {
    ctx.status = 400;
  }
};

router.delete('/:_id', deleteEmployee);

module.exports = router;
