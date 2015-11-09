/**
 * Created by mot on 11/7/15.
 */
var id = goalId;

$(document).ready(function(){
  //$(".stepDetails").hide();

  Util.getGoal(id,function(body){
    console.log(body);
  })



})
