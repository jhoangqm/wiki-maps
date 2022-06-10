/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

// Rough sketch of routes, subject to change (Possibly)
// All SQL has been tested via psql and they work,
// routes might not work because they haven't been tested

module.exports = (db) => {
  // GET all maps from DB
  router.get("/", (req, res) => {
    const user_id = req.session.user_id;
    const queryString = `SELECT * FROM maps WHERE owner_id = $1;`;

    db.query(queryString, [user_id])
      .then((data) => {
        const maps = data.rows;
        res.json(maps);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //GET all maps from specific id
  router.get("/:id", (req, res) => {
    const user_id = req.params.id;
    const queryString = `SELECT * FROM maps WHERE maps.id = $1;`;

    db.query(queryString, [user_id])
      .then((data) => {
        const maps = data.rows;
        res.json(maps);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //GET fav maps
  router.get("/:id/fav_maps", (req, res) => {
    const user_id = req.params.id;
    const queryString = `SELECT * FROM favourited_maps
    JOIN maps ON maps.id = map_id
    JOIN users ON users.id = users.id
    WHERE user_id = $1;`;
    db.query(queryString, [user_id])
      .then((data) => {
        const favorites = data.rows;
        res.json(favorites);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST add map
  router.post("/", (req, res) => {
    const { name } = req.body;
    const owner_id = req.session.user_id;
    const getCitiesQuery = `SELECT * FROM maps
    WHERE name = '${name}';`;
    db.query(getCitiesQuery)
      .then((data) => {
        const map = data.rows[0];
        const queryString = `INSERT INTO maps
    (owner_id, name, latitude, longitude)
    VALUES ($1, $2, $3, $4)
    RETURNING *;`;
        db.query(queryString, [
          owner_id,
          name,
          map.latitude,
          map.longitude,
        ]).then((data) => {
          const map = data.rows[0];
          res.json(map);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ error: err.message });
      });
  });

  //PATCH edit map
  router.patch("/:id", (req, res) => {
    const user_id = req.params.id;
    const { name, area, owner_id } = req.body;
    const queryString = `
    UPDATE maps SET name = $1, area = $2
    WHERE owner_id = $3
    AND maps_id = $4
    RETURNING *;`;
    db.query(queryString, [name, area, owner_id, user_id])
      .then((data) => {
        const maps = data.rows;
        res.json(maps);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  //POST delete map
  router.delete("/:id", (req, res) => {
    const user_id = req.params.id;
    const queryString = `DELETE FROM maps
    WHERE id = 1$`;
    db.query(queryString, [user_id])
      .then((data) => {
        res.json({ deleted: true });
      })
      .catch((err) => {
        res.status(500).json({ deleted: false, error: err });
      });
  });

  return router;
};
