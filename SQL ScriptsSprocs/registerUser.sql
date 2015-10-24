USE AccountaBuddiesDatabase;
GO
CREATE PROCEDURE dbo.registerUser 
    @Username nvarchar(50) NOT NULL,
    @salt nvarchar(50) NOT NULL
AS 
BEGIN TRY
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO users (userName, saltedPassword)
        VALUES (@Username, @salt)
    END TRANSACTION
END TRY
BEGIN CATCH
	--error handling/printing
END CATCH
GO
