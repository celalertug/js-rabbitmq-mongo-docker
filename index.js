/* eslint-disable no-console */
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { connectDb, create } = require('mongo-node-client');

const controller = require('./src/controller.js');

(async () => {
  const {
    PORT, MONGO_URL, DB_NAME, COLLECTION_NAME,
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

  const authTokenService = create(dbo, COLLECTION_NAME);
  try {
    await authTokenService.createCollection();
  } catch (error) {
    console.log('collection error');
    console.log(error);
  }

  const app = express();

  app.use(bodyParser.json());
  app.use(cors());
  app.use('/', controller(authTokenService));

  app.listen(PORT, () => console.log(`listening at http://localhost:${PORT}`));
})();
