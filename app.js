// Import required modules
require('dotenv').config();
const express = require('express');
const { body, validationResult } = require('express-validator');
const {
  isValidEmail,
  isValidMobileNumber,
  isValidPincode,
  isValidBirthdate
} = require('../rest-api/controllers/queryValidators');
const { Pool } = require('pg');

// Create a PostgreSQL pool
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

// Create an Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Query to GET the details of the person
app.get('/users', async (req, res) => {
  try {
    const searchString = req.query.searchString; // used for searching first_name, last_name and email
    const ageMin = req.query.ageMin;
    const ageMax = req.query.ageMax;
    const city = req.query.city;

    let whereClause = 'WHERE 1 = 1';

    if (searchString) {
      whereClause += ` AND (LOWER(first_name) LIKE LOWER('%${searchString}%') OR LOWER(last_name) LIKE LOWER('%${searchString}%') OR LOWER(email) LIKE LOWER('%${searchString}%'))`;
    }

    if (ageMin) {
      whereClause += ` AND birth_date <= NOW() - INTERVAL '${ageMin} years'`;
    }

    if (ageMax) {
      whereClause += ` AND birth_date >= NOW() - INTERVAL '${ageMax} years'`;
    }

    if (city) {
      whereClause += ` AND LOWER(city) = LOWER('${city}')`;
    }

    const query = `SELECT * FROM person p
                  JOIN address a ON p.id = a.person_id
                  ${whereClause}`;

    const { rows } = await pool.query(query);
    res.send(rows);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// POST /users
app.post('/users', (req, res) => {
  const { firstName, lastName, email, mobileNumber, birthdate, addresses } = req.body;

  // Validate input data
  if (!firstName || !lastName || !email || !mobileNumber || !addresses || addresses.length === 0) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  // Validate birth date
  if (!isValidBirthdate(birthdate)) {
    return res.status(400).json({ message: 'Invalid birth date' });
  }

  // Validate email format
  if (!isValidEmail(email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  // Validate mobile number format
  if (!isValidMobileNumber(mobileNumber)) {
    return res.status(400).json({ message: 'Invalid mobile number' });
  }

  // Validate addresses data
  for (const address of addresses) {
    const { addressLine1, pincode, city, state, type } = address;

    if (!addressLine1 || !pincode || !city || !state || !type) {
      return res.status(400).json({ message: 'Invalid address data' });
    }

    if (!isValidPincode(pincode)) {
      return res.status(400).json({ message: 'Invalid pincode' });
    }
  }

  // Insert user data into database
  const sql =
    'INSERT INTO person (first_name, last_name, email, mobile_number, birth_date) VALUES ($1, $2, $3, $4, $5) RETURNING *;';
  const values = [firstName, lastName, email, mobileNumber, birthdate];

  pool.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
    const userId = result.rows[0].id;

    // Insert addresses data into database
    const addressValues = addresses.map((address) => [
      userId,
      address.addressLine1,
      address.addressLine2,
      address.pincode,
      address.city,
      address.state,
      address.type
    ]);
    const addressSql = `INSERT INTO address (person_id, address_line_1, address_line_2, pincode, city, state, type) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
    addressValues.map((addressValue) => {
      pool.query(addressSql, addressValue, (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal server error' });
        }
        console.log('doneee!');
      });
    });
    return res.status(201).json({ message: 'User created successfully' });
  });
});

app.listen(3000, () => console.log('Server started on port 3000'));
