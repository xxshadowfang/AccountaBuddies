CREATE DEFINER=``@`` PROCEDURE `deleteGoalComment`(
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
        
	CALL doesUserExist(_userId);
    
    DELETE FROM `comment`
    WHERE id = _commentId;
END