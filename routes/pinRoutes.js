const express = require("express");
const router = express.Router();

// Rough sketch of routes, subject to change (Possibly)
// All SQL has been tested via psql and they work,
// routes might not work because they haven't been tested
module.exports = (db) => {
  // GET all pins from DB
  router.get("/", (req, res) => {
    const queryString = `
    SELECT *
    FROM pins;`;
    db.query(queryString)
      .then((data) => {
        const pins = data.rows;
        res.json(pins);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET all pins for user
  router.get("/:id", (req, res) => {
    const user_id = req.params.id;
    const queryString = `
    SELECT *
    FROM pins
    WHERE id = $1;`;
    db.query(queryString, [user_id])
      .then((data) => {
        const pins = data.rows;
        res.json(pins);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  // POST add pin
  router.post("/", (req, res) => {
    const {
      owner_id,
      title,
      description,
      latitude,
      longitude,
      image_url,
      map_id,
    } = req.body;
    const queryString = `
    INSERT INTO pins (
      owner_id, title, descripion, latitude, longitude, image_url, map_id)
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING id;`;
    db.query(queryString, [
      owner_id,
      title,
      description,
      latitude,
      longitude,
      image_url,
      map_id,
    ])
      .then((data) => {
        const pins = data.rows;
        res.json(pins);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  // PATCH edit pin
  router.patch("/:id", (req, res) => {
    const user_ids = req.params.id;
    const { user_id, title, description, latitude, longitude, image } =
      req.body;
    const queryString = `
    UPDATE pins
    SET title = $1,
    description = $2,
    latitude = $3,
    longitude = $4,
    image = $5
    WHERE map_id = $6
    RETURNING *;`;
    db.query(queryString, [
      title,
      description,
      latitude,
      longitude,
      image,
      user_ids,
    ])
      .then((data) => {
        const pins = data.rows;
        res.json(pins);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // POST delete pin
  router.delete("/:id", (req, res) => {
    const user_id = req.params.id;
    const queryString = `
    DELETE FROM pins
    WHERE id = $1;`;
    db.query(queryString, [user_id])
      .then((data) => {
        res.json(user_id);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
