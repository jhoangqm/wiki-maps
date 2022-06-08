SELECT users.id as user_id,
    username,
    password,
    users.latitude as user_lat,
    users.longitude as user_long,
    maps.id as map_id, owner_id,
    maps.name as map_name,
    maps.latitude as map_lat,
    maps.longitude as map_long
    FROM users
    JOIN maps ON owner_id = users.id
    WHERE owner_id = 1;
