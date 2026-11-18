# Q3 - Tea Stall HTTP Server

## Aim
Create a simple tea stall HTTP server with the Node.js `http` module that responds with the message `Welcome to NodeJS!` and HTTP status code `200`.

## How to Run

```bash
cd Q3_Tea-Stall-HTTP-Server
node index.js
```

Then open `http://localhost:3000` in a browser. Set the `PORT` environment variable to use another port.

## Code Overview

- `http.createServer()` handles every incoming request with the same response.
- `res.writeHead(200, ...)` sends status code `200` with a plain-text content type.
- `res.end('Welcome to NodeJS!')` sends the required message.

## Sample Output

Terminal:

```text
Tea stall server running at http://localhost:3000
[2026-11-18T10:00:00.000Z] GET /
```

Browser response with status `200`:

```text
Welcome to NodeJS!
```
