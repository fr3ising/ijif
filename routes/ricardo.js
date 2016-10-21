var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var aux = require('./aux.js');
var database = require('./database.js');
var fs = require('fs');
var promo = JSON.parse(fs.readFileSync(data_dir+'/forocoches.json').toString());
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.send('{"status": "fake BigAP"}');
});

router.post('/test', function(req, res) {
    var ipAddr = req.body.ipAddr;
    var apIpAddr = req.body.apIpAddr;
    var tentative = req.body.tentative;
    var apsInRange = req.body.apsInRange;

    var result = '{ipAddr: ' + ipAddr +
	', apIpAddr: ' + apIpAddr +
	', apsInRange: ' + apsInRange + '}';

    res.send(result);
});

module.exports = router;
