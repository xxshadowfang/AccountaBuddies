/**
 * Created by mot on 11/7/15.
 */

var renderGroups = function(groupList){
  console.log(groupList);

  groupList.forEach(function(e){
    var id = e.id;
    var isJoined = e.isJoined || false;
    var isOwner = e.isOwner || false;
    var motto = e.motto || "None";
    var name = e.name || "None";
    var userCount = e.userCount || 0;
    var date = e.date || "None";
    var buttonText = isJoined ? "Leave" : "Join";

    buttonText = isOwner ? "My Group" : buttonText;

    $("#allGroupsTable").append(
      template({name:name,motto:motto,numUsers:userCount,date:date,buttonText:buttonText,id:id})
    )

    $("#tableRow"+id).click(function(){
      window.location = '/group/detailPage?id='+id;
    })

    $("#joinLeave"+id).click(false);
    $("#password"+id).click(false);

    if(isOwner){
      return;
    }


    $("#joinLeave"+id).click(function(){
      if(isJoined){
        $(this).html("leave");
        Util.leaveGroup(id,function(body){
          if(body.success){
            alert("leaver Group Succeeded");
            $(this).html("Join");
          }
          else{
            alert(body.content);
          }
        })
      }
      else{
        var password = $("#password"+id).val();
        Util.joinGroup(id,password,function(body){
            if(body.success){
              alert("join group succeeded");
              $(this).html("Leave");
            }
            else{
              alert(body.content);
            }
        })
      }
    })



  })
}




var renderJoinedGroups = function(groupList){
  console.log(groupList);

  groupList.forEach(function(e){
    var id = e.id;
    var isJoined = e.isJoined || false;
    var isOwner = e.isOwner || false;
    var motto = e.motto || "None";
    var name = e.name || "None";
    var userCount = e.userCount || 0;
    var date = e.date || "None";
    var buttonText = isJoined ? "Leave" : "Join";

    buttonText = isOwner ? "My Group" : buttonText;

    $("#myGroupsTable").append(
      template({name:name,motto:motto,numUsers:userCount,date:date,buttonText:buttonText,id:id})
    )

    $("#tableRow"+id).click(function(){
      window.location = '/group/detailPage?id='+id;
    })

    $("#password"+id).click(false);
    $("#joinLeave"+id).click(false);

    $("#joinLeave"+id).click(function(){
      if(isJoined){
        $(this).html("leave");
        Util.leaveGroup(id,function(body){
          if(body.success){
            alert("leaver Group Succeeded");
            $(this).html("Join");
          }
          else{
            alert(body.content);
          }
        })
      }
      else{
        //TO DO !!!!!!!!
        //TO DO
        //TO DO
        //TO DO

        Util.joinGroup(id,password,function(body){

        })
      }
    })



  })
}


var template = _.template(`<tr id="tableRow<%=id%>">
  <td><%=name %></td>
<td><%=motto%></td>
<td><%=numUsers%></td>
<td><%=date%></td>
<td><button id="joinLeave<%=id%>"><%=buttonText%></button> Password: <input type="text" id="password<%=id%>" /></td>

</tr>`)

$(document).ready(function(){
  $("#createGroup").click(function(){
    window.location = '/group/createPage';
  })


  Util.getAllGroups(function(body){
    if(body.success){
      renderGroups(body.body.content)
    }
    else{
      console.log(body.content)
    }
  });

  Util.GetJoinGroupList(function(body){
    if(body.success){
        renderJoinedGroups(body.body.content)
    }
    else{
      console.log(body.content);
    }
  })


  $("#cmn-toggle-7").click(function(){
      if($("#allGroups").hasClass('invisible')){
        $("#allGroups").removeClass('invisible');
        $("#myGroups").addClass('invisible');
      }
      else{
        $("#allGroups").addClass('invisible');
        $("#myGroups").removeClass('invisible');
      }



  })


})
