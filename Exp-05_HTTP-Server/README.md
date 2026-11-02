# Experiment 5: Basic HTTP Server

## Aim
To create and run a basic HTTP web server in Node.js using the built-in `http` module, handle HTTP requests, inspect request metadata (method, URL, headers), serve appropriate HTTP response headers and status codes (200 OK and 404 Not Found), and route requests to return plain text and JSON data.

---

## Theory

### 1. The Node.js `http` Module
Node.js includes a built-in `http` module that allows data transfer over the HyperText Transfer Protocol (HTTP). It enables developers to create both HTTP servers and HTTP clients without needing external frameworks like Express.
```javascript
const http = require('http');
```

### 2. `http.createServer([options][, requestListener])`
The core method used to instantiate an HTTP server is `http.createServer()`. The `requestListener` callback function is automatically executed every time an HTTP request hits the server. It receives two primary arguments:
- **`req` (`http.IncomingMessage`)**: An object representing the incoming HTTP request. Contains details like HTTP method (`req.method`), requested URL (`req.url`), client request headers (`req.headers`), and incoming data stream.
- **`res` (`http.ServerResponse`)**: An object representing the server's HTTP response. It is used to write response headers (`res.writeHead()`, `res.setHeader()`), send body chunks (`res.write()`), and finalize the response transmission (`res.end()`).

### 3. HTTP Request & Response Anatomy
Every HTTP interaction consists of:
1. **Request**:
   - **Method**: E.g., `GET`, `POST`, `PUT`, `DELETE`.
   - **URL/Path**: The endpoint being requested (e.g., `/`, `/about`, `/headers`).
   - **Headers**: Metadata sent by the client (e.g., `User-Agent`, `Accept`, `Host`).
2. **Response**:
   - **Status Code**: 3-digit numerical indicator of request result (e.g., `200 OK`, `404 Not Found`).
   - **Response Headers**: Metadata sent by the server back to client (e.g., `Content-Type: application/json`, `Date`, custom headers like `X-Custom-Header`).
   - **Body**: The actual payload (HTML, plain text, JSON, etc.).

---

## Code

File: `index.js`

```javascript
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
```

---

## How to run

1. Navigate to the experiment directory:
   ```bash
   cd Exp-05_HTTP-Server
   ```

2. Start the HTTP server:
   ```bash
   node index.js
   ```
   Or:
   ```bash
   npm start
   ```

3. Open your browser or use `curl` to test the endpoints:
   - **Root Route**: Open [http://localhost:3000/](http://localhost:3000/) in your web browser, or run:
     ```bash
     curl -i http://localhost:3000/
     ```
   - **About Route**: Open [http://localhost:3000/about](http://localhost:3000/about), or run:
     ```bash
     curl -i http://localhost:3000/about
     ```
   - **Headers Route**: Open [http://localhost:3000/headers](http://localhost:3000/headers), or run:
     ```bash
     curl -i http://localhost:3000/headers
     ```
   - **404 Route**: Open [http://localhost:3000/invalid-path](http://localhost:3000/invalid-path), or run:
     ```bash
     curl -i http://localhost:3000/invalid-path
     ```

4. Press `Ctrl + C` in the terminal to gracefully stop the server.

---

## Expected Output

### 1. Terminal Console Output
When the server starts and receives requests:
```text
====================================================
  EXPERIMENT 5: BASIC HTTP SERVER IS RUNNING
====================================================
Server URL: http://localhost:3000
Endpoints:
  - GET http://localhost:3000/        (Hello World)
  - GET http://localhost:3000/about   (Server Details JSON)
  - GET http://localhost:3000/headers (Request Headers JSON)

Waiting for requests... (Press Ctrl+C to stop)

==================== INCOMING REQUEST ====================
[2026-09-11T11:50:00.000Z] Method: GET | URL: /
Headers:
{
  "host": "localhost:3000",
  "user-agent": "curl/8.7.1",
  "accept": "*/*"
}
==========================================================
```
