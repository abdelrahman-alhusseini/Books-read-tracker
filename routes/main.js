const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

const users = [{ email: 'admin@example.com', password: '123' }];

router.get('/test', (req, res) => {
  res.send('✅ ROUTES WORKING');
});

router.get('/', (req, res) => {
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    req.session.user = user;
    res.redirect('/books');
  } else {
    res.render('login', { error: 'Invalid credentials' });
  }
});

router.get('/books', async (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  const books = await Book.find();
  res.render('books', { books });
});

router.get('/add-book', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('add-book');
});

router.post('/add-book', async (req, res) => {
  const { title, author } = req.body;
  await Book.create({ title, author });
  res.redirect('/books');
});

router.get('/edit-book/:id', async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.render('edit-book', { book });
});

router.post('/edit-book/:id', async (req, res) => {
  const { title, author } = req.body;
  await Book.findByIdAndUpdate(req.params.id, { title, author });
  res.redirect('/books');
});

router.get('/delete-book/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.redirect('/books');
});

module.exports = router;
