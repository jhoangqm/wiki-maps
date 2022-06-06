// load .env data into process.env
require("dotenv").config();

// Web server config
const PORT = process.env.PORT || 8080;
const sassMiddleware = require("./lib/sass-middleware");
const express = require("express");
const app = express();
const morgan = require("morgan");
const cookieSession = require("cookie-session");

// PG database client/connection setup
const { Pool } = require("pg");
const dbParams = require("./lib/db.js");
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cookieSession({
    name: "session",
    keys: [process.env.COOKIE_1, process.env.COOKIE_2],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  })
);

app.use(
  "/styles",
  sassMiddleware({
    source: __dirname + "/styles",
    destination: __dirname + "/public/styles",
    isSass: false, // false => scss, true => sass
  })
);

app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/userRoutes");
const mapsRoutes = require("./routes/mapRoutes");
// const pinsRoutes = require("./routes/pinRoutes");
// const mapPinsRoutes = require("./routes/mapPinsRoutes");
// const favMapsRoutes = require("./routes/favMapsRoutes");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own

app.use("/api/user", usersRoutes(db));
app.use("/api/maps", mapsRoutes(db));
// app.use("/api/pins", pinsRoutes(db));
// app.use("/api/mapPins", mapPinsRoutes(db));
// app.use("/api/favMaps", favMapsRoutes(db));

// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get("/", (req, res) => {
  res.render("index");
});

// app.get("/login/:id", (req, res) => {
//   req.session.user_id = req.params.id;
//   res.redirect("/");
// });

// app.post("/logout", (req, res) => {
//   req.session = null;
//   res.redirect("/");
//   console.log("Logged out!");
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
