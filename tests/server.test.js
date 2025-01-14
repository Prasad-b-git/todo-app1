// tests/server.test.js
const request = require('supertest');
const app = require('../server'); // Import the Express app from server.js

describe('Todo App API', () => {

  // Test GET /tasks route
  it('should return all tasks', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // Test POST /tasks route
  it('should add a new task', async () => {
    const newTask = { task: 'Learn Jest' };
    const response = await request(app)
      .post('/tasks')
      .send(newTask);
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Task added successfully');
  });

  // Test POST /tasks route (invalid data)
  it('should return error for missing task content', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Task content is required');
  });

  // Test DELETE /tasks/:id route
  it('should delete a task', async () => {
    const taskToDelete = { task: 'Test Task' };
    const addResponse = await request(app).post('/tasks').send(taskToDelete);
    const taskId = addResponse.body.id; // Assuming task ID is returned in response

    const deleteResponse = await request(app).delete(`/tasks/${taskId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Task deleted successfully');
  });
});
