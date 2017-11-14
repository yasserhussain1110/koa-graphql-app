const server = require('../server');
require('./setUpDB')(__filename);
const request = require('supertest');
const mongoose = require('mongoose');
const Admin = require('../models/admin/admin');
const bcrypt = require('bcryptjs');
const {ADMINS} = require('../seed/seedInfo');
const _ = require('lodash');

beforeAll(async () => {
  await Admin.remove();
});

beforeEach(async () => {
  const admin = new Admin(ADMINS[0]);
  await admin.save();
});

afterEach(async () => {
  await Admin.remove();
});

afterAll(async () => {
  try {
    server.close();
    mongoose.connection.close();
  } catch (e) {
    console.log(e);
    throw e;
  }
});

describe('Testing Admin model', () => {
  test('able to save admin', async done => {
    try {
      const admin = await new Admin({
        username: 'some-admin',
        password: 'something'
      }).save();

      expect(admin).toBeDefined();
      expect(admin.toJSON()).toMatchObject({username: 'some-admin', tokens: []});
      done();
    } catch (e) {
      done(e);
    }
  });

  test('admin password is being hashed', async done => {
    try {
      const admin = await new Admin({
        username: 'some-admin',
        password: 'something'
      }).save();
      expect(await bcrypt.compare('something', admin.password)).toBe(true);
      done();
    } catch (e) {
      done(e);
    }
  });

  test('able to fetch admin by token', async done => {
    try {
      const firstAdmin = ADMINS[0];
      const token = firstAdmin.tokens[0].token;
      const admin = JSON.parse(JSON.stringify(await Admin.findByToken(token)));
      expect(_.omit(admin, ['password'])).toMatchObject(_.omit(firstAdmin, ['password']));
      done();
    } catch (e) {
      done(e);
    }
  });
});


describe('Testing admin authentication', () => {
  test('should get unathorized error', async () => {
    const response = await request(server).get('/employees');
    expect(response.status).toBe(401);
  })
});
