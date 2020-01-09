SELECT
      prps.*
      , res.*
      , AVG(rating) AS average_rating
  FROM reservations AS res
    JOIN properties AS prps ON res.property_id = prps.id
    JOIN property_reviews AS rvws ON prps.id = rvws.property_id
  WHERE end_date < now()::date
    AND res.guest_id = 1
  GROUP BY prps.id, res.id
  ORDER BY start_date DESC
  LIMIT 10