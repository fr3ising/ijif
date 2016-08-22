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

function search(keyword)
{
    twitbot.get('search/tweets', {q: keyword}, function(error, tweets, response) {
	console.log(tweets);
    });
}

function mentions(keyword)
{
    // twitbot.stream('statuses/filter',{track:['fwijif']},function(stream) {
    // 	stream.on('data', function(tweet) {
    // 	    console.log(tweet.text);
    // 	});
    // 	stream.on('error', function(error) {
    // 	    console.log(error);
    // 	});
    // });   
    twitbot.get('statuses/mentions_timeline',function(error, tweets, response) {
    	console.log(tweets);
	
    });
}

module.exports.twit = twit;
module.exports.search = search;
module.exports.mentions = mentions;
