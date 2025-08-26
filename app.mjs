import express from 'express'
import path from 'path';

const app = express()

const port = process.env.PORT || 3000;
const path = require('path')

app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => {
  res.send('Hello Express. <a href="jacob"</a>')
})

app.get('/jacob', (req, res) => {
  res.send('jacob')
})
// endpoints... middlewares.... apis?
// send an html file

res.sendFile('jacob.html')

//app.listen(3000)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})

//TODO: refactor to use env port