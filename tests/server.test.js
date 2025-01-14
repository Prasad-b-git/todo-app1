const request = require('supertest');
const app = require('../server');  // Import the app

// Set Jest timeout to 10 seconds
jest.setTimeout(30000); // Increase timeout to 10 seconds

let server;

beforeAll((done) => {
  // Start the server before tests run
  server = app.listen(3000, done); // Ensure server is listening on port 3000
});

afterAll((done) => {
  // Close the server after tests are done to free the port
  server.close(done);
});

describe('Todo App API', () => {
  it('should return all tasks', async () => {
    const response = await request(server).get('/tasks');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('should add a new task', async () => {
    const newTask = { content: 'Test task' };
    const response = await request(server).post('/tasks').send(newTask);
    expect(response.status).toBe(201);
    expect(response.body.content).toBe(newTask.content);
  });

  it('should return error for missing task content', async () => {
    const response = await request(server).post('/tasks').send({});
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Content is required');
  });

  it('should delete a task', async () => {
    const newTask = { content: 'Task to delete' };
    const createdResponse = await request(server).post('/tasks').send(newTask);
    const taskId = createdResponse.body.id;

    const deleteResponse = await request(server).delete(`/tasks/${taskId}`);
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body.message).toBe('Task deleted');
  });
});
