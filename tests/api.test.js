/* eslint-disable no-undef */
const assert = require('assert');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios').default;
const mock = require('mongo-node-client/mock-service');
const controller = require('../src/controller.js');

// const mockService = () => ({
//   insert: async () => new Promise((resolve) => { resolve(true); }),
//   find: async () => new Promise((resolve) => { resolve({ user: 'adam', wife: 'eva' }); }),
// });

describe('server', () => {
  const removeIds = (items) => items.map((i) => {
    const { _id, ...ret } = i;
    return ret;
  });
  // const removeId = (item) => {
  //   const { _id, ...ret } = item;
  //   return ret;
  // };

  const PORT = 3000;
  const URL = `http://localhost:${PORT}`;

  let listener;
  let db;
  beforeEach(async () => {
    db = await mock.connectDb('mytestdatabase');
    const mongoService = mock.create(db.dbo, 'mytestcollection');
    await mongoService.createCollection();

    const app = express();
    app.use(cors());
    app.use(bodyParser.json());
    // app.use('/', controller());
    app.use('/', controller(mongoService));
    listener = app.listen(PORT);
  });

  afterEach(async () => {
    mock.disconnectDb(db);
    listener.close();
  });

  it('should echo api', async () => {
    const res = await axios.get(`${URL}/test`);
    assert.deepStrictEqual(res.data, { message: 'surprise motherfucker!!!' });
  });
  it('should echo post', async () => {
    const res = await axios.post(`${URL}/item`, { user: 'aaa', age: 12332 });
    assert.deepStrictEqual(res.data, { user: 'aaa', age: 12332 });
  });
  it('should echo get', async () => {
    await axios.post(`${URL}/item`, { user: 'adam', wife: 'eva' });

    const res = await axios.get(`${URL}/item`);
    assert.deepStrictEqual(removeIds(res.data), [{ user: 'adam', wife: 'eva' }]);
  });
});
