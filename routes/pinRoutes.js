const express = require("express");
const router = express.Router();

// Rough sketch of routes, subject to change (Possibly)
// All SQL has been tested via psql and they work,
// routes might not work because they haven't been tested
module.exports = (db) => {
  // GET all pins from DB
  router.get("/:id", (req, res) => {
    const pin_id = req.params.id;
    const queryString = `
    SELECT *
    FROM pins;`;
    db.query(queryString, [pin_id])
      .then((data) => {
        const pins = data.rows;
        res.json({ pins });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET all pins for a map
  router.get("/", (req, res) => {
    const { map_id } = req.query;
    const queryString = `
    SELECT *
    FROM pins
    WHERE map_id = $1;`;
    db.query(queryString, [map_id])
      .then((data) => {
        const pins = data.rows;
        console.log(pins);
        return res.status(200).json(pins);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // POST add pin
  router.post("/", (req, res) => {
    const { map_id, title, description, latitude, longitude, image_url } =
      req.body;
    console.log(req.body);
    const queryString = `
    INSERT INTO pins (
      map_id, title, description, image_url, latitude, longitude)
      VALUES
      ($1, $2, $3, $4, $5, $6)
      RETURNING *;`;
    db.query(queryString, [
      map_id,
      title,
      description,
      image_url,
      latitude,
      longitude,
    ])
      .then((data) => {
        const pins = data.rows[0];
        return res.status(200).json(pins);
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // PATCH edit pin
  router.patch("/:id", (req, res) => {
    const pin_id = req.params;
    const user_id = req.session.user_id;
    const { map_id, title, description, image_url, latitude, longitude } =
      req.body;
    console.log(req.body);

    const selectQuery = `
    SELECT * FROM pins
    WHERE id = $1
    AND map_id = $2`;
    db.query(selectQuery, [pin_id, user_id])
      .then((result) => {
        const queryString = `
      UPDATE pins
      SET title = $1,
      description = $2,
      latitude = $3,
      longitude = $4,
      image_url = $5
      WHERE map_id = $6
      RETURNING *;`;
        db.query(queryString, [
          map_id,
          title,
          description,
          image_url,
          latitude,
          longitude,
        ]);
      })
      .then((data) => {
        const pins = data.rows[0];
        console.log(data.rows[0]);
        res.json(pins);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // POST delete pin
  router.delete("/:id", (req, res) => {
    const pin_id = req.params.id;
    const queryString = `
    DELETE FROM pins
    WHERE id = $1;`;
    db.query(queryString, [pin_id])
      .then((data) => {
        res.send(200).json(pin_id);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
