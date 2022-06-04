const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //GET pins from map in DB
  router.get("/:id", (req, res) => {
    const map_id = req.params.id;
    const queryString = ``;
    db.query().then().catch();
  });
  //POST add pins to map
  router.post("/:map_id", (req, res) => {
    const map_id = req.params.map_id;
    const id = req.body;
    const queryString = ``;
    db.query().then().catch();
  });
  //DELETE pins to map
  router.delete("/:pin_id/:map_id", (req, res) => {
    const { pin_id, map_id } = req.params;
    const queryString = ``;
    db.query().then().catch();
  });
  return router;
};
