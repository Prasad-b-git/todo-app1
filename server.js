// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory task list
let tasks = [];

// Routes
// Get all tasks
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { task } = req.body;
    if (task) {
        tasks.push({ id: Date.now(), task });
        res.status(201).json({ message: 'Task added successfully' });
    } else {
        res.status(400).json({ message: 'Task content is required' });
    }
});

// Delete a task by ID
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(t => t.id != id);
    res.json({ message: 'Task deleted successfully' });
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
