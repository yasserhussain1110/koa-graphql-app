const server = require('../server');
require('./setUpDB')(__filename);
const request = require('supertest');
const Admin = require('../models/admin/admin');
const mongoose = require('mongoose');
const _ = require('lodash');
const Employee = require('../models/employee/employee');
const {EMPLOYEES, ADMINS} = require('../seed/seedInfo');

beforeAll(async () => {
  await Admin.remove();
  const admin = new Admin(ADMINS[0]);
  await admin.save();
  await Employee.remove();
});

beforeEach(async () => {
  try {
    await Employee.insertMany(EMPLOYEES);
  } catch (e) {
    console.log(e);
    throw e;
  }
});

afterEach(async () => {
  try {
    await Employee.remove();
  } catch (e) {
    console.log(e);
    throw e;
  }
});

afterAll(async () => {
  await Admin.remove();
  await Employee.remove();
  server.close();
  mongoose.connection.close();
});

describe('GET /employees', () => {
  test('should get all employees', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response = await request(server).get('/employees').set('x-auth', ADMIN_TOKEN);
    expect(response.status).toBe(200);
    expect(response.body.map(r => _.omit(r, ['_id']))).toEqual(EMPLOYEES.map(e => _.omit(e, ['_id'])));
    expect(EMPLOYEES[0]._id).toBe(response.body[0]._id);
  });
});

describe('GET /employees/:_id', () => {
  test('should get a particular employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response = await request(server).get(`/employees/${EMPLOYEES[0]._id}`).set('x-auth', ADMIN_TOKEN);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EMPLOYEES[0]);
  });

  test('should get 404 for non-existent employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const nonExistentID = '5a0ac5f420a8da291b551e4b';
    const response = await request(server).get(`/employees/${nonExistentID}`).set('x-auth', ADMIN_TOKEN);
    expect(response.status).toBe(404);
  });
});

describe('POST /employees', () => {
  test('should be able to create a new employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const newEmployee = {
      name: 'Emanuel Borzanov',
      salary: 40000,
      address: 'St. Petersburg, Russia',
      senior: false,
      workExperience: 1
    };
    const response = await request(server).post('/employees').set('x-auth', ADMIN_TOKEN).send(newEmployee);
    expect(response.status).toBe(200);
    expect(_.omit(response.body, ['_id'])).toEqual(newEmployee);
    const employees = await Employee.find();
    expect(employees.length).toBe(3);
  });

  test('employee validation must fail if any field is absent', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const newEmployee = {
      name: 'Emanuel Borzanov',
      salary: 40000,
      address: 'St. Petersburg, Russia',
      senior: false
    };
    const response = await request(server).post('/employees').set('x-auth', ADMIN_TOKEN).send(newEmployee);
    expect(response.status).toBe(400);
  });
});

describe('PATCH /employees/:_id', () => {
  test('should be able to update salary field of employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const updatedFields = {
      salary: 200000
    };
    const response =
      await request(server)
        .patch(`/employees/${EMPLOYEES[0]._id}`)
        .set('x-auth', ADMIN_TOKEN)
        .send(updatedFields);
    expect(response.status).toBe(200);
    expect(response.body.salary).toBe(updatedFields.salary);
  });

  test('will get 404 while attempting to update non-existent employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const newEmployee = {
      name: 'Emanuel Borzanov',
      salary: 40000,
      address: 'St. Petersburg, Russia',
      senior: false,
      workExperience: 23
    };
    const response =
      await request(server)
        .patch('/employees/5a0ac5f420a8da291b551e4b')
        .set('x-auth', ADMIN_TOKEN)
        .send(newEmployee);
    expect(response.status).toBe(404);
  });
});

describe('DELETE /employees/:_id', () => {
  test('should be able to remove employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response =
      await request(server)
        .delete(`/employees/${EMPLOYEES[0]._id}`)
        .set('x-auth', ADMIN_TOKEN);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(EMPLOYEES[0]);
    const employees = await Employee.find();
    expect(employees.length).toBe(EMPLOYEES.length - 1);
  });

  test('will get 404 while removing employee which does not exist', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response =
      await request(server)
        .delete('/employees/5a0ac5f420a8da291b551e4b')
        .set('x-auth', ADMIN_TOKEN);
    expect(response.status).toBe(404);
    const employees = await Employee.find();
    expect(employees.length).toBe(EMPLOYEES.length);
  });
});
