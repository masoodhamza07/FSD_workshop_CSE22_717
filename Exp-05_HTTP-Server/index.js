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

// Create the HTTP server
const server = http.createServer((req, res) => {
    // 1. Log request details to console
    const timestamp = new Date().toISOString();
    console.log(`\n==================== INCOMING REQUEST ====================`);
    console.log(`[${timestamp}] Method: ${req.method} | URL: ${req.url}`);
    console.log('Headers:');
    console.log(JSON.stringify(req.headers, null, 2));
    console.log(`==========================================================\n`);

    // Parse URL path (ignoring query parameters)
    const parsedUrl = new URL(req.url, `http://${req.headers.host || `${HOST}:${PORT}`}`);
    const pathname = parsedUrl.pathname;

    // 2. Handle Routes
    if (req.method === 'GET' && pathname === '/') {
        // Route: Root '/' -> Respond with 'Hello World'
        sendResponse(res, 200, 'text/plain; charset=utf-8', 'Hello World');

    } else if (req.method === 'GET' && pathname === '/about') {
        // Route: '/about' -> Return JSON with server info
        const serverInfo = {
            name: 'Basic HTTP Server',
            workshop: 'Full Stack Development Workshop-I',
            experiment: 'Experiment 5',
            status: 'running',
            nodeVersion: process.version,
            platform: process.platform,
            uptimeSeconds: Math.floor(process.uptime()),
            currentTime: new Date().toISOString()
        };
        sendResponse(res, 200, 'application/json; charset=utf-8', JSON.stringify(serverInfo, null, 2));

    } else if (req.method === 'GET' && pathname === '/headers') {
        // Route: '/headers' -> Return all received request headers as JSON
        const headersResponse = {
            message: 'Incoming HTTP Request Headers',
            clientIp: req.socket.remoteAddress,
            headers: req.headers
        };
        sendResponse(res, 200, 'application/json; charset=utf-8', JSON.stringify(headersResponse, null, 2));

    } else {
        // Route: Unknown route -> Return 404 Not Found
        const notFoundResponse = {
            error: 'Not Found',
            message: `The requested route '${pathname}' was not found on this server.`,
            statusCode: 404,
            availableRoutes: ['/', '/about', '/headers']
        };
        sendResponse(res, 404, 'application/json; charset=utf-8', JSON.stringify(notFoundResponse, null, 2));
    }
});

// Start listening for incoming requests
server.listen(PORT, HOST, () => {
    console.log(`====================================================`);
    console.log(`  EXPERIMENT 5: BASIC HTTP SERVER IS RUNNING`);
    console.log(`====================================================`);
    console.log(`Server URL: http://${HOST}:${PORT}`);
    console.log(`Endpoints:`);
    console.log(`  - GET http://${HOST}:${PORT}/        (Hello World)`);
    console.log(`  - GET http://${HOST}:${PORT}/about   (Server Details JSON)`);
    console.log(`  - GET http://${HOST}:${PORT}/headers (Request Headers JSON)`);
    console.log(`\nWaiting for requests... (Press Ctrl+C to stop)`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down HTTP server gracefully...');
    server.close(() => {
        console.log('HTTP server closed. Exiting process.');
        process.exit(0);
    });
});
