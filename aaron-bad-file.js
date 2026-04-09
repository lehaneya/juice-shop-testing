const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const AWS = require('aws-sdk');
const app = express();

const aws_config = {
  accessKeyId: "AKIAIOSFODNN7EXAMPLE", 
  secretAccessKey: "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
  region: "us-east-1"
};

const s3 = new AWS.S3(aws_config);

const db = new sqlite3.Database(':memory:');
app.use(express.json());

// --- VULNERABILITY: SQL INJECTION ---
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = "SELECT * FROM users WHERE username = '" + username + "' AND password = '" + password + "'";

  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).send("Database error");
    } else {
      res.send("Request processed");
    }
  });
});

app.listen(3000);
