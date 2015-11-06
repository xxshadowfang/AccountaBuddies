CREATE DEFINER=``@`` PROCEDURE `createGroup`(
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
END