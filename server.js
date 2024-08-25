const express = require('express');
const dotenv = require('dotenv');
const tokenRoutes = require('./routes/tokenRoutes');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Use the token routes
app.use('/api', tokenRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
