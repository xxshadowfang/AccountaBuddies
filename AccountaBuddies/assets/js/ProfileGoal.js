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


  $("#modifyPageButton").click(function(){
    console.log("?");
    window.location = '/user/modifyPage';
  });







  Util.getGoalList(function(body){
      console.log(body.body.content);


      var content = body.body.content;

      content.forEach(function(e){
        var createDate = e.createdAt.substr(0,10) || 'None';
        var name = e.name || 'None';
        var id = e.id || 'None';
        var numSteps = e.numSteps || 'None';
        var progress = Math.random()*100;

        $("#goalList").append(
          template({name:name,date:createDate,progress:progress,id:id,numSteps:numSteps})
        )


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

        $("#table"+id).click(function(){
          window.location = '/goal/detailPage?id='+id;
        })
      })



  });




  //
  //$("#goalList").append(
  //  template({name:"goalName1",date:"2015/10/25",progress:"45",id:"2",numSteps:"3"})
  //)
  //$("#goalList").append(
  //  template({name:"goalName2",date:"2015/10/20",progress:"35",id:"3",numSteps:"5"})
  //)
  //$("#goalList").append(
  //  template({name:"goalName3",date:"2015/10/10",progress:"75",id:"4",numSteps:"5"})
  //)
  //
  //
  //$("#deleteGoal1").click(function(){
  //  console.log("1");
  //  $("#table1").remove();
  //})
  //
  //$("#deleteGoal2").click(function(){
  //  console.log("1");
  //  $("#table2").remove();
  //})
  //$("#deleteGoal3").click(function(){
  //  console.log("1");
  //  $("#table3").remove();
  //})
  //$("#deleteGoal4").click(function(){
  //  console.log("1");
  //  $("#table4").remove();
  //})


})
