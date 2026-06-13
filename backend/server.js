require('dotenv').config();
const express = require('express');
const cors = require('cors');

const productsRouter = require('./routes/products');
const summaryRouter = require('./routes/summary');
const trendsRouter = require('./routes/trends');
const chatRouter = require('./routes/chat');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'RevMind AI Backend is running' });
});

app.use('/api/products', productsRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/trends', trendsRouter);
app.use('/api/chat', chatRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});