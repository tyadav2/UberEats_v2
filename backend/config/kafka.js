const { Kafka } = require('kafkajs');

// Create Kafka client instance
const kafka = new Kafka({
  clientId: 'uber-eats-backend',
  brokers: ['localhost:9092'], // change if you're using a remote broker
});

// Create Kafka producer
const producer = kafka.producer();

// Create Kafka consumer (for restaurant-side processing)
const consumer = kafka.consumer({ groupId: 'restaurant-service-group' });

module.exports = {
  kafka,
  producer,
  consumer,
};