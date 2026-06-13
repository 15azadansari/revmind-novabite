const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.json({ answer: 'Chat endpoint coming soon' });
});

module.exports = router;