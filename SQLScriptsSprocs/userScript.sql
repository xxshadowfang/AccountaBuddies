CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(30) NOT NULL,
  `email` varchar(40) NOT NULL,
  `salted_pw` char(60) NOT NULL,
  `first_name` varchar(15) NOT NULL,
  `last_name` varchar(20) NOT NULL,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

SELECT * FROM user;

-- prepared statement
INSERT INTO `user` (`username`, `email`, `salted_pw`, `first_name`, `last_name`)
VALUES (
	'Collin', 'trowbrct@rose-hulm3an.edu', '2309487320852', 'cdog', 'trow'
);