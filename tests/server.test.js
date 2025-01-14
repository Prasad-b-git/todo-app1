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

// Test: Fetch empty task list
makeRequest('/tasks').then(response => {
    assert.strictEqual(response.statusCode, 200);
    assert.deepStrictEqual(response.body, []);
    console.log('✅ GET /tasks - Passed');
}).catch(err => console.error('❌ GET /tasks - Failed', err));

// Test: Add a new task
makeRequest('/tasks', 'POST', { task: 'Test Task' }).then(response => {
    assert.strictEqual(response.statusCode, 201);
    assert.strictEqual(response.body.message, 'Task added successfully');
    console.log('✅ POST /tasks - Passed');
}).catch(err => console.error('❌ POST /tasks - Failed', err));
