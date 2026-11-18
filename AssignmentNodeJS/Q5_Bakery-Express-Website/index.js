const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const viewsDir = path.join(__dirname, 'views');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(viewsDir, 'home.html'));
});

app.get('/menu', (req, res) => {
  res.sendFile(path.join(viewsDir, 'menu.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(viewsDir, 'contact.html'));
});

app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1><p><a href="/">Back to home</a></p>');
});

app.listen(PORT, () => {
  console.log(`Bakery website running at http://localhost:${PORT}`);
});
