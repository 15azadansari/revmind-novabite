const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT sku, product_name,
             SUM(net_revenue_usd) AS total_net_revenue,
             SUM(units_sold) AS total_units_sold
      FROM sales
      GROUP BY sku, product_name
      ORDER BY total_net_revenue DESC
    `).all();

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;