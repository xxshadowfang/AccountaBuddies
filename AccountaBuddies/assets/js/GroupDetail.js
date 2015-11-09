/**
 * Created by mot on 11/7/15.
 */

var id = groupId;
var password = 123;
var template = _.template(`<tr>
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
          Util.joinGroup(1, 123, function (body) {
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
      content.forEach(function(e){
        var firstName = e.firstName || "None";
        var username = e.username || "None";
        $("#memberTable").append(
          template({username:username,firstName:firstName})
        )
      })

    }
    else{
      alert(body.content);
    }
  })




});
