CREATE DEFINER=``@`` PROCEDURE `updateGoal`(
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
        
	CALL doesUserExist(_userId);
    
    UPDATE goal 
    SET `status` = _status,
		`name` = _name,
		description = _description
	WHERE id = _goalId;
END