require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
const uri = process.env.MONGO_URI;

if (!uri) {
  console.error('Error: MONGO_URI is not defined in the environment variables.');
  process.exit(1); // Exit the application if MONGO_URI is undefined
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Import routes
const userRoutes = require('./routes/user');
const projectRoutes = require('./routes/project');
const walletRoutes = require('./routes/wallet');
const metricsRoutes = require('./routes/metrics');

app.use('/api/user', userRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/metrics', metricsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
