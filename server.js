var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var express = require('express');
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
var aux = require('./lib/aux.js');
var bodyParser = require('body-parser');
var credentials = require(data_dir+'/credentials.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var database = require('./lib/database.js');
var infojobs = require('./lib/infojobs.js');
var formidable = require('formidable');
var format = require('format-number');
var tagCloud = require('tag-cloud');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = express();
var maxResults = 30;

app.engine('handlebars',handlebars.engine);
app.set('view engine','handlebars');
app.set('port', server_port);
app.set('env','development');
app.disable('x-powered-by');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(credentials.cookieSecret));
app.use(session({
    secret: credentials.cookieSecret,
    cookie: {maxAge:7*24*3600*1000},
    proxy: true,
    resave: true,
    store: new fileStore,
    saveUninitialized: true
}));

app.use(function(req,res,next) {
    res.locals.showTests = (app.get('env') !== 'production') && (req.query.test === '1');
    next();
});

var routes = require('./routes/routes.js');
routes(app);

app.use(express.static(__dirname+'/public'));

app.use(function(req,res,next) {
    res.status(404);
    res.render('404');
});

app.use(function(req,res,next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'),server_ip_address,function() {
    console.log('Express started on http://localhost:'+app.get('port')+'; Press Ctrl-C to terminate.');
});
