DROP TABLE IF EXISTS maps_pins CASCADE;

CREATE TABLE maps_pins (
  id SERIAL PRIMARY KEY NOT NULL,
  map_id INTEGER REFERENCES maps(id) ON DELETE CASCADE,
  pin_id INTEGER REFERENCES pins(id) ON DELETE CASCADE
);
