-- USE AccountaBuddiesDatabase;
-- GO
-- CREATE PROCEDURE createUser 
--     @Username nvarchar(50) NOT NULL,
--     @salt nvarchar(50) NOT NULL, 
--     @FirstName nvarchar(50),
--     @LastName nvarchar(50),
--     @Age int,
--     @Gender char,
--     @cookie nvarchar(50) NOT NULL
-- AS 
-- BEGIN TRY
--     SET NOCOUNT ON;
--     BEGIN TRANSACTION
--     	IF (COUNT(Select * FROM usersTable WHERE userName = @Username) == 0)
-- 		    INSERT INTO usersTable (userName, saltedPassword, FirstName, LastName, age, gender,cookie)
-- 		    VALUES (@Username, @salt, @FirstName, @LastName, @Age, @Gender,@cookie)
--             RETURN 0;  
-- 	    ELSE
-- 	    	RETURN 1;
--     END TRANSACTION
-- END TRY
-- BEGIN CATCH
-- 	--error handling/printing
-- END CATCH
-- GO


CREATE DEFINER=``@`` PROCEDURE `registerUser`(
    IN _username nvarchar(50), 
    IN _salt nvarchar(50),
    IN _FirstName nvarchar(50),
    IN _LastName nvarchar(50),
    IN _Age int,
    IN _Gender char,
    IN _cookie nvarchar(50)
)

BEGIN
    if (_username IS NULL) THEN SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'username was null';
        END IF;
    if (_salt IS NULL) THEN SIGNAL SQLSTATE '45001'
        SET MESSAGE_TEXT = 'password was null';
        END IF;
    if (_cookie IS NULL) THEN SIGNAL SQLSTATE '45002'
        SET MESSAGE_TEXT = 'cookie was null';
        END IF;

   
    INSERT INTO user (username, salt,FirstName,LastName,Age,Gender,cookie) 
    VALUES (_username, _salt,_FirstName,_LastName,_Age,_Gender,_cookie);
END