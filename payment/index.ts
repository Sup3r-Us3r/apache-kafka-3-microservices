import { Kafka } from 'kafkajs';

interface IOrder {
  id: number;
  qtd: number;
  status: string;
  description: string;
  value: number;
  paymentId?: number;
}

const kafka = new Kafka({
  clientId: 'apache_kafka',
  brokers: ['127.0.0.1:9092'],
});

const consumer = kafka.consumer({ groupId: 'payment' });
const producer = kafka.producer();

async function processPayment(order: IOrder) {
  order.status = 'PAID';
  order.paymentId = Math.floor(Math.random() * 1000);

  await producer.connect();
  await producer.send({
    topic: 'PAID_ORDER',
    messages: [{
      value: JSON.stringify(order),
    }],
  });
  await producer.disconnect();
}

async function runPayment() {
  await consumer.connect();
  await consumer.subscribe({ topic: 'ORDER_RECEIVED', fromBeginning: true });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const order = JSON.parse(String(message.value));

      await processPayment(order);
    },
  });
}

runPayment().catch(err => console.log(err));
