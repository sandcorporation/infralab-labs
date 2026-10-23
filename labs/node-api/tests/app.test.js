const request = require('supertest');
const app = require('../src/app');

beforeEach(() => app._reset());

test('health', async () => {
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ status: 'ok' });
});

test('todo 생성과 조회', async () => {
  const created = await request(app).post('/todos').send({ title: 'a' });
  expect(created.status).toBe(201);
  const list = await request(app).get('/todos');
  expect(list.body).toEqual([{ id: 1, title: 'a', done: false }]);
});

test('title 없으면 400', async () => {
  const res = await request(app).post('/todos').send({});
  expect(res.status).toBe(400);
});

test('todo 삭제', async () => {
  await request(app).post('/todos').send({ title: 'a' });
  expect((await request(app).delete('/todos/1')).status).toBe(204);
  expect((await request(app).delete('/todos/1')).status).toBe(404);
});

test('sum 합계', async () => {
  const res = await request(app).post('/sum').send({ numbers: [1, 2, 3] });
  expect(res.body).toEqual({ sum: 6 });
});

test('sum 빈 목록은 0', async () => {
  const res = await request(app).post('/sum').send({ numbers: [] });
  expect(res.status).toBe(200);
  expect(res.body).toEqual({ sum: 0 });
});

test('date UTC 변환', async () => {
  const res = await request(app).get('/date').query({ value: '2024-03-01T09:00:00Z' });
  expect(res.body.iso).toBe('2024-03-01T09:00:00.000Z');
});

test('date 오프셋 반영', async () => {
  const res = await request(app).get('/date').query({ value: '2024-03-01T09:00:00+09:00' });
  expect(res.body.iso).toBe('2024-03-01T00:00:00.000Z');
});
