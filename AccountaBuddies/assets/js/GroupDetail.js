/**
 * Created by mot on 11/7/15.
 */

var id = groupId;
var template = _.template(`<tr id="member<%=id%>">
                <td><%=username%></td>
                <td><%=firstName%></td>
            </tr>`);


$(document).ready(function(){
  Util.findGroup(id,function(body){
    console.log(body);
    var content = body.body.content;
    $("#groupName").html(content.name);
    $("#groupDescription").html(content.description);
    $("#motto").html(content.motto);


    if(content.isOwner=="1"){
      $("#joinLeave").html("My Group");
    }

    else {


      if (content.isJoined == "0") {
        $("#joinLeave").click(function () {
          Util.joinGroup(id, $("#password").val(), function (body) {
            if (body.success) {
              alert("join group succeeded");
              $("#joinLeave").html("Joined");
              $("#joinLeave").click(false);
            }
            else {
              alert(body.content);
            }
          })
        })

      }
      else {
        $("#joinLeave").html("Joined");
      }


    }

  })

  Util.getGroupMembers(id,function(body){
    if(body.success){
      var content = body.body.content;
      console.log(content);
      $("#numMembers").html(content.length);
      content.forEach(function(e){
        var firstName = e.firstName || "None";
        var username = e.username || "None";
        var id = e.id || "";



        $("#memberTable").append(
          template({username:username,firstName:firstName,id:id})
        )

        $("#member"+id).click(function(){
          window.location = "/user/profile?id="+id;
        })

      })

    }
    else{
      alert(body.content);
    }
  })




});
