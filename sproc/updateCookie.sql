CREATE DEFINER=``@`` PROCEDURE `updateCookie`(
    IN _userID int, 
    IN _cookie varchar(50)
)
BEGIN
	if (_userID IS NULL) THEN SIGNAL SQLSTATE '45555'
		SET MESSAGE_TEXT = 'userID was NULL';
        END IF;
    if (select COUNT(*) from user where id = _userID) = 0 THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userID not found';
        END IF;
    if (_cookie IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = '_cookie was NULL';
        END IF;

    UPDATE user
    SET cookie = _cookie
    WHERE id = _userID;
END