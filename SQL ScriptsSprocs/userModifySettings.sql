USE AccountaBuddiesDatabase;
GO
CREATE PROCEDURE dbo.userModifySettings 
    @Username nvarchar(50) NOT NULL,
    @FirstName nvarchar(50),
    @LastName nvarchar(50),
    @Motto nvarchar(50)
AS 
BEGIN TRY
    SET NOCOUNT ON;
    BEGIN TRANSACTION
            UPDATE users
            SET firstName=@FirstName, lastName=@LastName, motto=@Motto
            WHERE userName=@Username
    END TRANSACTION
END TRY
BEGIN CATCH
	--error handling/printing
END CATCH
GO
