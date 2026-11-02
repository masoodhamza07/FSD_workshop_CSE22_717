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
