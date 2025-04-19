const { consumer } = require('../config/kafka');
const Order = require('../models/Order');

const runConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'order-events', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const event = JSON.parse(message.value.toString());
        console.log('Kafka Consumer Received:', event);

        const order = await Order.findById(event.orderId);
        if (!order) {
          console.error(`Order not found: ${event.orderId}`);
          return;
        }

        switch (event.type) {
          case 'ORDER_CREATED':
            break;
          case 'ORDER_PREPARING':
          case 'ORDER_PICK_UP_READY':
          case 'ORDER_ON_THE_WAY':
          case 'ORDER_DELIVERED':
          case 'ORDER_CANCELLED':
            order.status = event.status;
            await order.save();
            console.log(`Order ${order._id} updated to ${event.status}`);
            break;
          default:
            console.warn('Unknown event type:', event.type);
        }
      } catch (err) {
        console.error('Consumer error:', err.message);
      }
    },
  });
};

module.exports = { runConsumer };