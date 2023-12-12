const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username + " " + password)
  if (username && password) {
    if (isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  }

  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   //Write your code here
//   return res.send(JSON.stringify(books, null, 4));
// });
public_users.get('/', function (req, res) {
  getBooks(function (err, books) {
    if (err) {
      return res.status(500).send('Error fetching books');
    }

    return res.send(JSON.stringify(books, null, 4));
  });
});

function getBooks(callback) {
 
  setTimeout(function () {
    callback(null, books);
  }, 1000); 
}



// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   //Write your code here
//   let isbn = req.params.isbn;
//   return res.send(JSON.stringify(books[isbn], null, 4));
// });
public_users.get('/isbn/:isbn', function (req, res) {
  let isbn = req.params.isbn;
  
  // Assuming books is an object containing book information
  getBookByIsbnPromise(isbn)
    .then(function (book) {
      return res.send(JSON.stringify(book, null, 4));
    })
    .catch(function (err) {
      return res.status(500).send('Error fetching book information');
    });
  });

function getBookByIsbnPromise(isbn) {
  return new Promise(function (resolve, reject) {
    
    setTimeout(function () {
      let book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 1000); 
  });
}

// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     const filteredBooks = Object.values(books).filter((book) => book.author === author);
//   return res.send(JSON.stringify(filteredBooks , null, 4));
// });

public_users.get('/author/:author', function (req, res) {
  let author = req.params.author;
  console.log(author);
  // Assuming books is an object containing book information
  getBookByAuthorPromise(author)
    .then(function (book) {
      
      return res.send(JSON.stringify(book, null, 4));
    })
    .catch(function (err) {
      return res.status(500).send('Error fetching book information');
    });
});

function getBookByAuthorPromise(author) {
  return new Promise(function (resolve, reject) {
   
    setTimeout(function () {
      let book = Object.values(books).filter((book) => book.author === author);
      console.log(book);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 1000);
  });
}

// Get all books based on title
// public_users.get('/title/:title', function (req, res) {
//   const title = req.params.title;
//   console.log(title);
//   const filteredBooks = Object.values(books).filter((book) => book.title === title);
//   console.log(filteredBooks);
//   return res.send(JSON.stringify(filteredBooks, null, 4));
// });
public_users.get('/title/:title', function (req, res) {
  let title = req.params.title;

  // Assuming books is an object containing book information
  getBookByTitlePromise(title)
    .then(function (book) {
      return res.send(JSON.stringify(book, null, 4));
    })
    .catch(function (err) {
      return res.status(500).send('Error fetching book information');
    });
});

function getBookByTitlePromise(title) {
  return new Promise(function (resolve, reject) {
    
    setTimeout(function () {
      let book = Object.values(books).filter((book) => book.title === title);
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    }, 1000); 
  });
}


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;

  if (books.hasOwnProperty(isbn)) {
      return res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
      return res.send("Book not found");
  }
});

module.exports.general = public_users;
