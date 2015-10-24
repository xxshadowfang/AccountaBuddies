-- USE AccountaBuddiesDatabase;
-- GO
-- CREATE PROCEDURE deleteUser 
--     @Username nvarchar(50) NOT NULL,
--     @salt nvarchar(50) NOT NULL, 
--     @userID nvarchar(50)
-- AS 
-- BEGIN TRY
--     SET NOCOUNT ON;
--     BEGIN TRANSACTION
--     	IF (COUNT(Select * FROM usersTable WHERE userName = @Username and salt = @salt and id = @userID) == 1)
-- 		    delete from usersTable where id = @userID;
--             RETURN 0;
-- 	    ELSE
-- 	    	RETURN 1;
--     END TRANSACTION
-- END TRY
-- BEGIN CATCH
-- 	--error handling/printing
-- END CATCH
-- GO



CREATE DEFINER=``@`` PROCEDURE `deleteUser`(
    IN _username nvarchar(50), 
    IN _salt nvarchar(50),
    IN _userID nvarchar(50),
)

BEGIN

    if ((Select * from usersTable where id = _userID) IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'user not found'
        END IF
    if ((Select * from usersTable where id = _userID and salt = _salt and username = _username) IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'Incorrect username or password'
        END IF


   
    delete from usersTable where id = _userID

END