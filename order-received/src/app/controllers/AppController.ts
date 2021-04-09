import { Request, Response } from 'express';
import { Kafka } from 'kafkajs';

interface IOrder {
  id: number;
  qtd: number;
  status: string;
  description: string;
  value: number;
}

class AppController {
  async sendOrder(req: Request, res: Response) {
    let order = req.body as IOrder;

    order.id = Math.floor(Math.random() * 1000);
    order.status = 'PENDING PAYMENT';

    const kafka = new Kafka({
      clientId: 'apache_kafka',
      brokers: ['127.0.0.1:9092'],
    });

    const producer = kafka.producer();

    await producer.connect();
    await producer.send({
      topic: 'ORDER_RECEIVED',
      messages: [{
        value: JSON.stringify(order),
      }],
    });
    await producer.disconnect();

    return res.json({
      order,
      message: 'Order successfully placed, we are analyzing your payment.',
    });
  }
}

export default new AppController;
