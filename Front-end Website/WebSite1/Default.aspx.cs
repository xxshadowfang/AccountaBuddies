using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class _Default : System.Web.UI.Page
{
    protected void Page_Load(object sender, EventArgs e)
    {

    }

    protected void logIn(object sender, EventArgs e)
    {
        string uName = userName.Text;
        string pass = password.Text;
        bool valid = true;
        invalidLoginAttempt.Visible = false;
        if (uName.Length < 1)
        {
            valid = false;
            usernameEntered.InnerText = "You must enter in a valid username to log in.";
            usernameEntered.Visible = true;
        } else
        {
            usernameEntered.Visible = false;
        }

        if (pass.Length < 1)
        {
            valid = false;
            passwordEntered.InnerText = "You must enter in your password to log in.";
            passwordEntered.Visible = true;
        } else
        {
            passwordEntered.Visible = false;
        }

        if (valid && !pass.Equals("12345"))
        {
            valid = false;
            invalidLoginAttempt.InnerText = "Incorrect username/password.  Please correct your username or password and try again.";
            invalidLoginAttempt.Visible = true;
        }

        if (valid)
        {
            Response.Redirect("Homepage.aspx");
        }
    }
}