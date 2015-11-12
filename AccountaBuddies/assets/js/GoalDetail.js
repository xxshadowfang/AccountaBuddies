/**
 * Created by mot on 11/7/15.
 */
var id = goalId;


var commentTemplate = _.template(
  `<tr>
    <td><%=username%> </td>
    <td><%=text%></td>
    <td><%=date%></td>
  </tr>`
)

var template = _.template(
  `<tr>
    <td><%=sequence%></td>
    <td><progress value="<%=progress%>" max="100"></progress></td>
    <td><%=name%></td>
    <td><button id="expandStep<%=stepId%>">Show Details</button></td>
  </tr>
  <tr><td class="stepDetails" id="detail<%=stepId%>" colspan=4>
    <p id="stepDetails">
    <dl>
      <dt>Description</dt>
      <dd><%=description%></dd>
      <dt>Hours Spent</dt>
      <dd><input type="number" id="hour<%=stepId%>"  readonly=true value=<%=hours%>  size=2 />
        <button id="stepAddHours<%=stepId%>">+</button>
        <button id="stepSubHours<%=stepId%>">-</button>
        <button id="finalizeHours<%=stepId%>" class="submit-btn">Submit Modified Hours</button>
      </dd>
    </dl>
    <button id="completeStep<%=stepId%>">Mark step as completed</button>
    </p>
  </td></tr>`

);


$(document).ready(function(){
  $(".stepDetails").hide();

  $("#submitComment").click(function(){
    var text = $("#commentText").val();
    if(text){
      Util.postComment(id,text,function(body){
        if(body.success){
          alert('post comment succeeded');
          location.reload();
        }
        else{
          alert(body.content);
        }
      })
    }
    else{
      alert("please write a text for the comment")
    }

  })

  Util.getGoal(id,function(body){
    console.log(body.body.content);




    var content = body.body.content;
    var date = content.createdAt || 'None';
    var description = content.description || 'None';
    var stepId = content.id || 'None';
    var name = content.name || 'None';
    var steps = content.steps || [];
    var status = content.status || 'None';
    var isOwner = content.isOwner == "true";
    var progress = content.progress != "null"? parseFloat(content.progress)*100 : 0;
    var comments = content.comments || [];
    progress = progress.toFixed(2);


    $("#stepsTable").html(
      `<tr>
        <th>Step Number</th>
        <th>Progress</th>
        <th>Step Name</th>
        <th></th>
      </tr>`
    );


    $("#goalDescriptionBox").html(description);
    $("#headerTitle").html(name+"-progress "+progress+"%");





    if(isOwner){

      $("#deleteGoal").click(function(){
        Util.deleteGoal(id,function(body){
          if(body.success){
            alert("delete succeeded");
            window.location = '/user/profile';
          }
          else{
            alert(body.content);
          }
        })
      })

      $("#completeGoal").click(function(){

      })


    }
    var totalTime = 0;

    comments.forEach(function(e){
      var date = e.createdAt;
      var username = e.username || "No Name";
      var text = e.text || "No description";
      $("#commentsTable").append(commentTemplate({username:username,text:text,date:date}))
    })



    steps.forEach(function(e){
      var amountWorked = e.amountWorked;
      var createdAt = e.createdAt;
      var description = e.description;
      var duration = e.duration;
      duration = parseInt(duration);
      var progress = parseFloat(e.progress)*100;
      var id = e.id;
      var sequence = e.sequence;
      var title = e.title;

      totalTime += parseInt(duration);
      $("#stepsTable").append(template({sequence:sequence,stepId:id,progress:progress,description:description,hours:amountWorked,name:title}));
      $("#detail"+id).hide();
      $("#expandStep"+id).click(function(){
        $("#detail"+id).fadeToggle();
      })


      if(isOwner){
        $("#stepAddHours"+id).click(function(){
          if($('#hour'+id).val() >= duration){
            return;
          }
          $("#hour"+id).val(parseInt($("#hour"+id).val())+1);
        });

        $("#stepSubHours"+id).click(function(){
          if($("#hour"+id).val()<=0){
            return;
          }
          $("#hour"+id).val($("#hour"+id).val()-1);
        });

        $("#finalizeHours"+id).click(function(){
          var hours = $("#hour"+id).val();
          if(hours<0){
            alert("hours spent cannot be smaller than 0!");
          }
          else{
            Util.updateStep(id,hours,function(body){
              if(body.success){
                alert("update step succeed")
                location.reload();
              }
              else{
                alert(body.content);
              }
            })

          }

        })

        $("#completeStep"+id).click(function(){
          Util.updateStep(id,duration,function(body){
            if (body.success){
              alert("complete step succeeded");
              location.reload();
            }
            else{
              alert(body.content);
            }

          })
        })
      }

    })
    $("#totalTime").html(totalTime+" hours");
  })



})
