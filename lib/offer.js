var aux = require('./aux.js');
var database = require('./database.js');
var infojobs = require('./infojobs.js');

module.exports = function(app) {

    app.get('/offer/:id',function(req,res,next) {
	database.offerById(req.params.id,function(err,info) {
	    if ( !err) {
		rows = info.rows;
		res.render('offer',{
		    nick: req.session.nick,
		    comments: info.comments,
		    offerId: rows[0].id,
		    link : rows[0].link,
		    title: rows[0].title,
		    city: rows[0].city,
		    province: rows[0].province,
		    company: rows[0].company,
		    description: rows[0].description,
		    minPay: rows[0].minPay,
		    maxPay: rows[0].maxPay,
		    minRequirements: rows[0].minRequirements,
		    studiesMin: rows[0].studiesMin
		});
	    } else {
		res.redirect('500');
	    }
	});
    });

    app.post('/storeOffer',function(req,res,next) {
	if ( req.body.ijid ) {
	    infojobs.getOffer(req.body.ijid,
			      function(err,result) {
				  database.insertOffer(result,req.session.nick,
						       function(err,id) {
							   res.redirect("/offer/"+id);});
			      });
	} else {
	    next();
	}
    });

}


