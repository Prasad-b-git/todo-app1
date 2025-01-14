const assert = require('assert');
const http = require('http');
const app = require('../server');
const BASE_URL = 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path,
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        const req = http.request(options, res => {
            let body = '';
            res.on('data', chunk => body += chunk);
            res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

// Clear tasks before running tests
async function clearTasks() {
    try {
        await makeRequest('/tasks', 'DELETE');
    } catch (err) {
        console.error('Failed to clear tasks:', err);
    }
}

// Run tests sequentially
async function runTests() {
    try {
        // Clear tasks before starting
        await clearTasks();

        // Test 1: Fetch empty task list
        const getResponse = await makeRequest('/tasks');
        assert.strictEqual(getResponse.statusCode, 200);
        assert.deepStrictEqual(getResponse.body, []);
        console.log('✅ GET /tasks - Passed');

        // Test 2: Add a new task
        const postResponse = await makeRequest('/tasks', 'POST', { task: 'Test Task' });
        assert.strictEqual(postResponse.statusCode, 201);
        assert.strictEqual(postResponse.body.message, 'Task added successfully');
        console.log('✅ POST /tasks - Passed');

        // Test 3: Verify task was added
        const getAfterPost = await makeRequest('/tasks');
        assert.strictEqual(getAfterPost.statusCode, 200);
        assert.strictEqual(getAfterPost.body.length, 1);
        assert.strictEqual(getAfterPost.body[0].task, 'Test Task');
        console.log('✅ GET /tasks after POST - Passed');

        console.log('\nAll tests passed! 🎉');
    } catch (err) {
        console.error('❌ Test failed:', err);
        process.exit(1);
    } finally {
        // Cleanup
        await clearTasks();
        process.exit(0);
    }
}

// Run the tests
runTests();
