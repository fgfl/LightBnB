DROP TABLE IF EXISTS property_reviews CASCADE;
DROP TABLE IF EXISTS reservations CASCADE;
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE properties (
  id SERIAL PRIMARY KEY NOT NULL,
  owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail_photo_url VARCHAR(255) NOT NULL,
  cover_photo_url  VARCHAR(255) NOT NULL,
  cost_per_night INTEGER NOT NULL DEFAULT 0, --redundant? cost/night is in rates table
  parking_spaces SMALLINT NOT NULL DEFAULT 0,
  number_of_bathrooms SMALLINT NOT NULL DEFAULT 0,
  number_of_bedrooms SMALLINT NOT NULL DEFAULT 0,

  street VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  province VARCHAR(255) NOT NULL,
  country VARCHAR(255) NOT NULL,
  post_code VARCHAR(50) NOT NULL,

  active BOOLEAN NOT NULL DEFAULT TRUE
);

-- In ERD but not used in sample data
-- CREATE TABLE rates (
--   id SERIAL PRIMARY KEY NOT NULL,
--   property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

--   start_date DATE NOT NULL,
--   end_date DATE NOT NULL,
--   cost_per_night INTEGER NOT NULL DEFAULT 0
-- );

CREATE TABLE reservations (
  id SERIAL PRIMARY KEY,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  start_date DATE NOT NULL,
  end_date DATE NOT NULL
);

-- In ERD but not used in sample data
-- CREATE TABLE guest_reviews (
--   id SERIAL PRIMARY KEY NOT NULL,
--   guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,

--   rating SMALLINT NOT NULL DEFAULT 0,
--   message TEXT
-- );

CREATE TABLE property_reviews (
  id SERIAL PRIMARY KEY NOT NULL,
  guest_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reservation_id INTEGER NOT NULL REFERENCES reservations(id) ON DELETE CASCADE,
  property_id INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,

  rating SMALLINT NOT NULL DEFAULT 0,
  message TEXT
);