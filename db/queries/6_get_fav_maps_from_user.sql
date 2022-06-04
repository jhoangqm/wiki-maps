SELECT maps.id, maps.name, users.username
    FROM favourited_maps
    JOIN maps ON maps.id = map_id
    JOIN users ON users.id = owner_id
    WHERE user_id = 1;
