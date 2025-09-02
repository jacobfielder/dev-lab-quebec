import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
//import { dirname } from 'node:path';
//import { fileURLToPath } from 'node:url';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
//const path = require('path')


app.use(express.static(join(__dirname, 'public')))


app.get('/', (req, res) => {
  res.send('Hello Jacoby." <a href="jacob">jacob</a>')
})

app.get('/jacob', (req, res) => {
 
  res.sendFile(join(__dirname, 'public', 'jacob.html')) 

})

//res.sendFile(join(__dirname, 'public', 'jacob.html'))
// endpoints... middlewares.... apis?
// send an html file

app.get('/api/jacob', (req, res) => {
  // res.send('barry. <a href="/">home</a>')
  const myVar = 'Hello from server!';
  res.json({ myVar });
})

app.listen(3000)

//app.listen(PORT, () => {
 // console.log(`Example app listening on port ${PORT}`)
//})

//TODO: refactor to use env port