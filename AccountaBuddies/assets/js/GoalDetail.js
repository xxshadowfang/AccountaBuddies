/**
 * Created by mot on 11/7/15.
 */
var id = goalId;


var template = _.template(
  `<tr>
    <td><%=sequence%></td>
    <td><progress value="<%=progress%>" max="100"></progress></td>
    <td><%=name%></td>
    <td><button id="expandStep<%=stepId%>">Show Details</button></td>
  </tr>
  <tr><td class="stepDetails<%=stepId%>" colspan=4>
    <p id="step1Details">
    <dl>
      <dt>Description</dt>
      <dd><%=description%></dd>
      <dt>Hours Spent</dt>
      <dd><input type="number" readonly=true value=<%=hours%> size=2 />
        <button id="step1AddHours<%=stepId%>">+</button>
        <button id="step1SubHours<%stepId%>">-</button>
      </dd>
    </dl>
    <button id="completeStep<%stepId%>">Mark step as completed</button>
    </p>
  </td></tr>`



);


$(document).ready(function(){
  //$(".stepDetails").hide();

  Util.getGoal(id,function(body){
    console.log(body.body.content);

    var content = body.body.content;
    var date = content.createdAt || 'None';
    var description = content.description || 'None';
    var stepId = content.id || 'None';
    var name = content.name || 'None';
    var steps = content.steps || [];
    var status = content.status || 'None';


    steps.forEach(function(e){
      var amountWorked = e.amountWorked;
      var createdAt = e.createdAt;
      var description = e.description;
      var duration = e.duration;
      var progress = e.progress;
      var id = e.id;


    })
  })



})
