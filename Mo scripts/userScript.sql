CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Username` varchar(30) NOT NULL,
  `salt` char(60) NOT NULL,
  `FirstName` varchar(15) NOT NULL,
  `LastName` varchar(20) NOT NULL,
  `Age` int,
  `Gender` char,
  `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

SELECT * FROM user;

-- prepared statement
INSERT INTO `user` (`Username`, `salt`, `FirstName`, `LastName`,`Age`,`Gender`)
VALUES (
	'Collin', 'trowbrct@rose-hulm3an.edu', '2309487320852', 'cdog', 'trow'
);