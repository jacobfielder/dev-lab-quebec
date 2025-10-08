import 'dotenv/config'
import express from 'express'
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';
import axios from 'axios';

const app = express()
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PORT = process.env.PORT || 3000;
//const path = require('path')

const uri = process.env.MONGO_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Connect to MongoDB and keep connection open
let db;

async function connectDB() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
    db = client.db("pokemon_teams");
  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

connectDB();

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, 'public')))


app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'pokemon-teams.html'))
})


// Simple helper function to fetch random Pokemon from PokeAPI
async function getRandomPokemon() {
  const randomId = Math.floor(Math.random() * 600) + 1; 
  const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const pokemon = response.data;
  
  return {
    id: pokemon.id,
    name: pokemon.name,
    sprite: pokemon.sprites.front_default,
    types: pokemon.types.map(type => type.type.name)
  };
}

// API endpoints

// GET all teams
app.get('/api/teams', async (req, res) => {
  const teams = await db.collection('teams').find({}).toArray();
  res.json(teams);
});

// POST create new team
app.post('/api/teams', async (req, res) => {
  const { name, pokemon } = req.body;
  
  const newTeam = {
    name,
    pokemon,
    createdAt: new Date()
  };

  const result = await db.collection('teams').insertOne(newTeam);
  const team = await db.collection('teams').findOne({ _id: result.insertedId });
  
  res.json(team);
});

// PUT update team
app.put('/api/teams/:id', async (req, res) => {
  const { name } = req.body;
  await db.collection('teams').updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { name } }
  );
  res.json({ message: 'Team updated' });
});

// DELETE team
app.delete('/api/teams/:id', async (req, res) => {
  await db.collection('teams').deleteOne({ _id: new ObjectId(req.params.id) });
  res.json({ message: 'Team deleted' });
});

// POST generate random team
app.post('/api/teams/generate', async (req, res) => {
  const pokemon = [];
  
  // Generate 6 random Pokemon
  for (let i = 0; i < 6; i++) {
    const randomPokemon = await getRandomPokemon();
    pokemon.push(randomPokemon);
  }
  
  res.json({ pokemon });
});

// test endpoint
app.get('/api/jacob', (req, res) => {
  // res.send('barry. <a href="/">home</a>')
  const myVar = 'Hello from server!';
  res.json({ myVar });
})

app.listen(PORT, () => {
  console.log(`Pokemon Team Generator listening on port ${PORT}`);
});