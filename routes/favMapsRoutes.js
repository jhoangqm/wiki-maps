const express = require("express");
const router = express.Router();

// Rough sketch of routes, subject to change (Possibly)
// All SQL has been tested via psql and they work,
// routes might not work because they haven't been tested
module.exports = (db) => {
  //GET fav maps from users
  router.get("/:id", (req, res) => {
    const user_id = req.params.id;
    const queryString = `
    SELECT maps.id, maps.name, users.username
    FROM fav_maps
    JOIN maps ON maps.id = map_id
    JOIN users ON users.id = owner_id
    WHERE user_id = $1;`;
    db.query(queryString, [user_id])
      .then((data) => {
        const favMaps = data.rows;
        res.json(favMaps);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  //POST add map to fav map
  router.post("/:map_id", (req, res) => {
    const { map_id, user_id } = req.body;
    const queryString = `
    INSERT INTO fav_maps (map_id, user_id)
    VALUES ($1, $2)
    RETURNING*`;
    db.query(queryString, [map_id, user_id])
      .then((data) => {
        const map = data.rows[0];
        res.json(map);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  //DELETE fav map
  router.delete("/:id", (req, res) => {
    const map_id = req.params.id;
    const queryString = `
    DELETE FROM fav_maps
    WHERE id = $1`;
    db.query(queryString, [map_id])
      .then((data) => {
        res.json(map_id);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
