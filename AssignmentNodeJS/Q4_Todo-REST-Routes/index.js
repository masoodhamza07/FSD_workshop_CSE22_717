const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

let tasks = [];
let nextId = 1;

app.get('/tasks', (req, res) => {
  res.status(200).json(tasks);
});

app.post('/tasks', (req, res) => {
  const { title } = req.body || {};

  if (!title || !String(title).trim()) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const task = {
    id: nextId++,
    title: String(title).trim(),
    completed: false
  };

  tasks.push(task);
  res.status(201).json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const task = tasks.find((item) => item.id === id);

  if (!task) {
    return res.status(404).json({ error: `Task ${id} not found.` });
  }

  task.completed = true;
  res.status(200).json(task);
});

app.delete('/tasks/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = tasks.findIndex((item) => item.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Task ${id} not found.` });
  }

  const [deleted] = tasks.splice(index, 1);
  res.status(200).json({ message: 'Task deleted.', task: deleted });
});

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'To-Do List API',
    routes: [
      'GET /tasks',
      'POST /tasks  { "title": "..." }',
      'PUT /tasks/:id',
      'DELETE /tasks/:id'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`To-Do API running at http://localhost:${PORT}`);
});
