const express = require('express');

const app = express();
app.use(express.json());

let todos = [];
let nextId = 1;

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.get('/todos', (req, res) => res.json(todos));

app.post('/todos', (req, res) => {
  const { title } = req.body || {};
  if (!title) return res.status(400).json({ error: 'title required' });
  const todo = { id: nextId++, title, done: false };
  todos.push(todo);
  res.status(201).json(todo);
});

app.delete('/todos/:id', (req, res) => {
  const id = Number(req.params.id);
  const before = todos.length;
  todos = todos.filter((t) => t.id !== id);
  if (todos.length === before) return res.status(404).json({ error: 'not found' });
  res.status(204).end();
});

// POST /sum {numbers: [..]} -> {sum}
app.post('/sum', (req, res) => {
  const { numbers } = req.body || {};
  if (!Array.isArray(numbers)) return res.status(400).json({ error: 'numbers required' });
  const sum = numbers.reduce((a, b) => a + b);
  res.json({ sum });
});

// GET /date?value=2024-03-01T09:00:00+09:00 -> {iso}
app.get('/date', (req, res) => {
  const value = req.query.value;
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(Z|[+-]\d{2}:\d{2})$/.exec(value || '');
  if (!m) return res.status(400).json({ error: 'invalid date' });
  const [, y, mo, d, h, mi, s] = m;
  const date = new Date(Date.UTC(+y, +mo - 1, +d, +h, +mi, +s));
  res.json({ iso: date.toISOString() });
});

app._reset = () => {
  todos = [];
  nextId = 1;
};

module.exports = app;
