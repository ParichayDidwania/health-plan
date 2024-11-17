const dotenv = require('dotenv')
dotenv.config()

const { Client } = require('@elastic/elasticsearch');
const amqp = require('amqplib');

const esClient = new Client({ 
    node: `http://${process.env.ES_HOST}:${process.env.ES_PORT}`,
    auth: { username: process.env.ES_USER, password: process.env.ES_LOCAL_PASSWORD }
});

async function setupConsumer() {
  const connection = await amqp.connect(`amqp://${process.env.RABBIT_MQ_HOST}:${process.env.RABBIT_MQ_PORT}`);
  const channel = await connection.createChannel();
  const queue = process.env.RABBIT_MQ_QUEUE;
  await channel.assertQueue(queue, { durable: true });

  const indexExists = await esClient.indices.exists({ index: process.env.ES_INDEX });

  if(!indexExists) {
    await esClient.indices.create({
        index: process.env.ES_INDEX,
        mappings: {
          properties: {
            join_field: {
              type: "join",
              relations: {
                "plan": ["planCostShares", "linkedPlanServices"],
                "linkedPlanServices": ["linkedService", "planserviceCostShares"]
              },
            },
          },
        },
      });
  }

  console.log('RabbitMQ setup done');

  channel.consume(queue, async (msg) => {
    const message = JSON.parse(msg.content.toString());
    const data = message.data;
    const operation = message.operation;

    console.log(`performing ${operation} on ${data.objectId}`);
      
    const result = [];
    recursiveSegregation(data, "plan", "", result);

    try {
        if (operation === 'delete') {
            for (const obj of result) {
                await esClient.delete({
                    index: process.env.ES_INDEX,
                    id: obj.objectId,
                    routing: obj.join_field.parent
                });
            }
        } else if (operation === 'update' || operation === 'create') {
            for (const obj of result) {
                await esClient.index({
                    index: process.env.ES_INDEX,
                    id: obj.objectId,
                    routing: obj.join_field.parent,
                    document: obj
                });
            }
        }
        channel.ack(msg);
    } catch (e) {
        console.log(e);
    }
  });
}

function recursiveSegregation(data, parentName, parentId, result) {
    const currentObject = {};
    for (const key in data) {
        if (typeof data[key] === 'object') {
            if(Array.isArray(data[key])) {
                for(const obj of data[key]) {
                    recursiveSegregation(obj, key, data.objectId, result);
                }
            } else {
                recursiveSegregation(data[key], key, data.objectId, result);
            }
        } else {
            currentObject[key] = data[key];
        }
    }
    currentObject.join_field = {};
    currentObject.join_field.name = parentName;
    currentObject.join_field.parent = parentId;

    result.push(currentObject);
}

setupConsumer();
