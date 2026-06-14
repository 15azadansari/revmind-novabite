const request = require('supertest');
const express = require('express');
const summaryRouter = require('./summary');

const app = express();
app.use('/api/summary', summaryRouter);

describe('GET /api/summary', () => {
  it('should return key business metrics', async () => {
    const res = await request(app).get('/api/summary');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('total_net_revenue');
    expect(res.body).toHaveProperty('total_units');
    expect(res.body).toHaveProperty('gross_margin_pct');
    expect(res.body).toHaveProperty('top_region');
    expect(res.body).toHaveProperty('top_channel');
    expect(res.body).toHaveProperty('top_product');

    expect(typeof res.body.total_net_revenue).toBe('number');
    expect(typeof res.body.gross_margin_pct).toBe('number');
  });

  it('should return positive total net revenue', async () => {
    const res = await request(app).get('/api/summary');
    expect(res.body.total_net_revenue).toBeGreaterThan(0);
  });
});