<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Default.aspx.cs" Inherits="_Default" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link rel="stylesheet" type="text/css" href="StyleSheet.css" />
    <title></title>
</head>
<body>
    <div class="header">
        <span> <img src="logo.png" height="98"/> </span>
        <span id="headerTitle">AccountaBuddies</span>
        <span class="right"></span>
    </div>

    <form id="form1" runat="server">
    <h1 class="center">AccountaBuddies</h1>
    <div>

        <h2>Log In</h2>
        <div id="invalidLoginAttempt" visible="false"></div>
        <asp:Label runat="server">Username</asp:Label>
        <input type="text" name="username" /><br />
        <span id="usernameEntered" visible="false"></span> <br /> <br />
        <asp:Label runat="server">Password</asp:Label>
        <input type="text" name="password" /><br />
        <span id="passwordEntered" visible="false"></span> <br /> <br />

        <input type="submit" value="Log In" />
    </div> <br />

    <a href="Register.aspx">Don't have an account yet?  Click here to sign up!</a>

    </form>
</body>
</html>
