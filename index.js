/* eslint-disable no-console */
require('dotenv').config();
const { connectDb, create } = require('mongo-node-client');
const { ServiceCreator } = require('amqp-rpc-node-client');

const controller = require('./src/controller.js');

(async () => {
  const {
    MONGO_URL, DB_NAME, COLLECTION_NAME, RABBITMQ_EXCHANGE, RABBITMQ_HOST,
  } = process.env;

  let db;
  let dbo;
  try {
    // db = await connectDb(process.env.MONGO_URL);
    db = await connectDb(MONGO_URL);
    dbo = db.db(DB_NAME);
  } catch (error) {
    console.log('mongo db connection failed');
    process.exit(1);
  }

  const dbService = create(dbo, COLLECTION_NAME);
  try {
    await dbService.createCollection();
  } catch (error) {
    console.log('collection error');
    console.log(error);
  }

  let amqpService;
  try {
    amqpService = await ServiceCreator(RABBITMQ_HOST, RABBITMQ_EXCHANGE);
  } catch (err) {
    console.log('rabbit mq connection failed');
    process.exit(1);
  }

  try {
    await controller(dbService, amqpService);
  } catch (err) {
    console.log('consumers failed');
    process.exit(1);
  }
  console.log('Yol kapatıldı... Yol ölüler tarafından kapatıldı... ve yol ölülerin kontrolünde...');
})();
