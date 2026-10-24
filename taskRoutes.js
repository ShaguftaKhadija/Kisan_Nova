const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// 1. Saare tasks lana (GET)
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Naya task add karna (POST)
router.post('/', async (req, res) => {
  try {
    const { title, crop, dueDate, priority } = req.body;
    if (!title || !dueDate) {
      return res.status(400).json({ error: 'Title aur Due Date zaroori hain.' });
    }
    const newTask = new Task({ title, crop, dueDate, priority });
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. Task status badalna - Complete / Pending (PUT)
router.put('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: 'Task nahi mila' });
    task.isCompleted = !task.isCompleted;
    await task.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. Task delete karna (DELETE)
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task safaltapoorvak delete ho gaya' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;