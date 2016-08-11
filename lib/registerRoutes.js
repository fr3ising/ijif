var aux = require('./aux.js');
var database = require('./database.js');

module.exports = function(app) {

    app.post('/register',function(req,res,next) {
	if ( req.body.nick.length < 1 ) {
	    res.render('signup',
		       {title:'Regístrate en Freiworld',fail:"Error: nick no válido"});
	} else {
	    next();
	}
    });

    app.post('/register',function(req,res,next) {
	if ( ! aux.validateEmail(req.body.email) ) {
	    res.render('signup',
		       {title:'Regístrate en Freiworld',fail:"Error: email no válido"});
	} else {
	    next();
	}
    });
    
    app.post('/register',function(req,res,next) {
	if ( req.body.password !== req.body.rpassword ) {
	    res.render('signup',
		       {title:'Regístrate en Freiworld',fail:"Error: los passwords no coinciden"});
	} else {
	    next();
	}
    });
    
    app.post('/register',function(req,res,next) {
	database.userByNick(req.body.nick,function(err,rows) {
	    if ( !err ) {
		if ( rows.length > 0 ) {
		    res.render('signup',
			       {title:'Regístrate en Freiworld',fail:"Error: nick ya registrado"});
		} else {
		    next();
		}
	    } else {
		res.redirect('500');
		console.log(err);
	    }
	});
    });

    app.post('/register',function(req,res,next) {
	database.userByEmail(req.body.email,function(err,rows) {
	    if ( !err ) {
		if ( rows.length > 0 ) {
		    res.render('signup',
			       {title:'Regístrate en Freiworld',fail:"Error: email ya registrado"});
		} else {
		    next();
		}
	    } else {
		console.log(err);
	    }
	});
    });
    
    app.post('/register',function(req,res) {
	database.insertUser(req.body.nick,req.body.email,req.body.password);
	req.session.nick = req.body.nick;
	req.session.fail = false;
	req.session.save(function(err) {
	    res.redirect('/');
	});
    });

}
