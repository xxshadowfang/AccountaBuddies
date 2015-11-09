/**
 * Created by mot on 10/31/15.
 */


$(document).ready(function(){
  $("#updateInformation").click(function(){
      var firstName = $("#firstName").val();
      var lastName = $("#lastName").val();
      var age = $("#age").val();
      var gender;
      if($("#maleRadio").is(":checked")){
          gender = "M";
      }
      else if ($("#femaleRadio").is(":checked")){
          gender = "F";
      }
      else{
          gender = "U";
      }
      var data = {};

      if(age) {
        if (Util.isInt(age)) {
            data.age = age;
        }
      }

      if(firstName){
        data.firstName = firstName;
      }


      if(lastName){
        data.lastName = lastName;
      }

      if(gender){
        data.gender = gender;
      }


      Util.userSetting(data,function(body){
        if(body.success){
          alert("update Succeeded");
          window.location = '/user/profile';
        }
        else{
          alert(body.content);
        }
      })
  })

});
