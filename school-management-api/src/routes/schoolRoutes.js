const express = require('express');
const router = express.Router();
const { addSchool, listSchools } = require('../controllers/schoolController');
const { validateAddSchool, validateListSchools } = require('../middleware/validators');

/**
 * @route  POST /addSchool
 * @desc   Add a new school
 * @access Public
 */
router.post('/addSchool', validateAddSchool, addSchool);

/**
 * @route  GET /listSchools
 * @desc   List all schools sorted by proximity
 * @access Public
 * @query  latitude {float}, longitude {float}
 */
router.get('/listSchools', validateListSchools, listSchools);

module.exports = router;
