const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'uber-eats-backend',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

// Create Kafka consumer (for restaurant-side processing)
const consumer = kafka.consumer({ groupId: 'restaurant-service-group' });

module.exports = {
  kafka,
  producer,
  consumer,
};