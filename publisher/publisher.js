const amqp = require('amqplib');

const publisher = {}

async function setupRabbitMQ() {
  const connection = await amqp.connect(`amqp://${process.env.RABBIT_MQ_HOST}:${process.env.RABBIT_MQ_PORT}`);
  const channel = await connection.createChannel();
  const queue = process.env.RABBIT_MQ_QUEUE;
  await channel.assertQueue(queue, { durable: true });
  console.log('RabbitMQ setup done');

  function publish(operation, data) {
    const message = {
        operation,
        data
    }
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
  }

  publisher.publish = publish;
}

module.exports = { setupRabbitMQ, publisher };
