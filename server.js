var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var express = require('express');
var handlebars = require('express3-handlebars').create({defaultLayout: 'main'});
var fortune = require('./lib/fortune.js');
var aux = require('./lib/aux.js');
var bodyParser = require('body-parser');
var credentials = require(data_dir+'/credentials.js');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var fileStore = require('session-file-store')(session);
var database = require('./lib/database.js');
var infojobs = require('./lib/infojobs.js');
var formidable = require('formidable');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

var app = express();

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
    proxy: true,
    resave: true,
    store: new fileStore,
    saveUninitialized: true
}));

app.use(function(req,res,next) {
    res.locals.showTests = (app.get('env') !== 'production') && (req.query.test === '1');
    next();
});

infojobs.getOffers(function(err,rows) { });

app.get('/',function(req,res) {
    req.session.fail = false;
    infojobs.getOffers(function(err,rows) { });
    database.lastLinks(10,function(err,rows) {
	res.render('home',{
	    title:"ijif",
	    nick: req.session.nick,
	    links: rows});
    });
});

app.get('/changePassword',function(req,res) {
    res.render('changePassword',{
	title:"Cambiar password",
	nick: req.session.nick});
});

app.get('/chat',function(req,res) {
    res.render('chat',{
	title:"Chat de ijif",
	nick: req.session.nick});
});

app.post('/postChat',function(req,res) {
    database.insertChat(
	req.body.message,req.session.nick,false,
	function(err,rows) {
	    if ( err ) {
		res.redirect('500');
	    } else {
		res.end();
	    }
	});
});

app.post('/updatePassword',function(req,res) {
    if ( req.body.password === req.body.rpassword ) {
	database.updatePassword(req.session.nick,req.body.password,
				function(err,rows) {
				    res.render('home',{
					title: "ijif",
					nick: req.session.nick,
					msg: "Password actualizado"});
				});
    } else {
	res.render('changePassword',{title: "Cambiar password",
				     nick: req.session.nick,
				     fail: "Error: los passwords no coinciden"});
    }
});

app.post('/login',function(req,res) {
    database.signin(req.body.nick,req.body.password,function(err,rows){
	if ( rows && rows.length > 0 ) {
	    if ( rows[0].nick === req.body.nick ) {
		req.session.nick = rows[0].nick;
		req.session.fail = false;
		req.session.save(function(err) {
		    res.redirect('/');
		});
	    }
	} else {
	    req.session.nick = null;
	    req.session.fail = "Fallo al acceder, comprueba nickname y password";
	    req.session.save(function(err) {
		res.redirect('/signin');
	    });
	}
    });
});

app.get('/passwordRecovery',function(req,res) {
    req.session.fail = false;
    res.render('passwordRecovery',{ title: "Password recovery" });
});

var registerRoutes = require('./lib/registerRoutes.js');
registerRoutes(app);

var sendPasswordRoutes = require('./lib/sendPasswordRoutes.js');
sendPasswordRoutes(app);

// var postLinkRoutes = require('./lib/postLinkRoutes.js');
// postLinkRoutes(app);

// var postCommentRoutes = require('./lib/postCommentRoutes.js');
// postCommentRoutes(app);

app.get('/chatDisplay',function(req,res) {
    database.lastChats(30,function(err,rows) {
	res.render('chatbox',{
	    nick: req.session.nick,
	    chats: rows,layout: false});
    });
});

app.get('/link/:id',function(req,res) {
    database.linkById(req.params.id,function(err,info) {
	if ( !err ) {
	    rows = info.rows;
	    res.render('link',{ title: rows[0].title,
				linkTitle: rows[0].title,
				uri: rows[0].uri,
				comment: rows[0].comment,
				linkNick: rows[0].nick,
				fail:false,
				linkId: rows[0].id,
				idate:rows[0].idate,
				nick: req.session.nick,
				comments: info.comments
			      });
	} else {
	    res.redirect('500');
	}
    });
});

app.get('/sendLink',function(req,res) {
    res.render('sendLink',{ title: 'Enviar noticia',fail:false,nick:req.session.nick});
});

app.get('/signout',function(req,res) {
    req.session.nick = null;
    req.session.fail = false;
    req.session.save(function(err) {
	res.redirect('/');
    });
});

app.get('/signin',function(req,res) {
    res.render('signin',{title:'Entrar a ijif',fail:req.session.fail});
});

app.get('/signup',function(req,res) {
    res.render('signup',{title:'Signup en ijif',fail:req.session.fail});
});

app.get('/about',function(req,res) {
    console.log(req.session.nick);
    res.render('about',{
	title: "About ijif",
	fortune: fortune.getFortune(),
	pageTestScript: "/qa/about-tests.js",
	nick: req.session.nick
    });
});

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
    console.log('Express started on http://localhost'+app.get('port')+'; Press Ctrl-C to terminate.');
});
