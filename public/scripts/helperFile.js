const getUsername = function (username) {
  const queryString = `SELECT * FROM users WHERE users.username = $1`;
  return query(queryString, [`${username}`]).then((res) => res.rows[0]);
};
exports.getUsername = getUsername;
