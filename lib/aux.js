
var format = require('format-number');

function validateNick(nick)
{
    var re = /^[^0-9]\w+$/;
    return re.test(nick);
}

function validateEmail(email) 
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function replaceLatins(q)
{
    var replacements = { "á": "a",
			 "é": "e",
			 "í": "i",
			 "ó": "o",
			 "ú": "u",
			 "ñ": "?" };
    var keys = Object.keys(replacements);
    for(var i in keys) {
	var re = new RegExp(keys[i],"gi");
	q = q.replace(re,replacements[keys[i]]);
    }
    return q;
}

function changeDateInRows(rows,hours)
{
    var nrows = [];
    if ( rows ) {
	for(var i=0;i<rows.length;i++) {
	    if ( rows[i]['idate'] ) {
		var d = new Date(rows[i]['idate']);
		d = new Date(d.getTime()+hours*60*60*1000);
		rows[i]['idate'] = d;
		nrows.push(rows[i]);
	    }
	}
	return nrows;
    }
    return [];
}

function intToCash(x)
{
    return format({suffix: ' €'})(Math.round(x),{"integerSeparator":'.',"decimalsSeparator":','});
}

function periodToInt(period)
{
    if ( period.match(/mes/gi) ) {
	return 12
    } else if ( period.match(/hora/gi) ) {
	return 8*5*48;
    } else {
	return 1;
    }
}

function payToInt(pay)
{
    return parseInt(pay.
		    replace(".","").replace("€","").replace(" ",""));
}

function randomPassword() 
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 6; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function validatePassword(password) {
    var ren = /[A-Za-z]+/;
    var rel = /\d+/;
    return (rel.test(password)) && (ren.test(password)) && (password.length > 6);
}

function checkUri(uri,callback) {
    var request = require('request');
    var options = {
	uri: uri,
	port: 80,
	method: 'GET',
	timeout: 30000,
	json: false
    };
    request.get(uri, options, function (err, result) {
	callback(err,result);
    });
}

module.exports.validateEmail = validateEmail;
module.exports.validateNick = validateNick;
module.exports.validatePassword = validatePassword;
module.exports.checkUri = checkUri;
module.exports.randomPassword = randomPassword;
module.exports.payToInt = payToInt;
module.exports.periodToInt = periodToInt;
module.exports.intToCash = intToCash;
module.exports.changeDateInRows = changeDateInRows;
module.exports.replaceLatins = replaceLatins;
