var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var aux = require('./aux.js');
var database = require('./database.js');
var fs = require('fs');
var login = JSON.parse(fs.readFileSync(data_dir+'/gmail.json').toString());
var nodemailer = require('nodemailer');

function passwordRecovery(nick,email,callback) 
{
    newpass = aux.randomPassword();
    database.updatePassword(nick,newpass,function(err,rows) {
	var smtps = 'smtps://'+login["user"]+'%40gmail.com:'+login["password"]+'@smtp.gmail.com';
	var mailOptions = {
	    from: '"Freiworld" <'+login["user"]+'@gmail.com>',
	    to: email, 
	    text: 'Hola '+nick+'; tu nuevo password en freiworld es: '+newpass, 
	    subject: 'Recuperación de contraseña'
	};
	var transporter = nodemailer.createTransport(smtps);
	transporter.sendMail(mailOptions, function(err, info){
	    if(err){
		console.log(err);
	    } else {
		console.log('Message sent: ' + info.response);
	    }
	});
    });
    callback(nick,email);
}

module.exports = function(app) {
    
    app.post('/sendPassword',function(req,res,next) {
	database.userByNick(req.body.email,function(err,rows) {
	    if ( !err ) {
		if ( rows.length > 0 ) {
		    passwordRecovery(rows[0].nick,rows[0].email,function(nick,email) {
			res.render('signin',
				   {title:'Accede a Freiworld',fail:"Mail enviado; consulta en tu buzón de entrada la nueva contraseña"});
		    });
		} else {
		    next();
		}
	    } else {
		res.redirect('500');
		console.log(err);
	    }
	});
    });
    
    app.post('/sendPassword',function(req,res,next) {
	database.userByEmail(req.body.email,function(err,rows) {
	    if ( !err ) {
		if ( rows.length > 0 ) {
		    passwordRecovery(rows[0].nick,rows[0].email,function(nick,email) {
			res.render('signin',
				   {title:'Accede a Freiworld',fail:"Mail con la nueva contraseña enviado a "+rows[0].email});
		    });
		} else {
		    next();
		}
	    } else {
		res.redirect('500');
		console.log(err);
	    }
	});
    });

    app.post('/sendPassword',function(req,res,next) {
	res.render('passwordRecovery',{ fail: 'No existe ningún usuario con dicho nick o email'});
    });
}    
