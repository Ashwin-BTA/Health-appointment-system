const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Patients Routes
app.post('/patients', (req, res) => {
  const { name, surname, email, phone, username, password } = req.body;
  // Insert patient into the database
});

app.get('/patients/:id', (req, res) => {
  // Get patient details from the database
});

app.put('/patients/:id', (req, res) => {
  // Update patient information in the database
});

app.delete('/patients/:id', (req, res) => {
  // Delete patient from the database
});

// Appointments Routes
app.post('/appointments', (req, res) => {
  const { patient_id, date, time } = req.body;
  // Insert appointment into the database
});

app.put('/appointments/:id', (req, res) => {
  // Edit appointment in the database
});

app.delete('/appointments/:id', (req, res) => {
  // Cancel appointment in the database
});

// Providers Routes
app.post('/providers', (req, res) => {
  const { name, surname, speciality, availability } = req.body;
  // Insert provider into the database
});

// Add more routes for providers, approved appointments, and receptionists as needed

// Sign In Route
app.post('/sign-in', (req, res) => {
  const { username, password } = req.body;
  // Validate user and log in
});