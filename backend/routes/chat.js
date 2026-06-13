const express = require('express');
const router = express.Router();
const db = require('../db');
const { askLLM } = require('../services/llmService');

function buildDataContext() {
  // Region-wise net revenue
  const byRegion = db.prepare(`
    SELECT region, SUM(net_revenue_usd) AS revenue
    FROM sales GROUP BY region ORDER BY revenue DESC
  `).all();

  // Category-wise net revenue and gross margin
  const byCategory = db.prepare(`
    SELECT category,
           SUM(net_revenue_usd) AS revenue,
           SUM(gross_profit_usd) AS profit
    FROM sales GROUP BY category
  `).all();

  // Channel-wise net revenue
  const byChannel = db.prepare(`
    SELECT channel, SUM(net_revenue_usd) AS revenue
    FROM sales GROUP BY channel ORDER BY revenue DESC
  `).all();

  // Sales rep performance (units sold, by year)
  const byRepYear = db.prepare(`
    SELECT sales_rep, substr(date, 1, 4) AS year, SUM(units_sold) AS units
    FROM sales GROUP BY sales_rep, year ORDER BY year, units DESC
  `).all();

  // Region-wise revenue by quarter (for Q1 2024 type questions)
  const byRegionQuarter = db.prepare(`
    SELECT region, quarter, SUM(net_revenue_usd) AS revenue
    FROM sales GROUP BY region, quarter ORDER BY quarter, revenue DESC
  `).all();

  // Top product per region
  const topProductByRegion = db.prepare(`
    SELECT region, product_name, SUM(net_revenue_usd) AS revenue
    FROM sales
    GROUP BY region, product_name
    ORDER BY region, revenue DESC
  `).all();

  // Build text blocks
  let context = '';

  context += 'REGION-WISE NET REVENUE (Total):\n';
  byRegion.forEach(r => context += `- ${r.region}: $${r.revenue.toFixed(2)}\n`);

  context += '\nCATEGORY-WISE NET REVENUE AND GROSS PROFIT MARGIN:\n';
  byCategory.forEach(c => {
    const margin = (c.profit / c.revenue) * 100;
    context += `- ${c.category}: Net Revenue $${c.revenue.toFixed(2)}, Gross Profit $${c.profit.toFixed(2)}, Margin ${margin.toFixed(2)}%\n`;
  });

  context += '\nCHANNEL-WISE NET REVENUE (Total):\n';
  byChannel.forEach(c => context += `- ${c.channel}: $${c.revenue.toFixed(2)}\n`);

  context += '\nREGION-WISE NET REVENUE BY QUARTER:\n';
  byRegionQuarter.forEach(r => context += `- ${r.region}, ${r.quarter}: $${r.revenue.toFixed(2)}\n`);

  context += '\nSALES REP UNITS SOLD BY YEAR:\n';
  byRepYear.forEach(r => context += `- ${r.sales_rep} (${r.year}): ${r.units} units\n`);

  // Group top product by region (take top 1 per region only)
  context += '\nTOP PRODUCT PER REGION (by net revenue):\n';
  const seenRegions = new Set();
  topProductByRegion.forEach(r => {
    if (!seenRegions.has(r.region)) {
      context += `- ${r.region}: ${r.product_name} ($${r.revenue.toFixed(2)})\n`;
      seenRegions.add(r.region);
    }
  });

  return context;
}

router.post('/', async (req, res) => {
  try {
    const { question } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    const dataContext = buildDataContext();
    const answer = await askLLM(question, dataContext);

    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get answer from LLM' });
  }
});

module.exports = router;