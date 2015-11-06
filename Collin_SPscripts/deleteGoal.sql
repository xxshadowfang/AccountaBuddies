CREATE DEFINER=``@`` PROCEDURE `deleteGoal`(
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
        
	CALL doesUserExist(_userId);
    
    DELETE FROM goal
    WHERE id = _goalId;
END