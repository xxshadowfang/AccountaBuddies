CREATE TABLE `group` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
    `admin_id` int(11) NOT NULL,
    `name` varchar(40) NOT NULL UNIQUE,
    `motto` varchar(40) NOT NULL UNIQUE,
    `amount_members` int(11) DEFAULT 0,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `group_fk_adminID` FOREIGN KEY (`admin_id`) REFERENCES `user` (`id`)
);

SELECT * FROM `group`;

INSERT INTO `accounta_buddies`.`group`
(
`admin_id`,
`name`,
`motto`)
VALUES(
4,
'First group hello world',
'fsu');

