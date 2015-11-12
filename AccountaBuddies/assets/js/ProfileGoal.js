/**
 * Created by mot on 10/31/15.
 */



var template = _.template(
  '<tr id="table<%=id%>"><td><%=name%></td>' +
  '<td><%=date%></td>' +
  '<td><%=numSteps%></td>' +
  '<td>' +
  '<progress value="<%=progress%>" max="100"></progress>' +
  '</td>' +
  '<td>' +
  '<button id="deleteGoal<%=id%>">X</button>' +
  '</td>' +
  '</tr>'
  )

$(document).ready(function(){



  var userId = window.location.search.substring(4)
  console.log(userId);

  if(userId && userId != $.cookie('id')){

    $("#delete-btn").html("View");

    Util.viewUser(userId,function(body){
      console.log(body.body.content);

      var content = body.body.content;

      var age = content.age;
      var createAt = content.createdAt;
      var firstName = content.firstName;
      var lastName = content.lastName;
      var gender = content.gender;

      $("#age").html(age);
      $("#lastName").html(lastName);
      $("#firstName").html(firstName);
      $("#regDate").html(createAt);
      $("#gender").html(gender);
      $("#headerTitle").html(content.username);
    });


    Util.viewGoals(userId,function(body){



      var content = body.body.content;

      content.forEach(function(e){
        var createDate = e.createdAt.substr(0,10) || 'None';
        var name = e.name || 'None';
        var id = e.id || 'None';
        var numSteps = e.numSteps || 'None';
        var progress = e.progress *100 || 0;

        $("#goalList").append(
          template({name:name,date:createDate,progress:progress,id:id,numSteps:numSteps})
        );

        $("#deleteGoal"+id).html("Details");


        $("#table"+id).click(function(){
          window.location = '/goal/detailPage?id='+id;
        })

        $("#modifyPageButton").fadeOut();
      })
    })



  }

  else {
    Util.getUser(function(body){
      console.log(body.body.content);

      var content = body.body.content;

      var age = content.age;
      var createAt = content.createdAt;
      var firstName = content.firstName;
      var lastName = content.lastName;
      var gender = content.gender;

      $("#age").html(age);
      $("#lastName").html(lastName);
      $("#firstName").html(firstName);
      $("#regDate").html(createAt);
      $("#gender").html(gender);
      $("#headerTitle").html(content.username);
    })

    Util.getGoalList(function(body){
      console.log(body.body.content);


      var content = body.body.content;

      content.forEach(function(e){
        var createDate = e.createdAt.substr(0,10) || 'None';
        var name = e.name || 'None';
        var id = e.id || 'None';
        var numSteps = e.numSteps || 'None';
        var progress = e.progress * 100 || 0;

        $("#goalList").append(
          template({name:name,date:createDate,progress:progress,id:id,numSteps:numSteps})
        )

        $("#table"+id).click(function(){
          window.location = '/goal/detailPage?id='+id;
        })

        $("#deleteGoal"+id).click(false);

        $("#deleteGoal"+id).click(function(){
          Util.deleteGoal(id,function(body){
            if(body.success){
              alert('delete goal succeeded');
              $('#table'+id).remove();
            }
            else{
              alert(body.content);
            }
          })
        })


      })



    });


    $("#modifyPageButton").click(function(){
      console.log("?");
      window.location = '/user/modifyPage';
    });

  }





















})
