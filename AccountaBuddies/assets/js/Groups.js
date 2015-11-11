/**
 * Created by mot on 11/7/15.
 */
var joinGroup = function (id) {
  var password = $("#password" + id).val();
  Util.joinGroup(id, password, function (body) {
    if (body.success) {
      alert("join group succeeded");
      $("#joinLeave" + id).html("Leave");
      $("#joinLeave" + id).off('click');
      $("#joinLeave" + id).click(function(){
        leaveGroup(id);
      })
      //$("#joinLeave"+id).click(leaveGroup(id));
      $("#tableRow" + id + " .userCount").html(parseInt($("#tableRow" + id + " .userCount").html()) + 1);


      Util.GetJoinGroupList(function (body) {
        if (body.success) {
          renderJoinedGroups(body.body.content)
        }
        else {
          console.log(body.content);
        }
      })

    }
    else {
      alert(body.content);
    }
  })
};

var leaveGroup = function (id) {
  Util.leaveGroup(id, function (body) {
    if (body.success) {
      alert("leave Group Succeeded");
      $("#joinLeave" + id).html("Join");
      $("#joinLeave" + id).off('click');
      $("#joinLeave"+id).click(function(){
        joinGroup(id);
      });


      $("#tableRow" + id + " .userCount").html($("#tableRow" + id + " .userCount").html() - 1);


      Util.GetJoinGroupList(function (body) {
        if (body.success) {
          renderJoinedGroups(body.body.content)
        }
        else {
          console.log(body.content);
        }
      })

    }
    else {
      alert(body.content);
    }
  })
}


var renderGroups = function (groupList) {
  console.log(groupList);
  $("#allGroupsTable").html(
    `<h1><u>All Groups</u></h1>

    <table id="allGroupsTable">
    <tr>
      <th>Name</th>
      <th>Motto</th>
      <th>Number of Users</th>
      <th>Creation Date</th>
      <th>Join/Leave?</th>
    </tr>

    </table>`
  );

  groupList.forEach(function (e) {
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
      template({name: name, motto: motto, numUsers: userCount, date: date, buttonText: buttonText, id: id})
    );

    $("#tableRow" + id+ " .normal").click(function () {
      window.location = '/group/detailPage?id=' + id;
    });

    $("#joinLeave" + id).click(false);
    $("#password" + id).click(false);

    if (isOwner) {
      return;
    }


    if (isJoined) {
      $("#joinLeave" + id).html("leave");
      $("#joinLeave" + id).click(function(){
        leaveGroup(id);
      });
    }
    else {
      $("#joinLeave" + id).click(function(){
        joinGroup(id);
      });
    }
  })


};


var renderJoinedGroups = function (groupList) {
  console.log(groupList);
  $("#myGroupsTable").html(
    `<h1><u>My Groups</u></h1>

    <table id="myGroupsTable">
    <tr>
      <th>Name</th>
      <th>Motto</th>
      <th>Number of Users</th>
      <th>Creation Date</th>
      <th>Leave?</th>
    </tr>

    </table>`
  );
  groupList.forEach(function (e) {
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
      joinedTemplate({name: name, motto: motto, numUsers: userCount, date: date, buttonText: buttonText, id: id})
    )

    $("#joinedTableRow" + id).click(function () {
      window.location = '/group/detailPage?id=' + id;
    });

    $("#password" + id).click(false);
    $("#joinedLeave" + id).click(false);


    if(!isOwner) {
      $("#joinedLeave" + id).click(function () {

        $(this).html("leave");
        Util.leaveGroup(id, function (body) {
          if (body.success) {
            alert("leave Group Succeeded");
            $(this).html("Join");
            $("#joinedTableRow" + id).remove();

            Util.getAllGroups(function (body) {
              if (body.success) {
                renderGroups(body.body.content)
              }
              else {
                console.log(body.content)
              }
            });
          }
          else {
            alert(body.content);
          }
        })
      })
    }



  })


}


var template = _.template(`<tr id="tableRow<%=id%>">
  <td class="normal"><%=name %></td>
<td class="normal"><%=motto%></td>
<td class="userCount normal"><%=numUsers%></td>
<td class="normal"><%=date%></td>
<td><button id="joinLeave<%=id%>"><%=buttonText%></button> Password: <input type="text" id="password<%=id%>" /></td>

</tr>`);


var joinedTemplate = _.template(`<tr id="joinedTableRow<%=id%>">
  <td class="normal"><%=name %></td>
<td class="normal"><%=motto%></td>
<td class="userCount normal"><%=numUsers%></td>
<td class="normal"><%=date%></td>
<td><button id="joinedLeave<%=id%>"><%=buttonText%></button></td>

</tr>`);


$(document).ready(function () {
  $("#createGroup").click(function () {
    window.location = '/group/createPage';
  })


  Util.getAllGroups(function (body) {
    if (body.success) {
      renderGroups(body.body.content)
    }
    else {
      console.log(body.content)
    }
  });

  Util.GetJoinGroupList(function (body) {
    if (body.success) {
      renderJoinedGroups(body.body.content)
    }
    else {
      console.log(body.content);
    }
  })


  $("#cmn-toggle-7").click(function () {
    if ($("#allGroups").hasClass('invisible')) {
      $("#allGroups").removeClass('invisible');
      $("#myGroups").addClass('invisible');
    }
    else {
      $("#allGroups").addClass('invisible');
      $("#myGroups").removeClass('invisible');
    }


  })


})
