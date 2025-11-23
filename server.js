const express = require('express');
const path = require('path');
const app = express();
 
app.use(express.json());
const port = process.env.PORT || 3000;

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