var express = require('express');
var router = express.Router();
var database = require('./../lib/database.js');
var infojobs = require('./../lib/infojobs.js');
var tagCloud = require('tag-cloud');
var fortune = require('./../lib/fortune.js');
var maxResults = 30;

module.exports = function(app) {

    app.get('/',function(req,res) {
	req.session.fail = false;
	database.countOffers(function(err,count) {
	    moreOffers = false;
	    if ( count > 10 ) {
		moreOffers = 1;
	    }
	    database.pagingOffers(10,0,function(err,rows) {
		res.render('home',{
		    title:"ijif",
		    nick: req.session.nick,
		    offers: rows,
		    moreOffers: false
		});
	    });
	});
    });

    app.get('/offers',function(req,res) {
	req.session.fail = false;
	database.countOffers(function(err,count) {
	    moreOffers = false;
	    console.log(count);
	    console.log(parseInt(req.query.p)*10);
	    if ( count > parseInt(req.query.p)*10 ) {
		moreOffers = req.query.p+1;
	    }
	    database.pagingOffers(10,parseInt(req.query.p)*10,function(err,rows) {
		res.render('offers',{
		    title:"ijif",
		    nick: req.session.nick,
		    offers: rows,
		    layout: false,
		});
	    });
	});
    });

    app.get('/searches',function(req,res) {
	req.session.fail = false;
	database.lastSearches(100,function(err,searches) {
	    var tags = {};
	    for(var i=0;i<searches.length;i++) {
		if ( searches[i]['keywords'] ) {
		    if ( tags.hasOwnProperty(searches[i]['keywords']) ) {
			tags[searches[i]['keywords']]++;
		    } else {
			tags[searches[i]['keywords']]=1;
		    }
		}
	    }
	    var tagsArray = [];
	    Object.keys(tags).forEach(function(key,index) {
		tagsArray.push({tagName: key,count: tags[key]});
	    });
	    var cloud = ""
	    tagCloud.tagCloud(tagsArray, function (err, data) {
		cloud = data;
		res.render('searches',{
		    title:"ijif",
		    cloud: cloud,
		    nick: req.session.nick
		});

	    }, {
		randomize: false,
		classPrefix: 'tag',
		additionalAttributes: { onclick: "$('#q').val('{{tag}}');searchScript($('#q').val());" }
	    });
	});
    });

    app.get('/comments',function(req,res) {
	req.session.fail = false;
	database.lastComments(10,function(err,comments) {
	    res.render('comments',{
		title:"ijif",
		nick: req.session.nick,
		comments: comments
	    });
	});
    });

    var registerRoutes = require('./registerRoutes.js');
    registerRoutes(app);

    var chatRoutes = require('./chatRoutes.js');
    chatRoutes(app);

    var sendPasswordRoutes = require('./sendPasswordRoutes.js');
    sendPasswordRoutes(app);

    var offerRoutes = require('./offer.js');
    offerRoutes(app);

    var postCommentRoutes = require('./postCommentRoutes.js');
    postCommentRoutes(app);

    var sessionRoutes = require('./sessionRoutes.js');
    sessionRoutes(app);

    var payRoutes = require('./payRoutes.js');
    payRoutes(app);

    app.get('/search',function(req,res) {
	infojobs.getOffers(req.query.q,maxResults,function(err,offers) {
	    res.render('searchResults',{
		offers: offers, q: req.query.q, layout: false});
	});
	if ( req.session.nick ) {
	    database.insertSearch(req.query.q,req.session.nick);
	}
    });


    app.get('/about',function(req,res) {
	res.render('about',{
	    title: "About ijif",
	    fortune: fortune.getFortune(),
	    pageTestScript: "/qa/about-tests.js",
	    nick: req.session.nick
	});
    });

    app.get('/terms',function(req,res) {
	res.render('terms',{
	    title: "Términos",
	    fortune: fortune.getFortune(),
	    pageTestScript: "/qa/about-tests.js",
	    nick: req.session.nick
	});
    });

}
