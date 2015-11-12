DELIMITER $$
-- doesGoalExist
DROP PROCEDURE IF EXISTS `doesGoalExist` $$
CREATE  PROCEDURE `doesGoalExist`(
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
CREATE  PROCEDURE `doesUserExist`(
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
CREATE  PROCEDURE `addGoalComment`(
	IN _userId int,
    IN _goalId int,
    IN _text varchar(255)
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;

        
	CALL doesUserExist(_userId);
    CALL doesGoalExist(_goalId);
    
    INSERT INTO `comment` (goalId, userId, `text`, createdAt, updatedAt)
    VALUES (_goalId, _userId, _text, now(), now());
    
    SELECT last_insert_id() AS `id`;
END $$

-- addUserToGroup
DROP PROCEDURE IF EXISTS `addUserToGroup` $$
CREATE  PROCEDURE `addUserToGroup`(
	IN _userId int,
    IN _groupId int,
    IN _password varchar(255)
)
BEGIN
	DECLARE numUsers int;
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId = 'undefined') THEN SIGNAL SQLSTATE '39000'
        SET MESSAGE_TEXT = 'groupId was null';
        END IF;
    if (_password = 'undefined') THEN
		SET _password = '';
        END IF;
	
        
	IF (SELECT COUNT(*) FROM group_users__user_groups WHERE user_groups = _userId AND group_users = _groupId) != 0 THEN
		SIGNAL SQLSTATE '30001'
        SET MESSAGE_TEXT = 'user is already in this group';
        END IF;
	
    IF (SELECT `password` FROM `group` WHERE id = _groupId) <> _password THEN SIGNAL SQLSTATE '35002'
		SET MESSAGE_TEXT = 'invalid group password';
        END IF;
        
	INSERT INTO group_users__user_groups (group_users, user_groups)
    VALUES (
		_groupId, _userId
    );
    
    SET numUsers = (SELECT COUNT(*) FROM group_users__user_groups WHERE group_users = _groupId);
    
    UPDATE `group`
    SET userCount = numUsers
    WHERE id = _groupId;
END $$

-- cacheCookies
DROP PROCEDURE IF EXISTS `cacheCookies` $$
CREATE  PROCEDURE `cacheCookies`()
BEGIN
	SELECT id, cookie
    FROM user
    WHERE LENGTH(cookie) = 36;
END $$

-- createGoal
DROP PROCEDURE IF EXISTS `createGoal` $$
CREATE  PROCEDURE `createGoal`(
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
    

    INSERT INTO goal (userId, `status`, `name`, duration, numSteps, description, createdAt, updatedAt, progress)
    VALUES (_userId, _status, _name, 0, 0, _description, now(), now(), 0);

    
    SELECT last_insert_id() AS `id`;
END $$

-- createGroup
DROP PROCEDURE IF EXISTS `createGroup` $$
CREATE  PROCEDURE `createGroup`(
	IN _userId int(11),
	IN _name varchar(255),
	IN _motto varchar(255),
    IN _description varchar(255),
    IN _password varchar(255)
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
	IF (_password = 'undefined') THEN
		SET _password = '';
		END IF;
	IF (_description = 'undefined') THEN SIGNAL SQLSTATE '39003'
		SET MESSAGE_TEXT = 'group description was null';
		END IF;
        
	CALL doesUserExist(_userId);
	
	INSERT INTO `group` (userId, `name`, motto, userCount, createdAt, updatedAt, description, `password`)
	VALUES (_userId, _name, _motto, 1, now(), now(), _description, _password);
	
    CALL addUserToGroup(_userId, last_insert_id(), _password);
    
	SELECT last_insert_id() AS `id`;
END $$

-- deleteGoal
DROP PROCEDURE IF EXISTS `deleteGoal` $$
CREATE  PROCEDURE `deleteGoal`(
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
    
    DELETE FROM step
    WHERE goalId = _goalId;
    
    DELETE FROM goal
    WHERE id = _goalId;
END $$

-- deleteGoalComment
DROP PROCEDURE IF EXISTS `deleteGoalComment` $$
CREATE  PROCEDURE `deleteGoalComment`(
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
CREATE  PROCEDURE `deleteGroup`(
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
CREATE  PROCEDURE `registerUser`(
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
CREATE  PROCEDURE `removeUserFromGroup`(
	IN _userId int,
    IN _groupId int
)
BEGIN
	DECLARE numUsers int;
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
        
	IF (SELECT COUNT(*) FROM `group` WHERE userId = _userId AND id = _groupId) = 1 THEN
		DELETE FROM `group`
        WHERE id = _groupId;
        END IF;
        
	DELETE FROM `group_users__user_groups`
    WHERE group_users = _groupId AND user_groups = _userId;
    
    SET numUsers = (SELECT COUNT(*) FROM group_users__user_groups WHERE group_users = _groupId);
    
    UPDATE `group`
    SET userCount = numUsers
    WHERE id = _groupId;
END $$

-- updateCookie
DROP PROCEDURE IF EXISTS `updateCookie` $$
CREATE  PROCEDURE `updateCookie`(
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
CREATE  PROCEDURE `updateGoal`(
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
CREATE  PROCEDURE `addStepToGoal`(
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
	if (_duration = 'undefined') THEN
		SET _duration = 1;
        END IF;
        
	CALL doesGoalExist(_goalId);
    
    INSERT INTO step (goalId, title, description, sequence, progress, amountWorked, createdAt, updatedAt, duration)
    VALUES (_goalId, _title, _description, _sequence, 0, 0, now(), now(), _duration);
    
	SET numberSteps = (SELECT COUNT(*) FROM step WHERE goalId = _goalId);
    
    UPDATE goal
    SET numSteps = numberSteps
    WHERE id = _goalId;
    
    SELECT last_insert_id() AS `id`;
END $$

-- removeStepFromGoal
DROP PROCEDURE IF EXISTS `removeStepFromGoal` $$
CREATE  PROCEDURE `removeStepFromGoal`(
	IN _goalId int(11),
	IN _stepId int(11),
    IN _userId int(11)
)
BEGIN
	DECLARE numberSteps int;
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
    
    if (SELECT userId FROM goal WHERE id = _goalId) <> _userId
    THEN 
		SIGNAL SQLSTATE '25000'
        SET MESSAGE_TEXT = 'You must be the owner of this goal for that action.';
        END IF;
    
    DELETE FROM step
    WHERE id = _stepId;
    
    SET numberSteps = (SELECT COUNT(*) FROM step WHERE goalId = _goalId);
    
    UPDATE goal
    SET numSteps = numberSteps
    WHERE id = _goalId;
END $$

-- doesGroupExist
DROP PROCEDURE IF EXISTS `doesGroupExist` $$
CREATE  PROCEDURE `doesGroupExist`(
	IN _groupId int
)
BEGIN
	IF ((SELECT COUNT(*) FROM `group` WHERE id = _groupId)) = 0 THEN
        SIGNAL SQLSTATE '30000'
		SET MESSAGE_TEXT = 'Group does not exist';
		END IF;
END $$

-- updateUserInfo`
DROP PROCEDURE IF EXISTS `updateUserInfo` $$
CREATE  PROCEDURE `updateUserInfo`(
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
CREATE PROCEDURE `doesStepExist`(
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
CREATE  PROCEDURE `deleteUser`(
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
CREATE PROCEDURE `getGoalList`(
	IN _userId int
)
BEGIN
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
       
    CALL doesUserExist(_userId);   
	-- TODO: change this to be a real value for progress

	SELECT id, progress, `name`, createdAt, numSteps

    FROM goal
    WHERE userId = _userId;
END $$

-- getGroupInfo
DROP PROCEDURE IF EXISTS `getGroupInfo` $$
CREATE PROCEDURE `getGroupInfo`(
	IN _userId int(11),
	IN _groupId int(11)
)
BEGIN
	DECLARE isOwner int;
	DECLARE isJoined int;
        
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_groupId = 'undefined') THEN SIGNAL SQLSTATE '39000'
        SET MESSAGE_TEXT = 'groupId was null';
        END IF;
        
	CALL doesGroupExist(_groupId);
	CALL doesUserExist(_userId);
    
    SET isOwner = (SELECT COUNT(*) FROM `group` WHERE id = _groupId AND userId = _userId);
    SET isJoined = (SELECT COUNT(*) FROM `group_users__user_groups` WHERE group_users = _groupId AND user_groups = _userId);
    
    SELECT `name`, description, motto
    FROM `group`
    WHERE id = _groupId;
    
    SELECT isOwner, isJoined;
END $$

-- getGroupList
DROP PROCEDURE IF EXISTS `getGroupList` $$
CREATE  PROCEDURE `getGroupList`(
	IN _userId int(11),
    IN _joined int
)
BEGIN
	IF (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
		SET MESSAGE_TEXT = 'user id is null.';
        END IF;
    
	if (_joined = '0') THEN
		-- bring back all groups saying whether user is owner or joined
        SELECT `group`.id, `name`, motto, userCount, userId AS ownerId, createdAt, user_groups AS isJoined
        FROM (
			SELECT * FROM group_users__user_groups
            WHERE user_groups = _userId
        ) as filtered
        RIGHT JOIN `group`
        ON (`group`.id = group_users);
        
        END IF;
        
	if (_joined = '1') THEN
		CALL doesUserExist(_userId);
		-- bring back just groups that users are in
		SELECT `group`.id, `name`, motto, userCount, userId AS ownerId, createdAt
			FROM `group`
			JOIN group_users__user_groups
			ON (`group`.id = group_users__user_groups.group_users)
			WHERE group_users__user_groups.user_groups = _userId;
			
        END IF;
END $$

-- getGroupMembers
DROP PROCEDURE IF EXISTS `getGroupMembers` $$
CREATE  PROCEDURE `getGroupMembers`(
	IN _groupId int(11)
)
BEGIN
	IF (_groupId = 'undefined') THEN SIGNAL SQLSTATE '39000'
		SET MESSAGE_TEXT = 'user id is null.';
        END IF;
    
    CALL doesGroupExist(_groupId);
    

    SELECT user.id, username, firstName
    FROM user JOIN group_users__user_groups
    ON user.id = group_users__user_groups.user_groups
    WHERE group_users__user_groups.group_users = _groupId;
END $$

-- updateGoalProgress
DROP PROCEDURE IF EXISTS `updateGoalProgress` $$
CREATE  PROCEDURE `updateGoalProgress`(
    IN _goalId int
)
BEGIN
	DECLARE _progress double;
	if (_goalId = 'undefined') THEN SIGNAL SQLSTATE '29000'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
    
    SET _progress = (SELECT SUM(amountWorked) / SUM(duration) FROM step WHERE goalId = _goalId);
    
    UPDATE goal
    SET progress = _progress
    WHERE id = _goalId;
END $$

-- updateStep
DROP PROCEDURE IF EXISTS `updateStep` $$
CREATE  PROCEDURE `updateStep`(
	IN _stepId int,
    IN _userId int,
    IN _amountWorked int
)
BEGIN
	DECLARE _goalId int;
	if (_stepId = 'undefined') THEN SIGNAL SQLSTATE '29005'
        SET MESSAGE_TEXT = 'stepId was null';
        END IF;
	if (_userId = 'undefined') THEN SIGNAL SQLSTATE '19000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_amountWorked = 'undefined') THEN SIGNAL SQLSTATE '29006'
		SET MESSAGE_TEXT = 'amount worked was null';
        END IF;
	
     
	SET _goalId = (SELECT goalId FROM step WHERE id = _stepId);
    
	IF (SELECT COUNT(*) FROM `goal` WHERE id = _goalId AND userId = _userId) = 0 THEN SIGNAL SQLSTATE '25000'
		SET MESSAGE_TEXT = 'you must be the owner of this goal for this action.';
        END if;
	
    UPDATE step
    SET amountWorked = _amountWorked,
		progress = _amountWorked / duration
    WHERE id = _stepId;
    
    CALL updateGoalProgress(_goalId);
END $$

-- completeGoal
DROP PROCEDURE IF EXISTS `completeGoal` $$
CREATE DEFINER=`root`@`%` PROCEDURE `completeGoal`(
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
       
	if (SELECT userId FROM goal WHERE id = _goalId) != _userId THEN
		SIGNAL SQLSTATE '25000'
        SET MESSAGE_TEXT = 'You must be the owner of this goal for that action.';
		END IF;
        
	UPDATE step
    SET amountWorked = duration
    WHERE goalId = _goalId;
    
    CALL updateGoalProgress(_goalId);
END $$