var aux = require('./aux.js');
var database = require('./database.js');
var infojobs = require('./infojobs.js');

module.exports = function(app) {

    app.get('/offer/:id',function(req,res,next) {
	database.offerById(req.params.id,function(err,info) {
	    if ( !err) {
		rows = info.rows;
		res.render('offer',{
		    link : rows[0].link,
		    title: rows[0].title
		});
	    } else {
		res.redirect('500');
	    }
	});
    });

    app.post('/storeOffer',function(req,res,next) {
	if ( req.body.ijid ) {
	    console.log(req.body.ijid);
	    infojobs.getOffer(req.body.ijid,
			      function(err,result) {
				  database.insertOffer(result,req.session.nick,
						       function(err,id) {
							   console.log("ID ID ID = "+id);
							   res.redirect("/offer/"+id);});
			      });
	} else {
	    next();
	}
    });

}


