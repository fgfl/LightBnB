const properties = require('./json/properties.json');
const users = require('./json/users.json');

const {Pool} = require('pg');
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb',
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  const getUserQuery = `
    SELECT id, name, email, password
      FROM users
      WHERE email = $1;
  `;
  const value = [email];

  return (
    pool
      .query(getUserQuery, value)
      .then((res) => res.rows[0])
  );
}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  const getUserQuery = `
    SELECT id, name, email, password
      FROM users
      WHERE id = $1;
  `;
  const value = [id];

  return (
    pool
      .query(getUserQuery, value)
      .then((res) => res.rows[0])
  );
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const addUserQuery = `
    INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING id, name, email, password;
  `;
  const value = [user.name, user.email, user.password];

  return (
    pool
      .query(addUserQuery, value)
      .then((res) => res.rows[0])
  );

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  const allReservationQuery = `
    SELECT
          prps.*
          , res.*
          , AVG(rating) AS average_rating
      FROM reservations AS res
        JOIN properties AS prps ON res.property_id = prps.id
        JOIN property_reviews AS rvws ON prps.id = rvws.property_id
      WHERE end_date < now()::date
        AND res.guest_id = $1
      GROUP BY prps.id, res.id
      ORDER BY start_date DESC
      LIMIT $2;
  `;
  const values = [guest_id, limit]

  return (
    pool
      .query(allReservationQuery, values)
      .then((res) => res.rows)
  );
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  const allPropQuery =`
    SELECT *
      FROM properties
      LIMIT $1
  `;
  const paramValues = [limit];
  return (
    pool.query(allPropQuery, paramValues)
      .then((res) => res.rows)
  );
  
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
