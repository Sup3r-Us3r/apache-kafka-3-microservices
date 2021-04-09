import { Kafka } from 'kafkajs';

interface IOrder {
  id: number;
  qtd: number;
  status: string;
  description: string;
  value: number;
  paymentId?: number;
  nfe?: string;
}

const kafka = new Kafka({
  clientId: 'apache_kafka',
  brokers: ['127.0.0.1:9092'],
});

const consumer = kafka.consumer({ groupId: 'invoice' });
const producer = kafka.producer();

async function billedOrder(order: IOrder) {
  order.nfe = `nfe_${order.id}_${new Date().getFullYear()}.xml`;
  order.status = 'BILLED';

  await producer.connect();
  await producer.send({
    topic: 'BILLED_ORDER',
    messages: [{
      value: JSON.stringify(order),
    }],
  });
  await producer.disconnect();
}

async function runRevenues() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'PAID_ORDER', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(String(message.value));

      await billedOrder(order);
    },
  });
}

runRevenues().catch(err => console.log(err));
