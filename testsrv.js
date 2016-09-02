var express = require('express'); // call express
var app = express(); // define our app using express

var path = require('path');

app.use(express.static(path.join(__dirname)));

app.listen(9898)