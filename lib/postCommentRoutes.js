var aux = require('./aux.js');
var database = require('./database.js');

module.exports = function(app) {

    app.post('/postComment',function(req,res,next) {
	database.insertComment(
	    req.body.offerId,req.body.comment,req.session.nick,
	    function(err,rows) {
		if ( err ) {
		    res.redirect('500');
		} else {
		    res.redirect('/offer/'+req.body.offerId);
		}
	    });
    });

}
