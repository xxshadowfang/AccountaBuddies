/**
 * Created by mot on 10/18/15.
 */
$(document).ready(function () {


  if($.cookie('cookie')){
    $('#login-link').html("用户中心");
  }
  else{
    $('#login-link').html("登陆");
  }

  $("#all-cto-link").click(function () {
    var language = '';
    var data = {language:JSON.stringify(['5'])};
    data.specialities = JSON.stringify(['1']);
    console.log(JSON.parse(data.language));
    var params = {
      pageNo: 1,
      pageSize: 5

    };



    Util.filerCTO(params, data, function (body) {
      console.log(body.content);
    })

  });


  $("#login-link").click(function(){
      if($.cookie('cookie')){
        console.log("user center");
      }
      else{
        console.log("login-form");
      }
  });


  $("#personal-plan-link").click(function () {
      console.log("personal-plan-clicked");
  });

  $("#become-cto-link").click(function(){
      console.log("become-cto-clicked");
  });

  $("#homePage").click(function(){
    window.location = '/';
  })


});
