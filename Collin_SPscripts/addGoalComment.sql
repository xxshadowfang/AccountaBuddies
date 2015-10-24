CREATE DEFINER=``@`` PROCEDURE `addGoalComment`(
	IN _userId int,
    IN _goalId int,
    IN _text varchar(255),
    IN _rating int
)
BEGIN
	if (_userId IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userId was null';
        END IF;
	if (_goalId IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'goalId was null';
        END IF;
        
	CALL doesUserExist(_userId);
    CALL doesGoalExist(_goalId);
    
    INSERT INTO `comment` (goalId, userId, `text`, rating)
    VALUES (_goalId, _userId, _text, _rating);
    
    SELECT id
    FROM `comment`
    WHERE goalId = _goalId
    AND userId = _userId
    AND `text` = _text;
END