// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

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
