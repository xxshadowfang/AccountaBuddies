CREATE DEFINER=``@`` PROCEDURE `createGoal`(
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
END