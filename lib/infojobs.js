var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var fs = require('fs');
var login = JSON.parse(fs.readFileSync(data_dir+'/infojobs.json').toString());

function getOffers(q,callback) {
    var request = require('request');
    auth = 'Basic ' + new Buffer(login['id'] + ':' + login['secret']).toString('base64');
    uri = 'http://api.infojobs.net/api/1/offer';
    var options = {
	uri: uri,
	port: 80,
	method: 'GET',
	timeout: 30000,
	json: false,
	qs: { "q": q }
    };
    request.get({
	url: uri, 
	qs: {"q": q},
	headers: { 'Authorization': auth }},
		function (err, result) {
		    result = JSON.parse(result['body']);
		    callback(err,result['offers']);
		});
}

module.exports.getOffers = getOffers;
