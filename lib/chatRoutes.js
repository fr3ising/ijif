var aux = require('./aux.js');
var database = require('./database.js');

module.exports = function(app) {
    
    app.get('/chat',function(req,res) {
	res.render('chat',{
	    title:"Chat de ijif",
	    nick: req.session.nick});
    });
    
    app.post('/postChat',function(req,res) {
	if ( req.session.nick ) {
	    database.insertChat(
		req.body.message,req.session.nick,false,
		function(err,rows) {
		    if ( err ) {
			res.redirect('500');
		    } else {
			res.end();
		    }
		});
	} else {
	    res.end();
	}
    });
    
    app.get('/chatDisplay',function(req,res) {
	database.lastChats(30,function(err,rows) {
	    res.render('chatbox',{
		nick: req.session.nick,
		chats: rows,layout: false});
	});
    });
    
}


