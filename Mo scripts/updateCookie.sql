-- USE AccountaBuddiesDatabase;
-- GO
-- CREATE PROCEDURE updateCookie 
--     @userID int,
--     @cookie nvarchar(50)
-- AS 
-- BEGIN TRY
--     SET NOCOUNT ON;
--     BEGIN TRANSACTION
--     	IF (COUNT(Select * FROM usersTable WHERE id = @userID) == 1)
-- 	    	UPDATE usersTable
-- 	    	SET cookie = @cookie
-- 	    	WHERE id = @userID
--             RETURN 0;
--         ELSE
--             RETURN 1;
--     END TRANSACTION
-- END TRY
-- BEGIN CATCH
-- 	--error handling/printing
-- END CATCH
-- GO





CREATE DEFINER=``@`` PROCEDURE `updateCookie`(
    IN _userID nvarchar(50), 
    IN _cookie nvarchar(50)
)

BEGIN
    if ((select * from usersTable where id = _userID) IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'userID not found'
        END IF;
    if (_cookie IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = '_cookie was NULL'
        END IF

    UPDATE usersTable
    SET cookie = _cookie
    where id = _userID 
END