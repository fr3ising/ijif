function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
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
module.exports.validatePassword = validatePassword;
module.exports.checkUri = checkUri;
module.exports.randomPassword = randomPassword;
