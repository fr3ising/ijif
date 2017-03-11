var aux = require('./../lib/aux.js');
var infojobs = require('./../lib/infojobs.js');
var maxResults = 30;

module.exports = function(app) {

    app.get('/pay',function(req,res) {
	infojobs.getOffers(req.query.q,10*maxResults,function(err,offers) {
	    var payOffers = 0;
	    var payAcum = 0;
	    for(var i=0;i<offers.length;i++) {
		var n = 0;
		var acum = 0;
		if ( offers[i]['salaryMin']['value'].length > 0 ) {
		    acum += aux.payToInt(offers[i]['salaryMin']['value']);
		    n++;
		}
		if ( offers[i]['salaryMax']['value'].length > 0 ) {
		    acum += aux.payToInt(offers[i]['salaryMax']['value']);
		    n++;
		}
		if ( n > 0 ) {
		    var mean = acum*aux.periodToInt(offers[i]['salaryPeriod']['value'])/n;
		    payOffers++;
		    payAcum += mean;
		}
	    }
	    var payString = '';
	    if ( payOffers > 0 ) {
		if ( req.query.q.length > 0 ) {
		    payString = "El salario medio para las ofertas de \""+req.query.q+
			"\" es de "+aux.intToCash(payAcum/payOffers)+" ("+payOffers+" ofertas analizadas)";
		} else {
		    payString = "El salario medio es de "+aux.intToCash(payAcum/payOffers)+" ("+payOffers+" ofertas analizadas)";
		}
	    } else {
		payString = 'No se han encontrado ofertas';
	    }
	    res.render('payResults',{ mean: payString, layout: false });
	});
    });

}
