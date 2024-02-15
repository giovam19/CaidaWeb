DROP DATABASE IF EXISTS caida;
CREATE DATABASE caida;
USE caida;

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id			int auto_increment,	
    email		VARCHAR(255),
	name		VARCHAR(255),
    username	VARCHAR(255),
    password	VARCHAR(255),
	PRIMARY KEY (id)
);
