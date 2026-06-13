const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  try {
    const totals = db.prepare(`
      SELECT SUM(net_revenue_usd) AS total_net_revenue,
             SUM(units_sold) AS total_units,
             SUM(gross_profit_usd) AS total_gross_profit
      FROM sales
    `).get();

    const topRegion = db.prepare(`
      SELECT region, SUM(net_revenue_usd) AS revenue
      FROM sales GROUP BY region ORDER BY revenue DESC LIMIT 1
    `).get();

    const topChannel = db.prepare(`
      SELECT channel, SUM(net_revenue_usd) AS revenue
      FROM sales GROUP BY channel ORDER BY revenue DESC LIMIT 1
    `).get();

    const topProduct = db.prepare(`
      SELECT product_name, SUM(net_revenue_usd) AS revenue
      FROM sales GROUP BY product_name ORDER BY revenue DESC LIMIT 1
    `).get();

    const grossMarginPct = (totals.total_gross_profit / totals.total_net_revenue) * 100;

    res.json({
      total_net_revenue: totals.total_net_revenue,
      total_units: totals.total_units,
      gross_margin_pct: grossMarginPct,
      top_region: topRegion.region,
      top_channel: topChannel.channel,
      top_product: topProduct.product_name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;