<%@ Page Language="C#" AutoEventWireup="true" CodeFile="Register.aspx.cs" Inherits="Register" %>

<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <link rel="stylesheet" type="text/css" href="StyleSheet.css" />
    <title></title>
</head>
<body>
    <div class="header">
        <span> <img src="logo.png" height="98"/> </span>
        <span id="headerTitle">Register a User Account</span>
        <span class="right"></span>
    </div>

    <form id="form1" runat="server">
    <h1 class="center">AccountaBuddies</h1>
    <div>
        <h2>Register a new account!</h2>
        <div id="invalidLoginAttempt" runat="server" visible="false"></div>
        <asp:Label runat="server">Desired Username</asp:Label>
        <asp:TextBox runat="server" id="userName"></asp:TextBox>
        <!-- Do we want to insert a button here to click to check if the username is valid/available? -->
        <span id="usernameEntered" runat="server" visible="false"></span> <br /> <br />
        <asp:Label runat="server">Password</asp:Label>
        <asp:TextBox runat="server" id="password"></asp:TextBox> 
        <span id="passwordEntered" runat="server" visible="false"></span> <br /> <br />
        <asp:Label runat="server">Confirm Password</asp:Label>
        <asp:TextBox runat="server" id="confirmPassword"></asp:TextBox> 
        <span id="passwordsMatch" runat="server" visible="false"></span> <br /> <br />

        <asp:Button runat="server" ID="registerButton" Text="Register" OnClick="register" />
    </div> <br />

    <a href="Default.aspx">Back to home page</a>

    </form>
</body>
</html>
