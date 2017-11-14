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

describe('GraphQL Queries', () => {
  test('fetch all employees', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response =
      await request(server)
        .post('/graphql')
        .set('x-auth', ADMIN_TOKEN)
        .send({
          query: `{employees {name, address}}`
        });
    expect(response.status).toBe(200);
    expect(response.body.data.employees).toBeDefined();
    expect(response.body.data.employees.length).toBe(EMPLOYEES.length);
    EMPLOYEES.forEach((emp, i) => {
      expect(emp).toMatchObject(response.body.data.employees[i]);
    });
  });

  test('fetch an employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response =
      await request(server)
        .post('/graphql')
        .set('x-auth', ADMIN_TOKEN)
        .send({
          query: `{employee (_id: "${EMPLOYEES[0]._id}") {name}}`
        });
    expect(response.status).toBe(200);
    expect(response.body.data.employee).toBeDefined();
    expect(EMPLOYEES[0]).toMatchObject(response.body.data.employee);
  });
});


describe('GraphQL Mutation', () => {
  test('create a new employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response =
      await request(server)
        .post('/graphql')
        .set('x-auth', ADMIN_TOKEN)
        .send({
          query: `mutation {
            addEmployee(
              name: "Sergey Boyanovitch",
              salary: 200000,
              address: "Kiev, Ukraine",
              senior: true,
              workExperience: 23
            )
            {
              _id
            }
          }`
        });
    expect(response.status).toBe(200);
    expect(response.body.data.addEmployee).toBeDefined();
    expect(response.body.data.addEmployee._id).toBeDefined();
    const employees = await Employee.find();
    expect(employees.length).toBe(EMPLOYEES.length + 1);
  });

  test('update an employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response =
      await request(server)
        .post('/graphql')
        .set('x-auth', ADMIN_TOKEN)
        .send({
          query: `mutation {
            updateEmployee(
              _id: "${EMPLOYEES[0]._id}",
              name: "Sergey Boyanovitch",
              salary: 200000,
              address: "Kiev, Ukraine",
              senior: true,
              workExperience: 23
            )
            {
              _id
            }
          }`
        });

    expect(response.status).toBe(200);
    expect(response.body.data.updateEmployee).toBeDefined();
    expect(response.body.data.updateEmployee._id).toBe(EMPLOYEES[0]._id);
    const employees = await Employee.find();
    expect(employees.length).toBe(EMPLOYEES.length);
    const updateEmployee = JSON.parse(JSON.stringify(await Employee.findById(EMPLOYEES[0]._id)));
    expect(updateEmployee).toEqual({
      _id: EMPLOYEES[0]._id,
      name: "Sergey Boyanovitch",
      salary: 200000,
      address: "Kiev, Ukraine",
      senior: true,
      workExperience: 23
    });
  });

  test('delete an employee', async () => {
    const ADMIN_TOKEN = ADMINS[0].tokens[0].token;
    const response =
      await request(server)
        .post('/graphql')
        .set('x-auth', ADMIN_TOKEN)
        .send({
          query: `mutation {
            deleteEmployee(
              _id: "${EMPLOYEES[0]._id}"
            )
            {
              _id
            }
          }`
        });

    expect(response.status).toBe(200);
    expect(response.body.data.deleteEmployee).toBeDefined();
    expect(response.body.data.deleteEmployee._id).toBe(EMPLOYEES[0]._id);
    const employees = await Employee.find();
    expect(employees.length).toBe(EMPLOYEES.length - 1);
    const updateEmployee = await Employee.findById(EMPLOYEES[0]._id);
    expect(updateEmployee).toBeNull();
  });
});
