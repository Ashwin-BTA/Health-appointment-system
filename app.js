const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Serve static files from 'public' directory
// app.use(express.static(path.join(__dirname, 'public')));

// Serve static files from the root directory (if index.html is in Group Project)
app.use(express.static(path.join(__dirname)));

// Connect to SQLite database
const db = new sqlite3.Database('healthcare_appointment_system.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the healthcare_appointment_system database.');
    }
});

app.get('/api/approved_appointments', (req, res) => {
    const sql = 'SELECT * FROM approved_appointments';

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});