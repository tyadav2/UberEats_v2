const { consumer } = require('../config/kafka');
const Order = require('../models/Order');

const runConsumer = async (wsServer) => {
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
            console.log(`Processing ORDER_CREATED for order ${order._id}`);
            console.log(`Restaurant ID: ${order.restaurantId}`);
            
            // Notify the restaurant about new order
            if (wsServer) {
              const notificationData = {
                type: 'NEW_ORDER',
                orderId: order._id,
                order: order,
                timestamp: new Date().toISOString()
              };
              console.log('Sending notification to restaurant:', notificationData);
              wsServer.sendToRestaurant(order.restaurantId.toString(), notificationData);
            } else {
              console.error('wsServer not available');
            }
            break;

          case 'ORDER_PREPARING':
          case 'ORDER_PICK_UP_READY':
          case 'ORDER_ON_THE_WAY':
          case 'ORDER_DELIVERED':
          case 'ORDER_CANCELLED':
            order.status = event.status;
            await order.save();
            console.log(`Order ${order._id} updated to ${event.status}`);
            
            // Send real-time update to the user
            if (wsServer) {
              wsServer.sendToUser(order.userId.toString(), {
                type: 'ORDER_UPDATE',
                orderId: order._id,
                status: event.status,
                timestamp: new Date().toISOString()
              });
            }
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