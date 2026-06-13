const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const db = require('./db');

const csvPath = path.join(__dirname, '..', 'data', 'novabite_sales_data.csv');

const insert = db.prepare(`
  INSERT OR REPLACE INTO sales (
    transaction_id, date, month, quarter, sku, product_name,
    category, subcategory, region, channel, sales_rep,
    units_sold, unit_price_usd, gross_revenue_usd, discount_pct,
    net_revenue_usd, cogs_usd, gross_profit_usd
  ) VALUES (
    @transaction_id, @date, @month, @quarter, @sku, @product_name,
    @category, @subcategory, @region, @channel, @sales_rep,
    @units_sold, @unit_price_usd, @gross_revenue_usd, @discount_pct,
    @net_revenue_usd, @cogs_usd, @gross_profit_usd
  )
`);

let count = 0;

fs.createReadStream(csvPath)
  .pipe(csv())
  .on('data', (row) => {
    insert.run({
      transaction_id: row.transaction_id,
      date: row.date,
      month: row.month,
      quarter: row.quarter,
      sku: row.sku,
      product_name: row.product_name,
      category: row.category,
      subcategory: row.subcategory,
      region: row.region,
      channel: row.channel,
      sales_rep: row.sales_rep,
      units_sold: Number(row.units_sold),
      unit_price_usd: Number(row.unit_price_usd),
      gross_revenue_usd: Number(row.gross_revenue_usd),
      discount_pct: Number(row.discount_pct),
      net_revenue_usd: Number(row.net_revenue_usd),
      cogs_usd: Number(row.cogs_usd),
      gross_profit_usd: Number(row.gross_profit_usd),
    });
    count++;
  })
  .on('end', () => {
    console.log(`✅ Seeded ${count} rows into sales table.`);
  });