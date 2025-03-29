const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const { MongoClient } = require('mongodb');

// MongoDB connection
const MONGO_URI = 'mongodb+srv://hilmy:YCXO8o9gCQGgge0t@healthcare.xdhqdhq.mongodb.net/?retryWrites=true&w=majority&appName=Healthcare';
const DATABASE_NAME = 'Healthcare';
let db;

// Create Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Initialize database
async function initializeDB() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DATABASE_NAME);
  console.log('Connected to MongoDB');
}

// API Endpoints
app.post('/api/treatments', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.patientName || !req.body.patientId || !req.body.treatmentDate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create new treatment record
    const newTreatment = {
      id: uuidv4(),
      patientName: req.body.patientName,
      patientId: req.body.patientId,
      treatmentDate: req.body.treatmentDate,
      treatmentDescription: req.body.treatmentDescription || [],
      prescribedMedication: req.body.prescribedMedication || [],
      treatmentCost: req.body.treatmentCost || 0,
      createdAt: new Date().toISOString()
    };

    // Save to MongoDB
    const treatmentsCollection = db.collection('treatments');
    await treatmentsCollection.insertOne(newTreatment);

    return res.status(201).json(newTreatment);
  } catch (error) {
    console.error('Error creating treatment:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
async function startServer() {
  await initializeDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();