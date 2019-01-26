const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();

//HTTP Preflight and Headers
app.use(function(req, res, next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE");
    return res.status(200).json({});
  }
  next();
});

//Allows sessions for tracking logins
app.use(session({
  secret: 'threading is fun',
  resave: true,
  saveUninitialized: false
}));

//Set session ID
app.use(function(req, res, next){
  res.locals.currentUserId = req.session.userId;
  next();
});

app.use(function(req, res, next){
  res.locals.currentUserName = req.session.username;
  next();
})

//Allows us to read json object from request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Tell Express to serve static files in /public
//The "static" part creates a virtual diretory from which
//we can access static assets from any page with ../static/<file>
app.use('/static', express.static(__dirname + '/public'));

//morgan logger
const logger = require('morgan');
app.use(logger("dev"));

//Setup pug view engine
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

//Define and establish the routes in routes file.
const routes = require('./routes/index');
const threadRoutes = require('./routes/threads');
app.use('/', routes);
app.use('/threads', threadRoutes);

//Establish db and test connection.
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/threaddb",
  { server: {
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 1000
    }
  }
);
const db = mongoose.connection;
db.on("error", function(e){
  console.log("connection error!", e);
});
db.once("open", function(){
  console.log("db connection success!");
});

//If the request lands here, catch with 404 error
app.use(function(req, res, next) {
  let e = new Error("Not Found");
  e.status = 404;
  next(e);
});

app.use(function(e, req, res, next) {
  res.status(e.status || 500);
  res.json({
    error: e.message
  })
})

//default port 3000
let port = process.env.PORT || 3000;

app.listen(port, function() {
  console.log("Express is listening on port: ", port);
})