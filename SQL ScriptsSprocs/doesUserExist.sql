USE AccountaBuddiesDatabase;
GO
CREATE PROCEDURE dbo.doesUserExist 
    @Username nvarchar(50) NOT NULL,
    @salt nvarchar(50) NOT NULL
AS 
BEGIN TRY
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        SELECT * FROM users
        WHERE userName = @Username AND saltedPassword = @salt
        VALUES (@Username, @salt, @FirstName, @LastName)
    END TRANSACTION
END TRY
BEGIN CATCH
	--error handling/printing
END CATCH
GO
