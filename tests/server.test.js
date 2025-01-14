const http = require('http');
const assert = require('assert');
const app = require('./server'); // Import the server

const PORT = 3000;
const BASE_URL = `http://localhost:${PORT}`;

// Start the server for testing
const server = app.listen(PORT, () => {
    console.log(`Test server running on ${BASE_URL}`);
});

// Helper function to send HTTP requests
function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const dataString = data ? JSON.stringify(data) : null;
        const options = {
            hostname: 'localhost',
            port: PORT,
            path,
            method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': dataString ? Buffer.byteLength(dataString) : 0,
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => {
                resolve({ status: res.statusCode, body: body ? JSON.parse(body) : {} });
            });
        });

        req.on('error', reject);

        if (dataString) {
            req.write(dataString);
        }
        req.end();
    });
}

// Test: Add a task
(async () => {
    try {
        // 1. Add a task
        const addResponse = await makeRequest('/tasks', 'POST', { task: 'Learn Node.js' });
        assert.strictEqual(addResponse.status, 201);
        assert.strictEqual(addResponse.body.message, 'Task added successfully');
        console.log('✅ Add task test passed');

        // 2. Get all tasks
        const getResponse = await makeRequest('/tasks', 'GET');
        assert.strictEqual(getResponse.status, 200);
        assert.strictEqual(getResponse.body.length, 1);
        assert.strictEqual(getResponse.body[0].task, 'Learn Node.js');
        console.log('✅ Get tasks test passed');

        // 3. Delete the task
        const taskId = getResponse.body[0].id;
        const deleteResponse = await makeRequest(`/tasks/${taskId}`, 'DELETE');
        assert.strictEqual(deleteResponse.status, 200);
        assert.strictEqual(deleteResponse.body.message, 'Task deleted successfully');
        console.log('✅ Delete task test passed');

        // 4. Ensure task list is empty
        const emptyResponse = await makeRequest('/tasks', 'GET');
        assert.strictEqual(emptyResponse.body.length, 0);
        console.log('✅ Empty task list test passed');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    } finally {
        server.close(); // Stop the server after testing
    }
})();
