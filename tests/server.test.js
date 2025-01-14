const request = require('supertest');
const app = require('../server'); // Assuming the app is exported from server.js
const http = require('http');

let server;

beforeAll((done) => {
  // Start the server before tests run
  server = app.listen(3000, done);
});

afterAll((done) => {
  // Close the server after tests
  server.close(done);
});

describe('Todo App API', () => {
  it('should return all tasks', async () => {
    const response = await request(app).get('/tasks');
    expect(response.status).toBe(200);
  });

  it('should add a new task', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ task: 'Test new task' });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Task added successfully');
  });

  it('should return error for missing task content', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Task content is required');
  });

  it('should delete a task', async () => {
    const newTask = await request(app)
      .post('/tasks')
      .send({ task: 'Task to delete' });
    const taskId = newTask.body.id;

    const response = await request(app)
      .delete(`/tasks/${taskId}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Task deleted successfully');
  });
});
