const { pool } = require('../config/db');

/* ────────────────────────────────────────────────────────────
   Haversine formula – returns distance in kilometres
   between two lat/lng pairs.
──────────────────────────────────────────────────────────── */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ────────────────────────────────────────────────────────────
   POST /addSchool
──────────────────────────────────────────────────────────── */
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    // Duplicate name check (optional but good practice)
    const [existing] = await pool.query(
      'SELECT id FROM schools WHERE name = ? AND address = ?',
      [name.trim(), address.trim()]
    );
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A school with the same name and address already exists.',
      });
    }

    const [result] = await pool.query(
      'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)',
      [name.trim(), address.trim(), parseFloat(latitude), parseFloat(longitude)]
    );

    return res.status(201).json({
      success: true,
      message: 'School added successfully.',
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    });
  } catch (err) {
    console.error('addSchool error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}

/* ────────────────────────────────────────────────────────────
   GET /listSchools?latitude=<lat>&longitude=<lng>
──────────────────────────────────────────────────────────── */
async function listSchools(req, res) {
  try {
    const userLat = parseFloat(req.query.latitude);
    const userLng = parseFloat(req.query.longitude);

    const [schools] = await pool.query(
      'SELECT id, name, address, latitude, longitude, created_at FROM schools'
    );

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No schools found.',
        data: [],
      });
    }

    // Attach distance and sort ascending
    const sorted = schools
      .map((school) => ({
        ...school,
        distance_km: parseFloat(
          haversineDistance(userLat, userLng, school.latitude, school.longitude).toFixed(2)
        ),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      message: `${sorted.length} school(s) found, sorted by proximity.`,
      user_location: { latitude: userLat, longitude: userLng },
      data: sorted,
    });
  } catch (err) {
    console.error('listSchools error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again later.',
    });
  }
}

module.exports = { addSchool, listSchools };
