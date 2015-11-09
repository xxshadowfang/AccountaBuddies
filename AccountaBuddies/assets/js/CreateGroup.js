/**
 * Created by mot on 11/7/15.
 */


$(document).ready(function(){

  $("#create-group-btn").click(function(){
    console.log("?");


    var name = $("#groupName").val();
    var description = $("#groupDescription").val();
    var motto = $("#motto").val();
    var password = $("#groupPassword").val();


    Util.createGroup(name,motto,description,password,function(body){
      if(body.success){
        alert("create group succeeded")
      }
      else{
        alert(body.content);
      }

    })
  })

})
