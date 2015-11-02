/**
 * Created by mot on 10/31/15.
 */
var steps = steps || []
steps.iterator = 0;

var template = _.template(
  '<div class="boxed" id="step<%=stepNumber%>">' +
  '<span class="stepNum"><%=stepNumber%></span>.&nbsp;<span class="stepName"><%=stepName%></span>&nbsp' +
  '<button id="deleteStep<%=stepNumber%>" value="X" border="1px solid black">X</button>' +
  '<br/><br/>' +
  '<span class="duration"><%=duration%> hours</span>' +
  '</div>');


var repaintSteps = function () {
  $("#goalStepsDisplay").html("");
  for (var i = 0; i < steps.length; i++) {
    var step = steps[i];
    var num = i;
    $("#goalStepsDisplay").append(
      template({stepNumber: num, stepName: step.title, duration: step.duration})
    );
    $("#deleteStep"+num).click(function () {
      //steps.splice(num,1);
      var index = $(this).attr('id').substr(10);
      index = parseInt(index);
      steps.splice(index,1);
      repaintSteps();
    });
  }
};


$(document).ready(function () {
  $('#createGoal').click(function () {
    var name = $('#goalName').val();
    var description = $("#goalText").val();
    if (!name) {
      alert("goal name required");
      return;
    }
    if (!description) {
      alert("description required");
      return;
    }
    if (steps.length == 0) {
      alert("You need to add at least one step");
      return;
    }

    console.log({name:name,description:description,steps:steps});


    //Util.postGoal(name, description, steps, function (body) {
    //  if (body.success) {
    //    alert('posting goal succeeded');
    //  }
    //  else {
    //    alert(body.content);
    //  }
    //})
  });


  $('#addStep').click(function () {
    var name = $('#stepName').val();
    var description = $('#stepText').val();
    var duration = $('#stepDuration').val();
    if (!name) {
      alert("step name required");
      return;
    }
    if (!description) {
      console.log(description);
      alert("description required");
      return;
    }
    console.log(duration);
    if (!duration) {

      alert("duration required");
      return;
    }

    if (!Util.isInt(duration)) {
      alert("duration must be an Integer");
      return;
    }
    steps.push({stepNumber: steps.iterator, title: name, duration: duration, description: description})
    repaintSteps();

  })

});
