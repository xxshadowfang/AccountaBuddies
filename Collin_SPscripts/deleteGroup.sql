CREATE DEFINER=``@`` PROCEDURE `deleteGroup`(
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
END