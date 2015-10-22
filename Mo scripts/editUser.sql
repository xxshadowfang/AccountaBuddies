-- USE AccountaBuddiesDatabase;
-- GO
-- CREATE PROCEDURE editUser 
--     @userID int NOT NULL,
--     @salt nvarchar(50) NOT NULL, 
--     @FirstName nvarchar(15),
--     @LastName nvarchar(20),
--     @Age int,
--     @Gender char
-- AS 
-- BEGIN TRY
--     SET NOCOUNT ON;
--     BEGIN TRANSACTION
--     	IF (COUNT(Select * FROM usersTable WHERE id = @UserID) == 0)
-- 		    RETURN 1;
-- 	    ELSE
-- 	    	UPDATE usersTable
-- 	    	SET FirstName=@FirstName, LastName=@LastName, Age=@Age, Gender=@Gender, salt = @salt
-- 	    	WHERE id=@userID
--             RETURN 0;
--     END TRANSACTION
-- END TRY
-- BEGIN CATCH
-- 	--error handling/printing
-- END CATCH
-- GO



CREATE DEFINER=``@`` PROCEDURE `editUser`(
    IN userID int,
    IN _salt nvarchar(50),
    IN _FirstName nvarchar(50),
    IN _LastName nvarchar(50),
    IN _Age int,
    IN _Gender char,
)




BEGIN
    if ((SELECT * from usersTable WHERE id = userID) IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'user not found'
        END IF;


    if (_salt IS NOT NULL)
        UPDATE usersTable
        SET salt = _salt
        where id = userID
        END IF;
    if (_FirstName IS NOT NULL)
        UPDATE usersTable
        SET FirstName = _FirstName
        where id = userID
        END IF;
    if (_LastName IS NOT NULL)
        UPDATE usersTable
        SET LastName = _LasttName
        where id = userID
        END IF;
     if (_Age IS NOT NULL)
        UPDATE usersTable
        SET Agt = _Age
        where id = userID
        END IF;
     if (_Gender IS NOT NULL)
        UPDATE usersTable
        SET Gender = _Gender
        where id = userID
        END IF;


END