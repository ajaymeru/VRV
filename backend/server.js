const express = require('express');
const jsonServer = require('json-server');
const bodyParser = require('body-parser');
const cors = require('cors')


const authRoutes = require('./routes/auth');
const { authenticate } = require('./routes/middleware');

const app = express();
const port = 3000;
app.use(cors())

// Middlewares
app.use(bodyParser.json());
app.use('/auth', authRoutes);

// JSON Server routes
const router = jsonServer.router('./db.json');
app.use('/api', authenticate, router);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
