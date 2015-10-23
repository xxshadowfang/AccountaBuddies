CREATE TABLE `user_group` (
	`user_id` int(11) NOT NULL,
    `group_id` int(11) NOT NULL,
    PRIMARY KEY (`user_id`, `group_id`),
    CONSTRAINT `user_group_fk_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`),
    CONSTRAINT `user_group_fk_group_id` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`)
);

SELECT * FROM `user_group`;

INSERT INTO `accounta_buddies`.`user_group`
(`user_id`,
`group_id`)
VALUES
(4,
2);
