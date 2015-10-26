DELIMITER $$
-- doesGoalExist
DROP PROCEDURE IF EXISTS `doesGoalExist` $$
CREATE DEFINER=`root`@`%` PROCEDURE `doesGoalExist`(
	IN _goalId int
)
BEGIN
	IF ((SELECT COUNT(*) FROM goal WHERE id = _goalId)) = 0 THEN
        SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Goal does not exist';
		END IF;
END $$

-- doesUserExist
DROP PROCEDURE IF EXISTS `doesUserExist` $$
CREATE DEFINER=`root`@`%` PROCEDURE `doesUserExist`(
	IN _userId int
)
BEGIN
	IF ((SELECT COUNT(*) FROM user WHERE id = _userId)) = 0 THEN
        SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'User does not exist';
		END IF;
END $$

-- addGoalComment
DROP PROCEDURE IF EXISTS `addGoalComment` $$
CREATE DEFINER=`root`@`%` PROCEDURE `addGoalComment`(
	IN _userId int,
    IN _goalId int,
    IN _text varchar(255),
    IN _rating int,
    IN _nsfw bit
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
	
    if (_nsfw IS NULL) THEN
		SET _nsfw = 1;
        END IF;
        
	CALL doesUserExist(_userId);
    CALL doesGoalExist(_goalId);
    
    INSERT INTO `comment` (goalId, userId, `text`, rating, nsfw)
    VALUES (_goalId, _userId, _text, _rating, _nsfw);
    
    SELECT id
    FROM `comment`
    WHERE goalId = _goalId
    AND userId = _userId
    AND `text` = _text;
END $$

-- addUserToGroup
DROP PROCEDURE IF EXISTS `addUserToGroup` $$
CREATE DEFINER=`root`@`%` PROCEDURE `addUserToGroup`(
	IN _userId int,
    IN _groupId int
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'groupId was null';
        END IF;
        
	IF (SELECT COUNT(*) FROM group_users__user_groups WHERE user_groups = _userId AND group_users = _groupId) != 0 THEN
		SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'user is already in this group';
        END IF;
        
	INSERT INTO group_users__user_groups (group_users, user_groups)
    VALUES (
		_groupId, _userId
    );
END $$

-- cacheCookies
DROP PROCEDURE IF EXISTS `cacheCookies` $$
CREATE DEFINER=`root`@`%` PROCEDURE `cacheCookies`()
BEGIN
	SELECT id, cookie
    FROM user
    WHERE LENGTH(cookie) = 36;
END $$

-- createGoal
DROP PROCEDURE IF EXISTS `createGoal` $$
CREATE DEFINER=`root`@`%` PROCEDURE `createGoal`(
	IN _userId int(11),
    IN _status int(11),
    IN _name varchar(50),
    IN _description varchar(255)
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_name IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'goal name was null';
        END IF;
        
    CALL doesUserExist(_userId);
    
    INSERT INTO goal (userId, `status`, `name`, description)
    VALUES (_userId, _status, _name, _description);
    
    SELECT id
    FROM goal
    WHERE userId = _userId AND `name` = _name;
END $$

-- createGroup
DROP PROCEDURE IF EXISTS `createGroup` $$
CREATE DEFINER=`root`@`%` PROCEDURE `createGroup`(
	IN _userId int(11),
	IN _name varchar(255),
	IN _motto varchar(255)
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_name IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'group name was null';
        END IF;
	IF (_motto IS NULL) THEN SIGNAL SQLSTATE '45002'
		SET MESSAGE_TEXT = 'motto was null';
		END IF;
        
	CALL doesUserExist(_userId);
	
	INSERT INTO `group` (userId, `name`, motto, userCount)
	VALUES (_userId, _name, _motto, 1);
	
    CALL addUserToGroup(_userId, last_insert_id());
    
	SELECT id
	FROM `group`
	WHERE userId = _userId
	AND `name` = _name;
END $$

-- deleteGoal
DROP PROCEDURE IF EXISTS `deleteGoal` $$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteGoal`(
	IN _goalId int,
    IN _userId int
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
    
    if (SELECT userId FROM goal WHERE id = _goalId) != _userId THEN
		SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'you must be the owner of this goal';
		END IF;
       
	CALL doesUserExist(_userId);
    
    DELETE FROM goal
    WHERE id = _goalId;
END $$

-- deleteGoalComment
DROP PROCEDURE IF EXISTS `deleteGoalComment` $$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteGoalComment`(
	IN _commentId int,
    IN _userId int
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_commentId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'commentId was null';
        END IF;
        
	IF (SELECT userId FROM `comment` WHERE id = _commentId) != _userId THEN
		SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'you cannot delete this comment';
        END IF;
        
	CALL doesUserExist(_userId);
    
    DELETE FROM `comment`
    WHERE id = _commentId;
END $$

-- deleteGroup
DROP PROCEDURE IF EXISTS `deleteGroup` $$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteGroup`(
	IN _groupId int,
    IN _userId int
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
    
    if (SELECT userId FROM `group` WHERE id = _groupId) != _userId THEN
		SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'you must be the owner of this group';
		END IF;
       
	CALL doesUserExist(_userId);
    
    DELETE FROM `group`
    WHERE id = _groupId;
    
    DELETE FROM `group_users__user_groups`
    WHERE group_users = _groupId;
END $$

-- registerUser
DROP PROCEDURE IF EXISTS `registerUser` $$
CREATE DEFINER=`root`@`%` PROCEDURE `registerUser`(
    IN _username nvarchar(50), 
    IN _salt nvarchar(255),
    IN _FirstName nvarchar(50),
    IN _LastName nvarchar(50),
    IN _Age int(11),
    IN _Gender varchar(10),
    IN _cookie nvarchar(50)
)
BEGIN
    if (_username IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'username was null';
        END IF;
    if (_salt IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'password was null';
        END IF;
    if (_cookie IS NULL) THEN SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'cookie was null';
        END IF;
        
	if (SELECT COUNT(*) FROM user WHERE username = _username) = 1 THEN SIGNAL SQLSTATE '45003'
		SET MESSAGE_TEXT = 'username already exists';
		END IF;

   
    INSERT INTO user (username, saltedPassword,firstName,lastName,age,gender,cookie) 
    VALUES (_username, _salt,_FirstName,_LastName,_Age,_Gender,_cookie);
	
    SELECT id FROM user WHERE username = _username LIMIT 1;
END $$

-- removeUserFromGroup
DROP PROCEDURE IF EXISTS `removeUserFromGroup` $$
CREATE DEFINER=`root`@`%` PROCEDURE `removeUserFromGroup`(
	IN _userId int,
    IN _groupId int
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'groupId was null';
        END IF;
        
	IF (SELECT COUNT(*) FROM group_users__user_groups WHERE user_groups = _userId AND group_users = _groupId) = 0 THEN
		SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'user is not in this group';
        END IF;
        
	DELETE FROM `group_users__user_groups`
    WHERE group_users = _groupId AND user_groups = _userId;
END $$

-- updateCookie
DROP PROCEDURE IF EXISTS `updateCookie` $$
CREATE DEFINER=`root`@`%` PROCEDURE `updateCookie`(
    IN _userID int, 
    IN _cookie varchar(50)
)
BEGIN
	if (_userID IS NULL) THEN SIGNAL SQLSTATE '45555'
		SET MESSAGE_TEXT = 'userID was NULL';
        END IF;
    if (select COUNT(*) from user where id = _userID) = 0 THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userID not found';
        END IF;
    if (_cookie IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = '_cookie was NULL';
        END IF;

    UPDATE user
    SET cookie = _cookie
    WHERE id = _userID;
END $$

-- updateGoal
DROP PROCEDURE IF EXISTS `updateGoal` $$
CREATE DEFINER=`root`@`%` PROCEDURE `updateGoal`(
	IN _goalId int,
	IN _userId int,
    IN _status int,
    IN _name varchar(50),
    IN _description varchar(255)
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
       
	if (SELECT userId FROM goal WHERE id = _goalId) != _userId THEN
		SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'you must be the owner of this goal';
		END IF;
    
	CALL doesUserExist(_userId);
    
    UPDATE goal 
    SET `status` = _status,
		`name` = _name,
		description = _description
	WHERE id = _goalId;
END $$