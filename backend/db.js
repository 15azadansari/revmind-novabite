const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'data.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS sales (
    transaction_id TEXT PRIMARY KEY,
    date TEXT,
    month TEXT,
    quarter TEXT,
    sku TEXT,
    product_name TEXT,
    category TEXT,
    subcategory TEXT,
    region TEXT,
    channel TEXT,
    sales_rep TEXT,
    units_sold INTEGER,
    unit_price_usd REAL,
    gross_revenue_usd REAL,
    discount_pct REAL,
    net_revenue_usd REAL,
    cogs_usd REAL,
    gross_profit_usd REAL
  )
`);

module.exports = db;