require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'FieldSetu Backend is running' });
});

// Mock endpoint for tasks (Supervisor View)
app.get('/api/tasks', (req, res) => {
  res.json({
    tasks: [
      { id: 104, type: 'Road Repair - Near Ganpati Mandir', location: 'Shivaji Nagar', workers: 5, status: '75%', lastUpdated: '15.09.22 10:09 AM' },
      { id: 106, type: 'Road Repair - Cleaning', location: 'Shivaji Nagar', workers: 3, status: '75%', lastUpdated: '15.09.22 10:09 AM' },
      { id: 108, type: 'Road Repair, Vishrambag', location: 'Vishrambag', workers: 3, status: '75%', lastUpdated: '15.09.22 10:09 AM' },
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
