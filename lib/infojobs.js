var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var fs = require('fs');
var login = JSON.parse(fs.readFileSync(data_dir+'/infojobs.json').toString());

function getOffers(q,callback) {
    var request = require('request');
    auth = 'Basic ' + new Buffer(login['id'] + ':' + login['secret']).toString('base64');
    uri = 'http://api.infojobs.net/api/1/offer';
    request.get({
	url: uri, 
	qs: {"q": q},
	headers: { 'Authorization': auth }},
		function (err, result) {
		    result = JSON.parse(result['body']);
		    callback(err,result['offers']);
		});
}

function getOffer(ijid,callback) {
    var request = require('request');
    auth = 'Basic ' + new Buffer(login['id'] + ':' + login['secret']).toString('base64');
    uri = 'http://api.infojobs.net/api/1/offer/'+ijid;
    request.get({
	url: uri, 
	headers: { 'Authorization': auth }},
		function (err, result) {
		    result = JSON.parse(result['body']);
		    if ( !result['maxPay'] ) {
		    	result['maxPay'] = { 'amount':0 };
		    }
		    if ( !result['minPay'] ) {
		    	result['minPay'] = { 'amount':0 };
		    }
		    callback(err,result);
		});
}    

module.exports.getOffers = getOffers;
module.exports.getOffer = getOffer;
