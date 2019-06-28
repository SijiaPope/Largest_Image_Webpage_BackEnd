const mongoose = require('mongoose');
const throng = require('throng');
require('dotenv').config({ path: '.env' });

//initializes connection to mongo
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/test', {
  useMongoClient: true,
});

mongoose.Promise = require('bluebird');

// throws mongo error if cannot connect 
mongoose.connection.on('error', (err) => {
  console.error(`🚫 Database Error 🚫  → ${err}`);
});

function start() {

//importing model for mongo 
  require('./models/url');
  const app = require('./app');
  app.set('port', process.env.PORT || 7777); // setting port to 7777
  const server = app.listen(app.get('port'), () => { // listener for connections 
    console.log(`Express running → PORT ${server.address().port}`);
  });
}

throng({
  workers: process.env.WEB_CONCURRENCY || 1,
}, start);