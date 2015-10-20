CREATE TABLE `comment` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
    `goal_id` int(11) NOT NULL,
    `user_id` int(11) NOT NULL,
    `rating` int(11) NOT NULL,
    `nsfw` bit NOT NULL,
    `text` varchar(255) NOT NULL,
    PRIMARY KEY (`id`),
    CONSTRAINT `comment_fk_goal_id` FOREIGN KEY (`goal_id`) REFERENCES `goal` (`id`),
    CONSTRAINT `comment_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
);

SELECT * FROM `comment`;

INSERT INTO `accounta_buddies`.`comment`
(
`goal_id`,
`user_id`,
`rating`,
`nsfw`,
`text`)
VALUES(
2,
4,
3,
1,
'helloworld');

-- make sure the rating is between 1 and 5
DELIMITER $$
CREATE TRIGGER chk_rating BEFORE INSERT ON `comment`
	for each row begin
		IF NEW.rating > 5 OR NEW.rating < 1 THEN
			SIGNAL SQLSTATE '45000'   
			SET MESSAGE_TEXT = 'Invalid rating. Must be between 1 and 5.';
		END IF;
	end$$
DELIMITER ;