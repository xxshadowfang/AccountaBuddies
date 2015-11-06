CREATE DEFINER=``@`` PROCEDURE `registerUser`(
    IN _username nvarchar(50), 
    IN _salt nvarchar(255),
    IN _FirstName nvarchar(50),
    IN _LastName nvarchar(50),
    IN _Age int,
    IN _Gender varchar(1),
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
        
	if (SELECT COUNT(*) FROM user WHERE username = _username) = 1 THEN SIGNAL SQLSTATE '45003'
		SET MESSAGE_TEXT = 'username already exists';
		END IF;

   
    INSERT INTO user (username, saltedPassword,firstName,lastName,age,gender,cookie) 
    VALUES (_username, _salt,_FirstName,_LastName,_Age,_Gender,_cookie);
	
    SELECT id FROM user WHERE username = _username LIMIT 1;
END