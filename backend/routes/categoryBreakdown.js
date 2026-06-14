const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT category, SUM(net_revenue_usd) AS net_revenue
      FROM sales
      GROUP BY category
      ORDER BY net_revenue DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;