var data_dir = process.env.OPENSHIFT_DATA_DIR || "./";
var fs = require('fs');
var mysql = require('mysql');
var login = JSON.parse(fs.readFileSync(data_dir+'/mysql.json').toString());

var server_ip_address = process.env.OPENSHIFT_MYSQL_DB_HOST || '127.0.0.1';
var server_port = process.env.OPENSHIFT_MYSQL_DB_PORT || 3306;

var pool = mysql.createPool({
    port     : server_port,
    host     : server_ip_address,
    user     : login['user'],
    password : login['password'],
    database : login['database'],
    connectionLimit: login['connectionLimit']
});

function userByNick(nick,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT * FROM users WHERE nick=?;",
			 [nick],function(err,rows) {
			     callback(err,rows);
			 });
	if (connection) connection.release();
    });
}

function linkByUri(uri,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT * FROM links WHERE uri=?;",
			 [uri],function(err,rows) {
			     callback(err,rows);
			 });
	if (connection) connection.release();
    });
}

function offerById(id,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT a.*,b.nick FROM offers a,users b WHERE a.id=? AND a.user_id=b.id;",
			 [id],function(err,rows) {
			     connection.query(
				 "SELECT a.*,b.nick FROM comments a,users b WHERE a.offer_id=? AND a.user_id=b.id;",
				 [id],function(err,crows) {
				     if ( !err ) {
					 callback(err,{rows:rows,comments:crows});
				     } else {
					 console.log(err);
				     }
				 });
			 });
	if (connection) connection.release();
    });
}

function userByEmail(nick,callback) 
{
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT * FROM users WHERE email=?;",
			 [nick],function(err,rows) {
			     callback(err,rows);
			 });
	if (connection) connection.release();
    });
}

function insertUser(nick,email,password,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("INSERT INTO users (nick,email,password) VALUES (?,?,PASSWORD(?));",
			 [nick,email,password],function(err,rows) {
			     callback(err);
			     insertChat("Nuevo usuario registrado; Bienvenido "+nick+" !",
					nick,false,function(err,rows) {});
			 });
	if (connection) connection.release();
    });
}    

function insertComment(offerId,comment,nick,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT id FROM users WHERE nick=?;",[nick],function(err,rows) {
	    connection.query("INSERT INTO comments (user_id,offer_id,comment) VALUES (?,?,?);",
			     [rows[0].id,offerId,comment],function(err,rows) {
				 if ( ! err ) {
				     callback(err,rows);
				     connection.query("SELECT title FROM offers WHERE id=?;",[offerId],
						      function(err,rows) {
							  insertChat(
							      "Nuevo comentario en '"+rows[0].title+
								  "': "+comment,nick,
							      "/link/"+offerId,
							      function(err,rows) {});
						      });

				 } else {
				     console.log(err);
				 }
			     });
	});
	if (connection) connection.release();
    });
}

function insertChat(message,nick,uri,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT id FROM users WHERE nick=?;",[nick],function(err,rows) {
	    if ( ! uri ) {
		connection.query("INSERT INTO chats (user_id,message) VALUES (?,?);",
				 [rows[0].id,message],function(err,rows) {
				     if ( ! err ) {
					 callback(err,rows);
				     } else {
					 console.log(err);
				     }
				 });
	    } else {
		connection.query("INSERT INTO chats (user_id,message,uri) VALUES (?,?,?);",
				 [rows[0].id,message,uri],function(err,rows) {
				     if ( ! err ) {

				     } else {
					 console.log(err);
				     }
				 });
	    }
	});
	if (connection) connection.release();
    });
}

function insertOffer(offer,nick,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT id FROM users WHERE nick=?;",[nick],function(err,rows) {
	    connection.query('INSERT INTO offers (user_id,ijid,title,minPay,maxPay,\
                              link,studiesMin,company,city,province,minRequirements,description)\
                              VALUES (?,?,?,?,?,?,?,?,?,?,?,?);',
	    		     [rows[0].id,
	    		      offer['id'],offer['title'],offer['minPay']['amount'],
			      offer['maxPay']['amount'],
	    		      offer['link'],
			      offer['studiesMin']['value'],
			      offer['profile']['name'],
	    		      offer['city'],
	    		      offer['province']['value'],offer['minRequirements'],
			      offer['description']],
	    		     function(err,rows) {
	    			 if ( ! err ) {
	    			     callback(err,rows.insertId);
	    			 } else {
	    			     console.log(err);
				     connection.query("SELECT * FROM offers WHERE ijid=?",[offer['id']],
						      function(err,rows) {
							  if ( !err ) {
							      callback(err,rows[0]['id']);
							  } else {
							      console.log(err);
							  }
						      });
	    			 }
	    		     });
	});
	if (connection) connection.release();
    });
}    

function updatePassword(nick,password,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("UPDATE users SET password=PASSWORD(?) WHERE nick=?;",[password,nick],
			 function(err,rows) {
			     callback(err,rows);
			 });
    });
}

function signin(nick,password,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT * FROM users WHERE nick=? AND password=PASSWORD(?);",
			 [nick,password],function(err,rows) {
			     callback(err,rows);
			 });
	if (connection) connection.release();
    });
}

function lastOffers(n,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT a.*,b.nick FROM offers a,users b WHERE a.user_id=b.id ORDER BY idate DESC LIMIT ?;",
			 [n],function(err,rows) {
			     callback(err,rows);
			 });
	if (connection) connection.release();
    });
}

function lastChats(n,callback) {
    pool.getConnection(function(err,connection) {
	if ( err ) {
	    if (connection) connection.release();
	    throw err;
	}
	connection.query("SELECT a.*,b.nick FROM chats a,users b WHERE a.user_id=b.id ORDER BY idate DESC LIMIT ?;",
			 [n],function(err,rows) {
			     callback(err,rows);
			 });
	if (connection) connection.release();
    });
}

module.exports.signin = signin;
module.exports.userByNick = userByNick;
module.exports.userByEmail = userByEmail;
module.exports.insertUser = insertUser;
module.exports.linkByUri = linkByUri;
module.exports.offerById = offerById;
module.exports.insertOffer = insertOffer;
module.exports.lastOffers = lastOffers;
module.exports.insertComment = insertComment;
module.exports.updatePassword = updatePassword;
module.exports.insertChat = insertChat;
module.exports.lastChats = lastChats;
