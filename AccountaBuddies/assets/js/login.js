/**
 * Created by mot on 10/23/15.
 */


$(document).ready(function(){
  $('#btn-login').click(function(){
    var username = $('#username').val();
    var password = $('#password').val();

    Util.login(username,password,function(body){
      if(body.success){
        alert('logged in');

        console.log($.cookie('cookie'));
      }

      else{
        alert("Invalid username or password");
      }
    })

  })

})
