const express = require("express");
const router = express.Router();

module.exports = (db) => {
  //GET fav maps from users
  router.get("/:id", (req, res) => {
    const user_id = req.params.id;
    const queryString = ``;
    db.query().then().catch();
  });
  //POST add map to fav map
  router.post("/:map_id", (req, res) => {
    const { map_id, user_id } = req.body;
    const queryString = ``;
    db.query().then().catch();
  });
  //DELETE fav map
  router.delete("/:id", (req, res) => {
    const map_id = req.params.id;
    const queryString = ``;
    db.query().then().catch();
  });
  return router;
};
