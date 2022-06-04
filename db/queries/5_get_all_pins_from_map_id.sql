`SELECT pins.*
    FROM map_pins
    JOIN pins ON pins.id = pin_id
    WHERE map_id = $1`;
