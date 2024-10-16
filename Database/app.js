require('dotenv').config();
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Setup database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,  // Environment variable for DB host
    user: process.env.DB_USER,  // Environment variable for DB user
    password: process.env.DB_PASSWORD, // Environment variable for DB password
    database: process.env.DB_NAME  // Environment variable for DB name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database: ' + err.stack);
        return;
    }
    console.log('Connected to database successfully!');
});

// Middleware for logging requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} request for ${req.url}`);
    next();
});

// Function to add state information
function addState(stateName, capital, population, callback) {
    const post = { state_name: stateName, capital: capital, population: population };
    const sql = 'INSERT INTO state_info SET ?';
    db.query(sql, post, (err, result) => {
        if (err) {
            return callback(err);
        }
        callback(null, result.insertId);
    });
}

// Data validation function
function validateStateData(stateName, capital, population) {
    return stateName && capital && population;
}

// Endpoint to add a state
app.post('/add-state', (req, res) => {
    const { stateName, capital, population } = req.body;
    if (!validateStateData(stateName, capital, population)) {
        return res.status(400).send('Missing data. Please provide state name, capital, and population.');
    }
    addState(stateName, capital, population, (err, result) => {
        if (err) {
            res.status(500).send('Error adding state: ' + err.message);
        } else {
            res.send('State added successfully with ID: ' + result);
        }
    });
});

// Endpoint to update a state
app.put('/update-state/:id', (req, res) => {
    const { stateName, capital, population } = req.body;
    const sql = `UPDATE state_info SET state_name = ?, capital = ?, population = ? WHERE id = ?`;
    db.query(sql, [stateName, capital, population, req.params.id], (err, result) => {
        if (err) {
            res.status(500).send('Error updating state: ' + err.message);
        } else {
            res.send('State updated successfully');
        }
    });
});

// Endpoint to delete a state
app.delete('/delete-state/:id', (req, res) => {
    const sql = 'DELETE FROM state_info WHERE id = ?';
    db.query(sql, [req.params.id], (err, result) => {
        if (err) {
            res.status(500).send('Error deleting state: ' + err.message);
        } else {
            res.send('State deleted successfully');
        }
    });
});

// Endpoint to retrieve all states
app.get('/states', (req, res) => {
    const sql = 'SELECT * FROM state_info';
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).send('Error fetching states: ' + err.message);
        } else {
            res.json(results);
        }
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
