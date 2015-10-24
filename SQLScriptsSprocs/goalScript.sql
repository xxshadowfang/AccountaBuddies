CREATE TABLE `goal` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
    `owner_id` int(11) NOT NULL,
    `name` varchar(50) NOT NULL,
    `description` varchar(100) NOT NULL,
    -- figure this out
    `status` int(11) NOT NULL,
    `created_date` datetime DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`id`),
    CONSTRAINT `goal_fk_userID` FOREIGN KEY (`owner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

SELECT * FROM goal;

INSERT INTO `accounta_buddies`.`goal`
(
`owner_id`,
`name`,
`description`,
`status`)
VALUES (
4,
'First Goal',
'This is a description',
2);

-- make sure the status is 1 2 or 3
DELIMITER $$
CREATE TRIGGER chk_status BEFORE INSERT ON `goal`
	for each row begin
		if NEW.status not in (1,2,3) THEN
			SIGNAL SQLSTATE '45000'   
			SET MESSAGE_TEXT = 'Invalid status. Must be between 1 and 3.';
		END IF;
	end$$
DELIMITER ;

