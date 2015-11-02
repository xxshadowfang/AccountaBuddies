DELIMITER $$
-- doesGoalExist
DROP PROCEDURE IF EXISTS `doesGoalExist` $$
CREATE DEFINER=`root`@`%` PROCEDURE `doesGoalExist`(
	IN _goalId int
)
BEGIN
	IF ((SELECT COUNT(*) FROM goal WHERE id = _goalId)) = 0 THEN
        SIGNAL SQLSTATE '20000'
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
        SIGNAL SQLSTATE '10000'
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
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
	
    if (_nsfw = 'undefined') THEN
		SET _nsfw = 1;
        END IF;
        
	CALL doesUserExist(_userId);
    CALL doesGoalExist(_goalId);
    
    INSERT INTO `comment` (goalId, userId, `text`, rating, nsfw, createdAt, updatedAt)
    VALUES (_goalId, _userId, _text, _rating, _nsfw, now(), now());
    
    SELECT last_insert_id() AS `id`;
END $$

-- addUserToGroup
DROP PROCEDURE IF EXISTS `addUserToGroup` $$
CREATE DEFINER=`root`@`%` PROCEDURE `addUserToGroup`(
	IN _userId int,
    IN _groupId int
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId = 'undefined') THEN SIGNAL SQLSTATE '39000'
        SET MESSAGE_TEXT = 'groupId was null';
        END IF;
        
	IF (SELECT COUNT(*) FROM group_users__user_groups WHERE user_groups = _userId AND group_users = _groupId) != 0 THEN
		SIGNAL SQLSTATE '30001'
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
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_name = 'undefined') THEN SIGNAL SQLSTATE '29001'
        SET MESSAGE_TEXT = 'goal name was null';
        END IF;
        
    CALL doesUserExist(_userId);
    
    INSERT INTO goal (userId, `status`, `name`, duration, numSteps, description, createdAt, updatedAt)
    VALUES (_userId, _status, _name, 0, 0, _description, now(), now());
    
    SELECT last_insert_id() AS `id`;
END $$

-- createGroup
DROP PROCEDURE IF EXISTS `createGroup` $$
CREATE DEFINER=`root`@`%` PROCEDURE `createGroup`(
	IN _userId int(11),
	IN _name varchar(255),
	IN _motto varchar(255)
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_name = 'undefined') THEN SIGNAL SQLSTATE '39001'
        SET MESSAGE_TEXT = 'group name was null';
        END IF;
	IF (_motto = 'undefined') THEN SIGNAL SQLSTATE '39002'
		SET MESSAGE_TEXT = 'group motto was null';
		END IF;
        
	CALL doesUserExist(_userId);
	
	INSERT INTO `group` (userId, `name`, motto, userCount, createdAt, updatedAt)
	VALUES (_userId, _name, _motto, 1, now(), now());
	
    CALL addUserToGroup(_userId, last_insert_id());
    
	SELECT last_insert_id() AS `id`;
END $$

-- deleteGoal
DROP PROCEDURE IF EXISTS `deleteGoal` $$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteGoal`(
	IN _goalId int,
    IN _userId int
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
    
	CALL doesGoalExist(_goalId);
	
    if (SELECT userId FROM goal WHERE id = _goalId) != _userId THEN
		SIGNAL SQLSTATE '25000'
        SET MESSAGE_TEXT = 'You must be the owner of this goal to delete it.';
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
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_commentId = 'undefined') THEN SIGNAL SQLSTATE '49000'
        SET MESSAGE_TEXT = 'commentId was null';
        END IF;
        
	IF (SELECT userId FROM `comment` WHERE id = _commentId) != _userId THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'You must be the owner of this comment to delete it.';
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
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
    
    if (SELECT userId FROM `group` WHERE id = _groupId) != _userId THEN
		SIGNAL SQLSTATE '35000'
        SET MESSAGE_TEXT = 'You must be the owner of this group to delete it.';
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
    IN _cookie nvarchar(50)
)
BEGIN
    if (_username = 'undefined') THEN SIGNAL SQLSTATE '19001'
        SET MESSAGE_TEXT = 'username was null.';
        END IF;
    if (_salt = 'undefined') THEN SIGNAL SQLSTATE '19002'
        SET MESSAGE_TEXT = 'password was null.';
        END IF;
    if (_cookie = 'undefined') THEN SIGNAL SQLSTATE '19003'
        SET MESSAGE_TEXT = 'cookie was null.';
        END IF;
    
	if (_FirstName = 'undefined') THEN 
		SET _FirstName = '';
        END IF;
    if (_LastName = 'undefined') THEN
		SET _LastName = '';
        END IF;
		
	if (SELECT COUNT(*) FROM user WHERE username = _username) = 1 THEN SIGNAL SQLSTATE '15000'
		SET MESSAGE_TEXT = 'username already exists.';
		END IF;

   
    INSERT INTO user (username, saltedPassword,firstName,lastName,cookie, createdAt, updatedAt, age, gender) 
    VALUES (_username, _salt,_FirstName,_LastName,_cookie, now(), now(), -1, 'U');
	
    SELECT last_insert_id() AS `id`;
END $$

-- removeUserFromGroup
DROP PROCEDURE IF EXISTS `removeUserFromGroup` $$
CREATE DEFINER=`root`@`%` PROCEDURE `removeUserFromGroup`(
	IN _userId int,
    IN _groupId int
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId = 'undefined') THEN SIGNAL SQLSTATE '39000'
        SET MESSAGE_TEXT = 'groupId was null';
        END IF;
        
	IF (SELECT COUNT(*) FROM group_users__user_groups WHERE user_groups = _userId AND group_users = _groupId) = 0 THEN
		SIGNAL SQLSTATE '35001'
        SET MESSAGE_TEXT = 'User must be in the group to remove them.';
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
	if (_userID = 'undefined') THEN SIGNAL SQLSTATE '19000'
		SET MESSAGE_TEXT = 'userID was NULL.';
        END IF;
    if (select COUNT(*) from user where id = _userID) = 0 THEN SIGNAL SQLSTATE '10000'
        SET MESSAGE_TEXT = 'userID not found.';
        END IF;
    if (_cookie = 'undefined') THEN SIGNAL SQLSTATE '19003'
        SET MESSAGE_TEXT = '_cookie was NULL.';
        END IF;

    UPDATE user
    SET cookie = _cookie,
		updatedAt = now()
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
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
       
	if (SELECT userId FROM goal WHERE id = _goalId) != _userId THEN
		SIGNAL SQLSTATE '25000'
        SET MESSAGE_TEXT = 'You must be the owner of this goal for that action.';
		END IF;
    
	CALL doesGoalExist(_goalId);
	CALL doesUserExist(_userId);
    
    UPDATE goal 
    SET `status` = _status,
		`name` = _name,
		description = _description,
		updatedAt = now()
	WHERE id = _goalId;
END $$

-- addStepToGoal
DROP PROCEDURE IF EXISTS `addStepToGoal` $$
CREATE DEFINER=`root`@`%` PROCEDURE `addStepToGoal`(
	IN _goalId int(11),
	IN _title varchar(30),
    IN _description varchar(255),
    IN _duration int(11),
    IN _sequence int(11)
)
BEGIN
	DECLARE numberSteps INT;
    
	if (_title = 'undefined') THEN SIGNAL SQLSTATE '29002'
        SET MESSAGE_TEXT = 'title was null';
        END IF;
	if (_description = 'undefined') THEN SIGNAL SQLSTATE '29003'
        SET MESSAGE_TEXT = 'description was null';
        END IF;
	if (_goalId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
	if (_sequence = 'undefined') THEN SIGNAL SQLSTATE '29004'
        SET MESSAGE_TEXT = 'sequence was null';
        END IF;
        
	CALL doesGoalExist(_goalId);
    
    INSERT INTO step (goalId, title, description, sequence, progress, amountWorked, createdAt, updatedAt)
    VALUES (_goalId, _title, _description, _sequence, 0, 0, now(), now());
    
    SET numberSteps = (SELECT numSteps FROM goal WHERE id = _goalId);
    SET numberSteps = numberSteps + 1;
    
    UPDATE goal
    SET numSteps = numberSteps
    WHERE id = _goalId;
    
    SELECT last_insert_id() AS `id`;
END $$

-- removeStepFromGoal
DROP PROCEDURE IF EXISTS `removeStepFromGoal` $$
CREATE DEFINER=`root`@`%` PROCEDURE `removeStepFromGoal`(
	IN _goalId int(11),
	IN _stepId int(11),
    IN _userId int(11)
)
BEGIN
	if (_goalId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null.';
        END IF;
	if (_stepId = 'undefined') THEN SIGNAL SQLSTATE '29005'
        SET MESSAGE_TEXT = 'stepId was null.';
        END IF;
    if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null.';
        END IF;
    
	CALL doesStepExist(_stepId);
    CALL doesUserExist(_userId);
	CALL doesGoalExist(_goalId);
    
    if (SELECT userId FROM goal WHERE id = _goalId <> _userId)
    THEN 
		SIGNAL SQLSTATE '25000'
        SET MESSAGE_TEXT = 'You must be the owner of this goal for that action.';
        END IF;
    
    DELETE FROM step
    WHERE id = _stepId;
END $$

-- updateUserInfo`
DROP PROCEDURE IF EXISTS `updateUserInfo` $$
CREATE DEFINER=`root`@`%` PROCEDURE `updateUserInfo`(
    IN _loginId int,
    IN _firstName varchar(255),
    IN _lastName varchar(255),
    IN _age int,
    IN _gender varchar(1)
)
BEGIN
    if (_loginID = 'undefined') THEN SIGNAL SQLSTATE '19004'
		SET MESSAGE_TEXT = 'loginID was NULL';
        END IF;

    UPDATE user
    SET updatedAt = now(),
		firstName = _firstName,
        lastName = _lastName,
        age = _age,
        gender = _gender
    WHERE id = _loginId;
	
	SELECT firstName, lastName, age, gender FROM user WHERE id = _loginId;
END $$

-- doesStepExist
DROP PROCEDURE IF EXISTS `doesStepExist` $$
CREATE DEFINER=`root`@`%` PROCEDURE `doesStepExist`(
    IN _stepId int
)
BEGIN
	IF ((SELECT COUNT(*) FROM step WHERE id = _stepId)) = 0 THEN
        SIGNAL SQLSTATE '20002'
		SET MESSAGE_TEXT = 'Step does not exist';
		END IF;
END $$

-- deleteUser
DROP PROCEDURE IF EXISTS `deleteUser` $$
CREATE DEFINER=`root`@`%` PROCEDURE `deleteUser`(
	IN _userId int,
    IN _loginId int
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_loginId = 'undefined') THEN SIGNAL SQLSTATE '19004'
        SET MESSAGE_TEXT = 'loginId was null';
        END IF;
    
	CALL doesUserExist(_userId);
    
    if (SELECT id FROM user WHERE id = _userId) != _loginId THEN
		SIGNAL SQLSTATE '15001'
        SET MESSAGE_TEXT = 'You must be the owner of this user to delete it.';
		END IF;
       
    DELETE FROM user
    WHERE id = _userId;
END $$

-- getGoalList
DROP PROCEDURE IF EXISTS `getGoalList` $$
CREATE DEFINER=`root`@`%` PROCEDURE `getGoalList`(
	IN _userId int
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
       
    CALL doesUserExist(_userId);   
	-- TODO: change this to be a real value for progress
	SELECT `name`, createdAt, numSteps
    FROM goal
    WHERE userId = _userId;
END $$