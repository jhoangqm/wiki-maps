const express = require("express");
const router = express.Router();

// Rough sketch of routes, subject to change (Possibly)
// All SQL has been tested via psql and they work,
// routes might not work because they haven't been tested
module.exports = (db) => {
  //GET pins from map in DB
  router.get("/:id", (req, res) => {
    const map_id = req.params.id;
    const queryString = `
    SELECT pins.*
    FROM maps_pins
    JOIN pins ON pins.id = pin_id
    WHERE map_id = $1;`;
    db.query(queryString, [map_id])
      .then((data) => {
        const map_pins = data.rows;
        res.json(map_pins);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  //POST add pins to map
  router.post("/:map_id", (req, res) => {
    const map_id = req.params.map_id;
    const pin_id = req.body;
    const queryString = `
    INSERT INTO maps_pins
    (map_id, pin_id)
    VALUES
    ($1, $2)
    RETURNING *;`;
    db.query(queryString, [map_id, pin_id])
      .then((data) => {
        const map_pins = data.rows;
        res.json(map_pins);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  //DELETE pins to map
  router.delete("/:pin_id/:map_id", (req, res) => {
    const { pin_id, map_id } = req.params;
    const queryString = `
    DELETE FROM maps_pins
    WHERE pin_id = $1
    AND map_id = $2;`;
    db.query(queryString, [pin_id, map_id])
      .then((data) => {
        res.json(map_id);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  });
  return router;
};
