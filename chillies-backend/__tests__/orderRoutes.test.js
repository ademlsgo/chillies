const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

describe('orderRoutes', () => {
  let app;
  let token;
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    const orderRouter = require('../routes/orderRoutes');
    app = express();
    app.use(express.json());
    app.use('/api/orders', orderRouter);
    token = jwt.sign({ id: 1, role: 'superuser' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  it('GET / returns list', async () => {
    const res = await request(app).get('/api/orders');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST / validates body', async () => {
    const res = await request(app).post('/api/orders').send({});
    expect(res.status).toBe(400);
  });

  it('POST / creates order', async () => {
    const res = await request(app)
      .post('/api/orders')
      .send({ table_number: 5, cocktails: [{ cocktail_id: 1, quantity: 1 }] });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.status).toBe('Pending');
  });

  it('PUT /:id requires auth', async () => {
    const res = await request(app).put('/api/orders/999').send({ table_number: 1, cocktails: [{ cocktail_id: 1, quantity: 1 }] });
    expect(res.status).toBe(401);
  });

  it('PUT /:id 404 when not found', async () => {
    const res = await request(app)
      .put('/api/orders/999')
      .set('Authorization', `Bearer ${token}`)
      .send({ table_number: 1, cocktails: [{ cocktail_id: 1, quantity: 1 }] });
    expect(res.status).toBe(404);
  });

  it('PATCH /:id/status updates status', async () => {
    // Create one order first
    const created = await request(app)
      .post('/api/orders')
      .send({ table_number: 2, cocktails: [{ cocktail_id: 1, quantity: 2 }] });
    const id = created.body.id;
    const res = await request(app)
      .patch(`/api/orders/${id}/status`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'Completed' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('Completed');
  });

  it('DELETE /:id deletes or 404', async () => {
    const created = await request(app)
      .post('/api/orders')
      .send({ table_number: 3, cocktails: [{ cocktail_id: 2, quantity: 1 }] });
    const id = created.body.id;
    const ok = await request(app)
      .delete(`/api/orders/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(ok.status).toBe(204);
    const missing = await request(app)
      .delete(`/api/orders/${id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(missing.status).toBe(404);
  });
});

