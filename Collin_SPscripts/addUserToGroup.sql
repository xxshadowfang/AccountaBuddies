CREATE DEFINER=``@`` PROCEDURE `addUserToGroup`(
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
END