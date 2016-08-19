-- CREATE DATABASE freiworld
-- CREATE USER 'freising'@'localhost' IDENTIFIED by 'password';
-- GRANT ALL PRIVILEGES ON freiworld.* TO 'freising'@'localhost';
-- FLUSH PRIVILEGES;

CREATE TABLE offers (
       id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
       ijid VARCHAR(255),
       user_id INTEGER REFERENCES users(id),
       published DATE,
       minPay INTEGER,
       maxPay INTEGER,
       link VARCHAR(255),
       studiesMin TEXT,
       company TEXT,
       city VARCHAR(255),
       province VARCHAR(255),
       minRequirements TEXT,
       description TEXT,        
       title CHAR(128) COLLATE utf8_spanish_ci NOT NULL DEFAULT '',
       idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       karma DECIMAL(10,2) DEFAULT '7.00',
       UNIQUE KEY ijid (ijid));


-- DROP TABLE IF EXISTS users;
CREATE TABLE users (
       id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
       nick CHAR(32) COLLATE utf8_spanish_ci NOT NULL DEFAULT '',
       password CHAR(64) COLLATE utf8_spanish_ci NOT NULL DEFAULT '',
       email CHAR(64) COLLATE utf8_spanish_ci NOT NULL DEFAULT '',
       karma DECIMAL(10,2) DEFAULT '7.00',
       idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
       UNIQUE KEY nick (nick),
              KEY email (email),
       	      KEY karma (karma));

-- INSERT INTO users (nick,password,email) VALUES ("freising",PASSWORD('password'),"freising.denuevo@gmail.com");

-- DROP TABLE IF EXISTS links;
-- CREATE TABLE links (
--        id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
--        user_id INTEGER REFERENCES users(id),
--        uri VARCHAR(255),
--        title TEXT,
--        comment TEXT,
--        karma DECIMAL(10,2) DEFAULT '7.00',
--        idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
--        UNIQUE KEY uri (uri));

-- DROP TABLE IF EXISTS comments;

CREATE TABLE comments (
       id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       offer_id INTEGER REFERENCES offers(id),
       idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       comment TEXT,
       karma DECIMAL(10,2) DEFAULT '7.00');

CREATE TABLE searches (
       id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       keywords TEXT,
       idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       karma DECIMAL(10,2) DEFAULT '7.00');

-- DROP TABLE IF EXISTS chats;
CREATE TABLE chats (
       id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
       user_id INTEGER REFERENCES users(id),
       idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
       message TEXT);

-- CREATE TABLE votes (
--        id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
--        user_id INTEGER REFERENCES users(id),
--        link_id INTEGER REFERENCES links(id),
--        karma DECIMAL(10,2),
--        idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);

-- CREATE TABLE cvotes (
--        id INTEGER PRIMARY KEY AUTO_INCREMENT PRIMARY KEY,
--        user_id INTEGER REFERENCES users(id),
--        comment_id INTEGER REFERENCES comments(id),
--        karma DECIMAL(10,2),
--        idate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);


       
