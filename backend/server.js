const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Sem4DBSProject'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected');
});

app.get('/airport/:iataCode', (req, res) => {
    const iataCode = req.params.iataCode;
    const sql = `SELECT * FROM airport WHERE IATA = ?`;
    db.query(sql, [iataCode], (err, result) => {
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.post('/airport', (req, res) => {
    const { iataCode, location, name } = req.body;
    const sql = `INSERT INTO airport (IATA, city, Name) VALUES (?, ?, ?)`;
    db.query(sql, [iataCode, location, name], (err, result) => {
        if (err) {
            throw err;
        }
        res.send('Airport details added successfully');
    });
});

app.get('/company/:companyID', (req, res) => {
    const companyID = req.params.companyID;
    const sql = `SELECT * FROM company WHERE ID = ?`;
    db.query(sql, [companyID], (err, result) => {
        if (err) {
            throw err;
        }
        console.log(result);
        res.json(result);
    });
});

app.post('/company', (req, res) => {
    const { companyID, location, name } = req.body;
    const sql = `INSERT INTO company (ID, location, name) VALUES (?, ?, ?)`;
    db.query(sql, [companyID, location, name], (err, result) => {
        if (err) {
            console.error(err); 
            res.status(500).send('Error adding company details'); 
            return;
        }
        console.log('Company details added successfully');
        res.send('Company details added successfully');
    });
});

app.get('/runway/:iataCode', (req, res) => {
    const iataCode = req.params.iataCode;
    const sql = `SELECT count(*) as count FROM runway WHERE airport_id = ?`;
    db.query(sql, [iataCode], (err, result) => {
        console.log(result);
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.get('/lego/:iataCode', (req, res) => {
    const iataCode = req.params.iataCode;
    const sql = `SELECT * FROM leg WHERE source_id = ?`;
    db.query(sql, [iataCode], (err, result) => {
        console.log(result);
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

app.get('/legi/:iataCode', (req, res) => {
    const iataCode = req.params.iataCode;
    const sql = `SELECT * FROM leg WHERE destination_id = ?`;
    db.query(sql, [iataCode], (err, result) => {
        console.log(result);
        if (err) {
            throw err;
        }
        res.json(result);
    });
});

const PORT = 8081;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get('/test/:iataCode', (req, res) => {
    const iataCode = req.params.iataCode;
    const sql = `CALL find_runways(?)`;
    db.query(sql, [iataCode], (err, result) => {
        console.log(result);
        if (err) {
            throw err;
        }
        res.json(result);
    });
});
app.get('/fares/:flight_id/:departure_datetime', (req, res) => {
    const flight_id = req.params.flight_id;
    const departure_datetime = req.params.departure_datetime;
    const sql = 'CALL calculate_fare(?, ?)'; // Assuming leg_id is always 1
    db.query(sql, [flight_id, departure_datetime], (err, result) => {
        console.log(result)
        if (err) {
            console.error('Error executing stored procedure:', err);
            res.status(500).json({ error: 'An error occurred while fetching fares.' });
            return;
        }
        console.log('Fares result:', result);
        res.json(result);
    });
});

