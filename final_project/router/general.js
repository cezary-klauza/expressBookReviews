const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", async (req,res) => {
  const { username, password } = req.body;

  if(!username || !password) return res.status(400).json({message: 'Username and password are neccessary!'});
  if(isValid(username)) return res.status(400).json({message: 'Username is taken!'});
  const user = { id: users.length, username, password };

  users.push(user);

  return res.status(200).json(user);
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).json(books, null, 4);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if(!book) return res.status(400).json({ message: 'There is no book with this isbn'});

  return res.status(200).json(book);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let authorBooks = [];

  for(let i = 1; i<11; i++){
    if(books[i].author === author) authorBooks.push(books[i]);
  }

  if(authorBooks.length === 0) return res.status(400).json({message: 'Invalid author'});

  return res.status(200).json(authorBooks);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let book;

  for(let i = 1; i<11; i++){
    if(books[i].title === title) book = books[i]
  }

  if(!book) return res.status(400).json({message: 'Invalid title'});

  return res.status(200).json(book);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if(!book) return res.status(400).json({ message: 'There is no book with this isbn'});

  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;
