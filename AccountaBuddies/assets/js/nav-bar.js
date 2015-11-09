/**
 * Created by mot on 11/3/15.
 */


$(document).ready(function(){
  $("#logout").click(function(){
    Util.logout(function(body){
      if(body.success){
        alert("Logout Succeeded");
      }
      else{
        alert(body.content);
      }
    })
  })

  $.cookie


});
