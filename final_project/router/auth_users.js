const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
  const user = users.find(({username: us}) => username === us);

  if(user) return true;
  else return false;
}

const authenticatedUser = (username,password)=>{ //returns boolean
  const user = users.find(({username: us, password: pwd}) => us === username && password === pwd);

  if(user) return true;
  else return false;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if(!username || !password) return res.status(400).json({ message: "Invalid credentials" });

  if(authenticatedUser(username, password)){
    const token = jwt.sign({
      data: password
    }, 'secret', { expiresIn: 60*60});

    req.session.authorization = {
      token, username
    }

    return res.status(200).send("User successfully logged in");
  } else
      return res.status(208).json({ message: "Invalid Login. Check username and password" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];

  if(!book) return res.status(400).json({ message: 'Invalid isbn!' })

  const username = req.session.authorization.username;

  const { review: message } = req.body;

  const review = {
    username,
    message
  }

  if(book.reviews.find(({username: us}) => us === username)){
    const index = book.reviews.findIndex(({username: us}) => us === username);
    books[isbn].reviews[index] = review;
  } else books[isbn].reviews.push(review);

  return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;

  const book = books[isbn];

  if(!book) return res.status(400).json({ message: 'Invalid isbn!' })

  const username = req.session.authorization.username;
  const index = book.reviews.findIndex(({username: us}) => us === username)

  books[isbn].reviews.splice(index, 1);

  return res.status(200).json({ message: 'Review deleted successfully!'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
