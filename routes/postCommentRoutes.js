var aux = require('./../lib/aux.js');
var database = require('./../lib/database.js');

module.exports = function(app) {

    app.post('/postComment',function(req,res,next) {
	if ( req.session.nick ) {
	    database.insertComment(
		req.body.offerId,req.body.comment,req.session.nick,
		function(err,rows) {
		    if ( err ) {
			res.redirect('500');
		    } else {
			res.redirect('/offer/'+req.body.offerId);
		    }
		});
	} else {
	    res.end();
	}
    });
}
