'use strict';

// Libs
const path = require('path');
const express = require('express');
// Configs
const { APPLICATION } = require('./config');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.post('/payment/auth', (req, res) => {
  res.send('Auth');
});
app.post('/payment/order', (req, res) => {
  res.send('Auth');
});

app.listen(APPLICATION.PORT, APPLICATION.HOST);
