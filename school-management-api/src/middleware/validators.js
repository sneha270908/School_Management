const { body, query, validationResult } = require('express-validator');

/* ── Shared helper ─────────────────────────────────────── */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

/* ── POST /addSchool ────────────────────────────────────── */
const validateAddSchool = [
  body('name')
    .trim()
    .notEmpty().withMessage('School name is required')
    .isLength({ min: 2, max: 255 }).withMessage('Name must be 2–255 characters'),

  body('address')
    .trim()
    .notEmpty().withMessage('Address is required')
    .isLength({ min: 5, max: 500 }).withMessage('Address must be 5–500 characters'),

  body('latitude')
    .notEmpty().withMessage('Latitude is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),

  body('longitude')
    .notEmpty().withMessage('Longitude is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),

  handleValidationErrors,
];

/* ── GET /listSchools ───────────────────────────────────── */
const validateListSchools = [
  query('latitude')
    .notEmpty().withMessage('Latitude query parameter is required')
    .isFloat({ min: -90, max: 90 }).withMessage('Latitude must be a number between -90 and 90'),

  query('longitude')
    .notEmpty().withMessage('Longitude query parameter is required')
    .isFloat({ min: -180, max: 180 }).withMessage('Longitude must be a number between -180 and 180'),

  handleValidationErrors,
];

module.exports = { validateAddSchool, validateListSchools };
