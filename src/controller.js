const express = require('express');

module.exports = (service) => {
  const router = express.Router();

  router.get('/test', (req, res) => {
    res.json({ message: 'surprise motherfucker!!!' });
  });

  router.post('/item', async (req, res) => {
    await service.insert(req.body);
    await service.find();

    res.json(req.body);
  });
  router.get('/item', async (req, res) => {
    res.json(await service.find());
  });

  return router;
};
