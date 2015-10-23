USE AccountaBuddiesDatabase;
GO
CREATE PROCEDURE addModifyUser 
    @Username nvarchar(50) NOT NULL,
    @salt nvarchar(50) NOT NULL, 
    @FirstName nvarchar(50),
    @Age int,
    @Gender char
AS 
BEGIN TRY
    SET NOCOUNT ON;
    BEGIN TRANSACTION
    	IF (COUNT(Select * FROM usersTable WHERE userName = @Username) == 0)
		    INSERT INTO usersTable (userName, saltedPassword, name, age, gender)
		    VALUES (@Username, @salt, @Name, @Age, @Gender)
	    ELSE
	    	UPDATE usersTable
	    	SET name=@Name, age=@Age, gender=@Gender
	    	WHERE userName=@Username
    END TRANSACTION
END TRY
BEGIN CATCH
	--error handling/printing
END CATCH
GO
