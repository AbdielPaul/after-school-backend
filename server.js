const express = require('express');
const path = require('path');
const app = express();
 
app.use(express.json());
const port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
 
let db;

MongoClient.connect('mongodb+srv://abdielpaul29_db_user:SNNNgZ4njPF3WqKS@cluster0.sypziud.mongodb.net/', (err, client) => { 
    if (err) {
        console.error('MongoDB connection error:', err);
        return;
    }
    db = client.db('webstore');
    console.log('Connected to MongoDB');
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'Webstore API is running',
        version: '1.0.0'
    });
});

app.listen(port, () => {
    console.log(`Express.js API server running at localhost:${port}`);
    
});