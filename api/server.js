const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// In-memory task list
let tasks = [];

// Routes
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const { task } = req.body;
    if (task) {
        tasks.push({ id: Date.now(), task });
        res.status(201).json({ message: 'Task added successfully' });
    } else {
        res.status(400).json({ message: 'Task content is required' });
    }
});

app.delete('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id != id);
    res.json({ message: 'Task deleted successfully' });
});

app.delete('/api/tasks', (req, res) => {
    tasks = [];
    res.status(200).json({ message: 'All tasks cleared' });
});

// Export handler for Vercel
module.exports = app;
