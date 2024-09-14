const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const logger = require("morgan");

// Initialize express app
const app = express();
const port = process.env.PORT || 3000;

// MongoDB connection function
const connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://usamahayatn:usama12345@poscluster.a9kba.mongodb.net/posCluster", // Ensure you're connecting to the right DB name.
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit the application if connection fails
  }
};

// Middleware setup
app.use(logger("dev")); // Log HTTP requests to the console
app.use(express.json()); // Parse incoming JSON requests
app.use(cors()); // Enable CORS for all routes

// Import routes
const categoryRoute = require("./routes/categories.js");
const productRoute = require("./routes/products.js");
const invoiceRoute = require("./routes/invoices.js");
const authRoute = require("./routes/auth.js");
const userRoute = require("./routes/users.js");

// Use the routes
app.use("/api/categories", categoryRoute);
app.use("/api/products", productRoute);
app.use("/api/invoices", invoiceRoute);
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);

// Start server and connect to MongoDB
app.listen(port, () => {
  connect(); // Connect to the database before starting the server
  console.log(`Server is listening on port ${port}...`);
});
