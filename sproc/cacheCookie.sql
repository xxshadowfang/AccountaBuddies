CREATE DEFINER=``@`` PROCEDURE `cacheCookies`()
BEGIN
	SELECT id, cookie
    FROM user
    WHERE LENGTH(cookie) = 36;
END