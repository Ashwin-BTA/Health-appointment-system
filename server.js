const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true }));
app.use(cors());


//app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.use(express.static(path.join(__dirname)));


// Connect to SQLite database
const db = new sqlite3.Database('healthcare_appointment_system.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the healthcare_appointment_system database.');
    }
});


// Route for the homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Group Project', 'index.html'));
});


// Fetch data from the database

// PROVIDERS TABLE
const getProviders = (req, res) => {
    
    const sql = `SELECT * FROM providers`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(400).json({ error: err.message });
        }
        res.json(rows); // Send back the providers data
    });
};

app.get('/api/providers', getProviders);

//APPROVED APPOINTMENT TABLE GET FUNCTION

const getApprovedAppointments = (req, res) => {
    const email = req.query.email;

    // SQL query to select appointments based on the provided email
    const sql = `SELECT * FROM approved_appointments WHERE email = ?`;

    db.all(sql, [email], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows); // Send back the approved appointments data
    });
};

app.get('/api/approved_appointments/fetch', getApprovedAppointments);


const getAppointments = (req, res) => {
    db.all('SELECT * FROM appointments', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
};

const getAApprovedAppointments = (req, res) => {
    db.all('SELECT * FROM approved_appointments', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
};

const getCancelledAppointments = (req, res) => {
    db.all('SELECT * FROM Cancelled_appointments', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
};

const getPatients = (req, res) => {
    db.all('SELECT * FROM patients', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
};

const getStaff = (req, res) => {
    db.all('SELECT * FROM staff', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
};
const getCancelledAAppointments = (req, res) => {
    db.all('SELECT * FROM Cancelled_appointments', [], (err, rows) => {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
};

// Define the routes
app.get('/api/appointments', getAppointments);
app.get('/api/approved_appointments', getAApprovedAppointments);
app.get('/api/cancelled-appointments', getCancelledAppointments);
app.get('/api/patients', getPatients);
app.get('/api/staff', getStaff);
app.get('/api/cancelled_appointments', getCancelledAAppointments);

const deleteProvider = (req, res) => {
    const providerId = req.params.id;

    db.run('DELETE FROM providers WHERE id = ?', [providerId], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Provider not found' });
        }
        res.json({ message: 'Provider deleted successfully.' });
    });
};

const patientsProvider = (req, res) => {
    const patientId = req.params.id;

    db.run('DELETE FROM patients WHERE id = ?', [patientsId], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Patients not found' });
        }
        res.json({ message: 'Patients deleted successfully.' });
    });
};

const staffProvider = (req, res) => {
    const staffId = req.params.id;

    db.run('DELETE FROM staff WHERE id = ?', [staffId], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'staff not found' });
        }
        res.json({ message: 'staff deleted successfully.' });
    });
};

const appointmentProvider = (req, res) => {
    const appointmentsId = req.params.id;

    db.run('DELETE FROM appointments WHERE id = ?', [appointmentsId], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'appointments not found' });
        }
        res.json({ message: 'appointments deleted successfully.' });
    });
};
const approvedProvider = (req, res) => {
    const approved_appointmentsId = req.params.id;

    db.run('DELETE FROM approved_appointments WHERE id = ?', [approved_appointmentsId], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'approved_appointments not found' });
        }
        res.json({ message: 'approved_appointments deleted successfully.' });
    });
};

app.delete('/api/providers/:id', deleteProvider);
app.delete('/api/patients/:id', patientsProvider);
app.delete('/api/staff/:id', staffProvider);
app.delete('/api/appointments/:id', appointmentProvider);
app.delete('/api/approved_appointments/:id', approvedProvider);
//ENDPOINTS FOR POSTING DATA


// Patient login 
const loginPatient = (req, res) => {
    const { Email, Password } = req.body;
    db.get('SELECT * FROM patients WHERE email = ?', [Email], (err, row) => {
        if (err) return res.status(500).send('Error querying the database.');
        if (!row) return res.status(401).send('User not found. Please register your details.');

        bcrypt.compare(Password, row.password, (err, result) => {
            if (err || !result) return res.status(401).send('Incorrect password.');
            const { name, surname, email, phone } = row;
            res.json({ name, surname, email, phone });
        });
    });
};

//Register patient
const registerPatient = (req, res) => {
    const { Email, Password, Name, Surname, Phone } = req.body;
    db.get('SELECT * FROM patients WHERE email = ?', [Email], (err, row) => {
        if (err) return res.status(500).send('Error querying the database.');
        if (row) return res.status(409).send('Email already taken.');

        bcrypt.hash(Password, 10, (err, hash) => {
            if (err) return res.status(500).send('Error hashing password.');
            db.run('INSERT INTO patients (email, password, name, surname, phone) VALUES (?, ?, ?, ?, ?)', 
                [Email, hash, Name, Surname, Phone], function(err) {
                    if (err) return res.status(500).send('Error adding user to the database.');
                    res.status(201).send('User registered successfully.');
                });
        });
    });
};

// Staff login 
const loginstaff = (req, res) => {
    const { Email, Password } = req.body;
    db.get('SELECT * FROM staff WHERE email = ?', [Email], (err, row) => {
        if (err) return res.status(500).send('Error querying the database.');
        if (!row) return res.status(401).send('User not found. Please register your details.');

        bcrypt.compare(Password, row.password, (err, result) => {
            if (err || !result) return res.status(401).send('Incorrect password.');
            res.redirect('/staffupdate.html');
        });
    });
};
//staff register
const addstaff = (req, res) => {
    const { Email, Password, Name, Surname } = req.body;
    db.get('SELECT * FROM staff WHERE email = ?', [Email], (err, row) => {
        if (err) return res.status(500).send('Error querying the database.');
        if (row) return res.status(409).send('Email already taken.');

        bcrypt.hash(Password, 10, (err, hash) => {
            if (err) return res.status(500).send('Error hashing password.');
            db.run('INSERT INTO staff (email, password, name, surname) VALUES (?, ?, ?, ?)', 
                [Email, hash, Name, Surname], function(err) {
                    if (err) return res.status(500).send('Error adding user to the database.');
                    res.status(201).send('User registered successfully.');
                });
        });
    });
};

//Create an appointment
const CreateAppointment = (req, res) => {
    const { name, surname, email, date } = req.body;
    const sql = `INSERT INTO appointments (name, surname, email, date) VALUES (?, ?, ?, ?)`;
    const params = [name, surname, email, date];

    db.run(sql, params, function(err) {
        if (err) {
            console.error('Error saving appointment:', err.message);
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, message: 'Appointment registered!' });
    });
};

// Doctor login 
const Doctorlogin = (req, res) => {
    const { Email, Password } = req.body;
    db.get('SELECT * FROM providers WHERE email = ?', [Email], (err, row) => {
        if (err) return res.status(500).send('Error querying the database.');
        if (!row) return res.status(401).send('User not found. Please register your details.');

        bcrypt.compare(Password, row.password, (err, result) => {
            if (err || !result) return res.status(401).send('Incorrect password.');
            res.redirect('/providerstable.html');
        });
    });
};
// Function to register a DOCTOR
const addprovider = (req, res) => {
    const { Email, Password, Name, Surname, Availability, Speciality } = req.body;
    db.get('SELECT * FROM providers WHERE email = ?', [Email], (err, row) => {
        if (err) return res.status(500).send('Error querying the database.');
        if (row) return res.status(409).send('Email already taken.');

        bcrypt.hash(Password, 10, (err, hash) => {
            if (err) return res.status(500).send('Error hashing password.');
            db.run('INSERT INTO providers (email, password, name, surname, availability , speciality) VALUES (?, ?, ?, ?, ?, ?)', 
                [Email, hash, Name, Surname, Availability , Speciality], function(err) {
                    if (err) return res.status(500).send('Error adding user to the database.');
                    res.status(201).send('User registered successfully.');
                });
        });
    });
};

// Endpoint to approve_appointment
const registerAppointment = (req, res) => {
    const { name, surname, email, date, time, doctor, status } = req.body;

    db.get('SELECT * FROM approved_appointments WHERE email = ? AND date = ? AND time = ?', [email, date, time], (err, row) => {
        if (err) {
            console.error('Error querying the database:', err);
            return res.status(500).send('Error querying the database.');
        }
        if (row) {
            return res.status(409).send('Appointment already exists at this time.');
        }

        db.run('INSERT INTO approved_appointments (first_name, last_name, email, date, time, assigned_doctor, status) VALUES (?, ?, ?, ?, ?, ?, ?)', 
            [name, surname, email, date, time, doctor, status], function(err) {
                if (err) {
                    console.error('Error adding appointment to the database:', err);
                    return res.status(500).send('Error adding appointment to the database.');
                }
                res.status(201).send('Appointment created successfully.');
            });
    });
};

app.post('/api/patients', loginPatient);
app.post('/api/patients/register', registerPatient);
app.post('/api/staff', loginstaff);
app.post('/api/staff/register', addstaff);
app.post('/api/appointments', CreateAppointment);
app.post('/api/providers', Doctorlogin);
app.post('/api/provider/register', addprovider);
app.post('/api/approved_appointments/register', registerAppointment);


//ENDPOINTS FOR EDITING DATA

// Update provider availability

const updateProviderAvailability = (req, res) => {
    const providerId = req.params.id;
    const { availability } = req.body;

    if (availability === undefined) {
        return res.status(400).json({ error: 'Availability is required.' });
    }

    db.run('UPDATE providers SET availability = ? WHERE id = ?', [availability, providerId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update availability' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Provider not found' });
        }
        res.json({ message: 'Availability updated successfully' });
    });
};

const updatePProviderAvailability = (req, res) => {
    const providerId = req.params.id;
    const { availability } = req.body;

    if (availability === undefined) {
        return res.status(400).json({ error: 'Availability is required.' });
    }

    db.run('UPDATE providers SET availability = ? WHERE id = ?', [availability, providerId], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Failed to update availability' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Provider not found' });
        }
        res.json({ message: 'Availability updated successfully' });
    });
};

app.put('/api/providers/:id/availability', updatePProviderAvailability);
app.put('/api/providers/:id/availability', updateProviderAvailability);



// Start the server

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
server.keepAliveTimeout = 120000; // 120 seconds
server.headersTimeout = 120000; // 120 seconds
