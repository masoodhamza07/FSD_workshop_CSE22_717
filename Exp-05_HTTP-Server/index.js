/**
 * Experiment 5: Basic HTTP Server using Node.js 'http' Module
 * 
 * Demonstrates:
 * 1. Creating an HTTP server with http.createServer()
 * 2. Listening on port 3000
 * 3. Inspecting IncomingMessage (req) object: method, url, headers
 * 4. Constructing ServerResponse (res) object: status code, custom headers, Date, body
 * 5. Routing:
 *    - GET /        -> Returns 'Hello World' (text/plain, status 200)
 *    - GET /about   -> Returns server details JSON (application/json, status 200)
 *    - GET /headers -> Returns request headers JSON (application/json, status 200)
 *    - Unknown URLs -> Returns 404 Not Found
 * 6. Console request logging
 */

const http = require('http');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

// Helper function to send standard responses with required headers
function sendResponse(res, statusCode, contentType, body) {
    res.writeHead(statusCode, {
        'Content-Type': contentType,
        'X-Custom-Header': 'FSD-Workshop-HTTP-Server-v1.0',
        'Date': new Date().toUTCString(),
        'X-Powered-By': 'Node.js'
    });
    res.end(body);
}
