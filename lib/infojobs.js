var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var fs = require('fs');
var login = JSON.parse(fs.readFileSync(data_dir+'/infojobs.json').toString());

function getOffers(callback) {
    var request = require('request');
    auth = 'Basic ' + new Buffer(login['id'] + ':' + login['secret']).toString('base64');
    uri = 'http://api.infojobs.net/api/1/offer';
    var options = {
	uri: uri,
	port: 80,
	method: 'GET',
	timeout: 30000,
	json: false,
	headers: { 'Authorization': auth }
    };
    request.get(uri, options, function (err, result) {
	// fs.writeFile("tmp.json", result['body'], function(err) {
	//     if(err) {
	// 	return console.log(err);
	//     }
	//     console.log("The file was saved!");
	// }); 	
	
	result = JSON.parse(result['body']);
	buffer = "";
	for ( var i=0;i<result['offers'].length;i++ ) {
	    console.log(result['offers'][i]['title']);
	}
	// for (var r in result['body']) {
	//     console.log(r);
	// }
	callback(err,result);
    });
}

module.exports.getOffers = getOffers;
