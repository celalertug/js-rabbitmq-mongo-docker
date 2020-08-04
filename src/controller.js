const controller = async (mongo, consumer) => {
  await consumer.consume('item.add', 'item-add-queue', async (msg) => {
    const { replyTo, correlationId } = msg.properties;

    const body = JSON.parse(msg.content.toString());

    let res = await mongo.insert(body);
    res = res.result.ok ? { success: true } : { success: false };

    if (replyTo) {
      await consumer.sendToQueue(replyTo, JSON.stringify(res), { correlationId });
    }
  });

  await consumer.consume('item.find', 'item-find-queue', async (msg) => {
    const { replyTo, correlationId } = msg.properties;

    const body = JSON.parse(msg.content.toString());

    const res = await mongo.find(body);
    // console.log(res);

    // res = res.result.ok ? { success: true } : { success: false };

    if (replyTo) {
      await consumer.sendToQueue(replyTo, JSON.stringify(res), { correlationId });
    }
  });
};

module.exports = controller;
