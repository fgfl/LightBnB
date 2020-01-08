DELETE FROM users;
INSERT INTO users (name, email, password) VALUES
  ('me', 'me@memail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('you', 'you@memail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
  ('they', 'they@memail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

DELETE FROM properties;
INSERT INTO properties (
  owner_id,
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  street,
  city,
  province,
  country,
  post_code
)
VALUES
 (
   1,
  'Speed Lamp',
  'description',
  'https://si.wsj.net/public/resources/images/B3-DL983_RIGHTS_M_20190319150811.jpg',
  'https://www.vancouver-builders.ca/wp-content/uploads/2019/08/extra1.jpg',
  1200,
  3,
  7,
  9,
  '1234 Good Street',
  'Good City',
  'Good',
  'Bad Country',
  'no post pls'
 ),
 (
   2,
  'Blank Corner',
  'description',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTXvJhynd8vp9dPLxeu6ZZdrtx4YXSru-bcN2C5FM_mJ0F5hhwy&s',
  'https://cdn.aarp.net/content/dam/aarp/home-and-family/your-home/2018/06/1140-house-inheriting.imgcache.rev68c065601779c5d76b913cf9ec3a977e.jpg',
  900,
  3,
  7,
  9,
  '1234 Church Street',
  'Bell City',
  'Belle',
  'French Country',
  'I dont post'
 ),
 (
   3,
  'Habit mix',
  'description',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmO69cYX99DG31B8l06oOHkkIKylT-VtHNO4-i5DDc9O3G_76V&s',
  'https://imagesvc.meredithcorp.io/v3/mm/image?url=https%3A%2F%2Fstatic.onecms.io%2Fwp-content%2Fuploads%2Fsites%2F37%2F2016%2F02%2F15230656%2Fwhite-modern-house-curved-patio-archway-c0a4a3b3.jpg&q=85',
  800,
  1,
  3,
  6,
  '1234 Chump Ave',
  'Bucket City',
  'Bottom',
  'Sponge World',
  'j4j4j4'
 );

DELETE FROM reservations;
INSERT INTO reservations (property_id, guest_id, start_date, end_date) VALUES
  (
    1,
    1,
    '2018-09-11',
    '2018-09-21'
  ),
  (
    2,
    2,
    '2018-08-11',
    '2018-11-21'
  ),
  (
    3,
    3,
    '2020-02-02',
    '2020-06-17'
  );

DELETE FROM property_reviews;
INSERT INTO property_reviews (guest_id, reservation_id, property_id, rating, message) VALUES
  (
    1,
    1,
    1,
    1,
    'message'
  ),
  (
    2,
    2,
    2,
    2,
    'message'
  ),
  (
    3,
    3,
    3,
    3,
    'message'
  );