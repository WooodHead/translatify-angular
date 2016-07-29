var express = require('express');
var bodyParser = require('body-parser');

require('./api/models/db');

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api', require('./api/routes/index'));

var port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
