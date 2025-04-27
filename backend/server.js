const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require('http'); // Add this
const connectDB = require("./config/mongo");
const { runConsumer } = require("./kafka/orderConsumer");
const { producer } = require("./config/kafka");
const WebSocketServer = require('./config/websocket'); // Add this

dotenv.config();
connectDB(); // Connect to MongoDB

const app = express();
app.use(express.json());
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wsServer = new WebSocketServer(server);

// Routes
const userRoutes = require("./routes/userRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const dishRoutes = require("./routes/dishRoutes");
const orderRoutes = require("./routes/orderRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");

app.use("/api/users", userRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/dishes", dishRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Kafka & Server bootstrapping
(async () => {
  try {
    await producer.connect();
    console.log("Kafka Producer Connected");

    await runConsumer(wsServer); // Pass WebSocket server to consumer
    console.log("Kafka Consumer Running");

    // Start HTTP server (not just app.listen)
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error("Failed to start server or Kafka:", error);
    process.exit(1); // exit on startup failure
  }
})();