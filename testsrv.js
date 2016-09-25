var express = require('express'); // call express
var app = express(); // define our app using express

var path = require('path');

app.use(express.static(path.join(__dirname)));

var proxy = require('express-http-proxy');
 
app.use('/card/:cardId', proxy('www.faeriadecks.com', {
  forwardPath: function(req, res) {
    return '/images/card-renders/'+req.params.cardId;
  }
}));

app.listen(9898)