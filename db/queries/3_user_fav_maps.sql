SELECT * FROM fav_maps
    JOIN maps ON maps.id = map_id
    JOIN users ON users.id = users.id
    WHERE user_id = 1;
