process.env.MASTER_KEY = Buffer.alloc(32).toString('hex');
process.env.PORT = '0';

const request = require('supertest');
const app = require('../src/server');
const fs = require('fs');
const path = require('path');

afterAll(() => {
  // cleanup possible DB/logs created during tests
  const dbPath = path.resolve(process.cwd(), 'data.db');
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
});

test('POST /api/bots and GET /api/bots', async () => {
  const agent = request(app);
  const add = await agent.post('/api/bots').send({ name: 'test-bot', token: 'abc123' });
  expect(add.status).toBe(201);
  expect(add.body).toHaveProperty('id');

  const list = await agent.get('/api/bots');
  expect(list.status).toBe(200);
  expect(Array.isArray(list.body)).toBe(true);
  expect(list.body.find(b => b.name === 'test-bot')).toBeTruthy();
});
