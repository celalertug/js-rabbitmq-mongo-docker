const assert = require('assert');

const { ServiceCreator } = require('amqp-rpc-node-client');
const { connectDb, disconnectDb, create } = require('mongo-node-client/mock-service');
const controller = require('../src/controller.js');

// eslint-disable-next-line no-undef
describe('consumer', async () => {
  const removeIds = (items) => items.map((i) => {
    const { _id, ...ret } = i;
    return ret;
  });

  let serviceConsumer;
  let serviceMongo;
  let db;

  // eslint-disable-next-line no-undef
  beforeEach(async () => {
    serviceConsumer = await ServiceCreator('localhost', 'template-exchange');
    db = await connectDb('db');
    serviceMongo = create(db.dbo, 'ex-collection');
    await serviceMongo.createCollection();

    await controller(serviceMongo, serviceConsumer);
  });

  // eslint-disable-next-line no-undef
  afterEach(async () => {
    await serviceConsumer.close();
    await disconnectDb(db);
  });

  // eslint-disable-next-line no-undef
  it('should simple crud', async () => {
    let res = await serviceConsumer.rpcRequest('item.add', JSON.stringify({ username: 'hayri', age: 22 }));
    res = JSON.parse(res.content.toString());
    // console.log(res);
    assert.deepStrictEqual(res, { success: true });

    res = await serviceConsumer.rpcRequest('item.find', JSON.stringify({ }));
    res = JSON.parse(res.content.toString());
    // console.log(removeIds(res));
    assert.deepStrictEqual(removeIds(res), [{ username: 'hayri', age: 22 }]);
  });
});
