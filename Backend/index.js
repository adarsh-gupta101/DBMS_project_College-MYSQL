const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

// Create the Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create a connection to the database
const connection = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "server",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// console.log(connection);
app.get("/allusers", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM users");

  res.send(rows);
});

app.get("/userdetails", async (req, res) => {
  const [rows] = await connection.query(
    "SELECT * FROM users WHERE user_id = ?",
    [req.query.user_id]
  );
  res.send(rows);
});

app.get("/postcomments", async (req, res) => {
  // get comments by post id
  const post_id = req.query.post_id;
  const [comments] = await connection.query(
    "SELECT * FROM comments WHERE post_id = ?",
    [post_id]
  );

  res.send(comments);
});

app.post("/createpost", async (req, res) => {
  const { user_id, post_text, post_time } = req.body;

  try {
    const [rows] = await connection.query(
      "INSERT INTO posts (user_id, post_text, post_time) VALUES ( ?, ?,?)",
      [user_id, post_text, post_time]
    );

    res.send({ postId: rows });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/posts", async (req, res) => {
  const [rows] = await connection.query("SELECT * FROM posts");
  // find usernames from user_id
  for (let i = 0; i < rows.length; i++) {
    const [user] = await connection.query(
      "SELECT name,profile_picture FROM users WHERE user_id = ?",
      [rows[i].user_id]
    );
    // fetch totallike in post
    const [totallikes] = await connection.query(
      "SELECT COUNT(*) FROM likes WHERE post_id = ?",
      [rows[i].post_id]
    );
    // fetch comments in post
    const [comments] = await connection.query(
      "SELECT * FROM comments WHERE post_id = ?",
      [rows[i].post_id]
    );

    rows[i].username = user[0].name;
    rows[i].profile_picture = user[0].profile_picture;
    rows[i].totallikes = totallikes[0]["COUNT(*)"];
    rows[i].comments = comments;
  }
  res.send(rows);
});

app.post("/comment", async (req, res) => {
  const { user_id, post_id, comment_text, comment_time } = req.body;

  try {
    const [rows] = await connection.query(
      "INSERT INTO comments (user_id, post_id, comment_text, comment_time) VALUES (?, ?, ?, ?)",
      [user_id, post_id, comment_text, comment_time]
    );

    res.send({ commentId: rows });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.post("/likes", async (req, res) => {
  const { user_id, post_id } = req.body;

  // if liked, remove like
  const [rows] = await connection.query(
    "SELECT * FROM likes WHERE user_id = ? AND post_id = ?",
    [user_id, post_id]
  );
  if (rows.length > 0) {
    // user found
    const [rows] = await connection.query(
      "DELETE FROM likes WHERE user_id = ? AND post_id = ?",
      [user_id, post_id]
    );
    res.send({ likeId: rows });
    return;
  }

  try {
    const [rows] = await connection.query(
      "INSERT INTO likes (user_id, post_id) VALUES (?, ?)",
      [user_id, post_id]
    );

    res.send({ likeId: rows });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});
app.get("/alllikes", async (req, res) => {
  // total likes for a particular post
  const [rows] = await connection.query(
    "SELECT COUNT(*) FROM likes WHERE post_id = ?",
    [req.query.post_id]
  );
  res.send(rows);
});

app.post("/login", async (req, res) => {
  // check email and password against database
  const [rows] = await connection.query(
    `SELECT user_id, name, profile_picture FROM users WHERE email = ? AND password = ?`,
    [req.body.email, req.body.password]
  );

  if (rows.length > 0) {
    // user found
    const user = rows[0];

    // store user data in session
    // req.session.user_id = user.user_id;
    // req.session.name = user.name;
    // req.session.profile_picture = user.profile_picture;

    res.send(user);
  } else {
    // user not found
    res.send("Invalid email or password");
  }
});

app.post("/createuser", async (req, res) => {
  const { name, email, picture, password, user_id } = req.body;

  try {
    const [rows] = await connection.query(
      "INSERT INTO users (name, email, profile_picture, password, user_id) VALUES (?, ?, ?, ?,?)",
      [name, email, picture, password, user_id]
    );

    res.send({ userId: rows });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/users", (req, res) => {
  const query = "SELECT * FROM users";
  connection.query(query, (error, results) => {
    if (error) {
      throw error;
    }
    res.send(results);
  });
});

// Start the server
app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
