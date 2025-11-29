const express = require('express');
const path = require('path');
const app = express();
 
app.use(express.json());
const port = process.env.PORT || 3000;

// Global request logger
app.use(function(req, res, next) {
    console.log("Request IP: " + req.url);
    console.log("Request date: " + new Date());
    next();
});

// CORS middleware 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allows any domain
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE');
    res.setHeader('Access-Control-Allow-Headers', "Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});


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
 


// Collection parameter middleware
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next();
});
 
//  GET all lessons (for loading initial data)
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e);
        res.send(results);
    });
});

//  POST new order
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insertOne(req.body, (e, result) => {
        if (e) return next(e);
        res.json({
            success: true,
            insertedId: result.insertedId,
            document: req.body
        });
    });
});

//  GET single document by ID
app.get('/collection/:collectionName/:id', (req, res, next) => { 
    req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => { 
        if (e) return next(e);
        res.send(result);
    }); 
});

//  UPDATE product
app.put('/collection/:collectionName/:id', (req, res, next) => { 
    req.collection.updateOne( 
        {_id: new ObjectID(req.params.id)}, 
        {$set: req.body}, 
        (e, result) => { 
            if (e) return next(e);
            res.json({
                success: result.modifiedCount === 1,
                msg: result.modifiedCount === 1 ? 'success' : 'error'
            });
        }
    ); 
});

//  DELETE document
app.delete('/collection/:collectionName/:id', (req, res, next) => { 
    req.collection.deleteOne( 
        {_id: new ObjectID(req.params.id)}, 
        (e, result) => { 
            if (e) return next(e);
            res.json({
                success: result.deletedCount === 1,
                msg: result.deletedCount === 1 ? 'success' : 'error'
            });
        }
    ); 
});

//  Search lessons endpoint
app.get('/search/:collectionName', (req, res, next) => {
    const searchQuery = req.query.q;
    req.collection = db.collection(req.params.collectionName);
    
    req.collection.find({
        $or: [
            { subject: { $regex: searchQuery, $options: 'i' } },
            { location: { $regex: searchQuery, $options: 'i' } }
        ]
    }).toArray((e, results) => {
        if (e) return next(e);
        res.send(results);
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});
 
app.listen(port, () => {
    console.log(`Express.js API server running at localhost:${port}`);
    console.log(`Frontend should connect to this API URL`);
});