const express = require('express');
const request = require('supertest');

describe('authRoutes', () => {
  let app;
  beforeAll(() => {
    process.env.JWT_SECRET = 'test-secret';
    const { router } = require('../routes/authRoutes');
    app = express();
    app.use(express.json());
    app.use('/api/auth', router);
  });

  it('returns 400 when fields are missing', async () => {
    const res = await request(app).post('/api/auth/login').send({});
    expect(res.status).toBe(400);
  });

  it('returns 401 for unknown user', async () => {
    const res = await request(app).post('/api/auth/login').send({ identifiant: 'nope', password: 'x' });
    expect(res.status).toBe(401);
  });

  it('returns 401 for wrong password', async () => {
    const res = await request(app).post('/api/auth/login').send({ identifiant: 'ademfellah', password: 'wrong' });
    expect(res.status).toBe(401);
  });

  it('returns token and user for valid credentials', async () => {
    const res = await request(app).post('/api/auth/login').send({ identifiant: 'ademfellah', password: 'AdemFellah13?' });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
  });

  it('GET /me requires token', async () => {
    const res = await request(app).get('/api/auth/me');
    expect(res.status).toBe(401);
  });

  it('GET /me accepts valid token', async () => {
    const login = await request(app).post('/api/auth/login').send({ identifiant: 'ademfellah', password: 'AdemFellah13?' });
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
  });
});

