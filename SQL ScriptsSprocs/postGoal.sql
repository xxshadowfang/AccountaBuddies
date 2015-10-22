USE AccountaBuddiesDatabase;
GO
CREATE PROCEDURE dbo.postGoal 
    @userID int NOT NULL,
    @goalName varchar(50) NOT NULL,
    @goalText nvarchar(2000) NOT NULL
AS 
BEGIN TRY
    SET NOCOUNT ON;
    BEGIN TRANSACTION
        INSERT INTO goals (user, name, description)
        VALUES (@userID, @goalName, @goalText)
    END TRANSACTION
END TRY
BEGIN CATCH
	--error handling/printing
END CATCH
GO
