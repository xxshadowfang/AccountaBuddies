CREATE DEFINER=``@`` PROCEDURE `doesUserExist`(
	IN _userId int
)
BEGIN
	IF ((SELECT COUNT(*) FROM user WHERE id = _userId)) = 0 THEN
        SIGNAL SQLSTATE '45000'
		SET MESSAGE_TEXT = 'User does not exist';
		END IF;
END