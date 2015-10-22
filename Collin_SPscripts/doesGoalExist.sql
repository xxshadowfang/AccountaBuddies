CREATE DEFINER=``@`` PROCEDURE `doesGoalExist`(
	IN _goalId int
)
BEGIN
	IF ((SELECT COUNT(*) FROM goal WHERE id = _goalId)) = 0 THEN
        SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'Goal does not exist';
		END IF;
END