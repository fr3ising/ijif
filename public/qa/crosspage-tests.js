var Browser = require('zombie');
var assert = require('chai').assert;

var browser;

suite('Cross-Page Tests', function() {

    setup(function() {
	browser = new Browser();
    });

    test('requesting a video listing from the porn category page '+
	 'should populate the referrer field', function(done) {
	     var referrer = 'http://localhost:3000/categories/porn';
	     browser.visit(referrer, function() {
		 browser.clickLink('.videoList', function() {
		     assert(browser.field('referrer').value === referrer);
		     done();
		 });
	     });
	 });

    test('visiting the "video list" page directly should result '+
	 'in an empty referrer field', function(done) {
	     browser.visit('http://localhost:3000/categories/video-list',
			   function() {
			       assert(browser.field('referrer').value === '');
			       done();
			   });
	 });
});

