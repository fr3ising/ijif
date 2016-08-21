var aux = require('./aux.js');
var database = require('./database.js');

module.exports = function(app) {

    app.get('/changePassword',function(req,res) {
	res.render('changePassword',{
	    title:"Cambiar password",
	    nick: req.session.nick});
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
		    console.log("Login OK "+rows[0].nick);
		    req.session.nick = rows[0].nick;
		    req.session.fail = false;
		    req.session.save(function(err) {
			res.redirect('/');
		    });
		}
	    } else {
		console.log("Login NOT OK "+req.body.nick);
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
}
