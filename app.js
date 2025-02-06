const express = require('express')
const path = require('path');

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  const filePath = path.join(__dirname, 'index.html');
  res.sendFile(filePath);
});
app.listen(port, () => console.log('Notre application est démarrée'))