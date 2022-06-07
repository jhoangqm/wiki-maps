SELECT users.id, maps.name as map_name, maps.latitude as map_lat,maps.longitude as map_long
FROM users
JOIN maps ON owner_id = users.id
WHERE owner_id = 1;
