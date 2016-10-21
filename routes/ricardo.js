var express = require('express');
var router = express.Router();

/* GET users listing. */

module.exports = function(app) {

    app.get('/', function(req, res) {
	res.send('{"status": "fake BigAP"}');
    });
    
    app.post('/ricardo', function(req, res) {
	var ipAddr = req.body.ipAddr;
	var apIpAddr = req.body.apIpAddr;
	var tentative = req.body.tentative;
	var apsInRange = req.body.apsInRange;
	
	var result = '{ipAddr: ' + ipAddr +
	    ', apIpAddr: ' + apIpAddr +
	    ', apsInRange: ' + apsInRange + '}';
	
	res.send(result);
    });
}

