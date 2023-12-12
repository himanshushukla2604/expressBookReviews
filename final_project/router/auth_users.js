const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    let user = users.filter((user) => {
        return user.username === username
    })

    if(user > 0){
        return false;
    }else {
        return true;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
    let user = users.filter((user) => {
        return (user.username === username && user.password === password);
    })
    if(user){
        return true;
    }else {
        return false;
    }

}

//only registered users can login
regd_users.post("/login", (req,res) => {
    // http://localhost:5000/customer/login
  //Write your code here
  let username = req.body.username;
  let password = req.body.password;

  if(!username || !password){
      return res.status(404).json({message: "username and password not found"});
  }

  if(authenticatedUser(username, password)){
      let accessToken = jwt.sign(
          {
              data : password
          }, 'access', {expiresIn : 60 * 60}
      )
      console.log(accessToken)
      req.session.authorization = {
          accessToken, username
      }
      return res.status(200).send("User successfully logedin!!");
  }
  return res.status(208).json({message: "Invalid Login. Check username and password"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    // http://localhost:5000/customer/auth/review/10
  const isbn = req.params.isbn;
  const username = req.body.username;
  const review = req.body.review;
  console.log("got here");
  
  if (books.hasOwnProperty(isbn)) {
      const reviews = books[isbn].reviews
      // const review = reviews.filter((review) => review.username === username);
      console.log(reviews);

        reviews[username] = review;

      return res.send(reviews)
  } else {
      return res.send("Book not found");
  }
});

regd_users.delete("/auth/review/delete/:isbn", (req, res) => {
    //http://localhost:5000/customer/auth/review/delete/10
    const isbn = req.params.isbn;
  const username = req.body.username;
//   const review = req.body.review;
  console.log("got here");
  
  if (books.hasOwnProperty(isbn)) {
      const reviews = books[isbn].reviews
      // const review = reviews.filter((review) => review.username === username);
      console.log(reviews);

        delete reviews[username];

      return res.send(reviews)
  } else {
      return res.send("Book not found");
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
