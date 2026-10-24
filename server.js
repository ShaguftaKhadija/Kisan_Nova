const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-Memory Database (Agar MongoDB connect na ho toh yahan data save hoga)
let localTasks = [
  { _id: '1', title: 'Basal DAP Sowing', crop: 'Wheat', dueDate: '2026-11-10', priority: 'High', isCompleted: true },
  { _id: '2', title: 'CRI 1st Irrigation', crop: 'Wheat', dueDate: '2026-10-25', priority: 'Medium', isCompleted: false }
];

// Tasks APIs
app.get('/api/tasks', (req, res) => {
  res.json(localTasks);
});

app.post('/api/tasks', (req, res) => {
  const { title, dueDate, priority } = req.body;
  if (!title || !dueDate) {
    return res.status(400).json({ error: 'Title and date required' });
  }
  const newTask = {
    _id: Date.now().toString(),
    title,
    dueDate,
    priority: priority || 'Medium',
    isCompleted: false
  };
  localTasks.unshift(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const task = localTasks.find(t => t._id === req.params.id);
  if (task) {
    task.isCompleted = !task.isCompleted;
    return res.json(task);
  }
  res.status(404).json({ error: 'Task not found' });
});

app.delete('/api/tasks/:id', (req, res) => {
  localTasks = localTasks.filter(t => t._id !== req.params.id);
  res.json({ message: 'Deleted' });
});

// Crops API
app.post('/api/crops/recommend', (req, res) => {
  res.json({
    success: true,
    recommendations: [
      {
        crop: 'Wheat (Sharbati / HD-2967)',
        cropHi: 'गेहूँ (शरबती / HD-2967)',
        duration: '115-130 Days',
        expectedYield: '20-22 Quintals / Acre',
        profitPerAcre: 33000
      },
      {
        crop: 'Mustard (Pusa Bold)',
        cropHi: 'सरसों (पूसा बोल्ड)',
        duration: '105 Days',
        expectedYield: '8-10 Quintals / Acre',
        profitPerAcre: 39750
      }
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'online', app: 'Kisan Nova API Server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Kisan Nova Server running on http://localhost:${PORT}`);
});