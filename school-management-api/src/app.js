require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const { initializeDatabase } = require('./config/db');
const schoolRoutes = require('./routes/schoolRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

/* ── Global Middleware ──────────────────────────────────── */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ── Health Check ───────────────────────────────────────── */
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'School Management API is running 🏫',
    version: '1.0.0',
    endpoints: {
      addSchool:   { method: 'POST', path: '/addSchool' },
      listSchools: { method: 'GET',  path: '/listSchools?latitude=<lat>&longitude=<lng>' },
    },
  });
});

/* ── API Routes ─────────────────────────────────────────── */
app.use('/', schoolRoutes);

/* ── 404 Handler ────────────────────────────────────────── */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found.`,
  });
});

/* ── Global Error Handler ───────────────────────────────── */
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred.',
  });
});

/* ── Boot ───────────────────────────────────────────────── */
(async () => {
  try {
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`🚀  Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err.message);
    process.exit(1);
  }
})();

module.exports = app; // exported for testing
