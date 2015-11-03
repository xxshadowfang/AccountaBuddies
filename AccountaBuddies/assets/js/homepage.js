/**
 * Created by mot on 10/23/15.
 */

$(document).ready(function(){
  console.log('homepage');
  $("#register-btn").click(function(){
    var username = $("#input-username").val();
    var password = $("#input-password").val();
    var confirm = $("#input-confirm").val();
    if(password !== confirm){
      alert("password not match");
    }
    console.log("start register")
    Util.register(username,password,"X","Y",function(body){
        if (body.success){
          alert("register succeeded");
          window.location = "/login";
        }
        else{
          alert(body.content);
        }
    })


  });
});
