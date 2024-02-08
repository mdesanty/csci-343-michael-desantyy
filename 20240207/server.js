require("dotenv").config();

const express = require("express");
const pgClient = require("./pgClient");

const app = express();
app.use(express.json());

app.get("/books", getBooks);
app.get("/books/:id", getBook);
app.post("/books", createBook);
app.put("/books/:id", updateBook);
app.delete("/books/:id", deleteBook);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getBooks(req, res) {
  const sql = "SELECT id, name, author FROM books ORDER BY name";
  pgClient.query(sql)
    .then(results => {
      res.status(200).json(results.rows);
    })
    .catch(error => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.`});
    });
}

function getBook(req, res) {
  const sql = "SELECT id, name, author FROM books WHERE id = $1";
  pgClient.query(sql, [req.params.id])
    .then(results => {
      if(results.rowCount > 0) {
        res.status(200).json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function createBook(req, res) {
  const book = req.body;

  pgClient.query("INSERT INTO books(name, author) VALUES($1, $2) RETURNING id", [book.name, book.author])
    .then(results => {
      res.location(`/books/${results.rows[0].id}`);
      res.status(201).json({ message: "Book created successfully." });
    })
    .catch(error => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function updateBook(req, res) {
  const book = req.body;

  pgClient.query("UPDATE books SET name = $1, author = $2 WHERE id = $3", [book.name, book.author, req.params.id])
    .then(results => {
      if(results.rowCount > 0 ) {
        res.status(200).json({ message: "Book successfully updated." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}

function deleteBook(req, res) {
  pgClient.query("DELETE FROM books WHERE id = $1", [req.params.id])
    .then(results => {
      if(results.rowCount > 0) {
        res.status(200).json({ message: "Book successfully deleted." });
      }
      else {
        res.status(404).json({ error: "Book not found." });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `We encountered an error with your request: ${error}.` });
    });
}