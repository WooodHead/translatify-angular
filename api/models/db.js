var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/translatify-react');
mongoose.connection.on('connected', () => console.log('Mongoose connected.'));
mongoose.connection.on('error', (err) => console.log(err));

require('./words');
