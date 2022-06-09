/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const bcrypt = require("bcryptjs");
const express = require("express");
const router = express.Router();

// Rough sketch of routes, subject to change (Possibly)
// All SQL has been tested via psql and they work,
// routes might not work because they haven't been tested
module.exports = (db) => {
  // GET login info
  router.get("/login", (req, res) => {
    const user_id = req.session.user_id;
    if (user_id === undefined || !user_id) {
      return res.send({ message: "Please login" });
    }
    res.redirect("/");
  });

  // POST login method
  router.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log('test',req.body);
    const queryString = `SELECT * FROM users WHERE username = $1;`;

    db.query(queryString, [email])
      .then((data) => {
        const user = data.rows[0];
        console.log(data.rows[0]);

        if (!user) {
          return res
            .status(400)
            .send({ message: "Username not found in database" });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if (!validPassword) {
          return res
            .status(400)
            .send({ message: "Password does not match username" });
        }

        req.session.user_id = user.id;
        return res.status(200).send({ ...user });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET the current user
  router.get("/me", (req, res) => {
    const user_id = req.session.user_id;
    const queryString = `
    SELECT *
    FROM users
    WHERE id = $1;`;

    db.query(queryString, [user_id])
      .then((data) => {
        const user = data.rows[0];

        if (!user) {
          return res
            .status(400)
            .send({ message: "Username not found in database" });
        }

        return res.json({ ...user });
      })
      .catch((err) => res.status(500).json({ error: err.message }));
  });

  // GET users from DB
  router.get("/", (req, res) => {
    const user_id = req.params.user_id;
    const queryString = `
    SELECT *
    FROM users;`;
    db.query(queryString, [user_id])
      .then((data) => {
        const users = data.rows;
        res.json({ users, user_id });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // Register user to DB
  router.post("/register", (req, res) => {
    const { email, password } = req.body;

    if (!email.length || !password.length) {
      return res.status(400).send({ error: "Please try again" });
    }

    db.query(`SELECT * from users WHERE username = $1;`, [email])
      .then((data) => {
        const user = data.rows[0];

        // Check if username exists in the DB and return error message
        if (user) {
          return res.status(403).send({ error: "Username already exists" });
        }
        // Otherwise create username and hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        const queryString = `INSERT INTO users (username, password)
                             VALUES ($1, $2) RETURNING *;`;

        db.query(queryString, [email, hashedPassword]
        )
          .then((data) => {
            const user = data.rows[0];

            req.session.user_id = user.id;
            return res.status(200).send({ ...user });
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  // GET users map from DB
  router.get("/:id", (req, res) => {
    const user_id = req.params.id;
    const queryString = `
    SELECT users.id as user_id,
    username,
    password,
    users.latitude as user_lat,
    users.longitude as user_long,
    maps.id as map_id, owner_id,
    maps.name as map_name,
    maps.latitude as map_lat,
    maps.longitude as map_long
    FROM users
    JOIN maps ON owner_id = users.id
    WHERE owner_id = $1;`;
    db.query(queryString, [user_id])
      .then((data) => {
        const userMaps = data.rows;
        res.json(userMaps);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/logout", (req, res) => {
    req.session = null;
    res.send({ message: "Logged out!" });
  });

  // //PATCH edit user location ( this is a stretch for now )
  // router.patch("/:id", (req, res) => {
  //   const user_id = req.params.id;
  //   const { latitude, longitude } = req.body;
  //   const queryString = `
  //   UPDATE maps SET name = $1, area = $2
  //   WHERE owner_id = $3
  //   AND maps_id = $4
  //   RETURNING *;`;
  //   db.query(queryString, [latitude, longitude, user_id])
  //     .then((data) => {
  //       const maps = data.rows;
  //       res.json(maps);
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });

  return router;
};
