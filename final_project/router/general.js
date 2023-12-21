const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length>0){
      return true;
    }else{
      return false;
    }
  }
  

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
  
    if (username && password) {
      if (!doesExist(username)) { 
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registered. Now you can login"});
      }else{
        return res.status(404).json({message: "User already exists!"});
      }
    } 
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN])
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let bookdet = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'author' && book[i][1] == req.params.author){
            bookdet.push(books[key]);
          }
      }
  }
  if(bookdet.length == 0){
      return res.status(300).json({message: "Author not found!"});
  }
  res.send(bookdet);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let titledet = []
  for(const [key, values] of Object.entries(books)){
      const book = Object.entries(values);
      for(let i = 0; i < book.length ; i++){
          if(book[i][0] == 'title' && book[i][1] == req.params.title){
            titledet.push(books[key]);
          }
      }
  }
  if(titledet.length == 0){
      return res.status(300).json({message: "Title not found!"});
  }
  res.send(titledet);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const ISBN = req.params.isbn;
  res.send(books[ISBN].reviews)
});

// Task 10 
// Add the code for task 10

function getBooksLs(){
    return new Promise((resolve,reject)=>{
      resolve(books);
    })
  }
  
  // Get the book list available in the shop
  public_users.get('/',function (req, res) {
    getBooksLs().then(
      (back)=>res.send(JSON.stringify(back, null, 4)),
      (error) => res.send("can't access")
    );  
  });
  
  // Task 11
  // Add the code for task 11
  
  function getFromISBN(isbn){
    let bookisbn = books[isbn];  
    return new Promise((resolve,reject)=>{
      if (bookisbn) {
        resolve(bookisbn);
      }else{
        reject("Can't find book with the isbn given");
      }    
    })
  }
  
  // Get book details based on ISBN
  public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    getFromISBN(isbn).then(
      (back)=>res.send(JSON.stringify(back, null, 4)),
      (error) => res.send(error)
    )
   });
  
  // Task 12
  // Add the code for task 12
  
  function getFromAuthor(author){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let bookisbn = books[isbn];
        if (bookisbn.author === author){
          output.push(bookisbn);
        }
      }
      resolve(output);  
    })
  }
  
  // Get book details based on author
  public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    getFromAuthor(author)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });
  
  // Task 13
  // Add the code for task 13
  
  
  function getFromTitle(title){
    let output = [];
    return new Promise((resolve,reject)=>{
      for (var isbn in books) {
        let bookisbn = books[isbn];
        if (bookisbn.title === title){
          output.push(bookisbn);
        }
      }
      resolve(output);  
    })
  }
  
  // Get all books based on title
  public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    getFromTitle(title)
    .then(
      result =>res.send(JSON.stringify(result, null, 4))
    );
  });

module.exports.general = public_users;
