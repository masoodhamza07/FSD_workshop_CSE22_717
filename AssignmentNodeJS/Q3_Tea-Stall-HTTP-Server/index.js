const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('Welcome to NodeJS!');
});

server.listen(PORT, () => {
  console.log(`Tea stall server running at http://localhost:${PORT}`);
});
