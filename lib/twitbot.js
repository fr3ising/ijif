var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var fs = require('fs');
var Twitter = require('twitter');
var login = JSON.parse(fs.readFileSync(data_dir+'/twitter.json').toString());

var twitbot = new Twitter({consumer_key: login['consumer_key'],
			   consumer_secret: login['consumer_secret'],
			   access_token_key: login['access_token_key'],
			   access_token_secret: login['access_token_secret']});

function twit(msg)
{
    console.log(twitbot);
    twitbot.post('statuses/update',{status: msg},
		 function(error,tweet,response) {
		     if ( ! error ) {
		     } else {
			 console.log(error);
		     }
		 });
}

module.exports.twit = twit;
