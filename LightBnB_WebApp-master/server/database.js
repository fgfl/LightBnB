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
  const queryParms = [email];

  return (
    pool
      .query(getUserQuery, queryParms)
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
  const queryParms = [id];

  return (
    pool
      .query(getUserQuery, queryParms)
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
  const queryParams = [user.name, user.email, user.password];

  return (
    pool
      .query(addUserQuery, queryParams)
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
  const queryParms = [guest_id, limit]

  return (
    pool
      .query(allReservationQuery, queryParms)
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
  const queryParams = [];
  let allPropQuery =`
    SELECT
          properties.*
        , AVG(property_reviews.rating) AS average_rating
      FROM properties 
        LEFT JOIN property_reviews ON property_reviews.property_id = properties.id
  `;

  // WHERE Filters
  // We will replace the first AND with a WHERE after instead of replacing the WHEREs with AND,
  // , then replace the first AND with WHERE
  let whereFilters = '';

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    whereFilters += `AND city LIKE $${queryParams.length} `;
  }

  // Owner ID is never passed in per the client code
  if (options.owner_id) {
    queryParams.push(Number(options.owner_id));
    whereFilters += `AND owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(Number(options.minimum_price_per_night));
    whereFilters += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(Number(options.maximum_price_per_night));
    whereFilters += `AND cost_per_night <= $${queryParams.length} `;
  }

  whereFilters = whereFilters.replace(/AND/, 'WHERE')


  allPropQuery += `${whereFilters} GROUP BY properties.id `;

  // HAVING Filter
  if (options.minimum_rating) {
    queryParams.push(Number(options.minimum_rating));
    allPropQuery += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  allPropQuery += `
    ORDER BY cost_per_night ASC
    LIMIT $${queryParams.length};
  `;

  return (
    pool.query(allPropQuery, queryParams)
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
  const addPropQuery = `
    INSERT INTO properties (
      owner_id,
      title,
      description,
      thumbnail_photo_url,
      cover_photo_url,
      cost_per_night,
      street,
      city,
      province,
      post_code,
      country,
      parking_spaces,
      number_of_bathrooms,
      number_of_bedrooms
    )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *;
  `;
  const queryParms = [
    property.owner_id,
    property.title,
    property.description,
    property.thumbnail_photo_url,
    property.cover_photo_url,
    property.cost_per_night,
    property.street,
    property.city,
    property.province,
    property.post_code,
    property.country,
    property.parking_spaces,
    property.number_of_bathrooms,
    property.number_of_bedrooms
  ];

  return (
    pool
      .query(addPropQuery, queryParms)
      .then((res) => res.rows)
  );
}
exports.addProperty = addProperty;
