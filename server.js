const port = process.env.PORT || 3000
const express = require('express')
const db = require('./database.js');
const app = express();

app.get('/', (req, res) => {
    res.send('Hello World! 2.0')
  })
  
  app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })
  
  