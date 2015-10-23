CREATE TABLE `group_goal` (
	`group_id` int(11) NOT NULL,
    `goal_id` int(11) NOT NULL,
    PRIMARY KEY (`group_id`, `goal_id`),
    CONSTRAINT `group_goal_fk_group_id` FOREIGN KEY (`group_id`) REFERENCES `group` (`id`),
    CONSTRAINT `group_goal_fk_goal_id` FOREIGN KEY (`goal_id`) REFERENCES `goal` (`id`)
);

SELECT * FROM `group_goal`;