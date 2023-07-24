require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_ATLAS_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to the DB'))
  .catch((error) =>
    console.error('Error connecting to the database:', error)
  );

// Routes
app.use('/waivers', require('./routes/waiverRouter'));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.log(err);
  return res.send({ errMsg: err.message });
});

// Server Listening on Port 9000
const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
